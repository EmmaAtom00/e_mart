"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import { Loader } from "lucide-react";
import {
  Smartphone,
  Shirt,
  Zap,
  Home,
  Pill,
  Dumbbell,
  Baby,
  ShoppingBag,
  Heart,
} from "lucide-react";

const CATEGORY_ICONS = [
  Smartphone,
  Shirt,
  Zap,
  Home,
  Pill,
  Dumbbell,
  Baby,
  ShoppingBag,
  Heart,
];

interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
}

const CategorySection = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.getCategories();
        if (response.success && response.data) {
          setCategories(response.data);
        } else {
          setError(response.error || "Failed to fetch categories");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="space-y-6 md:space-y-10">
      {/* Section label */}
      <div className="flex items-center gap-3 md:gap-4">
        <div className="h-8 md:h-10 w-4 md:w-5 rounded bg-secondarytwo" />
        <p className="font-semibold text-secondarytwo text-sm md:text-base">
          Categories
        </p>
      </div>

      {/* Header */}
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
        Browse By Category
      </h2>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader className="animate-spin text-blue-600" size={40} />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {categories.map((category, index) => {
            const Icon = CATEGORY_ICONS[index % CATEGORY_ICONS.length];
            return (
              <Link key={category.id} href={`/products?category=${category.slug}`}>
                <div className="flex flex-col items-center justify-center gap-3 md:gap-4 p-4 md:p-6 border border-gray-200 rounded-lg hover:bg-secondarytwo hover:text-white transition cursor-pointer group">
                  <Icon
                    size={32}
                    className="md:w-10 md:h-10 group-hover:scale-110 transition"
                  />
                  <p className="text-xs md:text-sm font-medium text-center line-clamp-2">
                    {category.name}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default CategorySection;
