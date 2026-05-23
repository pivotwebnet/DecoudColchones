import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from productos.models import Producto, Categoria, LineaProducto

# 1. Asegurar Categorías (Colchones, Sommiers, Espuma)
cat_colchones, _ = Categoria.objects.get_or_create(nombre='Colchones')
cat_sommiers, _ = Categoria.objects.get_or_create(nombre='Sommiers')
cat_espuma, _ = Categoria.objects.get_or_create(nombre='Espuma')

# 2. Asegurar Líneas de Producto
lineas_nombres = ['LINEA DESEO', 'LINEA NUBE', 'LINEA GLACIAR', 'LINEA MARÍA', 'LINEA HORTENCIA']
for nombre in lineas_nombres:
    LineaProducto.objects.get_or_create(
        nombre=nombre, 
        defaults={'slug': nombre.lower().replace(' ', '-')}
    )

lineas = list(LineaProducto.objects.all())

# 3. Lista de 10 productos mezclados
# Formato: (Nombre, Medida, Altura, Precio, Categoría, Línea)
productos_data = [
    ('Colchón Espuma Eco-Soft', '1_plaza', 20, 85000, cat_espuma, 'LINEA DESEO'),
    ('Sommier Confort Dual', '1_y_media', 24, 150000, cat_sommiers, 'LINEA NUBE'),
    ('Colchón Resortes Premium', '2_plazas', 30, 280000, cat_colchones, 'LINEA GLACIAR'),
    ('Sommier Luxury Imperial', '2_plazas', 35, 450000, cat_sommiers, 'LINEA MARÍA'),
    ('Colchón Espuma Alta Densidad', '1_plaza', 22, 120000, cat_espuma, 'LINEA HORTENCIA'),
    ('Sommier Juvenil Plus', '1_plaza', 18, 95000, cat_sommiers, 'LINEA DESEO'),
    ('Colchón Elite Híbrido', '1_y_media', 28, 190000, cat_colchones, 'LINEA NUBE'),
    ('Sommier Doble Pillow', '2_plazas', 32, 320000, cat_sommiers, 'LINEA GLACIAR'),
    ('Colchón Espuma Relax', '2_plazas', 25, 210000, cat_espuma, 'LINEA HORTENCIA'),
    ('Sommier Básico Start', '1_y_media', 21, 135000, cat_sommiers, 'LINEA DESEO'),
]

# Borrar productos anteriores para no duplicar (opcional, pero recomendado para pruebas)
# Producto.objects.all().delete()

for nombre, medida, altura, precio, cat, linea_nombre in productos_data:
    linea = LineaProducto.objects.filter(nombre__iexact=linea_nombre).first()
    
    Producto.objects.create(
        nombre=nombre,
        medida=medida,
        altura=altura,
        precio=precio,
        categoria=cat,
        linea=linea,
        disponible=True,
        stock=random.randint(5, 20),
        descripcion_base=f'Excelente producto de la {linea_nombre}, ideal para un descanso reparador.',
        densidad='30kg/m3' if cat == cat_espuma else 'No aplica',
        cuotas=12,
        garantia='5 años'
    )

print("--- 10 Productos mezclados creados con éxito ---")
