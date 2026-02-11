# E-Mart Frontend Documentation

Complete documentation for the Next.js frontend application.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Setup](#project-setup)
3. [Project Structure](#project-structure)
4. [Components](#components)
5. [State Management](#state-management)
6. [API Integration](#api-integration)
7. [Authentication](#authentication)
8. [Routing](#routing)
9. [Styling](#styling)
10. [Deployment](#deployment)

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 16.1.6
- **UI Library**: React 19.2.3
- **State Management**: Zustand 5.0.11
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5
- **HTTP Client**: Fetch API with custom wrapper

### Key Features
- Server-side rendering (SSR)
- Static site generation (SSG)
- API routes
- Middleware for route protection
- Image optimization
- Built-in CSS support

## Project Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Configuration

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Server runs on `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles
│   ├── not-found.tsx           # 404 page
│   └── (pages)/                # Route group
│       ├── layout.tsx          # Pages layout
│       ├── auth/
│       │   ├── sign-in/page.tsx
│       │   ├── sign-up/page.tsx
│       │   └── forgot-password/page.tsx
│       ├── products/
│       │   ├── page.tsx
│       │   └── [id]/page.tsx
│       ├── cart/page.tsx
│       ├── account/page.tsx
│       ├── checkout/page.tsx
│       └── wishlist/page.tsx
├── components/
│   ├── auth/
│   │   ├── AuthProvider.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── UserMenu.tsx
│   ├── common/
│   │   ├── ProductCard.tsx
│   │   ├── SearchBar.tsx
│   │   └── CategorySidebar.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Modal.tsx
├── hooks/
│   └── useAuth.ts
├── lib/
│   └── api.ts
├── store/
│   └── useStore.ts
├── interface/
│   └── type.ts
├── middleware.ts
├── .env.local
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

## Components

### Auth Components

#### AuthProvider
Initializes authentication on app load.

```typescript
import { AuthProvider } from "@/components/auth/AuthProvider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

#### ProtectedRoute
Wraps components that require authentication.

```typescript
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <div>Protected content</div>
    </ProtectedRoute>
  );
}
```

#### UserMenu
Displays user profile and logout button.

```typescript
import { UserMenu } from "@/components/auth/UserMenu";

export default function Navbar() {
  return (
    <nav>
      <UserMenu />
    </nav>
  );
}
```

### Common Components

#### ProductCard
Displays a single product.

```typescript
interface ProductCardProps {
  id: number;
  name: string;
  image: string;
  price: number;
  salePrice: number;
  rating: number;
  onAddToCart: () => void;
}

export const ProductCard = ({ ...props }: ProductCardProps) => {
  return (
    <div className="product-card">
      {/* Product content */}
    </div>
  );
};
```

#### SearchBar
Search products.

```typescript
export const SearchBar = () => {
  const [query, setQuery] = useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search logic
  };
  
  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
      />
      <button type="submit">Search</button>
    </form>
  );
};
```

### Layout Components

#### Navbar
Main navigation bar.

```typescript
export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">E-Mart</div>
      <SearchBar />
      <UserMenu />
    </nav>
  );
}
```

#### Footer
Footer component.

```typescript
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Footer content */}
      </div>
    </footer>
  );
}
```

## State Management

### Zustand Store

Global state management using Zustand.

```typescript
import { useStore } from "@/store/useStore";

export const MyComponent = () => {
  const { user, isLoggedIn, login, logout } = useStore();
  
  return (
    <div>
      {isLoggedIn ? (
        <>
          <p>Welcome, {user?.firstName}!</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Please login</p>
      )}
    </div>
  );
};
```

### Store Structure

```typescript
interface StoreState {
  // Auth
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signup: (...) => Promise<boolean>;
  initializeAuth: () => Promise<void>;
  clearError: () => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (id: number) => void;
  updateCartQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  
  // Wishlist
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
}
```

### Persistence

Store data is persisted to localStorage:
```typescript
persist(
  (set, get) => ({...}),
  {
    name: "emart-store",
    partialize: (state) => ({
      cart: state.cart,
      wishlist: state.wishlist,
      user: state.user,
      isLoggedIn: state.isLoggedIn,
    }),
  }
)
```

## API Integration

### API Client

Custom API client with automatic token management.

```typescript
import { apiClient } from "@/lib/api";

// Login
const response = await apiClient.login(email, password);

// Get current user
const user = await apiClient.getCurrentUser();

// Update profile
await apiClient.updateProfile({ first_name: "Jane" });

// Get products
const products = await apiClient.request("/products/");
```

### Request/Response Format

**Request**:
```typescript
const response = await apiClient.request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>>
```

**Response**:
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
```

### Error Handling

```typescript
const response = await apiClient.login(email, password);

if (response.success) {
  // Handle success
} else {
  console.error(response.error);
}
```

## Authentication

### Login Flow

```typescript
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";

export default function SignIn() {
  const router = useRouter();
  const { login } = useStore();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      router.push("/");
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### Protected Routes

```typescript
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <div>Account content</div>
    </ProtectedRoute>
  );
}
```

### Role-Based Access

```typescript
<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>
```

### Auth Hooks

```typescript
import { useAuth } from "@/hooks/useAuth";

export const MyComponent = () => {
  const { user, isLoggedIn, isLoading, error } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  if (!isLoggedIn) return <div>Please login</div>;
  
  return <div>Welcome, {user?.firstName}!</div>;
};
```

## Routing

### App Router

Next.js 13+ App Router structure.

**File-based routing**:
- `app/page.tsx` → `/`
- `app/products/page.tsx` → `/products`
- `app/products/[id]/page.tsx` → `/products/123`

**Route groups**:
```
app/(pages)/
├── auth/
│   ├── sign-in/page.tsx
│   └── sign-up/page.tsx
├── products/page.tsx
└── account/page.tsx
```

### Dynamic Routes

```typescript
// app/products/[id]/page.tsx
export default function ProductPage({ params }: { params: { id: string } }) {
  return <div>Product {params.id}</div>;
}
```

### Middleware

Route protection middleware.

```typescript
// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/account", "/checkout"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  
  if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }
  }
  
  return NextResponse.next();
}
```

## Styling

### Tailwind CSS

Utility-first CSS framework.

```typescript
export default function Button() {
  return (
    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
      Click me
    </button>
  );
}
```

### Global Styles

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #3b82f6;
  --secondary: #ef4444;
}
```

### CSS Modules

```typescript
// components/Button.module.css
.button {
  @apply px-4 py-2 bg-blue-600 text-white rounded-lg;
}

.button:hover {
  @apply bg-blue-700;
}
```

```typescript
// components/Button.tsx
import styles from "./Button.module.css";

export default function Button() {
  return <button className={styles.button}>Click me</button>;
}
```

## Deployment

### Vercel Deployment

1. **Connect GitHub**:
   - Push code to GitHub
   - Connect repository to Vercel

2. **Set Environment Variables**:
   - `NEXT_PUBLIC_API_URL=https://api.example.com`
   - `NEXT_PUBLIC_APP_URL=https://app.example.com`

3. **Deploy**:
   - Automatic deployment on push
   - Preview deployments for PRs

### Self-Hosted Deployment

1. **Build**:
   ```bash
   npm run build
   ```

2. **Start**:
   ```bash
   npm start
   ```

3. **Use Process Manager** (PM2):
   ```bash
   pm2 start npm --name "emart" -- start
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
docker build -t emart-frontend .
docker run -p 3000:3000 emart-frontend
```

## Performance Optimization

### Image Optimization

```typescript
import Image from "next/image";

export default function ProductImage({ src, alt }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={300}
      height={300}
      priority
    />
  );
}
```

### Code Splitting

```typescript
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <div>Loading...</div>,
});
```

### Caching

```typescript
// Cache API responses
const response = await fetch(url, {
  next: { revalidate: 3600 } // Cache for 1 hour
});
```

---

**Last Updated**: February 2026
**Version**: 1.0.0
