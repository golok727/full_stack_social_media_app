from django.db import models
from django.contrib.auth.models import User
import os 
from uuid import uuid4
from PIL import Image

from django.utils.deconstruct import deconstructible
from django.db.models.signals import post_save
from django.dispatch import receiver

# make the path for the new file and rename it with uuid
@deconstructible
class PathAndRename:
    def __init__(self, sub_path):
        self.path = sub_path
    
    def __call__(self, instance, filename):
        ext = filename.split(".")[-1]
        filename = f"{uuid4().hex}.{ext}"
        return os.path.join(self.path, filename)

#  Post Model
class Post(models.Model):
    title= models.CharField(max_length=100, blank=True, null=True)
    description= models.TextField(blank=True, null=True)
    image  = models.ImageField(upload_to=PathAndRename("post_images"), blank=True, null=True)
    user = models.ForeignKey(User, blank=True, null=True,  on_delete=models.CASCADE, related_name='posts')
    likes = models.ManyToManyField(User, blank=True, related_name="liked_posts",  related_query_name='liked_post')
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self): 
        return self.title
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        with Image.open(self.image.path) as img:
            if img.width > 1080 or img.height > 1080:
                img.thumbnail((1080,1080), resample=Image.BICUBIC)
                img.save(self.image.path, optimize=True, quality=75)

    class Meta: 
        ordering =  ["-created"]
        verbose_name = 'Post'
        verbose_name_plural = 'Posts'

    

# UserProfile Model 

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=30, blank=True, null=True)
    birth_date = models.DateField(null=True, blank=True)
    profile_image = models.ImageField(upload_to=PathAndRename("profile_images"), blank=True, null=True)
    following = models.ManyToManyField(User, related_name='following', blank=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username

    def get_followers_count(self):
        return self.followers.count()

    def get_following_count(self):
        return self.following.count()

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.profile_image:
            with Image.open(self.profile_image.path) as img:
                if img.width > 500 or img.height > 500:
                    img.thumbnail((500, 500), resample=Image.BICUBIC)
                    img.save(self.profile_image.path, optimize=True, quality=85)


    class Meta:
        ordering = ['-id']


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.userprofile.save()


# Comment Model
class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    content = models.TextField()
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE)
    reply_to = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE, related_name='replies')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    likes = models.ManyToManyField(User, blank=True, related_name="liked_post_comment",  related_query_name='liked_post_comment')
    pinned = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.content[:20]}... ({self.user.username})" 
    class Meta:
        ordering =  ["-pinned", "-created_at"]