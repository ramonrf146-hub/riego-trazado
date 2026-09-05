import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CATEGORIAS, getCategoriaPorSlug } from "@/lib/categorias";
import { getProductosPorCategoria } from "@/lib/productos";
import { getDictionary, t, withLocale, type Locale } from "@/lib/i18n";
import GridDeProductos from "@/components/GridDeProductos";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://riegocom.uk";

function normalizarLocale(lang: string): Locale {
  return lang === "en" ? "en" : "es";
}

interface Props {
  params: Promise<{ lang: string; categoria: string }>;
}

export function generateStaticParams() {
  return CATEGORIAS.map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, categoria: slug } = await params;
  const locale = normalizarLocale(lang);
  const categoria = getCategoriaPorSlug(slug);
  if (!categoria) return {};

  const nombre = t(categoria.nombre, categoria.nombreEn, locale);
  const descripcion = t(categoria.descripcion, categoria.descripcionEn, locale);

  return {
    title: locale === "en" ? `${nombre} Ranking` : `Ranking de ${nombre}`,
    description:
      locale === "en"
        ? `Monthly ranking of ${nombre.toLowerCase()} for automated irrigation: ${descripcion}`
        : `Ranking mensual de ${nombre.toLowerCase()} para riego automatizado: ${descripcion}`,
    alternates: {
      canonical: withLocale(`/categorias/${categoria.slug}`, locale),
      languages: {
        es: `${SITE_URL}/categorias/${categoria.slug}`,
        en: `${SITE_URL}/en/categorias/${categoria.slug}`,
        "x-default": `${SITE_URL}/categorias/${categoria.slug}`,
      },
    },
  };
}

export default async function CategoriaPage({ params }: Props) {
  const { lang, categoria: slug } = await params;
  const locale = normalizarLocale(lang);
  const dict = getDictionary(locale);
  const categoria = getCategoriaPorSlug(slug);
  if (!categoria) notFound();

  const nombre = t(categoria.nombre, categoria.nombreEn, locale);
  const descripcion = t(categoria.descripcion, categoria.descripcionEn, locale);
  const productos = await getProductosPorCategoria(categoria.slug);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${locale === "en" ? `${nombre} Ranking` : `Ranking de ${nombre}`} — HidroLab`,
    itemListElement: productos.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: t(p.nombre, p.nombreEn, locale),
        sku: p.asin,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: p.rating,
          reviewCount: p.numResenas,
        },
        offers:
          p.precioMax && p.precioMax > p.precio
            ? {
                "@type": "AggregateOffer",
                lowPrice: p.precio,
                highPrice: p.precioMax,
                priceCurrency: p.moneda,
                url: p.urlAfiliado,
              }
            : {
                "@type": "Offer",
                price: p.precio,
                priceCurrency: p.moneda,
                url: p.urlAfiliado,
              },
      },
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <nav className="font-mono text-xs uppercase tracking-wide text-text-dim">
        <Link href={withLocale("/", locale)} className="hover:text-line">
          {dict["nav.inicio"]}
        </Link>{" "}
        / {nombre}
      </nav>

      <p className="mt-4 font-mono text-xs uppercase tracking-wide text-accent">
        {dict["categoria.rankingDelMes"]}
      </p>
      <h1 className="mt-2 text-3xl font-semibold text-text-light">
        {nombre}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-dim">
        {descripcion}
      </p>

      {productos.length === 0 ? (
        <p className="mt-10 text-sm text-text-dim">
          {dict["categoria.sinProductos"]}
        </p>
      ) : (
        <GridDeProductos productos={productos} locale={locale} />
      )}
    </div>
  );
}
