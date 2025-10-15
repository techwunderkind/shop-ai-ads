import { NextResponse } from 'next/server';

export function middleware(request) {
    const path = request.nextUrl.pathname;
    
    // Log all requests for debugging
    console.log(`🔒 MIDDLEWARE RUNNING: ${path}`);
    console.log(`🔒 Request URL: ${request.url}`);
    
    // Allow these paths without auth
    if (
        path === '/login' ||
        path.startsWith('/api/auth') ||
        path.startsWith('/_next') ||
        path.startsWith('/favicon')
    ) {
        console.log(`Allowing ${path} without auth`);
        return NextResponse.next();
    }

    // Check auth cookie
    const authCookie = request.cookies.get('auth');
    console.log(`🔒 Auth cookie for ${path}:`, authCookie?.value || 'none');
    console.log(`🔒 All cookies:`, request.cookies.getAll().map(c => `${c.name}=${c.value}`).join('; '));
    
    if (!authCookie || authCookie.value !== 'authenticated') {
        // Log for debugging in production
        console.log(`🔒 REDIRECTING ${path} to login - cookie: ${authCookie?.value || 'none'}`);
        console.log(`🔒 Request URL: ${request.url}`);
        
        // Use NextResponse.redirect with relative URL
        return NextResponse.redirect(new URL('/login', request.url));
    }

    console.log(`🔒 AUTH SUCCESS for ${path}`);
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - /_next/static (static files)
         * - /_next/image (image optimization files)
         * - /favicon.ico (favicon file)
         * - /api/auth (auth endpoints)
         * - /login (login page)
         */
        '/((?!_next/static|_next/image|favicon.ico|api/auth|login).*)',
    ],
};