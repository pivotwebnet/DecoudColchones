# productos/admin.py
from django.contrib import admin
from django.utils.html import mark_safe
from .models import Producto, Categoria, VarianteColchon, Banner

# 1. Configuración para editar las VARIENTES (Medidas) dentro del Producto
class VarianteColchonInline(admin.TabularInline):
    model = VarianteColchon
    extra = 1  # Muestra 1 fila vacía lista para llenar
    fields = ('medida', 'altura', 'precio', 'stock', 'sku') # Campos a editar

# 2. Configuración del PRODUCTO (Padre)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'precio_base_visual', 'ver_imagen', 'destacado', 'total_stock')
    search_fields = ('nombre', 'descripcion_base')
    list_filter = ('categoria', 'destacado')
    prepopulated_fields = {'slug': ('nombre',)}
    
    # ESTA LÍNEA ES LA CLAVE: Agrega la tabla de medidas dentro del producto
    inlines = [VarianteColchonInline] 

    def ver_imagen(self, obj):
        if obj.imagen:
            return mark_safe(f'<img src="{obj.imagen.url}" width="50" height="50" style="border-radius:5px; object-fit:cover;" />')
        return "Sin img"
    
    # Muestra el precio que pusiste en el modelo principal
    def precio_base_visual(self, obj):
        return f"${obj.precio}" if obj.precio else "-"
    precio_base_visual.short_description = "Precio Base"

    # Calcula el stock total sumando todas las variantes
    def total_stock(self, obj):
        return sum(v.stock for v in obj.variantes.all())

# 3. Registro
admin.site.register(Producto, ProductoAdmin)
admin.site.register(Categoria)
# admin.site.register(VarianteColchon) # No hace falta registrarlo suelto si ya está como Inline

@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'orden', 'activo', 'vista_previa')
    list_editable = ('orden', 'activo')
    
    def vista_previa(self, obj):
        from django.utils.html import mark_safe
        if obj.imagen:
            return mark_safe(f'<img src="{obj.imagen.url}" width="100" />')
        return "-"