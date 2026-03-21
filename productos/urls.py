from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductoViewSet, 
    CategoriaViewSet, 
    PedidoViewSet, 
    PedidoCreateView,
    search_products,
    BannerViewSet,
    LineaProductoViewSet
)

router = DefaultRouter()
router.register(r'colchones', ProductoViewSet) 
router.register(r'categorias', CategoriaViewSet)
router.register(r'pedidos', PedidoViewSet, basename='pedidos')
router.register(r'banners', BannerViewSet)
router.register(r'lineas', LineaProductoViewSet, basename='lineas')

urlpatterns = [
    path('', include(router.urls)),
    path('buscar/', search_products, name='search_products'),
    path('crear-pedido/', PedidoCreateView.as_view(), name='crear-pedido'),
]