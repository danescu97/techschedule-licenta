from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Address

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'phone', 'role', 'profile_photo', 'created_at')
        read_only_fields = ('id', 'role', 'created_at')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password_confirm', 'first_name', 'last_name', 'phone')

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', '')
        )
        return user

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ('id', 'label', 'street', 'city', 'county', 'zip_code', 'is_default')
        read_only_fields = ('id',)

    def create(self, validated_data):
        user = validated_data.get('user', self.context['request'].user)
        validated_data['user'] = user
        if validated_data.get('is_default'):
            Address.objects.filter(user=user).update(is_default=False)
        return Address.objects.create(**validated_data)

    def update(self, instance, validated_data):
        if validated_data.get('is_default'):
            Address.objects.filter(user=instance.user).exclude(pk=instance.pk).update(is_default=False)
        return super().update(instance, validated_data)
