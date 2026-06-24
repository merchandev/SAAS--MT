import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "metransfers-super-secret-key-2026-fallback";
const key = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Definir rutas protegidas
  const isAdminRoute = pathname.startsWith("/admin");
  const isHotelRoute = pathname.startsWith("/hotel");
  
  // Excluir ruta de login
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (isAdminRoute || isHotelRoute) {
    // 2. Verificar token
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      const { payload } = await jwtVerify(token, key, {
        algorithms: ["HS256"],
      });
      
      const role = payload.role as string;

      // 3. Autorización básica por rol
      if (isAdminRoute && !["SUPER_ADMIN", "ADMIN", "OPERATOR"].includes(role)) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }

      if (isHotelRoute && !["HOTEL", "AGENCY", "SUPER_ADMIN"].includes(role)) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }

      return NextResponse.next();
    } catch (error) {
      // Token inválido o expirado
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/hotel/:path*"],
};
