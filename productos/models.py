# productos/models.py

from django.db import models
from django.utils.text import slugify
from django.contrib.auth import get_user_model
User = get_user_model()
# --- 1. Modelo para Categorías (Sin cambios mayores) ---

class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, blank=True)

    class Meta:
        verbose_name_plural = "Categorías"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nombre)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre

# --- 2. Modelo Producto (Línea de Colchón) ---

class Producto(models.Model):
    # La descripción ahora incluye los detalles fijos de la línea (Densidad, Materiales)
    nombre = models.CharField(max_length=200, verbose_name="Línea de Colchón")
    slug = models.SlugField(unique=True, blank=True)
    categoria = models.ForeignKey(
        Categoria, 
        related_name='productos', 
        on_delete=models.SET_NULL, 
        null=True 
    )
    
    # Campo para la información fija de la línea
    descripcion_base = models.TextField(verbose_name="Materiales/Descripción Base")
    
    # Datos específicos del Colchón (según la lista)
    densidad = models.IntegerField(verbose_name="Densidad (kg/m³)") # Ej: 28, 22
    peso_max_min = models.IntegerField(verbose_name="Peso Mínimo Soportado (kg)") # Ej: 70, 90
    peso_max_max = models.IntegerField(verbose_name="Peso Máximo Soportado (kg)") # Ej: 90, 120
    
    disponible = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('nombre',)
        verbose_name_plural = "Productos (Líneas)"
        
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nombre)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre

# --- 3. Modelo Variante de Colchón (SKU) ---

class VarianteColchon(models.Model):
    # Opciones de Medida (Basadas en la imagen: 80x190, 100x190, 140x190)
    MEDIDA_CHOICES = [
        ('80x190', '80x190 cm'),
        ('100x190', '100x190 cm'),
        ('140x190', '140x190 cm'),
        # Puedes añadir más aquí: '150x190', '160x200', etc.
    ]

    producto_linea = models.ForeignKey(
        Producto,
        related_name='variantes',
        on_delete=models.CASCADE
    )
    
    # Variante de Altura (Ej: 28 cm - pillow, 30cm - doble pilow, 23cm EURO simple)
    altura = models.CharField(max_length=50, verbose_name="Altura y Descripción de Cubierta") 
    medida = models.CharField(max_length=10, choices=MEDIDA_CHOICES)
    
    # Campos variables por SKU
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    sku = models.CharField(max_length=50, unique=True, blank=True, null=True, verbose_name="Código SKU")

    class Meta:
        # Esto asegura que no se pueda tener dos veces la misma combinación de medida/altura para la misma línea
        unique_together = ('producto_linea', 'altura', 'medida')
        verbose_name_plural = "Variantes de Colchón (SKUs)"

    def __str__(self):
        return f"{self.producto_linea.nombre} - {self.medida} - {self.altura}"
    
class Pedido(models.Model):
    # Cliente que realiza el pedido. (Null/Blank para permitir pedidos de usuarios no registrados)
    usuario = models.ForeignKey(User, related_name='pedidos', on_delete=models.CASCADE, null=True, blank=True)
    
    # Información de envío y contacto 
    nombre_completo = models.CharField(max_length=150)
    email = models.EmailField()
    direccion_envio = models.CharField(max_length=250)
    ciudad = models.CharField(max_length=100)
    
    # Estado y totales
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    total_neto = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    ESTADO_CHOICES = [
        ('PENDIENTE', 'Pendiente de Pago'),
        ('PAGADO', 'Pagado'),
        ('ENVIADO', 'Enviado'),
        ('ENTREGADO', 'Entregado'),
        ('CANCELADO', 'Cancelado'),
    ]
    estado = models.CharField(max_length=10, choices=ESTADO_CHOICES, default='PENDIENTE')

    class Meta:
        ordering = ('-fecha_creacion',)
        verbose_name_plural = 'Pedidos'

    def __str__(self):
        return f'Pedido {self.id} de {self.nombre_completo}'

# --- 5. Modelo Ítem de Pedido (Detalle) ---

class ItemPedido(models.Model):
    pedido = models.ForeignKey(Pedido, related_name='items', on_delete=models.CASCADE)
    
    # Snapshot de la información de la variante al momento de la compra
    producto_linea = models.CharField(max_length=200, verbose_name="Línea de Colchón (Snapshot)")
    medida_altura = models.CharField(max_length=100, verbose_name="Variante Comprada (Snapshot)")
    
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    cantidad = models.IntegerField(default=1)

    # Referencia al SKU original (opcional, por si necesitas volver a él)
    variante_original = models.ForeignKey(VarianteColchon, on_delete=models.SET_NULL, null=True) 

    def get_costo(self):
        return self.precio_unitario * self.cantidad
        
    def __str__(self):
        return f'{self.cantidad}x {self.producto_linea} ({self.medida_altura})'   