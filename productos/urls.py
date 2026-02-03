from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductoViewSet, 
    CategoriaViewSet, 
    PedidoViewSet, 
    PedidoCreateView,
    search_products,
    BannerViewSet,
    LineaProductoList
)

router = DefaultRouter()
router.register(r'colchones', ProductoViewSet) 
router.register(r'categorias', CategoriaViewSet)
router.register(r'pedidos', PedidoViewSet)
router.register(r'banners', BannerViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('buscar/', search_products, name='search_products'),
    path('crear-pedido/', PedidoCreateView.as_view(), name='crear-pedido'),
    path('lineas/', LineaProductoList.as_view(), name='lineas-list'),
]