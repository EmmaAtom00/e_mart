# E-Mart ERD - Quick Reference

## Relationship Overview

```
CustomUser (1) ──────< (∞) Cart
    │
    │ (1:1)
    │
    └──────────────── (1) Wishlist

Category (1) ──────< (∞) Product

Cart (1) ──────< (∞) CartItem >──────< (1) Product

Wishlist (1) ──────< (∞) WishlistItem >──────< (1) Product
```

## Entity Summary

| Entity | Primary Purpose | Key Relationships |
|--------|----------------|-------------------|
| **CustomUser** | User accounts & authentication | → Cart (1:∞)<br>→ Wishlist (1:1) |
| **Category** | Product organization | → Product (1:∞) |
| **Product** | Product catalog | ← Category (∞:1)<br>→ CartItem (1:∞)<br>→ WishlistItem (1:∞) |
| **Cart** | Shopping cart (guest + user) | ← CustomUser (∞:1)<br>→ CartItem (1:∞) |
| **CartItem** | Cart line items | ← Cart (∞:1)<br>← Product (∞:1) |
| **Wishlist** | User's saved products | ← CustomUser (1:1)<br>→ WishlistItem (1:∞) |
| **WishlistItem** | Wishlist line items | ← Wishlist (∞:1)<br>← Product (∞:1) |

## Cardinality Notation

- `(1)` = One
- `(∞)` = Many
- `(1:1)` = One-to-One
- `(1:∞)` = One-to-Many
- `(∞:1)` = Many-to-One

## Key Constraints

### Unique Constraints
- `CustomUser.email`
- `CustomUser.username`
- `Category.slug`
- `Product.slug`
- `Cart.cart_code`
- `Wishlist.user_id` (one-to-one)
- `WishlistItem(wishlist_id, product_id)` (composite)

### Nullable Foreign Keys
- `Cart.user_id` - Allows guest carts
- `Product.category_id` - Allows uncategorized products

### Cascade Deletes
- Delete `Cart` → Deletes all `CartItem`
- Delete `Wishlist` → Deletes all `WishlistItem`
- Delete `CustomUser` → Deletes `Cart` and `Wishlist`

### Protected Deletes
- `Product` deletion does NOT cascade to `CartItem` or `WishlistItem`
- `Category` deletion sets `Product.category_id` to NULL (SET_NULL)

## Database Tables (Django naming)

| Model | Table Name |
|-------|-----------|
| CustomUser | `users` |
| Category | `api_category` |
| Product | `products` |
| Cart | `api_cart` |
| CartItem | `api_cartitem` |
| Wishlist | `api_wishlist` |
| WishlistItem | `api_wishlistitem` |
