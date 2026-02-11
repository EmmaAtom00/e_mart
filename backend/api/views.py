from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import generics, status, viewsets
from rest_framework.filters import OrderingFilter, SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .models import Cart, CartItem, Category, Product
from .filters import ProductFilter
from .serializers import (
    CartSerializer, 
    CategoryDetailSerializer, 
    CategoryListSerializer, 
    ProductListSerializer, 
    ProductDetailSerializer,
    UserSerializer,
    SignUpSerializer,
    CustomTokenObtainPairSerializer,
)

User = get_user_model()

# ==================== AUTHENTICATION VIEWS ====================

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Login endpoint that returns access and refresh tokens along with user data.
    """
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]


@extend_schema(request=SignUpSerializer, responses={201: SignUpSerializer})
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    """
    Register a new user and return tokens.
    """
    serializer = SignUpSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data,
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(responses={200: UserSerializer})
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """
    Get the current authenticated user's profile.
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@extend_schema(request=UserSerializer, responses={200: UserSerializer})
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """
    Update the current user's profile.
    """
    user = request.user
    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    request={'application/json': {'type': 'object', 'properties': {'refresh': {'type': 'string'}}}},
    responses={200: {'type': 'object', 'properties': {'message': {'type': 'string'}}}}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """
    Logout endpoint that blacklists the refresh token.
    """
    try:
        refresh_token = request.data.get("refresh")
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# ==================== PRODUCT VIEWS ====================

class ProductListView(generics.ListAPIView):
    """
    Returns a list of all products with filtering, sorting, and pagination.
    Filtering: ?category=<slug>&featured=true
    Sorting: ?ordering=price or ?ordering=-price
    """
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at']
    ordering = ['-created_at']


class ProductDetailView(generics.RetrieveAPIView):
    """
    Returns details of a single product identified by its slug.
    """
    queryset = Product.objects.all()
    serializer_class = ProductDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


# ==================== CATEGORY VIEWS ====================

@extend_schema(responses={200: CategoryListSerializer(many=True)})
@api_view(['GET'])
@permission_classes([AllowAny])
def category_list(request):
    """
    Returns a list of all categories.
    """
    categories = Category.objects.all()
    serializer = CategoryListSerializer(categories, many=True)
    return Response(serializer.data)


@extend_schema(responses={200: CategoryDetailSerializer})
@api_view(['GET'])
@permission_classes([AllowAny])
def category_detail(request, slug):
    """
    Returns details of a single category along with its products.
    """
    category = get_object_or_404(Category, slug=slug)
    serializer = CategoryDetailSerializer(category)
    return Response(serializer.data)


# ==================== CART VIEWS ====================

@extend_schema(
    request={'application/json': {
        'type': 'object', 
        'properties': {
            'cart_code': {'type': 'string'},
            'product_id': {'type': 'integer'},
            'quantity': {'type': 'integer', 'default': 1}
        },
        'required': ['cart_code', 'product_id']
    }},
    responses={200: CartSerializer}
)
@api_view(['POST'])
@permission_classes([AllowAny])
def add_to_cart(request):
    """
    Add a product to a cart identified by cart_code.
    If the cart does not exist, it will be created.
    If the product already exists in the cart, its quantity is incremented.
    """
    cart_code = request.data.get("cart_code")
    product_id = request.data.get("product_id")
    quantity = request.data.get("quantity", 1)

    # Validate input
    if not cart_code or not product_id:
        return Response(
            {"error": "cart_code and product_id are required"}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        quantity = int(quantity)
        if quantity <= 0:
            return Response({"error": "Quantity must be greater than zero"}, status=status.HTTP_400_BAD_REQUEST)
    except (ValueError, TypeError):
        return Response({"error": "Invalid quantity format"}, status=status.HTTP_400_BAD_REQUEST)

    # Fetch or create the cart
    cart, _ = Cart.objects.get_or_create(cart_code=cart_code)

    # Fetch the product or return 404
    product = get_object_or_404(Product, id=product_id)

    # Fetch the cart item if it exists, otherwise create it
    cartitem, created = CartItem.objects.get_or_create(product=product, cart=cart)
    
    if not created:
        # If the item already exists, increment quantity
        cartitem.quantity += quantity
    else:
        # If new item, set quantity
        cartitem.quantity = quantity

    cartitem.save()

    # Serialize the updated cart and return
    serializer = CartSerializer(cart)
    return Response(serializer.data, status=status.HTTP_200_OK)


@extend_schema(
    parameters=[
        OpenApiParameter(name='cart_code', type=OpenApiTypes.STR, location=OpenApiParameter.QUERY, required=True, description='The unique code for the cart')
    ],
    responses={200: CartSerializer}
)
@api_view(['GET'])
@permission_classes([AllowAny])
def get_cart(request):
    """
    Get cart details by cart_code.
    """
    cart_code = request.query_params.get("cart_code")
    
    if not cart_code:
        return Response(
            {"error": "cart_code is required"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    cart = get_object_or_404(Cart, cart_code=cart_code)
    serializer = CartSerializer(cart)
    return Response(serializer.data)


@extend_schema(
    request={'application/json': {
        'type': 'object', 
        'properties': {
            'cart_code': {'type': 'string'},
            'product_id': {'type': 'integer'}
        },
        'required': ['cart_code', 'product_id']
    }},
    responses={200: CartSerializer}
)
@api_view(['DELETE'])
@permission_classes([AllowAny])
def remove_from_cart(request):
    """
    Remove a product from cart.
    """
    cart_code = request.data.get("cart_code")
    product_id = request.data.get("product_id")
    
    if not cart_code or not product_id:
        return Response(
            {"error": "cart_code and product_id are required"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    cart = get_object_or_404(Cart, cart_code=cart_code)
    cartitem = get_object_or_404(CartItem, cart=cart, product_id=product_id)
    cartitem.delete()
    
    serializer = CartSerializer(cart)
    return Response(serializer.data)


@extend_schema(
    request={'application/json': {
        'type': 'object', 
        'properties': {
            'cart_code': {'type': 'string'},
            'product_id': {'type': 'integer'},
            'quantity': {'type': 'integer'}
        },
        'required': ['cart_code', 'product_id', 'quantity']
    }},
    responses={200: CartSerializer}
)
@api_view(['PATCH'])
@permission_classes([AllowAny])
def update_cart_item(request):
    """
    Update quantity of a product in cart.
    """
    cart_code = request.data.get("cart_code")
    product_id = request.data.get("product_id")
    quantity = request.data.get("quantity")
    
    if not cart_code or not product_id or quantity is None:
        return Response(
            {"error": "cart_code, product_id, and quantity are required"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        quantity = int(quantity)
    except (ValueError, TypeError):
        return Response({"error": "Invalid quantity format"}, status=status.HTTP_400_BAD_REQUEST)
    
    cart = get_object_or_404(Cart, cart_code=cart_code)
    cartitem = get_object_or_404(CartItem, cart=cart, product_id=product_id)
    
    if quantity <= 0:
        cartitem.delete()
    else:
        cartitem.quantity = quantity
        cartitem.save()
    
    serializer = CartSerializer(cart)
    return Response(serializer.data)


@extend_schema(
    request={'application/json': {
        'type': 'object', 
        'properties': {
            'cart_code': {'type': 'string'}
        },
        'required': ['cart_code']
    }},
    responses={200: CartSerializer}
)
@api_view(['DELETE'])
@permission_classes([AllowAny])
def clear_cart(request):
    """
    Clear all items from a cart.
    """
    cart_code = request.data.get("cart_code")
    
    if not cart_code:
        return Response(
            {"error": "cart_code is required"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    cart = get_object_or_404(Cart, cart_code=cart_code)
    CartItem.objects.filter(cart=cart).delete()
    
    serializer = CartSerializer(cart)
    return Response(serializer.data)
