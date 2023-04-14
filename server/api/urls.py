from django.urls import path
from  . import views
from rest_framework_simplejwt.views import TokenRefreshView
from .serializers import MyTokenObtainPairView

urlpatterns = [
    path("", views.getRoutes),
    # path("auth/token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/register/", views.registerUser, name="register_view"),
    path("auth/login/", views.loginUser, name="login_view"),
    path("auth/logout/", views.logoutUser, name="logout_view"),
    path("auth/token/refresh/", views.refreshTokens, name="token_refresh"),
    path("posts/", views.getPosts, name="get_posts"),
    path("posts/like/<str:pk>", views.likePostView, name="like_post")
]

