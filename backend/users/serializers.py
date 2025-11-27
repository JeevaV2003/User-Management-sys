from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # fields we want to show
        fields = ['id', 'username', 'email', 'role', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_password(self, value):
        # manual password check because I couldn't get the built-in one working with DRF
        if len(value) < 8:
            raise serializers.ValidationError("Password is too short (min 8 chars)")
        if len(value) > 20:
            raise serializers.ValidationError("Password is too long (max 20 chars)")
            
        has_upper = False
        has_lower = False
        has_num = False
        
        for char in value:
            if char.isupper():
                has_upper = True
            elif char.islower():
                has_lower = True
            elif char.isdigit():
                has_num = True
                
        if not has_upper:
            raise serializers.ValidationError("Password needs at least one uppercase letter")
        if not has_lower:
            raise serializers.ValidationError("Password needs at least one lowercase letter")
        if not has_num:
            raise serializers.ValidationError("Password needs at least one number")
            
        return value

    def create(self, validated_data):
        # create user with hashed password
        u = User.objects.create_user(**validated_data)
        return u
