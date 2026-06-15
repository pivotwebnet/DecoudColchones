from django.db import models
from django.utils.text import slugify
from django.contrib.auth import get_user_model

User = get_user_model()

# --- 1. Categorías ---
class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, blank=True)
    imagen = models.ImageField(upload_to='categorias/', blank=True, null=True)

    class Meta:
        verbose_name_plural = "Categorías"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nombre)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre

# --- 2. Producto ---
class Producto(models.Model):
    imagen = models.ImageField(upload_to='productos/', blank=True, null=True, verbose_name="Imagen Principal")
    nombre = models.CharField(max_length=200, verbose_name="Nombre del Producto")
    slug = models.SlugField(unique=True, blank=True)
    
    linea = models.ForeignKey(
        'LineaProducto', 
        related_name='productos', 
        on_delete=models.SET_NULL, 
        null=True,
        blank=True,
        verbose_name="Línea"
    )
    
    categoria = models.ForeignKey(
        Categoria, 
        related_name='productos', 
        on_delete=models.SET_NULL, 
        null=True 
    )
    
    stock = models.PositiveIntegerField(default=0, verbose_name="Stock")
    destacado = models.BooleanField(default=False, help_text="Mostrar en carrusel/ofertas")
    precio = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Precio")
    cuotas = models.IntegerField(default=12, verbose_name="Cuotas s/interés")
    precio_anterior = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    descripcion_base = models.TextField(verbose_name="Descripción")
    densidad = models.IntegerField(verbose_name="Densidad (kg/m³)", help_text="Solo el número (ej: 30)", null=True, blank=True) 
    altura = models.IntegerField(verbose_name="Altura (cm)", help_text="Solo el número (ej: 25)", null=True, blank=True)
    tiene_top_pillow = models.BooleanField(default=False, verbose_name="¿Tiene Top Pillow?")
    es_rotativo = models.BooleanField(default=True, verbose_name="¿Es rotativo?")
    
    GARANTIA_CHOICES = [
        ('Sin garantía', 'Sin garantía'),
        ('1 año', '1 año'),
        ('2 años', '2 años'),
        ('3 años', '3 años'),
        ('4 años', '4 años'),
        ('5 años', '5 años'),
    ]

    MEDIDA_CHOICES = [
        ('1_plaza', '1 Plaza'),
        ('1_y_media', '1 1/2 Plaza'),
        ('2_plazas', '2 Plazas'),
    ]

    medida = models.CharField(
        max_length=20, 
        choices=MEDIDA_CHOICES, 
        default='2_plazas', 
        verbose_name="Medida/Plazas"
    )

    peso_max_min = models.IntegerField(verbose_name="Peso Mínimo (kg)", default=0)
    peso_max_max = models.IntegerField(verbose_name="Peso Máximo (kg)", default=100)
    garantia = models.CharField(max_length=50, choices=GARANTIA_CHOICES, default='1 año') 

    disponible = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('-creado_en',)
        verbose_name_plural = "Productos"
        
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nombre)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre

# --- 3. Galería de Imágenes ---
class ProductoImagen(models.Model):
    producto = models.ForeignKey(Producto, related_name='imagenes_extra', on_delete=models.CASCADE)
    imagen = models.ImageField(upload_to='productos/galeria/')
    orden = models.IntegerField(default=0)

    class Meta:
        ordering = ['orden']
        verbose_name_plural = "Galería de Imágenes"

# --- 4. Pedido ---
class Pedido(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='pedidos')
    nombre_cliente = models.CharField(max_length=100)
    apellido_cliente = models.CharField(max_length=100)
    dni_cliente = models.CharField(max_length=20)
    telefono_contacto = models.CharField(max_length=50)
    direccion_envio = models.CharField(max_length=255)
    ciudad = models.CharField(max_length=100)
    provincia = models.CharField(max_length=100, default='Santa Fe')
    metodo_pago = models.CharField(max_length=50, default='Mercado Pago')
    total_neto = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(max_length=20, default='pendiente')
    fecha_creacion = models.DateTimeField(auto_now_add=True) 

    class Meta:
        ordering = ['-fecha_creacion']

class ItemPedido(models.Model):
    pedido = models.ForeignKey(Pedido, related_name='items', on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.SET_NULL, null=True)
    cantidad = models.IntegerField(default=1)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    def get_costo(self):
        return self.precio_unitario * self.cantidad

# --- 5. Banners y Líneas ---
class Banner(models.Model):
    titulo = models.CharField(max_length=100, blank=True)
    imagen = models.ImageField(upload_to='banners/')
    orden = models.IntegerField(default=0)
    activo = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['orden']

class LineaProducto(models.Model):
    nombre = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    imagen = models.ImageField(upload_to='lineas/', blank=True, null=True)
    orden = models.IntegerField(default=0)
    activa = models.BooleanField(default=True)

    class Meta:
        ordering = ['orden']
        verbose_name = "Línea de Producto"

    def __str__(self):
        return self.nombre