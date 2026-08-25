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

const DIR_ARTICULOS = path.join(process.cwd(), "content", "articulos");
const DIR_PAGINAS = path.join(process.cwd(), "content", "paginas");

async function markdownAHtml(markdown: string): Promise<string> {
  const resultado = await remark().use(remarkHtml).process(markdown);
  return resultado.toString();
}

export async function getArticulos(): Promise<Articulo[]> {
  const archivos = fs
    .readdirSync(DIR_ARTICULOS)
    .filter((archivo) => archivo.endsWith(".md"));

  const articulos = await Promise.all(
    archivos.map(async (archivo) => {
      const slug = archivo.replace(/\.md$/, "");
      return getArticuloPorSlug(slug);
    })
  );

  return articulos
    .filter((a): a is Articulo => Boolean(a))
    .sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
}

export async function getArticuloPorSlug(slug: string): Promise<Articulo | null> {
  const rutaArchivo = path.join(DIR_ARTICULOS, `${slug}.md`);
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

export async function getPagina(slug: string): Promise<Pagina | null> {
  const rutaArchivo = path.join(DIR_PAGINAS, `${slug}.md`);
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
