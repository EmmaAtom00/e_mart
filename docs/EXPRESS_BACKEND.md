# 🚀 E-Mart Backend - Express.js & Node.js Guide

**Goal**: Build the E-Mart REST API using Express.js instead of Django

**Prerequisites**: JavaScript/TypeScript knowledge (you already have this from Next.js!)

**Time**: 2-3 weeks (15-20 days)

**Tech Stack**: Node.js, Express.js, TypeScript, PostgreSQL, Prisma ORM, JWT

---

## 🤔 Why Learn Express.js?

### Express.js vs Django

| Feature | Django (Python) | Express.js (Node.js) |
|---------|-----------------|----------------------|
| Language | Python | **JavaScript/TypeScript** |
| Learning Curve | Moderate | **Easy** (if you know JS) |
| Performance | Good | **Excellent** (async by default) |
| Ecosystem | Large | **Massive** (npm) |
| ORM | Django ORM | Prisma, Sequelize, TypeORM |
| Admin Panel | ✅ Built-in | ❌ Build yourself |
| Best For | Rapid development | **Full control, microservices** |

### Why Learn Express?

✅ **Same language as frontend** (JavaScript/TypeScript)  
✅ **Async by default** (handles concurrent requests well)  
✅ **Huge ecosystem** (npm has everything)  
✅ **Industry standard** (used by Netflix, Uber, PayPal)  
✅ **Microservices friendly** (lightweight, fast)  

---

## 🛠️ Setup & Installation

### 1. Install Node.js
```bash
# Check if installed
node --version  # Should be 18+
npm --version

# If not installed, download from https://nodejs.org/
```

### 2. Create Project
```bash
cd ~/E-Mart-Rebuild
mkdir backend-express
cd backend-express

# Initialize project
npm init -y

# Install dependencies
npm install express cors dotenv bcryptjs jsonwebtoken
npm install @prisma/client
npm install -D typescript @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken
npm install -D prisma ts-node nodemon

# Initialize TypeScript
npx tsc --init
```

### 3. Project Structure
```
backend-express/
├── src/
│   ├── index.ts           # Entry point
│   ├── routes/
│   │   ├── auth.ts        # Auth routes
│   │   ├── products.ts    # Product routes
│   │   ├── cart.ts        # Cart routes
│   │   └── wishlist.ts    # Wishlist routes
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── productController.ts
│   │   ├── cartController.ts
│   │   └── wishlistController.ts
│   ├── middleware/
│   │   ├── auth.ts        # JWT verification
│   │   └── errorHandler.ts
│   ├── utils/
│   │   └── jwt.ts         # JWT utilities
│   └── types/
│       └── index.ts       # TypeScript types
├── prisma/
│   └── schema.prisma      # Database schema
├── .env                   # Environment variables
├── package.json
└── tsconfig.json
```

### 4. Configure TypeScript
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### 5. Configure package.json Scripts
```json
{
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev"
  }
}
```

---

## Week 1: Backend Foundation (Days 1-7)

### Day 1: Database Schema with Prisma

**🎯 What You'll Build**: Complete database schema (same as Django models)

#### What is Prisma?
**Prisma** = Modern ORM for Node.js (like Django ORM but for JavaScript)

**Benefits**:
- Type-safe database queries
- Auto-generated TypeScript types
- Database migrations
- Visual database browser

#### Initialize Prisma
```bash
npx prisma init
```

This creates:
- `prisma/schema.prisma` - Database schema
- `.env` - Environment variables

#### Configure Database
```env
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/emart_express?schema=public"
```

#### Define Schema
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// User model
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  firstName String   @map("first_name")
  lastName  String   @map("last_name")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  carts     Cart[]
  wishlist  Wishlist?
  
  @@map("users")
}

// Category model
model Category {
  id        Int      @id @default(autoincrement())
  name      String
  slug      String   @unique
  image     String
  createdAt DateTime @default(now()) @map("created_at")
  
  products  Product[]
  
  @@map("categories")
}

// Product model
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  slug        String   @unique
  description String
  price       Decimal  @db.Decimal(10, 2)
  discount    Int      @default(0)
  salePrice   Decimal  @map("sale_price") @db.Decimal(10, 2)
  stock       Int      @default(0)
  image       String
  categoryId  Int      @map("category_id")
  createdAt   DateTime @default(now()) @map("created_at")
  
  category      Category       @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  cartItems     CartItem[]
  wishlistItems WishlistItem[]
  
  @@map("products")
}

// Cart model (guest + authenticated)
model Cart {
  id        Int      @id @default(autoincrement())
  userId    Int?     @map("user_id")  // Nullable for guest carts
  cartCode  String   @unique @map("cart_code")
  createdAt DateTime @default(now()) @map("created_at")
  
  user      User?      @relation(fields: [userId], references: [id], onDelete: Cascade)
  cartItems CartItem[]
  
  @@map("carts")
}

// CartItem model
model CartItem {
  id        Int      @id @default(autoincrement())
  cartId    Int      @map("cart_id")
  productId Int      @map("product_id")
  quantity  Int      @default(1)
  
  cart    Cart    @relation(fields: [cartId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@map("cart_items")
}

// Wishlist model (one per user)
model Wishlist {
  id        Int      @id @default(autoincrement())
  userId    Int      @unique @map("user_id")
  createdAt DateTime @default(now()) @map("created_at")
  
  user  User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  items WishlistItem[]
  
  @@map("wishlists")
}

// WishlistItem model
model WishlistItem {
  id         Int      @id @default(autoincrement())
  wishlistId Int      @map("wishlist_id")
  productId  Int      @map("product_id")
  addedAt    DateTime @default(now()) @map("added_at")
  
  wishlist Wishlist @relation(fields: [wishlistId], references: [id], onDelete: Cascade)
  product  Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@unique([wishlistId, productId])  // Prevent duplicates
  @@map("wishlist_items")
}
```

#### Run Migrations
```bash
# Create migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (visual database browser)
npx prisma studio
```

#### Today's Tasks
- [ ] Install Prisma
- [ ] Define all 7 models in schema.prisma
- [ ] Run migrations
- [ ] Generate Prisma Client
- [ ] Explore database in Prisma Studio

#### Key Concepts
- **@id**: Primary key
- **@unique**: Unique constraint
- **@default**: Default value
- **@relation**: Foreign key relationship
- **?**: Nullable field (for guest carts)
- **@@unique([field1, field2])**: Composite unique constraint

---

### Day 2: Express Server & Basic Routes

**🎯 What You'll Build**: Express server with CORS and basic routing

#### Create Express Server
```typescript
// src/index.ts
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'E-Mart API' });
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

#### Environment Variables
```env
# .env
PORT=8000
FRONTEND_URL=http://localhost:3000
DATABASE_URL="postgresql://user:password@localhost:5432/emart_express"
JWT_SECRET="your-super-secret-jwt-key-change-this"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
```

#### Test Server
```bash
npm run dev
# Visit http://localhost:8000
```

#### Today's Tasks
- [ ] Create Express server
- [ ] Add CORS middleware
- [ ] Add JSON parsing middleware
- [ ] Create basic routes
- [ ] Test in browser

---

### Day 3: Product Routes & Controllers

**🎯 What You'll Build**: Product CRUD endpoints

#### Product Controller
```typescript
// src/controllers/productController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;
    
    const products = await prisma.product.findMany({
      where: {
        ...(category && { category: { slug: category as string } }),
        ...(minPrice && { salePrice: { gte: parseFloat(minPrice as string) } }),
        ...(maxPrice && { salePrice: { lte: parseFloat(maxPrice as string) } }),
        ...(search && { name: { contains: search as string, mode: 'insensitive' } }),
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, slug, description, price, discount, categoryId, image, stock } = req.body;
    
    // Calculate sale price
    const salePrice = price - (price * discount / 100);
    
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        discount,
        salePrice,
        categoryId,
        image,
        stock,
      },
      include: {
        category: true,
      },
    });
    
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
};
```

#### Product Routes
```typescript
// src/routes/products.ts
import { Router } from 'express';
import { getProducts, getProduct, createProduct } from '../controllers/productController';

const router = Router();

router.get('/', getProducts);
router.get('/:slug', getProduct);
router.post('/', createProduct);

export default router;
```

#### Register Routes in Main File
```typescript
// src/index.ts
import productRoutes from './routes/products';

// ... existing code ...

// Routes
app.use('/api/products', productRoutes);
```

#### Today's Tasks
- [ ] Create productController.ts
- [ ] Implement getProducts with filters
- [ ] Implement getProduct by slug
- [ ] Create product routes
- [ ] Test with Postman

---

### Day 4: Authentication (JWT)

**🎯 What You'll Build**: User signup, login with JWT

#### JWT Utilities
```typescript
// src/utils/jwt.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export const generateAccessToken = (userId: number): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const generateRefreshToken = (userId: number): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
```

#### Auth Controller
```typescript
// src/controllers/authController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';

const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });
    
    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    
    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      access: accessToken,
      refresh: refreshToken,
    });
  } catch (error) {
    res.status(500).json({ error: 'Signup failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      access: accessToken,
      refresh: refreshToken,
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refresh } = req.body;
    
    const decoded = verifyToken(refresh);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    
    const accessToken = generateAccessToken(decoded.userId);
    
    res.json({ access: accessToken });
  } catch (error) {
    res.status(500).json({ error: 'Token refresh failed' });
  }
};
```

#### Auth Middleware
```typescript
// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  userId?: number;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};
```

#### Auth Routes
```typescript
// src/routes/auth.ts
import { Router } from 'express';
import { signup, login, refreshToken } from '../controllers/authController';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refreshToken);

export default router;
```

#### Register Auth Routes
```typescript
// src/index.ts
import authRoutes from './routes/auth';

app.use('/api/auth', authRoutes);
```

#### Today's Tasks
- [ ] Create JWT utilities
- [ ] Create auth controller
- [ ] Implement signup with bcrypt
- [ ] Implement login
- [ ] Create auth middleware
- [ ] Test with Postman

---

### Day 5: Cart Routes (Guest + Auth)

**🎯 What You'll Build**: Cart CRUD with guest support

#### Cart Controller
```typescript
// src/controllers/cartController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { cartCode, productId, quantity } = req.body;
    const userId = req.userId;
    
    let cart;
    
    // Get or create cart
    if (userId) {
      // Authenticated user
      cart = await prisma.cart.findFirst({ where: { userId } });
      
      if (!cart) {
        // Create new cart or link guest cart
        if (cartCode) {
          const guestCart = await prisma.cart.findUnique({ where: { cartCode } });
          if (guestCart && !guestCart.userId) {
            // Link guest cart to user
            cart = await prisma.cart.update({
              where: { id: guestCart.id },
              data: { userId },
            });
          }
        }
        
        if (!cart) {
          cart = await prisma.cart.create({
            data: {
              userId,
              cartCode: uuidv4().substring(0, 11),
            },
          });
        }
      }
    } else {
      // Guest user
      if (cartCode) {
        cart = await prisma.cart.findUnique({ where: { cartCode } });
      }
      
      if (!cart) {
        cart = await prisma.cart.create({
          data: {
            cartCode: uuidv4().substring(0, 11),
          },
        });
      }
    }
    
    // Add or update cart item
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });
    
    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }
    
    // Return cart with items
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        cartItems: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });
    
    // Calculate totals
    const cartWithTotals = {
      ...updatedCart,
      cartItems: updatedCart!.cartItems.map(item => ({
        ...item,
        subTotal: Number(item.product.salePrice) * item.quantity,
      })),
      cartTotal: updatedCart!.cartItems.reduce(
        (sum, item) => sum + Number(item.product.salePrice) * item.quantity,
        0
      ),
    };
    
    res.json(cartWithTotals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const { cartCode } = req.query;
    const userId = req.userId;
    
    let cart;
    
    if (userId) {
      cart = await prisma.cart.findFirst({
        where: { userId },
        include: {
          cartItems: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      });
    } else if (cartCode) {
      cart = await prisma.cart.findUnique({
        where: { cartCode: cartCode as string },
        include: {
          cartItems: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      });
    }
    
    if (!cart) {
      return res.json({ cartItems: [], cartTotal: 0 });
    }
    
    // Calculate totals
    const cartWithTotals = {
      ...cart,
      cartItems: cart.cartItems.map(item => ({
        ...item,
        subTotal: Number(item.product.salePrice) * item.quantity,
      })),
      cartTotal: cart.cartItems.reduce(
        (sum, item) => sum + Number(item.product.salePrice) * item.quantity,
        0
      ),
    };
    
    res.json(cartWithTotals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get cart' });
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const { itemId } = req.params;
    
    await prisma.cartItem.delete({
      where: { id: parseInt(itemId) },
    });
    
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
};
```

#### Cart Routes
```typescript
// src/routes/cart.ts
import { Router } from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/cartController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Optional auth (works for both guest and authenticated)
const optionalAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticate(req, res, next);
  }
  next();
};

router.post('/add', optionalAuth, addToCart);
router.get('/get', optionalAuth, getCart);
router.delete('/remove/:itemId', removeFromCart);

export default router;
```

#### Today's Tasks
- [ ] Install uuid: `npm install uuid @types/uuid`
- [ ] Create cart controller
- [ ] Implement guest cart logic
- [ ] Implement cart linking on login
- [ ] Test guest and auth flows

---

### Day 6: Wishlist Routes

**🎯 What You'll Build**: Wishlist CRUD (requires auth)

#### Wishlist Controller
```typescript
// src/controllers/wishlistController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });
    
    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      });
    }
    
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get wishlist' });
  }
};

export const addToWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { productId } = req.body;
    
    // Get or create wishlist
    let wishlist = await prisma.wishlist.findUnique({ where: { userId } });
    
    if (!wishlist) {
      wishlist = await prisma.wishlist.create({ data: { userId } });
    }
    
    // Check if already in wishlist
    const existing = await prisma.wishlistItem.findFirst({
      where: {
        wishlistId: wishlist.id,
        productId,
      },
    });
    
    if (existing) {
      return res.status(400).json({ error: 'Already in wishlist' });
    }
    
    // Add to wishlist
    await prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId,
      },
    });
    
    // Return updated wishlist
    const updatedWishlist = await prisma.wishlist.findUnique({
      where: { id: wishlist.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });
    
    res.json(updatedWishlist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
};

export const removeFromWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const { itemId } = req.params;
    
    await prisma.wishlistItem.delete({
      where: { id: parseInt(itemId) },
    });
    
    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
};
```

#### Wishlist Routes
```typescript
// src/routes/wishlist.ts
import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All wishlist routes require authentication
router.get('/', authenticate, getWishlist);
router.post('/add', authenticate, addToWishlist);
router.delete('/remove/:itemId', authenticate, removeFromWishlist);

export default router;
```

#### Today's Tasks
- [ ] Create wishlist controller
- [ ] Implement get wishlist
- [ ] Implement add to wishlist
- [ ] Prevent duplicates
- [ ] Test with authentication

---

### Day 7: Error Handling & Validation

**🎯 What You'll Build**: Proper error handling and input validation

#### Error Handler Middleware
```typescript
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
};
```

#### Input Validation (using Zod)
```bash
npm install zod
```

```typescript
// src/validators/productValidator.ts
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  discount: z.number().min(0).max(100),
  categoryId: z.number().int().positive(),
  image: z.string().url('Invalid image URL'),
  stock: z.number().int().min(0),
});

// Validation middleware
export const validateCreateProduct = (req: Request, res: Response, next: NextFunction) => {
  try {
    createProductSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      next(error);
    }
  }
};
```

#### Use in Routes
```typescript
// src/routes/products.ts
import { validateCreateProduct } from '../validators/productValidator';

router.post('/', validateCreateProduct, createProduct);
```

#### Register Error Handler
```typescript
// src/index.ts (at the end, after all routes)
import { errorHandler } from './middleware/errorHandler';

// ... all routes ...

// Error handler (must be last)
app.use(errorHandler);
```

#### Today's Tasks
- [ ] Create error handler middleware
- [ ] Install Zod for validation
- [ ] Create validators for all routes
- [ ] Add validation to routes
- [ ] Test error responses

---

## Week 2: Advanced Features (Days 8-14)

### Day 8: File Upload (Cloudinary)
- Install multer and cloudinary
- Configure Cloudinary
- Create upload endpoint
- Handle product images

### Day 9: Pagination & Sorting
- Add pagination to products
- Add sorting options
- Optimize database queries
- Test performance

### Day 10: API Documentation (Swagger)
- Install swagger-jsdoc and swagger-ui-express
- Document all endpoints
- Add request/response examples
- Test in Swagger UI

### Day 11: Rate Limiting & Security
- Install express-rate-limit
- Add rate limiting
- Install helmet for security headers
- Add request logging

### Day 12: Testing (Jest)
- Install Jest and supertest
- Write unit tests
- Write integration tests
- Aim for 80% coverage

### Day 13: Database Seeding
- Create seed script
- Add sample categories
- Add sample products
- Add sample users

### Day 14: Deployment Preparation
- Environment variables
- Production build
- Database migrations
- Deploy to Render/Railway

---

## 🎯 Express.js vs Django Comparison

| Feature | Django | Express.js |
|---------|--------|------------|
| **Setup Time** | Fast (batteries included) | Moderate (choose libraries) |
| **ORM** | Django ORM | Prisma (modern, type-safe) |
| **Migrations** | Built-in | Prisma Migrate |
| **Admin Panel** | ✅ Auto-generated | ❌ Build yourself |
| **Type Safety** | ❌ (Python) | ✅ (TypeScript) |
| **Performance** | Good | Excellent (async) |
| **Flexibility** | Opinionated | Very flexible |
| **Learning Curve** | Moderate | Easy (if you know JS) |

---

## 📚 Resources

- **Express.js Docs**: https://expressjs.com/
- **Prisma Docs**: https://www.prisma.io/docs
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Node.js Best Practices**: https://github.com/goldbergyoni/nodebestpractices

---

**Start with Day 1 after completing Django! Learn both backends! 🚀**
