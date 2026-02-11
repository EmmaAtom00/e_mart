# E-Mart Deployment Guide (Vercel + Backend)

To deploy E-Mart successfully, we use a hybrid approach: **Next.js on Vercel** and **Django on a dedicated backend host** (like Render, Railway, or Heroku). This is the industry standard for full-stack performance and reliability.

## 🏗️ Architecture Overview
```mermaid
graph LR
    User([User's Browser]) --> Vercel[Vercel (Frontend)]
    Vercel --> API[Cloud Hosting (Django Backend)]
    API --> DB[(PostgreSQL Database)]
```

---

## 🎨 1. Frontend Deployment (Vercel)

Vercel is the natural home for Next.js. Here is how to set it up:

### Steps:
1.  **Push to GitHub**: Ensure your latest code is pushed to a GitHub repository.
2.  **Import to Vercel**:
    *   Go to [Vercel Dashboard](https://vercel.com/dashboard).
    *   Click **New Project** and import your E-Mart repo.
3.  **Configure Subdirectory**:
    *   Under **Project Settings**, set the **Root Directory** to `frontend`.
4.  **Environment Variables**:
    *   Add `NEXT_PUBLIC_API_URL`: Set this to your production backend URL (e.g., `https://emart-api.onrender.com`).
5.  **Deploy**: Click **Deploy**. Vercel will automatically build and provide you with a production URL.

---

## 🐍 2. Backend Deployment (Render/Railway/Railway)

Since Django requires a persistent server and a production database (PostgreSQL), Vercel is not recommended for the backend. We recommend **Render** or **Railway**.

### Steps (Render Example):
1.  **Create a Blueprint**: Render can automatically read your repo.
2.  **Environment Variables**:
    *   `SECRET_KEY`: Generate a random string.
    *   `DEBUG`: `False`
    *   `DATABASE_URL`: Use a managed PostgreSQL URL (e.g., from Supabase or Render).
    *   `ALLOWED_HOSTS`: Add your backend domain and frontend domain.
    *   `CORS_ALLOWED_ORIGINS`: Add your Vercel frontend URL.
3.  **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
4.  **Start Command**: `gunicorn emartApi.wsgi:application`

---

## 🗄️ 3. Database Migration

For production, you **cannot use SQLite**.
*   **Recommended**: Use [Supabase](https://supabase.com) or [Neon](https://neon.tech) for a free/low-cost managed PostgreSQL database.
*   Update your `DATABASE_URL` in the backend environment variables to point to this new database.

---

## 🔐 4. Post-Deployment Checklist

- [ ] **CORS**: Ensure the backend allows your Vercel domain.
- [ ] **Cookies**: Verify `CSRF_COOKIE_DOMAIN` and `SESSION_COOKIE_DOMAIN` are configured if using our high-security cookie setup.
- [ ] **Static/Media**: Ensure `Pillow` is working and images are being served from a persistent storage like AWS S3 or Cloudinary (since Render/Vercel have ephemeral filesystems).

---

> [!TIP]
> **Need help with a specific platform?** 
> Just ask, and I can generate the specific `render.yaml` or `Dockerfile` needed for your platform of choice!
