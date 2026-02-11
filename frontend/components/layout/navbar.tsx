"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  Heart,
  Menu,
  ShoppingCart,
  X,
  Search,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import SearchBar from "../common/searchBar";
import SearchModal from "../common/searchModal";
import { CATEGORIES } from "@/utils/data";
import { useStore } from "@/store/useStore";
import Link from "next/link";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const { cart, wishlist, user, logout, isLoggedIn } = useStore();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Top announcement bar */}
      <div className="w-full bg-black text-sm text-white">
        <div className="relative flex items-center px-4 md:px-6 py-2 md:py-3">
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 text-center">
            <p className="hidden md:block whitespace-nowrap text-xs md:text-sm">
              Summer Sale For All Swim Suits And Free Express Delivery – OFF 50%!
            </p>
            <p className="md:hidden font-semibold text-xs">50% OFF!</p>
            <button className="font-bold underline hover:opacity-80 text-xs md:text-sm">
              SHOP NOW
            </button>
          </div>

          <button className="ml-auto flex items-center gap-1 hover:opacity-80 text-xs md:text-sm">
            <span className="hidden lg:block">English</span>
            <ChevronDown size={14} className="md:w-4 md:h-4" />
          </button>
        </div>
      </div>

      {/* Main navbar */}
      <header className="sticky top-0 z-40 border-b border-gray-200/50 bg-white backdrop-blur-sm">
        <div className="container mx-auto flex h-14 md:h-16 items-center justify-between gap-4 md:gap-6 px-4 md:px-8 lg:px-32">
          <Link href="/" className="text-xl md:text-2xl font-bold tracking-tight">
            E-Mart
          </Link>

          <nav className="hidden md:block">
            <ul className="flex gap-8 lg:gap-10 text-sm font-medium">
              <li>
                <Link href="/" className="text-gray-700 transition hover:text-black">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-700 transition hover:text-black">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-700 transition hover:text-black">
                  About
                </Link>
              </li>
              {!isLoggedIn && (
                <li>
                  <Link href="/auth/sign-up" className="text-gray-700 transition hover:text-black">
                    Sign Up
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden lg:block">
              <SearchBar />
            </div>

            {/* Icons Section */}
            <div className="flex items-center gap-3 md:gap-4 lg:gap-5">
              {/* Mobile Search Icon */}
              <button
                className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition"
                onClick={() => setSearchModalOpen(true)}
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 hover:bg-gray-100 rounded-full transition"
              >
                <Heart size={20} />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 bg-secondarytwo text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 hover:bg-gray-100 rounded-full transition"
              >
                <ShoppingCart size={20} />
                {cart.length > 0 && (
                  <span className="absolute top-1 right-1 bg-secondarytwo text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {isLoggedIn ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center gap-2 p-1 pl-2 pr-3 rounded-full border transition ${
                      userMenuOpen ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center text-white">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.firstName} className="w-full h-full rounded-full" />
                      ) : (
                        <UserIcon size={14} />
                      )}
                    </div>
                    <span className="text-sm font-medium hidden sm:inline">
                      {user?.firstName}
                    </span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  <div
                    className={`absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-200 z-50 ${
                      userMenuOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 invisible"
                    }`}
                  >
                    <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                      <p className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm transition"
                      >
                        <UserIcon size={16} />
                        My Account
                      </Link>
                      <Link
                        href="/cart"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm transition"
                      >
                        <ShoppingCart size={16} />
                        My Cart
                      </Link>
                      <Link
                        href="/wishlist"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm transition"
                      >
                        <Heart size={16} />
                        My Wishlist
                      </Link>
                    </div>
                    <div className="p-2 border-t border-gray-50">
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                          setMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm transition"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/auth/sign-in"
                  className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition shadow-sm"
                >
                  Sign In
                </Link>
              )}

              <button
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition ml-1"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden backdrop-blur-[2px] transition-all duration-300"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-80 bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col
        ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-bold">E-Mart</h2>
          <button 
            onClick={() => setMenuOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoggedIn && (
            <div className="px-6 py-6 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white text-lg font-bold">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.firstName} className="w-full h-full rounded-full" />
                  ) : (
                    user?.firstName[0]
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
          )}

          <nav className="flex flex-col px-6 py-6 space-y-1">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Navigation</h3>
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="flex items-center px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-black rounded-xl transition"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setMenuOpen(false)}
              className="flex items-center px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-black rounded-xl transition"
            >
              All Products
            </Link>
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="flex items-center px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-black rounded-xl transition"
            >
              Contact
            </Link>
            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="flex items-center px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-black rounded-xl transition"
            >
              About
            </Link>

            <div className="my-4 border-t border-gray-100 pt-4">
              <SearchBar />
            </div>

            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4 mb-2">My Account</h3>
            {isLoggedIn ? (
              <>
                <Link
                  href="/account"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-black rounded-xl transition"
                >
                  Profile Settings
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-black rounded-xl transition"
                >
                  My Shopping Cart
                </Link>
                <Link
                  href="/wishlist"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-black rounded-xl transition"
                >
                  My Wishlist
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center px-3 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-xl transition w-full"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/sign-in"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-black rounded-xl transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/sign-up"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-black rounded-xl transition"
                >
                  Create Account
                </Link>
              </>
            )}
          </nav>
        </div>
      </aside>

      {/* Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
