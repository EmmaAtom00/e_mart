import { useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";

export const useAuth = () => {
    const { user, isLoggedIn, isLoading, error, initializeAuth, clearError } = useStore();
    const hasInitialized = useRef(false);

    useEffect(() => {
        // Only initialize once
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            initializeAuth();
        }
    }, []);

    return {
        user,
        isLoggedIn,
        isLoading,
        error,
        clearError,
    };
};

export const useRequireAuth = () => {
    const auth = useAuth();

    return {
        ...auth,
        isAuthenticated: auth.isLoggedIn && !auth.isLoading,
    };
};
