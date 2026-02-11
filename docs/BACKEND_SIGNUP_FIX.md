# Backend Signup Fix - Summary

## Problem
The signup endpoint was throwing a `TypeError: UserManager.create_user() missing 1 required positional argument: 'username'`

This occurred because:
1. The `CustomUser` model extends Django's `AbstractUser` which requires a `username` field
2. The `SignUpSerializer` was not providing a `username` when creating the user
3. The serializer was trying to pass all validated_data directly to `create_user()` without the required `username` parameter

## Solution
Updated the `SignUpSerializer.create()` method in `backend/api/serializers.py` to:

1. **Generate username from email**: Extract the part before the `@` symbol from the email
   ```python
   username = email.split('@')[0]
   ```

2. **Ensure username uniqueness**: If the generated username already exists, append a counter
   ```python
   counter = 1
   original_username = username
   while User.objects.filter(username=username).exists():
       username = f"{original_username}{counter}"
       counter += 1
   ```

3. **Create user with username**: Pass the generated username to `create_user()`
   ```python
   user = User.objects.create_user(
       username=username,
       password=password,
       **validated_data
   )
   ```

## Changes Made

### File: `backend/api/serializers.py`

**Before:**
```python
def create(self, validated_data):
    validated_data.pop('password_confirm')
    password = validated_data.pop('password')
    user = User.objects.create_user(**validated_data, password=password)
    return user
```

**After:**
```python
def create(self, validated_data):
    validated_data.pop('password_confirm')
    password = validated_data.pop('password')
    email = validated_data.get('email')
    
    # Generate username from email (use email prefix before @)
    username = email.split('@')[0]
    
    # Ensure username is unique
    counter = 1
    original_username = username
    while User.objects.filter(username=username).exists():
        username = f"{original_username}{counter}"
        counter += 1
    
    user = User.objects.create_user(
        username=username,
        password=password,
        **validated_data
    )
    return user
```

## How It Works

1. User submits signup form with: `email`, `first_name`, `last_name`, `password`, `password_confirm`
2. Serializer validates that passwords match
3. Serializer generates a unique username from the email
4. User is created with all required fields including the generated username
5. JWT tokens are generated and returned to the frontend

## Example

**Request:**
```json
{
    "email": "john.doe@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "password": "securepassword123",
    "password_confirm": "securepassword123"
}
```

**Generated Username:** `john.doe`

**If `john.doe` exists, generated usernames would be:**
- `john.doe1`
- `john.doe2`
- etc.

**Response:**
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {
        "id": 1,
        "email": "john.doe@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "role": "customer",
        "avatar": null,
        "email_verified": false
    }
}
```

## Testing

To test the fix:

1. **Test basic signup:**
   ```bash
   curl -X POST http://localhost:8000/api/auth/signup/ \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "first_name": "Test",
       "last_name": "User",
       "password": "testpass123",
       "password_confirm": "testpass123"
     }'
   ```

2. **Test duplicate email:**
   - Try signing up with the same email again
   - Should return 400 error (email already exists)

3. **Test duplicate username generation:**
   - Sign up with `user1@example.com` (generates username: `user1`)
   - Sign up with `user1@different.com` (generates username: `user1` → `user11`)
   - Both should succeed with different usernames

4. **Test password mismatch:**
   - Send different passwords in `password` and `password_confirm`
   - Should return 400 error

5. **Test from frontend:**
   - Go to `/auth/sign-up`
   - Fill in the form
   - Submit
   - Should see success message and redirect to home

## Related Files

- `backend/api/models.py` - CustomUser model definition
- `backend/api/serializers.py` - SignUpSerializer (fixed)
- `backend/api/views.py` - signup view
- `backend/emartApi/settings.py` - AUTH_USER_MODEL configuration
- `frontend/lib/api.ts` - Frontend API client
- `frontend/app/(pages)/auth/sign-up/page.tsx` - Frontend signup page

## Status

✅ **Fixed** - Signup endpoint now works correctly and creates users with proper username generation.
