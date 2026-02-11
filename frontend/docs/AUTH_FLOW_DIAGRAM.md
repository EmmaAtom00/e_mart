# Authentication Flow Diagrams

## Sign Up Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Sign Up Flow                         │
└─────────────────────────────────────────────────────────────────┘

1. User navigates to /auth/sign-up
   │
   ├─→ SignUp Page Component Loads
   │   └─→ useStore() hook initialized
   │
2. User fills form and clicks "Sign Up"
   │
   ├─→ handleSubmit() called
   │   └─→ Validation checks
   │       ├─ Email format valid?
   │       ├─ Password length >= 6?
   │       ├─ Passwords match?
   │       └─ Terms agreed?
   │
3. If validation passes:
   │
   ├─→ signup() action called from store
   │   └─→ apiClient.signup() called
   │       └─→ POST /api/auth/signup/
   │           ├─ Request: { email, password, first_name, last_name }
   │           └─ Response: { access, refresh, user }
   │
4. Backend validates and creates user
   │
   ├─→ Tokens stored in localStorage
   │   ├─ auth_token (access token)
   │   └─ refresh_token (refresh token)
   │
5. User state updated in Zustand store
   │
   ├─→ user: { id, email, firstName, lastName, role, avatar }
   ├─→ isLoggedIn: true
   └─→ isLoading: false
   │
6. Router redirects to home page
   │
   └─→ AuthProvider initializes on next page load
       └─→ User remains logged in
```

## Sign In Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Sign In Flow                         │
└─────────────────────────────────────────────────────────────────┘

1. User navigates to /auth/sign-in
   │
   ├─→ SignIn Page Component Loads
   │
2. User enters email and password
   │
   ├─→ handleSubmit() called
   │   └─→ Validation checks
   │       ├─ Email provided?
   │       └─ Password provided?
   │
3. If validation passes:
   │
   ├─→ login() action called from store
   │   └─→ apiClient.login() called
   │       └─→ POST /api/auth/login/
   │           ├─ Request: { email, password }
   │           └─ Response: { access, refresh, user }
   │
4. Backend validates credentials
   │
   ├─→ Tokens stored in localStorage
   │   ├─ auth_token (access token)
   │   └─ refresh_token (refresh token)
   │
5. User state updated in Zustand store
   │
   ├─→ user: { id, email, firstName, lastName, role, avatar }
   ├─→ isLoggedIn: true
   └─→ isLoading: false
   │
6. Router redirects to home page
   │
   └─→ User logged in and can access protected routes
```

## Protected Route Access

```
┌─────────────────────────────────────────────────────────────────┐
│                   Protected Route Access Flow                    │
└─────────────────────────────────────────────────────────────────┘

User navigates to /account (protected route)
│
├─→ Middleware checks for auth_token in cookies
│   │
│   ├─ Token exists?
│   │  ├─ YES → Allow access
│   │  └─ NO → Redirect to /auth/sign-in
│   │
│   └─→ ProtectedRoute component renders
│       │
│       ├─→ useAuth() hook called
│       │   └─→ Checks isLoggedIn state
│       │
│       ├─ User logged in?
│       │  ├─ YES → Render component
│       │  └─ NO → Show loading spinner
│       │
│       └─→ If requiredRole specified:
│           ├─ User role matches?
│           │  ├─ YES → Render component
│           │  └─ NO → Redirect to home
│           │
│           └─→ Component renders with user data
```

## Token Refresh Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Token Refresh Flow                            │
└─────────────────────────────────────────────────────────────────┘

1. User makes API request
   │
   ├─→ apiClient.request() called
   │   └─→ Authorization header added
   │       └─ Bearer {access_token}
   │
2. Request sent to backend
   │
   ├─→ Backend validates token
   │   │
   │   ├─ Token valid?
   │   │  ├─ YES → Process request
   │   │  └─ NO → Return 401 Unauthorized
   │   │
   │   └─→ 401 response received
   │
3. Token refresh attempted
   │
   ├─→ apiClient.refreshAccessToken() called
   │   └─→ POST /api/auth/refresh/
   │       ├─ Request: { refresh: refresh_token }
   │       └─ Response: { access: new_access_token }
   │
4. New token stored
   │
   ├─→ localStorage.setItem('auth_token', new_access_token)
   │
5. Original request retried
   │
   ├─→ apiClient.request() called again
   │   └─→ Authorization header added
   │       └─ Bearer {new_access_token}
   │
6. Request succeeds
   │
   └─→ Response returned to component
```

## Logout Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        Logout Flow                               │
└─────────────────────────────────────────────────────────────────┘

1. User clicks logout button
   │
   ├─→ handleLogout() called
   │
2. logout() action called from store
   │
   ├─→ apiClient.logout() called
   │   └─→ POST /api/auth/logout/
   │       └─ Request: { refresh: refresh_token }
   │
3. Backend invalidates tokens (optional)
   │
   ├─→ Tokens cleared from localStorage
   │   ├─ localStorage.removeItem('auth_token')
   │   └─ localStorage.removeItem('refresh_token')
   │
4. User state cleared from store
   │
   ├─→ user: null
   ├─→ isLoggedIn: false
   ├─→ error: null
   └─→ isLoading: false
   │
5. Router redirects to home page
   │
   └─→ User logged out and cannot access protected routes
```

## App Initialization Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  App Initialization Flow                         │
└─────────────────────────────────────────────────────────────────┘

1. App starts
   │
   ├─→ RootLayout renders
   │   └─→ AuthProvider component mounts
   │
2. AuthProvider useEffect runs
   │
   ├─→ initializeAuth() called
   │   │
   │   ├─→ Check if token exists in localStorage
   │   │   │
   │   │   ├─ Token exists?
   │   │   │  ├─ YES → Continue
   │   │   │  └─ NO → Skip
   │   │   │
   │   │   └─→ apiClient.getCurrentUser() called
   │   │       └─→ GET /api/auth/me/
   │   │           ├─ Request: Authorization: Bearer {token}
   │   │           └─ Response: { id, email, first_name, last_name, role, avatar }
   │   │
   │   └─→ User state updated in store
   │       ├─ user: { id, email, firstName, lastName, role, avatar }
   │       ├─ isLoggedIn: true
   │       └─ isLoading: false
   │
3. App renders with user state
   │
   ├─→ Navbar shows user menu if logged in
   ├─→ Protected routes accessible if logged in
   └─→ Public routes always accessible
```

## Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                    Component Hierarchy                           │
└─────────────────────────────────────────────────────────────────┘

RootLayout
├─ AuthProvider
│  └─ useEffect: initializeAuth()
│
├─ Navbar
│  └─ UserMenu
│     ├─ useAuth() hook
│     ├─ Show login/signup if not logged in
│     └─ Show user menu if logged in
│
├─ Main Content
│  ├─ Public Pages
│  │  ├─ Home
│  │  ├─ Products
│  │  └─ About
│  │
│  ├─ Auth Pages
│  │  ├─ SignIn
│  │  │  └─ useStore() → login()
│  │  ├─ SignUp
│  │  │  └─ useStore() → signup()
│  │  └─ ForgotPassword
│  │     └─ apiClient.requestPasswordReset()
│  │
│  └─ Protected Pages
│     ├─ Account
│     │  └─ ProtectedRoute
│     │     └─ useAuth() hook
│     ├─ Checkout
│     │  └─ ProtectedRoute
│     ├─ Orders
│     │  └─ ProtectedRoute
│     └─ Wishlist
│        └─ ProtectedRoute
│
└─ Footer
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      Data Flow Diagram                           │
└─────────────────────────────────────────────────────────────────┘

Component
   │
   ├─→ useAuth() hook
   │   └─→ useStore() (Zustand)
   │       ├─ user: User | null
   │       ├─ isLoggedIn: boolean
   │       ├─ isLoading: boolean
   │       ├─ error: string | null
   │       │
   │       └─ Actions:
   │           ├─ login(email, password)
   │           ├─ signup(firstName, lastName, email, password)
   │           ├─ logout()
   │           ├─ initializeAuth()
   │           └─ clearError()
   │
   └─→ apiClient
       ├─ login(email, password)
       ├─ signup(email, password, firstName, lastName)
       ├─ logout()
       ├─ getCurrentUser()
       ├─ updateProfile(data)
       ├─ requestPasswordReset(email)
       └─ resetPassword(token, password)
           │
           └─→ Backend API
               ├─ POST /api/auth/login/
               ├─ POST /api/auth/signup/
               ├─ POST /api/auth/logout/
               ├─ POST /api/auth/refresh/
               ├─ GET /api/auth/me/
               ├─ PATCH /api/auth/profile/
               ├─ POST /api/auth/password-reset/
               └─ POST /api/auth/password-reset-confirm/
```

## State Management

```
┌─────────────────────────────────────────────────────────────────┐
│                  Zustand Store State                             │
└─────────────────────────────────────────────────────────────────┘

useStore() {
  // Auth State
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    role: "customer" | "admin" | "seller"
    avatar?: string
  } | null
  
  isLoggedIn: boolean
  isLoading: boolean
  error: string | null
  
  // Auth Actions
  login: (email, password) => Promise<boolean>
  signup: (firstName, lastName, email, password) => Promise<boolean>
  logout: () => Promise<void>
  initializeAuth: () => Promise<void>
  clearError: () => void
  
  // Cart State
  cart: CartItem[]
  addToCart: (product, quantity) => void
  removeFromCart: (id) => void
  updateCartQuantity: (id, quantity) => void
  clearCart: () => void
  cartTotal: number
  
  // Wishlist State
  wishlist: Product[]
  addToWishlist: (product) => void
  removeFromWishlist: (id) => void
  isInWishlist: (id) => boolean
}

// Persisted in localStorage with key: "emart-store"
// Persisted data: user, isLoggedIn, cart, wishlist
```

---

These diagrams show how the authentication system works at each stage of the user journey.
