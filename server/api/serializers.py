from rest_framework.serializers import ModelSerializer, SlugRelatedField, SerializerMethodField
from .models import Post 
from django.contrib.auth.models import User

class UserSerializer(ModelSerializer):
    class Meta: 
        model = User
        fields = ["id" ,"username", "last_login", "first_name", "last_name", "email", "date_joined", "is_superuser"]

class PostSerializer(ModelSerializer):
    likes_count = SerializerMethodField()
    user = UserSerializer(read_only=True)
    user_id = SlugRelatedField(queryset=User.objects.all, slug_field="user", write_only=True)

    class Meta: 
        model = Post
        fields = '__all__'

    def get_likes_count(self, obj):
        return obj.likes.count()


