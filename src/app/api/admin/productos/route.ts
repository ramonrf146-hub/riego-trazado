import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

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
