"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api";
import ProductCard from "@/components/common/productContainer";
import { Loader } from "lucide-react";

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  price: string;
  sale_price: string;
  discount: number;
  rating: number;
  reviews_count: number;
  stock: number;
  featured: boolean;
  category: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
}

import { Suspense, useRef, useCallback } from "react";

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParam || "");
  
  // Advanced Filter State
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [ordering, setOrdering] = useState("-created_at");

  // Infinite Scroll State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading || isFetchingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, isFetchingMore, hasMore]);

  // Reset when filters change
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
  }, [selectedCategory, searchQuery, ordering, minPrice, maxPrice]);

  useEffect(() => {
    const fetchData = async () => {
      if (page === 1) setIsLoading(true);
      else setIsFetchingMore(true);
      
      setError(null);
      try {
        // Fetch categories (only once)
        if (categories.length === 0) {
          const categoriesResponse = await apiClient.getCategories();
          if (categoriesResponse.success && categoriesResponse.data) {
            setCategories(categoriesResponse.data);
          }
        }

        // Fetch products
        const filters: Record<string, string> = {
          page: page.toString(),
          ordering: ordering,
        };
        
        if (selectedCategory) filters.category = selectedCategory;
        if (searchQuery) filters.search = searchQuery;
        if (minPrice) filters.min_price = minPrice;
        if (maxPrice) filters.max_price = maxPrice;

        const response = await apiClient.getProducts(filters);
        if (response.success && response.data) {
          const newProducts = response.data.results;
          setProducts(prev => page === 1 ? newProducts : [...prev, ...newProducts]);
          setTotalCount(response.data.count);
          setHasMore(response.data.next !== null);
        } else {
          setError(response.error || "Failed to fetch products");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setIsLoading(false);
        setIsFetchingMore(false);
      }
    };

    fetchData();
  }, [selectedCategory, searchQuery, ordering, minPrice, maxPrice, page]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setMinPrice("");
    setMaxPrice("");
    setOrdering("-created_at");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 lg:px-32 py-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">E-Mart Shop</h1>
          <p className="text-gray-500 mt-3 text-lg">Discover our premium selection of products tailored for you.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-32 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Search */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-uppercase tracking-wider text-gray-400 font-bold mb-4 uppercase">Search</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Price Filter */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-uppercase tracking-wider text-gray-400 font-bold mb-4 uppercase">Price Range</h3>
              <div className="flex gap-4 items-center">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-uppercase tracking-wider text-gray-400 font-bold mb-4 uppercase">Categories</h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${selectedCategory === null
                    ? "bg-black text-white shadow-lg shadow-gray-200"
                    : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <span className="font-medium">All Products</span>
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.slug)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${selectedCategory === category.slug
                      ? "bg-black text-white shadow-lg shadow-gray-200"
                      : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <span className="font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <button 
              onClick={clearFilters}
              className="w-full py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-all"
            >
              Clear All Filters
            </button>
          </div>

          {/* Products Section */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-100 gap-4">
              <p className="text-gray-600">
                Showing <span className="font-bold text-black">{products.length}</span> of <span className="font-bold text-black">{totalCount}</span> products
              </p>
              
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-sm font-medium">Sort by:</span>
                <select 
                  value={ordering}
                  onChange={(e) => setOrdering(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-black focus:border-black block p-2.5 outline-none transition-all"
                >
                  <option value="-created_at">Newest Arrivals</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-96 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500 font-medium">Loading products...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                <span className="font-medium">{error}</span>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="text-gray-300 mb-4 flex justify-center">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
                <p className="text-gray-500 text-xl font-medium">No products match your search</p>
                <button 
                  onClick={clearFilters}
                  className="mt-6 text-black font-bold underline hover:text-gray-600 transition-all"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="space-y-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product) => (
                    <Link key={product.id} href={`/products/${product.slug}`} className="group h-full">
                      <ProductCard product={{
                        id: product.id,
                        name: product.name,
                        price: parseFloat(product.price),
                        discount: product.discount,
                        salePrice: parseFloat(product.sale_price),
                        reviewsCount: product.reviews_count,
                        rating: product.rating,
                        image: product.image,
                      }} />
                    </Link>
                  ))}
                </div>

                {/* Infinite Scroll Trigger */}
                <div ref={lastElementRef} className="flex justify-center py-8">
                  {isFetchingMore ? (
                    <div className="flex items-center gap-3 text-gray-500 font-medium bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100">
                      <div className="w-5 h-5 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
                      <span>Loading more...</span>
                    </div>
                  ) : hasMore ? (
                    <div className="h-10" />
                  ) : products.length > 0 && (
                    <div className="flex flex-col items-center gap-2">
                       <div className="h-px w-20 bg-gray-200" />
                       <p className="text-gray-400 text-sm font-medium">You've reached the end of the collection</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin"></div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
