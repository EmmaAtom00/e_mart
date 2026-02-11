# API Demo Video - Quick Recording Guide

## 🚀 Quick Start (5 minutes setup)

### 1. Start Backend Server
```bash
cd /home/atom/Documents/Portfolio/E-Mart/backend
source venv/bin/activate
python manage.py runserver
```
✅ Server running at: http://localhost:8000

### 2. Install Postman
- Download: https://www.postman.com/downloads/
- Or use web version: https://web.postman.com/

### 3. Import Collection
1. Open Postman
2. Click "Import" (top left)
3. Select file: `emart_api_postman_collection.json`
4. Collection "E-Mart API" will appear in sidebar

### 4. Set Environment Variables
1. Click "Environments" (left sidebar)
2. Create new environment: "E-Mart Local"
3. Add variables:
   - `base_url` = `http://localhost:8000/api`
   - `access_token` = (leave empty, will auto-fill after login)
4. Select "E-Mart Local" environment (top right dropdown)

---

## 🎬 Recording Sequence (4 minutes)

### Scene 1: Swagger UI (30 sec)
1. Open browser: http://localhost:8000/api/schema/swagger-ui/
2. Scroll through endpoint groups
3. Expand one endpoint to show schema

**Say**: "Auto-generated OpenAPI documentation with drf-spectacular"

---

### Scene 2: Authentication (40 sec)

#### A. Sign Up
1. Open Postman → "Authentication" → "Sign Up"
2. Show request body
3. Click "Send"
4. Highlight response: access token, refresh token, user data

**Say**: "JWT authentication with access and refresh tokens"

#### B. Login
1. "Authentication" → "Login"
2. Click "Send"
3. Show access_token auto-saved to environment

**Say**: "Token automatically saved for subsequent requests"

#### C. Get Current User
1. "Authentication" → "Get Current User"
2. Show "Authorization: Bearer {{access_token}}" header
3. Click "Send"

**Say**: "Protected endpoint requires authentication"

---

### Scene 3: Products (40 sec)

#### A. List Products with Filters
1. "Products" → "List Products with Filters"
2. Show query parameters:
   - category=electronics
   - min_price=100
   - max_price=1000
   - search=laptop
   - ordering=-rating
3. Click "Send"
4. Show paginated response

**Say**: "Advanced filtering, search, and sorting with Django Filter Backend"

#### B. Get Product by Slug
1. "Products" → "Get Product by Slug"
2. Click "Send"
3. Show detailed product data

**Say**: "Slug-based URLs for SEO optimization"

---

### Scene 4: Cart (40 sec)

#### A. Add to Cart
1. "Cart" → "Add to Cart"
2. Show request body with cart_code, product_id, quantity
3. Click "Send"
4. Highlight calculated fields: sub_total, cart_total

**Say**: "Guest cart with unique cart_code, auto-links to user when logged in"

#### B. Update Cart Item
1. "Cart" → "Update Cart Item"
2. Change quantity to 3
3. Click "Send"
4. Show updated cart_total

**Say**: "Real-time cart calculations with nested serializers"

#### C. Get Cart
1. "Cart" → "Get Cart"
2. Show query parameter: cart_code
3. Click "Send"

---

### Scene 5: Wishlist (20 sec)

#### A. Add to Wishlist
1. "Wishlist" → "Add to Wishlist"
2. Show Authorization header (required)
3. Click "Send"

**Say**: "User-specific wishlist requires authentication"

#### B. Get Wishlist
1. "Wishlist" → "Get Wishlist"
2. Click "Send"
3. Show wishlist items

---

### Scene 6: Error Handling (30 sec)

#### A. Validation Error
1. "Authentication" → "Sign Up"
2. Modify body:
   ```json
   {
     "email": "invalid-email",
     "password": "123"
   }
   ```
3. Click "Send"
4. Show 400 Bad Request with field errors

**Say**: "Clear validation errors with proper HTTP status codes"

#### B. Unauthorized Error
1. "Wishlist" → "Get Wishlist"
2. Remove Authorization header
3. Click "Send"
4. Show 401 Unauthorized

**Say**: "Protected endpoints return 401 when not authenticated"

---

### Scene 7: Architecture (40 sec)
1. Open VS Code or file explorer
2. Show project structure:
   ```
   backend/api/
   ├── models.py
   ├── serializers.py
   ├── views.py
   ├── urls.py
   └── filters.py
   ```
3. Briefly open each file (2-3 seconds each)

**Say**: "Clean architecture with separation of concerns"

---

## ✅ Best Practices Checklist

Make sure to mention these during the video:

### REST Principles
- [ ] Resource-based URLs (`/products/`, `/cart/`)
- [ ] Proper HTTP methods (GET, POST, PATCH, DELETE)
- [ ] Meaningful status codes (200, 201, 400, 401, 404)
- [ ] Stateless authentication (JWT)

### Django REST Framework
- [ ] Serializers for validation and transformation
- [ ] Class-based views for reusability
- [ ] ViewSets and generic views
- [ ] Permission classes (`IsAuthenticated`, `AllowAny`)

### Data Management
- [ ] Pagination for large datasets
- [ ] Filtering with Django Filter Backend
- [ ] Search functionality
- [ ] Ordering/sorting

### Security
- [ ] JWT token authentication
- [ ] Password validation
- [ ] Token refresh mechanism
- [ ] Protected endpoints
- [ ] CORS configuration

### Code Quality
- [ ] Separation of concerns (models, serializers, views)
- [ ] DRY principle (reusable serializers)
- [ ] Calculated fields (sub_total, cart_total)
- [ ] Nested serializers for related data

### Documentation
- [ ] Auto-generated OpenAPI schema
- [ ] Swagger UI for interactive docs
- [ ] ReDoc for alternative view
- [ ] Clear endpoint descriptions

---

## 🎥 Recording Tips

### Before Recording:
- [ ] Close unnecessary applications
- [ ] Set Postman theme to light mode (better visibility)
- [ ] Increase font size in Postman (Ctrl/Cmd + +)
- [ ] Clear Postman console
- [ ] Test all requests work correctly

### During Recording:
- **Speak slowly** - explain what each request does
- **Pause after clicking Send** - let response load
- **Highlight key fields** - use cursor to point
- **Show both request and response** - scroll if needed
- **Mention status codes** - 200, 201, 400, etc.

### After Recording:
- [ ] Trim beginning/end
- [ ] Add text overlays for key points (optional)
- [ ] Export as MP4 (1080p, H.264)

---

## 📊 Time Breakdown

| Scene | Duration | Focus |
|-------|----------|-------|
| Swagger UI | 30s | API overview |
| Authentication | 40s | JWT flow |
| Products | 40s | Filtering & search |
| Cart | 40s | CRUD operations |
| Wishlist | 20s | Protected endpoints |
| Errors | 30s | Validation |
| Architecture | 40s | Code structure |
| **Total** | **~4 min** | |

---

## 🎯 Key Messages

1. **"RESTful API design with proper HTTP methods and status codes"**
2. **"JWT authentication for stateless, scalable auth"**
3. **"Advanced filtering and search with Django Filter Backend"**
4. **"Auto-generated API documentation with drf-spectacular"**
5. **"Clean architecture with separation of concerns"**
6. **"Database persistence for user-specific data"**
7. **"Production-ready Django REST Framework implementation"**

---

## 🔗 Useful Links

- Swagger UI: http://localhost:8000/api/schema/swagger-ui/
- ReDoc: http://localhost:8000/api/schema/redoc/
- OpenAPI Schema: http://localhost:8000/api/schema/

---

**Ready to record? Start the backend server and open Postman!** 🎬
