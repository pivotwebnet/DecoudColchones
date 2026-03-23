import requests
from PIL import Image
from io import BytesIO
import os

def get_remote_size(url):
    try:
        response = requests.get(url)
        img = Image.open(BytesIO(response.content))
        return f"{img.size[0]}x{img.size[1]}"
    except Exception as e:
        return f"Error: {e}"

def get_local_size(filename):
    try:
        with Image.open(filename) as img:
            return f"{img.size[0]}x{img.size[1]}"
    except Exception as e:
        return f"Error: {e}"

print("--- Medidas de Banners ---")
# Remotos (Cloudinary)
print("Remotos (Cloudinary):")
print(f"Otoño: {get_remote_size('https://res.cloudinary.com/djv3eauty/image/upload/v1/media/banners/oto%C3%B1o_lygsbl')}")
print(f"Prueba 2: {get_remote_size('https://res.cloudinary.com/djv3eauty/image/upload/v1/media/banners/BANNER_PRUEBA_2_olkrqb_nbzpvt')}")

# Locales (Raíz)
print("\nLocales (en tu carpeta):")
if os.path.exists('BANNER PRUEBA.png'):
    print(f"BANNER PRUEBA.png: {get_local_size('BANNER PRUEBA.png')}")
if os.path.exists('BANNER PRUEBA 2.png'):
    print(f"BANNER PRUEBA 2.png: {get_local_size('BANNER PRUEBA 2.png')}")
