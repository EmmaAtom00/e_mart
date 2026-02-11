from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from drf_spectacular.utils import extend_schema_field
from drf_spectacular.types import OpenApiTypes
from django.contrib.auth import get_user_model
from .models import Cart, CartItem, Product, Category

User = get_user_model()

# ==================== USER SERIALIZERS ====================

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'avatar', 'email_verified']
        read_only_fields = ['id', 'email_verified']

class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True, min_length=6)
    
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password', 'password_confirm']
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords do not match"})
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        email = validated_data.get('email')
        
        # Generate username from email (use email prefix before @)
        username = email.split('@')[0]
        
        # Ensure username is unique
        counter = 1
        original_username = username
        while User.objects.filter(username=username).exists():
            username = f"{original_username}{counter}"
            counter += 1
        
        user = User.objects.create_user(
            username=username,
            password=password,
            **validated_data
        )
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        data['user'] = {
            'id': str(user.id),
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': user.role,
            'avatar': user.avatar,
        }
        return data

# ==================== PRODUCT SERIALIZERS ====================

class ProductListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "name", "slug", "description", "image", "sale_price", "price", "discount", "rating", "reviews_count"]

class ProductDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'image', 'description', 'price', 'discount', 'sale_price', 'slug', 'stock', 'rating', 'reviews_count', 'featured', 'category']

# ==================== CATEGORY SERIALIZERS ====================

class CategoryListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "image", 'slug']

class CategoryDetailSerializer(serializers.ModelSerializer):
    products = ProductListSerializer(many=True, read_only=True)
    class Meta:
        model = Category
        fields = ["id", "name", "image", "products", "slug"]

# ==================== CART SERIALIZERS ====================

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    sub_total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'sub_total']
    
    @extend_schema_field(OpenApiTypes.FLOAT)
    def get_sub_total(self, cartitem):
        return float(cartitem.product.sale_price * cartitem.quantity)

class CartSerializer(serializers.ModelSerializer):
    cartitems = CartItemSerializer(read_only=True, many=True)
    cart_total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'cart_code', 'cartitems', 'cart_total']

    @extend_schema_field(OpenApiTypes.FLOAT)
    def get_cart_total(self, cart):
        return sum(item.quantity * item.product.sale_price for item in cart.cartitems.all())

class CartStatSerializer(serializers.ModelSerializer):
    total_quantity = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'cart_code', 'total_quantity']

    def get_total_quantity(self, cart):
        return sum(item.quantity for item in cart.cartitems.all())
