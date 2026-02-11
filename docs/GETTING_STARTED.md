# E-Mart - Getting Started Guide

Quick start guide to get the E-Mart application running in 15 minutes.

## ⏱️ Time Required: 15 minutes

## 📋 Prerequisites

- Python 3.13+
- Node.js 18+
- npm or yarn
- Git
- Text editor (VS Code recommended)

## 🚀 Step-by-Step Setup

### Step 1: Clone Repository (1 minute)

```bash
git clone <repository-url>
cd E-Mart
```

### Step 2: Setup Backend (5 minutes)

#### 2.1 Create Virtual Environment
```bash
cd backend
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

#### 2.2 Install Dependencies
```bash
pip install -r requirements.txt
```

#### 2.3 Setup Database
```bash
python manage.py makemigrations
python manage.py migrate
```

#### 2.4 Create Admin User
```bash
python manage.py createsuperuser
# Follow prompts to create admin account
```

#### 2.5 Start Backend Server
```bash
python manage.py runserver
```

✅ Backend running on `http://localhost:8000`

### Step 3: Setup Frontend (5 minutes)

#### 3.1 Open New Terminal
```bash
cd frontend
```

#### 3.2 Install Dependencies
```bash
npm install
```

#### 3.3 Create Environment File
```bash
# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
echo "NEXT_PUBLIC_APP_URL=http://localhost:3000" >> .env.local
```

#### 3.4 Start Frontend Server
```bash
npm run dev
```

✅ Frontend running on `http://localhost:3000`

### Step 4: Verify Setup (2 minutes)

#### 4.1 Check Backend
- Open `http://localhost:8000/admin`
- Login with admin credentials
- Should see admin panel

#### 4.2 Check Frontend
- Open `http://localhost:3000`
- Should see home page
- Navigation bar visible

#### 4.3 Test Authentication
- Click "Sign Up"
- Create test account
- Should be redirected to home
- User menu should show your name

✅ **Setup Complete!**

---

## 📚 Next Steps

### 1. Explore the Application (10 minutes)
- Browse products
- Add items to cart
- View user account
- Check admin panel

### 2. Read Documentation
- Start with `README.md`
- Read `WALKTHROUGH.md` for complete tour
- Check `QUICK_REFERENCE.md` for commands

### 3. Add Sample Data (5 minutes)

#### Via Admin Panel
1. Go to `http://localhost:8000/admin`
2. Click "Categories"
3. Click "Add Category"
4. Fill in details and save
5. Click "Products"
6. Click "Add Product"
7. Fill in details and save

#### Via Django Shell
```bash
python manage.py shell

from api.models import Category, Product
from decimal import Decimal

# Create category
category = Category.objects.create(
    name="Electronics",
    description="Electronic devices"
)

# Create product
product = Product.objects.create(
    name="Laptop",
    description="High-performance laptop",
    price=Decimal("999.99"),
    discount=10,
    category=category,
    stock=50,
    featured=True
)
```

### 4. Customize Application
- Update branding
- Modify colors
- Add custom features
- Configure settings

### 5. Deploy Application
- See deployment sections in documentation
- Choose hosting platform
- Configure production settings
- Deploy backend and frontend

---

## 🔧 Common Commands

### Backend
```bash
# Start server
python manage.py runserver

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Access shell
python manage.py shell

# Run tests
python manage.py test
```

### Frontend
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## 🐛 Troubleshooting

### Backend Won't Start

**Error**: `ModuleNotFoundError: No module named 'rest_framework'`
```bash
# Solution: Install dependencies
pip install -r requirements.txt
```

**Error**: `Port 8000 already in use`
```bash
# Solution: Use different port
python manage.py runserver 8001
```

**Error**: `Database error`
```bash
# Solution: Run migrations
python manage.py migrate
```

### Frontend Won't Start

**Error**: `Cannot find module '@/lib/api'`
```bash
# Solution: Restart dev server
npm run dev
```

**Error**: `Port 3000 already in use`
```bash
# Solution: Use different port
npm run dev -- -p 3001
```

**Error**: `API request failing`
- Check backend is running
- Check API URL in .env.local
- Check CORS configuration

### API Errors

**401 Unauthorized**
- Check token in localStorage
- Try logging in again
- Check backend is running

**CORS Error**
- Check CORS_ALLOWED_ORIGINS in settings.py
- Verify frontend URL is in list
- Restart backend

**404 Not Found**
- Check endpoint URL
- Verify resource exists
- Check database

---

## 📖 Documentation

### Quick Links
- **[README.md](README.md)** - Project overview
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick commands
- **[WALKTHROUGH.md](WALKTHROUGH.md)** - Complete walkthrough
- **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - All docs

### By Role
- **Backend Developer**: Read `backend/BACKEND_DOCUMENTATION.md`
- **Frontend Developer**: Read `frontend/FRONTEND_DOCUMENTATION.md`
- **Full Stack**: Read both documentation files
- **Presenter**: Read `PRESENTATION_GUIDE.md`

---

## ✅ Verification Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] Admin panel accessible
- [ ] Can create account
- [ ] Can login
- [ ] Can browse products
- [ ] Can add to cart
- [ ] Can view account
- [ ] Can logout

---

## 🎯 What You Can Do Now

✅ **Browse Products**
- View featured products
- Filter by category
- See product details

✅ **Manage Cart**
- Add items to cart
- Update quantities
- Remove items
- View total

✅ **User Account**
- Create account
- Login/logout
- View profile
- Update information

✅ **Admin Panel**
- Manage users
- Manage products
- Manage categories
- View data

---

## 📞 Need Help?

### Check Documentation
1. **Quick issues**: Check `QUICK_REFERENCE.md`
2. **Setup issues**: Check this file
3. **Feature questions**: Check `WALKTHROUGH.md`
4. **Development**: Check relevant documentation file

### Common Issues
- **Backend won't start**: Check Python version and dependencies
- **Frontend won't start**: Check Node.js version and dependencies
- **API errors**: Check backend is running and CORS is configured
- **Database errors**: Run migrations

### Get More Help
- Read `README.md` for detailed setup
- Read `WALKTHROUGH.md` for complete tour
- Check `DOCUMENTATION_INDEX.md` for all docs
- Review troubleshooting sections

---

## 🚀 Ready to Go!

You now have a fully functional e-commerce application running locally!

### Next Steps
1. Explore the application
2. Read the documentation
3. Add sample data
4. Customize as needed
5. Deploy when ready

### Happy Coding! 🎉

---

**For detailed information, see the full documentation files.**

**Last Updated**: February 2026
**Version**: 1.0.0
