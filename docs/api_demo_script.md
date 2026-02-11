# E-Mart API Demo Video Script

## Video Duration: 3-4 minutes
**Focus**: Backend API functionality, REST principles, and industry best practices

---

## Scene 1: API Overview & Documentation (0:00 - 0:30)
**Visual**: Browser showing Swagger UI at http://localhost:8000/api/schema/swagger-ui/

**Narration**:
> "Welcome to the E-Mart REST API. This Django REST Framework backend provides a complete e-commerce API with automatic OpenAPI documentation using drf-spectacular."

**Actions**:
1. Navigate to http://localhost:8000/api/schema/swagger-ui/
2. Scroll through endpoint groups:
   - Authentication (6 endpoints)
   - Products (2 endpoints)
   - Categories (2 endpoints)
   - Cart (5 endpoints)
   - Wishlist (3 endpoints)
3. Expand one endpoint to show request/response schema

**Best Practices Highlighted**:
- ✅ **Auto-generated API documentation** (OpenAPI/Swagger)
- ✅ **RESTful resource organization**
- ✅ **Clear endpoint naming conventions**

---

## Scene 2: Authentication Flow (0:30 - 1:10)
**Visual**: Postman showing authentication endpoints

**Narration**:
> "The API uses JWT authentication with access and refresh tokens. Let me demonstrate the complete auth flow."

**Actions**:

### 2.1 User Registration (POST /api/auth/signup/)
```json
Request:
{
  "email": "demo@emart.com",
  "first_name": "John",
  "last_name": "Doe",
  "password": "SecurePass123",
  "password_confirm": "SecurePass123"
}

Response (201 Created):
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "demo@emart.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "customer"
  }
}
```

### 2.2 Login (POST /api/auth/login/)
```json
Request:
{
  "email": "demo@emart.com",
  "password": "SecurePass123"
}

Response (200 OK):
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": { ... }
}
```

### 2.3 Get Current User (GET /api/auth/me/)
```
Headers:
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...

Response (200 OK):
{
  "id": 1,
  "email": "demo@emart.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "customer",
  "avatar": null,
  "email_verified": false
}
```

**Best Practices Highlighted**:
- ✅ **JWT token-based authentication**
- ✅ **Password validation** (min length, confirmation)
- ✅ **Secure token refresh mechanism**
- ✅ **Protected endpoints** with `@permission_classes([IsAuthenticated])`

---

## Scene 3: Product Endpoints (1:10 - 1:50)
**Visual**: Postman showing product CRUD operations

**Narration**:
> "The Products API supports filtering, searching, and pagination for efficient data retrieval."

**Actions**:

### 3.1 List Products with Filters (GET /api/products/)
```
GET /api/products/?category=electronics&min_price=100&max_price=1000&search=laptop&ordering=-rating

Response (200 OK):
{
  "count": 15,
  "next": "http://localhost:8000/api/products/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Gaming Laptop",
      "slug": "gaming-laptop",
      "description": "High-performance gaming laptop",
      "image": "https://res.cloudinary.com/.../laptop.jpg",
      "price": "1299.99",
      "discount": 15,
      "sale_price": "1104.99",
      "rating": 4.5,
      "reviews_count": 128
    },
    ...
  ]
}
```

### 3.2 Get Product Details (GET /api/products/{slug}/)
```
GET /api/products/gaming-laptop/

Response (200 OK):
{
  "id": 1,
  "name": "Gaming Laptop",
  "slug": "gaming-laptop",
  "description": "High-performance gaming laptop with RTX 4060...",
  "image": "https://res.cloudinary.com/.../laptop.jpg",
  "price": "1299.99",
  "discount": 15,
  "sale_price": "1104.99",
  "stock": 25,
  "rating": 4.5,
  "reviews_count": 128,
  "featured": true,
  "category": 2
}
```

**Best Practices Highlighted**:
- ✅ **Django Filter Backend** for advanced filtering
- ✅ **Search functionality** with SearchFilter
- ✅ **Pagination** for large datasets
- ✅ **Slug-based URLs** for SEO
- ✅ **Separate serializers** for list vs detail views

---

## Scene 4: Cart Management (1:50 - 2:30)
**Visual**: Postman showing cart operations

**Narration**:
> "The Cart API supports both guest and authenticated users, with automatic user linking upon login."

**Actions**:

### 4.1 Add to Cart (POST /api/cart/add/)
```json
Request:
{
  "cart_code": "abc123xyz",
  "product_id": 1,
  "quantity": 2
}

Response (200 OK):
{
  "id": 1,
  "user": 1,
  "cart_code": "abc123xyz",
  "cartitems": [
    {
      "id": 1,
      "product": {
        "id": 1,
        "name": "Gaming Laptop",
        "price": "1299.99",
        "sale_price": "1104.99",
        ...
      },
      "quantity": 2,
      "sub_total": 2209.98
    }
  ],
  "cart_total": 2209.98
}
```

### 4.2 Get Cart (GET /api/cart/get/)
```
GET /api/cart/get/?cart_code=abc123xyz

Response (200 OK):
{
  "id": 1,
  "cart_code": "abc123xyz",
  "cartitems": [...],
  "cart_total": 2209.98
}
```

### 4.3 Update Cart Item (PATCH /api/cart/update/)
```json
Request:
{
  "cart_code": "abc123xyz",
  "product_id": 1,
  "quantity": 3
}
```

### 4.4 Remove from Cart (DELETE /api/cart/remove/)
```json
Request:
{
  "cart_code": "abc123xyz",
  "product_id": 1
}
```

**Best Practices Highlighted**:
- ✅ **Guest cart support** with unique cart codes
- ✅ **Automatic user linking** when authenticated
- ✅ **Calculated fields** (sub_total, cart_total)
- ✅ **Nested serializers** for related data

---

## Scene 5: Wishlist API (2:30 - 2:50)
**Visual**: Postman showing wishlist operations

**Narration**:
> "The Wishlist API is user-specific and requires authentication."

**Actions**:

### 5.1 Get Wishlist (GET /api/wishlist/get/)
```
Headers:
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...

Response (200 OK):
{
  "id": 1,
  "user": 1,
  "items": [
    {
      "id": 1,
      "product": {
        "id": 2,
        "name": "Wireless Headphones",
        "price": "199.99",
        ...
      },
      "added_at": "2026-02-11T18:30:00Z"
    }
  ],
  "created_at": "2026-02-10T10:00:00Z"
}
```

### 5.2 Add to Wishlist (POST /api/wishlist/add/)
```json
Headers:
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...

Request:
{
  "product_id": 3
}

Response (201 Created):
{
  "id": 1,
  "user": 1,
  "items": [...],
  "created_at": "2026-02-10T10:00:00Z"
}
```

**Best Practices Highlighted**:
- ✅ **Authentication required** for user-specific data
- ✅ **Unique constraint** (one product per wishlist)
- ✅ **Automatic wishlist creation** (get_or_create pattern)

---

## Scene 6: Error Handling & Validation (2:50 - 3:20)
**Visual**: Postman showing error responses

**Narration**:
> "The API provides clear error messages and proper HTTP status codes."

**Actions**:

### 6.1 Validation Error (400 Bad Request)
```json
POST /api/auth/signup/
{
  "email": "invalid-email",
  "password": "123"
}

Response (400 Bad Request):
{
  "email": ["Enter a valid email address."],
  "password": ["Ensure this field has at least 6 characters."],
  "password_confirm": ["This field is required."]
}
```

### 6.2 Authentication Error (401 Unauthorized)
```
GET /api/auth/me/
(No Authorization header)

Response (401 Unauthorized):
{
  "detail": "Authentication credentials were not provided."
}
```

### 6.3 Not Found (404 Not Found)
```
GET /api/products/non-existent-slug/

Response (404 Not Found):
{
  "detail": "Not found."
}
```

**Best Practices Highlighted**:
- ✅ **Proper HTTP status codes** (200, 201, 400, 401, 404)
- ✅ **Descriptive error messages**
- ✅ **Field-level validation** with Django REST serializers
- ✅ **Consistent error format**

---

## Scene 7: Architecture & Best Practices (3:20 - 4:00)
**Visual**: Code editor showing project structure

**Narration**:
> "The API follows clean architecture principles with separation of concerns."

**Actions**:
1. Show project structure:
   ```
   backend/
   ├── api/
   │   ├── models.py          # Database models
   │   ├── serializers.py     # Data validation & transformation
   │   ├── views.py           # Business logic
   │   ├── urls.py            # Routing
   │   └── filters.py         # Custom filters
   ├── emartApi/
   │   └── settings.py        # Configuration
   └── manage.py
   ```

2. Highlight key files briefly

**Best Practices Summary**:
- ✅ **RESTful design** - Resource-based URLs, proper HTTP methods
- ✅ **DRF class-based views** - Reusable, maintainable code
- ✅ **Serializer validation** - Data integrity at API layer
- ✅ **JWT authentication** - Stateless, scalable auth
- ✅ **Database persistence** - User-linked data (cart, wishlist)
- ✅ **API documentation** - Auto-generated with drf-spectacular
- ✅ **Filtering & search** - Django Filter Backend
- ✅ **Pagination** - Efficient data retrieval
- ✅ **CORS configuration** - Secure cross-origin requests
- ✅ **Environment variables** - Secure credential management

---

## Closing (4:00 - 4:10)
**Visual**: Swagger UI homepage

**Narration**:
> "This API demonstrates production-ready Django REST Framework development with industry best practices. All endpoints are documented and ready for integration."

---

## Recording Setup

### Prerequisites:
```bash
# Start Django server
cd /home/atom/Documents/Portfolio/E-Mart/backend
source venv/bin/activate
python manage.py runserver

# Server will run at http://localhost:8000
```

### Tools Needed:
1. **Postman** - Download from https://www.postman.com/downloads/
2. **Screen Recorder** - OBS Studio or Loom
3. **Browser** - For Swagger UI demonstration

### Postman Collection:
Import the provided `emart_api_collection.json` (see next file)

---

## Recording Tips

### Postman Setup:
- Create a new workspace called "E-Mart API Demo"
- Import the collection
- Set up environment variables:
  - `base_url`: http://localhost:8000/api
  - `access_token`: (will be set after login)
- Organize requests by folder (Auth, Products, Cart, Wishlist)

### During Recording:
1. **Start with Swagger UI** - gives visual overview
2. **Use Postman for detailed demos** - shows request/response
3. **Speak slowly** - explain what each endpoint does
4. **Show both success and error cases** - demonstrates validation
5. **Highlight response codes** - 200, 201, 400, 401, 404
6. **Keep cursor visible** - helps viewers follow

### Video Flow:
1. Swagger UI (30 sec) → Overview
2. Postman Auth (40 sec) → Login flow
3. Postman Products (40 sec) → Filtering & search
4. Postman Cart (40 sec) → CRUD operations
5. Postman Wishlist (20 sec) → User-specific data
6. Error examples (30 sec) → Validation
7. Code structure (40 sec) → Architecture
8. Closing (10 sec)

**Total: ~4 minutes**
