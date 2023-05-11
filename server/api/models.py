from django.db import models
from django.utils.text import slugify
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

class Tag(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slug= models.SlugField(max_length=255, unique=True)

    def save(self,*args, **kwargs):
        self.slug = slugify(self.name)
        return super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name


#  Post Model
class Post(models.Model):
    title= models.CharField(max_length=100, blank=True, null=True)
    description= models.TextField(blank=True, null=True)
    image  = models.ImageField(upload_to=PathAndRename("post_images"), blank=True, null=True)
    user = models.ForeignKey(User, blank=True, null=True,  on_delete=models.CASCADE, related_name='posts')
    likes = models.ManyToManyField(User, blank=True, related_name="liked_posts",  related_query_name='liked_post')
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    tags = models.ManyToManyField(Tag, blank=True)

    def __str__(self): 
        return self.title
    
    def save(self, *args, **kwargs):
        is_new_post = not self.pk  # Check if it's a new post

        super().save(*args, **kwargs)  # Save the instance to generate an ID

        if is_new_post:  # If it's a new post, update the tags
            self._parse_and_update_tags()
        else:  # If it's an existing post, update the tags on update
            self._update_tags_on_update()

        if self.image and is_new_post:  # If it's a new post and image is present
            self._compress_image_as_webp()


    def _parse_and_update_tags(self):
        tags = self._extract_tags_from_description()
        self.tags.clear()  # Remove existing tags
        for tag_name in tags:
            tag, _ = Tag.objects.get_or_create(name=tag_name)
            self.tags.add(tag)

    def _update_tags_on_update(self):
        existing_tags = set(self.tags.values_list('name', flat=True))
        new_tags = set(self._extract_tags_from_description())

        tags_to_remove = existing_tags - new_tags
        tags_to_add = new_tags - existing_tags

        # Remove tags that are no longer present in the description
        for tag_name in tags_to_remove:
            tag = Tag.objects.get(name=tag_name)
            self.tags.remove(tag)

        # Add new tags found in the updated description
        for tag_name in tags_to_add:
            tag, _ = Tag.objects.get_or_create(name=tag_name)
            self.tags.add(tag)

    def _extract_tags_from_description(self):
        return [tag.strip('#') for tag in self.description.split() if tag.startswith('#')]

    def _compress_image_as_webp(self):
        # Open the uploaded image using PIL
        image = Image.open(self.image.path)

        # Set the maximum dimension for resizing the image
        max_dimension = 500

        # Resize the image if it exceeds the maximum dimension
        if image.width > max_dimension or image.height > max_dimension:
            image.thumbnail((max_dimension, max_dimension), resample=Image.BICUBIC)

        # Convert the image to WebP format with compression
        image.save(self.image.path, "WEBP", method=6, quality=90)
    class Meta: 
        ordering =  ["-created"]
        verbose_name = 'Post'
        verbose_name_plural = 'Posts'

    

# UserProfile Model 
ACCOUNT_TYPE_CHOICES = [
    ('Artist', 'Artist'),
    ('Entrepreneur', 'Entrepreneur'),
    ('Doctor', 'Doctor'),
    ('Engineer', 'Engineer'),
    ('Influencer', 'Influencer'),
    ('Designer', 'Designer'),
    ('Photographer', 'Photographer'),
    ('Writer', 'Writer'),
    ('Musician', 'Musician'),
    ('Chef', 'Chef'),
    ('Athlete', 'Athlete'),
    ('Teacher', 'Teacher'),
    ('Scientist', 'Scientist'),
    ('Lawyer', 'Lawyer'),
    ('Student', 'Student'),
    ('Investor', 'Investor'),
    ('Freelancer', 'Freelancer'),
    ('Journalist', 'Journalist'),
    ('Consultant', 'Consultant'),
    ('Traveler', 'Traveler'),
]
GENDER_CHOICES = [
    ('Prefer Not To Say', 'Prefer Not To Say'),
    ('Male', 'Male'),
    ('Female', 'Female'),
]
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=30, blank=True, null=True)
    birth_date = models.DateField(null=True, blank=True)
    profile_image = models.ImageField(upload_to=PathAndRename("profile_images"), blank=True, null=True)
    following = models.ManyToManyField(User, related_name='following', blank=True)
    is_verified = models.BooleanField(default=False)
    gender = models.CharField(
        max_length=20,
        choices=GENDER_CHOICES,
        default="Prefer Not To Say"
    )
    close_friends = models.ManyToManyField(User, blank=True, related_name='close_friends')

    account_type = models.CharField(
        max_length=20,
        choices=ACCOUNT_TYPE_CHOICES,
        default=None,
        blank=True,
        null=True
    )

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

class SavedPost(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE,  )
    post = models.ForeignKey('Post', on_delete=models.CASCADE)

    def __str__(self):
        return self.post.title[:10] + " (" +  self.user_profile.user.username + " )"



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
