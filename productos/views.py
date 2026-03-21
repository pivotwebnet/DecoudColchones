from rest_framework import viewsets, status, generics, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Q
from django.http import HttpResponse
from django.contrib.auth.models import User
from django_filters.rest_framework import DjangoFilterBackend
from .models import Categoria, Producto, Pedido , Banner, LineaProducto
from .serializers import CategoriaSerializer, ProductoSerializer, PedidoSerializer, PedidoCreateSerializer, BannerSerializer, LineaProductoSerializer
from .filters import ProductoFilter
import mercadopago
from django.conf import settings

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

# --- 4. Crear Pedido (Checkout) ---
class PedidoCreateView(APIView):
    permission_classes = [AllowAny] 

    def post(self, request):
        serializer = PedidoCreateSerializer(data=request.data)
        if serializer.is_valid():
            # Vinculamos usuario si está logueado
            usuario = request.user if request.user.is_authenticated else None
            pedido = serializer.save(usuario=usuario)
            
            metodo_pago = request.data.get('metodo_pago')
            init_point = None
            
            if metodo_pago == 'Mercado Pago':
                sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)
                preference_data = {
                    "items": [{"title": f"Pedido #{pedido.id}", "quantity": 1, "unit_price": float(pedido.total_neto), "currency_id": "ARS"}],
                    "back_urls": {
                        "success": f"{settings.FRONTEND_URL}/confirmacion-pago?status=success&pedido_id={pedido.id}",
                        "failure": f"{settings.FRONTEND_URL}/confirmacion-pago?status=failure&pedido_id={pedido.id}",
                        "pending": f"{settings.FRONTEND_URL}/confirmacion-pago?status=pending&pedido_id={pedido.id}"
                    },
                    "auto_return": "approved",
                    "external_reference": str(pedido.id),
                }
                preference_response = sdk.preference().create(preference_data)
                if preference_response["status"] == 201:
                    init_point = preference_response["response"]["init_point"]
                else:
                    return Response({"error": "Error MP"}, status=status.HTTP_400_BAD_REQUEST)

            return Response({"id": pedido.id, "total": pedido.total_neto, "init_point": init_point}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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