# Best Practices & Patterns

## Code Organization

### File Naming

```
✅ Good
- productCard.tsx (camelCase for components)
- useStore.ts (camelCase for hooks)
- type.ts (lowercase for types)
- data.ts (lowercase for data)

❌ Bad
- ProductCard.tsx (PascalCase for files)
- UseStore.ts (PascalCase for hooks)
- Types.ts (PascalCase for types)
```

### Folder Structure

```
✅ Good
components/
├── common/          (Shared components)
├── layout/          (Layout components)
└── ui/              (UI components)

pages/
├── auth/
├── products/
└── account/

❌ Bad
components/
├── Button.tsx
├── Card.tsx
├── ProductCard.tsx
├── Navbar.tsx
└── Footer.tsx
```

## Component Best Practices

### 1. Keep Components Small

```typescript
// ✅ Good - Single responsibility
export default function ProductCard({ product }: Props) {
  return (
    <div className="rounded-lg border p-4">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
    </div>
  );
}

// ❌ Bad - Too much logic
export default function ProductCard({ product }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart, addToWishlist } = useStore();
  
  // ... 100 lines of code
}
```

### 2. Use TypeScript

```typescript
// ✅ Good - Type safe
interface ProductCardProps {
  product: Product;
  onSelect?: (id: number) => void;
}

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  return <div>{product.name}</div>;
}

// ❌ Bad - No types
export default function ProductCard(props) {
  return <div>{props.product.name}</div>;
}
```

### 3. Prop Drilling Prevention

```typescript
// ✅ Good - Use context/store
const { user } = useStore();

// ❌ Bad - Prop drilling
<Component user={user}>
  <ChildComponent user={user}>
    <GrandchildComponent user={user} />
  </ChildComponent>
</Component>
```

### 4. Memoization

```typescript
// ✅ Good - Memoize expensive components
const ProductCard = memo(function ProductCard({ product }: Props) {
  return <div>{product.name}</div>;
});

// ✅ Good - Memoize callbacks
const handleClick = useCallback(() => {
  addToCart(product, 1);
}, [product]);
```

## State Management

### 1. Keep State Close

```typescript
// ✅ Good - Local state for UI
const [isOpen, setIsOpen] = useState(false);

// ❌ Bad - Global state for UI
const { isOpen, setIsOpen } = useStore();
```

### 2. Use Zustand Correctly

```typescript
// ✅ Good - Selective subscription
const cart = useStore((state) => state.cart);

// ✅ Good - Multiple values
const { cart, addToCart } = useStore();

// ❌ Bad - Subscribe to entire store
const store = useStore();
```

### 3. Normalize State

```typescript
// ✅ Good - Normalized
{
  cart: [
    { id: 1, quantity: 2 },
    { id: 2, quantity: 1 }
  ]
}

// ❌ Bad - Denormalized
{
  cart: [
    { id: 1, name: "Product", price: 100, quantity: 2 },
    { id: 2, name: "Product 2", price: 50, quantity: 1 }
  ]
}
```

## Performance

### 1. Image Optimization

```typescript
// ✅ Good - Use Next.js Image
import Image from "next/image";

<Image
  src={product.image}
  alt={product.name}
  width={300}
  height={300}
  priority={false}
/>

// ❌ Bad - Regular img tag
<img src={product.image} alt={product.name} />
```

### 2. Code Splitting

```typescript
// ✅ Good - Dynamic import
const Modal = dynamic(() => import("@/components/Modal"), {
  loading: () => <div>Loading...</div>,
});

// ✅ Good - Route-based splitting (automatic in Next.js)
// Each page is automatically code-split
```

### 3. Lazy Loading

```typescript
// ✅ Good - Lazy load images
<img
  src={product.image}
  alt={product.name}
  loading="lazy"
/>
```

## Error Handling

### 1. Try-Catch

```typescript
// ✅ Good
async function fetchProducts() {
  try {
    const response = await fetch("/api/products");
    if (!response.ok) throw new Error("Failed to fetch");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

// ❌ Bad - No error handling
async function fetchProducts() {
  const response = await fetch("/api/products");
  return await response.json();
}
```

### 2. User Feedback

```typescript
// ✅ Good - Show error to user
const [error, setError] = useState("");

const handleSubmit = async (e) => {
  try {
    await submitForm(data);
  } catch (err) {
    setError("Something went wrong. Please try again.");
  }
};

return (
  <>
    {error && <div className="text-red-500">{error}</div>}
    <form onSubmit={handleSubmit}>...</form>
  </>
);
```

## Accessibility

### 1. Semantic HTML

```typescript
// ✅ Good
<button onClick={handleClick}>Click me</button>
<a href="/page">Link</a>
<nav>Navigation</nav>
<main>Main content</main>

// ❌ Bad
<div onClick={handleClick}>Click me</div>
<div onClick={() => navigate("/page")}>Link</div>
<div>Navigation</div>
```

### 2. ARIA Labels

```typescript
// ✅ Good
<button aria-label="Close menu" onClick={closeMenu}>
  <X size={24} />
</button>

<div role="region" aria-label="Product filters">
  {/* Filters */}
</div>

// ❌ Bad
<button onClick={closeMenu}>
  <X size={24} />
</button>
```

### 3. Keyboard Navigation

```typescript
// ✅ Good - Keyboard accessible
<button onClick={handleClick} onKeyDown={handleKeyDown}>
  Click me
</button>

// ✅ Good - Tab order
<input tabIndex={0} />
<button tabIndex={1} />

// ❌ Bad - Not keyboard accessible
<div onClick={handleClick}>Click me</div>
```

## Testing

### 1. Component Testing

```typescript
// ✅ Good - Test component behavior
import { render, screen } from "@testing-library/react";

test("ProductCard displays product name", () => {
  const product = { id: 1, name: "Test Product", price: 100 };
  render(<ProductCard product={product} />);
  expect(screen.getByText("Test Product")).toBeInTheDocument();
});
```

### 2. Store Testing

```typescript
// ✅ Good - Test store actions
import { useStore } from "@/store/useStore";

test("addToCart adds product to cart", () => {
  const { getState } = useStore;
  const { addToCart } = getState();
  
  addToCart(product, 1);
  expect(getState().cart).toHaveLength(1);
});
```

## Security

### 1. Input Validation

```typescript
// ✅ Good - Validate input
const handleSubmit = (e) => {
  e.preventDefault();
  
  if (!email || !email.includes("@")) {
    setError("Invalid email");
    return;
  }
  
  if (password.length < 6) {
    setError("Password too short");
    return;
  }
  
  submitForm();
};
```

### 2. XSS Prevention

```typescript
// ✅ Good - React escapes by default
<div>{userInput}</div>

// ❌ Bad - Dangerous
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### 3. CSRF Protection

```typescript
// ✅ Good - Use POST for mutations
const handleDelete = async (id) => {
  const response = await fetch(`/api/products/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
```

## Documentation

### 1. Component Documentation

```typescript
/**
 * ProductCard - Displays a product with image, name, and price
 * 
 * @param {Product} product - The product to display
 * @param {Function} onSelect - Callback when product is selected
 * 
 * @example
 * <ProductCard product={product} onSelect={handleSelect} />
 */
export default function ProductCard({ product, onSelect }: Props) {
  // ...
}
```

### 2. Function Documentation

```typescript
/**
 * Calculates total price including tax and shipping
 * 
 * @param {number} subtotal - Subtotal before tax/shipping
 * @param {number} taxRate - Tax rate (0.1 for 10%)
 * @param {number} shipping - Shipping cost
 * @returns {number} Total price
 */
function calculateTotal(subtotal: number, taxRate: number, shipping: number) {
  return subtotal * (1 + taxRate) + shipping;
}
```

## Common Mistakes to Avoid

### 1. Missing Dependencies

```typescript
// ❌ Bad - Missing dependency
useEffect(() => {
  fetchData(id);
}, []); // Should include 'id'

// ✅ Good
useEffect(() => {
  fetchData(id);
}, [id]);
```

### 2. State in Render

```typescript
// ❌ Bad - Creates new object every render
const [data, setData] = useState({
  items: [],
  total: 0,
});

// ✅ Good - Separate state
const [items, setItems] = useState([]);
const [total, setTotal] = useState(0);
```

### 3. Inline Functions

```typescript
// ❌ Bad - New function every render
<button onClick={() => handleClick(id)}>Click</button>

// ✅ Good - Use useCallback
const handleClickMemo = useCallback(() => {
  handleClick(id);
}, [id]);

<button onClick={handleClickMemo}>Click</button>
```

---

**Next**: See `07_DEPLOYMENT.md` for deployment guide
