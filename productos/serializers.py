from rest_framework import serializers
from .models import Categoria, Producto, Pedido, ItemPedido, Banner, ProductoImagen, LineaProducto

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'slug', 'imagen']

class ProductoImagenSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductoImagen
        fields = ['id', 'imagen', 'orden']

class LineaProductoSerializer(serializers.ModelSerializer):
    imagen_url = serializers.SerializerMethodField()
    class Meta:
        model = LineaProducto
        fields = ['id', 'nombre', 'slug', 'imagen_url']
    def get_imagen_url(self, obj):
        return obj.imagen.url if obj.imagen else None

class ProductoSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer(read_only=True)
    linea = LineaProductoSerializer(read_only=True)
    imagenes_extra = ProductoImagenSerializer(many=True, read_only=True)
    medida_display = serializers.CharField(source='get_medida_display', read_only=True)

    class Meta:
        model = Producto
        fields = [
            'id', 'nombre', 'slug', 'descripcion_base',
            'imagen', 'imagenes_extra',
            'precio', 'precio_anterior',
            'densidad', 'altura', 'medida', 'medida_display', 'tiene_top_pillow',
            'peso_max_min', 'peso_max_max', 'garantia',
            'categoria', 'linea', 'stock',
            'disponible', 'cuotas', 'destacado'
        ]

class BannerSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Banner
        fields = ['id', 'imagen', 'titulo', 'orden']

class ItemPedidoSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer(read_only=True)
    class Meta: 
        model = ItemPedido
        fields = '__all__'

class PedidoSerializer(serializers.ModelSerializer):
    items = ItemPedidoSerializer(many=True, read_only=True)
    class Meta: 
        model = Pedido
        fields = '__all__'

# SERIALIZERS PARA PEDIDOS
class UsuarioDataSerializer(serializers.Serializer):
    nombre = serializers.CharField()
    apellido = serializers.CharField()
    dni = serializers.CharField()
    telefono = serializers.CharField()
    direccion = serializers.CharField()
    ciudad = serializers.CharField()
    provincia = serializers.CharField()

class ItemPedidoInputSerializer(serializers.Serializer):
    producto_id = serializers.IntegerField()
    cantidad = serializers.IntegerField()

class PedidoCreateSerializer(serializers.ModelSerializer):
    usuario_data = UsuarioDataSerializer(write_only=True)
    items = ItemPedidoInputSerializer(many=True, write_only=True)
    total = serializers.DecimalField(max_digits=10, decimal_places=2, write_only=True)

    class Meta: 
        model = Pedido
        fields = ['usuario_data', 'items', 'total', 'metodo_pago'] 

    def create(self, validated_data):
        u_data = validated_data.pop('usuario_data')
        i_data = validated_data.pop('items')
        total = validated_data.pop('total')

        pedido = Pedido.objects.create(
            nombre_cliente=u_data['nombre'], 
            apellido_cliente=u_data['apellido'],
            dni_cliente=u_data['dni'],
            telefono_contacto=u_data['telefono'],
            direccion_envio=u_data['direccion'],
            ciudad=u_data['ciudad'],
            provincia=u_data['provincia'],
            total_neto=total,
            metodo_pago=validated_data.get('metodo_pago', 'Mercado Pago')
        )

        for item in i_data:
            producto = Producto.objects.get(id=item['producto_id'])
            ItemPedido.objects.create(
                pedido=pedido,
                producto=producto, 
                cantidad=item['cantidad'],
                precio_unitario=producto.precio 
            )
        return pedido
     


    