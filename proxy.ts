import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from './lib/auth';

const adminOnlyRoutes = [
  '/admin/dashboard', 
  '/admin/bookings', 
  '/admin/vehicles', 
  '/admin/hotels', 
  '/admin/agencies', 
  '/admin/payments', 
  '/admin/pricing', 
  '/admin/reports', 
  '/admin/settings'
];

const hotelOnlyRoutes = [
  '/hotel/dashboard'
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isAdminRoute = adminOnlyRoutes.some(route => pathname.startsWith(route));
  const isHotelRoute = hotelOnlyRoutes.some(route => pathname.startsWith(route));
  const isPrivateRoute = isAdminRoute || isHotelRoute || pathname.startsWith('/api/private');
  
  if (isPrivateRoute) {
    const session = request.cookies.get('session')?.value;
    
    // 1. Si no hay sesión, al login
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    try {
      const parsed = await decrypt(session);
      
      // 2. Si la sesión expiró o es inválida, al login
      if (!parsed || parsed.expires < Date.now()) {
        const response = NextResponse.redirect(new URL('/admin/login', request.url));
        response.cookies.delete('session');
        return response;
      }

      const userRole = parsed.role;

      // 3. Control de Acceso por Roles (RBAC)
      // Si un Hotel intenta entrar al panel de Admin
      if (isAdminRoute && userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') {
        if (userRole === 'HOTEL' || userRole === 'AGENCY') {
          return NextResponse.redirect(new URL('/hotel/dashboard', request.url));
        }
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Si un Admin intenta entrar al panel de Hotel, se lo permitimos o lo mandamos a su dashboard (lo mandamos a su dashboard por simplicidad)
      if (isHotelRoute && (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN')) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }

    } catch (error) {
      // Si desencriptar falla, limpiar y salir
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('session');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
