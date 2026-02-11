"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { useStore } from "@/store/useStore";

const ForgotPasswordPage = () => {
    const router = useRouter();
    const { isLoggedIn, isLoading: authLoading } = useStore();
    const [isInitialized, setIsInitialized] = useState(false);
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        setIsInitialized(true);
        if (isLoggedIn && !authLoading) {
            router.push("/");
        }
    }, [isLoggedIn, authLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (!email) {
            setError("Please enter your email address");
            return;
        }

        setIsLoading(true);
        try {
            const response = await apiClient.requestPasswordReset(email);
            if (response.success) {
                setSuccess(true);
                setEmail("");
            } else {
                setError(response.error || "Failed to send reset email");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isInitialized || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Redirect if logged in (this shouldn't show but just in case)
    if (isLoggedIn) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
                    <p className="mt-2 text-gray-600">
                        Enter your email address and we'll send you a link to reset your password
                    </p>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                        Check your email for password reset instructions
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                {!success && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {isLoading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>
                )}

                {/* Back to Login */}
                <p className="text-center text-gray-600">
                    Remember your password?{" "}
                    <Link href="/auth/sign-in" className="text-blue-600 font-semibold hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
