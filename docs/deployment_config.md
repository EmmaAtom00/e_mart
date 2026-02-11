# Deployment Configuration Guide

When deploying your E-Mart application, you need to update your environment variables to allow communication between your backend and frontend.

## 1. `ALLOWED_HOSTS` (Django)
This tells Django which domains it is allowed to serve. It is a security feature to prevent HTTP Host header attacks.

**What to put here:**
The domain where your **Backend** is hosted.

- **Example (Vercel/Render/Fly.io):**
  `ALLOWED_HOSTS=emart-api.vercel.app,emart-api.up.railway.app`
- **Pro Tip:** During initial testing, you can use `*` (not recommended for final production), but it's better to be specific.

## 2. `CORS_ALLOWED_ORIGINS` (Django CORS Headers)
This tells Django which **Frontend** applications are allowed to make API requests to it.

**What to put here:**
The full URL (including `https://`) of your **Frontend** website.

- **Example:**
  `CORS_ALLOWED_ORIGINS=https://emart-store.vercel.app,https://www.emart-store.com`
- **Note:** Do **not** include a trailing slash at the end of the URL.

---

## Example Production `.env`
If you are deploying your backend to a service like Render or Vercel, your environment variables should look like this:

```env
DEBUG=False
ALLOWED_HOSTS=your-backend-domain.com
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
DATABASE_URL=postgres://... (Your Supabase Pooler URL)
SECRET_KEY=... (A long random string)
```

## What if I don't have the domains yet?

If you haven't deployed to Render or Vercel yet, you won't know the exact URLs. Here is how to handle that:

### 1. For Initial Deployment
On Render (Backend) and Vercel (Frontend), you can set these as **Environment Variables** in their dashboards before the first build finish.

- **`ALLOWED_HOSTS`**: Use `.onrender.com` as a partial match or `*` temporarily.
- **`CORS_ALLOWED_ORIGINS`**: Use `https://localhost:3000` (so you can still test locally) and add the production one later.

### 2. Finding your Render URL
Once you create your Web Service on Render, it will show you the generated URL at the top of the dashboard (e.g., `https://e-mart-api.onrender.com`).
1.  Copy that URL.
2.  Go to the **Environment** tab in your Render dashboard.
3.  Add it to `ALLOWED_HOSTS` (just the domain part: `e-mart-api.onrender.com`).
4.  Add it to your Frontend's API base URL.

### 3. Finding your Vercel URL
After your first deployment on Vercel, you'll get a URL like `https://e-mart-frontend.vercel.app`.
1.  Copy that.
2.  Go to your **Render Dashboard > Environment**.
3.  Add/Update `CORS_ALLOWED_ORIGINS` with that URL.

