import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CATEGORIAS, getCategoriaPorSlug } from "@/lib/categorias";
import { getProductosPorCategoria } from "@/lib/productos";
import { getArticulos } from "@/lib/contenido";
import { getDictionary, t, withLocale, type Locale } from "@/lib/i18n";
import GridDeProductos from "@/components/GridDeProductos";
import { CONTENIDO_CATEGORIAS } from "@/lib/categorias-seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.riegocom.uk";

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
    title:
      locale === "en"
        ? `${nombre}: ranking and buying guide`
        : `${nombre}: ranking y guía de compra`,
    description:
      locale === "en"
        ? `Monthly ranking of ${nombre.toLowerCase()} for automated irrigation, with how to choose and common questions. ${descripcion}`
        : `Ranking mensual de ${nombre.toLowerCase()} para riego automatizado, con cómo elegir y preguntas frecuentes. ${descripcion}`,
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
  const guias = (await getArticulos(locale)).filter((a) => a.categoria === categoria.slug);

  const contenido = CONTENIDO_CATEGORIAS[categoria.slug]?.[locale];
  const precios = productos.map((p) => p.precio).filter((n) => n > 0);
  const resumenPrecios =
    precios.length > 0
      ? locale === "en"
        ? `${productos.length} products compared, from $${Math.min(...precios).toFixed(2)} to $${Math.max(...precios).toFixed(2)}.`
        : `${productos.length} productos comparados, desde $${Math.min(...precios).toFixed(2)} hasta $${Math.max(...precios).toFixed(2)}.`
      : null;

  const faqJsonLd = contenido
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: contenido.faq.map((item) => ({
          "@type": "Question",
          name: item.pregunta,
          acceptedAnswer: { "@type": "Answer", text: item.respuesta },
        })),
      }
    : null;

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${locale === "en" ? `${nombre} Ranking` : `Ranking de ${nombre}`} — HidroLab`,
    itemListElement: productos.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}${withLocale(`/productos/${p.asin}`, locale)}`,
      name: t(p.nombre, p.nombreEn, locale),
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

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
        {resumenPrecios && <> {resumenPrecios}</>}
      </p>

      {productos.length === 0 ? (
        <p className="mt-10 text-sm text-text-dim">
          {dict["categoria.sinProductos"]}
        </p>
      ) : (
        <GridDeProductos productos={productos} locale={locale} />
      )}

      {guias.length > 0 && (
        <section className="mx-auto mt-14 max-w-3xl">
          <h2 className="text-xl font-bold text-text-light">{dict["categoria.guias"]}</h2>
          <ul className="mt-4 space-y-3">
            {guias.map((g) => (
              <li key={g.slug}>
                <Link
                  href={withLocale(`/articulos/${g.slug}`, locale)}
                  className="block rounded-2xl border border-line-dim bg-ink-2 p-4 transition-colors hover:border-line"
                >
                  <span className="text-sm font-semibold text-text-light">{g.titulo}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-text-dim">{g.descripcion}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {contenido && (
        <div className="mx-auto mt-14 max-w-3xl space-y-10">
          <section>
            <h2 className="text-xl font-bold text-text-light">{dict["categoria.comoElegir"]}</h2>
            <ul className="mt-4 space-y-3">
              {contenido.comoElegir.map((punto) => (
                <li key={punto} className="rounded-2xl border border-line-dim bg-ink-2 p-4 text-sm leading-relaxed text-text-dim">
                  {punto}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text-light">{dict["producto.faq"]}</h2>
            <div className="mt-4 divide-y divide-line-dim rounded-2xl border border-line-dim bg-ink-2">
              {contenido.faq.map((item) => (
                <details key={item.pregunta} className="group p-4">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-text-light marker:hidden">
                    {item.pregunta}
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-text-dim">{item.respuesta}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
