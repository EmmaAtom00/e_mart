# Troubleshooting Protected Routes - Complete Guide

## Quick Diagnosis

### Symptom 1: Spinner Shows Forever
**Possible Causes:**
1. AuthProvider not initializing
2. API request hanging
3. Token invalid
4. Backend not responding

**Quick Fix:**
```javascript
// In browser console
localStorage.clear();
location.reload();
```

### Symptom 2: Redirects to Signin Even When Logged In
**Possible Causes:**
1. Token not saved to localStorage
2. Token expired
3. API returning 401
4. User data not fetching

**Quick Fix:**
```javascript
// Check if token exists
localStorage.getItem("auth_token")
// Should return token, not null
```

### Symptom 3: User Data Shows as Null
**Possible Causes:**
1. API response format wrong
2. Store not updating
3. API returning error

**Quick Fix:**
- Check Network tab for GET /api/auth/me/ response
- Should have: id, email, first_name, last_name, role, avatar

## Detailed Troubleshooting

### Problem: AuthProvider Not Initializing

**Check:**
1. Is AuthProvider in layout.tsx?
2. Is it wrapping the app?
3. Are console logs showing?

**Solution:**
```typescript
// frontend/app/layout.tsx should have:
<AuthProvider>
    <main>
        {children}
    </main>
</AuthProvider>
```

### Problem: Token Not Saved

**Check:**
1. Does login API return tokens?
2. Are tokens being saved to localStorage?
3. Is localStorage enabled?

**Debug:**
```javascript
// After login, check:
localStorage.getItem("auth_token")
localStorage.getItem("refresh_token")
// Both should return token strings
```

**Solution:**
- Check login API response in Network tab
- Verify tokens are in response
- Check if localStorage is enabled in browser

### Problem: API Returns 401

**Check:**
1. Is token in localStorage?
2. Is token being sent in header?
3. Is token format correct?

**Debug:**
```bash
# Test API directly
curl -H "Authorization: Bearer {token}" \
  http://localhost:8000/api/auth/me/
```

**Solution:**
- Token might be expired - try logging in again
- Token format might be wrong - check if it's JWT
- Backend might not recognize token - check backend logs

### Problem: API Returns 500

**Check:**
1. Is backend running?
2. Are there backend errors?
3. Is user in database?

**Debug:**
- Check backend console for error messages
- Check if user exists in database
- Try accessing API with curl

**Solution:**
- Restart backend
- Check backend logs for errors
- Verify user exists in database

### Problem: isLoading Stays True

**Check:**
1. Is initializeAuth being called?
2. Is API request hanging?
3. Is response being processed?

**Debug:**
```javascript
// Check console logs
// Should see: "AuthProvider - Initializing auth"
// Should see: "ProtectedRoute - isLoading: false"
```

**Solution:**
- Check Network tab for hanging requests
- Check backend logs
- Try clearing localStorage and refreshing

## Step-by-Step Debugging

### Step 1: Verify Backend is Running
```bash
# In terminal
curl http://localhost:8000/api/categories/
# Should return 200 with categories
```

### Step 2: Verify Login Works
```bash
# Get token
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"user@example.com","password":"password"}'

# Should return: {access: "...", refresh: "...", user: {...}}
```

### Step 3: Verify Token Works
```bash
# Use token from step 2
curl -H "Authorization: Bearer {access_token}" \
  http://localhost:8000/api/auth/me/

# Should return: {id: "...", email: "...", ...}
```

### Step 4: Check Frontend Console
1. Open DevTools (F12)
2. Go to Console tab
3. Sign in
4. Navigate to /account
5. Look for logs:
   - `AuthProvider - Initializing auth`
   - `ProtectedRoute - isLoggedIn: true`
   - `ProtectedRoute - isLoading: false`
   - `ProtectedRoute - user: {...}`

### Step 5: Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Sign in
4. Navigate to /account
5. Look for requests:
   - `POST /api/auth/login/` → 200
   - `GET /api/auth/me/` → 200

### Step 6: Check localStorage
1. Open DevTools (F12)
2. Go to Application tab
3. Click Local Storage
4. Look for:
   - `auth_token` → Should exist
   - `refresh_token` → Should exist
   - `emart-store` → Should have user data

## Common Fixes

### Fix 1: Clear Cache and Refresh
```javascript
// In browser console
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Fix 2: Restart Backend
```bash
# In terminal where Django is running
# Press Ctrl+C to stop
# Run again:
python manage.py runserver
```

### Fix 3: Check Backend Logs
```bash
# Look for errors in backend console
# Should see:
# - POST /api/auth/login/ 200
# - GET /api/auth/me/ 200
```

### Fix 4: Verify CORS
```python
# In backend/emartApi/settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

### Fix 5: Check Token Format
```javascript
// In browser console
const token = localStorage.getItem("auth_token");
const parts = token.split(".");
console.log("Token parts:", parts.length); // Should be 3
```

## Verification Checklist

- [ ] Backend is running on http://localhost:8000
- [ ] Frontend is running on http://localhost:3000
- [ ] Can access /api/categories/ (public endpoint)
- [ ] Can login and get tokens
- [ ] Tokens are saved to localStorage
- [ ] Can access /api/auth/me/ with token
- [ ] Console shows correct logs
- [ ] Network tab shows 200 responses
- [ ] Can navigate to /account
- [ ] User data displays correctly

## If Still Not Working

### Collect Information
1. **Console logs** - Copy all console messages
2. **Network requests** - Screenshot Network tab
3. **localStorage** - Check what's stored
4. **Backend logs** - Copy backend error messages
5. **Browser** - What browser are you using?

### Try These Steps
1. Clear all localStorage: `localStorage.clear()`
2. Restart backend
3. Restart frontend
4. Clear browser cache
5. Try in incognito mode
6. Try different browser

### Check These Files
- `frontend/components/auth/AuthProvider.tsx` - Is it in layout?
- `frontend/components/auth/ProtectedRoute.tsx` - Is it wrapping content?
- `frontend/store/useStore.ts` - Is initializeAuth correct?
- `backend/api/views.py` - Is get_current_user endpoint correct?
- `backend/api/urls.py` - Is /auth/me/ mapped?

## Advanced Debugging

### Enable Verbose Logging
Add this to ProtectedRoute.tsx:
```typescript
useEffect(() => {
    console.log("=== ProtectedRoute Debug ===");
    console.log("isLoggedIn:", isLoggedIn);
    console.log("isLoading:", isLoading);
    console.log("user:", user);
    console.log("localStorage auth_token:", localStorage.getItem("auth_token"));
    console.log("localStorage refresh_token:", localStorage.getItem("refresh_token"));
    console.log("========================");
}, [isLoggedIn, isLoading, user]);
```

### Test API Directly
```javascript
// In browser console
const token = localStorage.getItem("auth_token");
fetch("http://localhost:8000/api/auth/me/", {
    headers: {
        "Authorization": `Bearer ${token}`
    }
})
.then(r => r.json())
.then(data => console.log("API Response:", data))
.catch(e => console.error("API Error:", e));
```

### Check Store State
```javascript
// In browser console with React DevTools
// Find useStore in Components
// Look at the state object
// Check: isLoggedIn, isLoading, user, error
```

## Support

If you're still having issues:
1. Share console logs
2. Share Network tab screenshots
3. Share backend logs
4. Describe exact steps to reproduce
5. Mention browser and OS
