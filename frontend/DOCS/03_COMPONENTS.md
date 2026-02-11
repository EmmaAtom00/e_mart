# Component Architecture

## Component Types

### 1. **Layout Components** (Structural)
- Navbar, Footer, Sidebar
- Wrap pages and provide structure
- Usually not "use client" unless interactive

### 2. **Page Components** (Route handlers)
- Home, Products, Cart, etc.
- Located in `app/(pages)/`
- Can be server or client components

### 3. **Feature Components** (Functional)
- ProductCard, SearchBar, CategorySection
- Reusable across pages
- Located in `components/`

### 4. **UI Components** (Presentational)
- Button, Input, Modal
- Pure presentation
- No business logic

## Key Components Explained

### Navbar Component

**File**: `frontend/components/layout/navbar.tsx`

```typescript
"use client"; // Interactive, needs client

import { useStore } from "@/store/useStore";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart, wishlist, user, logout, isLoggedIn } = useStore();

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-black text-white">
        {/* Announcement content */}
      </div>

      {/* Main navbar */}
      <header className="sticky top-0 z-40">
        {/* Logo */}
        {/* Desktop nav */}
        {/* Icons with badges */}
        {/* Mobile menu button */}
      </header>

      {/* Mobile drawer */}
      <aside className={menuOpen ? "translate-x-0" : "translate-x-full"}>
        {/* Mobile menu content */}
      </aside>

      {/* Search modal */}
      <SearchModal isOpen={searchModalOpen} />
    </>
  );
}
```

**Key Features**:
- Sticky positioning (stays at top)
- Cart/Wishlist badges showing counts
- User dropdown when logged in
- Mobile drawer menu
- Search modal for mobile

**State Used**:
- `cart.length` - Cart item count
- `wishlist.length` - Wishlist count
- `user` - Current user info
- `isLoggedIn` - Show/hide account menu

### Footer Component

**File**: `frontend/components/layout/footer.tsx`

```typescript
export default function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* 5 column grid */}
      {/* Brand & Newsletter */}
      {/* Shop links */}
      {/* Account links */}
      {/* Support info */}
      {/* Company links */}

      {/* Divider */}

      {/* Bottom section */}
      {/* Copyright */}
      {/* Legal links */}
      {/* Social media */}
    </footer>
  );
}
```

**Key Features**:
- 5-column layout on desktop
- Responsive grid (1 col mobile, 2 col tablet, 5 col desktop)
- All links use Next.js `Link` component
- Newsletter signup input
- Social media links

### Product Card Component

**File**: `frontend/components/common/productContainer.tsx`

```typescript
interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="rounded-lg border bg-white p-4">
      {/* Image with discount badge */}
      <div className="relative h-40">
        <img src={product.image} alt={product.name} />
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* Product info */}
      <h3>{product.name}</h3>

      {/* Price */}
      <div className="flex gap-2">
        <span className="font-bold">${product.salePrice}</span>
        <span className="line-through text-gray-400">${product.price}</span>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1">
        {/* Stars */}
        <span>{product.rating}</span>
        <span className="text-gray-500">({product.reviewsCount})</span>
      </div>
    </div>
  );
}
```

**Key Features**:
- Displays product image
- Shows discount badge
- Displays sale price and original price
- Shows star rating
- Responsive sizing

### Search Modal Component

**File**: `frontend/components/common/searchModal.tsx`

```typescript
interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchValue, setSearchValue] = useState("");

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 flex items-start pt-20">
        <div className="w-full max-w-md bg-white rounded-lg p-6">
          {/* Header with close button */}
          {/* Search input */}
          {/* Popular suggestions */}
          {/* Search button */}
        </div>
      </div>
    </>
  );
}
```

**Key Features**:
- Only renders when `isOpen` is true
- Overlay closes modal when clicked
- Search input with auto-focus
- Popular search suggestions
- Mobile-only (hidden on desktop)

### Flash Sales Component

**File**: `frontend/components/layout/flashSales.tsx`

```typescript
export default function FlashSales() {
  return (
    <section className="space-y-6">
      {/* Section label */}
      <div className="flex items-center gap-4">
        <div className="h-10 w-5 bg-red-500" />
        <p className="font-semibold text-red-500">Today's</p>
      </div>

      {/* Header with countdown */}
      <div className="flex justify-between">
        <h2 className="text-4xl font-bold">Flash Sales</h2>
        {/* Countdown timer */}
      </div>

      {/* Carousel */}
      <Carousel>
        <CarouselContent>
          {PRODUCTS.map((product) => (
            <CarouselItem key={product.id}>
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* CTA Button */}
      <button>View All Products</button>
    </section>
  );
}
```

**Key Features**:
- Red accent bar (brand color)
- Countdown timer display
- Embla carousel for products
- Responsive grid in carousel
- Call-to-action button

## Component Patterns

### 1. **Props Pattern**
```typescript
interface Props {
  title: string;
  items: Product[];
  onSelect: (id: number) => void;
}

export default function Component({ title, items, onSelect }: Props) {
  // Use props
}
```

### 2. **Render Props Pattern**
```typescript
<ProductList
  products={products}
  renderItem={(product) => <ProductCard product={product} />}
/>
```

### 3. **Compound Components**
```typescript
<Carousel>
  <CarouselContent>
    <CarouselItem>Item 1</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

## Styling Approach

### Tailwind CSS Classes

```typescript
// Responsive classes
<div className="
  w-full                    // Full width
  md:w-1/2                  // Half width on medium+
  lg:w-1/3                  // Third width on large+
  px-4 md:px-8 lg:px-32    // Responsive padding
  py-6 md:py-12            // Responsive vertical padding
  bg-white                  // Background
  rounded-lg                // Border radius
  border border-gray-200    // Border
  shadow-md hover:shadow-lg // Shadow & hover
  transition                // Smooth transitions
">
```

### Breakpoints Used
- `sm`: 640px (small phones)
- `md`: 768px (tablets)
- `lg`: 1024px (desktops)
- `xl`: 1280px (large desktops)

## Component Reusability

### Good Practices
✅ Keep components small and focused
✅ Use TypeScript for type safety
✅ Pass data via props
✅ Use callbacks for actions
✅ Make components responsive
✅ Use semantic HTML

### Bad Practices
❌ Hardcoding data in components
❌ Mixing concerns (UI + logic)
❌ Not using TypeScript
❌ Prop drilling too deep
❌ Ignoring accessibility

---

**Next**: See `04_PAGES.md` for page structure
