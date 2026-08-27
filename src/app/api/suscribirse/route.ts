import { NextResponse } from "next/server";

/**
 * Da de alta un correo en Buttondown (con un tag opcional para saber
 * qué imán de leads lo trajo). Siempre responde ok:true salvo email
 * inválido — un fallo de Buttondown no debe bloquear la descarga del
 * regalo, que ya se resuelve del lado del cliente independientemente
 * de esta llamada.
 */
export async function POST(request: Request) {
  let email: unknown;
  let tag: unknown;

  try {
    const body = await request.json();
    email = body.email;
    tag = body.tag;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  const apiKey = process.env.BUTTONDOWN_API_KEY;
  if (!apiKey) {
    console.error("BUTTONDOWN_API_KEY no está configurada en este entorno.");
    return NextResponse.json({ ok: true });
  }

  try {
    const respuesta = await fetch("https://api.buttondown.com/v1/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        tags: typeof tag === "string" ? [tag] : undefined,
      }),
    });

    // 201 = alta nueva. 400 suele ser "ya existe ese email" — ambos son
    // éxito desde la perspectiva de quien completó el formulario.
    if (!respuesta.ok && respuesta.status !== 400) {
      console.error("Error de Buttondown:", respuesta.status, await respuesta.text());
    }
  } catch (error) {
    console.error("No se pudo conectar con Buttondown:", error);
  }

  return NextResponse.json({ ok: true });
}
