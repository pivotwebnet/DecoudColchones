# productos/views.py (VERSION CORREGIDA PARA VARIANTES Y PEDIDOS)

from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db import transaction

# Importar solo los modelos que existen actualmente
from .models import Categoria, Producto, VarianteColchon, Pedido 
# Importar solo los serializers correctos
from .serializers import CategoriaSerializer, ProductoSerializer, PedidoCreateSerializer 

# --- 1. ViewSet para Líneas de Colchones (Producto) ---

class ProductoViewSet(viewsets.ModelViewSet):
    """
    Permite el CRUD de líneas de colchón y expone la lista de productos
    con sus variantes anidadas.
    """
    # Consulta optimizada: filtramos solo disponibles y precargamos categoría y variantes
    queryset = Producto.objects.filter(disponible=True).select_related('categoria').prefetch_related('variantes')
    serializer_class = ProductoSerializer
    lookup_field = 'slug' # Permite buscar productos por /api/colchones/{slug}/

    # NOTA: Puedes añadir filtros por densidad o categoría aquí usando django-filter

# --- 2. ViewSet para Categorías ---

class CategoriaViewSet(viewsets.ModelViewSet):
    """
    Permite listar y ver categorías (ej: Marcas o Tipos de Material).
    """
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    lookup_field = 'slug'

# --- 3. Vista para Crear Pedidos (Checkout POST) ---

class PedidoCreateView(APIView):
    """
    Endpoint para que React envíe el carrito y cree un nuevo Pedido en la base de datos.
    """
    def post(self, request, format=None):
        serializer = PedidoCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            # La lógica de creación del pedido, validación de stock y actualización
            # de totales se maneja dentro del método create del Serializer.
            try:
                pedido = serializer.save()
                
                # Devolver información de confirmación al frontend
                return Response(
                    {"id": pedido.id, "total": pedido.total_neto, "estado": pedido.estado}, 
                    status=status.HTTP_201_CREATED
                )
            except Exception as e:
                 # Capturar errores específicos del Serializer (ej: stock insuficiente)
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Devolver errores de validación del formulario de checkout (ej: email no válido)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    # Usamos el serializer normal para listar, pero el de creación para escribir
    serializer_class = PedidoCreateSerializer 
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        """
        Recibe el JSON del frontend, valida y crea el pedido.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            pedido = serializer.save()
            return Response({
                "id": pedido.id,
                "status": "created",
                "message": "Pedido guardado correctamente"
            }, status=status.HTTP_201_CREATED)
        else:
            print("Errores de validación:", serializer.errors) # Para ver en la consola negra
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)