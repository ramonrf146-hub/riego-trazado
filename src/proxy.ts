import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verificarTokenSesion, NOMBRE_COOKIE_SESION } from "@/lib/adminAuth";

/**
 * Protege /admin y /api/admin. Se llama "proxy" (no "middleware") porque
 * Next.js 16 renombró el archivo — ver node_modules/next/dist/docs.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(NOMBRE_COOKIE_SESION)?.value;

  if (!verificarTokenSesion(token)) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
