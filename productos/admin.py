from django.contrib import admin
from .models import Categoria, Producto, VarianteColchon, Pedido, ItemPedido, Banner, ProductoImagen, LineaProducto

# --- INLINES: Para editar todo desde la ficha del Producto ---

class ProductoImagenInline(admin.TabularInline):
    """Permite subir múltiples fotos en la misma pantalla del producto"""
    model = ProductoImagen
    extra = 1 
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
    fields = ('medida', 'altura', 'descripcion_cubierta', 'precio', 'stock', 'sku')

# --- ADMINS PRINCIPALES ---

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'precio', 'categoria', 'stock', 'disponible', 'imagen_preview')
    list_editable = ('precio', 'stock', 'disponible')
    search_fields = ('nombre',)
    list_filter = ('categoria', 'disponible')
    prepopulated_fields = {"slug": ("nombre",)}
    
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

# --- CORRECCIÓN AQUÍ: ItemPedidoInline ---
class ItemPedidoInline(admin.TabularInline):
    model = ItemPedido
    extra = 0
    # Ajustado para ver el producto y precio, quitamos campos viejos
    fields = ('producto', 'cantidad', 'precio_unitario')
    readonly_fields = ('producto', 'cantidad', 'precio_unitario')

# --- CORRECCIÓN AQUÍ: PedidoAdmin ---
@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    # Agregamos 'ciudad' y 'provincia' a las columnas visibles
    list_display = ('id', 'get_nombre_completo', 'ciudad', 'telefono_contacto', 'total_neto', 'estado', 'fecha_creacion')
    
    # --- FILTROS POTENTES ---
    # Esto creará una barra lateral donde podrás hacer clic en "Rafaela", "Santa Fe", etc.
    list_filter = ('ciudad', 'provincia', 'estado', 'metodo_pago', 'fecha_creacion')
    
    search_fields = ('nombre_cliente', 'apellido_cliente', 'dni_cliente', 'ciudad')
    
    inlines = [ItemPedidoInline]
    readonly_fields = ('total_neto', 'fecha_creacion')

    def get_nombre_completo(self, obj):
        return f"{obj.nombre_cliente} {obj.apellido_cliente}"
    get_nombre_completo.short_description = 'Cliente'

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
    prepopulated_fields = {'slug': ('nombre',)}