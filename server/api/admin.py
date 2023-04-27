from django.contrib import admin
from .models import Post, UserProfile, Comment, SavedPost
# Register your models here.

admin.site.register(UserProfile)
admin.site.register(SavedPost)
admin.site.register(Post)
admin.site.register(Comment)

