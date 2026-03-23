# productos/admin.py
from django.contrib import admin
from django.utils.html import mark_safe
from .models import Producto, Categoria, Banner, LineaProducto, ProductoImagen
from django_summernote.admin import SummernoteModelAdmin

class ProductoImagenInline(admin.TabularInline):
    model = ProductoImagen
    extra = 1

@admin.register(Producto)
class ProductoAdmin(SummernoteModelAdmin):
    list_display = ('nombre', 'categoria', 'linea', 'precio', 'stock', 'ver_imagen', 'destacado')
    search_fields = ('nombre', 'descripcion_base')
    list_filter = ('categoria', 'linea', 'destacado')
    prepopulated_fields = {'slug': ('nombre',)}
    inlines = [ProductoImagenInline]
    
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

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'slug')
    prepopulated_fields = {'slug': ('nombre',)}

@admin.register(LineaProducto)
class LineaProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'slug', 'orden', 'activa')
    prepopulated_fields = {'slug': ('nombre',)}

@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'orden', 'activo', 'vista_previa')
    def vista_previa(self, obj):
        if obj.imagen:
            return mark_safe(f'<img src="{obj.imagen.url}" width="100" />')
        return "-"