"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  Heart,
  ShoppingCart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Loader,
} from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import { useStore } from "@/store/useStore";
import { getImageUrl } from "@/utils/image";

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

const SingleProduct = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.id as string;

  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.getProductDetails(slug);
        if (response.success && response.data) {
          setProduct(response.data);
          setIsWishlisted(isInWishlist(response.data.id));
        } else {
          setError(response.error || "Product not found");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch product");
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug, isInWishlist]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      discount: product.discount,
      salePrice: parseFloat(product.sale_price),
      reviewsCount: product.reviews_count,
      rating: product.rating,
      image: product.image,
    }, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlist = () => {
    if (!product) return;
    if (isWishlisted) {
      removeFromWishlist(product.id);
      setIsWishlisted(false);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        discount: product.discount,
        salePrice: parseFloat(product.sale_price),
        reviewsCount: product.reviews_count,
        rating: product.rating,
        image: product.image,
      });
      setIsWishlisted(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">{error || "The product you're looking for doesn't exist"}</p>
          <button
            onClick={() => router.push("/products")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const images = [product.image, product.image, product.image, product.image];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-8 lg:px-32 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-gray-900">
            Products
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>
      </div>

      {/* Product Section */}
      <div className="container mx-auto px-4 md:px-8 lg:px-32 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 h-96 flex items-center justify-center">
              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`bg-white rounded-lg border-2 p-2 h-20 flex items-center justify-center transition border-gray-200`}
                >
                  <img
                    src={getImageUrl(img)}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Title & Rating */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={`${i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating} ({product.reviews_count} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  ${parseFloat(product.sale_price).toFixed(2)}
                </span>
                <span className="text-xl text-gray-400 line-through">
                  ${parseFloat(product.price).toFixed(2)}
                </span>
                <span className="bg-secondarytwo text-white px-3 py-1 rounded text-sm font-semibold">
                  -{product.discount}%
                </span>
              </div>
              <p className={`font-semibold ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              {product.stock > 0 && (
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-medium">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="px-6 py-2 border-l border-r border-gray-300">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-4 py-2 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${addedToCart
                    ? "bg-green-600 text-white"
                    : "bg-secondarytwo text-white hover:opacity-90 disabled:opacity-50"
                    }`}
                >
                  <ShoppingCart size={20} />
                  {addedToCart ? "Added to Cart!" : "Add to Cart"}
                </button>
                <button
                  onClick={handleWishlist}
                  className={`px-6 py-3 rounded-lg font-semibold border-2 transition ${isWishlisted
                    ? "bg-secondarytwo text-white border-secondarytwo"
                    : "border-gray-300 text-gray-900 hover:border-secondarytwo"
                    }`}
                >
                  <Heart
                    size={20}
                    fill={isWishlisted ? "currentColor" : "none"}
                  />
                </button>
                <button className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3 border-t border-gray-200 pt-6">
              {[
                { icon: Truck, text: "Free shipping on orders over $100" },
                { icon: Shield, text: "2-year warranty included" },
                { icon: RotateCcw, text: "30-day money-back guarantee" },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <feature.icon size={20} className="text-secondarytwo" />
                  <span className="text-gray-700">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 mb-12">
          <div className="border-b border-gray-200 flex">
            {["Description", "Specifications", "Reviews"].map((tab) => (
              <button
                key={tab}
                className="px-6 py-4 font-medium text-gray-700 hover:text-gray-900 border-b-2 border-transparent hover:border-secondarytwo transition"
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="p-6 md:p-8">
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
