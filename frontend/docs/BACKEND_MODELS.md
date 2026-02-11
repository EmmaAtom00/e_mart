# Backend Models & Database Schema

## Overview

This document provides all Django models for backend development with PostgreSQL.

## User Model

### Django Model
```python
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import URLValidator

class User(AbstractUser):
    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('admin', 'Admin'),
        ('seller', 'Seller'),
    ]
    
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    avatar = models.URLField(blank=True, null=True)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='customer')
    is_active = models.BooleanField(default=True)
    email_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'users'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['role']),
        ]
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
```

### PostgreSQL Schema
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(150) UNIQUE NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  avatar VARCHAR(500),
  role VARCHAR(50) DEFAULT 'customer',
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_role ON users(role);
```

---

## Product Model

### Django Model
```python
class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.IntegerField(default=0)  # percentage
    sale_price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.URLField(blank=True, null=True)
    images = models.JSONField(default=list, blank=True)  # list of image URLs
    category = models.ForeignKey('Category', on_delete=models.SET_NULL, null=True, related_name='products')
    subcategory = models.CharField(max_length=100, blank=True, null=True)
    stock = models.IntegerField(default=0)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    reviews_count = models.IntegerField(default=0)
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')
    sku = models.CharField(max_length=100, unique=True)
    tags = models.JSONField(default=list, blank=True)  # list of tags
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'products'
        indexes = [
            models.Index(fields=['category']),
            models.Index(fields=['seller']),
            models.Index(fields=['sku']),
        ]
    
    def __str__(self):
        return self.name
```

### PostgreSQL Schema
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  discount INT DEFAULT 0,
  sale_price DECIMAL(10, 2) NOT NULL,
  image VARCHAR(500),
  images JSONB DEFAULT '[]',
  category_id INT REFERENCES categories(id),
  subcategory VARCHAR(100),
  stock INT DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0,
  reviews_count INT DEFAULT 0,
  seller_id INT REFERENCES users(id),
  sku VARCHAR(100) UNIQUE,
  tags JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_product_category ON products(category_id);
CREATE INDEX idx_product_seller ON products(seller_id);
CREATE INDEX idx_product_sku ON products(sku);
```

---

## Cart Model

### Django Model
```python
class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    grand_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'carts'
        indexes = [
            models.Index(fields=['user']),
        ]
    
    def __str__(self):
        return f"Cart for {self.user.email}"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.IntegerField(default=0)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'cart_items'
        indexes = [
            models.Index(fields=['cart']),
        ]
    
    def __str__(self):
        return f"{self.product.name} x {self.quantity}"
```

### PostgreSQL Schema
```sql
CREATE TABLE carts (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE REFERENCES users(id),
  total DECIMAL(10, 2) DEFAULT 0,
  tax DECIMAL(10, 2) DEFAULT 0,
  shipping DECIMAL(10, 2) DEFAULT 0,
  grand_total DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  cart_id INT REFERENCES carts(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id),
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  discount INT DEFAULT 0,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cart_user ON carts(user_id);
CREATE INDEX idx_cart_item_cart ON cart_items(cart_id);
```

---

## Order Model

### Django Model
```python
class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('credit_card', 'Credit Card'),
        ('debit_card', 'Debit Card'),
        ('paypal', 'PayPal'),
        ('bank_transfer', 'Bank Transfer'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    tax = models.DecimalField(max_digits=10, decimal_places=2)
    shipping = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    payment_method = models.CharField(max_length=50, choices=PAYMENT_METHOD_CHOICES, blank=True, null=True)
    payment_status = models.CharField(max_length=50, choices=PAYMENT_STATUS_CHOICES, default='pending')
    tracking_number = models.CharField(max_length=100, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'orders'
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"Order #{self.id} - {self.user.email}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    product_name = models.CharField(max_length=255)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.IntegerField(default=0)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:
        db_table = 'order_items'
        indexes = [
            models.Index(fields=['order']),
        ]
    
    def __str__(self):
        return f"{self.product_name} x {self.quantity}"


class ShippingAddress(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='shipping_address')
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.CharField(max_length=500)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    
    class Meta:
        db_table = 'shipping_addresses'
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.address}"
```

### PostgreSQL Schema
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL,
  shipping DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'pending',
  tracking_number VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id),
  product_name VARCHAR(255),
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  discount INT DEFAULT 0,
  subtotal DECIMAL(10, 2) NOT NULL
);

CREATE TABLE shipping_addresses (
  id SERIAL PRIMARY KEY,
  order_id INT UNIQUE REFERENCES orders(id),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address VARCHAR(500) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL
);

CREATE INDEX idx_order_user ON orders(user_id);
CREATE INDEX idx_order_status ON orders(status);
CREATE INDEX idx_order_item_order ON order_items(order_id);
```

---

## Wishlist Model

### Django Model
```python
class Wishlist(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='wishlist')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'wishlists'
        indexes = [
            models.Index(fields=['user']),
        ]
    
    def __str__(self):
        return f"Wishlist for {self.user.email}"


class WishlistItem(models.Model):
    wishlist = models.ForeignKey(Wishlist, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'wishlist_items'
        unique_together = ('wishlist', 'product')
        indexes = [
            models.Index(fields=['wishlist']),
        ]
    
    def __str__(self):
        return f"{self.product.name} in {self.wishlist.user.email}'s wishlist"
```

### PostgreSQL Schema
```sql
CREATE TABLE wishlists (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wishlist_items (
  id SERIAL PRIMARY KEY,
  wishlist_id INT REFERENCES wishlists(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id),
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(wishlist_id, product_id)
);

CREATE INDEX idx_wishlist_user ON wishlists(user_id);
CREATE INDEX idx_wishlist_item_wishlist ON wishlist_items(wishlist_id);
```

---

## Review Model

### Django Model
```python
class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    title = models.CharField(max_length=255, blank=True, null=True)
    comment = models.TextField()
    helpful = models.IntegerField(default=0)
    unhelpful = models.IntegerField(default=0)
    is_verified_purchase = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'reviews'
        indexes = [
            models.Index(fields=['product']),
            models.Index(fields=['user']),
        ]
    
    def __str__(self):
        return f"Review by {self.user.email} for {self.product.name}"
```

### PostgreSQL Schema
```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id),
  user_id INT REFERENCES users(id),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  helpful INT DEFAULT 0,
  unhelpful INT DEFAULT 0,
  is_verified_purchase BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_review_product ON reviews(product_id);
CREATE INDEX idx_review_user ON reviews(user_id);
```

---

## Category Model

### Django Model
```python
class Category(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True, null=True)
    image = models.URLField(blank=True, null=True)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subcategories')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'categories'
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['parent']),
        ]
        verbose_name_plural = 'Categories'
    
    def __str__(self):
        return self.name
```

### PostgreSQL Schema
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image VARCHAR(500),
  parent_id INT REFERENCES categories(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_category_slug ON categories(slug);
CREATE INDEX idx_category_parent ON categories(parent_id);
```

---

## Payment Model

### Django Model
```python
class Payment(models.Model):
    METHOD_CHOICES = [
        ('credit_card', 'Credit Card'),
        ('debit_card', 'Debit Card'),
        ('paypal', 'PayPal'),
        ('bank_transfer', 'Bank Transfer'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]
    
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    method = models.CharField(max_length=50, choices=METHOD_CHOICES)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    transaction_id = models.CharField(max_length=255, blank=True, null=True)
    error_message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'payments'
        indexes = [
            models.Index(fields=['order']),
            models.Index(fields=['user']),
        ]
    
    def __str__(self):
        return f"Payment for Order #{self.order.id} - {self.amount} {self.currency}"
```

### PostgreSQL Schema
```sql
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id),
  user_id INT REFERENCES users(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  method VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  transaction_id VARCHAR(255),
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payment_order ON payments(order_id);
CREATE INDEX idx_payment_user ON payments(user_id);
```

---

## API Response Models

### Django REST Framework Serializers

```python
from rest_framework import serializers

class ApiResponseSerializer(serializers.Serializer):
    """Standard API response format"""
    success = serializers.BooleanField()
    message = serializers.CharField()
    data = serializers.JSONField(required=False, allow_null=True)
    timestamp = serializers.DateTimeField()


class ApiErrorSerializer(serializers.Serializer):
    """Error response format"""
    success = serializers.BooleanField(default=False)
    message = serializers.CharField()
    error = serializers.CharField()
    status_code = serializers.IntegerField()
    timestamp = serializers.DateTimeField()


class PaginationSerializer(serializers.Serializer):
    """Pagination metadata"""
    page = serializers.IntegerField()
    limit = serializers.IntegerField()
    total = serializers.IntegerField()
    pages = serializers.IntegerField()


class PaginatedResponseSerializer(serializers.Serializer):
    """Paginated response format"""
    success = serializers.BooleanField()
    data = serializers.ListField()
    pagination = PaginationSerializer()
    timestamp = serializers.DateTimeField()
```

### Response Helper Functions

```python
from django.utils import timezone
from rest_framework.response import Response
from rest_framework import status

def success_response(data=None, message="Success", status_code=200):
    """Return a success response"""
    return Response({
        'success': True,
        'message': message,
        'data': data,
        'timestamp': timezone.now()
    }, status=status_code)


def error_response(message, error, status_code=400):
    """Return an error response"""
    return Response({
        'success': False,
        'message': message,
        'error': error,
        'status_code': status_code,
        'timestamp': timezone.now()
    }, status=status_code)


def paginated_response(data, page, limit, total):
    """Return a paginated response"""
    pages = (total + limit - 1) // limit
    return Response({
        'success': True,
        'data': data,
        'pagination': {
            'page': page,
            'limit': limit,
            'total': total,
            'pages': pages
        },
        'timestamp': timezone.now()
    })
```

---

## Database Relationships

```
Users (1) ──→ (Many) Orders
Users (1) ──→ (Many) Reviews
Users (1) ──→ (1) Cart
Users (1) ──→ (1) Wishlist
Users (1) ──→ (Many) Payments

Products (1) ──→ (Many) Orders (through OrderItems)
Products (1) ──→ (Many) Reviews
Products (1) ──→ (Many) CartItems
Products (1) ──→ (Many) WishlistItems

Categories (1) ──→ (Many) Products
Categories (1) ──→ (Many) Categories (self-referencing for subcategories)

Orders (1) ──→ (Many) OrderItems
Orders (1) ──→ (1) ShippingAddress
Orders (1) ──→ (1) Payment
```

---

## Django Setup Instructions

### 1. Create Django Models File
Create `backend/emart/models.py` and add all models above.

### 2. Create Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 3. Create Django Admin
```python
# backend/emart/admin.py
from django.contrib import admin
from .models import User, Product, Cart, CartItem, Order, OrderItem, ShippingAddress, Wishlist, WishlistItem, Review, Category, Payment

admin.site.register(User)
admin.site.register(Product)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)
admin.site.register(Wishlist)
admin.site.register(WishlistItem)
admin.site.register(Review)
admin.site.register(Category)
admin.site.register(Payment)
```

### 4. Create Serializers
Create `backend/emart/serializers.py` with DRF serializers for each model.

### 5. Create ViewSets
Create `backend/emart/views.py` with ViewSets for CRUD operations.

### 6. Create URLs
Create `backend/emart/urls.py` with router configuration.

---

**Ready for Django backend development!**
