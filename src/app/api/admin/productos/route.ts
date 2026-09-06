import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { agregarProductoEnGitHub, type NuevoProducto } from "@/lib/githubContenido";

/**
 * Lista TODOS los productos (incluidos los pausados) leyendo el archivo
 * tal cual se desplegó — es una vista de solo lectura, así que no hace
 * falta pasar por GitHub como sí es necesario para guardar cambios.
 */
export async function GET() {
  const ruta = path.join(process.cwd(), "data", "productos.json");
  const productos = JSON.parse(fs.readFileSync(ruta, "utf-8"));
  productos.sort((a: { ranking: number }, b: { ranking: number }) => a.ranking - b.ranking);
  return NextResponse.json({ productos });
}

const CAMPOS_REQUERIDOS = [
  "asin",
  "nombre",
  "categoria",
  "precio",
  "imagen",
  "rating",
  "numResenas",
  "notaTecnica",
] as const;

export async function POST(request: Request) {
  let datos: Record<string, unknown>;
  try {
    datos = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  for (const campo of CAMPOS_REQUERIDOS) {
    if (datos[campo] === undefined || datos[campo] === null || datos[campo] === "") {
      return NextResponse.json({ error: `Falta el campo "${campo}".` }, { status: 400 });
    }
  }

  const nuevo: NuevoProducto = {
    asin: String(datos.asin).trim(),
    nombre: String(datos.nombre).trim(),
    categoria: String(datos.categoria),
    precio: Number(datos.precio),
    imagen: String(datos.imagen).trim(),
    rating: Number(datos.rating),
    numResenas: Number(datos.numResenas),
    notaTecnica: String(datos.notaTecnica).trim(),
  };
  if (datos.precioMax) nuevo.precioMax = Number(datos.precioMax);
  if (datos.idealPara) nuevo.idealPara = String(datos.idealPara).trim();
  if (Array.isArray(datos.tags)) nuevo.tags = datos.tags.map(String).filter(Boolean);

  try {
    await agregarProductoEnGitHub(nuevo);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido al guardar." },
      { status: 500 }
    );
  }
}
