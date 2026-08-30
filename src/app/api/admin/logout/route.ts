import { NextResponse } from "next/server";
import { NOMBRE_COOKIE_SESION } from "@/lib/adminAuth";

export async function POST() {
  const respuesta = NextResponse.json({ ok: true });
  respuesta.cookies.delete(NOMBRE_COOKIE_SESION);
  return respuesta;
}
