from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Q

from .models import Categoria, Producto, Pedido , Banner
from .serializers import CategoriaSerializer, ProductoSerializer, PedidoSerializer, PedidoCreateSerializer, BannerSerializer

# --- 1. Productos (ACCESO TOTAL - IGNORA TOKENS) ---
class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.filter(disponible=True).select_related('categoria').prefetch_related('variantes')
    serializer_class = ProductoSerializer
    lookup_field = 'slug'
    authentication_classes = [] # <--- ESTO ES LA CLAVE: Ignora el token del frontend
    permission_classes = [AllowAny] 

# --- 2. Categorías (ACCESO TOTAL - IGNORA TOKENS) ---
class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    lookup_field = 'slug'
    authentication_classes = [] # <--- ESTO ES LA CLAVE
    permission_classes = [AllowAny] 

# --- 3. Buscador (ACCESO TOTAL) ---
@api_view(['GET'])
@authentication_classes([]) # <--- ESTO ES LA CLAVE
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
    # Aquí sí permitimos autenticación para guardar el usuario si existe
    permission_classes = [IsAuthenticated] 

    def post(self, request):
        serializer = PedidoCreateSerializer(data=request.data)
        if serializer.is_valid():
            pedido = serializer.save()
            return Response(
                {"id": pedido.id, "total": pedido.total_neto, "estado": pedido.estado}, 
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --- 5. ViewSet de Pedidos (Historial) ---
class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    permission_classes = [IsAuthenticated]

class BannerViewSet(viewsets.ModelViewSet):
    queryset = Banner.objects.filter(activo=True).order_by('orden')
    serializer_class = BannerSerializer
    authentication_classes = [] # ¡Crucial! Ignora tokens
    permission_classes = [AllowAny] # ¡Crucial! Público