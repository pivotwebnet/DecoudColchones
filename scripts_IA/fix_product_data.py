import os
import django
import re

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from productos.models import Producto

def clean_int(value):
    if value is None:
        return None
    if isinstance(value, int):
        return value
    
    # If it's a string, try to extract the number
    if isinstance(value, str):
        if value.lower() == 'no aplica' or value.strip() == '':
            return None
        
        # Extract digits
        match = re.search(r'\d+', value)
        if match:
            return int(match.group())
            
    return None

def fix_data():
    productos = Producto.objects.all()
    count = 0
    for p in productos:
        new_densidad = clean_int(p.densidad)
        new_altura = clean_int(p.altura)
        
        changed = False
        if new_densidad != p.densidad:
            print(f"Producto {p.id} ({p.nombre}): densidad '{p.densidad}' -> {new_densidad}")
            p.densidad = new_densidad
            changed = True
        
        if new_altura != p.altura:
            print(f"Producto {p.id} ({p.nombre}): altura '{p.altura}' -> {new_altura}")
            p.altura = new_altura
            changed = True
            
        if changed:
            p.save()
            count += 1
            
    print(f"Se actualizaron {count} productos.")

if __name__ == '__main__':
    fix_data()
