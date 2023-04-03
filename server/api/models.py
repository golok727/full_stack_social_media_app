from django.db import models
from django.contrib.auth.models import User
class Post(models.Model):
    title= models.CharField(max_length=100, blank=True, null=True)
    description= models.TextField(blank=True, null=True)
    image  = models.ImageField(upload_to="post_images", blank=True)
    user = models.ForeignKey(User, blank=True, null=True,  on_delete=models.CASCADE)
    likes = models.ManyToManyField(User, blank=True, related_name="likes")
    created = models.DateTimeField(auto_now=True)
    updated = models.DateTimeField(auto_now_add=True)

    def __str__(self): 
        return self.title

    class Meta: 
        ordering =  ["-created"]
    