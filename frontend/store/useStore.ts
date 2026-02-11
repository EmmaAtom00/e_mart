import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/interface/type";
import { apiClient } from "@/lib/api";

export interface CartItem extends Product {
    quantity: number;
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "customer" | "admin" | "seller";
    avatar?: string;
}

interface StoreState {
    // Cart
    cart: CartItem[];
    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (id: number) => void;
    updateCartQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCode: string | null;

    // Wishlist
    wishlist: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (id: number) => void;
    isInWishlist: (id: number) => boolean;

    // Auth
    user: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    isAuthChecked: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    signup: (firstName: string, lastName: string, email: string, password: string, confirmPassword: string) => Promise<boolean>;
    initializeAuth: () => Promise<void>;
    getCartCode: () => string;
    clearError: () => void;
}

export const useStore = create<StoreState>()(
    persist(
        (set, get) => ({
            // Cart
            cart: [],
            cartCode: null,
            addToCart: async (product: Product, quantity: number) => {
                const { isLoggedIn, cartCode, getCartCode } = get();
                const code = cartCode || getCartCode();

                if (isLoggedIn) {
                    try {
                        const response = await apiClient.request<any>("/cart/add/", {
                            method: "POST",
                            body: JSON.stringify({
                                cart_code: code,
                                product_id: product.id,
                                quantity: quantity
                            })
                        });
                        if (response.success) {
                            // Sync state from server
                            set({ cart: response.data.cartitems.map((item: any) => ({
                                ...item.product,
                                quantity: item.quantity
                            })) });
                            return;
                        }
                    } catch (err) {
                        console.error("Add to cart error:", err);
                    }
                }

                set((state) => {
                    const existingItem = state.cart.find((item) => item.id === product.id);
                    if (existingItem) {
                        return {
                            cart: state.cart.map((item) =>
                                item.id === product.id
                                    ? { ...item, quantity: item.quantity + quantity }
                                    : item
                            ),
                        };
                    }
                    return {
                        cart: [...state.cart, { ...product, quantity }],
                    };
                });
            },

            removeFromCart: async (id: number) => {
                const { isLoggedIn, cartCode } = get();
                if (isLoggedIn && cartCode) {
                    try {
                        const response = await apiClient.request<any>("/cart/remove/", {
                            method: "DELETE",
                            body: JSON.stringify({
                                cart_code: cartCode,
                                product_id: id
                            })
                        });
                        if (response.success) {
                            set({ cart: response.data.cartitems.map((item: any) => ({
                                ...item.product,
                                quantity: item.quantity
                            })) });
                            return;
                        }
                    } catch (err) {
                        console.error("Remove from cart error:", err);
                    }
                }

                set((state) => ({
                    cart: state.cart.filter((item) => item.id !== id),
                }));
            },

            updateCartQuantity: async (id: number, quantity: number) => {
                if (quantity < 1) {
                    get().removeFromCart(id);
                    return;
                }

                const { isLoggedIn, cartCode } = get();
                if (isLoggedIn && cartCode) {
                    try {
                        const response = await apiClient.request<any>("/cart/update/", {
                            method: "PATCH",
                            body: JSON.stringify({
                                cart_code: cartCode,
                                product_id: id,
                                quantity: quantity
                            })
                        });
                        if (response.success) {
                            set({ cart: response.data.cartitems.map((item: any) => ({
                                ...item.product,
                                quantity: item.quantity
                            })) });
                            return;
                        }
                    } catch (err) {
                        console.error("Update cart quantity error:", err);
                    }
                }

                set((state) => ({
                    cart: state.cart.map((item) =>
                        item.id === id ? { ...item, quantity } : item
                    ),
                }));
            },

            clearCart: () => {
                set({ cart: [] });
            },

            get cartTotal() {
                return get().cart.reduce((sum, item) => sum + item.salePrice * item.quantity, 0);
            },

            // Wishlist
            wishlist: [],
            addToWishlist: async (product: Product) => {
                const { isLoggedIn } = get();
                if (isLoggedIn) {
                    try {
                        const res = await apiClient.addToWishlist(product.id);
                        if (res.success) {
                            set({ wishlist: res.data.items.map((item: any) => item.product) });
                            return;
                        }
                    } catch (err) {
                        console.error("Add to wishlist error:", err);
                    }
                }

                set((state) => {
                    if (state.wishlist.find((item) => item.id === product.id)) {
                        return state;
                    }
                    return {
                        wishlist: [...state.wishlist, product],
                    };
                });
            },

            removeFromWishlist: async (id: number) => {
                const { isLoggedIn } = get();
                if (isLoggedIn) {
                    try {
                        const res = await apiClient.removeFromWishlist(id);
                        if (res.success) {
                            set({ wishlist: res.data.items.map((item: any) => item.product) });
                            return;
                        }
                    } catch (err) {
                        console.error("Remove from wishlist error:", err);
                    }
                }

                set((state) => ({
                    wishlist: state.wishlist.filter((item) => item.id !== id),
                }));
            },

            isInWishlist: (id: number) => {
                return get().wishlist.some((item) => item.id === id);
            },

            // Auth
            user: null,
            isLoggedIn: false,
            isLoading: false,
            isAuthChecked: false,
            error: null,

            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await apiClient.login(email, password);
                    if (response.success && response.data) {
                        set({
                            user: {
                                id: response.data.user.id,
                                email: response.data.user.email,
                                firstName: response.data.user.first_name,
                                lastName: response.data.user.last_name,
                                role: response.data.user.role,
                                avatar: response.data.user.avatar,
                            },
                            isLoggedIn: true,
                            isLoading: false,
                            error: null,
                        });
                        return true;
                    } else {
                        const errorMsg = response.error || "Invalid credentials. Please try again.";
                        set({
                            error: errorMsg,
                            isLoading: false,
                        });
                        return false;
                    }
                } catch (err) {
                    const errorMsg = err instanceof Error ? err.message : "Network error. Please check your connection.";
                    set({
                        error: errorMsg,
                        isLoading: false,
                    });
                    return false;
                }
            },

            logout: async () => {
                set({ isLoading: true });
                try {
                    await apiClient.logout();
                } catch (err) {
                    console.error("Logout error:", err);
                }
                set({
                    user: null,
                    isLoggedIn: false,
                    isLoading: false,
                    error: null,
                });
            },

            signup: async (firstName: string, lastName: string, email: string, password: string, confirmPassword: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await apiClient.signup(email, password, firstName, lastName, confirmPassword);
                    if (response.success && response.data) {
                        set({
                            user: {
                                id: response.data.user.id,
                                email: response.data.user.email,
                                firstName: response.data.user.first_name,
                                lastName: response.data.user.last_name,
                                role: response.data.user.role,
                                avatar: response.data.user.avatar,
                            },
                            isLoggedIn: true,
                            isLoading: false,
                            error: null,
                        });
                        return true;
                    } else {
                        const errorMsg = response.error || "Failed to create account. Please try again.";
                        set({
                            error: errorMsg,
                            isLoading: false,
                        });
                        return false;
                    }
                } catch (err) {
                    const errorMsg = err instanceof Error ? err.message : "Network error. Please check your connection.";
                    set({
                        error: errorMsg,
                        isLoading: false,
                    });
                    return false;
                }
            },

            initializeAuth: async () => {
                set({ isLoading: true });
                try {
                    if (apiClient.isAuthenticated()) {
                        const response = await apiClient.getCurrentUser();
                        if (response.success && response.data) {
                            set({
                                user: {
                                    id: response.data.id,
                                    email: response.data.email,
                                    firstName: response.data.first_name,
                                    lastName: response.data.last_name,
                                    role: response.data.role,
                                    avatar: response.data.avatar,
                                },
                                isLoggedIn: true,
                                isLoading: false,
                                isAuthChecked: true,
                            });

                            // Sync Cart and Wishlist from DB
                            const cartCode = get().getCartCode();
                            const cartRes = await apiClient.request<any>(`/cart/get/?cart_code=${cartCode}`);
                            if (cartRes.success) {
                                set({ cart: cartRes.data.cartitems.map((item: any) => ({
                                    ...item.product,
                                    quantity: item.quantity
                                })) });
                            }

                            const wishlistRes = await apiClient.getWishlist();
                            if (wishlistRes.success) {
                                set({ wishlist: wishlistRes.data.items.map((item: any) => item.product) });
                            }
                        } else {
                            // If getCurrentUser fails but we had a token, it might be expired
                            set({ isLoggedIn: false, user: null, isLoading: false, isAuthChecked: true });
                        }
                    } else {
                        set({ isLoggedIn: false, user: null, isLoading: false, isAuthChecked: true });
                    }
                } catch (err) {
                    console.error("Auth initialization error:", err);
                    set({ isLoggedIn: false, user: null, isLoading: false, isAuthChecked: true });
                }
            },

            getCartCode: () => {
                const { cartCode } = get() as any;
                if (cartCode) return cartCode;

                let code = "";
                if (typeof window !== "undefined") {
                    code = localStorage.getItem("cart_code") || "";
                    if (!code) {
                        code = Math.random().toString(36).substring(2, 13);
                        localStorage.setItem("cart_code", code);
                    }
                }
                set({ cartCode: code } as any);
                return code;
            },

            clearError: () => {
                set({ error: null });
            },
        }),
        {
            name: "emart-store",
            partialize: (state) => ({
                cart: state.cart,
                wishlist: state.wishlist,
                user: state.user,
                isLoggedIn: state.isLoggedIn,
            }),
        }
    )
);
