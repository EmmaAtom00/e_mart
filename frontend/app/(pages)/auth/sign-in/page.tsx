"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useStore } from "@/store/useStore";

const SignIn = () => {
    const router = useRouter();
    const { login, isLoggedIn, isLoading: authLoading } = useStore();
    const [isInitialized, setIsInitialized] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

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

        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        setIsLoading(true);
        try {
            const success = await login(email, password);
            if (success) {
                router.push("/");
            } else {
                setError("Invalid email or password");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred during sign in");
        } finally {
            setIsLoading(false);
        }
    };

    // Show loading state while checking auth
    if (!isInitialized || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondarytwo"></div>
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
                    <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="mt-2 text-gray-600">Sign in to your E-Mart account</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
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
                            className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondarytwo focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="mt-2 relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondarytwo focus:border-transparent"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Remember & Forgot */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                            <span className="text-sm text-gray-600">Remember me</span>
                        </label>
                        <Link href="/auth/forgot-password" className="text-sm text-secondarytwo hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-secondarytwo text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                    >
                        {isLoading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
                    </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                        <span className="text-xl">f</span>
                        <span className="text-sm font-medium">Facebook</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                        <span className="text-xl">G</span>
                        <span className="text-sm font-medium">Google</span>
                    </button>
                </div>

                {/* Sign Up Link */}
                <p className="text-center text-gray-600">
                    Don't have an account?{" "}
                    <Link href="/auth/sign-up" className="text-secondarytwo font-semibold hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignIn;
