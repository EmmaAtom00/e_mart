# ⚛️ E-Mart Frontend - React.js Guide

**Goal**: Build E-Mart frontend using React.js (Create React App) instead of Next.js

**Prerequisites**: JavaScript/TypeScript knowledge

**Time**: 2-3 weeks (15-20 days)

**Tech Stack**: React.js, React Router, TypeScript, Zustand, Tailwind CSS, Axios

---

## 🤔 React.js vs Next.js

### Key Differences

| Feature | Next.js | React.js (CRA) |
|---------|---------|----------------|
| **Rendering** | Server + Client | **Client-side only** |
| **Routing** | File-based | **React Router** (manual) |
| **Setup** | Opinionated | **Flexible** |
| **SEO** | Excellent (SSR) | Poor (needs workarounds) |
| **Learning Curve** | Moderate | **Easy** |
| **Performance** | Excellent | Good |
| **API Routes** | Built-in | ❌ Need separate backend |
| **Best For** | Production apps | **Learning React, SPAs** |

### Why Learn React.js?

✅ **Pure React** - Understand core concepts without framework magic  
✅ **Simple setup** - No server-side rendering complexity  
✅ **Full control** - Choose your own libraries  
✅ **Industry standard** - Most React jobs use plain React  
✅ **Great for SPAs** - Single Page Applications  

---

## 🛠️ Setup & Installation

### 1. Create React App
```bash
cd ~/E-Mart-Rebuild
npx create-react-app frontend-react --template typescript
cd frontend-react
```

### 2. Install Dependencies
```bash
# Routing
npm install react-router-dom

# State management
npm install zustand

# HTTP client
npm install axios

# Styling
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Form handling
npm install react-hook-form zod @hookform/resolvers

# UI feedback
npm install react-hot-toast
```

### 3. Configure Tailwind CSS
```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. Project Structure
```
frontend-react/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── products/
│   │   │   ├── ProductCard.tsx
│   │   │   └── ProductGrid.tsx
│   │   ├── cart/
│   │   │   └── CartItem.tsx
│   │   └── common/
│   │       ├── Button.tsx
│   │       └── Input.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Products.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── Wishlist.tsx
│   │   ├── Login.tsx
│   │   └── Signup.tsx
│   ├── store/
│   │   └── useStore.ts
│   ├── api/
│   │   └── client.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── index.tsx
```

---

## Week 1: React Basics (Days 1-7)

### Day 1: React Router Setup

**🎯 What You'll Build**: Multi-page navigation with React Router

#### Setup Router
```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
```

#### Navigation Component
```typescript
// src/components/layout/Navbar.tsx
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';

export default function Navbar() {
  const { user, cart, logout } = useStore();
  
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            E-Mart
          </Link>
          
          <div className="flex items-center gap-6">
            <Link to="/products" className="hover:text-red-500">
              Products
            </Link>
            
            <Link to="/cart" className="relative hover:text-red-500">
              Cart
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
            
            {user ? (
              <>
                <Link to="/wishlist" className="hover:text-red-500">
                  Wishlist
                </Link>
                <button onClick={logout} className="hover:text-red-500">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="hover:text-red-500">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
```

#### Protected Route Component
```typescript
// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn } = useStore();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// Usage in App.tsx
<Route 
  path="/wishlist" 
  element={
    <ProtectedRoute>
      <Wishlist />
    </ProtectedRoute>
  } 
/>
```

#### Today's Tasks
- [ ] Install React Router
- [ ] Set up routes in App.tsx
- [ ] Create Navbar component
- [ ] Create page components (empty for now)
- [ ] Test navigation

---

### Day 2: TypeScript Types & API Client

**🎯 What You'll Build**: Type definitions and Axios API client

#### Define Types
```typescript
// src/types/index.ts
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  sale_price: number;
  discount: number;
  stock: number;
  category: Category;
  image: string;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  sub_total: number;
}

export interface Cart {
  id: number;
  cart_code: string;
  cartitems: CartItem[];
  cart_total: number;
}

export interface LoginResponse {
  user: User;
  access: string;
  refresh: string;
}
```

#### Create API Client
```typescript
// src/api/client.ts
import axios, { AxiosInstance } from 'axios';

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle token refresh on 401
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            try {
              const response = await axios.post(`${this.baseURL}/auth/refresh/`, {
                refresh: refreshToken,
              });
              const newToken = response.data.access;
              localStorage.setItem('auth_token', newToken);
              error.config.headers.Authorization = `Bearer ${newToken}`;
              return this.client.request(error.config);
            } catch (refreshError) {
              localStorage.removeItem('auth_token');
              localStorage.removeItem('refresh_token');
              window.location.href = '/login';
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Products
  async getProducts(params?: any) {
    const response = await this.client.get('/products/', { params });
    return response.data;
  }

  async getProduct(slug: string) {
    const response = await this.client.get(`/products/${slug}/`);
    return response.data;
  }

  // Auth
  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login/', { email, password });
    return response.data;
  }

  async signup(data: any) {
    const response = await this.client.post('/auth/signup/', data);
    return response.data;
  }

  // Cart
  async addToCart(cartCode: string | null, productId: number, quantity: number) {
    const response = await this.client.post('/cart/add/', {
      cart_code: cartCode,
      product_id: productId,
      quantity,
    });
    return response.data;
  }

  async getCart(cartCode: string) {
    const response = await this.client.get('/cart/get/', {
      params: { cart_code: cartCode },
    });
    return response.data;
  }

  async removeFromCart(itemId: number) {
    const response = await this.client.delete(`/cart/remove/${itemId}/`);
    return response.data;
  }

  // Wishlist
  async getWishlist() {
    const response = await this.client.get('/wishlist/');
    return response.data;
  }

  async addToWishlist(productId: number) {
    const response = await this.client.post('/wishlist/add/', { product_id: productId });
    return response.data;
  }

  async removeFromWishlist(itemId: number) {
    const response = await this.client.delete(`/wishlist/remove/${itemId}/`);
    return response.data;
  }
}

export const apiClient = new ApiClient();
```

#### Environment Variables
```env
# .env
REACT_APP_API_URL=http://localhost:8000/api
```

#### Today's Tasks
- [ ] Install Axios
- [ ] Define TypeScript interfaces
- [ ] Create API client class
- [ ] Add token interceptors
- [ ] Test API calls

---

### Day 3: Zustand State Management

**🎯 What You'll Build**: Global state store

```typescript
// src/store/useStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../api/client';
import { User, Product, CartItem } from '../types';

interface StoreState {
  // State
  user: User | null;
  isLoggedIn: boolean;
  cart: CartItem[];
  cartCode: string | null;
  wishlist: Product[];
  
  // Actions
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addToCart: (product: Product, quantity: number) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  updateCartQuantity: (id: number, quantity: number) => Promise<void>;
  fetchCart: () => Promise<void>;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (id: number) => Promise<void>;
  fetchWishlist: () => Promise<void>;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      cart: [],
      cartCode: null,
      wishlist: [],
      
      setUser: (user) => set({ user, isLoggedIn: !!user }),
      
      login: async (email, password) => {
        try {
          const response = await apiClient.login(email, password);
          
          // Store tokens
          localStorage.setItem('auth_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
          
          set({ user: response.user, isLoggedIn: true });
          return true;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },
      
      logout: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        set({ user: null, isLoggedIn: false, cart: [], wishlist: [] });
      },
      
      addToCart: async (product, quantity) => {
        // Optimistic update
        set((state) => ({
          cart: [...state.cart, { id: Date.now(), product, quantity, sub_total: product.sale_price * quantity }]
        }));
        
        try {
          const { cartCode } = get();
          const response = await apiClient.addToCart(cartCode, product.id, quantity);
          set({ 
            cart: response.cartitems,
            cartCode: response.cart_code 
          });
        } catch (error) {
          // Rollback
          set((state) => ({
            cart: state.cart.filter(item => item.product.id !== product.id)
          }));
          throw error;
        }
      },
      
      removeFromCart: async (id) => {
        const originalCart = get().cart;
        
        // Optimistic update
        set((state) => ({
          cart: state.cart.filter(item => item.id !== id)
        }));
        
        try {
          await apiClient.removeFromCart(id);
        } catch (error) {
          // Rollback
          set({ cart: originalCart });
          throw error;
        }
      },
      
      updateCartQuantity: async (id, quantity) => {
        if (quantity < 1) {
          return get().removeFromCart(id);
        }
        
        set((state) => ({
          cart: state.cart.map(item => 
            item.id === id ? { ...item, quantity, sub_total: item.product.sale_price * quantity } : item
          )
        }));
      },
      
      fetchCart: async () => {
        try {
          const { cartCode } = get();
          if (!cartCode) return;
          
          const cart = await apiClient.getCart(cartCode);
          set({ cart: cart.cartitems });
        } catch (error) {
          console.error('Fetch cart error:', error);
        }
      },
      
      addToWishlist: async (product) => {
        set((state) => ({
          wishlist: [...state.wishlist, product]
        }));
        
        try {
          await apiClient.addToWishlist(product.id);
        } catch (error) {
          set((state) => ({
            wishlist: state.wishlist.filter(p => p.id !== product.id)
          }));
          throw error;
        }
      },
      
      removeFromWishlist: async (id) => {
        const originalWishlist = get().wishlist;
        
        set((state) => ({
          wishlist: state.wishlist.filter(p => p.id !== id)
        }));
        
        try {
          await apiClient.removeFromWishlist(id);
        } catch (error) {
          set({ wishlist: originalWishlist });
          throw error;
        }
      },
      
      fetchWishlist: async () => {
        try {
          const wishlist = await apiClient.getWishlist();
          set({ wishlist: wishlist.items.map((item: any) => item.product) });
        } catch (error) {
          console.error('Fetch wishlist error:', error);
        }
      },
    }),
    {
      name: 'emart-storage',
      partialize: (state) => ({
        cart: state.cart,
        cartCode: state.cartCode,
        wishlist: state.wishlist,
      }),
    }
  )
);
```

#### Today's Tasks
- [ ] Install Zustand
- [ ] Create store with state
- [ ] Implement auth actions
- [ ] Implement cart actions
- [ ] Test state persistence

---

### Day 4: Product Listing Page

**🎯 What You'll Build**: Products page with grid

#### Products Page
```typescript
// src/pages/Products.tsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiClient } from '../api/client';
import { Product } from '../types';
import ProductCard from '../components/products/ProductCard';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        category: searchParams.get('category'),
        search: searchParams.get('search'),
        min_price: searchParams.get('min_price'),
        max_price: searchParams.get('max_price'),
      };
      const data = await apiClient.getProducts(params);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      
      {/* Filters */}
      <div className="mb-8 flex gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchParams.get('search') || ''}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="border rounded px-4 py-2 flex-grow"
        />
      </div>
      
      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          No products found
        </div>
      )}
    </div>
  );
}
```

#### Product Card Component
```typescript
// src/components/products/ProductCard.tsx
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useStore();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await addToCart(product, 1);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <Link to={`/products/${product.slug}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          {product.discount > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
              -{product.discount}%
            </span>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2 mb-4">
            {product.discount > 0 && (
              <span className="text-gray-400 line-through text-sm">
                ${product.price}
              </span>
            )}
            <span className="text-red-500 font-bold text-xl">
              ${product.sale_price}
            </span>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}
```

#### Today's Tasks
- [ ] Create Products page
- [ ] Implement product fetching
- [ ] Add URL-based filters
- [ ] Create ProductCard component
- [ ] Test filtering

---

### Day 5: Product Detail Page

**🎯 What You'll Build**: Product detail with add to cart

```typescript
// src/pages/ProductDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { Product } from '../types';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart, addToWishlist, isLoggedIn } = useStore();

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const data = await apiClient.getProduct(slug!);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart(product, quantity);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleAddToWishlist = async () => {
    if (!product) return;
    
    if (!isLoggedIn) {
      toast.error('Please login to add to wishlist');
      navigate('/login');
      return;
    }
    
    try {
      await addToWishlist(product);
      toast.success('Added to wishlist!');
    } catch (error) {
      toast.error('Failed to add to wishlist');
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!product) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-lg"
          />
        </div>
        
        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            {product.discount > 0 && (
              <>
                <span className="text-gray-400 line-through text-xl">
                  ${product.price}
                </span>
                <span className="bg-red-500 text-white px-3 py-1 rounded">
                  -{product.discount}%
                </span>
              </>
            )}
            <span className="text-red-500 font-bold text-3xl">
              ${product.sale_price}
            </span>
          </div>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            {product.description}
          </p>
          
          <div className="mb-6">
            <span className="text-sm text-gray-500">Category:</span>
            <span className="ml-2 font-semibold">{product.category.name}</span>
          </div>
          
          <div className="mb-6">
            <span className="text-sm text-gray-500">Stock:</span>
            <span className="ml-2 font-semibold">
              {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
            </span>
          </div>
          
          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-semibold">Quantity:</span>
            <div className="flex items-center border rounded">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-6 py-2 border-x">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-black text-white py-3 rounded hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
            <button
              onClick={handleAddToWishlist}
              className="px-6 py-3 border border-black rounded hover:bg-gray-100"
            >
              ♥
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### Today's Tasks
- [ ] Create ProductDetail page
- [ ] Use useParams to get slug
- [ ] Fetch product data
- [ ] Add quantity controls
- [ ] Implement add to cart/wishlist

---

### Day 6: Cart Page

**🎯 What You'll Build**: Shopping cart with checkout

```typescript
// src/pages/Cart.tsx
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Cart() {
  const { cart, removeFromCart, updateCartQuantity } = useStore();
  const navigate = useNavigate();

  const cartTotal = cart.reduce((sum, item) => sum + item.sub_total, 0);

  const handleRemove = async (id: number) => {
    try {
      await removeFromCart(id);
      toast.success('Removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleUpdateQuantity = async (id: number, quantity: number) => {
    try {
      await updateCartQuantity(id, quantity);
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button
          onClick={() => navigate('/products')}
          className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow p-4 flex gap-4">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded"
              />
              
              <div className="flex-grow">
                <h3 className="font-semibold text-lg mb-2">{item.product.name}</h3>
                <p className="text-red-500 font-bold">${item.product.sale_price}</p>
                
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-x">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-lg">${item.sub_total.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Summary */}
        <div className="bg-white rounded-lg shadow p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
          </div>
          
          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
          
          <button className="w-full bg-black text-white py-3 rounded hover:bg-gray-800">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
```

#### Today's Tasks
- [ ] Create Cart page
- [ ] Display cart items
- [ ] Add quantity controls
- [ ] Show cart total
- [ ] Add remove functionality

---

### Day 7: Authentication Pages

**🎯 What You'll Build**: Login and signup forms

```typescript
// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const success = await login(email, password);
      
      if (success) {
        toast.success('Login successful!');
        navigate('/');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded px-4 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded px-4 py-2"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 disabled:bg-gray-300"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-red-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
```

#### Today's Tasks
- [ ] Create Login page
- [ ] Create Signup page
- [ ] Implement form handling
- [ ] Add validation
- [ ] Test authentication flow

---

## Week 2: Advanced Features (Days 8-14)

### Day 8: Wishlist Page
- Create Wishlist page
- Display wishlist items
- Add remove functionality
- Move to cart feature

### Day 9: Form Validation (React Hook Form + Zod)
- Install React Hook Form
- Create validation schemas
- Add to login/signup
- Improve error messages

### Day 10: Loading States & Skeletons
- Create loading components
- Add skeleton screens
- Improve UX

### Day 11: Error Handling
- Create error boundaries
- Add error pages (404, 500)
- Handle API errors gracefully

### Day 12: Responsive Design
- Make all pages mobile-friendly
- Add mobile navigation
- Test on different screen sizes

### Day 13: Performance Optimization
- Code splitting with React.lazy
- Memoization (useMemo, useCallback)
- Image optimization

### Day 14: Testing & Deployment
- Write component tests (Jest + React Testing Library)
- Build for production
- Deploy to Vercel/Netlify

---

## 🎯 React.js vs Next.js Summary

**Use React.js when**:
- Learning React fundamentals
- Building SPAs (Single Page Apps)
- Don't need SEO
- Want full control

**Use Next.js when**:
- Need SEO (server-side rendering)
- Building production apps
- Want file-based routing
- Need API routes

---

## 📚 Resources

- **React Docs**: https://react.dev/
- **React Router**: https://reactrouter.com/
- **Zustand**: https://github.com/pmndrs/zustand
- **Tailwind CSS**: https://tailwindcss.com/

---

**Start with Day 1 after learning Next.js! Understand pure React! ⚛️🚀**
