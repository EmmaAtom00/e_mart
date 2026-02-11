"use client";

import React, { ReactNode, useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Error caught by boundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
                        <AlertCircle className="mx-auto text-red-600 mb-4" size={48} />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Something went wrong
                        </h1>
                        <p className="text-gray-600 mb-6">
                            {this.state.error?.message || "An unexpected error occurred"}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export const ErrorFallback = ({ error, resetError }: { error: Error; resetError: () => void }) => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <AlertCircle className="mx-auto text-red-600 mb-4" size={48} />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
                {error?.message || "An unexpected error occurred"}
            </p>
            <button
                onClick={resetError}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
                Try Again
            </button>
        </div>
    </div>
);
