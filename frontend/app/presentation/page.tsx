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
            <p className="text-sm text-blue-700">Next.js 15, React 19, Tailwind CSS</p>
          </div>
          <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100">
            <h3 className="font-bold text-purple-900 mb-2">Performance</h3>
            <p className="text-sm text-purple-700">Optimized LCP, SEO-ready, Responsive</p>
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
          { title: "Infinite Scrolling", desc: "Seamless product exploration with Intersection Observer." },
          { title: "Advanced Filtering", desc: "Multi-criteria search, categories, and price ranges." },
          { title: "Dynamic Cart", desc: "Real-time updates with global Zustand state." },
          { title: "Secure Auth", desc: "HTTP-only cookie persistence and protected routes." }
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
          A high-performance REST API built with Django and DRF, designed to handle complex relational data with ease.
        </p>
        <div className="flex justify-center gap-4 mt-8">
          <div className="px-6 py-3 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 font-bold">Django 5.1</div>
          <div className="px-6 py-3 bg-blue-50 text-blue-700 rounded-full border border-blue-100 font-bold">DRF</div>
          <div className="px-6 py-3 bg-purple-50 text-purple-700 rounded-full border border-purple-100 font-bold">JWT + Cookies</div>
        </div>
      </div>
    )
  },
  {
    title: "ERD & Data Modeling",
    subtitle: "Data with Direction",
    icon: <Database className="w-12 h-12 text-blue-600" />,
    content: (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <h4 className="font-bold mb-4 text-center">Core Relations</h4>
          <div className="grid grid-cols-3 gap-2 items-center text-center text-sm">
            <div className="p-3 bg-gray-50 rounded-lg">Users (Custom)</div>
            <ArrowRight className="mx-auto text-gray-300" size={16} />
            <div className="p-3 bg-gray-50 rounded-lg">Orders / Profiles</div>
            <div className="p-3 bg-gray-50 rounded-lg">Categories</div>
            <ArrowRight className="mx-auto text-gray-300" size={16} />
            <div className="p-3 bg-gray-50 rounded-lg">Products (M2M)</div>
            <div className="p-3 bg-gray-50 rounded-lg">Carts</div>
            <ArrowRight className="mx-auto text-gray-300" size={16} />
            <div className="p-3 bg-gray-50 rounded-lg">Line Items</div>
          </div>
        </div>
        <p className="text-sm text-center text-gray-500 italic">"Rationale: Use of SlugFields for SEO and UUIDs/Unique Codes for anonymous carts."</p>
      </div>
    )
  },
  {
    title: "Key Endpoints & Features",
    subtitle: "The Business Logic Layer",
    icon: <ShieldCheck className="w-12 h-12 text-purple-500" />,
    content: (
      <div className="grid grid-cols-2 gap-4">
        {[
          { title: "Auth Ecosystem", desc: "Secure signup, login, and token blacklisting logic." },
          { title: "Filtering Engine", desc: "Custom Django Filters for min/max price range logic." },
          { title: "Swagger & OpenAPI", desc: "Auto-generated interactive API documentation." },
          { title: "Seeding Tools", desc: "Custom management commands for data population." }
        ].map((item, i) => (
          <div key={i} className="p-4 bg-white border border-gray-100 rounded-xl">
            <h5 className="font-bold text-gray-900">{item.title}</h5>
            <p className="text-xs text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>
    )
  },
  {
    title: "Deployment & Production",
    subtitle: "Ready for the World",
    icon: <Zap className="w-12 h-12 text-yellow-600" />,
    content: (
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-4 p-4 bg-green-50 text-green-800 rounded-xl">
          <CheckCircle2 size={24} />
          <p className="font-medium">Secure Environment Variable Management (Decouple)</p>
        </div>
        <div className="flex items-center gap-4 p-4 bg-blue-50 text-blue-800 rounded-xl">
          <ShieldCheck size={24} />
          <p className="font-medium">CORS Policy & CSRF Protection Configured</p>
        </div>
        <div className="flex items-center gap-4 p-4 bg-orange-50 text-orange-800 rounded-xl">
          <Layout size={24} />
          <p className="font-medium">Optimized Media/Static File Serving</p>
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
