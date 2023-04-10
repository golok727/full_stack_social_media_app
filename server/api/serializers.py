from rest_framework.serializers import ModelSerializer, SlugRelatedField, SerializerMethodField
from .models import Post, Tag
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
class UserSerializer(ModelSerializer):
    class Meta: 
        model = User
        fields = ["id" ,"username", "last_login", "first_name", "last_name", "email", "date_joined", "is_superuser"]

class TagSerializer(ModelSerializer):
    class Meta: 
        model = Tag
        fields = "__all__"

class PostSerializer(ModelSerializer):
    likes_count = SerializerMethodField()
    is_liked = SerializerMethodField()
    is_mine = SerializerMethodField()

    user = UserSerializer(read_only=True)
    user_id = SlugRelatedField(queryset=User.objects.all, slug_field="user", write_only=True)
    
    tags = TagSerializer(Tag, many=True, read_only=True)
    class Meta: 
        model = Post
        fields = '__all__'


    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_is_liked(self , obj):
        req_user_id = self.context.get("request").user.id
        return obj.likes.filter(id=req_user_id).exists()
    
    def get_is_mine(self, obj):
        return obj.user == self.context.get("request").user



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super(MyTokenObtainPairSerializer, cls).get_token(user)

        token['username'] = user.username
        token['is_superuser'] = user.is_superuser
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer