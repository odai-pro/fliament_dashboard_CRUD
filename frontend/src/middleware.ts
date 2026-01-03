import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if user has auth token from cookies (server-side check)
    const token = request.cookies.get('auth_token')?.value;
    const isAuthenticated = !!token;

    // Public routes that don't require authentication
    const publicRoutes = ['/', '/login', '/register', '/otp'];
    const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));

    // Protected routes (require authentication)
    const protectedRoutes = ['/home', '/visits', '/profile', '/bookings'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // Redirect logic
    if (isProtectedRoute && !isAuthenticated) {
        // Redirect to login if trying to access protected route without auth
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isPublicRoute && isAuthenticated && (pathname === '/login' || pathname === '/register' || pathname === '/otp')) {
        // Redirect authenticated users away from auth pages
        return NextResponse.redirect(new URL('/home', request.url));
    }

    if (pathname === '/' && isAuthenticated) {
        // Redirect authenticated users from root to home
        return NextResponse.redirect(new URL('/home', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon.ico|public|.*\\..*|slider-).*)',
    ],
};
