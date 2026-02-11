# Authentication Implementation Guide

## Overview

This guide covers the complete authentication system implemented for the E-Mart frontend application. The system includes JWT token management, protected routes, and integration with the Django backend.

## Architecture

### Components

1. **API Client** (`lib/api.ts`)
   - Handles all API communication
   - Manages JWT tokens (access & refresh)
   - Automatic token refresh on expiration
   - Request/response interceptors

2. **Zustand Store** (`store/useStore.ts`)
   - Centralized auth state management
   - User data persistence
   - Auth actions (login, logout, signup)
   - Error handling

3. **Auth Provider** (`components/auth/AuthProvider.tsx`)
   - Initializes auth on app load
   - Wraps entire application
   - Restores user session from tokens

4. **Auth Hooks** (`hooks/useAuth.ts`)
   - `useAuth()` - Get current auth state
   - `useRequireAuth()` - Get auth state with authenticated flag

5. **Protected Routes** (`components/auth/ProtectedRoute.tsx`)
   - Wraps components that require authentication
   - Redirects to login if not authenticated
   - Supports role-based access control

6. **Middleware** (`middleware.ts`)
   - Server-side route protection
   - Redirects based on auth status
   - Protects sensitive routes

## Setup Instructions

### 1. Environment Configuration

Create `.env.local` in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Backend API Endpoints Required

The backend must provide these endpoints:

```
POST   /api/auth/signup/              - Register new user
POST   /api/auth/login/               - Login user
POST   /api/auth/logout/              - Logout user
POST   /api/auth/refresh/             - Refresh access token
GET    /api/auth/me/                  - Get current user
PATCH  /api/auth/profile/             - Update user profile
POST   /api/auth/password-reset/      - Request password reset
POST   /api/auth/password-reset-confirm/ - Confirm password reset
```

### 3. Expected API Response Format

**Login/Signup Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": "1",
    "email": "[email]",
    "first_name": "John",
    "last_name": "Doe",
    "role": "customer",
    "avatar": "https://..."
  }
}
```

**Error Response:**
```json
{
  "error": "Invalid credentials",
  "message": "Email or password is incorrect"
}
```

## Usage Examples

### 1. Using Auth in Components

```typescript
import { useAuth } from "@/hooks/useAuth";

export const MyComponent = () => {
  const { user, isLoggedIn, isLoading, error } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isLoggedIn) return <div>Please login</div>;

  return <div>Welcome, {user?.firstName}!</div>;
};
```

### 2. Protecting Routes

```typescript
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export const AccountPage = () => {
  return (
    <ProtectedRoute>
      <div>This is only visible to logged-in users</div>
    </ProtectedRoute>
  );
};
```

### 3. Role-Based Access Control

```typescript
<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>
```

### 4. Manual Login/Logout

```typescript
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";

export const LoginForm = () => {
  const { login } = useStore();
  const router = useRouter();

  const handleLogin = async () => {
    const success = await login("user@example.com", "password");
    if (success) {
      router.push("/");
    }
  };

  return <button onClick={handleLogin}>Login</button>;
};
```

### 5. Accessing API with Auth

```typescript
import { apiClient } from "@/lib/api";

// Get current user
const response = await apiClient.getCurrentUser();

// Update profile
await apiClient.updateProfile({
  first_name: "Jane",
  last_name: "Smith"
});

// Request password reset
await apiClient.requestPasswordReset("user@example.com");
```

## Token Management

### How Tokens Work

1. **Login**: User receives `access` and `refresh` tokens
2. **Storage**: Tokens stored in localStorage
3. **Requests**: Access token sent in Authorization header
4. **Expiration**: When access token expires, refresh token is used to get new one
5. **Logout**: Both tokens are cleared from localStorage

### Token Refresh Flow

```
1. User makes API request
2. If 401 response received:
   - Use refresh token to get new access token
   - Retry original request with new token
3. If refresh fails:
   - Clear tokens
   - Redirect to login
```

## Protected Routes

### Server-Side Protection (Middleware)

Protected routes defined in `middleware.ts`:
- `/account`
- `/checkout`
- `/orders`
- `/wishlist`

These routes check for auth token in cookies and redirect to login if missing.

### Client-Side Protection

Use `ProtectedRoute` component for client-side protection:

```typescript
<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>
```

## State Persistence

Auth state is persisted using Zustand's persist middleware:

```typescript
// Persisted data:
- user
- isLoggedIn
- cart
- wishlist

// Stored in localStorage with key: "emart-store"
```

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid credentials" | Wrong email/password | Check credentials |
| "Email already exists" | Email already registered | Use different email |
| "Token expired" | Access token expired | Automatic refresh attempted |
| "Unauthorized" | No valid token | Redirect to login |

### Error Handling in Components

```typescript
const { error, clearError } = useAuth();

useEffect(() => {
  if (error) {
    // Show error message
    console.error(error);
    // Clear error after 5 seconds
    setTimeout(() => clearError(), 5000);
  }
}, [error, clearError]);
```

## Security Best Practices

1. **HTTPS Only**: Always use HTTPS in production
2. **Secure Tokens**: Never expose tokens in URLs
3. **HttpOnly Cookies**: Consider using HttpOnly cookies for tokens
4. **CORS**: Configure CORS properly on backend
5. **Password**: Enforce strong password requirements
6. **Rate Limiting**: Implement rate limiting on auth endpoints
7. **Email Verification**: Verify email before allowing login
8. **2FA**: Consider implementing two-factor authentication

## Troubleshooting

### User Not Persisting After Refresh

**Issue**: User data lost after page refresh

**Solution**: 
- Check if localStorage is enabled
- Verify `AuthProvider` is wrapping the app
- Check browser console for errors

### Infinite Redirect Loop

**Issue**: Stuck between login and protected route

**Solution**:
- Verify token is being stored correctly
- Check middleware configuration
- Clear localStorage and try again

### API Requests Failing

**Issue**: 401 errors on API calls

**Solution**:
- Verify backend is running
- Check API URL in `.env.local`
- Verify token format in Authorization header
- Check CORS configuration on backend

### Token Not Refreshing

**Issue**: Getting logged out when token expires

**Solution**:
- Verify refresh endpoint is working
- Check refresh token is stored
- Verify token refresh logic in `apiClient`

## Next Steps

1. Implement email verification
2. Add password reset flow
3. Implement OAuth/Social login
4. Add two-factor authentication
5. Implement role-based dashboards
6. Add user profile editing
7. Implement session management
8. Add activity logging

## Related Files

- `frontend/lib/api.ts` - API client
- `frontend/store/useStore.ts` - Zustand store
- `frontend/components/auth/AuthProvider.tsx` - Auth provider
- `frontend/hooks/useAuth.ts` - Auth hooks
- `frontend/middleware.ts` - Route middleware
- `frontend/app/(pages)/auth/sign-in/page.tsx` - Login page
- `frontend/app/(pages)/auth/sign-up/page.tsx` - Signup page
- `frontend/app/(pages)/account/page.tsx` - Account page
