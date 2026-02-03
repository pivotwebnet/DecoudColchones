from rest_framework import serializers
from .models import Categoria, Producto, VarianteColchon, Pedido, ItemPedido, Banner

# --- 1. Serializers de Catálogo ---
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class VarianteColchonSerializer(serializers.ModelSerializer):
    class Meta:
        model = VarianteColchon
        fields = ['id', 'medida', 'altura', 'precio', 'stock', 'sku']

class ProductoSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer(read_only=True)
    variantes = VarianteColchonSerializer(many=True, read_only=True)

    class Meta:
        model = Producto
        fields = '__all__'

# --- 2. Serializers de Pedidos ---
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

class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = ['id', 'imagen', 'titulo', 'orden']