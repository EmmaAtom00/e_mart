"use client";

import { useStore } from "@/store/useStore";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";

export default function DebugAuthPage() {
    const store = useStore();
    const [token, setToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [localStore, setLocalStore] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setToken(localStorage.getItem("auth_token"));
            setRefreshToken(localStorage.getItem("refresh_token"));
            setLocalStore(localStorage.getItem("emart-store"));
        }
    }, []);

    const handleForceInit = async () => {
        await store.initializeAuth();
    };

    const handleCheckUser = async () => {
        console.log("Checking user...");
        try {
            const res = await apiClient.getCurrentUser();
            console.log("User result:", res);
            alert(JSON.stringify(res, null, 2));
        } catch (e) {
            console.error(e);
            alert(e);
        }
    };

    return (
        <div className="p-10 space-y-4">
            <h1 className="text-2xl font-bold">Auth Debugger</h1>
            
            <div className="border p-4 rounded bg-gray-100">
                <h2 className="font-bold">Zustand Store State</h2>
                <pre className="text-xs">{JSON.stringify({
                    isLoggedIn: store.isLoggedIn,
                    isLoading: store.isLoading,
                    isAuthChecked: store.isAuthChecked,
                    user: store.user,
                    error: store.error
                }, null, 2)}</pre>
            </div>

            <div className="border p-4 rounded bg-gray-100">
                <h2 className="font-bold">LocalStorage</h2>
                <p><strong>auth_token:</strong> {token ? `${token.substring(0, 10)}...` : "null"}</p>
                <p><strong>refresh_token:</strong> {refreshToken ? `${refreshToken.substring(0, 10)}...` : "null"}</p>
                <div className="mt-2">
                     <strong>emart-store:</strong>
                     <pre className="text-xs overflow-auto h-32">{localStore}</pre>
                </div>
            </div>

            <div className="flex gap-4">
                <button 
                    onClick={handleForceInit}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Force initializeAuth()
                </button>
                <button 
                    onClick={handleCheckUser}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Test apiClient.getCurrentUser()
                </button>
                <button
                    onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                >
                    Clear Storage & Reload
                </button>
            </div>
        </div>
    );
}
