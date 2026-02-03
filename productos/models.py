# productos/models.py

from django.db import models
from django.utils.text import slugify
from django.contrib.auth import get_user_model
User = get_user_model()

# --- 1. Modelo para Categorías (Sin cambios) ---
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

# --- 2. Modelo Producto (Sin cambios) ---
class Producto(models.Model):
    imagen = models.ImageField(upload_to='productos/', blank=True, null=True)
    nombre = models.CharField(max_length=200, verbose_name="Línea de Colchón")
    slug = models.SlugField(unique=True, blank=True)
    categoria = models.ForeignKey(
        Categoria, 
        related_name='productos', 
        on_delete=models.SET_NULL, 
        null=True 
    )
    stock = models.PositiveIntegerField(default=0, verbose_name="Stock Disponible")
    destacado = models.BooleanField(default=False, help_text="Si marcas esto, aparecerá en el carrusel de inicio o sección ofertas")
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    precio_anterior = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Poner esto mostrará el precio tachado (oferta)")
    descripcion_base = models.TextField(verbose_name="Materiales/Descripción Base")
    
    densidad = models.IntegerField(verbose_name="Densidad (kg/m³)")
    peso_max_min = models.IntegerField(verbose_name="Peso Mínimo Soportado (kg)")
    peso_max_max = models.IntegerField(verbose_name="Peso Máximo Soportado (kg)")
    
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

# --- 3. Modelo Variante de Colchón (Sin cambios) ---
class VarianteColchon(models.Model):
    MEDIDA_CHOICES = [
        ('80x190', '80x190 cm'),
        ('100x190', '100x190 cm'),
        ('140x190', '140x190 cm'),
    ]

    producto_linea = models.ForeignKey(
        Producto,
        related_name='variantes',
        on_delete=models.CASCADE
    )
    
    altura = models.CharField(max_length=50, verbose_name="Altura y Descripción de Cubierta") 
    medida = models.CharField(max_length=10, choices=MEDIDA_CHOICES)
    
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    sku = models.CharField(max_length=50, unique=True, blank=True, null=True, verbose_name="Código SKU")

    class Meta:
        unique_together = ('producto_linea', 'altura', 'medida')
        verbose_name_plural = "Variantes de Colchón (SKUs)"

    def __str__(self):
        return f"{self.producto_linea.nombre} - {self.medida} - {self.altura}"
    
# --- 4. Modelo Pedido (MODIFICADO) ---
class Pedido(models.Model):
    usuario = models.ForeignKey(User, related_name='pedidos', on_delete=models.CASCADE, null=True, blank=True)
    
    # Información de envío y contacto 
    nombre_completo = models.CharField(max_length=150)
    email = models.EmailField()
    # AGREGADO: Necesario para contactar al cliente
    telefono = models.CharField(max_length=50) 
    
    direccion_envio = models.CharField(max_length=250)
    ciudad = models.CharField(max_length=100)
    # AGREGADO: Necesario para el envío
    provincia = models.CharField(max_length=100, default='Santa Fe') 
    
    # Estado y totales
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    # Mantenemos 'total_neto' como lo tenías
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
        return f'Pedido #{self.id} - {self.nombre_completo}'

# --- 5. Modelo Ítem de Pedido (Sin cambios, tu lógica es correcta) ---
class ItemPedido(models.Model):
    pedido = models.ForeignKey(Pedido, related_name='items', on_delete=models.CASCADE)
    
    producto_linea = models.CharField(max_length=200, verbose_name="Línea de Colchón (Snapshot)")
    medida_altura = models.CharField(max_length=100, verbose_name="Variante Comprada (Snapshot)")
    
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    cantidad = models.IntegerField(default=1)

    variante_original = models.ForeignKey(VarianteColchon, on_delete=models.SET_NULL, null=True) 

    def get_costo(self):
        return self.precio_unitario * self.cantidad
        
    def __str__(self):
        return f'{self.cantidad}x {self.producto_linea} ({self.medida_altura})'
    
class Banner(models.Model):
    titulo = models.CharField(max_length=100, blank=True, help_text="Texto opcional para referencia")
    imagen = models.ImageField(upload_to='banners/')
    orden = models.IntegerField(default=0, help_text="0 va primero, 1 va segundo, etc.")
    activo = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['orden']
        verbose_name_plural = "Banners del Carrusel"

    def __str__(self):
        return self.titulo or f"Banner {self.id}"