# 🎓 Week 2: State Management & Advanced API Design
*Intensity level: High | Focus: Global Data Flow & Serializer Logic*

## 📅 Day 8: UI State vs Server State
### 🧠 Theory: The Great Divide
- **The "Why" of Zustand**: Redux requires boilerplate (actions, reducers, types). Zustand is a simple hook. In modern React, we prefer **Atomic State** or simple hooks over the giant "Global Tree" of Redux.
- **Industry Standard**: Keep the store "Skinny". Don't put data that can be derived (e.g., `totalPrice` shouldn't be state—it should be a getter that sums the `items` array).

### 💻 Hands-on: Zustand Integration
- **Example**:
```typescript
interface CartStore {
  items: Product[];
  addItem: (product: Product) => void;
}

export const useStore = create<CartStore>()(
  persist((set) => ({
    items: [],
    addItem: (product) => set((state) => ({ 
      items: [...state.items, product] 
    })),
  }), { name: 'emart-cart' })
);
```
- **The "Why" of Persist**: Users expect their cart to survive a page refresh. Zustand's middleware automates the `localStorage` sync we manually built in Week 1.

---

## 📅 Day 9: DRF Serializers - The Heart of the API
### 🧠 Theory: Declarative Transformation
- **The "Why" of ModelSerializers**: They automatically generate fields based on your models, reducing "Boilerplate".
- **Validation Industry Standard**: Always put business logic in `validate_<field>` methods. This keeps your views "Thin" (Single Responsibility Principle).

### 💻 Hands-on: The "MethodField" Power
- **Example**:
```python
class ProductSerializer(serializers.ModelSerializer):
    final_price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'discount', 'final_price']

    def get_final_price(self, obj):
        # Calculate calculated data that doesn't exist in DB
        return obj.price * (1 - obj.discount / 100)
```
- **The "Why"**: We don't want to store "Computed Data" in the database if it can change frequently. The Serializer is the perfect place to calculate it for the frontend.

---

## 📅 Day 10: Performance APIs: Filters & Pagination
### 🧠 Theory: Scalable Data Retrieval
- **Indexing**: Why `db_index=True` on slugs and categories is non-negotiable for large stores.
- **Filtering Architecture**: `DjangoFilterBackend` vs manual `get_queryset` filtering.
- **Pagination Styles**: `PageNumberPagination` vs `CursorPagination`. Why Cursors are better for infinite scrolling (prevents duplicate items).

### 💻 Hands-on: Range Filtering
- **Task**: Implement the `min_price` and `max_price` filter logic we planned.
- **Exercise**: Verify the SQL emitted by Django using the `django-debug-toolbar` or by print `queryset.query`. Ensure no redundant joins are happening.

---

[... Continued Detail for Days 11-14 ...]

## 🏁 Mastery Checkpoint: The API Contract
1.  **Swagger Review**: Open `/api/docs/`. Do all your endpoints have proper descriptions and response codes?
2.  **Optimistic UI**: Implement an "Add to Wishlist" button that updates the UI *before* the API returns success. Handle the rollback if the API fails.
3.  **Refactor**: Reduce the complexity of a Serializer that has more than 5 `SerializerMethodFields`.
