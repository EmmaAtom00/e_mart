"use client";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                {/* 404 Text */}
                <div className="mb-8">
                    <h1 className="text-9xl md:text-[150px] font-bold text-gray-200 leading-none">
                        404
                    </h1>
                    <p className="text-2xl md:text-3xl font-bold text-gray-900 -mt-4">
                        Page Not Found
                    </p>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-8 text-lg">
                    Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                </p>

                {/* Illustration */}
                <div className="mb-8 text-6xl">
                    🔍
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-secondarytwo text-white rounded-lg font-semibold hover:opacity-90 transition"
                    >
                        <Home size={20} />
                        Go Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition"
                    >
                        <ArrowLeft size={20} />
                        Go Back
                    </button>
                </div>

                {/* Helpful Links */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-gray-600 text-sm mb-4">You might find these helpful:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {["Home", "Shop", "About", "Contact"].map((link) => (
                            <Link
                                key={link}
                                href={`/${link.toLowerCase()}`}
                                className="text-sm text-secondarytwo hover:underline"
                            >
                                {link}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
