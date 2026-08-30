import { NextResponse } from "next/server";
import { actualizarProductoEnGitHub } from "@/lib/githubContenido";

export async function PATCH(request: Request, { params }: { params: Promise<{ asin: string }> }) {
  const { asin } = await params;

  let cambios: Record<string, unknown>;
  try {
    cambios = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  try {
    await actualizarProductoEnGitHub(asin, cambios);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido al guardar." },
      { status: 500 }
    );
  }
}
