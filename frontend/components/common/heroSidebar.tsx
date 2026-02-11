"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api";

interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
}

const HeroSidebar = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.request<Category[]>("/categories/");
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <aside className="hidden md:flex flex-col gap-3 border-r border-gray-200/50 pt-8 pr-8 lg:pr-32 min-w-max">
      {isLoading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : (
        categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.slug}`}
            className="cursor-pointer whitespace-nowrap text-sm md:text-base transition-colors hover:text-black text-gray-700"
          >
            {category.name}
          </Link>
        ))
      )}
    </aside>
  );
};

export default HeroSidebar;
