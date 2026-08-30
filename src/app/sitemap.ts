import type { MetadataRoute } from "next";
import { CATEGORIAS } from "@/lib/categorias";
import { getArticulos } from "@/lib/contenido";
import { getProductos } from "@/lib/productos";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://riegocom.uk";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articulos, productos] = await Promise.all([getArticulos(), getProductos()]);

  const paginasEstaticas: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/articulos`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/acerca-de`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privacidad`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const paginasCategoria: MetadataRoute.Sitemap = CATEGORIAS.map((categoria) => ({
    url: `${SITE_URL}/categorias/${categoria.slug}`,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const paginasArticulos: MetadataRoute.Sitemap = articulos.map((articulo) => ({
    url: `${SITE_URL}/articulos/${articulo.slug}`,
    lastModified: articulo.fecha,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  const paginasProductos: MetadataRoute.Sitemap = productos.map((producto) => ({
    url: `${SITE_URL}/productos/${producto.asin}`,
    lastModified: producto.actualizadoEn,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...paginasEstaticas, ...paginasCategoria, ...paginasArticulos, ...paginasProductos];
}
