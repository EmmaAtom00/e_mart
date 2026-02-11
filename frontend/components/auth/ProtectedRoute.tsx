"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: "customer" | "admin" | "seller";
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
    const router = useRouter();
    const { isLoggedIn, isLoading, user, isAuthChecked } = useStore();

    useEffect(() => {
        if (!isLoading && isAuthChecked) {
            if (!isLoggedIn) {
                router.replace("/auth/sign-in");
            } else if (requiredRole && user?.role !== requiredRole) {
                router.replace("/");
            }
        }
    }, [isLoading, isAuthChecked, isLoggedIn, user, requiredRole, router]);

    if (isLoading || !isAuthChecked) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isLoggedIn) return null;
    if (requiredRole && user?.role !== requiredRole) return null;

    return <>{children}</>;
};
