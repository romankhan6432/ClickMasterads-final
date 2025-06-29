import { withAuth } from "next-auth/middleware";
import type { NextRequestWithAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import Negotiator from 'negotiator';
import { match as matchLocale } from '@formatjs/intl-localematcher';

const locales = ['en', 'bn', 'hi', 'es','fr','ar'] as const;
const defaultLocale = 'en';

function getLocale(request: NextRequest): string {
    const negotiatorHeaders: Record<string, string> = {}
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

    // @ts-ignore locales are readonly
    const languages = new Negotiator({ headers: negotiatorHeaders }).languages()

    try {
        const locale = matchLocale(languages, locales, defaultLocale)
        return locale
    } catch (e) {
        return defaultLocale
    }
}

async function middleware(request: NextRequest, event: any) {
    const pathname = request.nextUrl.pathname;

    // Check if the pathname is missing a locale
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );
    const locale =  getLocale(request);

    if (!pathnameHasLocale) {
         
        // e.g. incoming request is /products
        // The new URL is now /en/products
        return NextResponse.redirect(
            new URL(
                `/${locale}${pathname === '/' ? '' : pathname}`,
                request.url
            )
        );
    }

    // Check if the path is public (auth-related)
    const isPublicPath = pathname.includes('/auth');
    if (isPublicPath) {
        return NextResponse.next();
    }

    // Protect all other routes with basic auth
    return withAuth(
        (req, evt) => {
            const token = req.nextauth.token;
            const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
            
            if (isAdminRoute && token?.role !== 'admin') {
                return NextResponse.redirect(new URL('/', req.url));
            }
            
            return NextResponse.next();
        },
        {
            pages: {
                signIn: `/${locale}/auth`,
            },
            callbacks: {
                authorized: ({ token }) => !!token,
            },
        }
    )(request as NextRequestWithAuth, event);
}

export default middleware;

export const config = {
    // Match all routes except api, _next/static, _next/image, favicon.ico, and files with extensions
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|\\.).*)'],
    include: [
        "/admin/:path*",
        "/api/admin/:path*"
    ]
}