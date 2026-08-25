import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { CategoriaSlug, Producto } from "./tipos";

const RUTA_PRODUCTOS = path.join(process.cwd(), "data", "productos.json");

/**
 * Capa de acceso a datos de producto. Hoy lee `/data/productos.json` en
 * el repositorio. El día que el catálogo migre a Firebase/Firestore, solo
 * hay que cambiar la implementación de esta función — los componentes que
 * consumen `getProductos()` no deberían cambiar.
 */
export async function getProductos(): Promise<Producto[]> {
  const raw = fs.readFileSync(RUTA_PRODUCTOS, "utf-8");
  const productos = JSON.parse(raw) as Producto[];
  return productos
    .filter((p) => p.activo !== false)
    .sort((a, b) => a.ranking - b.ranking);
}

export async function getProductosPorCategoria(
  categoria: CategoriaSlug
): Promise<Producto[]> {
  const productos = await getProductos();
  return productos
    .filter((p) => p.categoria === categoria)
    .sort((a, b) => a.ranking - b.ranking);
}

export async function getProductoPorAsin(asin: string): Promise<Producto | undefined> {
  const productos = await getProductos();
  return productos.find((p) => p.asin === asin);
}

export async function getEstadisticas() {
  const productos = await getProductos();
  const categorias = new Set(productos.map((p) => p.categoria));
  const ultimaActualizacion = productos.reduce<string | null>((max, p) => {
    if (!max || p.actualizadoEn > max) return p.actualizadoEn;
    return max;
  }, null);

  return {
    totalProductos: productos.length,
    totalCategorias: categorias.size,
    ultimaActualizacion,
  };
}
