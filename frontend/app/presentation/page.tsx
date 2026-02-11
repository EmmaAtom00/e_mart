"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Layout, 
  Server, 
  ArrowRight, 
  Monitor, 
  Database, 
  ShieldCheck, 
  Zap, 
  Users,
  Search,
  CheckCircle2,
  Code2
} from "lucide-react";
import Link from "next/link";

type Slide = {
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
};

const frontendSlides: Slide[] = [
  {
    title: "E-Mart Frontend",
    subtitle: "A Premium E-commerce Experience",
    icon: <Monitor className="w-12 h-12 text-blue-500" />,
    content: (
      <div className="space-y-6">
        <p className="text-xl text-gray-600 leading-relaxed text-center max-w-2xl mx-auto">
          Built with speed, aesthetics, and user experience at the core. A state-of-the-art interface that transforms browsing into shopping.
        </p>
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-2">Modern Stack</h3>
            <p className="text-sm text-blue-700">Next.js 16, React 19, TypeScript, Tailwind CSS</p>
          </div>
          <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100">
            <h3 className="font-bold text-purple-900 mb-2">Performance</h3>
            <p className="text-sm text-purple-700">SSR, Optimized Images, SEO-ready</p>
          </div>
          <div className="p-6 bg-green-50 rounded-2xl border border-green-100">
            <h3 className="font-bold text-green-900 mb-2">State Management</h3>
            <p className="text-sm text-green-700">Zustand with Backend Sync</p>
          </div>
          <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100">
            <h3 className="font-bold text-orange-900 mb-2">Deployment</h3>
            <p className="text-sm text-orange-700">Vercel (Production-Ready)</p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Features & Functionality",
    subtitle: "Beyond the Basics",
    icon: <Zap className="w-12 h-12 text-yellow-500" />,
    content: (
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {[
          { title: "Persistent Cart", desc: "Database-backed cart for guest & authenticated users with cross-device sync." },
          { title: "User Wishlist", desc: "Save products for later with one-click move to cart functionality." },
          { title: "JWT Authentication", desc: "Secure login with HTTP-only cookies and automatic token refresh." },
          { title: "Protected Routes", desc: "Next.js middleware guards sensitive pages (account, wishlist)." },
          { title: "Advanced Filtering", desc: "Multi-criteria search, categories, and price ranges." },
          { title: "Optimistic Updates", desc: "Instant UI feedback with server sync and error rollback." }
        ].map((item, i) => (
          <li key={i} className="flex gap-4 p-4 bg-white shadow-sm border border-gray-100 rounded-xl">
            <CheckCircle2 className="text-green-500 shrink-0 mt-1" size={20} />
            <div>
              <p className="font-bold text-gray-900">{item.title}</p>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    )
  },
  {
    title: "State Synchronization",
    subtitle: "Client ↔ Server Harmony",
    icon: <Code2 className="w-12 h-12 text-purple-500" />,
    content: (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-100">
          <h4 className="font-bold text-lg mb-4 text-center">Zustand + Backend Sync Pattern</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="font-bold text-purple-600 mb-2">1. Optimistic Update</div>
              <p className="text-gray-600">Instant UI feedback before API call</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="font-bold text-blue-600 mb-2">2. Server Sync</div>
              <p className="text-gray-600">POST to Django API with cart_code</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="font-bold text-green-600 mb-2">3. State Update</div>
              <p className="text-gray-600">Sync Zustand with server response</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white border border-gray-100 rounded-xl">
            <h5 className="font-bold text-gray-900 mb-2">Guest Cart</h5>
            <p className="text-xs text-gray-500">Unique cart_code in localStorage, persists across sessions</p>
          </div>
          <div className="p-4 bg-white border border-gray-100 rounded-xl">
            <h5 className="font-bold text-gray-900 mb-2">Auto-Link on Login</h5>
            <p className="text-xs text-gray-500">Guest cart automatically linked to user account</p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "UI Design Rationale",
    subtitle: "The Anatomy of Clean",
    icon: <Layout className="w-12 h-12 text-indigo-500" />,
    content: (
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <h4 className="font-bold text-lg">Typography: Urbanist</h4>
              <p className="text-gray-600 text-sm">A modern sans-serif that balances geometric precision with humanist warmth, ensuring high readability.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-lg">Visual Hierarchy</h4>
              <p className="text-gray-600 text-sm">Strategic use of whitespace and scale to guide the user's eye from 'Discover' to 'Purchase' effortlessly.</p>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-3">
            <div className="h-24 bg-black rounded-lg flex items-center justify-center text-white text-xs">Primary: #000</div>
            <div className="h-24 bg-secondarytwo rounded-lg flex items-center justify-center text-white text-xs font-bold">Accent: #DB4444</div>
            <div className="h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">Bg: #F5F5F5</div>
            <div className="h-24 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-300 text-xs">Spacing: 4px Grid</div>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Technologies & Standards",
    subtitle: "Industry-Leading Foundations",
    icon: <ShieldCheck className="w-12 h-12 text-green-500" />,
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-6 text-center">
          {[
            { icon: <Monitor className="mx-auto mb-2 text-blue-500" />, title: "Responsive", desc: "Mobile-first approach across all breakpoints." },
            { icon: <Search className="mx-auto mb-2 text-orange-500" />, title: "SEO", desc: "Semantic HTML5 and meta optimization." },
            { icon: <Code2 className="mx-auto mb-2 text-purple-500" />, title: "Architecture", desc: "Component-based, reusable design system." }
          ].map((item, i) => (
            <div key={i} className="space-y-2">
              {item.icon}
              <h4 className="font-bold">{item.title}</h4>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-3 flex-wrap">
          <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full border border-blue-100 text-sm font-bold">Next.js 16</div>
          <div className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full border border-purple-100 text-sm font-bold">React 19</div>
          <div className="px-4 py-2 bg-green-50 text-green-700 rounded-full border border-green-100 text-sm font-bold">TypeScript 5</div>
          <div className="px-4 py-2 bg-orange-50 text-orange-700 rounded-full border border-orange-100 text-sm font-bold">Zustand 5</div>
          <div className="px-4 py-2 bg-pink-50 text-pink-700 rounded-full border border-pink-100 text-sm font-bold">Tailwind CSS 4</div>
        </div>
      </div>
    )
  }
];

const backendSlides: Slide[] = [
  {
    title: "E-Mart Backend API",
    subtitle: "Robust, Scalable, and Documented",
    icon: <Server className="w-12 h-12 text-emerald-500" />,
    content: (
      <div className="space-y-6">
        <p className="text-xl text-gray-600 leading-relaxed text-center max-w-2xl mx-auto">
          A production-ready REST API built with Django and DRF, designed to handle complex relational data with persistent cart and wishlist functionality.
        </p>
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="px-6 py-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 font-bold text-center">Django 5.1</div>
          <div className="px-6 py-3 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100 font-bold text-center">DRF + Spectacular</div>
          <div className="px-6 py-3 bg-purple-50 text-purple-700 rounded-2xl border border-purple-100 font-bold text-center">JWT + Cookies</div>
          <div className="px-6 py-3 bg-orange-50 text-orange-700 rounded-2xl border border-orange-100 font-bold text-center">PostgreSQL</div>
        </div>
        <div className="flex justify-center gap-3 mt-4">
          <div className="px-4 py-2 bg-green-50 text-green-700 rounded-full border border-green-100 text-sm">Deployed on Render</div>
          <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full border border-blue-100 text-sm">Cloudinary CDN</div>
        </div>
      </div>
    )
  },
  {
    title: "ERD & Data Modeling",
    subtitle: "7 Entities, Perfectly Normalized",
    icon: <Database className="w-12 h-12 text-blue-600" />,
    content: (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <h4 className="font-bold mb-4 text-center">Core Relations (3NF)</h4>
          <div className="grid grid-cols-3 gap-3 items-center text-center text-sm">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="font-bold text-blue-900">CustomUser</div>
              <div className="text-xs text-blue-600">Auth + Profile</div>
            </div>
            <ArrowRight className="mx-auto text-gray-300" size={16} />
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
              <div className="font-bold text-purple-900">Cart (1:M)</div>
              <div className="text-xs text-purple-600">Nullable user_id</div>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="font-bold text-green-900">Category</div>
              <div className="text-xs text-green-600">Slug-based</div>
            </div>
            <ArrowRight className="mx-auto text-gray-300" size={16} />
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
              <div className="font-bold text-orange-900">Product</div>
              <div className="text-xs text-orange-600">Denormalized price</div>
            </div>
            
            <div className="p-3 bg-pink-50 rounded-lg border border-pink-100">
              <div className="font-bold text-pink-900">Wishlist (1:1)</div>
              <div className="text-xs text-pink-600">Per user</div>
            </div>
            <ArrowRight className="mx-auto text-gray-300" size={16} />
            <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
              <div className="font-bold text-indigo-900">WishlistItem</div>
              <div className="text-xs text-indigo-600">Unique constraint</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="font-bold">Guest Cart Pattern:</span> Nullable user_id + unique cart_code
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="font-bold">Denormalization:</span> sale_price stored for performance
          </div>
        </div>
      </div>
    )
  },
  {
    title: "API Endpoints & Features",
    subtitle: "RESTful, Documented, Production-Ready",
    icon: <ShieldCheck className="w-12 h-12 text-purple-500" />,
    content: (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-2 gap-4">
          {[
            { title: "Authentication (6)", desc: "Signup, login, logout, refresh, profile, JWT blacklisting" },
            { title: "Products (2)", desc: "List with filters, detail by slug, category filtering" },
            { title: "Cart (5)", desc: "Add, get, update, remove, clear - guest + auth support" },
            { title: "Wishlist (3)", desc: "Get, add, remove - requires authentication" },
            { title: "Categories (2)", desc: "List all, detail by slug with products" },
            { title: "Swagger Docs", desc: "Auto-generated OpenAPI 3.0 with drf-spectacular" }
          ].map((item, i) => (
            <div key={i} className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
              <h5 className="font-bold text-gray-900 mb-1">{item.title}</h5>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
          <p className="text-sm text-center font-medium text-gray-700">
            <span className="font-bold">18 Total Endpoints</span> • All documented with Swagger UI • Interactive testing available
          </p>
        </div>
      </div>
    )
  },
  {
    title: "Advanced Features",
    subtitle: "Beyond Basic CRUD",
    icon: <Zap className="w-12 h-12 text-yellow-600" />,
    content: (
      <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto">
        {[
          { title: "Nested Serializers", desc: "Cart → CartItem → Product with calculated totals" },
          { title: "Custom Filters", desc: "Django Filter Backend for min/max price, category" },
          { title: "Optimistic Locking", desc: "Prevent race conditions on cart updates" },
          { title: "Guest Cart Linking", desc: "Auto-link guest cart to user on authentication" },
          { title: "Unique Constraints", desc: "Prevent duplicate wishlist items at DB level" },
          { title: "Calculated Fields", desc: "sub_total, cart_total via SerializerMethodField" }
        ].map((item, i) => (
          <div key={i} className="p-4 bg-white border border-gray-100 rounded-xl">
            <h5 className="font-bold text-gray-900 mb-1">{item.title}</h5>
            <p className="text-xs text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>
    )
  },
  {
    title: "Security & Production",
    subtitle: "Enterprise-Grade Standards",
    icon: <ShieldCheck className="w-12 h-12 text-green-600" />,
    content: (
      <div className="space-y-4 max-w-3xl mx-auto">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-4 p-4 bg-green-50 text-green-800 rounded-xl border border-green-100">
            <CheckCircle2 size={24} className="shrink-0 mt-1" />
            <div>
              <p className="font-bold mb-1">JWT Authentication</p>
              <p className="text-xs">Access (15min) + Refresh (7 days) tokens</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-blue-50 text-blue-800 rounded-xl border border-blue-100">
            <CheckCircle2 size={24} className="shrink-0 mt-1" />
            <div>
              <p className="font-bold mb-1">Secure Cookies</p>
              <p className="text-xs">HttpOnly, Secure, SameSite=Lax flags</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-purple-50 text-purple-800 rounded-xl border border-purple-100">
            <CheckCircle2 size={24} className="shrink-0 mt-1" />
            <div>
              <p className="font-bold mb-1">Password Hashing</p>
              <p className="text-xs">PBKDF2 with 600,000 iterations</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-orange-50 text-orange-800 rounded-xl border border-orange-100">
            <CheckCircle2 size={24} className="shrink-0 mt-1" />
            <div>
              <p className="font-bold mb-1">CORS Protection</p>
              <p className="text-xs">Configured allowed origins and credentials</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-pink-50 text-pink-800 rounded-xl border border-pink-100">
            <CheckCircle2 size={24} className="shrink-0 mt-1" />
            <div>
              <p className="font-bold mb-1">Input Validation</p>
              <p className="text-xs">DRF serializers at all layers</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-indigo-50 text-indigo-800 rounded-xl border border-indigo-100">
            <CheckCircle2 size={24} className="shrink-0 mt-1" />
            <div>
              <p className="font-bold mb-1">Cloudinary CDN</p>
              <p className="text-xs">Persistent media storage with optimization</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Documentation & Testing",
    subtitle: "Developer-Friendly API",
    icon: <Code2 className="w-12 h-12 text-blue-600" />,
    content: (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-2">18</div>
            <div className="text-sm font-medium text-gray-600">API Endpoints</div>
          </div>
          <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-purple-600 mb-2">7</div>
            <div className="text-sm font-medium text-gray-600">Database Models</div>
          </div>
          <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
            <div className="text-sm font-medium text-gray-600">Documented</div>
          </div>
        </div>
        <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
          <h4 className="font-bold text-center mb-4">Complete Documentation Suite</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-600" />
              <span>Swagger UI (Interactive)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-600" />
              <span>Postman Collection</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-600" />
              <span>ERD with Mermaid Diagram</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-600" />
              <span>Master Documentation</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
];

export default function PresentationPage() {
  const [deck, setDeck] = useState<"frontend" | "backend" | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = deck === "frontend" ? frontendSlides : backendSlides;

  const nextSlide = () => {
    if (currentSlide < (slides?.length || 0) - 1) {
      setCurrentSlide(s => s + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(s => s - 1);
    }
  };

  const reset = () => {
    setDeck(null);
    setCurrentSlide(0);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-gray-900 font-sans selection:bg-black selection:text-white">
      <AnimatePresence mode="wait">
        {!deck ? (
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen p-8 text-center"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 text-black">
                E-Mart Project Showcase
              </h1>
              <p className="text-gray-500 text-xl md:text-2xl font-medium">
                Choose a module to explore the technical deep-dive
              </p>
            </motion.div>

            <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl">
              <motion.button
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setDeck("frontend")}
                className="flex-1 group relative overflow-hidden bg-white border-2 border-gray-100 p-10 rounded-[2.5rem] text-left shadow-2xl shadow-gray-200/50 transition-all hover:border-blue-200"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Monitor size={120} />
                </div>
                <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <Layout size={32} />
                </div>
                <h2 className="text-3xl font-bold mb-3 text-gray-900">Frontend Deck</h2>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  Focus on UI/UX design rationale, Next.js performance, and modern interaction standards.
                </p>
                <div className="flex items-center gap-2 font-bold text-blue-600">
                  Launch View <ArrowRight size={20} />
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setDeck("backend")}
                className="flex-1 group relative overflow-hidden bg-white border-2 border-gray-100 p-10 rounded-[2.5rem] text-left shadow-2xl shadow-gray-200/50 transition-all hover:border-emerald-200"
              >
                 <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Server size={120} />
                </div>
                <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                  <Database size={32} />
                </div>
                <h2 className="text-3xl font-bold mb-3 text-gray-900">Backend Deck</h2>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  Explore API architecture, ERD rationales, custom filtering logic, and production security.
                </p>
                <div className="flex items-center gap-2 font-bold text-emerald-600">
                  Launch View <ArrowRight size={20} />
                </div>
              </motion.button>
            </div>

            <Link href="/" className="mt-16 text-gray-400 font-medium hover:text-black transition-colors flex items-center gap-2">
              <ChevronLeft size={18} /> Back to Store
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key="slides"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white flex flex-col"
          >
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <button 
                  onClick={reset}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-black"
                >
                  <X size={24} />
                </button>
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400">
                    E-Mart {deck === "frontend" ? "Frontend" : "Backend"} Deck
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="hidden md:flex gap-1">
                  {slides.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 w-8 rounded-full transition-all duration-300 ${i === currentSlide ? "bg-black" : "bg-gray-200"}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-400">
                  {currentSlide + 1} / {slides.length}
                </span>
              </div>
            </header>

            {/* Slide Content */}
            <main className="flex-1 flex items-center justify-center relative overflow-hidden bg-[#FAFAFA]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="w-full max-w-5xl px-8 py-12 flex flex-col items-center"
                >
                  {slides[currentSlide].icon && (
                    <motion.div 
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="mb-10 bg-white p-6 rounded-3xl shadow-xl shadow-gray-100"
                    >
                      {slides[currentSlide].icon}
                    </motion.div>
                  )}
                  <h2 className="text-4xl md:text-6xl font-extrabold text-black mb-4 text-center tracking-tight">
                    {slides[currentSlide].title}
                  </h2>
                  {slides[currentSlide].subtitle && (
                    <p className="text-xl md:text-2xl text-gray-400 font-medium mb-12 text-center">
                      {slides[currentSlide].subtitle}
                    </p>
                  )}
                  <div className="w-full">
                    {slides[currentSlide].content}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-8 pointer-events-none">
                <button 
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  className={`p-4 rounded-full bg-white shadow-lg pointer-events-auto transition-all ${currentSlide === 0 ? "opacity-0 scale-90" : "opacity-100 hover:scale-110 active:scale-95"}`}
                >
                  <ChevronLeft size={32} />
                </button>
                <button 
                  onClick={nextSlide}
                  disabled={currentSlide === slides.length - 1}
                  className={`p-4 rounded-full bg-black text-white shadow-lg pointer-events-auto transition-all ${currentSlide === slides.length - 1 ? "opacity-0 scale-90" : "opacity-100 hover:scale-110 active:scale-95"}`}
                >
                  <ChevronRight size={32} />
                </button>
              </div>
            </main>

            {/* Footer shortcuts */}
            <footer className="px-8 py-4 bg-white border-t border-gray-100 text-[10px] text-gray-300 uppercase tracking-widest font-bold flex justify-center gap-8">
              <span className="flex items-center gap-1"><ChevronLeft size={10} /> Previous Slide</span>
              <span className="flex items-center gap-1">Next Slide <ChevronRight size={10} /></span>
              <span className="flex items-center gap-1">Esc to Exit</span>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
