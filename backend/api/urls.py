from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from . import views

urlpatterns = [
    # ==================== AUTHENTICATION ====================
    path('auth/login/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/signup/', views.signup, name='signup'),
    path('auth/me/', views.get_current_user, name='current_user'),
    path('auth/profile/', views.update_profile, name='update_profile'),
    path('auth/logout/', views.logout, name='logout'),
    
    # ==================== PRODUCTS ====================
    path('products/', views.ProductListView.as_view(), name="product_list"),
    path('products/<slug:slug>/', views.ProductDetailView.as_view(), name='product_detail'),
    
    # ==================== CATEGORIES ====================
    path('categories/', views.category_list, name="category_list"),
    path('categories/<slug:slug>/', views.category_detail, name='category_detail'),
    
    # ==================== CART ====================
    path('cart/add/', views.add_to_cart, name='add_to_cart'),
    path('cart/get/', views.get_cart, name='get_cart'),
    path('cart/remove/', views.remove_from_cart, name='remove_from_cart'),
    path('cart/update/', views.update_cart_item, name='update_cart_item'),
    path('cart/clear/', views.clear_cart, name='clear_cart'),

    # ==================== API DOCUMENTATION ====================
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]