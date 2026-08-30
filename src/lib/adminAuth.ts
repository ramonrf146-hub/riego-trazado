import "server-only";
import crypto from "node:crypto";

const DURACION_SESION_SEGUNDOS = 60 * 60 * 24 * 30; // 30 días
export const NOMBRE_COOKIE_SESION = "admin_session";

function firmar(mensaje: string, secreto: string): string {
  return crypto.createHmac("sha256", secreto).update(mensaje).digest("hex");
}

function secretoCompleto(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  const secreto = process.env.SESSION_SECRET;
  if (!password || !secreto) return null;
  return `${password}:${secreto}`;
}

export function crearTokenSesion(): string | null {
  const secreto = secretoCompleto();
  if (!secreto) return null;
  const exp = Math.floor(Date.now() / 1000) + DURACION_SESION_SEGUNDOS;
  const firma = firmar(String(exp), secreto);
  return `${exp}.${firma}`;
}

export function verificarTokenSesion(token: string | undefined | null): boolean {
  if (!token) return false;
  const secreto = secretoCompleto();
  if (!secreto) return false;

  const [expStr, firma] = token.split(".");
  if (!expStr || !firma) return false;

  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return false;

  const firmaEsperada = firmar(expStr, secreto);
  const bufA = Buffer.from(firma, "hex");
  const bufB = Buffer.from(firmaEsperada, "hex");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/** Comparación en tiempo constante para no filtrar la contraseña por timing. */
export function passwordCorrecta(intento: string): boolean {
  const real = process.env.ADMIN_PASSWORD;
  if (!real) return false;
  const bufA = Buffer.from(intento);
  const bufB = Buffer.from(real);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function panelConfigurado(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.SESSION_SECRET);
}
