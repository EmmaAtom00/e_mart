# E-Mart: Full-Stack E-Commerce Application

A complete e-commerce platform built with Django REST Framework (backend) and Next.js (frontend) featuring user authentication, product catalog, shopping cart, and more.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [API Documentation](#api-documentation)
- [Features](#features)
- [Database Schema](#database-schema)
- [Authentication Flow](#authentication-flow)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🎯 Project Overview

E-Mart is a modern e-commerce platform that allows users to:
- Browse and search products
- Manage shopping carts
- Authenticate with JWT tokens
- View product details and categories
- Manage user profiles
- Track orders (future feature)

The application is built with a clear separation of concerns:
- **Backend**: Django REST API with JWT authentication
- **Frontend**: Next.js with React for a responsive UI
- **Database**: SQLite (development) / PostgreSQL (production)

## 🛠 Tech Stack

### Backend
- **Framework**: Django 6.0.2
- **API**: Django REST Framework 3.14.0
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Database**: SQLite (development) / PostgreSQL (production)
- **CORS**: django-cors-headers
- **Python**: 3.13

### Frontend
- **Framework**: Next.js 16.1.6
- **UI Library**: React 19.2.3
- **State Management**: Zustand 5.0.11
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5
- **HTTP Client**: Fetch API with custom wrapper

## 📁 Project Structure

```
E-Mart/
├── backend/
│   ├── api/
│   │   ├── models.py           # Database models
│   │   ├── views.py            # API views
│   │   ├── serializers.py      # DRF serializers
│   │   ├── urls.py             # API routes
│   │   ├── admin.py            # Django admin config
│   │   └── migrations/         # Database migrations
│   ├── emartApi/
│   │   ├── settings.py         # Django settings
│   │   ├── urls.py             # Main URL config
│   │   └── wsgi.py             # WSGI config
│   ├── manage.py               # Django management
│   ├── requirements.txt        # Python dependencies
│   ├── Pipfile                 # Pipenv config
│   └── db.sqlite3              # SQLite database
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── globals.css         # Global styles
│   │   └── (pages)/            # Page routes
│   ├── components/
│   │   ├── auth/               # Auth components
│   │   ├── common/             # Shared components
│   │   ├── layout/             # Layout components
│   │   └── ui/                 # UI components
│   ├── hooks/
│   │   └── useAuth.ts          # Auth hooks
│   ├── lib/
│   │   └── api.ts              # API client
│   ├── store/
│   │   └── useStore.ts         # Zustand store
│   ├── middleware.ts           # Next.js middleware
│   ├── .env.local              # Environment variables
│   ├── package.json            # Node dependencies
│   └── tsconfig.json           # TypeScript config
│
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

- Python 3.13+
- Node.js 18+
- npm or yarn
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd E-Mart
   ```

2. **Setup Backend** (see [Backend Setup](#backend-setup))

3. **Setup Frontend** (see [Frontend Setup](#frontend-setup))

4. **Run both servers**
   - Backend: `python manage.py runserver` (port 8000)
   - Frontend: `npm run dev` (port 3000)

## 🔧 Backend Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

Create `.env` file in backend directory:
```env
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
```

### 4. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create Superuser

```bash
python manage.py createsuperuser
```

### 6. Load Sample Data (Optional)

```bash
python manage.py loaddata sample_data.json
```

### 7. Run Development Server

```bash
python manage.py runserver
```

Backend will be available at `http://localhost:8000`

## 🎨 Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Create `.env.local` file in frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
npm start
```

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Authentication Endpoints

#### Sign Up
```
POST /auth/signup/
Content-Type: application/json

{
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "password": "securepassword123",
  "password_confirm": "securepassword123"
}

Response:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "customer",
    "avatar": null
  }
}
```

#### Login
```
POST /auth/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}

Response: (same as signup)
```

#### Get Current User
```
GET /auth/me/
Authorization: Bearer <access_token>

Response:
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

#### Update Profile
```
PATCH /auth/profile/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "first_name": "Jane",
  "avatar": "https://example.com/avatar.jpg"
}

Response: (updated user object)
```

#### Refresh Token
```
POST /auth/refresh/
Content-Type: application/json

{
  "refresh": "<refresh_token>"
}

Response:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Product Endpoints

#### List Products
```
GET /products/
Query params: featured=true, category=<slug>

Response:
[
  {
    "id": 1,
    "name": "Product Name",
    "slug": "product-name",
    "description": "...",
    "image": "...",
    "price": "99.99",
    "sale_price": "79.99",
    "discount": 20,
    "rating": 4.5,
    "reviews_count": 10
  }
]
```

#### Get Product Details
```
GET /products/<slug>/

Response:
{
  "id": 1,
  "name": "Product Name",
  "slug": "product-name",
  "description": "...",
  "image": "...",
  "price": "99.99",
  "sale_price": "79.99",
  "discount": 20,
  "stock": 50,
  "rating": 4.5,
  "reviews_count": 10,
  "featured": true,
  "category": 1
}
```

### Category Endpoints

#### List Categories
```
GET /categories/

Response:
[
  {
    "id": 1,
    "name": "Electronics",
    "image": "...",
    "slug": "electronics"
  }
]
```

#### Get Category Details
```
GET /categories/<slug>/

Response:
{
  "id": 1,
  "name": "Electronics",
  "image": "...",
  "slug": "electronics",
  "products": [...]
}
```

### Cart Endpoints

#### Add to Cart
```
POST /cart/add/
Content-Type: application/json

{
  "cart_code": "unique-cart-code",
  "product_id": 1,
  "quantity": 1
}

Response:
{
  "id": 1,
  "cart_code": "unique-cart-code",
  "cartitems": [...],
  "cart_total": 79.99
}
```

#### Get Cart
```
GET /cart/get/?cart_code=unique-cart-code

Response: (cart object)
```

#### Update Cart Item
```
PATCH /cart/update/
Content-Type: application/json

{
  "cart_code": "unique-cart-code",
  "product_id": 1,
  "quantity": 2
}

Response: (updated cart)
```

#### Remove from Cart
```
DELETE /cart/remove/
Content-Type: application/json

{
  "cart_code": "unique-cart-code",
  "product_id": 1
}

Response: (updated cart)
```

#### Clear Cart
```
DELETE /cart/clear/
Content-Type: application/json

{
  "cart_code": "unique-cart-code"
}

Response: (empty cart)
```

## ✨ Features

### Implemented
- ✅ User authentication with JWT tokens
- ✅ User registration and login
- ✅ Product catalog with categories
- ✅ Shopping cart management
- ✅ Product filtering and search
- ✅ User profile management
- ✅ Responsive design
- ✅ CORS support
- ✅ Admin panel

### Coming Soon
- 🔄 Order management
- 🔄 Payment integration
- 🔄 Product reviews and ratings
- 🔄 Wishlist functionality
- 🔄 Email notifications
- 🔄 Two-factor authentication
- 🔄 Social login (Google, Facebook)

## 🗄 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar VARCHAR(500),
  role VARCHAR(50) DEFAULT 'customer',
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  price DECIMAL(10, 2),
  discount INTEGER DEFAULT 0,
  sale_price DECIMAL(10, 2),
  image VARCHAR(500),
  category_id INTEGER,
  stock INTEGER DEFAULT 0,
  rating FLOAT DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  slug VARCHAR(100) UNIQUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Categories Table
```sql
CREATE TABLE categories (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  image VARCHAR(500),
  slug VARCHAR(100) UNIQUE,
  created_at TIMESTAMP
);
```

### Cart Tables
```sql
CREATE TABLE carts (
  id INTEGER PRIMARY KEY,
  cart_code VARCHAR(11) UNIQUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE cart_items (
  id INTEGER PRIMARY KEY,
  cart_id INTEGER,
  product_id INTEGER,
  quantity INTEGER DEFAULT 1,
  FOREIGN KEY (cart_id) REFERENCES carts(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

## 🔐 Authentication Flow

### Login Flow
1. User enters email and password
2. Frontend sends POST request to `/auth/login/`
3. Backend validates credentials
4. Backend returns access and refresh tokens
5. Frontend stores tokens in localStorage
6. Frontend redirects to home page
7. User is authenticated for subsequent requests

### Token Refresh Flow
1. Access token expires (15 minutes)
2. Frontend detects 401 response
3. Frontend sends refresh token to `/auth/refresh/`
4. Backend validates refresh token
5. Backend returns new access token
6. Frontend retries original request with new token
7. Request succeeds

### Protected Routes
- `/account` - User account page
- `/checkout` - Checkout page
- `/orders` - Orders page
- `/wishlist` - Wishlist page

## 🚢 Deployment

### Backend Deployment (Heroku)

1. Create Procfile:
```
web: gunicorn emartApi.wsgi
```

2. Update settings for production:
```python
DEBUG = False
ALLOWED_HOSTS = ['your-domain.com']
DATABASES = {
    'default': dj_database_url.config()
}
```

3. Deploy:
```bash
heroku create your-app-name
git push heroku main
heroku run python manage.py migrate
```

### Frontend Deployment (Vercel)

1. Connect GitHub repository to Vercel
2. Set environment variables:
   - `NEXT_PUBLIC_API_URL=https://your-backend.com/api`
3. Deploy automatically on push

## 🐛 Troubleshooting

### Backend Issues

**ModuleNotFoundError: No module named 'rest_framework'**
- Solution: Install requirements: `pip install -r requirements.txt`

**CORS errors**
- Solution: Check CORS_ALLOWED_ORIGINS in settings.py
- Ensure frontend URL is in the list

**Database errors**
- Solution: Run migrations: `python manage.py migrate`

**Port already in use**
- Solution: `python manage.py runserver 8001`

### Frontend Issues

**Cannot find module '@/lib/api'**
- Solution: Check tsconfig.json path aliases
- Verify file exists at `frontend/lib/api.ts`

**API requests failing with 401**
- Solution: Check if token is stored in localStorage
- Verify backend is running
- Check API URL in .env.local

**User not persisting after refresh**
- Solution: Check if localStorage is enabled
- Verify AuthProvider wraps the app
- Check browser console for errors

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check browser console for errors
4. Check backend logs: `python manage.py runserver`

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👥 Contributors

- Emmanuel Olarewaju

---

**Last Updated**: February 2026
**Version**: 1.0.0
