import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
    "/account",
    "/checkout",
    "/orders",
    "/wishlist",
];

const authRoutes = ["/auth/sign-in", "/auth/sign-up"];

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const token = request.cookies.get("auth_token")?.value;

    // Check if route is protected
    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    // Check if route is auth route
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    // Redirect to login if accessing protected route without token
    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    // Redirect to home if accessing auth routes with token
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
