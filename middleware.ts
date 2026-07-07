import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const locales = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'sv', 'zh-CN'];
const defaultLocale = 'en';

const adminRoutes = [
  '/admin/dashboard',
  '/admin/bookings',
  '/admin/vehicles',
  '/admin/hotels',
  '/admin/agencies',
  '/admin/drivers',
  '/admin/customers',
  '/admin/payments',
  '/admin/pricing',
  '/admin/users',
  '/admin/reports',
  '/admin/settings',
];

const hotelRoutes = ['/hotel/dashboard'];
const customerRoutes = ['/customer/dashboard'];
const AUTH_ISSUER = "metransfers:auth";
const AUTH_AUDIENCE = "metransfers:app";

async function getSessionPayload(token: string) {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return null;
    const key = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, key, { 
      algorithms: ['HS256'],
      issuer: AUTH_ISSUER,
      audience: AUTH_AUDIENCE
    });
    return payload as { userId: string; role: string; email: string };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- 1. ADMIN & AUTH LOGIC ---
  const isAdminRoute = adminRoutes.some((r) => pathname.startsWith(r));
  const isHotelRoute = hotelRoutes.some((r) => pathname.startsWith(r));
  const isCustomerRoute = customerRoutes.some((r) => pathname.startsWith(r));

  if (isAdminRoute || isHotelRoute || isCustomerRoute) {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      const loginPath = isCustomerRoute ? '/login' : '/admin/login';
      const response = NextResponse.redirect(new URL(loginPath, request.url));
      response.cookies.delete('session');
      return response;
    }

    const session = await getSessionPayload(token);

    if (!session) {
      const loginPath = isCustomerRoute ? '/login' : '/admin/login';
      const response = NextResponse.redirect(new URL(loginPath, request.url));
      response.cookies.delete('auth_token');
      response.cookies.delete('session');
      return response;
    }

    const { role } = session;

    // Rutas restringidas para operadores
    const restrictedForOperator = [
      '/admin/settings',
      '/admin/pricing',
      '/admin/hotels',
      '/admin/agencies',
      '/admin/payments',
      '/admin/users'
    ];

    if (isAdminRoute) {
      const isAdminRole = role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'OPERATOR';
      if (!isAdminRole) {
        if (role === 'HOTEL' || role === 'AGENCY') {
          return NextResponse.redirect(new URL('/hotel/dashboard', request.url));
        }
        return NextResponse.redirect(new URL('/', request.url));
      }

      if (role === 'OPERATOR') {
        const isRestricted = restrictedForOperator.some(r => pathname.startsWith(r));
        if (isRestricted) {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
      }
    }

    if (isHotelRoute) {
      const allowed = ['HOTEL', 'AGENCY', 'SUPER_ADMIN', 'ADMIN'];
      if (!allowed.includes(role)) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    if (isCustomerRoute) {
      if (role !== 'CUSTOMER') {
        if (role === 'HOTEL' || role === 'AGENCY') {
          return NextResponse.redirect(new URL('/hotel/dashboard', request.url));
        }
        if (role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'OPERATOR') {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
    return NextResponse.next();
  }

  // --- 2. i18n ROUTING LOGIC ---
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    const currentLocale = pathname.split('/')[1];
    const response = NextResponse.next();
    
    // Sincronizar la cookie de Google Translate con la URL actual
    if (currentLocale === 'es') {
      response.cookies.set('googtrans', '', { expires: new Date(0), path: '/' });
    } else {
      // Set the cookie for the root path
      response.cookies.set('googtrans', `/es/${currentLocale}`, { path: '/' });
    }
    
    return response;
  }

  // Ignore static assets, api routes, and admin routes for i18n
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/customer') ||
    pathname.startsWith('/driver') ||
    pathname.startsWith('/hotel') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Redirect if there is no locale
  const locale: string = defaultLocale; // Add type annotation to prevent TS error
  request.nextUrl.pathname = `/${locale}${pathname}`;
  
  // Use a 301 redirect for SEO
  const response = NextResponse.redirect(request.nextUrl, 301);
  if (locale === 'es') {
    response.cookies.set('googtrans', '', { expires: new Date(0), path: '/' });
  } else {
    response.cookies.set('googtrans', `/es/${locale}`, { path: '/' });
  }
  return response;
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|_next/static|_next/image|favicon.ico).*)',
  ],
};
