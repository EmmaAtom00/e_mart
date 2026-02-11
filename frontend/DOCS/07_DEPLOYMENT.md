# Deployment & Production

## Pre-Deployment Checklist

### 1. Code Quality

```bash
# Run linter
npm run lint

# Check TypeScript
npm run type-check

# Run tests
npm run test
```

### 2. Performance

```bash
# Build and analyze
npm run build

# Check bundle size
npm run analyze
```

### 3. Environment Variables

```bash
# Create .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=postgresql://...
SECRET_KEY=your-secret-key
```

### 4. Security

- ✅ Remove console.log statements
- ✅ Validate all inputs
- ✅ Use HTTPS
- ✅ Set secure headers
- ✅ Enable CORS properly
- ✅ Sanitize user input

## Build Process

### Development Build

```bash
npm run dev
# Runs on http://localhost:3000
# Hot reload enabled
# Source maps included
```

### Production Build

```bash
npm run build
# Optimizes code
# Minifies CSS/JS
# Creates .next folder
# Ready for deployment
```

### Start Production Server

```bash
npm run start
# Runs optimized build
# No hot reload
# Production mode
```

## Deployment Platforms

### Vercel (Recommended for Next.js)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Benefits**:
- ✅ Automatic deployments from Git
- ✅ Built-in CI/CD
- ✅ Edge functions
- ✅ Analytics
- ✅ Free tier available

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build image
docker build -t emart:latest .

# Run container
docker run -p 3000:3000 emart:latest
```

### AWS Deployment

```bash
# Using AWS Amplify
amplify init
amplify add hosting
amplify publish

# Using EC2
# 1. Launch EC2 instance
# 2. Install Node.js
# 3. Clone repository
# 4. npm install && npm run build
# 5. npm start (or use PM2)
```

### Netlify Deployment

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

## Environment Configuration

### Development (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:3001
DATABASE_URL=postgresql://localhost/emart_dev
NODE_ENV=development
```

### Production (.env.production)

```
NEXT_PUBLIC_API_URL=https://api.emart.com
DATABASE_URL=postgresql://prod-server/emart
NODE_ENV=production
SENTRY_DSN=https://...
```

### Public vs Private Variables

```typescript
// Public (accessible in browser)
NEXT_PUBLIC_API_URL=https://api.example.com

// Private (server-only)
DATABASE_URL=postgresql://...
SECRET_KEY=secret
```

## Performance Optimization

### 1. Image Optimization

```typescript
// Use Next.js Image component
import Image from "next/image";

<Image
  src="/product.jpg"
  alt="Product"
  width={300}
  height={300}
  priority={false}
  loading="lazy"
/>
```

### 2. Code Splitting

```typescript
// Automatic in Next.js
// Each page is a separate bundle
// Dynamic imports for heavy components

import dynamic from "next/dynamic";

const Modal = dynamic(() => import("@/components/Modal"), {
  loading: () => <div>Loading...</div>,
});
```

### 3. Caching

```typescript
// Cache API responses
const response = await fetch(url, {
  next: { revalidate: 60 } // Revalidate every 60 seconds
});

// Static generation
export const revalidate = 3600; // Revalidate every hour
```

### 4. Database Optimization

```typescript
// Use indexes
CREATE INDEX idx_product_category ON products(category);

// Pagination
SELECT * FROM products LIMIT 20 OFFSET 0;

// Select only needed fields
SELECT id, name, price FROM products;
```

## Monitoring & Logging

### Error Tracking (Sentry)

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// Errors automatically captured
```

### Analytics

```typescript
// Google Analytics
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function App() {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview({
        page_path: url,
        page_title: document.title,
      });
    };

    router.events.on("routeChangeComplete", handleRouteChange);
  }, [router.events]);
}
```

### Logging

```typescript
// Server-side logging
console.log("User logged in:", userId);
console.error("Database error:", error);

// Client-side logging
if (process.env.NODE_ENV === "production") {
  // Send to logging service
  fetch("/api/logs", {
    method: "POST",
    body: JSON.stringify({ message, level: "error" }),
  });
}
```

## Database Setup

### PostgreSQL

```sql
-- Create database
CREATE DATABASE emart;

-- Create tables
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2),
  discount INT,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  total DECIMAL(10, 2),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_product_name ON products(name);
CREATE INDEX idx_order_user ON orders(user_id);
```

### MongoDB

```javascript
// Connect to MongoDB
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI);

// Define schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: String,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
```

## API Integration

### Fetch Data

```typescript
// Server-side (getServerSideProps)
export async function getServerSideProps() {
  const res = await fetch("https://api.example.com/products");
  const products = await res.json();

  return {
    props: { products },
    revalidate: 60, // ISR
  };
}

// Client-side (useEffect)
useEffect(() => {
  fetch("/api/products")
    .then(res => res.json())
    .then(data => setProducts(data));
}, []);
```

### Error Handling

```typescript
async function fetchData(url) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
```

## Security Headers

### next.config.js

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};
```

## Continuous Integration/Deployment

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
      
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm run test
      
      - name: Deploy to Vercel
        run: vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

## Rollback Strategy

```bash
# Keep previous deployments
# Easy rollback if issues occur

# Vercel
vercel rollback

# Docker
docker run -p 3000:3000 emart:previous-tag

# Git
git revert <commit-hash>
git push
```

---

**Status**: ✅ Ready for Production Deployment
