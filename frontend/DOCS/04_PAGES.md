# Page Structure & Implementation

## Page Types

### 1. **Static Pages** (Same content for all users)
- Home, About, Contact, 404

### 2. **Dynamic Pages** (Content varies by user/data)
- Products, Single Product, Cart, Wishlist, Account

### 3. **Auth Pages** (Require authentication)
- Account, Checkout

## Home Page

**File**: `frontend/app/(pages)/home/page.tsx`

```typescript
const Home = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="container mx-auto px-4 md:px-8 lg:px-32">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          {/* Sidebar - Hidden on mobile */}
          <div className="hidden md:block">
            <HeroSidebar />
          </div>

          {/* Hero Banner */}
          <div className="w-full md:flex-1">
            {/* iPhone promo banner */}
          </div>
        </div>
      </div>

      {/* Flash Sales */}
      <div className="container mx-auto px-4 md:px-8 lg:px-32 py-10 md:py-20">
        <FlashSales />
      </div>

      {/* Category Section */}
      <CategorySection />

      {/* Best Selling */}
      <BestSelling />

      {/* Explore Products */}
      <ExploreProducts />

      {/* New Arrivals */}
      <NewArrivals />
    </div>
  );
};
```

**Key Features**:
- Hero section with sidebar (hidden on mobile)
- Multiple product sections
- Responsive layout
- Footer added via layout wrapper

### Hero Sidebar

```typescript
// Hidden on mobile: hidden md:block
// Shows categories on desktop
// Sticky positioning for easy access
```

## Products Page

**File**: `frontend/app/(pages)/products/page.tsx`

```typescript
"use client";

export default function Products() {
  const [sortBy, setSortBy] = useState("featured");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);

  // Filter products
  const filteredProducts = PRODUCTS.filter((p) => {
    if (selectedCategory !== "all") return false;
    if (p.salePrice < priceRange[0] || p.salePrice > priceRange[1]) return false;
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.salePrice - b.salePrice;
      case "price-high":
        return b.salePrice - a.salePrice;
      default:
        return 0;
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Sidebar Filters */}
      <div className="md:col-span-1">
        {/* Category filter */}
        {/* Price range slider */}
        {/* Rating filter */}
      </div>

      {/* Products Grid */}
      <div className="md:col-span-3">
        {/* Sort dropdown */}
        {/* Product grid */}
        {/* Pagination */}
      </div>
    </div>
  );
}
```

**Key Features**:
- Client component (interactive filters)
- Filter by category, price, rating
- Sort by featured, price, newest
- Responsive sidebar (hidden on mobile)
- Pagination

## Single Product Page

**File**: `frontend/app/(pages)/products/[id]/page.tsx`

```typescript
"use client";

export default function SingleProduct({ params }: { params: { id: string } }) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();
  const product = PRODUCTS[0]; // In real app, fetch by ID
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(isInWishlist(product.id));

  const handleAddToCart = () => {
    addToCart(product, quantity);
    // Show success message
  };

  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex gap-2">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/products">Products</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      {/* Product Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          {/* Main image */}
          {/* Thumbnails */}
        </div>

        {/* Details */}
        <div>
          {/* Title & rating */}
          {/* Price */}
          {/* Description */}
          {/* Quantity selector */}
          {/* Add to cart button */}
          {/* Add to wishlist button */}
          {/* Features */}
        </div>
      </div>

      {/* Tabs */}
      {/* Description, Specs, Reviews */}

      {/* Related Products */}
    </div>
  );
}
```

**Key Features**:
- Dynamic route with `[id]` parameter
- Breadcrumb navigation
- Image gallery with thumbnails
- Quantity selector
- Add to cart/wishlist
- Related products section

## Cart Page

**File**: `frontend/app/(pages)/cart/page.tsx`

```typescript
"use client";

export default function Cart() {
  const { cart, removeFromCart, updateCartQuantity } = useStore();

  const subtotal = cart.reduce((sum, item) => 
    sum + item.salePrice * item.quantity, 0
  );
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        {cart.map((item) => (
          <div key={item.id} className="flex gap-6">
            {/* Image */}
            {/* Details */}
            {/* Quantity controls */}
            {/* Remove button */}
            {/* Price */}
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="sticky top-20">
        <h2>Order Summary</h2>
        <div>
          <p>Subtotal: ${subtotal}</p>
          <p>Shipping: {shipping === 0 ? "FREE" : `$${shipping}`}</p>
          <p>Tax: ${tax}</p>
        </div>
        <p className="text-lg font-bold">Total: ${total}</p>
        <Link href="/checkout">Proceed to Checkout</Link>
      </div>
    </div>
  );
}
```

**Key Features**:
- Displays cart items from Zustand store
- Quantity controls (+ / -)
- Remove item button
- Order summary with calculations
- Sticky sidebar on desktop
- Checkout link

## Checkout Page

**File**: `frontend/app/(pages)/checkout/page.tsx`

```typescript
"use client";

export default function Checkout() {
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Place order
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Steps */}
      <div className="lg:col-span-2">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={s <= step ? "bg-red-500" : "bg-gray-200"}>
              {s}
            </div>
          ))}
        </div>

        {/* Form */}
        {step === 1 && <ShippingForm />}
        {step === 2 && <PaymentForm />}
        {step === 3 && <ReviewForm />}

        {/* Navigation */}
        {step > 1 && <button onClick={() => setStep(step - 1)}>Back</button>}
        <button onClick={handleSubmit}>
          {step === 3 ? "Place Order" : "Continue"}
        </button>
      </div>

      {/* Order Summary */}
      <div className="sticky top-20">
        {/* Same as cart page */}
      </div>
    </div>
  );
}
```

**Key Features**:
- Multi-step form (3 steps)
- Step indicator
- Form validation
- Order summary
- Back/Continue buttons

## Auth Pages

### Sign In Page

```typescript
"use client";

export default function SignIn() {
  const router = useRouter();
  const { login } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    login(email, password);
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <div className="text-red-500">{error}</div>}
      <button type="submit">Sign In</button>
      <Link href="/auth/sign-up">Don't have account? Sign up</Link>
    </form>
  );
}
```

**Key Features**:
- Email/password inputs
- Form validation
- Error messages
- Link to sign up
- Redirects to home after login

### Sign Up Page

```typescript
// Similar to Sign In but with:
// - First name & last name
// - Confirm password
// - Terms agreement checkbox
// - Calls signup() instead of login()
```

## Account Page

**File**: `frontend/app/(pages)/account/page.tsx`

```typescript
"use client";

export default function Account() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Sidebar Tabs */}
      <div className="md:col-span-1">
        <button onClick={() => setActiveTab("profile")}>Profile</button>
        <button onClick={() => setActiveTab("addresses")}>Addresses</button>
        <button onClick={() => setActiveTab("orders")}>Orders</button>
        <button onClick={() => setActiveTab("password")}>Password</button>
      </div>

      {/* Tab Content */}
      <div className="md:col-span-3">
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "addresses" && <AddressesTab />}
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "password" && <PasswordTab />}
      </div>
    </div>
  );
}
```

**Key Features**:
- Tabbed interface
- Profile editing
- Address management
- Order history
- Password change

---

**Next**: See `05_STYLING.md` for styling approach
