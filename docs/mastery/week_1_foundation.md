# 🎓 Week 1: Foundation & Deep Architecture
*Intensity level: High | Duration: 70 Hours*

## 📅 Day 1: React 19 & Component Lifecycle
### 🧠 Theory: The "Why" of React 19
- **Reconciliation & Fiber**: In the early days, React used a synchronous stack-based diffing. React 19 sits on "Fiber"—a virtual stack frame that can pause, resume, and prioritize work.
- **Industry Standard**: We use **Functional Components** and **Hooks**. Class components are legacy. Functional components align with the industry trend toward functional programming (immutability, predictability).
- **The "Why" of Keys**: If you have `[A, B, C]` and insert `D` at the start, without keys, React might think `A` changed to `D`, `B` to `A`, etc. With keys, it knows `A`, `B`, and `C` are just moved.

### 💻 Hands-on: Performance Refactor
- **Example**: A "Leaky" Product Card.
```tsx
// ❌ BAD: Re-renders on every parent scroll/hover
const ProductCard = ({ product, onAddToCart }) => {
  console.log("Rendering...");
  return <div onClick={() => onAddToCart(product.id)}>{product.name}</div>;
}

// ✅ GOOD: Only re-renders if product OR onAddToCart reference changes
const ProductCard = React.memo(({ product, onAddToCart }) => {
  return <div onClick={() => onAddToCart(product.id)}>{product.name}</div>;
});
```
- **The "Why"**: In a grid of 100 products, one small hover change in the parent shouldn't force 100 components to re-diff. `React.memo` stops the tree traversal.

---

## 📅 Day 2: Advanced Hooks & Custom State
### 🧠 Theory: "How" Hooks Work Under the Hood
- **Linked Lists**: Hooks work because React keeps a linked list of state cells for each component. This is **why** you cannot call hooks inside `if` statements or loops—it breaks the order of the list.
- **The "Why" of Custom Hooks**: Dry components are easier to test. If you have 5 components that need to detect "Click Outside", you don't copy-paste the `useEffect`. You build `useClickOutside`.

### 💻 Hands-on: The Industry-Standard `useLocalStorage`
- **Example**:
```typescript
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    setStoredValue(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  return [storedValue, setValue] as const;
}
```
- **Best Practice**: Always use an initializer function in `useState` for expensive operations like `JSON.parse`. This ensures it only runs during the *initial* mount.

---

## 📅 Day 3: Next.js 15 Rendering Strategies
### 🧠 Theory: The Rendering Spectrum
- **SSR (Server-Side Rendering)**: Good for SEO + dynamic data. Generates HTML on every request.
- **SSG (Static Site Generation)**: Fast, CDN-cacheable. Good for blogs.
- **ISR (Incremental Static Regeneration)**: The "Holy Grail". Update static pages *after* deployment without a full rebuild.
- **PPR (Partial Prerendering)**: React 19's focus on rendering the shell statically while streaming dynamic holes.

### 💻 Hands-on: ISR Implementation
- **Task**: Update the [Product Detail page](file:///home/atom/Documents/Portfolio/E-Mart/frontend/app/products/[id]/page.tsx) logic.
- **Exercise**: Set `revalidate = 3600` (1 hour). Verify the page serves from cache, then updates in the background after the first request past 1 hour.

---

[... Similar Level of Detail for Days 4-7 ...]

## 🏁 Weekly Self-Assessment
1.  **Explainer**: Explain "Hydration" to a 5-year-old.
2.  **Code Check**: Does every `useEffect` in your project have a cleanup function if it uses a timer or event listener?
3.  **ORM Check**: Scan your Django views for any loops that hit the database. Convert them to `prefetch_related`.
