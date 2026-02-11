const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface AuthResponse {
    access: string;
    refresh: string;
    user: {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        role: "customer" | "admin" | "seller";
        avatar?: string;
    };
}

class ApiClient {
    private getToken(): string | null {
        if (typeof window === "undefined") return null;
        const name = "auth_token=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return null;
    }

    private getRefreshToken(): string | null {
        if (typeof window === "undefined") return null;
        const name = "refresh_token=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return null;
    }

    private setTokens(access: string, refresh: string) {
        if (typeof window === "undefined") return;
        const date = new Date();
        date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
        const expires = "; expires=" + date.toUTCString();
        document.cookie = "auth_token=" + access + expires + "; path=/; SameSite=Lax";
        document.cookie = "refresh_token=" + refresh + expires + "; path=/; SameSite=Lax";
    }

    private clearTokens() {
        if (typeof window === "undefined") return;
        document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    private async refreshAccessToken(): Promise<boolean> {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) return false;

        try {
            const response = await fetch(`${API_URL}/auth/refresh/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh: refreshToken }),
            });

            if (!response.ok) {
                this.clearTokens();
                return false;
            }

            const data = await response.json();
            this.setTokens(data.access, refreshToken); // Keep same refresh token or update if rotated
            return true;
        } catch {
            this.clearTokens();
            return false;
        }
    }

    async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${API_URL}${endpoint}`;
        const token = this.getToken();

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        if (options.headers && typeof options.headers === "object") {
            Object.assign(headers, options.headers);
        }

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        try {
            let response = await fetch(url, {
                ...options,
                headers,
            });

            // Handle token expiration
            if (response.status === 401) {
                // Try to refresh token
                const refreshed = await this.refreshAccessToken();
                if (refreshed) {
                    const newToken = this.getToken();
                    if (newToken) {
                        headers.Authorization = `Bearer ${newToken}`;
                    }
                    response = await fetch(url, {
                        ...options,
                        headers,
                    });
                } else {
                    // If refresh fails, clear tokens and retry without auth
                    this.clearTokens();
                    delete headers.Authorization;
                    response = await fetch(url, {
                        ...options,
                        headers,
                    });
                }
            }

            // Check if response has content before parsing JSON
            const contentType = response.headers.get("content-type");
            let data: any = {};
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            }

            if (!response.ok) {
                return {
                    success: false,
                    error: data?.error || data?.message || data?.detail || "An error occurred",
                };
            }

            return {
                success: true,
                data,
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Network error occurred";
            return {
                success: false,
                error: errorMessage,
            };
        }
    }

    async signup(
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        passwordConfirm: string
    ): Promise<ApiResponse<AuthResponse>> {
        const response = await this.request<AuthResponse>("/auth/signup/", {
            method: "POST",
            body: JSON.stringify({
                email,
                password,
                password_confirm: passwordConfirm,
                first_name: firstName,
                last_name: lastName,
            }),
        });

        if (response.success && response.data) {
            this.setTokens(response.data.access, response.data.refresh);
        }

        return response;
    }

    async login(
        email: string,
        password: string
    ): Promise<ApiResponse<AuthResponse>> {
        const response = await this.request<AuthResponse>("/auth/login/", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        if (response.success && response.data) {
            this.setTokens(response.data.access, response.data.refresh);
        }

        return response;
    }

    async logout(): Promise<void> {
        const refreshToken = this.getRefreshToken();
        if (refreshToken) {
            await this.request("/auth/logout/", {
                method: "POST",
                body: JSON.stringify({ refresh: refreshToken }),
            });
        }
        this.clearTokens();
    }

    async getCurrentUser(): Promise<ApiResponse<AuthResponse["user"]>> {
        return this.request("/auth/me/", { method: "GET" });
    }

    async updateProfile(data: Partial<AuthResponse["user"]>): Promise<ApiResponse<AuthResponse["user"]>> {
        return this.request("/auth/profile/", {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    }

    async requestPasswordReset(email: string): Promise<ApiResponse<{ message: string }>> {
        return this.request("/auth/password-reset/", {
            method: "POST",
            body: JSON.stringify({ email }),
        });
    }

    async resetPassword(
        token: string,
        password: string
    ): Promise<ApiResponse<{ message: string }>> {
        return this.request("/auth/password-reset-confirm/", {
            method: "POST",
            body: JSON.stringify({ token, password }),
        });
    }

    async getOrders(): Promise<ApiResponse<any[]>> {
        return this.request("/orders/", { method: "GET" });
    }

    async getOrderDetails(orderId: string): Promise<ApiResponse<any>> {
        return this.request(`/orders/${orderId}/`, { method: "GET" });
    }

    async createOrder(data: any): Promise<ApiResponse<any>> {
        return this.request("/orders/", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async getProductDetails(productId: string): Promise<ApiResponse<any>> {
        return this.request(`/products/${productId}/`, { method: "GET" });
    }

    async getProductReviews(productId: string): Promise<ApiResponse<any[]>> {
        return this.request(`/products/${productId}/reviews/`, { method: "GET" });
    }

    async createProductReview(productId: string, data: any): Promise<ApiResponse<any>> {
        return this.request(`/products/${productId}/reviews/`, {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async getCategories(): Promise<ApiResponse<any[]>> {
        return this.request("/categories/", { method: "GET" });
    }

    async getProducts(filters?: Record<string, string>): Promise<ApiResponse<PaginatedResponse<any>>> {
        let endpoint = "/products/";
        if (filters && Object.keys(filters).length > 0) {
            const params = new URLSearchParams(filters);
            endpoint += `?${params.toString()}`;
        }
        return this.request(endpoint, { method: "GET" });
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    getAuthHeader(): Record<string, string> {
        const token = this.getToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }
}

export const apiClient = new ApiClient();
