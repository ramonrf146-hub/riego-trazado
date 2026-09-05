import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import type {
  Articulo,
  ArticuloFrontmatter,
  Pagina,
  PaginaFrontmatter,
} from "./tipos";
import type { Locale } from "./i18n";

const DIRS_ARTICULOS: Record<Locale, string> = {
  es: path.join(process.cwd(), "content", "articulos"),
  en: path.join(process.cwd(), "content", "articulos-en"),
};

const DIRS_PAGINAS: Record<Locale, string> = {
  es: path.join(process.cwd(), "content", "paginas"),
  en: path.join(process.cwd(), "content", "paginas-en"),
};

async function markdownAHtml(markdown: string): Promise<string> {
  // sanitize:false permite HTML crudo (embeds de YouTube) en los .md —
  // seguro acá porque el contenido lo escribimos nosotros, no es
  // input de usuarios.
  const resultado = await remark().use(remarkHtml, { sanitize: false }).process(markdown);
  return resultado.toString();
}

export async function getArticulos(locale: Locale = "es"): Promise<Articulo[]> {
  const dirArticulos = DIRS_ARTICULOS[locale];
  const archivos = fs
    .readdirSync(dirArticulos)
    .filter((archivo) => archivo.endsWith(".md"));

  const articulos = await Promise.all(
    archivos.map(async (archivo) => {
      const slug = archivo.replace(/\.md$/, "");
      return getArticuloPorSlug(slug, locale);
    })
  );

  return articulos
    .filter((a): a is Articulo => Boolean(a))
    .sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
}

export async function getArticuloPorSlug(
  slug: string,
  locale: Locale = "es"
): Promise<Articulo | null> {
  const rutaArchivo = path.join(DIRS_ARTICULOS[locale], `${slug}.md`);
  if (!fs.existsSync(rutaArchivo)) return null;

  const raw = fs.readFileSync(rutaArchivo, "utf-8");
  const { data, content } = matter(raw);
  const contenidoHtml = await markdownAHtml(content);

  return {
    slug,
    contenidoHtml,
    ...(data as ArticuloFrontmatter),
  };
}

export async function getPagina(slug: string, locale: Locale = "es"): Promise<Pagina | null> {
  const rutaArchivo = path.join(DIRS_PAGINAS[locale], `${slug}.md`);
  if (!fs.existsSync(rutaArchivo)) return null;

  const raw = fs.readFileSync(rutaArchivo, "utf-8");
  const { data, content } = matter(raw);
  const contenidoHtml = await markdownAHtml(content);

  return {
    slug,
    contenidoHtml,
    ...(data as PaginaFrontmatter),
  };
}
