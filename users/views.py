# users/views.py

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .serializers import UserRegistrationSerializer

class RegisterView(generics.CreateAPIView):
    """
    Vista para el registro de nuevos usuarios.
    Crea el usuario y devuelve un mensaje de éxito.
    """
    serializer_class = UserRegistrationSerializer
    permission_classes = (permissions.AllowAny,) # Permitir acceso a cualquiera (no autenticado)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Opcional: Podrías generar y devolver el token JWT aquí mismo para loguearlo automáticamente
        
        return Response({
            "user": serializer.data["email"],
            "message": "Usuario registrado exitosamente. Ahora puede iniciar sesión."
        }, status=status.HTTP_201_CREATED)

# Create your views here.
