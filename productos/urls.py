# productos/urls.py
from . import views
from rest_framework.routers import DefaultRouter
from .views import ProductoViewSet, CategoriaViewSet, PedidoCreateView, PedidoViewSet
from django.urls import path # Necesario para rutas que no usan el Router

router = DefaultRouter()
router.register(r'colchones', ProductoViewSet) # <-- Esto crea /colchones/
router.register(r'categorias', CategoriaViewSet) 
router.register(r'pedidos', PedidoViewSet)

urlpatterns = [
    # Ruta para crear pedidos (vista manual)
    path('pedidos/crear/', PedidoCreateView.as_view(), name='pedido-create'),
    path('productos/search/', views.search_products, name='search_products'), 
] + router.urls # <-- CRÍTICO: Añadir las URLs generadas por el Router