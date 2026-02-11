# Project Structure & Architecture

## Directory Layout

```
frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout (Navbar wrapper)
│   ├── page.tsx                 # Home page (imports from /pages/home)
│   ├── globals.css              # Global styles & Tailwind
│   ├── (pages)/                 # Route group for pages
│   │   ├── layout.tsx           # Pages layout (Footer wrapper)
│   │   ├── home/
│   │   │   └── page.tsx         # Home page content
│   │   ├── auth/
│   │   │   ├── sign-in/page.tsx
│   │   │   └── sign-up/page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx         # Products listing
│   │   │   └── [id]/page.tsx    # Single product (dynamic)
│   │   ├── cart/page.tsx
│   │   ├── wishlist/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── account/page.tsx
│   │   ├── about/page.tsx
│   │   └── contact/page.tsx
│   └── not-found.tsx            # 404 page
│
├── components/                   # Reusable components
│   ├── common/                  # Shared components
│   │   ├── heroSidebar.tsx      # Category sidebar
│   │   ├── productContainer.tsx # Product card
│   │   ├── searchBar.tsx        # Desktop search
│   │   ├── searchModal.tsx      # Mobile search modal
│   │   └── input.tsx            # Input component
│   └── layout/                  # Layout components
│       ├── navbar.tsx           # Navigation bar
│       ├── footer.tsx           # Footer
│       ├── flashSales.tsx       # Flash sales section
│       ├── categorySection.tsx  # Categories grid
│       ├── bestSelling.tsx      # Best sellers
│       ├── exploreProducts.tsx  # Product exploration
│       └── newArrivals.tsx      # New arrivals section
│
├── store/                        # Zustand state management
│   └── useStore.ts              # Global store (cart, wishlist, auth)
│
├── context/                      # (Deprecated - was Context API)
│   └── AppContext.tsx           # Removed in favor of Zustand
│
├── interface/                    # TypeScript types
│   └── type.ts                  # Product, User, Input types
│
├── helper/                       # Utility data
│   └── data.ts                  # Mock products & categories
│
└── lib/                          # Utility functions
    └── utils.ts                 # Helper functions
```

## Key Concepts

### 1. **Route Groups** `(pages)`
- Parentheses create a route group that doesn't affect URL
- `/app/(pages)/home/page.tsx` → `/home` (not `/(pages)/home`)
- Allows organizing pages without changing routes
- Enables shared layout for all pages (Footer)

### 2. **Dynamic Routes** `[id]`
- `[id]` creates dynamic segment
- `/products/[id]/page.tsx` matches `/products/1`, `/products/2`, etc.
- Access via `params` prop: `params.id`

### 3. **Layouts**
- `app/layout.tsx` - Root layout (wraps everything)
- `app/(pages)/layout.tsx` - Pages layout (wraps all pages with Footer)
- Layouts wrap their children automatically

### 4. **File Structure Benefits**
- Organized by feature (auth, products, etc.)
- Easy to find related files
- Scalable structure for large projects
- Clear separation of concerns

---

**Next**: See `02_STATE_MANAGEMENT.md` for Zustand setup
