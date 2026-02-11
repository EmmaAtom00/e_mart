# Debug Protected Routes - Step by Step Guide

## Issue
Logged-in users cannot access protected routes like `/account`.

## Debugging Steps

### Step 1: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Sign in to the app
4. Navigate to `/account`
5. Look for these console logs:
   - `AuthProvider - Initializing auth`
   - `ProtectedRoute - isLoggedIn: true/false`
   - `ProtectedRoute - isLoading: true/false`
   - `ProtectedRoute - user: {...}`

**What to look for:**
- If you see `isLoggedIn: false` even after signing in → Token not being saved
- If you see `isLoading: true` forever → API call is hanging
- If you see `user: null` → User data not being fetched

### Step 2: Check localStorage
1. Open browser DevTools (F12)
2. Go to Application tab
3. Click on Local Storage
4. Look for `auth_token` and `refresh_token`

**What to look for:**
- Both tokens should exist after login
- Tokens should be long strings (JWT format)
- If tokens are missing → Login didn't save them

### Step 3: Check Network Requests
1. Open browser DevTools (F12)
2. Go to Network tab
3. Sign in to the app
4. Look for these requests:
   - `POST /api/auth/login/` → Should return 200 with tokens
   - `GET /api/auth/me/` → Should return 200 with user data

**What to look for:**
- Login request returns tokens
- GET /api/auth/me/ request is made
- If GET /api/auth/me/ returns 401 → Token is invalid
- If GET /api/auth/me/ returns 403 → Permission denied
- If GET /api/auth/me/ returns 500 → Server error

### Step 4: Check Store State
1. Install React DevTools extension
2. Open browser DevTools
3. Go to Components tab
4. Find `useStore` component
5. Look at the state:
   - `isLoggedIn` should be `true`
   - `isLoading` should be `false`
   - `user` should have user data
   - `error` should be `null`

**What to look for:**
- If `isLoggedIn: false` → Auth not initialized properly
- If `isLoading: true` → Still loading
- If `user: null` → User data not fetched
- If `error: "..."` → Error message

## Common Issues and Solutions

### Issue 1: Token Not Saved After Login
**Symptoms:**
- localStorage shows no `auth_token`
- Console shows `isLoggedIn: false`

**Solution:**
1. Check if login API returns tokens
2. Check if tokens are being saved to localStorage
3. Check browser's localStorage is enabled
4. Try clearing localStorage and logging in again

**Debug:**
```javascript
// In browser console
localStorage.getItem("auth_token")
// Should return token string, not null
```

### Issue 2: GET /api/auth/me/ Returns 401
**Symptoms:**
- Network tab shows 401 error
- Console shows `isLoggedIn: false`
- localStorage has tokens

**Solution:**
1. Token might be invalid or expired
2. Backend might not recognize token format
3. CORS might be blocking request

**Debug:**
```javascript
// In browser console
const token = localStorage.getItem("auth_token");
console.log("Token:", token);
// Check if token looks like JWT (has 3 parts separated by dots)
```

### Issue 3: GET /api/auth/me/ Returns 500
**Symptoms:**
- Network tab shows 500 error
- Console shows error message
- Backend logs show error

**Solution:**
1. Backend error - check backend logs
2. User model issue - check if user exists
3. Serializer issue - check if serializer is correct

**Debug:**
- Check backend console for error details
- Check if user exists in database
- Try making request with curl:
```bash
curl -H "Authorization: Bearer {token}" http://localhost:8000/api/auth/me/
```

### Issue 4: isLoading Stays True Forever
**Symptoms:**
- Spinner shows indefinitely
- Console shows `isLoading: true`
- No network requests

**Solution:**
1. initializeAuth() not being called
2. API request is hanging
3. Response not being processed

**Debug:**
```javascript
// In browser console
// Check if AuthProvider is mounted
// Check if initializeAuth is being called
// Check Network tab for hanging requests
```

### Issue 5: User Data Not Showing
**Symptoms:**
- Page loads but user data is empty
- Console shows `user: null`
- Network shows 200 response

**Solution:**
1. Response data format might be wrong
2. Store not updating user state
3. API returning wrong data

**Debug:**
```javascript
// In Network tab
// Click on GET /api/auth/me/ request
// Go to Response tab
// Check if response has: id, email, first_name, last_name, role, avatar
```

## Step-by-Step Test

### Test 1: Fresh Login
1. Clear localStorage: `localStorage.clear()`
2. Refresh page
3. Sign in with valid credentials
4. Check console logs
5. Check localStorage for tokens
6. Check Network tab for requests
7. Navigate to `/account`
8. Check if page loads

### Test 2: Page Refresh While Logged In
1. Sign in successfully
2. Navigate to `/account`
3. Refresh page (F5)
4. Check console logs
5. Check if page still loads
6. Check if user data is still there

### Test 3: Multiple Protected Routes
1. Sign in successfully
2. Navigate to `/account`
3. Check if page loads
4. Navigate to other protected routes
5. Check if all pages load

## Console Log Interpretation

### Good Logs (Should See These)
```
AuthProvider - Initializing auth
ProtectedRoute - isLoggedIn: true
ProtectedRoute - isLoading: false
ProtectedRoute - user: {id: "1", email: "user@example.com", ...}
```

### Bad Logs (Indicates Problem)
```
AuthProvider - Initializing auth
ProtectedRoute - isLoggedIn: false
ProtectedRoute - isLoading: false
ProtectedRoute - user: null
ProtectedRoute - Not logged in, redirecting to signin
```

### Hanging Logs (Indicates Stuck Loading)
```
AuthProvider - Initializing auth
ProtectedRoute - isLoggedIn: false
ProtectedRoute - isLoading: true
ProtectedRoute - user: null
(spinner shows forever)
```

## Network Request Checklist

### Login Request
- [ ] Method: POST
- [ ] URL: /api/auth/login/
- [ ] Status: 200 or 201
- [ ] Response has: access, refresh, user
- [ ] Headers include: Content-Type: application/json

### Get Current User Request
- [ ] Method: GET
- [ ] URL: /api/auth/me/
- [ ] Status: 200
- [ ] Response has: id, email, first_name, last_name, role, avatar
- [ ] Headers include: Authorization: Bearer {token}

## Backend Debugging

### Check Backend Logs
```bash
# Terminal where Django is running
# Look for error messages
# Check if GET /api/auth/me/ is being called
# Check if token is being validated
```

### Test Backend Endpoint Directly
```bash
# Get token first
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"user@example.com","password":"password"}'

# Use token to get user
curl -H "Authorization: Bearer {token}" \
  http://localhost:8000/api/auth/me/
```

## Files to Check

### Frontend
- `frontend/components/auth/AuthProvider.tsx` - Initialization
- `frontend/components/auth/ProtectedRoute.tsx` - Route protection
- `frontend/store/useStore.ts` - State management
- `frontend/lib/api.ts` - API client
- `frontend/hooks/useAuth.ts` - Auth hook

### Backend
- `backend/api/views.py` - Auth endpoints
- `backend/api/serializers.py` - Serializers
- `backend/api/models.py` - User model
- `backend/emartApi/settings.py` - Settings

## Next Steps

1. **Run through debugging steps** - Identify where the issue is
2. **Check console logs** - See what's happening
3. **Check Network tab** - See API responses
4. **Check localStorage** - See if tokens are saved
5. **Check backend logs** - See if API is working
6. **Report findings** - Share console logs and network requests

## Quick Fixes to Try

1. **Clear localStorage and refresh**
   ```javascript
   localStorage.clear();
   location.reload();
   ```

2. **Check if token is valid**
   ```javascript
   const token = localStorage.getItem("auth_token");
   console.log(token);
   ```

3. **Check if API is responding**
   ```bash
   curl http://localhost:8000/api/auth/me/ \
     -H "Authorization: Bearer {token}"
   ```

4. **Check backend is running**
   ```bash
   curl http://localhost:8000/api/categories/
   ```
