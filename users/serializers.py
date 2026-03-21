# users/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class UserRegistrationSerializer(serializers.ModelSerializer):
    
    username = serializers.CharField(read_only=True)
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'password', 'password2')
        extra_kwargs = {
            'password': {'write_only': True}
        }
        
    def validate(self, data):
        
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas deben coincidir."})
        
        
        validate_password(data['password'])
        
        
        if User.objects.filter(email=data['email']).exists():
             raise serializers.ValidationError({"email": "Ya existe un usuario con este email."})

        return data

    def create(self, validated_data):
        # Crear el usuario en la base de datos
        user = User.objects.create_user(
            username=validated_data['email'], # Usar email como username
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=validated_data['password']
        )
        return user
    
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Añadir 'claims' personalizados (datos extra)
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        
        return token