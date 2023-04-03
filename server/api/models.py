from django.db import models
from django.contrib.auth.models import User
import os 
from uuid import uuid4
from PIL import Image
from io import BytesIO
from django.core.files import File
#  From Stack Overflow


 
def path_rename(instance, filename):
    upload_to = 'post_images'
    ext = filename.split('.')[-1]
    if instance.pk:
        filename = '{}.{}'.format(instance.pk, ext)
    else:
        # set filename as random string
        filename = '{}.{}'.format(uuid4().hex, ext)
    # return the whole path to the file
    return os.path.join(upload_to, filename)

def compress_image( image):
    img = Image.open(image)
    img.thumbnail((1080,1080))
    im_io = BytesIO()
    
    img.save(im_io, "jpeg", quality=70, optimize=True)
    new_image = File(im_io, name=image.name)
    return new_image

class Post(models.Model):
    title= models.CharField(max_length=100, blank=True, null=True)
    description= models.TextField(blank=True, null=True)
    image  = models.ImageField(upload_to=path_rename, blank=True, null=True)
    user = models.ForeignKey(User, blank=True, null=True,  on_delete=models.CASCADE)
    likes = models.ManyToManyField(User, blank=True, related_name="likes")
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self): 
        return self.title

    def save(self,*args, **kwargs):
        
        new_image = compress_image(self.image)
        self.image = new_image
        super(Post, self).save(*args, **kwargs)



    class Meta: 
        ordering =  ["-created"]





