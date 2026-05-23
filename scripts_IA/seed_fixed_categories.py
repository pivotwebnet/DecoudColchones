import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from productos.models import Categoria

def seed_categories():
    categories = ['Colchones', 'Sommiers', 'Espuma']
    for cat_name in categories:
        obj, created = Categoria.objects.get_or_create(nombre=cat_name)
        if created:
            print(f"Categoría '{cat_name}' creada.")
        else:
            print(f"Categoría '{cat_name}' ya existe.")

if __name__ == "__main__":
    seed_categories()
