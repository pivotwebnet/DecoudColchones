import re
from productos.models import Producto

def clean_int(v):
    if v is None:
        return None
    if isinstance(v, int):
        return v
    if isinstance(v, str):
        v_low = v.lower().strip()
        if v_low == 'no aplica' or v_low == '':
            return None
        m = re.search(r'\d+', v)
        if m:
            return int(m.group())
    return None

count = 0
for p in Producto.objects.all():
    nd = clean_int(p.densidad)
    na = clean_int(p.altura)
    if nd != p.densidad or na != p.altura:
        print(f"Producto {p.id} ({p.nombre}):")
        if nd != p.densidad:
            print(f"  densidad: {p.densidad!r} -> {nd!r}")
            p.densidad = nd
        if na != p.altura:
            print(f"  altura: {p.altura!r} -> {na!r}")
            p.altura = na
        p.save()
        count += 1

print(f"Total productos corregidos: {count}")
