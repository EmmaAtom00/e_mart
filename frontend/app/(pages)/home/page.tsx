import HeroSidebar from "@/components/common/heroSidebar";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import APPLE from "@/public/assets/icons/image.png";
import IPHONE from "@/public/assets/iphone.png";
import FlashSales from "@/components/layout/flashSales";
import CategorySection from "@/components/layout/categorySection";
import BestSelling from "@/components/layout/bestSelling";
import ExploreProducts from "@/components/layout/exploreProducts";
import NewArrivals from "@/components/layout/newArrivals";

const Home = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="container mx-auto px-4 md:px-8 lg:px-32 py-6 md:py-10">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          {/* Sidebar - Hidden on mobile */}
          <div className="hidden md:block">
            <HeroSidebar />
          </div>

          {/* Hero Banner */}
          <div className="w-full md:flex-1">
            <div className="flex flex-col md:flex-row items-center justify-between bg-black rounded-lg py-6 md:py-8 px-4 md:px-8 lg:px-12 text-white gap-6 md:gap-0">
              {/* Left content */}
              <div className="w-full md:w-1/2 space-y-4 md:space-y-5">
                <div className="flex items-center gap-3">
                  <Image src={APPLE} alt="Apple logo" width={32} height={32} className="md:w-10 md:h-10" />
                  <p className="text-xs md:text-sm">iPhone 14 Series</p>
                </div>

                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight">
                  Up to 10%
                  <br />
                  off Voucher
                </h2>

                <Link href="/products">
                  <button className="flex items-center gap-2 md:gap-3 font-bold underline hover:opacity-80 cursor-pointer text-sm md:text-base">
                    Shop Now
                    <MoveRight size={18} className="md:w-5 md:h-5" />
                  </button>
                </Link>
              </div>

              {/* Right image */}
              <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                <Image
                  src={IPHONE}
                  alt="iPhone 14"
                  width={492}
                  height={352}
                  priority
                  className="w-full max-w-xs md:max-w-sm lg:max-w-md h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flash Sales */}
      <div className="container mx-auto px-4 md:px-8 lg:px-32 py-10 md:py-20">
        <FlashSales />
      </div>

      {/* Category Section */}
      <div className="container mx-auto px-4 md:px-8 lg:px-32 py-10 md:py-20 border-b border-gray-200">
        <CategorySection />
      </div>

      {/* Best Selling */}
      <div className="container mx-auto px-4 md:px-8 lg:px-32 py-10 md:py-20">
        <BestSelling />
      </div>

      {/* Explore Products */}
      <div className="container mx-auto px-4 md:px-8 lg:px-32 py-10 md:py-20 border-b border-gray-200">
        <ExploreProducts />
      </div>

      {/* New Arrivals */}
      <div className="container mx-auto px-4 md:px-8 lg:px-32 py-10 md:py-20">
        <NewArrivals />
      </div>
    </div>
  );
};

export default Home;
