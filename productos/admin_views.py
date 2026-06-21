import datetime
from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required
from django.utils.timezone import make_aware
from django.db.models import Sum, Count, F
from django.db.models.functions import TruncDate
from django.contrib.auth import get_user_model
from .models import Pedido, ItemPedido, Producto

User = get_user_model()

@staff_member_required
def metricas_dashboard_view(request):
    # Rango de fechas por defecto: últimos 30 días
    today = datetime.date.today()
    default_start = today - datetime.timedelta(days=30)
    
    start_date_str = request.GET.get('desde')
    end_date_str = request.GET.get('hasta')
    
    if start_date_str:
        try:
            start_date = datetime.datetime.strptime(start_date_str, "%Y-%m-%d").date()
        except ValueError:
            start_date = default_start
    else:
        start_date = default_start
        
    if end_date_str:
        try:
            end_date = datetime.datetime.strptime(end_date_str, "%Y-%m-%d").date()
        except ValueError:
            end_date = today
    else:
        end_date = today

    # Convertir a datetime con zona horaria para filtrar la DB correctamente
    start_datetime = make_aware(datetime.datetime.combine(start_date, datetime.time.min))
    end_datetime = make_aware(datetime.datetime.combine(end_date, datetime.time.max))

    # 1. Total pedidos en el rango
    total_pedidos = Pedido.objects.filter(fecha_creacion__range=[start_datetime, end_datetime]).count()
    
    # 2. Total facturado
    total_facturado = Pedido.objects.filter(
        fecha_creacion__range=[start_datetime, end_datetime]
    ).exclude(estado='cancelado').aggregate(total=Sum('total_neto'))['total'] or 0

    # 3. Cantidad de clientes registrados totales
    total_clientes = User.objects.count()

    # 4. Productos más vendidos (Top 10)
    productos_mas_vendidos = ItemPedido.objects.filter(
        pedido__fecha_creacion__range=[start_datetime, end_datetime]
    ).exclude(pedido__estado='cancelado').values(
        'producto__nombre'
    ).annotate(
        cantidad_vendida=Sum('cantidad'),
        recaudacion=Sum(F('cantidad') * F('precio_unitario'))
    ).order_by('-cantidad_vendida')[:10]

    # 5. Top 5 Compradores (Clientes que más compraron)
    top_compradores = Pedido.objects.exclude(estado='cancelado').values(
        'nombre_cliente', 'apellido_cliente', 'usuario__email'
    ).annotate(
        total_gastado=Sum('total_neto'),
        cantidad_pedidos=Count('id')
    ).order_by('-total_gastado')[:5]

    # 6. Historial de órdenes agrupado por día para el gráfico de barras
    ordenes_por_dia = Pedido.objects.filter(
        fecha_creacion__range=[start_datetime, end_datetime]
    ).annotate(
        dia=TruncDate('fecha_creacion')
    ).values('dia').annotate(
        cantidad=Count('id'),
        monto=Sum('total_neto')
    ).order_by('dia')

    # Convertir a listas de Python para pasar fácilmente a JS/Chart.js
    chart_dates = []
    chart_orders_count = []
    chart_revenue = []
    
    # Rellenar los días vacíos en el rango para que el gráfico sea continuo y profesional
    current_day = start_date
    orders_by_day_dict = {o['dia']: o for o in ordenes_por_dia}
    
    while current_day <= end_date:
        chart_dates.append(current_day.strftime("%d/%m/%Y"))
        day_data = orders_by_day_dict.get(current_day)
        if day_data:
            chart_orders_count.append(day_data['cantidad'])
            chart_revenue.append(float(day_data['monto'] or 0))
        else:
            chart_orders_count.append(0)
            chart_revenue.append(0.0)
        current_day += datetime.timedelta(days=1)

    # 7. Historial de órdenes (tabla de las últimas 15 órdenes)
    ultimos_pedidos = Pedido.objects.select_related('usuario').order_by('-fecha_creacion')[:15]

    context = {
        'title': 'Panel de Métricas y Rendimiento',
        'start_date': start_date.strftime("%Y-%m-%d"),
        'end_date': end_date.strftime("%Y-%m-%d"),
        'total_pedidos': total_pedidos,
        'total_facturado': total_facturado,
        'total_clientes': total_clientes,
        'productos_mas_vendidos': productos_mas_vendidos,
        'top_compradores': top_compradores,
        'ultimos_pedidos': ultimos_pedidos,
        # Datos para los gráficos
        'chart_dates': chart_dates,
        'chart_orders_count': chart_orders_count,
        'chart_revenue': chart_revenue,
        'chart_products_labels': [p['producto__nombre'] or "Sin nombre" for p in productos_mas_vendidos],
        'chart_products_data': [p['cantidad_vendida'] for p in productos_mas_vendidos],
    }
    
    return render(request, 'admin/metricas_dashboard.html', context)
