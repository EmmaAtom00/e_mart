# 📱 E-Mart Mobile App - React Native Guide

**Goal**: Build a native mobile app (iOS + Android) for E-Mart using React Native

**Prerequisites**: Complete the web version first (30-Day Mastery Plan)

**Time**: 2-3 weeks (20-30 days)

**Tech Stack**: React Native, Expo, TypeScript, Zustand, React Navigation

---

## 🎯 Why React Native?

- **One Codebase**: iOS + Android from same code
- **React Knowledge**: Use your React skills
- **Native Performance**: Compiled to native code
- **Hot Reload**: See changes instantly
- **Large Community**: Tons of libraries and support

---

## 📚 Prerequisites

Before starting, you should know:
- ✅ React (hooks, components, state)
- ✅ TypeScript
- ✅ REST APIs
- ✅ State management (Zustand)
- ✅ Your E-Mart backend API

---

## 🛠️ Setup & Installation

### 1. Install Node.js & npm
```bash
# Check if installed
node --version  # Should be 18+
npm --version
```

### 2. Install Expo CLI
```bash
npm install -g expo-cli
```

### 3. Install Expo Go App
- **iOS**: Download from App Store
- **Android**: Download from Play Store

### 4. Create Project
```bash
cd ~/E-Mart-Rebuild
npx create-expo-app mobile --template expo-template-blank-typescript
cd mobile
npm start
```

### 5. Test on Your Phone
1. Scan QR code with Expo Go app
2. App should load on your phone
3. Make a change, see it update instantly!

---

## Week 1: Foundation (Days 1-7)

### Day 1: Project Setup & Navigation

**🎯 What You'll Build**: App structure with navigation

#### Install Dependencies
```bash
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install zustand axios react-native-async-storage
```

#### Create Navigation Structure
```typescript
// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Screens
import HomeScreen from './screens/HomeScreen';
import ProductsScreen from './screens/ProductsScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import CartScreen from './screens/CartScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Products" component={ProductsScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

#### Folder Structure
```
mobile/
├── App.tsx
├── screens/
│   ├── HomeScreen.tsx
│   ├── ProductsScreen.tsx
│   ├── ProductDetailScreen.tsx
│   ├── CartScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── LoginScreen.tsx
│   └── SignupScreen.tsx
├── components/
│   ├── ProductCard.tsx
│   ├── CartItem.tsx
│   └── Button.tsx
├── store/
│   └── useStore.ts
├── api/
│   └── client.ts
├── types/
│   └── index.ts
└── constants/
    └── theme.ts
```

#### Today's Tasks
- [ ] Create project with Expo
- [ ] Install navigation libraries
- [ ] Set up navigation structure
- [ ] Create screen files
- [ ] Test navigation on phone

---

### Day 2: TypeScript Types & API Client

**🎯 What You'll Build**: Type definitions and API client

#### Define Types
```typescript
// types/index.ts
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  sale_price: number;
  discount: number;
  stock: number;
  category: Category;
  image: string;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  sub_total: number;
}

export interface Cart {
  id: number;
  cart_code: string;
  cartitems: CartItem[];
  cart_total: number;
}
```

#### Create API Client
```typescript
// api/client.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://YOUR_COMPUTER_IP:8000/api'; // Replace with your IP

class ApiClient {
  private async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('auth_token');
  }

  private async setTokens(access: string, refresh: string) {
    await AsyncStorage.setItem('auth_token', access);
    await AsyncStorage.setItem('refresh_token', refresh);
  }

  async request<T>(endpoint: string, options?: any): Promise<T> {
    const token = await this.getToken();
    
    const response = await axios({
      url: `${API_URL}${endpoint}`,
      method: options?.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options?.headers,
      },
      data: options?.body,
    });

    return response.data;
  }

  // Products
  async getProducts(filters?: any) {
    return this.request<Product[]>('/products/', { params: filters });
  }

  async getProduct(slug: string) {
    return this.request<Product>(`/products/${slug}/`);
  }

  // Auth
  async login(email: string, password: string) {
    const response = await this.request<any>('/auth/login/', {
      method: 'POST',
      body: { email, password },
    });
    
    if (response.access && response.refresh) {
      await this.setTokens(response.access, response.refresh);
    }
    
    return response;
  }

  // Cart
  async addToCart(cartCode: string | null, productId: number, quantity: number) {
    return this.request<Cart>('/cart/add/', {
      method: 'POST',
      body: { cart_code: cartCode, product_id: productId, quantity },
    });
  }

  async getCart(cartCode: string) {
    return this.request<Cart>(`/cart/get/`, { params: { cart_code: cartCode } });
  }
}

export const apiClient = new ApiClient();
```

#### Today's Tasks
- [ ] Define all TypeScript interfaces
- [ ] Create API client with axios
- [ ] Set up AsyncStorage for tokens
- [ ] Test API calls from app
- [ ] Handle errors properly

---

### Day 3: Zustand Store (Mobile)

**🎯 What You'll Build**: Global state management

```typescript
// store/useStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../api/client';
import { User, Product, CartItem } from '../types';

interface StoreState {
  // State
  user: User | null;
  isLoggedIn: boolean;
  cart: CartItem[];
  cartCode: string | null;
  wishlist: Product[];
  
  // Actions
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  addToCart: (product: Product, quantity: number) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  updateCartQuantity: (id: number, quantity: number) => Promise<void>;
  fetchCart: () => Promise<void>;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      cart: [],
      cartCode: null,
      wishlist: [],
      
      setUser: (user) => set({ user, isLoggedIn: !!user }),
      
      login: async (email, password) => {
        try {
          const response = await apiClient.login(email, password);
          if (response.user) {
            set({ user: response.user, isLoggedIn: true });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },
      
      logout: async () => {
        await AsyncStorage.removeItem('auth_token');
        await AsyncStorage.removeItem('refresh_token');
        set({ user: null, isLoggedIn: false, cart: [], wishlist: [] });
      },
      
      addToCart: async (product, quantity) => {
        // Optimistic update
        set((state) => ({
          cart: [...state.cart, { id: Date.now(), product, quantity, sub_total: product.sale_price * quantity }]
        }));
        
        try {
          const { cartCode } = get();
          const response = await apiClient.addToCart(cartCode, product.id, quantity);
          set({ 
            cart: response.cartitems,
            cartCode: response.cart_code 
          });
        } catch (error) {
          // Rollback
          set((state) => ({
            cart: state.cart.filter(item => item.product.id !== product.id)
          }));
          throw error;
        }
      },
      
      fetchCart: async () => {
        const { cartCode } = get();
        if (!cartCode) return;
        
        try {
          const cart = await apiClient.getCart(cartCode);
          set({ cart: cart.cartitems });
        } catch (error) {
          console.error('Fetch cart error:', error);
        }
      },
    }),
    {
      name: 'emart-mobile-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        cart: state.cart,
        cartCode: state.cartCode,
        wishlist: state.wishlist,
      }),
    }
  )
);
```

#### Today's Tasks
- [ ] Create Zustand store
- [ ] Add AsyncStorage persistence
- [ ] Implement auth actions
- [ ] Implement cart actions
- [ ] Test state persistence

---

### Day 4: Theme & Styling

**🎯 What You'll Build**: Consistent design system

```typescript
// constants/theme.ts
export const COLORS = {
  primary: '#000000',
  secondary: '#DB4444',
  background: '#FFFFFF',
  backgroundGray: '#F5F5F5',
  text: '#000000',
  textGray: '#666666',
  border: '#E0E0E0',
  success: '#4CAF50',
  error: '#F44336',
  white: '#FFFFFF',
};

export const SIZES = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};
```

#### Reusable Components
```typescript
// components/Button.tsx
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
}

export default function Button({ title, onPress, variant = 'primary', loading, disabled }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'outline' && styles.outline,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? COLORS.primary : COLORS.white} />
      ) : (
        <Text style={[
          styles.text,
          variant === 'outline' && styles.outlineText,
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.xl,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: COLORS.white,
    fontSize: SIZES.md,
    fontWeight: '600',
  },
  outlineText: {
    color: COLORS.primary,
  },
});
```

#### Today's Tasks
- [ ] Create theme constants
- [ ] Create Button component
- [ ] Create Input component
- [ ] Create ProductCard component
- [ ] Test components

---

### Day 5: Home Screen & Product List

**🎯 What You'll Build**: Home screen with product grid

```typescript
// screens/HomeScreen.tsx
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { Product } from '../types';
import { COLORS, SIZES } from '../constants/theme';

export default function HomeScreen({ navigation }: any) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await apiClient.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { slug: item.slug })}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.priceRow}>
          {item.discount > 0 && (
            <Text style={styles.oldPrice}>${item.price}</Text>
          )}
          <Text style={styles.price}>${item.sale_price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: SIZES.md,
  },
  productCard: {
    flex: 1,
    margin: SIZES.xs,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: SIZES.sm,
  },
  productName: {
    fontSize: SIZES.md,
    fontWeight: '600',
    marginBottom: SIZES.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.xs,
  },
  price: {
    fontSize: SIZES.md,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  oldPrice: {
    fontSize: SIZES.sm,
    textDecorationLine: 'line-through',
    color: COLORS.textGray,
  },
});
```

#### Today's Tasks
- [ ] Create HomeScreen
- [ ] Fetch products from API
- [ ] Display in grid (2 columns)
- [ ] Add loading state
- [ ] Navigate to product detail

---

### Day 6: Product Detail Screen

**🎯 What You'll Build**: Product detail with add to cart

```typescript
// screens/ProductDetailScreen.tsx
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { Product } from '../types';
import { useStore } from '../store/useStore';
import Button from '../components/Button';
import { COLORS, SIZES } from '../constants/theme';

export default function ProductDetailScreen({ route, navigation }: any) {
  const { slug } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const addToCart = useStore((state) => state.addToCart);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const data = await apiClient.getProduct(slug);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart(product, quantity);
      alert('Added to cart!');
    } catch (error) {
      alert('Failed to add to cart');
    }
  };

  if (loading || !product) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>
        
        <View style={styles.priceRow}>
          {product.discount > 0 && (
            <>
              <Text style={styles.oldPrice}>${product.price}</Text>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{product.discount}%</Text>
              </View>
            </>
          )}
          <Text style={styles.price}>${product.sale_price}</Text>
        </View>
        
        <Text style={styles.description}>{product.description}</Text>
        
        <View style={styles.quantityRow}>
          <Text style={styles.label}>Quantity:</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <Button title="Add to Cart" onPress={handleAddToCart} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    padding: SIZES.lg,
  },
  name: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    marginBottom: SIZES.md,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
    marginBottom: SIZES.lg,
  },
  price: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  oldPrice: {
    fontSize: SIZES.md,
    textDecorationLine: 'line-through',
    color: COLORS.textGray,
  },
  discountBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs / 2,
    borderRadius: 4,
  },
  discountText: {
    color: COLORS.white,
    fontSize: SIZES.sm,
    fontWeight: 'bold',
  },
  description: {
    fontSize: SIZES.md,
    color: COLORS.textGray,
    lineHeight: 24,
    marginBottom: SIZES.lg,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.lg,
  },
  label: {
    fontSize: SIZES.md,
    fontWeight: '600',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.md,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'center',
  },
});
```

#### Today's Tasks
- [ ] Create ProductDetailScreen
- [ ] Display product details
- [ ] Add quantity controls
- [ ] Implement add to cart
- [ ] Show success/error messages

---

### Day 7: Cart Screen

**🎯 What You'll Build**: Shopping cart with checkout

```typescript
// screens/CartScreen.tsx
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useStore } from '../store/useStore';
import Button from '../components/Button';
import { COLORS, SIZES } from '../constants/theme';

export default function CartScreen() {
  const { cart, removeFromCart, updateCartQuantity } = useStore();
  
  const cartTotal = cart.reduce((sum, item) => sum + item.sub_total, 0);

  const renderCartItem = ({ item }: any) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.product.image }} style={styles.itemImage} />
      
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>{item.product.name}</Text>
        <Text style={styles.itemPrice}>${item.product.sale_price}</Text>
        
        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateCartQuantity(item.id, item.quantity - 1)}
          >
            <Text>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateCartQuantity(item.id, item.quantity + 1)}
          >
            <Text>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.itemRight}>
        <TouchableOpacity onPress={() => removeFromCart(item.id)}>
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
        <Text style={styles.subtotal}>${item.sub_total.toFixed(2)}</Text>
      </View>
    </View>
  );

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Your cart is empty</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
      
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${cartTotal.toFixed(2)}</Text>
        </View>
        <Button title="Checkout" onPress={() => alert('Checkout coming soon!')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: SIZES.lg,
    color: COLORS.textGray,
  },
  list: {
    padding: SIZES.md,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.md,
    marginBottom: SIZES.md,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: SIZES.md,
  },
  itemName: {
    fontSize: SIZES.md,
    fontWeight: '600',
    marginBottom: SIZES.xs,
  },
  itemPrice: {
    fontSize: SIZES.sm,
    color: COLORS.textGray,
    marginBottom: SIZES.sm,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: SIZES.md,
    fontWeight: '600',
    minWidth: 20,
    textAlign: 'center',
  },
  itemRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  removeText: {
    color: COLORS.error,
    fontSize: SIZES.sm,
  },
  subtotal: {
    fontSize: SIZES.md,
    fontWeight: 'bold',
  },
  footer: {
    padding: SIZES.lg,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.md,
  },
  totalLabel: {
    fontSize: SIZES.lg,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
});
```

#### Today's Tasks
- [ ] Create CartScreen
- [ ] Display cart items
- [ ] Add quantity controls
- [ ] Show cart total
- [ ] Add remove functionality

---

## Week 2: Authentication & Advanced Features (Days 8-14)

### Day 8: Login & Signup Screens
- Create login form
- Create signup form
- Implement authentication
- Handle errors
- Navigate after login

### Day 9: Profile Screen
- Display user info
- Logout functionality
- Edit profile (optional)
- Order history (optional)

### Day 10: Wishlist Feature
- Add to wishlist button
- Wishlist screen
- Remove from wishlist
- Move to cart

### Day 11: Search & Filters
- Search bar
- Filter by category
- Filter by price
- Sort options

### Day 12: Product Images Gallery
- Multiple images support
- Image carousel
- Zoom functionality
- Share product

### Day 13: Notifications
- Push notifications setup
- Order updates
- Promotional notifications

### Day 14: Polish & Testing
- Loading states
- Error handling
- Offline support
- Test on real devices

---

## Week 3: Production & Deployment (Days 15-21)

### Day 15-16: Payment Integration
- Stripe React Native SDK
- Payment form
- Order confirmation
- Receipt screen

### Day 17-18: App Polish
- Animations (React Native Reanimated)
- Gestures (React Native Gesture Handler)
- Haptic feedback
- Splash screen & App icon

### Day 19-20: Build & Test
- Build for iOS (TestFlight)
- Build for Android (Internal Testing)
- Test on multiple devices
- Fix bugs

### Day 21: App Store Submission
- Prepare screenshots
- Write app description
- Submit to App Store
- Submit to Play Store

---

## 📱 Key Differences: Web vs Mobile

| Feature | Web (Next.js) | Mobile (React Native) |
|---------|---------------|----------------------|
| Navigation | Next.js Router | React Navigation |
| Styling | Tailwind CSS | StyleSheet |
| Storage | localStorage | AsyncStorage |
| Images | next/image | Image component |
| Forms | HTML inputs | TextInput |
| Gestures | Mouse events | Touch events |

---

## 🎯 Final Checklist

- [ ] App runs on iOS
- [ ] App runs on Android
- [ ] All features work offline
- [ ] Smooth animations
- [ ] Fast performance
- [ ] No crashes
- [ ] Published to stores

---

## 📚 Resources

- **React Native Docs**: https://reactnative.dev/
- **Expo Docs**: https://docs.expo.dev/
- **React Navigation**: https://reactnavigation.org/
- **Zustand**: https://github.com/pmndrs/zustand

---

**Start with Day 1 after completing the web version! Build your mobile app! 📱🚀**
