from rest_framework import serializers
from .models import Categoria, Producto, VarianteColchon, Pedido, ItemPedido, Banner, ProductoImagen, LineaProducto

# --- Serializers Auxiliares ---

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'slug', 'imagen']

class ProductoImagenSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductoImagen
        fields = ['id', 'imagen', 'orden']

class VarianteColchonSerializer(serializers.ModelSerializer):
    class Meta:
        model = VarianteColchon
        # Agregamos los campos técnicos que pediste
        fields = ['id', 'medida', 'altura', 'descripcion_cubierta', 'precio', 'stock', 'sku']

# --- Serializer Principal ---

class ProductoSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer(read_only=True)
    variantes = VarianteColchonSerializer(many=True, read_only=True)
    imagenes_extra = ProductoImagenSerializer(many=True, read_only=True)

    class Meta:
        model = Producto
        fields = [
            'id', 'nombre', 'slug', 'descripcion_base', 
            'imagen', 'imagenes_extra', # <--- Las fotos
            'precio', 'precio_anterior', 
            'densidad', 'peso_max_min', 'peso_max_max', 'garantia',
            'categoria', 'variantes', 
            'disponible', 'cuotas'
        ]

# --- Serializers de Pedidos y Banner (Estándar) ---
class BannerSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Banner
        fields = ['id', 'imagen', 'titulo', 'orden']

class ItemPedidoSerializer(serializers.ModelSerializer):
    class Meta: 
        model = ItemPedido
        fields = ['producto_linea', 'medida_altura', 'cantidad', 'precio_unitario']

class PedidoSerializer(serializers.ModelSerializer):
    items = ItemPedidoSerializer(many=True, read_only=True)
    class Meta: 
        model = Pedido
        fields = '__all__'

class PedidoCreateSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Pedido
        fields = '__all__'
        
class LineaProductoSerializer(serializers.ModelSerializer):
    # Convertimos la imagen a URL completa
    imagen_url = serializers.SerializerMethodField()

    class Meta:
        model = LineaProducto
        fields = ['id', 'nombre', 'slug', 'imagen_url']

    def get_imagen_url(self, obj):
        if obj.imagen:
            return obj.imagen.url
        return None