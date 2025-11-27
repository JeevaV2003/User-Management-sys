from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from .models import User
from .serializers import UserSerializer
from rest_framework.authtoken.models import Token
import json # unused but kept for future

# Register API
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    # print(request.data) # debug
    
    # get data from request
    d = request.data
    
    # check if username already exists
    # if User.objects.get(username=d['username']):
    #     return error
    if User.objects.filter(username=d['username']).exists():
        return Response({'error': 'Username already taken'}, status=400)
    
    # students only
    d['role'] = 'student'
    
    # use serializer to save
    serializer = UserSerializer(data=d)
    if serializer.is_valid():
        serializer.save()
        print("New user registered: ", d['username']) # debug
        return Response({'message': 'User registered successfully'}, status=201)
    
    print("Serializer errors: ", serializer.errors)
    return Response(serializer.errors, status=400)

# Login API
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    uname = request.data.get('username')
    pword = request.data.get('password')
    
    print("Trying to login:", uname)
    
    # authenticate user
    u = authenticate(username=uname, password=pword)
    
    if u is not None:
        print("User logged in: ", uname)
        return Response({
            'message': 'Login successful',
            'user': {
                'id': u.id,
                'username': u.username,
                'role': u.role
            }
        }, status=200)
    else:
        print("Login failed for", uname)
        return Response({'error': 'Invalid credentials'}, status=400)

# Change Password
@api_view(['POST'])
# @permission_classes([IsAuthenticated]) 
def change_password(request):
    # getting inputs
    uname = request.data.get('username')
    old = request.data.get('old_password')
    new = request.data.get('new_password')
    
    try:
        u = User.objects.get(username=uname)
        # check if old pass is correct
        if u.check_password(old):
            u.set_password(new)
            u.save()
            print("Password changed for", uname)
            return Response({'message': 'Password changed successfully'}, status=200)
        else:
            return Response({'error': 'Wrong old password'}, status=400)
    except:
        return Response({'error': 'User not found'}, status=404)

# Admin: Get All Users
@api_view(['GET'])
def user_list(request):
    # TODO: add pagination later
    
    # just get all users from db
    all_users = User.objects.all()
    s = UserSerializer(all_users, many=True)
    return Response(s.data)

# Admin: Add New User
@api_view(['POST'])
def add_user(request):
    # getting data
    d = request.data
    print("Admin adding user:", d['username'])
    
    # check if username exists
    if User.objects.filter(username=d['username']).exists():
        return Response({'error': 'Username taken'}, status=400)
        
    # validate password manually
    pwd = d['password']
    if len(pwd) < 8:
        return Response({'error': 'Password is too short (min 8 chars)'}, status=400)
    if len(pwd) > 20:
        return Response({'error': 'Password is too long (max 20 chars)'}, status=400)
    
    # check complexity
    upper = False
    lower = False
    num = False
    for c in pwd:
        if c.isupper(): upper = True
        if c.islower(): lower = True
        if c.isdigit(): num = True
        
    if not upper:
        return Response({'error': 'Password needs at least one uppercase letter'}, status=400)
    if not lower:
        return Response({'error': 'Password needs at least one lowercase letter'}, status=400)
    if not num:
        return Response({'error': 'Password needs at least one number'}, status=400)
    
    # create user manually to handle password hashing
    try:
        u = User.objects.create_user(
            username=d['username'],
            email=d.get('email', ''),
            password=d['password'],
            role=d['role'] # admin can assign role
        )
        return Response({'message': 'User created'}, status=201)
    except Exception as e:
        print("Error creating user:", e)
        return Response({'error': 'Something went wrong'}, status=400)

# Admin: Delete User
@api_view(['DELETE'])
def delete_user(request, user_id):
    try:
        u = User.objects.get(id=user_id)
        u.delete()
        print("User deleted: ", user_id)
        return Response({'message': 'User deleted'}, status=200)
    except:
        print("Error deleting user")
        return Response({'error': 'User not found'}, status=404)
