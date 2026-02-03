from django.contrib import admin
from .models import Categoria, Producto, VarianteColchon, Pedido, ItemPedido, Banner, ProductoImagen, LineaProducto

# --- INLINES: Para editar todo desde la ficha del Producto ---

class ProductoImagenInline(admin.TabularInline):
    """Permite subir múltiples fotos en la misma pantalla del producto"""
    model = ProductoImagen
    extra = 1 # Muestra 1 espacio vacío listo para subir
    fields = ('imagen', 'orden', 'vista_previa')
    readonly_fields = ('vista_previa',)

    def vista_previa(self, obj):
        from django.utils.html import mark_safe
        if obj.imagen:
            return mark_safe(f'<img src="{obj.imagen.url}" width="60" height="60" style="object-fit:cover; border-radius:4px;" />')
        return "-"

class VarianteColchonInline(admin.TabularInline):
    """Permite crear las medidas (80x190, 140x190) y sus detalles aquí mismo"""
    model = VarianteColchon
    extra = 0
    # Aquí agregamos 'descripcion_cubierta' y 'altura' para que se vean en la tabla
    fields = ('medida', 'altura', 'descripcion_cubierta', 'precio', 'stock', 'sku')

# --- ADMINS PRINCIPALES ---

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    # Ya no usamos Summernote, volvemos al estándar
    list_display = ('nombre', 'precio', 'categoria', 'stock', 'disponible', 'imagen_preview')
    list_editable = ('precio', 'stock', 'disponible')
    search_fields = ('nombre',)
    list_filter = ('categoria', 'disponible')
    prepopulated_fields = {"slug": ("nombre",)}
    
    # ESTO ES LO IMPORTANTE: Agrega los bloques de edición
    inlines = [ProductoImagenInline, VarianteColchonInline] 
    
    def imagen_preview(self, obj):
        from django.utils.html import mark_safe
        if obj.imagen:
            return mark_safe(f'<img src="{obj.imagen.url}" width="50" height="50" style="object-fit:cover; border-radius:4px;" />')
        return "No img"

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'slug')
    prepopulated_fields = {"slug": ("nombre",)}

class ItemPedidoInline(admin.TabularInline):
    model = ItemPedido
    extra = 0
    readonly_fields = ('producto_linea', 'medida_altura', 'cantidad', 'precio_unitario')

@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre_completo', 'email', 'total_neto', 'estado', 'fecha_creacion')
    list_filter = ('estado', 'fecha_creacion')
    search_fields = ('nombre_completo', 'email', 'id')
    inlines = [ItemPedidoInline]
    readonly_fields = ('total_neto', 'merchant_order_id', 'payment_id')

@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'orden', 'activo', 'vista_previa')
    list_editable = ('orden', 'activo')
    def vista_previa(self, obj):
        from django.utils.html import mark_safe
        if obj.imagen:
            return mark_safe(f'<img src="{obj.imagen.url}" width="100" style="border-radius:4px;" />')
        return "-"
    
@admin.register(LineaProducto)
class LineaProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'slug', 'orden', 'activa')
    prepopulated_fields = {'slug': ('nombre',)} # Auto-rellena el slug al escribir el nombre