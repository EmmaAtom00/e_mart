# Authentication Flow Guide

## User Journey

### New User - Sign Up Flow
```
1. User visits /auth/sign-up
   ↓
2. AuthProvider checks if token exists
   ├─ Token exists → isLoggedIn = true
   └─ No token → isLoggedIn = false
   ↓
3. Sign Up page checks isLoggedIn
   ├─ If true → Redirect to /
   └─ If false → Show signup form
   ↓
4. User fills form and submits
   ├─ Validation fails → Show error
   └─ Validation passes → Call signup()
   ↓
5. signup() calls apiClient.signup()
   ├─ Success → Save tokens, set user state, redirect to /
   └─ Error → Show error message
```

### Existing User - Sign In Flow
```
1. User visits /auth/sign-in
   ↓
2. AuthProvider checks if token exists
   ├─ Token exists → isLoggedIn = true
   └─ No token → isLoggedIn = false
   ↓
3. Sign In page checks isLoggedIn
   ├─ If true → Redirect to /
   └─ If false → Show signin form
   ↓
4. User enters credentials and submits
   ├─ Validation fails → Show error
   └─ Validation passes → Call login()
   ↓
5. login() calls apiClient.login()
   ├─ Success → Save tokens, set user state, redirect to /
   └─ Error → Show error message
```

### App Initialization Flow
```
1. App loads (layout.tsx)
   ↓
2. AuthProvider mounts
   ↓
3. AuthProvider calls initializeAuth()
   ↓
4. initializeAuth() checks apiClient.isAuthenticated()
   ├─ Token exists → Fetch current user
   │  ├─ Success → Set user state, isLoggedIn = true
   │  └─ Error → Clear tokens, isLoggedIn = false
   └─ No token → isLoggedIn = false
   ↓
5. isLoading = false (initialization complete)
   ↓
6. Pages can now check isLoggedIn and redirect if needed
```

### Logout Flow
```
1. User clicks logout button
   ↓
2. logout() is called
   ↓
3. logout() calls apiClient.logout()
   ├─ Success → Clear tokens
   └─ Error → Still clear tokens
   ↓
4. Clear user state
   ├─ user = null
   ├─ isLoggedIn = false
   └─ error = null
   ↓
5. Redirect to home page
```

## State Transitions

### Initial State
```
{
    user: null,
    isLoggedIn: false,
    isLoading: true,  // App is initializing
    error: null,
}
```

### After App Initialization (No Token)
```
{
    user: null,
    isLoggedIn: false,
    isLoading: false,
    error: null,
}
```

### After App Initialization (With Token)
```
{
    user: {
        id: "123",
        email: "user@example.com",
        firstName: "John",
        lastName: "Doe",
        role: "customer",
        avatar: null,
    },
    isLoggedIn: true,
    isLoading: false,
    error: null,
}
```

### During Login/Signup
```
{
    user: null,
    isLoggedIn: false,
    isLoading: true,  // Processing request
    error: null,
}
```

### After Successful Login/Signup
```
{
    user: { ... },
    isLoggedIn: true,
    isLoading: false,
    error: null,
}
```

### After Failed Login/Signup
```
{
    user: null,
    isLoggedIn: false,
    isLoading: false,
    error: "Invalid email or password",
}
```

## Component Behavior

### Sign In Page
```
┌─────────────────────────────────────┐
│ Sign In Page                        │
├─────────────────────────────────────┤
│                                     │
│ useEffect(() => {                   │
│   if (isLoggedIn && !authLoading) { │
│     router.push("/")                │
│   }                                 │
│ }, [isLoggedIn, authLoading])       │
│                                     │
│ if (!isInitialized || authLoading)  │
│   return <Spinner />                │
│                                     │
│ if (isLoggedIn)                     │
│   return null                       │
│                                     │
│ return <SignInForm />               │
│                                     │
└─────────────────────────────────────┘
```

### Sign Up Page
```
Same as Sign In Page
```

### Forgot Password Page
```
Same as Sign In Page
```

### Protected Route (Account Page)
```
┌─────────────────────────────────────┐
│ Protected Route                     │
├─────────────────────────────────────┤
│                                     │
│ if (isLoading)                      │
│   return <Spinner />                │
│                                     │
│ if (!isLoggedIn)                    │
│   router.push("/auth/sign-in")      │
│   return null                       │
│                                     │
│ if (requiredRole && user.role !=    │
│     requiredRole)                   │
│   router.push("/")                  │
│   return null                       │
│                                     │
│ return <ProtectedContent />         │
│                                     │
└─────────────────────────────────────┘
```

## Token Lifecycle

### Token Creation
```
1. User signs in/up
2. Backend returns access_token and refresh_token
3. Frontend saves to localStorage:
   - localStorage.setItem("auth_token", access_token)
   - localStorage.setItem("refresh_token", refresh_token)
4. Frontend sets user state
```

### Token Usage
```
1. Frontend makes API request
2. API client adds token to header:
   - Authorization: Bearer {access_token}
3. Backend validates token
4. Backend returns response
```

### Token Refresh
```
1. API returns 401 (Unauthorized)
2. API client calls refreshAccessToken()
3. Backend validates refresh_token
4. Backend returns new access_token
5. API client saves new token
6. API client retries original request
```

### Token Removal
```
1. User clicks logout
2. Frontend calls logout()
3. Frontend removes tokens:
   - localStorage.removeItem("auth_token")
   - localStorage.removeItem("refresh_token")
4. Frontend clears user state
5. Frontend redirects to home
```

## Error Scenarios

### Scenario 1: Invalid Credentials
```
User enters wrong password
    ↓
login() is called
    ↓
API returns 400 Bad Request
    ↓
Error message: "Invalid email or password"
    ↓
User can retry
```

### Scenario 2: Network Error
```
User has no internet
    ↓
login() is called
    ↓
Fetch fails with TypeError
    ↓
Error message: "An error occurred during sign in"
    ↓
User can retry when online
```

### Scenario 3: Token Expired
```
User makes API request
    ↓
API returns 401 Unauthorized
    ↓
API client calls refreshAccessToken()
    ↓
Refresh token is valid
    ↓
New access token is obtained
    ↓
Original request is retried
    ↓
Request succeeds
```

### Scenario 4: Refresh Token Expired
```
User makes API request
    ↓
API returns 401 Unauthorized
    ↓
API client calls refreshAccessToken()
    ↓
Refresh token is invalid/expired
    ↓
Tokens are cleared
    ↓
User is logged out
    ↓
User is redirected to signin
```

## Security Considerations

### Token Storage
- Tokens stored in localStorage (accessible to JavaScript)
- Consider using httpOnly cookies for production
- Tokens are sent in Authorization header

### CORS
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- CORS is configured to allow requests

### Password
- Minimum 6 characters (frontend validation)
- Backend should enforce stronger requirements
- Passwords are sent over HTTPS (in production)

### Session
- Access token lifetime: 15 minutes
- Refresh token lifetime: 7 days
- Tokens are automatically refreshed on 401

## Debugging Tips

### Check if User is Logged In
```typescript
// In browser console
localStorage.getItem("auth_token")
// Should return token string if logged in
```

### Check User State
```typescript
// In React DevTools
// Look for useStore state
// Check isLoggedIn, user, isLoading
```

### Check API Requests
```
// In Network tab
// Look for Authorization header
// Should be: Authorization: Bearer {token}
```

### Check Token Refresh
```
// In Network tab
// Look for POST /api/auth/refresh/
// Should return new access token
```

## Common Issues

### Issue: User stays logged in after page refresh
**Solution:** This is correct behavior. Token is persisted in localStorage.

### Issue: User is logged out after page refresh
**Solution:** Token may have expired. Check if refresh token is valid.

### Issue: Can't access signin page while logged in
**Solution:** This is correct behavior. Logged-in users are redirected to home.

### Issue: Signin page shows spinner forever
**Solution:** Check if AuthProvider is initializing auth. Check browser console for errors.

### Issue: Token not being sent in API requests
**Solution:** Check if token exists in localStorage. Check if Authorization header is being set.
