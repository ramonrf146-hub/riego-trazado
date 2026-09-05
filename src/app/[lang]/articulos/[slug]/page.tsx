import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticulos, getArticuloPorSlug } from "@/lib/contenido";
import { getCategoriaPorSlug } from "@/lib/categorias";
import { getProductosPorCategoria } from "@/lib/productos";
import { getDictionary, t, withLocale, type Locale } from "@/lib/i18n";
import GridDeProductos from "@/components/GridDeProductos";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://riegocom.uk";

function normalizarLocale(lang: string): Locale {
  return lang === "en" ? "en" : "es";
}

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
  const articulos = await getArticulos();
  return articulos.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = normalizarLocale(lang);
  const articulo = await getArticuloPorSlug(slug, locale);
  if (!articulo) return {};

  return {
    title: articulo.titulo,
    description: articulo.descripcion,
    alternates: {
      canonical: withLocale(`/articulos/${slug}`, locale),
      languages: {
        es: `${SITE_URL}/articulos/${slug}`,
        en: `${SITE_URL}/en/articulos/${slug}`,
        "x-default": `${SITE_URL}/articulos/${slug}`,
      },
    },
    openGraph: {
      type: "article",
      title: articulo.titulo,
      description: articulo.descripcion,
      publishedTime: articulo.fecha,
    },
  };
}

export default async function ArticuloPage({ params }: Props) {
  const { lang, slug } = await params;
  const locale = normalizarLocale(lang);
  const dict = getDictionary(locale);
  const articulo = await getArticuloPorSlug(slug, locale);
  if (!articulo) notFound();

  const categoria = articulo.categoria ? getCategoriaPorSlug(articulo.categoria) : undefined;
  const productosRelacionados = articulo.categoria
    ? (await getProductosPorCategoria(articulo.categoria)).slice(0, 3)
    : [];

  const articuloJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: articulo.titulo,
    description: articulo.descripcion,
    datePublished: articulo.fecha,
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articuloJsonLd) }}
      />

      <nav className="font-mono text-xs uppercase tracking-wide text-text-dim">
        <Link href={withLocale("/articulos", locale)} className="hover:text-line">
          {dict["nav.guias"]}
        </Link>{" "}
        / {articulo.titulo}
      </nav>

      {categoria && (
        <Link
          href={withLocale(`/categorias/${categoria.slug}`, locale)}
          className="mt-4 inline-block font-mono text-[11px] uppercase tracking-wide text-line hover:underline"
        >
          {t(categoria.nombre, categoria.nombreEn, locale)}
        </Link>
      )}

      <h1 className="mt-2 text-3xl font-semibold text-text-light sm:text-4xl">
        {articulo.titulo}
      </h1>
      <time dateTime={articulo.fecha} className="mt-3 block font-mono text-xs text-text-dim">
        {articulo.fecha}
      </time>

      <div
        className="prose prose-invert prose-headings:font-semibold prose-a:text-line mt-8 max-w-none prose-headings:text-text-light prose-p:text-text-dim prose-li:text-text-dim prose-strong:text-text-light"
        dangerouslySetInnerHTML={{ __html: articulo.contenidoHtml }}
      />

      {productosRelacionados.length > 0 && categoria && (
        <section className="mt-14 border-t border-line-dim/60 pt-10">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-text-light">{dict["articulo.productosRelacionados"]}</h2>
            <Link
              href={withLocale(`/categorias/${categoria.slug}`, locale)}
              className="whitespace-nowrap font-mono text-xs uppercase tracking-wide text-line hover:underline"
            >
              {dict["articulo.verRankingCompleto"]}
            </Link>
          </div>
          <GridDeProductos productos={productosRelacionados} locale={locale} />
        </section>
      )}
    </article>
  );
}
