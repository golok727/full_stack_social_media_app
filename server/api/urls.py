from django.urls import path
from  . import views

urlpatterns = [
    path("", views.getRoutes),
    path("auth/register/", views.registerUser, name="register_view"),
    path("auth/login/", views.loginUser, name="login_view"),
    path("auth/logout/", views.logoutUser, name="logout_view"),
    path("auth/token/refresh/", views.refreshTokens, name="token_refresh"),
    path("posts/", views.getPosts, name="get_posts"),
    path("posts/<str:postId>", views.getPostById, name="get_post_by_id"),
    path("posts/like/<str:pk>", views.likePostView, name="like_post"),
    path("posts/user/<str:username>", views.getPostsByUser, name="get_all_posts_by_user"),
    path("posts/saved/", views.savedPostsView, name="saved_posts"),

    # Add new comment to a post specifications in the views file {parent: for parent comment, content: content of teh comment, reply_to for replying to a comment}
    path("posts/<str:postId>/comments/add", views.commentsView, name="comments_view_add_comment"),
    #
    path("posts/<str:postId>/comments/", views.commentsView, name="comments_view_get_comments"),
    path("posts/comments/<str:commentId>/replies", views.getCommentReplies, name="comments_view"),


    path("comment/<str:pk>/like/", views.likeCommentView, name="like_comment"),
    path("comment/<str:pk>/dislike/", views.dislikeCommentView, name="dislike_comment"),


    path("comments/<str:pk>", views.commentUpdateView, name="update_co"),
    
    
    path("users/profile/<str:username>", views.getUserProfile, name="user_profile"),
    path("users/follow/<str:userid>", views.followUser, name="follow_user"),
    path("users/unfollow/<str:userid>", views.unFollowUser, name="unfollow_user"),




]

