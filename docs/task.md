# Task: Deployment Configuration

- [ ] Explain and define production `ALLOWED_HOSTS` <!-- id: 12 -->
- [ ] Explain and define production `CORS_ALLOWED_ORIGINS` <!-- id: 13 -->
- [x] Create a production `.env.example` or deployment guide update <!-- id: 14 -->

# Task: Debug Redirect Loop

- [x] Check `settings.py` for `SECURE_SSL_REDIRECT` and `SECURE_PROXY_SSL_HEADER` <!-- id: 15 -->
- [x] Apply fix (`SECURE_PROXY_SSL_HEADER`) <!-- id: 17 -->
- [x] Verify fix by checking logs or asking user to test <!-- id: 18 -->

# Task: Fix Production Image Storage

- [x] Create implementation plan for Cloudinary <!-- id: 19 -->
- [x] Get Cloudinary credentials from user <!-- id: 20 -->
- [x] Install `cloudinary` dependencies <!-- id: 21 -->
- [x] Configure `settings.py` for Cloudinary <!-- id: 22 -->
- [x] Verify Cloudinary URLs in database <!-- id: 24 -->

# Task: Fix Admin CSS (Static Files)

- [x] Install `whitenoise` <!-- id: 25 -->
- [x] Configure `settings.py` for `Whitenoise` <!-- id: 26 -->
- [x] Verify `STATIC_ROOT` and `collectstatic` command <!-- id: 27 -->

# Task: Debug Production 500 Error

- [x] Move `cloudinary_storage` to top of `INSTALLED_APPS` <!-- id: 28 -->
- [x] Switch Whitenoise to non-manifest storage for better resilience <!-- id: 29 -->
- [x] Verify fix on Render <!-- id: 30 -->

# Task: Protected Routes Fix

- [x] Verify access to `/account` after re-login <!-- id: 34 -->

# Task: Database Persistence (Cart & Wishlist)

- [x] Create implementation plan for DB sync <!-- id: 35 -->
- [x] Add `User` to `Cart` and create `Wishlist` model <!-- id: 36 -->
- [x] Implement Wishlist API views <!-- id: 37 -->
- [x] Update frontend store to sync with DB when logged in <!-- id: 38 -->

# Task: Documentation & Demo Materials

- [x] Create demo video script for frontend <!-- id: 39 -->
- [x] Create API demo video script <!-- id: 40 -->
- [x] Create Postman collection for API testing <!-- id: 41 -->
- [x] Create database ERD documentation <!-- id: 42 -->
- [x] Create comprehensive master documentation <!-- id: 43 -->
