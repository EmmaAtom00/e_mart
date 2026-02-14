# 🚀 30-Day E-Mart Rebuild Mastery Plan

**Goal**: Rebuild E-Mart from scratch to master full-stack development

**Time**: 10 hours/day × 30 days = 300 hours total

**Approach**: Learn concepts deeply → Implement from scratch → Take notes → Build portfolio

---

## 📖 How to Use This Guide

### Daily Structure (10 hours)
1. **Study** (3h): Read the day's section, understand concepts, take notes
2. **Code** (5h): Implement the feature from scratch (no copy-paste!)
3. **Practice** (1h): Experiment, try variations, break things
4. **Document** (1h): Write what you learned in your journal

### Setup Your Workspace
```bash
# Create rebuild folder (separate from original)
mkdir ~/E-Mart-Rebuild
cd ~/E-Mart-Rebuild

# Backend
mkdir backend && cd backend
python -m venv venv
source venv/bin/activate

# Frontend (new terminal)
cd ~/E-Mart-Rebuild
npx create-next-app@latest frontend --typescript --tailwind --app
```

### Keep a Learning Journal
Create `~/E-Mart-Rebuild/JOURNAL.md` and document daily:
- What you learned
- Challenges faced
- How you solved them
- Questions for tomorrow

---

## Week 1: Backend Foundation (Days 1-7)

### Day 1: Django Project Setup & Database Models

**🎯 What You'll Build**: Complete database schema with 7 models

#### Concepts to Master

**1. Virtual Environments**
```bash
# Why? Isolate project dependencies
python -m venv venv
source venv/bin/activate  # Linux/Mac
```

**2. Django Project Structure**
```
backend/
├── manage.py          # CLI tool
├── emartApi/         # Project config
│   ├── settings.py   # Settings
│   └── urls.py       # Main URLs
└── api/              # Your app
    ├── models.py     # Database models
    ├── views.py      # Business logic
    └── urls.py       # App URLs
```

**3. Database Models (ORM)**

**CustomUser** - Extend Django's User:
```pythonp
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    
    USERNAME_FIELD = 'email'  # Login with email
    REQUIRED_FIELDS = ['first_name', 'last_name']
```

**Category** - Product categories:
```python
class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)  # URL-friendly
    image = models.ImageField(upload_to='categories/')
```

**Product** - Main product model:
```python
class Product(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.IntegerField(default=0)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/')
    
    def save(self, *args, **kwargs):
        # Auto-calculate sale price
        self.sale_price = self.price - (self.price * Decimal(self.discount) / 100)
        super().save(*args, **kwargs)
```

**Cart** - Guest + authenticated carts:
```python
class Cart(models.Model):
    user = models.ForeignKey(CustomUser, null=True, blank=True, on_delete=models.CASCADE)
    cart_code = models.CharField(max_length=11, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

**CartItem** - Items in cart:
```python
class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='cartitems', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
```

**Wishlist** - One per user:
```python
class Wishlist(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
```

**WishlistItem** - Items in wishlist:
```python
class WishlistItem(models.Model):
    wishlist = models.ForeignKey(Wishlist, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('wishlist', 'product')  # Prevent duplicates
```

#### Today's Tasks
1. Install Django: `pip install django pillow`
2. Create project: `django-admin startproject emartApi .`
3. Create app: `python manage.py startapp api`
4. Add all 7 models to `api/models.py`
5. Update `settings.py`: Add `'api'` to `INSTALLED_APPS`, set `AUTH_USER_MODEL = 'api.CustomUser'`
6. Run migrations: `python manage.py makemigrations && python manage.py migrate`
7. Create superuser: `python manage.py createsuperuser`
8. Register models in `admin.py` and test in admin panel

#### Key Concepts
- **ORM**: Write Python instead of SQL
- **ForeignKey**: One-to-Many (Category → Products)
- **OneToOneField**: One-to-One (User ↔ Wishlist)
- **null=True**: Database allows NULL (for guest carts)
- **DecimalField**: For money (more precise than Float)
- **Migrations**: Version control for database schema

---

### Day 2: Django REST Framework & API Endpoints

**🎯 What You'll Build**: API endpoints for products and categories

#### Concepts to Master

**1. REST Principles**
- **Resources**: Products, Categories, Users
- **HTTP Methods**: GET (read), POST (create), PATCH (update), DELETE (delete)
- **URLs**: `/api/products/`, `/api/products/gaming-laptop/`

**2. Serializers** - Convert models to JSON:
```python
from rest_framework import serializers

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image']

class ProductListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'price', 'sale_price', 'discount', 'image', 'stock']

class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    
    class Meta:
        model = Product
        fields = '__all__'
```

**3. ViewSets** - Handle CRUD operations:
```python
from rest_framework import viewsets

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductListSerializer
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'
```

**4. URL Routing**:
```python
# api/urls.py
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')

urlpatterns = router.urls

# emartApi/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
```

#### Today's Tasks
1. Install DRF: `pip install djangorestframework`
2. Add `'rest_framework'` to `INSTALLED_APPS`
3. Create serializers in `api/serializers.py`
4. Create viewsets in `api/views.py`
5. Set up routing in `api/urls.py`
6. Test in browser: `http://localhost:8000/api/products/`
7. Create some test data via admin panel

#### Key Concepts
- **Serializer**: Model → JSON (and validation)
- **ViewSet**: Combines list, retrieve, create, update, delete
- **Router**: Auto-generates URLs
- **ReadOnlyModelViewSet**: Only GET requests (no create/update/delete)

---

### Day 3: JWT Authentication

**🎯 What You'll Build**: User signup, login, logout with JWT tokens

#### Concepts to Master

**1. JWT Structure**
```
header.payload.signature
eyJhbGci... . eyJ1c2VyX2lk... . SflKxwRJ...
```
- **Header**: Algorithm (HS256)
- **Payload**: Data (user_id, email, exp)
- **Signature**: Verify integrity

**2. Access vs Refresh Tokens**
- **Access**: Short-lived (15 min), used for API requests
- **Refresh**: Long-lived (7 days), used to get new access tokens

**3. Implementation**:
```python
# Install
pip install djangorestframework-simplejwt

# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}

# serializers.py
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name']

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = CustomUser
        fields = ['email', 'first_name', 'last_name', 'password']
    
    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

# views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        })
    return Response(serializer.errors, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    from django.contrib.auth import authenticate
    
    email = request.data.get('email')
    password = request.data.get('password')
    
    user = authenticate(username=email, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        })
    return Response({'error': 'Invalid credentials'}, status=401)

# urls.py
urlpatterns = [
    path('auth/signup/', signup),
    path('auth/login/', login),
    path('auth/refresh/', TokenRefreshView.as_view()),
]
```

#### Today's Tasks
1. Install djangorestframework-simplejwt
2. Configure JWT settings
3. Create UserSerializer and SignupSerializer
4. Create signup and login views
5. Add auth URLs
6. Test with Postman or curl
7. Verify tokens are returned

#### Key Concepts
- **JWT**: Stateless authentication
- **Password hashing**: Django uses PBKDF2 (600k iterations)
- **authenticate()**: Checks password hash
- **Tokens**: Access (short) + Refresh (long)

---

### Day 4: Cart Persistence (Guest + Auth)

**🎯 What You'll Build**: Database-backed cart for all users

#### Concepts to Master

**1. Guest Cart Pattern**
- Guest adds item → Generate unique `cart_code`
- Store in database with `user=NULL`
- Frontend saves `cart_code` in localStorage
- On login → Link cart to user

**2. Nested Serializers**:
```python
class CartItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    sub_total = serializers.SerializerMethodField()
    
    def get_sub_total(self, obj):
        return obj.product.sale_price * obj.quantity
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'sub_total']

class CartSerializer(serializers.ModelSerializer):
    cartitems = CartItemSerializer(many=True, read_only=True)
    cart_total = serializers.SerializerMethodField()
    
    def get_cart_total(self, obj):
        return sum(item.product.sale_price * item.quantity 
                   for item in obj.cartitems.all())
    
    class Meta:
        model = Cart
        fields = ['id', 'cart_code', 'cartitems', 'cart_total']
```

**3. Add to Cart Logic**:
```python
import uuid

@api_view(['POST'])
def add_to_cart(request):
    cart_code = request.data.get('cart_code') or str(uuid.uuid4())[:11]
    product_id = request.data.get('product_id')
    quantity = request.data.get('quantity', 1)
    
    # Get or create cart
    if request.user.is_authenticated:
        cart, created = Cart.objects.get_or_create(
            user=request.user,
            defaults={'cart_code': cart_code}
        )
        # Link guest cart if exists
        if created and cart_code:
            guest_cart = Cart.objects.filter(cart_code=cart_code, user=None).first()
            if guest_cart:
                guest_cart.user = request.user
                guest_cart.save()
                cart = guest_cart
    else:
        cart, created = Cart.objects.get_or_create(cart_code=cart_code)
    
    # Add or update item
    product = Product.objects.get(id=product_id)
    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product,
        defaults={'quantity': quantity}
    )
    if not created:
        cart_item.quantity += quantity
        cart_item.save()
    
    return Response(CartSerializer(cart).data)
```

#### Today's Tasks
1. Create CartSerializer and CartItemSerializer
2. Create add_to_cart, get_cart, update_cart, remove_from_cart, clear_cart views
3. Add cart URLs
4. Test guest cart flow
5. Test authenticated cart flow
6. Test guest-to-user cart linking

#### Key Concepts
- **get_or_create()**: Atomic operation (get existing or create new)
- **Nullable FK**: `null=True` allows guest carts
- **SerializerMethodField**: Calculated fields (totals)
- **Guest cart linking**: Update `user` field on login

---

### Day 5: Wishlist Implementation

**🎯 What You'll Build**: User wishlist with authentication requirement

#### Concepts to Master

**1. One-to-One Relationship**:
```python
# Each user has exactly ONE wishlist
class Wishlist(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
```

**2. Unique Constraints**:
```python
class WishlistItem(models.Model):
    wishlist = models.ForeignKey(Wishlist, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ('wishlist', 'product')  # No duplicates!
```

**3. Wishlist Views**:
```python
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_wishlist(request):
    wishlist, created = Wishlist.objects.get_or_create(user=request.user)
    serializer = WishlistSerializer(wishlist)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_wishlist(request):
    wishlist, created = Wishlist.objects.get_or_create(user=request.user)
    product_id = request.data.get('product_id')
    product = Product.objects.get(id=product_id)
    
    wishlist_item, created = WishlistItem.objects.get_or_create(
        wishlist=wishlist,
        product=product
    )
    
    if not created:
        return Response({'error': 'Already in wishlist'}, status=400)
    
    return Response(WishlistSerializer(wishlist).data)
```

#### Today's Tasks
1. Create WishlistSerializer and WishlistItemSerializer
2. Create get_wishlist, add_to_wishlist, remove_from_wishlist views
3. Add `@permission_classes([IsAuthenticated])` to all wishlist views
4. Test authentication requirement
5. Test duplicate prevention

#### Key Concepts
- **OneToOneField**: Each user has one wishlist
- **unique_together**: Database-level constraint
- **IsAuthenticated**: Requires valid JWT token
- **get_or_create**: Auto-create wishlist on first use

---

### Day 6: Product Filtering & Search

**🎯 What You'll Build**: Filter products by category, price, search

#### Concepts to Master

**1. Django Filter Backend**:
```python
# Install
pip install django-filter

# settings.py
INSTALLED_APPS = ['django_filters']
REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend']
}

# filters.py
from django_filters import rest_framework as filters

class ProductFilter(filters.FilterSet):
    min_price = filters.NumberFilter(field_name='sale_price', lookup_expr='gte')
    max_price = filters.NumberFilter(field_name='sale_price', lookup_expr='lte')
    category = filters.CharFilter(field_name='category__slug')
    search = filters.CharFilter(field_name='name', lookup_expr='icontains')
    
    class Meta:
        model = Product
        fields = ['min_price', 'max_price', 'category', 'search']

# views.py
class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductListSerializer
    filterset_class = ProductFilter
```

**Usage**: `/api/products/?min_price=500&max_price=1500&category=laptops&search=gaming`

#### Today's Tasks
1. Install django-filter
2. Create ProductFilter class
3. Add filterset_class to ProductViewSet
4. Test various filter combinations
5. Add database indexes for performance

#### Key Concepts
- **FilterSet**: Define filterable fields
- **Lookup expressions**: `gte` (>=), `lte` (<=), `icontains` (case-insensitive contains)
- **Database indexes**: Speed up queries

---

### Day 7: API Documentation (Swagger)

**🎯 What You'll Build**: Auto-generated interactive API docs

#### Concepts to Master

**1. drf-spectacular Setup**:
```python
# Install
pip install drf-spectacular

# settings.py
INSTALLED_APPS = ['drf_spectacular']
REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

SPECTACULAR_SETTINGS = {
    'TITLE': 'E-Mart API',
    'DESCRIPTION': 'E-commerce REST API',
    'VERSION': '1.0.0',
}

# urls.py
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema')),
]
```

#### Today's Tasks
1. Install drf-spectacular
2. Configure settings
3. Add schema URLs
4. Visit `http://localhost:8000/api/docs/`
5. Test all endpoints in Swagger UI
6. Export OpenAPI schema

#### Key Concepts
- **OpenAPI**: Standard for API documentation
- **Swagger UI**: Interactive API testing
- **Auto-generation**: Docs from code

---

## Week 2: Frontend Foundation (Days 8-14)

### Day 8: Next.js Setup & TypeScript

**🎯 What You'll Build**: Next.js project with routing

#### Concepts to Master

**1. Create Next.js App**:
```bash
npx create-next-app@latest frontend --typescript --tailwind --app
cd frontend
npm run dev
```

**2. Project Structure**:
```
frontend/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page (/)
│   ├── products/
│   │   ├── page.tsx     # /products
│   │   └── [slug]/
│   │       └── page.tsx # /products/gaming-laptop
│   └── auth/
│       ├── sign-in/
│       │   └── page.tsx
│       └── sign-up/
│           └── page.tsx
├── components/          # Reusable components
├── lib/                 # Utilities (API client)
└── store/              # Zustand store
```

**3. TypeScript Basics**:
```typescript
// Types
interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  sale_price: number;
  image: string;
}

// Component with types
interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.sale_price}</p>
    </div>
  );
}
```

#### Today's Tasks
1. Create Next.js project
2. Set up folder structure
3. Create root layout with navbar
4. Create home page
5. Define TypeScript interfaces for Product, Category, User
6. Create basic components (Button, Card)

---

### Day 9: API Client & Data Fetching

**🎯 What You'll Build**: Fetch products from Django API

#### Concepts to Master

**1. API Client Class**:
```typescript
// lib/api.ts
class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  }

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  }

  async getProducts() {
    return this.request<Product[]>('/products/');
  }

  async getProduct(slug: string) {
    return this.request<Product>(`/products/${slug}/`);
  }
}

export const apiClient = new ApiClient();
```

**2. Server Component (fetch on server)**:
```typescript
// app/products/page.tsx
async function ProductsPage() {
  const products = await apiClient.getProducts();
  
  return (
    <div className="grid grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

#### Today's Tasks
1. Create ApiClient class in `lib/api.ts`
2. Create `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:8000/api`
3. Fetch products in server component
4. Display products in grid
5. Add loading states
6. Handle errors

---

### Day 10: Zustand State Management

**🎯 What You'll Build**: Global state for cart, wishlist, user

#### Concepts to Master

**1. Create Store**:
```typescript
// store/useStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface StoreState {
  user: User | null;
  cart: CartItem[];
  wishlist: Product[];
  cartCode: string | null;
  
  setUser: (user: User | null) => void;
  addToCart: (product: Product, quantity: number) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      cart: [],
      wishlist: [],
      cartCode: null,
      
      setUser: (user) => set({ user }),
      
      addToCart: async (product, quantity) => {
        // Optimistic update
        set((state) => ({
          cart: [...state.cart, { ...product, quantity }]
        }));
        
        // Sync with backend
        try {
          const { cartCode } = get();
          const response = await apiClient.addToCart(cartCode, product.id, quantity);
          set({ 
            cart: response.cartitems,
            cartCode: response.cart_code
          });
        } catch (error) {
          // Rollback on error
          set((state) => ({
            cart: state.cart.filter(item => item.id !== product.id)
          }));
        }
      },
    }),
    {
      name: 'emart-storage',
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        cartCode: state.cartCode,
      }),
    }
  )
);
```

#### Today's Tasks
1. Install Zustand: `npm install zustand`
2. Create store with user, cart, wishlist state
3. Add persistence middleware
4. Implement async actions for cart
5. Use store in components
6. Test state persistence

---

### Day 11: Authentication Flow

**🎯 What You'll Build**: Login, signup, logout with JWT

#### Concepts to Master

**1. Cookie Management**:
```typescript
// lib/api.ts
setTokens(access: string, refresh: string) {
  document.cookie = `auth_token=${access}; path=/; max-age=${15 * 60}; SameSite=Lax; Secure`;
  document.cookie = `refresh_token=${refresh}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax; Secure`;
  localStorage.setItem('auth_token', access);
  localStorage.setItem('refresh_token', refresh);
}
```

**2. Login in Store**:
```typescript
login: async (email: string, password: string) => {
  const response = await apiClient.login(email, password);
  if (response.success) {
    setTokens(response.data.access, response.data.refresh);
    set({ user: response.data.user, isLoggedIn: true });
    window.location.reload();  // Refresh to load user data
    return true;
  }
  return false;
},
```

**3. Protected Routes (Middleware)**:
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/account', '/wishlist', '/checkout'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }
  
  return NextResponse.next();
}
```

#### Today's Tasks
1. Create login/signup pages
2. Implement authentication in store
3. Set up cookie management
4. Create protected routes middleware
5. Test login/logout flow

---

### Day 12: Product Listing & Filtering

**🎯 What You'll Build**: Product grid with filters

#### Concepts to Master

**1. URL Search Params**:
```typescript
'use client';
import { useSearchParams, useRouter } from 'next/navigation';

function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };
  
  return (
    <input 
      value={searchParams.get('search') || ''}
      onChange={(e) => updateFilter('search', e.target.value)}
    />
  );
}
```

**2. Debouncing**:
```typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}
```

#### Today's Tasks
1. Create products page with grid
2. Add URL-based filtering
3. Implement debounced search
4. Add loading skeletons
5. Test filter combinations

---

### Day 13: Product Detail Page

**🎯 What You'll Build**: Product detail with images

#### Concepts to Master

**1. Dynamic Routes**:
```typescript
// app/products/[slug]/page.tsx
interface PageProps {
  params: { slug: string };
}

async function ProductDetailPage({ params }: PageProps) {
  const product = await apiClient.getProduct(params.slug);
  
  return (
    <div>
      <Image src={product.image} alt={product.name} width={600} height={600} />
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </div>
  );
}
```

**2. SEO Metadata**:
```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await apiClient.getProduct(params.slug);
  
  return {
    title: `${product.name} | E-Mart`,
    description: product.description,
  };
}
```

#### Today's Tasks
1. Create product detail page
2. Use Next.js Image component
3. Add metadata for SEO
4. Test on different devices

---

### Day 14: Cart UI & Optimistic Updates

**🎯 What You'll Build**: Shopping cart with instant feedback

#### Concepts to Master

**1. Optimistic Updates**:
```typescript
addToCart: async (product, quantity) => {
  const tempId = Date.now();
  
  // 1. Optimistic update
  set((state) => ({
    cart: [...state.cart, { ...product, quantity, tempId }]
  }));
  
  try {
    // 2. Server sync
    const response = await apiClient.addToCart(product.id, quantity);
    
    // 3. Replace with real data
    set((state) => ({
      cart: state.cart.map(item => 
        item.tempId === tempId ? response.item : item
      )
    }));
  } catch (error) {
    // 4. Rollback
    set((state) => ({
      cart: state.cart.filter(item => item.tempId !== tempId)
    }));
    toast.error('Failed to add to cart');
  }
},
```

#### Today's Tasks
1. Create cart page
2. Implement optimistic updates
3. Add toast notifications: `npm install react-hot-toast`
4. Calculate cart totals
5. Test edge cases

---

## Week 3: Advanced Features (Days 15-21)

### Day 15: Wishlist UI
- Create wishlist page
- Add to wishlist button
- Move to cart functionality
- Require authentication

### Day 16: Form Validation
- Install React Hook Form + Zod
- Create validation schemas
- Add error handling
- Improve UX

### Day 17: Responsive Design
- Make all pages mobile-friendly
- Create mobile navigation
- Test on different screen sizes
- Optimize for touch

### Day 18: Performance Optimization
- Code splitting with dynamic imports
- Memoization (useMemo, useCallback)
- Image optimization
- Lighthouse audit

### Day 19: Testing
- Set up Jest + React Testing Library
- Write component tests
- Write integration tests
- Aim for 80% coverage

### Day 20: Deployment Preparation
- Environment variables
- Build optimization
- Error monitoring (Sentry)
- Production build testing

### Day 21: E2E Testing
- Install Playwright
- Write E2E tests for critical flows
- Test authentication
- Test cart/checkout

---

## Week 4: Production & Polish (Days 22-30)

### Days 22-24: Advanced Features
- Payment integration (Stripe)
- Email notifications
- Order management
- Admin enhancements

### Days 25-27: Deployment
- Deploy backend to Render
- Deploy frontend to Vercel
- Set up CI/CD
- Monitor performance

### Days 28-30: Documentation & Portfolio
- Write comprehensive README
- Create demo video
- Add to portfolio
- Share on LinkedIn/Twitter

---

## 🎯 After Completion

### You'll Have:
✅ Deep understanding of full-stack development
✅ Production-ready E-Mart application
✅ Portfolio project to showcase
✅ Skills to build any web application

### Next Projects (Choose 2-3):
1. **TaskFlow** - Project Management SaaS
2. **FitTrack** - Fitness & Nutrition Tracker
3. **DevBlog** - Developer Blogging Platform
4. **RentHub** - Property Rental Marketplace
5. **CodeSnippet** - Code Snippet Manager

---

## 📚 Resources

- **Django**: https://docs.djangoproject.com/
- **DRF**: https://www.django-rest-framework.org/
- **Next.js**: https://nextjs.org/docs
- **TypeScript**: https://www.typescriptlang.org/docs/

---

**Start tomorrow with Day 1! Type every line yourself. Understand before moving forward. Build amazing things! 🚀**
