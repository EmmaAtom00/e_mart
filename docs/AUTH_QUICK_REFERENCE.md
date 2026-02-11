# Auth Quick Reference Card

## Key Changes

### ✅ Sign In Page (`/auth/sign-in`)
- Redirects logged-in users to home
- Shows loading spinner while checking auth
- Displays error messages
- Disables button while loading

### ✅ Sign Up Page (`/auth/sign-up`)
- Redirects logged-in users to home
- Shows loading spinner while checking auth
- Validates all fields
- Displays error messages
- Disables button while loading

### ✅ Forgot Password Page (`/auth/forgot-password`)
- Redirects logged-in users to home
- Shows loading spinner while checking auth
- Displays error and success messages
- Disables button while loading

### ✅ Backend Signup
- Generates username from email
- Ensures username uniqueness
- Validates password confirmation
- Returns user data and tokens

## Auth State

```typescript
// Check if user is logged in
const { isLoggedIn } = useStore();

// Check if auth is loading
const { isLoading } = useStore();

// Get current user
const { user } = useStore();

// Get auth error
const { error } = useStore();

// Login
const { login } = useStore();
await login(email, password);

// Signup
const { signup } = useStore();
await signup(firstName, lastName, email, password);

// Logout
const { logout } = useStore();
await logout();
```

## Component Usage

### Check if Logged In
```typescript
const { isLoggedIn } = useStore();

if (isLoggedIn) {
    // User is logged in
} else {
    // User is not logged in
}
```

### Redirect if Logged In
```typescript
const { isLoggedIn, isLoading } = useStore();
const router = useRouter();

useEffect(() => {
    if (isLoggedIn && !isLoading) {
        router.push("/");
    }
}, [isLoggedIn, isLoading, router]);
```

### Show Loading State
```typescript
const { isLoading } = useStore();

if (isLoading) {
    return <Spinner />;
}
```

### Display Error
```typescript
const { error } = useStore();

if (error) {
    return <ErrorAlert message={error} />;
}
```

## API Endpoints

### Login
```
POST /api/auth/login/
{
    "email": "user@example.com",
    "password": "password123"
}

Response:
{
    "access": "token...",
    "refresh": "token...",
    "user": { ... }
}
```

### Signup
```
POST /api/auth/signup/
{
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "password": "password123",
    "password_confirm": "password123"
}

Response:
{
    "access": "token...",
    "refresh": "token...",
    "user": { ... }
}
```

### Get Current User
```
GET /api/auth/me/
Headers: Authorization: Bearer {token}

Response:
{
    "id": "123",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "customer",
    "avatar": null
}
```

### Logout
```
POST /api/auth/logout/
{
    "refresh": "token..."
}

Response:
{
    "message": "Logged out successfully"
}
```

## Token Management

### Save Tokens
```typescript
localStorage.setItem("auth_token", access_token);
localStorage.setItem("refresh_token", refresh_token);
```

### Get Tokens
```typescript
const accessToken = localStorage.getItem("auth_token");
const refreshToken = localStorage.getItem("refresh_token");
```

### Clear Tokens
```typescript
localStorage.removeItem("auth_token");
localStorage.removeItem("refresh_token");
```

### Check if Authenticated
```typescript
const isAuthenticated = !!localStorage.getItem("auth_token");
```

## Common Patterns

### Login Form
```typescript
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState("");
const { login } = useStore();

const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        const success = await login(email, password);
        if (success) {
            router.push("/");
        } else {
            setError("Invalid credentials");
        }
    } finally {
        setIsLoading(false);
    }
};
```

### Protected Component
```typescript
const { isLoggedIn, isLoading } = useStore();

if (isLoading) return <Spinner />;
if (!isLoggedIn) return <Redirect to="/auth/sign-in" />;

return <ProtectedContent />;
```

### Redirect if Logged In
```typescript
const { isLoggedIn, isLoading } = useStore();
const router = useRouter();

useEffect(() => {
    if (isLoggedIn && !isLoading) {
        router.push("/");
    }
}, [isLoggedIn, isLoading, router]);
```

## Error Messages

### Sign In
- "Please fill in all fields"
- "Invalid email or password"
- "An error occurred during sign in"

### Sign Up
- "Please fill in all fields"
- "Passwords do not match"
- "Password must be at least 6 characters"
- "Please agree to the terms and conditions"
- "Failed to create account. Please try again."
- "An error occurred during sign up"

### Forgot Password
- "Please enter your email address"
- "Failed to send reset email"
- "An error occurred"

## Debugging

### Check if Logged In
```javascript
// In browser console
localStorage.getItem("auth_token")
```

### Check User Data
```javascript
// In React DevTools
// Look for useStore state
```

### Check API Requests
```
// In Network tab
// Look for Authorization header
```

### Clear Auth
```javascript
// In browser console
localStorage.removeItem("auth_token");
localStorage.removeItem("refresh_token");
location.reload();
```

## Files to Know

### Frontend
- `frontend/app/(pages)/auth/sign-in/page.tsx` - Sign in page
- `frontend/app/(pages)/auth/sign-up/page.tsx` - Sign up page
- `frontend/app/(pages)/auth/forgot-password/page.tsx` - Forgot password page
- `frontend/store/useStore.ts` - Auth state management
- `frontend/lib/api.ts` - API client with token handling
- `frontend/components/auth/AuthProvider.tsx` - Auth initialization
- `frontend/hooks/useAuth.ts` - Auth hook

### Backend
- `backend/api/views.py` - Auth endpoints
- `backend/api/serializers.py` - Auth serializers
- `backend/api/models.py` - User model

## Status

✅ **Complete** - All auth logic implemented and tested
- Sign in page redirects logged-in users
- Sign up page redirects logged-in users
- Forgot password page redirects logged-in users
- Backend signup generates username
- All error handling in place
- Token management working
- Protected routes working
