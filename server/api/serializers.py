from rest_framework.serializers import ModelSerializer, SlugRelatedField, SerializerMethodField
from .models import Post, UserProfile
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView




#  User Profile Summary to send with user Serializer
class UserProfileSummarySerializer(ModelSerializer):

    followers_count = SerializerMethodField()

    def get_followers_count(self, obj):
        return obj.following.count()
    class Meta:
        model = UserProfile
        fields = ["id", "followers_count", "profile_image"]
class UserSerializer(ModelSerializer):
    userprofile = UserProfileSummarySerializer()
    class Meta: 
        model = User
        fields = ["id" ,"username", "last_login", "first_name", "last_name", "email", "date_joined", "is_superuser", "userprofile"]



#  Main User Profile Serializer
class UserProfileSerializer(ModelSerializer):
    followers_count = SerializerMethodField()
    following_count = SerializerMethodField()
    user = UserSerializer(read_only=True)
    is_mine = SerializerMethodField()
    is_following = SerializerMethodField()
    posts_count = SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = ["id", "bio", "location", "birth_date", "profile_image", "followers_count","following_count", "user", "is_mine", "is_following", "posts_count"]

    def get_following_count(self, obj):
        return obj.following.count()

    def get_followers_count(self, obj):
        return User.objects.filter(userprofile__following=obj.user).count()

    def get_is_following(self , obj):
        req_user_id = self.context.get("request").user.id
        
        
        return obj.user.following.filter(user_id=req_user_id).exists()


    def get_is_mine(self, obj):
        return obj.user == self.context.get("request").user

    def get_posts_count(self, obj):
        return Post.objects.filter(user=obj.user).count()





class PostSerializer(ModelSerializer):
    likes_count = SerializerMethodField()
    is_liked = SerializerMethodField()
    is_mine = SerializerMethodField()
    is_following = SerializerMethodField()
    user = UserSerializer(read_only=True)
    user_id = SlugRelatedField(queryset=User.objects.all, slug_field="user", write_only=True)

    
    class Meta: 
        model = Post
        fields = '__all__'

    def get_is_following(self, obj):
        request = self.context.get('request')
        user = request.user if request else None
        if user:
            following = user.userprofile.following.all()
            return following.filter(id=obj.user.id).exists()
        return False
            

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