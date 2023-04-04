from django.urls import path
from  . import views
from rest_framework_simplejwt.views import TokenRefreshView
from .serializers import MyTokenObtainPairView

urlpatterns = [
    path("", views.getRoutes),
    path("auth/token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_pair_view"),
    path("posts/", views.getPosts, name="get_posts")
]

