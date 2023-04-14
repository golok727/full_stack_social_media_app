import jwt
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from .models import Post
from .serializers import PostSerializer, UserSerializer
from django.contrib.auth.models import User



from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken, BlacklistedToken, OutstandingToken




@api_view(["POST"])
def registerUser(request):

    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if not username or not email or not password:
        return Response({"msg": "Please provide all required fields {username, password, email}"}, status=status.HTTP_400_BAD_REQUEST)


    if User.objects.filter(username=username).exists():
        return Response({"msg": "Username already exists"}, status=status.HTTP_409_CONFLICT)

    if User.objects.filter(email=email).exists():
        return Response({"msg": "Email already exists"}, status=status.HTTP_409_CONFLICT)
    
    # Create user in database
    try:
        user = User.objects.create_user(username=username, email=email, password=password)
        
        return Response({"msg": "User created", "user": UserSerializer(user).data}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"msg": f"Error creating user: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(["POST"])
@permission_classes([AllowAny])
def loginUser(request):
    username = request.data.get("username", None)
    password = request.data.get("password", None)

    if username is None or password is None:
        return Response({"message": "Both username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, username=username, password=password)

    if user is None:
        return Response({"message": "Invalid username or password."}, status=status.HTTP_401_UNAUTHORIZED)

    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)

    user_serializer = UserSerializer(user)
    response_data = {"access": access_token, "user": user_serializer.data}
    response = Response(response_data, status=status.HTTP_200_OK)

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
        samesite="Lax",
        httponly=True
    )

    return response
@api_view(["POST"])
def logoutUser(request):
    response = Response({'message': 'Logout successful'})
    refresh_token = request.COOKIES.get('refresh_token')
    if refresh_token:
        token = RefreshToken(refresh_token)
        token.blacklist()
        

    response.delete_cookie('refresh_token')

    return response

@api_view(["POST"])
def refreshTokens(request):

    refresh_token = request.COOKIES.get("refresh_token")

    if(refresh_token):
        try:
            # BlacklistedToken.check_blacklist(refresh_token)
            refresh_token = RefreshToken(refresh_token)
            access_token = str(refresh_token.access_token)
            user_decode = jwt.decode(access_token, settings.SECRET_KEY, algorithms=["HS256"])
            user_obj = User.objects.get(id=user_decode["id"])
            user = UserSerializer(user_obj).data 

            response =  Response({"access": access_token, "user": user})

            return response

        except TokenError:
            print("Bad")
            response = Response({"error": "Refresh Token is BlackListed"}, status=status.HTTP_400_BAD_REQUEST)
            response.delete_cookie('refresh_token')    
            return response

        # except Exception as e:
        #     return Response({'message': str(e)})
          
    else:
        
       return Response({"error": "Refresh token not found"}, status=status.HTTP_403_FORBIDDEN)





@api_view(["GET"])
def getRoutes(request): 
    routes = [
        {
          "path": "api/",
          "method": "GET",
        }
    ]
    return Response(routes)

@api_view(['GET', 'POST'])
@parser_classes((MultiPartParser, FormParser))
@permission_classes([IsAuthenticated])
def getPosts(request):
    if request.method == "GET":
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True, context={"request": request})

        return Response(serializer.data)

    if request.method == "POST": 
        # print(request.data)
        # serializer = PostSerializer(data=request.data)

        # if serializer.is_valid():
        #     serializer.save()
        # else :
            # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = request.data

        title = data.get("title")
        description = data.get("description")
        image = data.get("image")

        
        #TODO change user to request user
        new_post = Post.objects.create(title=title, description=description, image=image, user=request.user)

        serializer = PostSerializer(new_post, context={"request": request})

        return Response({"msg": "Post Created", "data": serializer.data})


        # return Response({"status":"Post created"}, status=status.HTTP_201_CREATED)



