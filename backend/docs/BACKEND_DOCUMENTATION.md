# E-Mart Backend Documentation

Complete documentation for the Django REST API backend.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Setup](#project-setup)
3. [Models](#models)
4. [API Endpoints](#api-endpoints)
5. [Authentication](#authentication)
6. [Database](#database)
7. [Admin Panel](#admin-panel)
8. [Error Handling](#error-handling)
9. [Best Practices](#best-practices)
10. [Deployment](#deployment)

## Architecture Overview

### Technology Stack
- **Framework**: Django 6.0.2
- **API**: Django REST Framework 3.14.0
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **Python**: 3.13

### Project Structure
```
backend/
├── api/                    # Main app
│   ├── models.py          # Database models
│   ├── views.py           # API views
│   ├── serializers.py     # DRF serializers
│   ├── urls.py            # URL routing
│   ├── admin.py           # Admin configuration
│   ├── apps.py            # App configuration
│   ├── tests.py           # Unit tests
│   └── migrations/        # Database migrations
├── emartApi/              # Project settings
│   ├── settings.py        # Django settings
│   ├── urls.py            # Main URL config
│   ├── asgi.py            # ASGI config
│   └── wsgi.py            # WSGI config
├── manage.py              # Django CLI
├── requirements.txt       # Python dependencies
└── db.sqlite3            # SQLite database
```

## Project Setup

### 1. Environment Setup

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt
```

### 2. Database Setup

```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### 3. Run Development Server

```bash
python manage.py runserver
```

Server runs on `http://localhost:8000`

## Models

### CustomUser Model

Extends Django's AbstractUser with additional fields.

```python
class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('admin', 'Admin'),
        ('seller', 'Seller'),
    ]
    
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    avatar = models.URLField(null=True, blank=True)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='customer')
    email_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

**Fields**:
- `email`: Unique email address
- `first_name`: User's first name
- `last_name`: User's last name
- `avatar`: URL to user's profile picture
- `role`: User role (customer, admin, seller)
- `email_verified`: Email verification status
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

### Category Model

Product categories for organization.

```python
class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    slug = models.SlugField(unique=True)
    image = models.ImageField(upload_to='category_img')
    created_at = models.DateTimeField(auto_now_add=True)
```

**Fields**:
- `name`: Category name
- `description`: Category description
- `slug`: URL-friendly identifier (auto-generated)
- `image`: Category image
- `created_at`: Creation timestamp

### Product Model

Individual products in the catalog.

```python
class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.IntegerField(default=0)
    slug = models.SlugField(unique=True)
    image = models.ImageField(upload_to='products/')
    sale_price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL)
    stock = models.IntegerField(default=0)
    rating = models.FloatField(default=0)
    reviews_count = models.IntegerField(default=0)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

**Fields**:
- `name`: Product name
- `description`: Product description
- `price`: Original price
- `discount`: Discount percentage
- `sale_price`: Calculated price after discount
- `slug`: URL-friendly identifier
- `image`: Product image
- `category`: Foreign key to Category
- `stock`: Available quantity
- `rating`: Average rating (0-5)
- `reviews_count`: Number of reviews
- `featured`: Whether product is featured
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Cart Model

Shopping cart for users.

```python
class Cart(models.Model):
    cart_code = models.CharField(max_length=11, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

**Fields**:
- `cart_code`: Unique identifier for cart
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### CartItem Model

Individual items in a cart.

```python
class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="cartitems")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
```

**Fields**:
- `cart`: Foreign key to Cart
- `product`: Foreign key to Product
- `quantity`: Number of items

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/signup/
Register a new user.

**Request**:
```json
{
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "password": "securepassword123",
  "password_confirm": "securepassword123"
}
```

**Response** (201):
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "customer",
    "avatar": null,
    "email_verified": false
  }
}
```

#### POST /api/auth/login/
Login user and get tokens.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response** (200):
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {...}
}
```

#### GET /api/auth/me/
Get current user profile.

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (200):
```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "customer",
  "avatar": null,
  "email_verified": false
}
```

#### PATCH /api/auth/profile/
Update user profile.

**Headers**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request**:
```json
{
  "first_name": "Jane",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response** (200):
```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "Jane",
  "last_name": "Doe",
  "role": "customer",
  "avatar": "https://example.com/avatar.jpg",
  "email_verified": false
}
```

#### POST /api/auth/refresh/
Refresh access token.

**Request**:
```json
{
  "refresh": "<refresh_token>"
}
```

**Response** (200):
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### POST /api/auth/logout/
Logout user.

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (200):
```json
{
  "message": "Logged out successfully"
}
```

### Product Endpoints

#### GET /api/products/
List all products.

**Query Parameters**:
- `featured=true` - Only featured products
- `category=<slug>` - Filter by category

**Response** (200):
```json
[
  {
    "id": 1,
    "name": "Product Name",
    "slug": "product-name",
    "description": "...",
    "image": "...",
    "sale_price": "79.99",
    "price": "99.99",
    "discount": 20,
    "rating": 4.5,
    "reviews_count": 10
  }
]
```

#### GET /api/products/<slug>/
Get product details.

**Response** (200):
```json
{
  "id": 1,
  "name": "Product Name",
  "slug": "product-name",
  "description": "...",
  "image": "...",
  "price": "99.99",
  "discount": 20,
  "sale_price": "79.99",
  "stock": 50,
  "rating": 4.5,
  "reviews_count": 10,
  "featured": true,
  "category": 1
}
```

### Category Endpoints

#### GET /api/categories/
List all categories.

**Response** (200):
```json
[
  {
    "id": 1,
    "name": "Electronics",
    "image": "...",
    "slug": "electronics"
  }
]
```

#### GET /api/categories/<slug>/
Get category with products.

**Response** (200):
```json
{
  "id": 1,
  "name": "Electronics",
  "image": "...",
  "slug": "electronics",
  "products": [...]
}
```

### Cart Endpoints

#### POST /api/cart/add/
Add product to cart.

**Request**:
```json
{
  "cart_code": "unique-code",
  "product_id": 1,
  "quantity": 1
}
```

**Response** (200):
```json
{
  "id": 1,
  "cart_code": "unique-code",
  "cartitems": [...],
  "cart_total": 79.99
}
```

#### GET /api/cart/get/
Get cart details.

**Query Parameters**:
- `cart_code` - Cart identifier

**Response** (200):
```json
{
  "id": 1,
  "cart_code": "unique-code",
  "cartitems": [...],
  "cart_total": 79.99
}
```

#### PATCH /api/cart/update/
Update cart item quantity.

**Request**:
```json
{
  "cart_code": "unique-code",
  "product_id": 1,
  "quantity": 2
}
```

**Response** (200):
```json
{
  "id": 1,
  "cart_code": "unique-code",
  "cartitems": [...],
  "cart_total": 159.98
}
```

#### DELETE /api/cart/remove/
Remove product from cart.

**Request**:
```json
{
  "cart_code": "unique-code",
  "product_id": 1
}
```

**Response** (200):
```json
{
  "id": 1,
  "cart_code": "unique-code",
  "cartitems": [...],
  "cart_total": 0
}
```

#### DELETE /api/cart/clear/
Clear all items from cart.

**Request**:
```json
{
  "cart_code": "unique-code"
}
```

**Response** (200):
```json
{
  "id": 1,
  "cart_code": "unique-code",
  "cartitems": [],
  "cart_total": 0
}
```

## Authentication

### JWT Tokens

The API uses JWT (JSON Web Tokens) for authentication.

**Token Types**:
- **Access Token**: Short-lived (15 minutes), used for API requests
- **Refresh Token**: Long-lived (7 days), used to get new access tokens

### Token Usage

Include access token in Authorization header:
```
Authorization: Bearer <access_token>
```

### Token Refresh

When access token expires:
1. Send refresh token to `/api/auth/refresh/`
2. Receive new access token
3. Retry original request with new token

### Token Configuration

In `settings.py`:
```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}
```

## Database

### Migrations

Create migrations after model changes:
```bash
python manage.py makemigrations
```

Apply migrations:
```bash
python manage.py migrate
```

View migration status:
```bash
python manage.py showmigrations
```

### Database Backup

SQLite backup:
```bash
cp db.sqlite3 db.sqlite3.backup
```

PostgreSQL backup:
```bash
pg_dump dbname > backup.sql
```

## Admin Panel

Access admin panel at `http://localhost:8000/admin`

### Admin Features

- **User Management**: Create, edit, delete users
- **Product Management**: Add, edit, delete products
- **Category Management**: Manage product categories
- **Cart Management**: View and manage shopping carts
- **Permissions**: Control user access levels

### Creating Admin User

```bash
python manage.py createsuperuser
```

## Error Handling

### Common Error Responses

**400 Bad Request**:
```json
{
  "error": "Invalid input",
  "details": "Field 'email' is required"
}
```

**401 Unauthorized**:
```json
{
  "detail": "Authentication credentials were not provided."
}
```

**403 Forbidden**:
```json
{
  "detail": "You do not have permission to perform this action."
}
```

**404 Not Found**:
```json
{
  "detail": "Not found."
}
```

**500 Server Error**:
```json
{
  "detail": "Internal server error"
}
```

## Best Practices

### Security

1. **Never commit secrets**: Use environment variables
2. **Use HTTPS**: Always in production
3. **Validate input**: Check all user inputs
4. **Rate limiting**: Implement on auth endpoints
5. **CORS**: Restrict to trusted domains

### Performance

1. **Database indexing**: Index frequently queried fields
2. **Caching**: Cache expensive queries
3. **Pagination**: Paginate large result sets
4. **Lazy loading**: Load related objects only when needed

### Code Quality

1. **Type hints**: Use Python type hints
2. **Docstrings**: Document all functions
3. **Testing**: Write unit tests
4. **Logging**: Log important events

## Deployment

### Production Checklist

- [ ] Set `DEBUG = False`
- [ ] Set strong `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Use PostgreSQL database
- [ ] Set up HTTPS
- [ ] Configure CORS properly
- [ ] Set up logging
- [ ] Configure static files
- [ ] Set up backups
- [ ] Monitor errors

### Deployment Platforms

**Heroku**:
```bash
heroku create app-name
git push heroku main
heroku run python manage.py migrate
```

**AWS**:
- Use Elastic Beanstalk
- RDS for database
- S3 for media files

**DigitalOcean**:
- Use App Platform
- PostgreSQL managed database
- Spaces for media files

---

**Last Updated**: February 2026
**Version**: 1.0.0
