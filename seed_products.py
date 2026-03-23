import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from productos.models import Producto, Categoria, LineaProducto

# Obtener Categorías
try:
    cat_colchones = Categoria.objects.get(nombre='Colchones')
    cat_sommiers = Categoria.objects.get(nombre='Sommiers')
except Categoria.DoesNotExist:
    # Si no existen, las creamos
    cat_colchones, _ = Categoria.objects.get_or_create(nombre='Colchones')
    cat_sommiers, _ = Categoria.objects.get_or_create(nombre='Sommiers')

lineas = list(LineaProducto.objects.all())

# Lista de productos de ejemplo
productos_data = [
    ('Colchón Económico 1 Plaza', '1_plaza', 20, 85000, cat_colchones, 'LINEA DESEO'),
    ('Sommier Confort 1 1/2 Plaza', '1_y_media', 24, 150000, cat_sommiers, 'LINEA NUBE'),
    ('Colchón Premium 2 Plazas', '2_plazas', 30, 280000, cat_colchones, 'LINEA GLACIAR'),
    ('Sommier Luxury King Size', '2_plazas', 35, 450000, cat_sommiers, 'LINEA MARÍA'),
    ('Colchón Ortopédico 1 Plaza', '1_plaza', 22, 120000, cat_colchones, 'LINEA HORTENCIA'),
    ('Sommier Juvenil 1 Plaza', '1_plaza', 18, 95000, cat_sommiers, 'LINEA DESEO'),
    ('Colchón Elite 1 1/2 Plaza', '1_y_media', 28, 190000, cat_colchones, 'LINEA NUBE'),
    ('Sommier Doble Pillow 2 Plazas', '2_plazas', 32, 320000, cat_sommiers, 'LINEA GLACIAR'),
    ('Colchón Soft 2 Plazas', '2_plazas', 25, 210000, cat_colchones, 'LINEA HORTENCIA'),
    ('Sommier Básico 1 1/2 Plaza', '1_y_media', 21, 135000, cat_sommiers, 'LINEA DESEO'),
]

for nombre, medida, altura, precio, cat, linea_nombre in productos_data:
    # Buscar línea por nombre
    linea = next((l for l in lineas if linea_nombre.upper() in l.nombre.upper()), None)
    
    # Crear producto
    Producto.objects.create(
        nombre=nombre,
        medida=medida,
        altura=altura,
        precio=precio,
        categoria=cat,
        linea=linea,
        disponible=True,
        stock=random.randint(5, 20),
        descripcion_base=f'Excelente producto de la {linea_nombre}, ideal para un descanso reparador y confortable.',
        densidad='28kg/m3',
        cuotas=12,
        garantia='5 años'
    )

print("--- 10 Productos de ejemplo creados con éxito ---")
