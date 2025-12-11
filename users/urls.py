# users/urls.py

from django.urls import path
from .views import RegisterView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    # Podemos añadir más rutas de usuario (perfil, etc.) aquí más tarde
]