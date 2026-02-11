"use client";
import { Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { getImageUrl } from "@/utils/image";

const Cart = () => {
    const { cart, removeFromCart, updateCartQuantity } = useStore();

    const subtotal = cart.reduce((sum, item) => sum + item.salePrice * item.quantity, 0);
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="container mx-auto px-4 md:px-8 lg:px-32 py-8 md:py-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Shopping Cart</h1>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 md:px-8 lg:px-32 pb-12">
                {cart.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-lg p-4 md:p-6 flex gap-4 md:gap-6 border border-gray-200"
                                >
                                    {/* Image */}
                                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                                        <img
                                            src={getImageUrl(item.image)}
                                            alt={item.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 line-clamp-2">{item.name}</h3>
                                        <p className="text-secondarytwo font-bold mt-2">${item.salePrice}</p>

                                        {/* Quantity */}
                                        <div className="flex items-center gap-2 mt-4 w-fit">
                                            <button
                                                onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                                className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                                className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Price & Remove */}
                                    <div className="flex flex-col items-end justify-between">
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-secondarytwo hover:text-red-700 transition"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                        <p className="font-bold text-gray-900">
                                            ${(item.salePrice * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg p-6 border border-gray-200 sticky top-20 space-y-4">
                                <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>

                                <div className="space-y-3 border-b border-gray-200 pb-4">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax (10%)</span>
                                        <span>${tax.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between text-lg font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>

                                <Link
                                    href="/checkout"
                                    className="w-full bg-secondarytwo text-white py-3 rounded-lg font-semibold hover:opacity-90 transition text-center block"
                                >
                                    Proceed to Checkout
                                </Link>

                                <Link
                                    href="/products"
                                    className="w-full border border-gray-300 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-50 transition text-center block"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🛒</div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-600 mb-6">Add items to your cart to get started</p>
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

export default Cart;
