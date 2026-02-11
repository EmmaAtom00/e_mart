# 🎓 Week 3: Security, Performance & Professionalism
*Intensity level: High | Focus: Industrial-Grade Reliability*

## 📅 Day 15: The Authentication Deep-Dive
### 🧠 Theory: JWT vs Sessions vs Cookies
- **The "How" of Cookies**: When we use `httpOnly: true`, the browser hide the cookie from JavaScript. This means a hacker's rogue script **cannot steal your token**. This is the **Gold Standard** for modern security.
- **The "Why" of SameSite=Strict**: It prevents CSRF (Cross-Site Request Forgery) by ensuring the browser only sends the cookie if the request originates from your own site.

### 💻 Hands-on: Token Rotation & Security
- **Best Practice Example**:
```python
# settings.py
SIMPLE_JWT = {
    'AUTH_COOKIE': 'access_token',
    'AUTH_COOKIE_HTTP_ONLY': True,
    'AUTH_COOKIE_SAMESITE': 'Lax',  # or 'Strict'
}
```
- **The "Why" of Blacklisting**: If a user logs out, their JWT is still technically "valid" until it expires. Blacklisting stores the "JTI" (Unique ID) of the token in the database so the server can reject it instantly.

### 🔍 Deep-dive: E-Mart Auth
- **Analyze**: [middleware.ts](file:///home/atom/Documents/Portfolio/E-Mart/frontend/middleware.ts).
- **Question**: Why do we check for the cookie on the server-side? What happens if the user deletes the cookie manually?

---

## 📅 Day 16: Security: Defensive Coding
### 🧠 Theory: The OWASP Top 10
- **Injection**: How Django's ORM prevents SQL injection automatically, and where it doesn't (Raw SQL).
- **XSS (Cross-Site Scripting)**: How React's default escaping works and why `dangerouslySetInnerHTML` is dangerous.
- **CSRF (Cross-Site Request Forgery)**: Why we need a CSRF token even with JWT when using cookies.

### 💻 Hands-on: Security Audit
- **Task**: Run a `bandit` scan on the backend and an `npm audit` on the frontend.
- **Exercise**: Fix one high-priority vulnerability identified. Ensure all input fields in E-Mart have MaxLength and proper character validation.

---

## 📅 Day 17: Performance: The Speed of Trust
### 🧠 Theory: Core Web Vitals
- **LCP, CLS, FID**: What they mean and how they affect search engine rankings.
- **The Backend Connection**: How TTFB (Time to First Byte) is determined by your Django view's query speed.

### 💻 Hands-on: Lighthouse Audit
- **Task**: Run a Lighthouse audit on the Home page.
- **Exercise**: Implement "Image Optimization" (Next.js `Image` component) and "Code Splitting" for heavy components to improve the score to 90+.

---

[... Continued Detail for Days 18-21 ...]

## 🏁 Mastery Checkpoint: The Audit
1.  **Code Review**: Review a partner's (or your old) code and find 3 security flaws.
2.  **Performance Check**: Can your product list load in under 300ms on a 3G connection?
3.  **Test Coverage**: Write 5 unit tests for the Cart logic. Ensure 100% path coverage for the `add_item` function.
