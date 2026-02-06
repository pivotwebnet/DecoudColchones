from rest_framework import serializers
from .models import Categoria, Producto, VarianteColchon, Pedido, ItemPedido, Banner, ProductoImagen, LineaProducto

# --- 1. SERIALIZERS AUXILIARES (Tus originales) ---

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
        fields = ['id', 'medida', 'altura', 'descripcion_cubierta', 'precio', 'stock', 'sku']

# --- 2. SERIALIZER DE PRODUCTO (Tu original) ---

class ProductoSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer(read_only=True)
    variantes = VarianteColchonSerializer(many=True, read_only=True)
    imagenes_extra = ProductoImagenSerializer(many=True, read_only=True)

    class Meta:
        model = Producto
        fields = [
            'id', 'nombre', 'slug', 'descripcion_base', 
            'imagen', 'imagenes_extra',
            'precio', 'precio_anterior', 
            'densidad', 'peso_max_min', 'peso_max_max', 'garantia',
            'categoria', 'variantes', 
            'disponible', 'cuotas'
        ]

# --- 3. SERIALIZERS DE SOPORTE (Banner y Linea) ---

class BannerSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Banner
        fields = ['id', 'imagen', 'titulo', 'orden']

class LineaProductoSerializer(serializers.ModelSerializer):
    imagen_url = serializers.SerializerMethodField()

    class Meta:
        model = LineaProducto
        fields = ['id', 'nombre', 'slug', 'imagen_url']

    def get_imagen_url(self, obj):
        if obj.imagen:
            return obj.imagen.url
        return None

# --- 4. LOGICA DE PEDIDOS (NUEVO Y POTENTE) ---

# Serializer para validar los datos del cliente que vienen del Frontend
class UsuarioDataSerializer(serializers.Serializer):
    nombre = serializers.CharField()
    apellido = serializers.CharField()
    dni = serializers.CharField()
    telefono = serializers.CharField()
    direccion = serializers.CharField()
    ciudad = serializers.CharField()
    provincia = serializers.CharField()

# Serializer para validar cada item del carrito
class ItemPedidoInputSerializer(serializers.Serializer):
    producto_id = serializers.IntegerField()
    cantidad = serializers.IntegerField()

# Serializer para MOSTRAR pedidos (Lectura)
class ItemPedidoSerializer(serializers.ModelSerializer):
    class Meta: 
        model = ItemPedido
        fields = '__all__'

class PedidoSerializer(serializers.ModelSerializer):
    items = ItemPedidoSerializer(many=True, read_only=True)
    class Meta: 
        model = Pedido
        fields = '__all__'

# Serializer para CREAR pedidos (Escritura - Checkout)
class PedidoCreateSerializer(serializers.ModelSerializer):
    # Definimos la estructura compleja que envía el Frontend
    usuario_data = UsuarioDataSerializer(write_only=True)
    items = ItemPedidoInputSerializer(many=True, write_only=True)
    metodo_pago = serializers.CharField(write_only=True, required=False)
    
    # Campo total (asegúrate que se llame 'total' o 'total_neto' según tu modelo)
    total = serializers.DecimalField(max_digits=10, decimal_places=2, write_only=True)

    class Meta: 
        model = Pedido
        fields = ['usuario_data', 'items', 'total', 'metodo_pago'] 

def create(self, validated_data):
        # 1. Extraer datos
        usuario_data = validated_data.pop('usuario_data')
        items_data = validated_data.pop('items')
        metodo_pago = validated_data.pop('metodo_pago', 'No especificado')
        total_importe = validated_data.pop('total')

        # 2. Crear el Pedido CON LOS DATOS SEPARADOS
        pedido = Pedido.objects.create(
            nombre_cliente=usuario_data['nombre'], 
            apellido_cliente=usuario_data['apellido'],
            dni_cliente=usuario_data['dni'],
            telefono_contacto=usuario_data['telefono'],
            
            # --- AQUÍ ESTÁ LA SEPARACIÓN ---
            direccion_envio=usuario_data['direccion'], # Solo calle y altura
            ciudad=usuario_data['ciudad'],             # Columna propia
            provincia=usuario_data['provincia'],       # Columna propia
            # -------------------------------
            
            total_neto=total_importe,
            estado='pendiente', 
            metodo_pago=metodo_pago 
        )

        # 3. Crear los Items (Esto sigue igual)
        for item in items_data:
            try:
                producto = Producto.objects.get(id=item['producto_id'])
                ItemPedido.objects.create(
                    pedido=pedido,
                    producto=producto, 
                    cantidad=item['cantidad'],
                    precio_unitario=producto.precio 
                )
            except Producto.DoesNotExist:
                pass 

        return pedido