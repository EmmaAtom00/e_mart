# E-Mart Demo Video - Recording Checklist

## ✅ Pre-Recording Setup

### 1. Test Data Preparation
- [ ] Create a test user account (email: demo@emart.com)
- [ ] Add 2-3 products to the database if needed
- [ ] Clear any existing cart/wishlist for fresh demo
- [ ] Test login credentials work

### 2. Browser Setup
- [ ] Use Chrome or Firefox (clean profile)
- [ ] Set zoom to 100%
- [ ] Clear cache and cookies
- [ ] Close all unnecessary tabs
- [ ] Hide bookmarks bar (Ctrl+Shift+B)
- [ ] Use incognito/private window for clean look
- [ ] Prepare second browser window for cross-device demo

### 3. Application Setup
- [ ] Start backend server: `cd backend && venv/bin/python manage.py runserver`
- [ ] Start frontend: `cd frontend && npm run dev`
- [ ] Verify both are running at http://localhost:8000 and http://localhost:3000
- [ ] Test all features work correctly

### 4. Recording Software
**Recommended: OBS Studio (Free)**
- [ ] Download from: https://obsproject.com/
- [ ] Set canvas resolution: 1920x1080
- [ ] Set frame rate: 30 FPS
- [ ] Add browser window as source
- [ ] Test audio levels (if recording voiceover)
- [ ] Do a 10-second test recording

**Alternative: Loom**
- [ ] Install Loom extension
- [ ] Select "Screen + Camera" or "Screen Only"
- [ ] Choose browser tab to record

### 5. Audio Setup (Optional)
- [ ] Test microphone levels
- [ ] Reduce background noise
- [ ] Have script ready for reference
- [ ] Consider recording voiceover separately for better quality

---

## 🎬 Scene-by-Scene Actions

### Scene 1: Landing Page (20 seconds)
**URL**: http://localhost:3000

**Actions**:
1. Start recording
2. Pause 2 seconds on homepage
3. Slowly scroll down to show:
   - Hero section
   - Featured products
   - Categories
4. Scroll back to top

**Voiceover**: "Welcome to E-Mart, a modern full-stack e-commerce platform built with Next.js and Django."

---

### Scene 2: Product Browsing (25 seconds)
**Actions**:
1. Click on a category (e.g., "Electronics")
2. Wait for products to load
3. Type in search bar: "laptop" (slowly)
4. Show search results
5. Hover over filter options (if available)

**Voiceover**: "Users can browse products by category, search, and filter results in real-time."

---

### Scene 3: Product Details (20 seconds)
**Actions**:
1. Click on a product card
2. Wait for product page to load
3. Scroll down to show:
   - Product images
   - Description
   - Price and discount
   - Add to cart button
4. Scroll back to top

**Voiceover**: "Each product has a detailed view with images, descriptions, and pricing."

---

### Scene 4: Cart & Wishlist (25 seconds)
**Actions**:
1. Click "Add to Cart" button
2. Watch cart icon update (top right)
3. Click heart icon to add to wishlist
4. Watch wishlist icon update
5. Click cart icon to view cart
6. Update quantity (click + or -)
7. Show updated total

**Voiceover**: "The cart and wishlist are fully persistent, syncing across devices when you're logged in."

---

### Scene 5: Authentication (20 seconds)
**Actions**:
1. Click "Sign In" button
2. Fill in email: demo@emart.com
3. Fill in password: (your test password)
4. Click "Sign In" button
5. Wait for redirect to homepage
6. Show user menu/avatar in navbar

**Voiceover**: "User authentication is secure and seamless, with JWT tokens and protected routes."

---

### Scene 6: Cross-Device Sync (20 seconds)
**Actions**:
1. Open second browser window (incognito)
2. Navigate to http://localhost:3000
3. Click "Sign In"
4. Log in with same credentials
5. Click cart icon
6. Show same cart items
7. Click wishlist
8. Show same wishlist items

**Voiceover**: "Your cart and wishlist sync across all devices. Let me demonstrate."

---

### Scene 7: Performance (20 seconds)
**Actions**:
1. Right-click → Inspect (F12)
2. Go to Lighthouse tab
3. Click "Generate report"
4. Show performance score
5. Close DevTools

**Voiceover**: "The application is built with performance and accessibility in mind."

**Note**: Pre-run Lighthouse before recording to save time

---

### Scene 8: Tech Stack (10 seconds)
**Actions**:
1. Navigate back to homepage
2. Pause on clean homepage view

**Voiceover**: "E-Mart is built with Next.js, Django REST Framework, PostgreSQL, and deployed on Render and Vercel."

---

## 🎥 Recording Tips

### During Recording:
- **Speak slowly and clearly** - pause between sentences
- **Move mouse smoothly** - no jerky movements
- **Click deliberately** - pause briefly before and after clicks
- **Wait for animations** - let transitions complete
- **Keep cursor visible** - helps viewers follow along

### If You Make a Mistake:
- **Don't stop recording** - just pause, take a breath, and continue
- **You can edit later** - cut out mistakes in post-production
- **Do multiple takes** - record 2-3 times and pick the best

### Post-Recording:
- **Trim beginning/end** - remove dead space
- **Add text overlays** (optional) - highlight key features
- **Add background music** (optional) - keep it subtle
- **Export as MP4** - H.264 codec, 1080p

---

## 📊 Best Practices to Highlight

Make sure to mention these throughout the video:

### UI/UX:
- ✅ Responsive design (mobile-first)
- ✅ Clean, modern interface
- ✅ Smooth transitions and animations
- ✅ Loading states and skeleton loaders

### Performance:
- ✅ Fast page loads with Next.js SSR
- ✅ Optimized images with Cloudinary
- ✅ Code splitting and lazy loading
- ✅ 90+ Lighthouse score

### Accessibility:
- ✅ Keyboard navigation
- ✅ ARIA labels
- ✅ Semantic HTML
- ✅ Color contrast compliance

### Security:
- ✅ JWT authentication
- ✅ Protected routes
- ✅ Secure cookie handling
- ✅ Input validation

### Architecture:
- ✅ Separation of concerns (frontend/backend)
- ✅ RESTful API design
- ✅ Database persistence
- ✅ Type-safe development with TypeScript

---

## 🎬 Quick Start Command

```bash
# Terminal 1 - Backend
cd /home/atom/Documents/Portfolio/E-Mart/backend
source venv/bin/activate
python manage.py runserver

# Terminal 2 - Frontend
cd /home/atom/Documents/Portfolio/E-Mart/frontend
npm run dev
```

---

## 📹 Recommended Recording Software

1. **OBS Studio** (Free, Professional)
   - Download: https://obsproject.com/
   - Best for: Full control, high quality

2. **Loom** (Free tier available)
   - Download: https://www.loom.com/
   - Best for: Quick, easy recording

3. **SimpleScreenRecorder** (Linux)
   - Install: `sudo apt install simplescreenrecorder`
   - Best for: Linux users

4. **Built-in Screen Recorder**
   - Linux: Ctrl+Alt+Shift+R (GNOME)
   - Best for: Quick recordings

---

## ✨ Final Checklist Before Recording

- [ ] Both servers running
- [ ] Test account ready
- [ ] Browser clean and zoomed to 100%
- [ ] Recording software tested
- [ ] Script printed or on second monitor
- [ ] Microphone tested (if recording audio)
- [ ] Quiet environment
- [ ] 5-minute buffer time

**Good luck with your recording! 🎥**
