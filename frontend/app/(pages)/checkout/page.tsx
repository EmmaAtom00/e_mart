"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const Checkout = () => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        cardName: "",
        cardNumber: "",
        expiry: "",
        cvv: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError("");
    };

    const validateStep = (): boolean => {
        setError("");

        if (step === 1) {
            if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.zipCode) {
                setError("Please fill in all shipping fields");
                return false;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                setError("Please enter a valid email address");
                return false;
            }
            if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
                setError("Please enter a valid phone number");
                return false;
            }
        } else if (step === 2) {
            if (!formData.cardName || !formData.cardNumber || !formData.expiry || !formData.cvv) {
                setError("Please fill in all payment fields");
                return false;
            }
            if (!/^\d{13,19}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
                setError("Please enter a valid card number");
                return false;
            }
            if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) {
                setError("Please enter expiry in MM/YY format");
                return false;
            }
            if (!/^\d{3,4}$/.test(formData.cvv)) {
                setError("Please enter a valid CVV");
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateStep()) {
            return;
        }

        if (step < 3) {
            setStep(step + 1);
        } else {
            setIsLoading(true);
            try {
                // Simulate order submission
                await new Promise(resolve => setTimeout(resolve, 1500));
                alert("Order placed successfully!");
                // Reset form
                setStep(1);
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    address: "",
                    city: "",
                    state: "",
                    zipCode: "",
                    cardName: "",
                    cardNumber: "",
                    expiry: "",
                    cvv: "",
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to place order");
            } finally {
                setIsLoading(false);
            }
        }
    };

    const subtotal = 1500;
    const shipping = 10;
    const tax = 150;
    const total = subtotal + shipping + tax;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="container mx-auto px-4 md:px-8 lg:px-32 py-8 md:py-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Checkout</h1>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 md:px-8 lg:px-32 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Steps */}
                    <div className="lg:col-span-2">
                        {/* Step Indicator */}
                        <div className="flex items-center justify-between mb-8">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex items-center flex-1">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${s <= step
                                            ? "bg-secondarytwo text-white"
                                            : "bg-gray-200 text-gray-600"
                                            }`}
                                    >
                                        {s}
                                    </div>
                                    {s < 3 && (
                                        <div
                                            className={`flex-1 h-1 mx-2 ${s < step ? "bg-secondarytwo" : "bg-gray-200"
                                                }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Step Labels */}
                        <div className="grid grid-cols-3 gap-4 mb-8 text-center text-sm font-medium">
                            <div className={step >= 1 ? "text-gray-900" : "text-gray-500"}>
                                Shipping
                            </div>
                            <div className={step >= 2 ? "text-gray-900" : "text-gray-500"}>
                                Payment
                            </div>
                            <div className={step >= 3 ? "text-gray-900" : "text-gray-500"}>
                                Review
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 md:p-8 border border-gray-200 space-y-6">
                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}
                            {/* Step 1: Shipping */}
                            {step === 1 && (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>

                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            name="firstName"
                                            placeholder="First Name"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondarytwo"
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="lastName"
                                            placeholder="Last Name"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondarytwo"
                                            required
                                        />
                                    </div>

                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondarytwo"
                                        required
                                    />

                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone Number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondarytwo"
                                        required
                                    />

                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Street Address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondarytwo"
                                        required
                                    />

                                    <div className="grid grid-cols-3 gap-4">
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="City"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondarytwo"
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="state"
                                            placeholder="State"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondarytwo"
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="zipCode"
                                            placeholder="ZIP Code"
                                            value={formData.zipCode}
                                            onChange={handleChange}
                                            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondarytwo"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Payment */}
                            {step === 2 && (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>

                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input type="radio" name="payment" defaultChecked className="w-4 h-4" />
                                            <span className="font-medium">Credit Card</span>
                                        </label>
                                        <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input type="radio" name="payment" className="w-4 h-4" />
                                            <span className="font-medium">Debit Card</span>
                                        </label>
                                        <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input type="radio" name="payment" className="w-4 h-4" />
                                            <span className="font-medium">PayPal</span>
                                        </label>
                                    </div>

                                    <div className="border-t pt-4 space-y-4">
                                        <input
                                            type="text"
                                            name="cardName"
                                            placeholder="Cardholder Name"
                                            value={formData.cardName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondarytwo"
                                            required
                                        />

                                        <input
                                            type="text"
                                            name="cardNumber"
                                            placeholder="Card Number"
                                            value={formData.cardNumber}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondarytwo"
                                            required
                                        />

                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                name="expiry"
                                                placeholder="MM/YY"
                                                value={formData.expiry}
                                                onChange={handleChange}
                                                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondarytwo"
                                                required
                                            />
                                            <input
                                                type="text"
                                                name="cvv"
                                                placeholder="CVV"
                                                value={formData.cvv}
                                                onChange={handleChange}
                                                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondarytwo"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Review */}
                            {step === 3 && (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold text-gray-900">Review Order</h2>

                                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Shipping to:</span>
                                            <span className="font-medium">
                                                {formData.firstName} {formData.lastName}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Address:</span>
                                            <span className="font-medium text-right">
                                                {formData.address}, {formData.city}, {formData.state} {formData.zipCode}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Payment:</span>
                                            <span className="font-medium">•••• •••• •••• {formData.cardNumber.slice(-4)}</span>
                                        </div>
                                    </div>

                                    <label className="flex items-start gap-2">
                                        <input type="checkbox" className="w-4 h-4 mt-1" required />
                                        <span className="text-sm text-gray-600">
                                            I agree to the terms and conditions
                                        </span>
                                    </label>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex gap-4 pt-6 border-t">
                                {step > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => setStep(step - 1)}
                                        className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                                    >
                                        Back
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 bg-secondarytwo text-white py-3 rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isLoading ? "Processing..." : step === 3 ? "Place Order" : "Continue"}
                                    {!isLoading && step < 3 && <ChevronRight size={20} />}
                                </button>
                            </div>
                        </form>
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
                                    <span>${shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-lg font-bold text-gray-900">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
