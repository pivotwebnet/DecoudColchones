from django.contrib import admin
from django.utils.html import mark_safe
from unfold.admin import ModelAdmin, TabularInline
from django_summernote.admin import SummernoteModelAdmin
from .models import Producto, Categoria, Banner, LineaProducto, ProductoImagen, Pedido, ItemPedido
from django.urls import reverse

def render_acciones(app_label, model_name, obj_id):
    edit_url = reverse(f'admin:{app_label}_{model_name}_change', args=[obj_id])
    delete_url = reverse(f'admin:{app_label}_{model_name}_delete', args=[obj_id])
    return mark_safe(
        f'<div style="display: flex; gap: 8px; align-items: center;">'
        f'<a href="{edit_url}" style="background-color: #1B365D; color: #ffffff; font-weight: 700; border-radius: 6px; padding: 6px 12px; font-size: 11px; text-transform: uppercase; text-decoration: none; border: 1px solid #1B365D; transition: all 0.2s;" onmouseover="this.style.backgroundColor=\'#2c5282\'" onmouseout="this.style.backgroundColor=\'#1B365D\'">Editar</a>'
        f'<a href="{delete_url}" style="background-color: #ef4444; color: #ffffff; font-weight: 700; border-radius: 6px; padding: 6px 12px; font-size: 11px; text-transform: uppercase; text-decoration: none; border: 1px solid #ef4444; transition: all 0.2s;" onmouseover="this.style.backgroundColor=\'#dc2626\'" onmouseout="this.style.backgroundColor=\'#ef4444\'">Eliminar</a>'
        f'</div>'
    )


class ProductoImagenInline(TabularInline):
    model = ProductoImagen
    extra = 1
    readonly_fields = ('orden',)


class ItemPedidoInline(TabularInline):
    model = ItemPedido
    extra = 0
    readonly_fields = ('producto', 'cantidad', 'precio_unitario', 'subtotal')

    def subtotal(self, obj):
        return f"${obj.get_costo():,.0f}"
    subtotal.short_description = "Subtotal"


@admin.register(Producto)
class ProductoAdmin(ModelAdmin, SummernoteModelAdmin):
    list_display = ('nombre', 'categoria', 'linea', 'precio', 'stock', 'ver_imagen', 'destacado', 'acciones')
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
            'fields': ('medida', 'densidad', 'altura', 'tiene_top_pillow', 'es_rotativo', 'peso_max_min', 'peso_max_max', 'garantia')
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

    def acciones(self, obj):
        return render_acciones('productos', 'producto', obj.pk)
    acciones.short_description = "Acciones"


@admin.register(Pedido)
class PedidoAdmin(ModelAdmin):
    list_display = ('id', 'nombre_cliente', 'apellido_cliente', 'ciudad', 'total_neto', 'estado', 'metodo_pago', 'acciones', 'fecha_creacion')
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

    def acciones(self, obj):
        return render_acciones('productos', 'pedido', obj.pk)
    acciones.short_description = "Acciones"


@admin.register(Categoria)
class CategoriaAdmin(ModelAdmin):
    list_display = ('nombre', 'slug', 'acciones')
    prepopulated_fields = {'slug': ('nombre',)}

    def acciones(self, obj):
        return render_acciones('productos', 'categoria', obj.pk)
    acciones.short_description = "Acciones"


@admin.register(LineaProducto)
class LineaProductoAdmin(ModelAdmin):
    list_display = ('nombre', 'slug', 'orden', 'activa', 'acciones')
    prepopulated_fields = {'slug': ('nombre',)}
    readonly_fields = ('orden',)

    def acciones(self, obj):
        return render_acciones('productos', 'lineaproducto', obj.pk)
    acciones.short_description = "Acciones"

    def get_changeform_initial_data(self, request):
        initial = super().get_changeform_initial_data(request)
        if 'orden' not in initial or initial['orden'] == 0:
            from django.db.models import Max
            max_orden = LineaProducto.objects.aggregate(Max('orden'))['orden__max']
            initial['orden'] = (max_orden or 0) + 1
        return initial


@admin.register(Banner)
class BannerAdmin(ModelAdmin):
    list_display = ('titulo', 'orden', 'activo', 'vista_previa', 'acciones')
    readonly_fields = ('orden',)

    def vista_previa(self, obj):
        if obj.imagen:
            return mark_safe(f'<img src="{obj.imagen.url}" width="100" />')
        return "-"
    vista_previa.short_description = "Vista previa"

    def acciones(self, obj):
        return render_acciones('productos', 'banner', obj.pk)
    acciones.short_description = "Acciones"

    def get_changeform_initial_data(self, request):
        initial = super().get_changeform_initial_data(request)
        if 'orden' not in initial or initial['orden'] == 0:
            from django.db.models import Max
            max_orden = Banner.objects.aggregate(Max('orden'))['orden__max']
            initial['orden'] = (max_orden or 0) + 1
        return initial
