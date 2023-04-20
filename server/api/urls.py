from django.urls import path
from  . import views
# from rest_framework_simplejwt.views import TokenRefreshView
# from .serializers import MyTokenObtainPairView

urlpatterns = [
    path("", views.getRoutes),
    # path("auth/token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/register/", views.registerUser, name="register_view"),
    path("auth/login/", views.loginUser, name="login_view"),
    path("auth/logout/", views.logoutUser, name="logout_view"),
    path("auth/token/refresh/", views.refreshTokens, name="token_refresh"),
    path("posts/", views.getPosts, name="get_posts"),
    path("posts/<str:postId>", views.getPostById, name="get_post_by_id"),
    path("posts/like/<str:pk>", views.likePostView, name="like_post"),
    path("posts/user/<str:username>", views.getPostsByUser, name="get_all_posts_by_user"),

    path("posts/comment/<str:postId>", views.commentsView, name="comments_view"),
    
    path("users/profile/<str:username>", views.getUserProfile, name="user_profile"),
    path("users/follow/<str:userid>", views.followUser, name="follow_user"),
    path("users/unfollow/<str:userid>", views.unFollowUser, name="unfollow_user"),




]

