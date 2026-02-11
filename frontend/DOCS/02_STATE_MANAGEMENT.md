# State Management with Zustand

## What is Zustand?

Zustand is a lightweight state management library for React. It's simpler than Redux and Context API.

**Why Zustand?**
- ✅ Minimal boilerplate
- ✅ No provider needed
- ✅ Automatic optimization
- ✅ Built-in persistence
- ✅ Smaller bundle size (~2KB)

## Store Setup

### File: `frontend/store/useStore.ts`

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/interface/type";

// Define types
interface CartItem extends Product {
  quantity: number;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface StoreState {
  // Cart state
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (id: number) => void;
  updateCartQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;

  // Wishlist state
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;

  // Auth state
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  signup: (name: string, email: string, password: string) => void;
}

// Create store
export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state & actions
      cart: [],
      addToCart: (product, quantity) => {
        set((state) => {
          const existingItem = state.cart.find((item) => item.id === product.id);
          if (existingItem) {
            // Update quantity if exists
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          // Add new item
          return {
            cart: [...state.cart, { ...product, quantity }],
          };
        });
      },
      // ... more actions
    }),
    {
      name: "emart-store", // localStorage key
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
```

## How It Works

### 1. **Creating Store**
```typescript
create<StoreState>()(
  persist(
    (set, get) => ({ /* state & actions */ }),
    { /* persistence config */ }
  )
)
```

- `create()` - Creates Zustand store
- `persist()` - Middleware for localStorage
- `set` - Function to update state
- `get` - Function to read current state

### 2. **State Updates with `set`**
```typescript
addToCart: (product, quantity) => {
  set((state) => {
    // Return new state
    return { cart: [...state.cart, newItem] };
  });
}
```

- `set` takes a function that receives current state
- Return object with updated properties
- Zustand merges with existing state

### 3. **Reading State with `get`**
```typescript
get cartTotal() {
  return get().cart.reduce((sum, item) => 
    sum + item.salePrice * item.quantity, 0
  );
}
```

- `get()` returns current state
- Use to compute derived values
- Called when needed

### 4. **Persistence Middleware**
```typescript
persist(
  (set, get) => ({ /* ... */ }),
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

- `name` - localStorage key
- `partialize` - Choose what to persist
- Automatically saves/loads from localStorage

## Using the Store

### In Components

```typescript
"use client"; // Must be client component

import { useStore } from "@/store/useStore";

export default function CartPage() {
  // Get state and actions
  const { cart, addToCart, removeFromCart } = useStore();

  return (
    <div>
      <p>Items: {cart.length}</p>
      <button onClick={() => addToCart(product, 1)}>
        Add to Cart
      </button>
    </div>
  );
}
```

### Selective Subscription

```typescript
// Only re-render when cart changes
const cart = useStore((state) => state.cart);

// Multiple values
const { cart, wishlist } = useStore((state) => ({
  cart: state.cart,
  wishlist: state.wishlist,
}));
```

## Store Actions Explained

### Cart Management

```typescript
// Add item
addToCart(product, quantity)
// - Checks if product exists
// - Updates quantity if exists
// - Adds new item if not

// Remove item
removeFromCart(id)
// - Filters out item by id

// Update quantity
updateCartQuantity(id, quantity)
// - Updates quantity for item
// - Removes if quantity < 1

// Clear all
clearCart()
// - Empties cart array
```

### Wishlist Management

```typescript
// Add to wishlist
addToWishlist(product)
// - Checks if already exists
// - Adds if not duplicate

// Remove from wishlist
removeFromWishlist(id)
// - Filters out item

// Check if in wishlist
isInWishlist(id)
// - Returns boolean
```

### Auth Management

```typescript
// Login
login(email, password)
// - Sets user object
// - Sets isLoggedIn to true

// Logout
logout()
// - Clears user
// - Sets isLoggedIn to false

// Signup
signup(name, email, password)
// - Creates user object
// - Sets isLoggedIn to true
```

## Advantages Over Context API

| Feature | Zustand | Context API |
|---------|---------|------------|
| Boilerplate | Minimal | Lots |
| Provider | Not needed | Required |
| Performance | Optimized | Can cause re-renders |
| Bundle size | ~2KB | ~5KB |
| Learning curve | Easy | Medium |
| Persistence | Built-in | Manual |

---

**Next**: See `03_COMPONENTS.md` for component structure
