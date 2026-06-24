import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

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
  '/admin/reports',
  '/admin/settings',
];

const hotelRoutes = ['/hotel/dashboard'];

async function getSessionPayload(token: string) {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return null;
    const key = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
    return payload as { userId: string; role: string; email: string };
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = adminRoutes.some((r) => pathname.startsWith(r));
  const isHotelRoute = hotelRoutes.some((r) => pathname.startsWith(r));

  if (!isAdminRoute && !isHotelRoute) {
    return NextResponse.next();
  }

  // Leer la cookie unificada auth_token (escrita por authService)
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    response.cookies.delete('session');
    return response;
  }

  const session = await getSessionPayload(token);

  if (!session) {
    const response = NextResponse.redirect(new URL('/admin/login', request.url));
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
    '/admin/payments'
  ];

  // RBAC: rutas de admin solo para SUPER_ADMIN, ADMIN, OPERATOR
  if (isAdminRoute) {
    const isAdminRole = role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'OPERATOR';
    if (!isAdminRole) {
      if (role === 'HOTEL' || role === 'AGENCY') {
        return NextResponse.redirect(new URL('/hotel/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Bloquear acceso a rutas restringidas para OPERATOR
    if (role === 'OPERATOR') {
      const isRestricted = restrictedForOperator.some(r => pathname.startsWith(r));
      if (isRestricted) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
  }

  // RBAC: rutas de hotel para HOTEL, AGENCY y admins
  if (isHotelRoute) {
    const allowed = ['HOTEL', 'AGENCY', 'SUPER_ADMIN', 'ADMIN'];
    if (!allowed.includes(role)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};
