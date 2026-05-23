from rest_framework import viewsets, status, generics, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Q, F
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django_filters.rest_framework import DjangoFilterBackend
from .models import Categoria, Producto, Pedido, Banner, LineaProducto
from .serializers import CategoriaSerializer, ProductoSerializer, PedidoSerializer, PedidoCreateSerializer, BannerSerializer, LineaProductoSerializer
from .filters import ProductoFilter
from django.conf import settings
import requests
import json
import logging

logger = logging.getLogger(__name__)

MOBBEX_CHECKOUT_URL = 'https://api.mobbex.com/p/checkout'

# --- 1. Productos ---
class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.filter(disponible=True).select_related('categoria', 'linea')
    serializer_class = ProductoSerializer
    lookup_field = 'slug'
    authentication_classes = []
    permission_classes = [AllowAny]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductoFilter
    search_fields = ['nombre', 'descripcion_base']
    ordering_fields = ['precio', 'creado_en', 'nombre']
    ordering = ['-creado_en']

    def get_queryset(self):
        qs = Producto.objects.filter(disponible=True).select_related('categoria', 'linea')
        oferta = self.request.query_params.get('oferta', '').lower()
        if oferta in ('true', '1'):
            qs = qs.filter(
                Q(destacado=True) |
                Q(precio_anterior__isnull=False, precio__lt=F('precio_anterior'))
            )
        return qs

# --- 2. Categorías ---
class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    lookup_field = 'slug'
    authentication_classes = []
    permission_classes = [AllowAny] 

# --- 3. Buscador ---
@api_view(['GET'])
@authentication_classes([]) 
@permission_classes([AllowAny]) 
def search_products(request):
    query = request.GET.get('q', '') 
    if len(query) > 0:
        results = Producto.objects.filter(
            Q(nombre__icontains=query) | Q(descripcion_base__icontains=query)
        )[:5]
        serializer = ProductoSerializer(results, many=True)
        return Response(serializer.data)
    return Response([])

# --- Helper: headers Mobbex ---
def _mobbex_headers():
    return {
        'x-api-key':      settings.MOBBEX_API_KEY,
        'x-access-token': settings.MOBBEX_ACCESS_TOKEN,
        'content-type':   'application/json',
        'cache-control':  'no-cache',
    }


# --- 4. Crear Pedido (Checkout) ---
class PedidoCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PedidoCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        usuario = request.user if request.user.is_authenticated else None
        pedido = serializer.save(usuario=usuario)

        metodo_pago = request.data.get('metodo_pago')
        checkout_url = None

        if metodo_pago == 'Mobbex':
            payload = {
                'total':       float(pedido.total_neto),
                'currency':    'ARS',
                'reference':   f'DECOUD-{pedido.id}',
                'description': f'Pedido #{pedido.id} - Decoud Colchones',
                'items': [
                    {
                        'type':        'product',
                        'code':        str(item.producto.id),
                        'description': item.producto.nombre,
                        'amount':      float(item.precio_unitario),
                        'quantity':    item.cantidad,
                        'unit':        'unit',
                    }
                    for item in pedido.items.select_related('producto').all()
                ],
                'customer': {
                    'name':           f'{pedido.nombre_cliente} {pedido.apellido_cliente}',
                    'phone':          pedido.telefono_contacto,
                    'identification': pedido.dni_cliente,
                    'uid':            pedido.dni_cliente,
                },
                # return_url: Mobbex redirige aquí al terminar (agrega ?status=... automáticamente)
                'return_url': f'{settings.FRONTEND_URL}/confirmacion-pago?pedido_id={pedido.id}',
                # webhook: Mobbex llama a este endpoint cuando el pago cambia de estado
                'webhook': f'{settings.BACKEND_URL}/api/mobbex/webhook/',
                'test': settings.MOBBEX_TEST,
            }

            try:
                resp = requests.post(
                    MOBBEX_CHECKOUT_URL,
                    headers=_mobbex_headers(),
                    json=payload,
                    timeout=15,
                )
                resp.raise_for_status()
                data = resp.json()

                if data.get('result'):
                    checkout_url = data['data']['url']
                    # Guardamos el ID de sesión Mobbex en el estado del pedido
                    pedido.estado = f'mobbex:{data["data"]["id"]}'
                    pedido.save(update_fields=['estado'])
                else:
                    logger.error('Mobbex checkout error: %s', data)
                    return Response({'error': 'No se pudo crear el checkout de Mobbex.'}, status=status.HTTP_502_BAD_GATEWAY)

            except requests.RequestException as e:
                logger.error('Mobbex request failed: %s', e)
                return Response({'error': 'Error de conexión con Mobbex.'}, status=status.HTTP_502_BAD_GATEWAY)

        return Response(
            {'id': pedido.id, 'total': pedido.total_neto, 'checkout_url': checkout_url},
            status=status.HTTP_201_CREATED,
        )


# --- 4b. Webhook Mobbex (notificaciones de pago) ---
@method_decorator(csrf_exempt, name='dispatch')
class MobbexWebhookView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        try:
            body = json.loads(request.body)
        except (json.JSONDecodeError, AttributeError):
            return JsonResponse({'error': 'invalid json'}, status=400)

        payment = body.get('data', {}).get('payment', {})
        reference   = payment.get('reference', '')   # "DECOUD-123"
        status_code = str(payment.get('status', {}).get('code', ''))

        if not reference.startswith('DECOUD-'):
            return JsonResponse({'ok': True})

        pedido_id = reference.replace('DECOUD-', '')
        try:
            pedido = Pedido.objects.get(pk=pedido_id)
        except Pedido.DoesNotExist:
            logger.warning('Webhook Mobbex: pedido %s no encontrado', pedido_id)
            return JsonResponse({'ok': True})

        # Mapeamos el código de estado de Mobbex a nuestro campo `estado`
        if status_code == '200':
            pedido.estado = 'pagado'
        elif status_code.startswith('4'):
            pedido.estado = 'rechazado'
        elif status_code.startswith('3'):
            pedido.estado = 'pendiente'
        else:
            pedido.estado = f'mobbex_status:{status_code}'

        pedido.save(update_fields=['estado'])
        logger.info('Webhook Mobbex: pedido %s → %s', pedido_id, pedido.estado)
        return JsonResponse({'ok': True})

# --- 5. ViewSet de Pedidos (Historial personal) ---
class PedidoViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PedidoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Pedido.objects.filter(usuario=self.request.user).prefetch_related('items__producto')

class BannerViewSet(viewsets.ModelViewSet):
    queryset = Banner.objects.filter(activo=True).order_by('orden')
    serializer_class = BannerSerializer
    authentication_classes = [] 
    permission_classes = [AllowAny] 
    
class LineaProductoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LineaProducto.objects.filter(activa=True).order_by('orden')
    serializer_class = LineaProductoSerializer
    authentication_classes = []
    permission_classes = [AllowAny]