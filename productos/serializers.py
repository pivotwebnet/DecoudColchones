# productos/serializers.py (VERSIÓN CORREGIDA Y COMPLETA)

from rest_framework import serializers
from .models import Categoria, Producto, VarianteColchon, Pedido, ItemPedido
from django.db import transaction

# --- 1. Serializer para la Variante (La unidad de SKU) ---

class VarianteColchonSerializer(serializers.ModelSerializer):
    """Serializa los datos de una variante específica (medida, altura, precio, stock)."""
    class Meta:
        model = VarianteColchon
        fields = ['id', 'altura', 'medida', 'precio', 'stock', 'sku']

# --- 2. Serializer para la Línea de Producto (Incluye Variantes Anidadas) ---

class ProductoSerializer(serializers.ModelSerializer):
    """Serializa la línea de colchón, anidando todas sus variantes."""
    # Anidación: Incluye la lista de variantes dentro del producto
    variantes = VarianteColchonSerializer(many=True, read_only=True) 
    
    # Campo personalizado para mostrar el nombre de la categoría en lugar de la ID
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)

    class Meta:
        model = Producto
        fields = [
            'id', 'nombre', 'slug', 'categoria', 'categoria_nombre', 'descripcion_base', 
            'densidad', 'peso_max_min', 'peso_max_max', 'disponible', 'variantes'
        ]

# --- 3. Serializer para Listados de Categorías ---

class CategoriaSerializer(serializers.ModelSerializer):
    """Serializa la información básica de la Categoría."""
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'slug']

# --- 4. Serializer para Ítems al CREAR Pedido (Solo para Recepción de Datos) ---

class ItemPedidoCreateSerializer(serializers.Serializer):
    """Define la estructura de datos que React enviará para cada ítem del carrito."""
    variant_id = serializers.IntegerField(help_text="ID de la VarianteColchon que se compró.")
    quantity = serializers.IntegerField(min_value=1)

# --- 5. Serializer Principal para Crear Pedido (Lógica de Checkout) ---

class PedidoCreateSerializer(serializers.ModelSerializer):
    """Serializador para recibir los datos de Checkout y procesar el pedido."""
    items = ItemPedidoCreateSerializer(many=True, write_only=True) # Lista de ítems del carrito (solo se usa en la escritura/POST)

    class Meta:
        model = Pedido
        # Campos que React enviará en la solicitud POST
        fields = ['nombre_completo', 'email', 'direccion_envio', 'ciudad', 'items'] 
        
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Usamos transacción para asegurar la consistencia de la base de datos
        with transaction.atomic():
            pedido = Pedido.objects.create(**validated_data)
            total_neto = 0
            
            for item_data in items_data:
                variant_id = item_data['variant_id']
                quantity = item_data['quantity']
                
                try:
                    variante = VarianteColchon.objects.select_for_update().get(pk=variant_id)
                except VarianteColchon.DoesNotExist:
                    raise serializers.ValidationError({"detail": "Error: Variante de producto no encontrada."})

                if variante.stock < quantity:
                    raise serializers.ValidationError({"detail": f"Stock insuficiente para {variante.producto_linea.nombre} ({variante.medida})."})

                # Crear el Item de Pedido (Snapshot)
                ItemPedido.objects.create(
                    pedido=pedido,
                    producto_linea=variante.producto_linea.nombre,
                    medida_altura=f"{variante.medida} - {variante.altura}",
                    precio_unitario=variante.precio,
                    cantidad=quantity,
                    variante_original=variante
                )
                
                # Actualizar Stock
                variante.stock -= quantity
                variante.save()
                total_neto += variante.precio * quantity

            # Finalizar Pedido
            pedido.total_neto = total_neto
            pedido.estado = 'PAGADO' # Asumimos integración de pago exitosa por simplicidad
            pedido.save()
            
            return pedido