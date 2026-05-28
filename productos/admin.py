from django.contrib import admin
from django.utils.html import mark_safe
from unfold.admin import ModelAdmin, TabularInline
from django_summernote.admin import SummernoteModelAdmin
from .models import Producto, Categoria, Banner, LineaProducto, ProductoImagen, Pedido, ItemPedido


class ProductoImagenInline(TabularInline):
    model = ProductoImagen
    extra = 1


class ItemPedidoInline(TabularInline):
    model = ItemPedido
    extra = 0
    readonly_fields = ('producto', 'cantidad', 'precio_unitario', 'subtotal')

    def subtotal(self, obj):
        return f"${obj.get_costo():,.0f}"
    subtotal.short_description = "Subtotal"


@admin.register(Producto)
class ProductoAdmin(ModelAdmin, SummernoteModelAdmin):
    list_display = ('nombre', 'categoria', 'linea', 'precio', 'stock', 'ver_imagen', 'destacado')
    search_fields = ('nombre', 'descripcion_base')
    list_filter = ('categoria', 'linea', 'destacado')
    prepopulated_fields = {'slug': ('nombre',)}
    inlines = [ProductoImagenInline]
    summernote_fields = ('descripcion_base',)

    fieldsets = (
        ('Información Básica', {
            'fields': ('nombre', 'slug', 'categoria', 'linea', 'imagen', 'descripcion_base')
        }),
        ('Detalles Técnicos', {
            'fields': ('medida', 'densidad', 'altura', 'tiene_top_pillow', 'peso_max_min', 'peso_max_max', 'garantia')
        }),
        ('Comercial', {
            'fields': ('precio', 'precio_anterior', 'stock', 'cuotas', 'destacado', 'disponible')
        }),
    )

    def ver_imagen(self, obj):
        if obj.imagen:
            return mark_safe(f'<img src="{obj.imagen.url}" width="50" height="50" style="border-radius:5px; object-fit:cover;" />')
        return "Sin img"
    ver_imagen.short_description = "Imagen"


@admin.register(Pedido)
class PedidoAdmin(ModelAdmin):
    list_display = ('id', 'nombre_cliente', 'apellido_cliente', 'ciudad', 'total_neto', 'estado', 'metodo_pago', 'fecha_creacion')
    list_filter = ('estado', 'metodo_pago', 'provincia')
    search_fields = ('nombre_cliente', 'apellido_cliente', 'dni_cliente', 'telefono_contacto')
    readonly_fields = ('fecha_creacion',)
    inlines = [ItemPedidoInline]

    fieldsets = (
        ('Cliente', {
            'fields': ('usuario', 'nombre_cliente', 'apellido_cliente', 'dni_cliente', 'telefono_contacto')
        }),
        ('Envío', {
            'fields': ('direccion_envio', 'ciudad', 'provincia')
        }),
        ('Pago', {
            'fields': ('metodo_pago', 'total_neto', 'estado', 'fecha_creacion')
        }),
    )


@admin.register(Categoria)
class CategoriaAdmin(ModelAdmin):
    list_display = ('nombre', 'slug')
    prepopulated_fields = {'slug': ('nombre',)}


@admin.register(LineaProducto)
class LineaProductoAdmin(ModelAdmin):
    list_display = ('nombre', 'slug', 'orden', 'activa')
    prepopulated_fields = {'slug': ('nombre',)}


@admin.register(Banner)
class BannerAdmin(ModelAdmin):
    list_display = ('titulo', 'orden', 'activo', 'vista_previa')

    def vista_previa(self, obj):
        if obj.imagen:
            return mark_safe(f'<img src="{obj.imagen.url}" width="100" />')
        return "-"
    vista_previa.short_description = "Vista previa"
