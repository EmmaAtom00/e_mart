"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import ProductCard from "../common/productContainer";
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

const NewArrivals = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.getProducts();
        if (response.success && response.data) {
          setProducts(response.data.results.slice(0, 4));
        } else {
          setError(response.error || "Failed to fetch products");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="space-y-6 md:space-y-10">
      {/* Section label */}
      <div className="flex items-center gap-3 md:gap-4">
        <div className="h-8 md:h-10 w-4 md:w-5 rounded bg-secondarytwo" />
        <p className="font-semibold text-secondarytwo text-sm md:text-base">
          Featured
        </p>
      </div>

      {/* Header */}
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
        New Arrival
      </h2>

      {/* Featured Layout */}
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <Loader className="animate-spin text-blue-600" size={40} />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Large featured item */}
          <div className="md:row-span-2 bg-black rounded-lg overflow-hidden flex items-center justify-center p-6 md:p-8 min-h-96 md:min-h-full">
            <div className="text-white text-center space-y-4">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                PlayStation 5
              </h3>
              <p className="text-sm md:text-base text-gray-300">
                Black and White version of the PS5 coming out on sale.
              </p>
              <Link href="/products">
                <button className="text-white underline hover:opacity-80 transition">
                  Shop Now
                </button>
              </Link>
            </div>
          </div>

          {/* Grid of 4 products */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`}>
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
        </div>
      )}
    </section>
  );
};

export default NewArrivals;
