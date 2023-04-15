from django.db import models
from django.contrib.auth.models import User
import os 
from uuid import uuid4
from PIL import Image
# from io import BytesIO
# from django.core.files import File
from django.utils.deconstruct import deconstructible
#  From Stack Overflow


 
# def path_rename(instance, filename):
#     upload_to = 'post_images'
#     ext = filename.split('.')[-1]
#     if instance.pk:
#         filename = '{}.{}'.format(instance.pk, ext)
#     else:
#         # set filename as random string
#         filename = '{}.{}'.format(uuid4().hex, ext)
#     # return the whole path to the file
#     return os.path.join(upload_to, filename)

# def compress_image( image):
#     img = Image.open(image)
#     img.thumbnail((1080,1080))
#     im_io = BytesIO()
    
#     img.save(im_io, "jpeg", quality=70, optimize=True)
#     new_image = File(im_io, name=image.name)
#     return new_image

@deconstructible
class PathAndRename:
    def __init__(self, sub_path):
        self.path = sub_path
    
    def __call__(self, instance, filename):
        ext = filename.split(".")[-1]
        filename = f"{uuid4().hex}.{ext}"
        return os.path.join(self.path, filename)




class Post(models.Model):
    title= models.CharField(max_length=100, blank=True, null=True)
    description= models.TextField(blank=True, null=True)
    image  = models.ImageField(upload_to=PathAndRename("post_images"), blank=True, null=True)
    user = models.ForeignKey(User, blank=True, null=True,  on_delete=models.CASCADE, related_name='posts')
    likes = models.ManyToManyField(User, blank=True, related_name="liked_posts",  related_query_name='liked_post',)
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


    # def save(self,*args, **kwargs):
    #     if not self.pk:
    #         new_image = compress_image(self.image)
    #         self.image = new_image
    #     super(Post, self).save(*args, **kwargs)

    class Meta: 
        ordering =  ["-created"]
        verbose_name = 'Post'
        verbose_name_plural = 'Posts'

    



