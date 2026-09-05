import type { MetadataRoute } from "next";
import { CATEGORIAS } from "@/lib/categorias";
import { getArticulos } from "@/lib/contenido";
import { getProductos } from "@/lib/productos";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://riegocom.uk";

/** Emite la URL sin prefijo (es, ruta histórica) y la equivalente /en para
 * cada ruta — así el sitemap cubre ambos locales sin duplicar la lista de
 * rutas a mano. */
function conAmbosLocales(
  path: string,
  resto: Omit<MetadataRoute.Sitemap[number], "url">
): MetadataRoute.Sitemap {
  const rutaEs = path === "/" ? "/" : path;
  const rutaEn = path === "/" ? "/en" : `/en${path}`;
  return [
    { url: `${SITE_URL}${rutaEs}`, ...resto },
    { url: `${SITE_URL}${rutaEn}`, ...resto },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articulos, productos] = await Promise.all([getArticulos(), getProductos()]);

  const paginasEstaticas: MetadataRoute.Sitemap = [
    ...conAmbosLocales("/", { changeFrequency: "monthly", priority: 1 }),
    ...conAmbosLocales("/articulos", { changeFrequency: "monthly", priority: 0.6 }),
    ...conAmbosLocales("/acerca-de", { changeFrequency: "yearly", priority: 0.3 }),
    ...conAmbosLocales("/privacidad", { changeFrequency: "yearly", priority: 0.2 }),
  ];

  const paginasCategoria: MetadataRoute.Sitemap = CATEGORIAS.flatMap((categoria) =>
    conAmbosLocales(`/categorias/${categoria.slug}`, { changeFrequency: "monthly", priority: 0.9 })
  );

  const paginasArticulos: MetadataRoute.Sitemap = articulos.flatMap((articulo) =>
    conAmbosLocales(`/articulos/${articulo.slug}`, {
      lastModified: articulo.fecha,
      changeFrequency: "yearly",
      priority: 0.5,
    })
  );

  const paginasProductos: MetadataRoute.Sitemap = productos.flatMap((producto) =>
    conAmbosLocales(`/productos/${producto.asin}`, {
      lastModified: producto.actualizadoEn,
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );

  return [...paginasEstaticas, ...paginasCategoria, ...paginasArticulos, ...paginasProductos];
}
