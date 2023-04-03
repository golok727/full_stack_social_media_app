from rest_framework.serializers import ModelSerializer, SlugRelatedField
from .models import Post 
from django.contrib.auth.models import User

class UserSerializer(ModelSerializer):
    class Meta: 
        model = User
        fields = ["id" ,"username", "last_login", "first_name", "last_name", "email", "date_joined", "is_superuser"]

class PostSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = SlugRelatedField(queryset=User.objects.all, slug_field="user", write_only=True)

    class Meta: 
        model = Post
        fields = '__all__'


