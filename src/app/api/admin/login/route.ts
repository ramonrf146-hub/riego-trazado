import { NextResponse } from "next/server";
import { passwordCorrecta, crearTokenSesion, panelConfigurado, NOMBRE_COOKIE_SESION } from "@/lib/adminAuth";

export async function POST(request: Request) {
  let password: unknown;
  try {
    const body = await request.json();
    password = body.password;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (typeof password !== "string" || password.length === 0) {
    return NextResponse.json({ error: "Falta la contraseña" }, { status: 400 });
  }

  if (!panelConfigurado()) {
    return NextResponse.json(
      { error: "El panel no está configurado (faltan ADMIN_PASSWORD / SESSION_SECRET en el servidor)." },
      { status: 500 }
    );
  }

  if (!passwordCorrecta(password)) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  const token = crearTokenSesion();
  const respuesta = NextResponse.json({ ok: true });
  respuesta.cookies.set(NOMBRE_COOKIE_SESION, token as string, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return respuesta;
}
