import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verificarTokenSesion, NOMBRE_COOKIE_SESION } from "@/lib/adminAuth";

/**
 * Se llama "proxy" (no "middleware") porque Next.js 16 renombró el
 * archivo — ver node_modules/next/dist/docs. Dos responsabilidades:
 *
 * 1. Protege /admin y /api/admin (igual que antes de sumar i18n).
 * 2. Reescribe internamente las rutas sin prefijo a /es/... para que el
 *    español conserve sus URLs históricas (sin "/es" visible nunca en
 *    el navegador), mientras que /en/... pasa intacto. Ver
 *    node_modules/next/dist/docs/01-app/02-guides/internationalization.md.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
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

  if (pathname.startsWith("/api/") || pathname.startsWith("/_next/") || /\.[a-zA-Z0-9]+$/.test(pathname)) {
    return NextResponse.next();
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/es" : `/es${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
