import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/package", "/admin", "/tracking", "/projects", "/inventory", "/partners", "/returns", "/qr", "/settings"];
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("token")?.value;

    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    );

    const isAuthRoute = authRoutes.some(route =>
        pathname.startsWith(route)
    );

    // Case 1: Protected route WITHOUT token → add query param
    if (isProtectedRoute && !token) {
        const url = request.nextUrl.clone();
        url.searchParams.set("auth", "required");
        return NextResponse.rewrite(url);
    }

    // Case 2: Protected route WITH token → validate token
    if (isProtectedRoute && token) {
        try {
            // Invalid/expired token → clear cookie and add auth query
            const url = request.nextUrl.clone();
            url.searchParams.set("auth", "required");

            const res = NextResponse.rewrite(url);
            res.cookies.delete("token");
            return res;

        } catch (error) {
            console.error("Token validation error:", error);

            // Error → add auth query
            const url = request.nextUrl.clone();
            url.searchParams.set("auth", "required");

            const res = NextResponse.rewrite(url);
            res.cookies.delete("token");
            return res;
        }
    }

    // Case 3: Auth routes WITH valid token → redirect to dashboard
    if (isAuthRoute && token) {
        try {
            const redirectParam = request.nextUrl.searchParams.get("redirect");
            const redirectUrl = redirectParam || "/admin";
            return NextResponse.redirect(new URL(redirectUrl, request.url));

        } catch {
            // Invalid token, allow access to auth pages
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};