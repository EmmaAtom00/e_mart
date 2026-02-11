"use client";

import { ReactNode, useEffect } from "react";
import { useStore } from "@/store/useStore";

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const { initializeAuth } = useStore();

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    return <>{children}</>;
};
