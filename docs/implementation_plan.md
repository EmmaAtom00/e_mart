# Database-Backed Persistence Plan

Currently, your Cart and Wishlist are only saved in the browser's shared storage. If you log in on another device, they will be empty. We will move these to the database so they persist for your account everywhere.

## Proposed Changes

### 1. [Component] Backend Models
#### [MODIFY] [models.py](file:///home/atom/Documents/Portfolio/E-Mart/backend/api/models.py)
- **Cart**: Add `user` ForeignKey (nullable) so we can link a cart to an account.
- **Wishlist**: [NEW] Create `Wishlist` and `WishlistItem` models linked to `User`.

### 2. [Component] Backend Views
#### [MODIFY] [views.py](file:///home/atom/Documents/Portfolio/E-Mart/backend/api/views.py)
- Update `add_to_cart` to automatically link the cart to the logged-in user.
- Create new endpoints:
    - `GET /api/wishlist/`: Get user's wishlist.
    - `POST /api/wishlist/add/`: Add product to wishlist.
    - `DELETE /api/wishlist/remove/`: Remove from wishlist.

### 3. [Component] Frontend Store
#### [MODIFY] [useStore.ts](file:///home/atom/Documents/Portfolio/E-Mart/frontend/store/useStore.ts)
- Update `addToCart` and `addToWishlist` to call the API when `isLoggedIn` is true.
- Update `initializeAuth` to fetch the Cart and Wishlist from the database on login.

## Verification Plan
1. **Cart Sync**: Add item to cart locally -> Log in -> Verify item is still in cart (synced to DB).
2. **Wishlist Persistence**: Add item to wishlist -> Logout -> Log in -> Verify wishlist is not empty.
3. **Cross-Browser**: Add item in one browser -> Log in in another -> Verify same cart/wishlist.
