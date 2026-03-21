from django_filters import rest_framework as filters
from .models import Producto

class ProductoFilter(filters.FilterSet):
    linea = filters.CharFilter(field_name='linea__slug', lookup_expr='exact')
    categoria = filters.CharFilter(field_name='categoria__slug', lookup_expr='exact')
    altura = filters.NumberFilter(field_name='altura', lookup_expr='exact')
    
    # Filtros de precio
    precio_min = filters.NumberFilter(field_name='precio', lookup_expr='gte')
    precio_max = filters.NumberFilter(field_name='precio', lookup_expr='lte')

    # NUEVO: Filtro por Soporte Máximo (Peso)
    soporte_min = filters.NumberFilter(field_name='peso_max_max', lookup_expr='gte')

    class Meta:
        model = Producto
        fields = ['linea', 'altura', 'categoria', 'precio_min', 'precio_max', 'soporte_min']