"use client";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/common/productContainer";
import { useStore } from "@/store/useStore";

const Wishlist = () => {
    const { wishlist, removeFromWishlist, addToCart } = useStore();

    const moveToCart = (id: number) => {
        const product = wishlist.find((item) => item.id === id);
        if (product) {
            addToCart(product, 1);
            removeFromWishlist(id);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="container mx-auto px-4 md:px-8 lg:px-32 py-8 md:py-12">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Wishlist</h1>
                        <p className="text-gray-600 mt-2">{wishlist.length} items saved</p>
                    </div>
                    <Heart size={40} className="text-secondarytwo fill-secondarytwo" />
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 md:px-8 lg:px-32 pb-12">
                {wishlist.length > 0 ? (
                    <>
                        {/* Products Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
                            {wishlist.map((product) => (
                                <div key={product.id} className="relative group">
                                    <ProductCard product={product} />
                                    {/* Action Buttons */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                        <button
                                            onClick={() => moveToCart(product.id)}
                                            className="flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
                                        >
                                            <ShoppingCart size={18} />
                                            Add to Cart
                                        </button>
                                        <button
                                            onClick={() => removeFromWishlist(product.id)}
                                            className="bg-secondarytwo text-white p-2 rounded-lg hover:opacity-90 transition"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <Link
                                href="/products"
                                className="px-8 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition text-center"
                            >
                                Continue Shopping
                            </Link>
                            <button className="px-8 py-3 bg-secondarytwo text-white rounded-lg font-semibold hover:opacity-90 transition">
                                Move All to Cart
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-16">
                        <Heart size={64} className="mx-auto text-gray-300 mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-600 mb-6">Add items to your wishlist to save them for later</p>
                        <Link
                            href="/products"
                            className="inline-block px-8 py-3 bg-secondarytwo text-white rounded-lg font-semibold hover:opacity-90 transition"
                        >
                            Start Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
