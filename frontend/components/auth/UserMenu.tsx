"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useStore } from "@/store/useStore";
import { User, LogOut, Settings } from "lucide-react";

export const UserMenu = () => {
    const router = useRouter();
    const { user, isLoggedIn } = useAuth();
    const { logout } = useStore();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        setIsOpen(false);
        router.push("/");
    };

    if (!isLoggedIn || !user) {
        return (
            <div className="flex gap-2">
                <Link
                    href="/auth/sign-in"
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                >
                    Sign In
                </Link>
                <Link
                    href="/auth/sign-up"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                    Sign Up
                </Link>
            </div>
        );
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                    {user.firstName}
                </span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                        <p className="font-semibold text-gray-900">
                            {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500 mt-1 capitalize">
                            {user.role}
                        </p>
                    </div>

                    <div className="py-2">
                        <Link
                            href="/account"
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                            onClick={() => setIsOpen(false)}
                        >
                            <User size={16} />
                            <span>My Account</span>
                        </Link>
                        <button
                            className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition text-left"
                            onClick={() => setIsOpen(false)}
                        >
                            <Settings size={16} />
                            <span>Settings</span>
                        </button>
                    </div>

                    <div className="border-t border-gray-200 p-2">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition rounded"
                        >
                            <LogOut size={16} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
