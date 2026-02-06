from django.db import models
from django.utils.text import slugify
from django.contrib.auth import get_user_model
from cloudinary.models import CloudinaryField

User = get_user_model()

# --- 1. Categorías ---
class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, blank=True)
    # Agregamos imagen por si quieres mostrar categorías con foto en la home
    imagen = models.ImageField(upload_to='categorias/', blank=True, null=True)

    class Meta:
        verbose_name_plural = "Categorías"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nombre)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre

# --- 2. Producto (Base) ---
class Producto(models.Model):
    # Imagen de portada (la principal)
    imagen = models.ImageField(upload_to='productos/', blank=True, null=True, verbose_name="Imagen Principal")
    nombre = models.CharField(max_length=200, verbose_name="Línea de Colchón")
    slug = models.SlugField(unique=True, blank=True)
    
    categoria = models.ForeignKey(
        Categoria, 
        related_name='productos', 
        on_delete=models.SET_NULL, 
        null=True 
    )
    
    stock = models.PositiveIntegerField(default=0, verbose_name="Stock General")
    destacado = models.BooleanField(default=False, help_text="Mostrar en carrusel/ofertas")
    precio = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Precio Base")
    cuotas = models.IntegerField(default=12, verbose_name="Cantidad de Cuotas s/interés")
    precio_anterior = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # VOLVEMOS A TEXTFIELD (Texto plano, simple y limpio)
    descripcion_base = models.TextField(verbose_name="Materiales/Descripción Base")
    
    densidad = models.CharField(max_length=50, verbose_name="Densidad (ej: 30 kg/m³)") # Cambiado a CharField para ser más flexible
    peso_max_min = models.IntegerField(verbose_name="Peso Mínimo (kg)")
    peso_max_max = models.IntegerField(verbose_name="Peso Máximo (kg)")
    garantia = models.CharField(max_length=50, blank=True, verbose_name="Garantía") # Agregado útil
    
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

# --- NUEVO: Galería de Imágenes ---
class ProductoImagen(models.Model):
    producto = models.ForeignKey(Producto, related_name='imagenes_extra', on_delete=models.CASCADE)
    imagen = models.ImageField(upload_to='productos/galeria/')
    orden = models.IntegerField(default=0, help_text="Orden de visualización")

    class Meta:
        ordering = ['orden']
        verbose_name = "Imagen Extra"
        verbose_name_plural = "Galería de Imágenes"

    def __str__(self):
        return f"Img {self.id} - {self.producto.nombre}"

# --- 3. Variante (SKUs) ---
class VarianteColchon(models.Model):
    MEDIDA_CHOICES = [
        ('80x190', '80x190 cm'),
        ('100x190', '100x190 cm'),
        ('140x190', '140x190 cm'),
        ('160x200', '160x200 cm'),
        ('180x200', '180x200 cm'),
        ('200x200', '200x200 cm'),
    ]

    producto_linea = models.ForeignKey(
        Producto,
        related_name='variantes',
        on_delete=models.CASCADE
    )
    
    altura = models.CharField(max_length=50, verbose_name="Altura (ej: 25 cm)") 
    # NUEVO CAMPO: Descripción específica de la tela/cubierta
    descripcion_cubierta = models.CharField(max_length=200, blank=True, verbose_name="Tela/Cubierta", help_text="Ej: Tela Jackard Matelaseada")

    medida = models.CharField(max_length=10, choices=MEDIDA_CHOICES)
    
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    sku = models.CharField(max_length=50, unique=True, blank=True, null=True)

    class Meta:
        unique_together = ('producto_linea', 'altura', 'medida')
        verbose_name_plural = "Variantes"

    def __str__(self):
        return f"{self.producto_linea.nombre} - {self.medida}"

# --- 4. Pedido (Tus personalizaciones intactas) ---
class Pedido(models.Model):
    # Datos del Cliente
    nombre_cliente = models.CharField(max_length=100)
    apellido_cliente = models.CharField(max_length=100)
    dni_cliente = models.CharField(max_length=20)
    telefono_contacto = models.CharField(max_length=50)
    
    # --- CAMBIOS AQUÍ ---
    direccion_envio = models.CharField(max_length=255) # Ahora solo guardamos Calle y Altura
    ciudad = models.CharField(max_length=100)          # NUEVO: Para filtrar por ciudad
    provincia = models.CharField(max_length=100, default='Santa Fe') # NUEVO: Para filtrar por provincia
    # --------------------

    metodo_pago = models.CharField(max_length=50, default='Mercado Pago')
    total_neto = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(max_length=20, default='pendiente')
    fecha_creacion = models.DateTimeField(auto_now_add=True) 

    def __str__(self):
        return f"Pedido #{self.id} - {self.nombre_cliente} ({self.ciudad})"

    class Meta:
        ordering = ['-fecha_creacion']

# --- 5. Item Pedido (Intacto) ---
class ItemPedido(models.Model):
    pedido = models.ForeignKey(Pedido, related_name='items', on_delete=models.CASCADE)
    
    # CAMBIO IMPORTANTE: Ahora es una relación directa con el Producto
    # Esto permite que el Admin muestre el producto real y no solo un texto.
    producto = models.ForeignKey(Producto, on_delete=models.SET_NULL, null=True)
    
    # Opcional: Guardamos la variante si existe
    variante_original = models.ForeignKey(VarianteColchon, on_delete=models.SET_NULL, null=True, blank=True) 

    # Guardamos los datos "congelados" al momento de la compra
    cantidad = models.IntegerField(default=1)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Campo opcional si quieres guardar el nombre como texto por si se borra el producto
    # nombre_producto = models.CharField(max_length=200, blank=True) 

    def get_costo(self):
        return self.precio_unitario * self.cantidad
        
    def __str__(self):
        # CORREGIDO: Usamos self.producto.nombre en lugar de producto_linea
        if self.producto:
            return f'{self.cantidad}x {self.producto.nombre}'
        return f'{self.cantidad}x Producto Eliminado'

# --- 6. Banner (Intacto) ---
class Banner(models.Model):
    titulo = models.CharField(max_length=100, blank=True)
    imagen = models.ImageField(upload_to='banners/')
    orden = models.IntegerField(default=0)
    activo = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['orden']
        verbose_name_plural = "Banners del Carrusel"

    def __str__(self):
        return self.titulo or f"Banner {self.id}"
    
class LineaProducto(models.Model):
    nombre = models.CharField(max_length=100, help_text="Ej: LINEA DESEO")
    slug = models.SlugField(unique=True, help_text="Identificador para la URL (ej: deseo, oro, hotel)")
    imagen = CloudinaryField('imagen')
    orden = models.IntegerField(default=0, help_text="Menor número aparece primero")
    activa = models.BooleanField(default=True)

    class Meta:
        ordering = ['orden']
        verbose_name = "Línea de Producto"
        verbose_name_plural = "Líneas de Productos"

    def __str__(self):
        return self.nombre