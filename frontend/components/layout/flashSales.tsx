"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import ProductCard from "../common/productContainer";
import { Loader } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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

const FlashSales = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.getProducts({ featured: "true" });
        if (response.success && response.data) {
          setProducts(response.data.results.slice(0, 8));
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
          Today's
        </p>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-0">
        <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-20">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            Flash Sales
          </h2>

          {/* Countdown */}
          <div className="flex items-center gap-3 md:gap-6 flex-wrap">
            {[
              { label: "Days", value: "03" },
              { label: "Hours", value: "23" },
              { label: "Minutes", value: "19" },
              { label: "Seconds", value: "18" },
            ].map((item, index) => (
              <div
                key={item.label}
                className="flex items-center gap-3 md:gap-6"
              >
                <div>
                  <p className="text-xs md:text-sm font-semibold">
                    {item.label}
                  </p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold">
                    {item.value}
                  </p>
                </div>
                {index !== 3 && <span className="text-lg md:text-2xl">:</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Carousel */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader className="animate-spin text-blue-600" size={40} />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : (
        <>
          <Carousel className="w-full">
            <div className="flex gap-2 md:gap-4 mb-4">
              <CarouselPrevious className="h-8 w-8 md:h-10 md:w-10 relative top-0 left-0 translate-x-0 translate-y-0" />
              <CarouselNext className="h-8 w-8 md:h-10 md:w-10 relative top-0 right-0 translate-x-0 translate-y-0" />
            </div>
            <CarouselContent>
              {products.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="basis-full xs:basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <Link href={`/products/${product.slug}`}>
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
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* CTA */}
          <div className="mx-auto w-fit">
            <Link href="/products">
              <button className="rounded bg-secondarytwo px-8 md:px-12 py-3 md:py-4 text-white text-sm md:text-base hover:opacity-90 transition">
                View All Products
              </button>
            </Link>
          </div>
        </>
      )}
    </section>
  );
};

export default FlashSales;
