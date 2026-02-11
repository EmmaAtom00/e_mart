# Styling & Responsive Design

## Tailwind CSS Setup

### Configuration

**File**: `frontend/tailwind.config.ts`
```typescript
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        secondarytwo: "#db4444", // Brand red color
      },
    },
  },
  plugins: [],
}
export default config
```

### Global Styles

**File**: `frontend/app/globals.css`
```css
@import "tailwindcss";

:root {
  --secondary: oklch(0.97 0 0);
  --secondarytwo: #db4444;
  --radius: 0.625rem;
  /* ... more CSS variables */
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## Responsive Design Strategy

### Mobile-First Approach

```typescript
// Start with mobile styles, add desktop overrides
<div className="
  w-full                    // Mobile: full width
  md:w-1/2                  // Tablet: half width
  lg:w-1/3                  // Desktop: third width
">
```

### Breakpoints

```
sm: 640px   - Small phones
md: 768px   - Tablets
lg: 1024px  - Desktops
xl: 1280px  - Large desktops
2xl: 1536px - Extra large
```

### Common Patterns

#### Responsive Grid

```typescript
// 1 column on mobile, 2 on tablet, 4 on desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {items.map(item => <Item key={item.id} />)}
</div>
```

#### Responsive Padding

```typescript
<div className="px-4 md:px-8 lg:px-32 py-6 md:py-12">
  {/* Content */}
</div>
```

#### Responsive Text

```typescript
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Heading
</h1>
```

#### Responsive Flex

```typescript
<div className="flex flex-col md:flex-row gap-4 md:gap-8">
  <div className="w-full md:w-1/2">Left</div>
  <div className="w-full md:w-1/2">Right</div>
</div>
```

#### Hide/Show Elements

```typescript
{/* Hidden on mobile, visible on desktop */}
<div className="hidden md:block">Desktop only</div>

{/* Visible on mobile, hidden on desktop */}
<div className="md:hidden">Mobile only</div>
```

## Color System

### Brand Colors

```typescript
// Primary red (used for CTAs, highlights)
className="bg-secondarytwo text-white"

// Neutral grays
className="text-gray-900"    // Dark text
className="text-gray-600"    // Medium text
className="text-gray-400"    // Light text
className="bg-gray-50"       // Light background
className="bg-gray-100"      // Slightly darker background
```

### Color Usage

```typescript
// Buttons
<button className="bg-secondarytwo text-white hover:opacity-90">
  Click me
</button>

// Links
<a className="text-secondarytwo hover:underline">Link</a>

// Badges
<span className="bg-red-500 text-white px-2 py-1 rounded">
  -20%
</span>

// Borders
<div className="border border-gray-200">Content</div>

// Backgrounds
<div className="bg-gray-50">Light background</div>
```

## Spacing System

### Padding & Margin

```typescript
// Padding
p-4      // 1rem (16px) all sides
px-4     // 1rem left & right
py-4     // 1rem top & bottom
pt-4     // 1rem top only

// Margin
m-4      // 1rem all sides
mx-auto  // Center horizontally
my-4     // 1rem top & bottom
```

### Gap (Flexbox/Grid)

```typescript
<div className="flex gap-4">
  {/* 1rem gap between items */}
</div>

<div className="grid gap-6">
  {/* 1.5rem gap between items */}
</div>
```

## Typography

### Font Sizes

```typescript
text-xs      // 12px
text-sm      // 14px
text-base    // 16px
text-lg      // 18px
text-xl      // 20px
text-2xl     // 24px
text-3xl     // 30px
text-4xl     // 36px
```

### Font Weights

```typescript
font-light      // 300
font-normal     // 400
font-medium     // 500
font-semibold   // 600
font-bold       // 700
```

### Line Height

```typescript
leading-tight   // 1.25
leading-normal  // 1.5
leading-relaxed // 1.625
```

## Common Components

### Button

```typescript
<button className="
  px-6 py-3
  bg-secondarytwo text-white
  rounded-lg
  font-semibold
  hover:opacity-90
  transition
  disabled:opacity-50
">
  Click me
</button>
```

### Card

```typescript
<div className="
  bg-white
  rounded-lg
  border border-gray-200
  p-6
  hover:shadow-lg
  transition
">
  Card content
</div>
```

### Input

```typescript
<input
  type="text"
  placeholder="Enter text"
  className="
    w-full
    px-4 py-3
    border border-gray-300
    rounded-lg
    focus:outline-none
    focus:ring-2
    focus:ring-secondarytwo
    focus:border-transparent
  "
/>
```

### Badge

```typescript
<span className="
  inline-block
  px-3 py-1
  bg-red-500 text-white
  rounded-full
  text-xs font-semibold
">
  New
</span>
```

## Animations & Transitions

### Hover Effects

```typescript
hover:opacity-80        // Fade on hover
hover:bg-gray-50        // Background change
hover:text-black        // Text color change
hover:shadow-lg          // Shadow on hover
hover:scale-105         // Slight zoom
```

### Transitions

```typescript
transition              // Default transition
transition-colors       // Color transition only
transition-all          // All properties
duration-300            // 300ms duration
ease-in-out             // Easing function
```

### Example

```typescript
<button className="
  bg-secondarytwo text-white
  hover:opacity-90
  transition duration-300
  transform hover:scale-105
">
  Hover me
</button>
```

## Responsive Container

### Container Class

```typescript
<div className="container mx-auto px-4 md:px-8 lg:px-32">
  {/* Max width with responsive padding */}
</div>
```

- `container` - Max width constraint
- `mx-auto` - Center horizontally
- `px-4` - Mobile padding
- `md:px-8` - Tablet padding
- `lg:px-32` - Desktop padding

## Accessibility

### Semantic HTML

```typescript
// Good
<button onClick={handleClick}>Click me</button>
<a href="/page">Link</a>
<nav>Navigation</nav>

// Bad
<div onClick={handleClick}>Click me</div>
<div onClick={() => navigate("/page")}>Link</div>
```

### ARIA Labels

```typescript
<button aria-label="Close menu" onClick={closeMenu}>
  <X size={24} />
</button>

<div role="region" aria-roledescription="carousel">
  {/* Carousel content */}
</div>
```

### Focus States

```typescript
<button className="
  focus:outline-none
  focus:ring-2
  focus:ring-secondarytwo
  focus:ring-offset-2
">
  Accessible button
</button>
```

## Dark Mode (Optional)

### Setup

```typescript
// In tailwind.config.ts
export default {
  darkMode: 'class',
  // ...
}
```

### Usage

```typescript
<div className="
  bg-white dark:bg-gray-900
  text-gray-900 dark:text-white
">
  Content
</div>
```

---

**Next**: See `06_BEST_PRACTICES.md` for coding standards
