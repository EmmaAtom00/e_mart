"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { useStore } from "@/store/useStore";
import { ShoppingCart, Heart, Loader } from "lucide-react";
import Image from "next/image";
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

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    const { addToCart, addToWishlist, isInWishlist } = useStore();
    const inWishlist = product ? isInWishlist(product.id) : false;

    useEffect(() => {
        const fetchProduct = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await apiClient.getProductDetails(slug);
                if (response.success && response.data) {
                    setProduct(response.data);
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
    }, [slug]);

    const handleAddToCart = async () => {
        if (!product) return;
        setIsAdding(true);
        try {
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
            // Show success message
            alert("Product added to cart!");
            setQuantity(1);
        } catch (err) {
            alert("Failed to add to cart");
        } finally {
            setIsAdding(false);
        }
    };

    const handleAddToWishlist = () => {
        if (!product) return;
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
        alert(inWishlist ? "Removed from wishlist" : "Added to wishlist");
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

    const salePrice = parseFloat(product.sale_price);
    const originalPrice = parseFloat(product.price);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 md:px-8 lg:px-32 py-8">
                {/* Breadcrumb */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push("/products")}
                        className="text-blue-600 hover:underline"
                    >
                        ← Back to Products
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow p-6 md:p-8">
                    {/* Product Image */}
                    <div className="flex items-center justify-center bg-gray-100 rounded-lg p-6">
                        <div className="relative w-full h-96">
                            <Image
                                src={getImageUrl(product.image)}
                                alt={product.name}
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                        {/* Title and Rating */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                            <div className="flex items-center gap-4 mt-4">
                                <div className="flex items-center gap-1">
                                    <span className="text-yellow-400">★</span>
                                    <span className="font-semibold">{product.rating}</span>
                                    <span className="text-gray-600">({product.reviews_count} reviews)</span>
                                </div>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-4">
                                <span className="text-3xl font-bold text-gray-900">${salePrice.toFixed(2)}</span>
                                {product.discount > 0 && (
                                    <>
                                        <span className="text-lg text-gray-500 line-through">${originalPrice.toFixed(2)}</span>
                                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                                            -{product.discount}%
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                            <p className="text-gray-600">{product.description}</p>
                        </div>

                        {/* Stock Status */}
                        <div>
                            <p className={`font-semibold ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                            </p>
                        </div>

                        {/* Quantity Selector */}
                        {product.stock > 0 && (
                            <div className="flex items-center gap-4">
                                <label className="font-semibold text-gray-900">Quantity:</label>
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                                    >
                                        −
                                    </button>
                                    <span className="px-6 py-2 font-semibold">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdding || product.stock === 0}
                                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <ShoppingCart size={20} />
                                {isAdding ? "Adding..." : "Add to Cart"}
                            </button>
                            <button
                                onClick={handleAddToWishlist}
                                className={`px-6 py-3 rounded-lg font-semibold transition border-2 flex items-center gap-2 ${inWishlist
                                    ? "bg-red-50 border-red-600 text-red-600"
                                    : "border-gray-300 text-gray-700 hover:border-red-600"
                                    }`}
                            >
                                <Heart size={20} fill={inWishlist ? "currentColor" : "none"} />
                                {inWishlist ? "Saved" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
