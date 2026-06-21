from django.conf import settings             
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from productos.admin_views import metricas_dashboard_view

urlpatterns = [
    path('admin/metricas/', metricas_dashboard_view, name='admin-metricas-dashboard'),
    path('admin/', admin.site.urls),
    path('api/', include('productos.urls')),
    path('api/', include('users.urls')), 
    path('summernote/', include('django_summernote.urls'))
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
