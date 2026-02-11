# Week 1 Supplement: Cart & Wishlist Deep Dive

## 🎯 New Learning Objectives (Based on Recent Implementation)

This supplement covers the **Cart & Wishlist persistence** feature we just implemented. Study this alongside Week 1 and Week 2 materials.

---

## 1. Database Design Patterns

### Guest Cart Pattern

**Problem**: How do we allow users to shop without creating an account?

**Solution**: Nullable foreign key + unique cart code

```python
class Cart(models.Model):
    user = models.ForeignKey(
        CustomUser, 
        on_delete=models.CASCADE, 
        null=True,  # ← Allows NULL for guest carts
        blank=True
    )
    cart_code = models.CharField(max_length=11, unique=True)
```

**How it works**:
1. Guest adds item to cart
2. Frontend generates random `cart_code` (e.g., "abc123xyz")
3. Backend creates cart with `user=NULL`, `cart_code="abc123xyz"`
4. Frontend stores `cart_code` in localStorage
5. When user logs in, backend updates `user` field

**Study Exercise**:
- Trace the code flow in `api/views.py` → `add_to_cart` function
- Find where the cart is linked to user upon login
- Explain why we need BOTH `user_id` and `cart_code`

---

## 2. One-to-One vs One-to-Many Relationships

### One-to-Many: User → Cart

```python
class Cart(models.Model):
    user = models.ForeignKey(CustomUser, ...)
    # One user can have MANY carts (historical carts)
```

**Why?**
- User might have multiple carts over time
- Allows cart history tracking
- Supports "save for later" feature

### One-to-One: User ↔ Wishlist

```python
class Wishlist(models.Model):
    user = models.OneToOneField(CustomUser, ...)
    # Each user has EXACTLY ONE wishlist
```

**Why?**
- Simplifies logic (no need to choose which wishlist)
- Wishlist is personal, not transactional
- Auto-created when user adds first item

**Study Exercise**:
- Open `api/models.py` and compare `Cart` and `Wishlist` models
- Try to explain when to use `ForeignKey` vs `OneToOneField`
- What would break if we used `ForeignKey` for Wishlist?

---

## 3. State Synchronization Pattern

### The Problem

We have TWO sources of truth:
1. **Frontend State** (Zustand) - Fast, local
2. **Backend Database** (PostgreSQL) - Persistent, authoritative

How do we keep them in sync?

### The Solution: Optimistic Updates + Server Sync

```typescript
// store/useStore.ts
addToCart: async (product: Product, quantity: number) => {
  // 1. Optimistic update (instant UI feedback)
  set((state) => ({
    cart: [...state.cart, { product, quantity }]
  }));

  // 2. Sync with server
  try {
    const response = await apiClient.addToCart(cartCode, product.id, quantity);
    
    // 3. Update with server response (source of truth)
    set({ cart: response.cartitems });
  } catch (error) {
    // 4. Rollback on error
    set((state) => ({
      cart: state.cart.filter(item => item.product.id !== product.id)
    }));
  }
}
```

**Flow Diagram**:
```
User clicks "Add to Cart"
    ↓
Zustand updates local state (optimistic)
    ↓
UI updates immediately (cart icon shows +1)
    ↓
API call to backend
    ↓
Backend saves to database
    ↓
Backend returns updated cart
    ↓
Zustand syncs with server response
    ↓
UI reflects final state
```

**Study Exercise**:
- Open `store/useStore.ts` and find the `addToCart` function
- Trace what happens if the API call fails
- Explain why we update state TWICE (optimistic + server sync)

---

## 4. Nested Serializers

### The Problem

When we fetch a cart, we need:
- Cart data (id, cart_code, total)
- Cart items (quantity)
- Product data for each item (name, price, image)

### The Solution: Nested Serializers

```python
# api/serializers.py
class CartItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)  # ← Nested!
    sub_total = serializers.SerializerMethodField()
    
    def get_sub_total(self, obj):
        return obj.product.sale_price * obj.quantity

class CartSerializer(serializers.ModelSerializer):
    cartitems = CartItemSerializer(many=True, read_only=True)  # ← Nested!
    cart_total = serializers.SerializerMethodField()
    
    def get_cart_total(self, obj):
        return sum(item.product.sale_price * item.quantity 
                   for item in obj.cartitems.all())
```

**Result**:
```json
{
  "id": 1,
  "cart_code": "abc123xyz",
  "cartitems": [
    {
      "id": 1,
      "product": {
        "id": 1,
        "name": "Gaming Laptop",
        "price": "1299.99",
        "sale_price": "1104.99"
      },
      "quantity": 2,
      "sub_total": 2209.98
    }
  ],
  "cart_total": 2209.98
}
```

**Study Exercise**:
- Open `api/serializers.py` and find `CartSerializer`
- Identify all nested serializers
- Explain what `SerializerMethodField` does
- Why is `read_only=True` important for nested serializers?

---

## 5. Authentication Flow with Cart Sync

### Scenario: User adds items as guest, then logs in

**Step-by-step**:

1. **Guest adds item**:
   ```
   POST /api/cart/add/
   { "cart_code": "abc123", "product_id": 1, "quantity": 2 }
   ```
   - Cart created with `user=NULL`

2. **User logs in**:
   ```
   POST /api/auth/login/
   { "email": "user@example.com", "password": "..." }
   ```
   - Server returns JWT tokens

3. **Frontend syncs cart**:
   ```typescript
   // store/useStore.ts → initializeAuth()
   const cartResponse = await apiClient.getCart(cartCode);
   set({ cart: cartResponse.cartitems });
   ```

4. **Backend links cart to user**:
   ```python
   # In add_to_cart view
   if request.user.is_authenticated:
       cart.user = request.user
       cart.save()
   ```

**Study Exercise**:
- Open `store/useStore.ts` and find `initializeAuth` function
- Trace what happens when user logs in
- Find where the cart is linked to user in `api/views.py`

---

## 6. Hands-On Exercises

### Exercise 1: Add "Move to Wishlist" Feature

**Requirements**:
1. Add button to cart items: "Move to Wishlist"
2. When clicked:
   - Add product to wishlist
   - Remove from cart
   - Show success message

**Files to modify**:
- `frontend/components/cart/CartItem.tsx` (add button)
- `frontend/store/useStore.ts` (add `moveToWishlist` action)

**Hint**: You already have `addToWishlist` and `removeFromCart` functions!

### Exercise 2: Add Cart Item Count Badge

**Requirements**:
1. Show number of items in cart on navbar icon
2. Update in real-time when items added/removed

**Files to modify**:
- `frontend/components/layout/navbar.tsx`
- Use `useStore` to get cart length

### Exercise 3: Implement "Clear Cart" Feature

**Requirements**:
1. Add "Clear Cart" button
2. Call backend endpoint: `DELETE /api/cart/clear/`
3. Update Zustand state

**Files to modify**:
- `frontend/store/useStore.ts` (add `clearCart` action)
- `frontend/lib/api.ts` (add `clearCart` method)

---

## 7. Advanced Concepts to Explore

### Denormalization for Performance

**Question**: Why do we store `sale_price` in the database when we can calculate it?

```python
# We could do this:
@property
def sale_price(self):
    return self.price - (self.price * self.discount / 100)

# But we do this instead:
def save(self, *args, **kwargs):
    self.sale_price = self.price - (self.price * Decimal(self.discount) / 100)
    super().save(*args, **kwargs)
```

**Answer**: Performance trade-off
- **Normalized**: Calculate on every query (slower, no redundancy)
- **Denormalized**: Store calculated value (faster, slight redundancy)

For frequently accessed data (product prices), denormalization wins.

### Unique Constraints

**Question**: How do we prevent duplicate products in a wishlist?

```python
class WishlistItem(models.Model):
    wishlist = models.ForeignKey(Wishlist, ...)
    product = models.ForeignKey(Product, ...)
    
    class Meta:
        unique_together = ('wishlist', 'product')  # ← This!
```

**What it does**:
- Database enforces uniqueness at the table level
- Prevents race conditions (two requests adding same product)
- Returns error if duplicate attempted

---

## 📚 Recommended Reading Order

1. Read this supplement first
2. Study `database_erd.md` for visual relationships
3. Read `master_documentation.md` sections 4-7
4. Trace code in `api/models.py`, `api/views.py`, `store/useStore.ts`
5. Complete hands-on exercises above

---

## 🎯 Mastery Checkpoint

You've mastered this section when you can:

- [ ] Explain the guest cart pattern and why it's needed
- [ ] Draw the relationship between User, Cart, CartItem, and Product
- [ ] Implement optimistic updates with server sync
- [ ] Write a nested serializer from scratch
- [ ] Trace the complete flow from "Add to Cart" click to database save
- [ ] Explain denormalization trade-offs
- [ ] Implement a new feature using the same patterns

**Next**: Move to Week 2 for advanced state management and API design!
