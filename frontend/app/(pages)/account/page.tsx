"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const AccountPage = () => {
    const router = useRouter();
    const { user, logout } = useStore();

    const handleLogout = async () => {
        await logout();
        router.replace("/");
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
                        <p className="text-gray-600 mt-2">Manage your profile and settings</p>
                    </div>

                    {/* Profile Card */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <div className="flex items-center gap-6 mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {user?.firstName} {user?.lastName}
                                </h2>
                                <p className="text-gray-600">{user?.email}</p>
                                <p className="text-sm text-gray-500 mt-1 capitalize">
                                    Role: {user?.role}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Account Info */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <p className="mt-1 text-gray-900">{user?.email}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <p className="mt-1 text-gray-900">
                                    {user?.firstName} {user?.lastName}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Account Type</label>
                                <p className="mt-1 text-gray-900 capitalize">{user?.role}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <Link href="/cart" className="bg-white border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition text-left">
                            <h4 className="font-semibold text-gray-900">My Cart</h4>
                            <p className="text-sm text-gray-600">View your shopping cart</p>
                        </Link>
                        <Link href="/wishlist" className="bg-white border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition text-left">
                            <h4 className="font-semibold text-gray-900">Wishlist</h4>
                            <p className="text-sm text-gray-600">View your saved items</p>
                        </Link>
                        <Link href="/products" className="bg-white border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition text-left">
                            <h4 className="font-semibold text-gray-900">Browse Products</h4>
                            <p className="text-sm text-gray-600">Continue shopping</p>
                        </Link>
                        <button className="bg-white border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition text-left">
                            <h4 className="font-semibold text-gray-900">Help & Support</h4>
                            <p className="text-sm text-gray-600">Get help with your account</p>
                        </button>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default AccountPage;
