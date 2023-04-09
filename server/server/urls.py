
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve


urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/", include("api.urls"))
]

CACHE_CONTROL_HEADER = 'max-age=1209600, no-transform'


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    urlpatterns += [
        path('media/<path:path>', serve, {
            'document_root': settings.MEDIA_ROOT,
            'show_indexes': False,
            'cache_timeout': 1209600,  # 2 weeks
            'xsendfile': False,
            'http_headers': {
                'Cache-Control': 'max-age=1209600, no-transform',
            },
        }),
    ]