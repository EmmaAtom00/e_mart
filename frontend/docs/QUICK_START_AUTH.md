# Quick Start: Authentication Setup

Get authentication running in 5 minutes.

## Step 1: Configure Environment

Create `.env.local` in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 2: Start Backend

The backend must be running on `http://localhost:8000`. Follow `BACKEND_AUTH_SETUP.md` for setup.

## Step 3: Test Authentication

### Sign Up
1. Go to `http://localhost:3000/auth/sign-up`
2. Fill in the form
3. Click "Sign Up"
4. Should redirect to home page

### Sign In
1. Go to `http://localhost:3000/auth/sign-in`
2. Enter credentials
3. Click "Sign In"
4. Should redirect to home page

### Account Page
1. Go to `http://localhost:3000/account`
2. Should see user profile
3. Click "Logout" to logout

## Step 4: Use in Your Components

### Get Current User

```typescript
import { useAuth } from "@/hooks/useAuth";

export const MyComponent = () => {
  const { user, isLoggedIn } = useAuth();
  
  if (!isLoggedIn) return <div>Please login</div>;
  return <div>Welcome, {user?.firstName}!</div>;
};
```

### Protect a Route

```typescript
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export const MyPage = () => {
  return (
    <ProtectedRoute>
      <div>This is protected</div>
    </ProtectedRoute>
  );
};
```

### Make API Calls

```typescript
import { apiClient } from "@/lib/api";

// Get current user
const response = await apiClient.getCurrentUser();

// Update profile
await apiClient.updateProfile({
  first_name: "Jane",
  last_name: "Smith"
});
```

## Common Issues

### "Cannot find module '@/lib/api'"
- Make sure `lib/api.ts` exists
- Check tsconfig.json has path alias `@/*`

### "API request failing with 401"
- Verify backend is running
- Check API URL in `.env.local`
- Verify token is being sent in Authorization header

### "User not persisting after refresh"
- Check localStorage is enabled
- Verify AuthProvider wraps the app in layout.tsx
- Check browser console for errors

### "Infinite redirect loop"
- Clear localStorage
- Check middleware.ts configuration
- Verify token is being stored correctly

## Next Steps

1. Read `AUTHENTICATION_GUIDE.md` for detailed documentation
2. Follow `BACKEND_AUTH_SETUP.md` to implement backend
3. Customize auth pages to match your design
4. Add email verification
5. Add password reset flow
6. Add OAuth/Social login

## File Locations

- Auth pages: `app/(pages)/auth/`
- Auth components: `components/auth/`
- Auth hooks: `hooks/useAuth.ts`
- API client: `lib/api.ts`
- Zustand store: `store/useStore.ts`
- Middleware: `middleware.ts`

## API Endpoints

Backend must provide:

```
POST   /api/auth/signup/
POST   /api/auth/login/
POST   /api/auth/logout/
POST   /api/auth/refresh/
GET    /api/auth/me/
PATCH  /api/auth/profile/
POST   /api/auth/password-reset/
POST   /api/auth/password-reset-confirm/
```

See `BACKEND_AUTH_SETUP.md` for implementation.

## Support

- `AUTHENTICATION_GUIDE.md` - Full documentation
- `BACKEND_AUTH_SETUP.md` - Backend setup
- `AUTH_IMPLEMENTATION_SUMMARY.md` - Implementation details

---

**Ready to go!** 🚀
