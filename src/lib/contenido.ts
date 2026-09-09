import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import type {
  Articulo,
  ArticuloFrontmatter,
  FaqItem,
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

/**
 * Extrae los pares pregunta/respuesta de la sección "## Preguntas frecuentes"
 * (o "## Frequently asked questions") de un artículo, para armar el schema
 * FAQPage. Depende del formato consistente `**Pregunta?**\nRespuesta.` que
 * usamos en todos los artículos — si un artículo no sigue ese formato exacto,
 * simplemente no aporta FAQs al schema (no rompe nada).
 */
function extraerFaqs(markdown: string): FaqItem[] {
  const normalizado = markdown.replace(/\r\n/g, "\n");
  const marcador = /##\s*(Preguntas frecuentes|Frequently asked questions)\s*\n([\s\S]*)$/i;
  const match = normalizado.match(marcador);
  if (!match) return [];

  const bloque = match[2].split(/\n##\s+/)[0];
  const items: FaqItem[] = [];
  const regexItem = /\*\*(.+?)\*\*\n([^\n]+(?:\n(?!\n)[^\n]+)*)/g;
  let m: RegExpExecArray | null;
  while ((m = regexItem.exec(bloque))) {
    items.push({ pregunta: m[1].trim(), respuesta: m[2].trim().replace(/\n/g, " ") });
  }
  return items;
}

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
  const faqs = extraerFaqs(content);

  return {
    slug,
    contenidoHtml,
    faqs,
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
