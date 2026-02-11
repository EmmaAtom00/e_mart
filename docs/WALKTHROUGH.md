# E-Mart Application Walkthrough

Complete walkthrough of the E-Mart e-commerce application, covering both frontend and backend.

## Table of Contents

1. [Getting Started](#getting-started)
2. [User Journey](#user-journey)
3. [Feature Walkthrough](#feature-walkthrough)
4. [Admin Features](#admin-features)
5. [Technical Flow](#technical-flow)
6. [Common Tasks](#common-tasks)
7. [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites

- Python 3.13+
- Node.js 18+
- npm or yarn
- Git

### Initial Setup (5 minutes)

#### 1. Clone Repository
```bash
git clone <repository-url>
cd E-Mart
```

#### 2. Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver
```

Backend runs on `http://localhost:8000`

#### 3. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
echo "NEXT_PUBLIC_APP_URL=http://localhost:3000" >> .env.local

# Start development server
npm run dev
```

Frontend runs on `http://localhost:3000`

### Verify Setup

1. **Backend**: Visit `http://localhost:8000/admin`
   - Login with superuser credentials
   - Should see admin panel

2. **Frontend**: Visit `http://localhost:3000`
   - Should see home page
   - Navigation bar visible

## User Journey

### 1. New User Registration

**Step 1: Navigate to Sign Up**
- Click "Sign Up" in navbar
- URL: `http://localhost:3000/auth/sign-up`

**Step 2: Fill Registration Form**
- First Name: "John"
- Last Name: "Doe"
- Email: "john@example.com"
- Password: "SecurePass123"
- Confirm Password: "SecurePass123"
- Check "I agree to terms"

**Step 3: Submit**
- Click "Sign Up" button
- Frontend sends POST to `/api/auth/signup/`
- Backend creates user and returns tokens
- Tokens stored in localStorage
- Redirected to home page

**What Happens Behind the Scenes**:
1. Frontend validates form data
2. Sends request to backend with user data
3. Backend hashes password and creates user
4. Backend generates JWT tokens
5. Frontend stores tokens in localStorage
6. Frontend updates Zustand store with user data
7. User is now authenticated

### 2. Existing User Login

**Step 1: Navigate to Sign In**
- Click "Sign In" in navbar
- URL: `http://localhost:3000/auth/sign-in`

**Step 2: Enter Credentials**
- Email: "john@example.com"
- Password: "SecurePass123"

**Step 3: Submit**
- Click "Sign In" button
- Frontend sends POST to `/api/auth/login/`
- Backend validates credentials
- Backend returns tokens
- Redirected to home page

**What Happens Behind the Scenes**:
1. Frontend validates input
2. Sends credentials to backend
3. Backend checks email and password
4. Backend generates tokens
5. Frontend stores tokens
6. Frontend updates user state
7. User is authenticated

### 3. Browse Products

**Step 1: View Products**
- Home page shows featured products
- Click "Products" in navbar
- URL: `http://localhost:3000/products`

**Step 2: View Product Details**
- Click on any product card
- URL: `http://localhost:3000/products/product-slug`
- See full product details

**Step 3: Filter by Category**
- Click category in sidebar
- Products filtered by category
- URL includes category parameter

**What Happens Behind the Scenes**:
1. Frontend fetches products from `/api/products/`
2. Backend returns product list
3. Frontend displays products
4. User clicks product
5. Frontend fetches product details from `/api/products/<slug>/`
6. Backend returns product details
7. Frontend displays product page

### 4. Add to Cart

**Step 1: Add Product**
- On product page, click "Add to Cart"
- Select quantity (default: 1)
- Click "Add to Cart" button

**Step 2: View Cart**
- Click cart icon in navbar
- URL: `http://localhost:3000/cart`
- See all cart items

**Step 3: Manage Cart**
- Update quantity: Change number and click update
- Remove item: Click remove button
- Clear cart: Click "Clear Cart" button

**What Happens Behind the Scenes**:
1. Frontend generates unique cart code (stored in localStorage)
2. Frontend sends POST to `/api/cart/add/`
3. Backend creates/updates cart and cart items
4. Backend returns updated cart
5. Frontend updates Zustand store
6. Cart total calculated automatically

### 5. Checkout (Future Feature)

**Step 1: Proceed to Checkout**
- From cart page, click "Checkout"
- URL: `http://localhost:3000/checkout`
- Protected route - requires login

**Step 2: Enter Shipping Address**
- Address form displayed
- Fill in shipping details

**Step 3: Select Payment Method**
- Choose payment method
- Enter payment details

**Step 4: Place Order**
- Review order summary
- Click "Place Order"
- Order created in backend

### 6. User Account

**Step 1: Access Account**
- Click user menu in navbar
- Click "My Account"
- URL: `http://localhost:3000/account`
- Protected route - requires login

**Step 2: View Profile**
- See user information
- Email, name, role displayed

**Step 3: Update Profile**
- Click "Edit Profile"
- Update information
- Click "Save"

**Step 4: Logout**
- Click "Logout" button
- Tokens cleared from localStorage
- Redirected to home page
- User is logged out

## Feature Walkthrough

### Authentication System

#### How JWT Works

1. **User Logs In**
   ```
   User → Frontend → Backend
   Email & Password → POST /api/auth/login/ → Validate
   ```

2. **Backend Returns Tokens**
   ```
   Backend → Frontend
   {
     "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
     "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
     "user": {...}
   }
   ```

3. **Frontend Stores Tokens**
   ```
   localStorage.setItem('auth_token', access_token)
   localStorage.setItem('refresh_token', refresh_token)
   ```

4. **Frontend Uses Token**
   ```
   Authorization: Bearer <access_token>
   ```

5. **Token Expires**
   ```
   Backend returns 401 Unauthorized
   Frontend sends refresh token to /api/auth/refresh/
   Backend returns new access token
   Frontend retries request with new token
   ```

#### Protected Routes

Routes that require authentication:
- `/account` - User account page
- `/checkout` - Checkout page
- `/orders` - Orders page (future)
- `/wishlist` - Wishlist page (future)

If user tries to access without token:
1. Middleware checks for token
2. Token not found
3. Redirect to `/auth/sign-in`

### Product Catalog

#### Product Display

1. **Featured Products** (Home Page)
   - Shows products with `featured=true`
   - Limited to 6 products
   - Displayed in grid

2. **All Products** (Products Page)
   - Shows all products
   - Paginated (20 per page)
   - Filterable by category

3. **Product Details**
   - Full product information
   - Images, description, price
   - Stock availability
   - Rating and reviews

#### Product Filtering

**By Category**:
```
GET /api/products/?category=electronics
```

**Featured Only**:
```
GET /api/products/?featured=true
```

**Combined**:
```
GET /api/products/?featured=true&category=electronics
```

### Shopping Cart

#### Cart Management

1. **Create Cart**
   - Unique cart code generated
   - Stored in localStorage
   - Persists across sessions

2. **Add Items**
   ```
   POST /api/cart/add/
   {
     "cart_code": "unique-code",
     "product_id": 1,
     "quantity": 1
   }
   ```

3. **Update Quantity**
   ```
   PATCH /api/cart/update/
   {
     "cart_code": "unique-code",
     "product_id": 1,
     "quantity": 2
   }
   ```

4. **Remove Items**
   ```
   DELETE /api/cart/remove/
   {
     "cart_code": "unique-code",
     "product_id": 1
   }
   ```

5. **Clear Cart**
   ```
   DELETE /api/cart/clear/
   {
     "cart_code": "unique-code"
   }
   ```

#### Cart Calculations

- **Item Subtotal**: `quantity × sale_price`
- **Cart Total**: Sum of all item subtotals
- **Discount**: Automatically applied from product discount

## Admin Features

### Access Admin Panel

1. **Navigate to Admin**
   - URL: `http://localhost:8000/admin`
   - Login with superuser credentials

2. **Admin Dashboard**
   - User management
   - Product management
   - Category management
   - Cart management

### User Management

**Add User**:
1. Click "Users" in admin
2. Click "Add User"
3. Fill in user details
4. Set role (customer, admin, seller)
5. Click "Save"

**Edit User**:
1. Click user in list
2. Update information
3. Click "Save"

**Delete User**:
1. Click user in list
2. Click "Delete"
3. Confirm deletion

### Product Management

**Add Product**:
1. Click "Products" in admin
2. Click "Add Product"
3. Fill in details:
   - Name
   - Description
   - Price
   - Discount (%)
   - Image
   - Category
   - Stock
   - Featured (checkbox)
4. Click "Save"

**Edit Product**:
1. Click product in list
2. Update details
3. Sale price auto-calculated
4. Click "Save"

**Delete Product**:
1. Click product in list
2. Click "Delete"
3. Confirm deletion

### Category Management

**Add Category**:
1. Click "Categories" in admin
2. Click "Add Category"
3. Fill in details:
   - Name
   - Description
   - Image
4. Slug auto-generated
5. Click "Save"

**Edit Category**:
1. Click category in list
2. Update details
3. Click "Save"

## Technical Flow

### Request/Response Flow

#### Authentication Request

```
Frontend                          Backend
   │                                │
   ├─ POST /api/auth/login/ ───────>│
   │  {email, password}             │
   │                                ├─ Validate email
   │                                ├─ Check password
   │                                ├─ Generate tokens
   │                                │
   │<─ 200 OK ──────────────────────┤
   │  {access, refresh, user}       │
   │                                │
   ├─ Store tokens in localStorage  │
   ├─ Update Zustand store          │
   └─ Redirect to home              │
```

#### Protected API Request

```
Frontend                          Backend
   │                                │
   ├─ GET /api/auth/me/ ──────────>│
   │  Authorization: Bearer token   │
   │                                ├─ Validate token
   │                                ├─ Get user
   │                                │
   │<─ 200 OK ──────────────────────┤
   │  {user data}                   │
   │                                │
   └─ Update UI with user data      │
```

#### Token Refresh Flow

```
Frontend                          Backend
   │                                │
   ├─ GET /api/products/ ─────────>│
   │  Authorization: Bearer token   │
   │                                ├─ Token expired
   │                                │
   │<─ 401 Unauthorized ────────────┤
   │                                │
   ├─ POST /api/auth/refresh/ ────>│
   │  {refresh_token}               │
   │                                ├─ Validate refresh token
   │                                ├─ Generate new access token
   │                                │
   │<─ 200 OK ──────────────────────┤
   │  {access}                      │
   │                                │
   ├─ Retry GET /api/products/ ───>│
   │  Authorization: Bearer new_token
   │                                ├─ Token valid
   │                                ├─ Return products
   │                                │
   │<─ 200 OK ──────────────────────┤
   │  [products]                    │
   │                                │
   └─ Display products              │
```

### Data Flow

#### User Registration

```
User Input
   │
   ├─ Frontend Validation
   │  ├─ Email format
   │  ├─ Password length
   │  └─ Passwords match
   │
   ├─ API Request
   │  └─ POST /api/auth/signup/
   │
   ├─ Backend Processing
   │  ├─ Validate input
   │  ├─ Check email exists
   │  ├─ Hash password
   │  ├─ Create user
   │  └─ Generate tokens
   │
   ├─ API Response
   │  └─ {access, refresh, user}
   │
   ├─ Frontend Processing
   │  ├─ Store tokens
   │  ├─ Update Zustand store
   │  └─ Redirect to home
   │
   └─ User Authenticated
```

#### Product Display

```
User Navigates to /products
   │
   ├─ Frontend Fetches
   │  └─ GET /api/products/
   │
   ├─ Backend Queries
   │  ├─ Get all products
   │  ├─ Serialize data
   │  └─ Return JSON
   │
   ├─ Frontend Receives
   │  └─ [products]
   │
   ├─ Frontend Renders
   │  ├─ Map products
   │  ├─ Create cards
   │  └─ Display grid
   │
   └─ User Sees Products
```

## Common Tasks

### Add Sample Data

#### Via Admin Panel

1. Login to admin: `http://localhost:8000/admin`
2. Click "Categories"
3. Click "Add Category"
4. Fill in details and save
5. Click "Products"
6. Click "Add Product"
7. Fill in details and save

#### Via Django Shell

```bash
python manage.py shell

from api.models import Category, Product
from decimal import Decimal

# Create category
category = Category.objects.create(
    name="Electronics",
    description="Electronic devices",
    slug="electronics"
)

# Create product
product = Product.objects.create(
    name="Laptop",
    description="High-performance laptop",
    price=Decimal("999.99"),
    discount=10,
    category=category,
    stock=50,
    featured=True
)
```

### Create Admin User

```bash
python manage.py createsuperuser
```

Follow prompts to create admin account.

### Reset Database

```bash
# Delete database
rm db.sqlite3

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create new superuser
python manage.py createsuperuser
```

### View API Documentation

1. **Swagger UI** (if installed):
   - URL: `http://localhost:8000/api/docs/`

2. **Manual Testing**:
   - Use Postman or curl
   - See API documentation in README

### Debug Frontend

1. **Open DevTools**:
   - Press F12 or Cmd+Option+I

2. **Check Console**:
   - Look for errors
   - Check network requests

3. **Check Storage**:
   - Application → Local Storage
   - Look for auth tokens
   - Check Zustand store

### Debug Backend

1. **Check Logs**:
   - Terminal where server runs
   - Look for error messages

2. **Django Shell**:
   ```bash
   python manage.py shell
   from api.models import User, Product
   User.objects.all()
   Product.objects.all()
   ```

3. **Admin Panel**:
   - Check data in admin
   - Verify relationships

## Troubleshooting

### Frontend Issues

**"Cannot find module '@/lib/api'"**
- Check file exists: `frontend/lib/api.ts`
- Check tsconfig.json has path alias
- Restart dev server

**"API request failing with 401"**
- Check token in localStorage
- Verify backend is running
- Check API URL in .env.local
- Check CORS configuration

**"User not persisting after refresh"**
- Check localStorage is enabled
- Verify AuthProvider wraps app
- Check browser console for errors

**"Infinite redirect loop"**
- Clear localStorage
- Check middleware configuration
- Verify token is being stored

### Backend Issues

**"ModuleNotFoundError: No module named 'rest_framework'"**
- Install requirements: `pip install -r requirements.txt`

**"CORS errors"**
- Check CORS_ALLOWED_ORIGINS in settings.py
- Verify frontend URL is in list
- Restart backend

**"Database errors"**
- Run migrations: `python manage.py migrate`
- Check database file exists
- Reset database if needed

**"Port already in use"**
- Use different port: `python manage.py runserver 8001`
- Kill process using port

### Common Solutions

**Clear Cache**:
```bash
# Frontend
rm -rf .next
npm run dev

# Backend
python manage.py clear_cache
```

**Restart Services**:
```bash
# Kill all Python processes
pkill -f "python manage.py"

# Kill all Node processes
pkill -f "node"

# Restart both
python manage.py runserver &
npm run dev
```

**Reset Everything**:
```bash
# Backend
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser

# Frontend
rm -rf .next node_modules
npm install
npm run dev
```

---

**Last Updated**: February 2026
**Version**: 1.0.0
