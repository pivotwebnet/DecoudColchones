# productos/admin.py

from django.contrib import admin
from .models import Categoria, Producto, VarianteColchon, Pedido, ItemPedido

# --- 1. Inline para Variantes de Colchón ---

class VarianteColchonInline(admin.TabularInline):
    """Permite añadir/editar variantes directamente en la página del Producto."""
    model = VarianteColchon
    extra = 1 # Muestra un campo vacío adicional para facilitar la carga
    fields = ['altura', 'medida', 'precio', 'stock', 'sku']

# --- 2. Admin para Producto (Línea de Colchón) ---
class ItemPedidoInline(admin.TabularInline):
    model = ItemPedido
    extra = 0 # No mostrar filas vacías extra
    readonly_fields = ['producto_linea', 'medida_altura', 'cantidad', 'precio_unitario'] # Para que no se modifiquen por error

@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    # Columnas que verás en la lista principal
    list_display = ['id', 'usuario', 'nombre_completo', 'fecha_creacion', 'total_neto', 'estado']
    
    # Filtros laterales
    list_filter = ['estado', 'fecha_creacion']
    
    # Buscador (puedes buscar por nombre o ID)
    search_fields = ['nombre_completo', 'email', 'id']
    
    # Agregamos los items dentro del pedido
    inlines = [ItemPedidoInline]
    
    # Ordenar por el más reciente
    ordering = ['-fecha_creacion']
@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    # Campos que se muestran en la lista de productos
    list_display = (
        'nombre', 
        'categoria', 
        'densidad', 
        'peso_max_max', 
        'stock_total', # Este campo lo crearemos en el método
        'disponible',
        'creado_en'
    )
    # Campos por los que se puede filtrar la lista
    list_filter = ('disponible', 'categoria', 'densidad')
    # Campos por los que se puede buscar
    search_fields = ('nombre', 'descripcion_base', 'sku')
    # Campos que aparecen en la página de edición
    prepopulated_fields = {'slug': ('nombre',)}
    
    # El corazón de la gestión de variantes: el Inline
    inlines = [VarianteColchonInline] 

    # Agrupación de campos en la página de edición para mejor organización
    fieldsets = (
        ('Información Básica', {
            'fields': ('nombre', 'slug', 'categoria', 'disponible'),
        }),
        ('Especificaciones de Línea', {
            'fields': ('descripcion_base', 'densidad', 'peso_max_min', 'peso_max_max'),
            'description': 'Estos datos se aplican a toda la línea de colchón (ej: GLACIAR).'
        }),
    )

    # Método personalizado para mostrar el stock total en la lista
    def stock_total(self, obj):
        return sum(v.stock for v in obj.variantes.all())
    
    # Asigna un nombre más amigable al encabezado
    stock_total.short_description = "Stock Total"

# --- 3. Admin para Categoría ---

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'slug')
    prepopulated_fields = {'slug': ('nombre',)}
    search_fields = ('nombre',)

# NOTA: No es necesario registrar VarianteColchon por separado ya que se gestiona vía Inline.your models here.
