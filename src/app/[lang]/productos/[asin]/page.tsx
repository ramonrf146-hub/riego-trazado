import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategoriaPorSlug } from "@/lib/categorias";
import { getProductos, getProductoPorAsin, getProductosPorCategoria } from "@/lib/productos";
import { getDictionary, t, withLocale, type Locale } from "@/lib/i18n";
import GlosarioDeCampo from "@/components/GlosarioDeCampo";
import ImagenConZoom from "@/components/ImagenConZoom";
import BotonAfiliado from "@/components/BotonAfiliado";
import BarraCtaFija from "@/components/BarraCtaFija";
import Estrellas from "@/components/Estrellas";
import ProductCard from "@/components/ProductCard";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.riegocom.uk";

function normalizarLocale(lang: string): Locale {
  return lang === "en" ? "en" : "es";
}

interface Props {
  params: Promise<{ lang: string; asin: string }>;
}

export async function generateStaticParams() {
  const productos = await getProductos();
  return productos.map((p) => ({ asin: p.asin }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, asin } = await params;
  const locale = normalizarLocale(lang);
  const producto = await getProductoPorAsin(asin);
  if (!producto) return {};

  const nombre = t(producto.nombre, producto.nombreEn, locale);
  const guia = locale === "en" && producto.guiaCompraEn ? producto.guiaCompraEn : producto.guiaCompra;
  const notaTecnica = t(producto.notaTecnica, producto.notaTecnicaEn, locale);

  return {
    title: locale === "en" ? `${nombre} — Buying Guide` : `${nombre} — Guía de compra`,
    description: guia?.queEsYParaQueSirve ?? notaTecnica,
    alternates: {
      canonical: withLocale(`/productos/${producto.asin}`, locale),
      languages: {
        es: `${SITE_URL}/productos/${producto.asin}`,
        en: `${SITE_URL}/en/productos/${producto.asin}`,
        "x-default": `${SITE_URL}/productos/${producto.asin}`,
      },
    },
    openGraph: {
      type: "website",
      title: nombre,
      description: guia?.queEsYParaQueSirve ?? notaTecnica,
      images: producto.imagen ? [producto.imagen] : undefined,
    },
  };
}

export default async function ProductoPage({ params }: Props) {
  const { lang, asin } = await params;
  const locale = normalizarLocale(lang);
  const dict = getDictionary(locale);
  const producto = await getProductoPorAsin(asin);
  if (!producto) notFound();

  const categoria = getCategoriaPorSlug(producto.categoria);
  const nombre = t(producto.nombre, producto.nombreEn, locale);
  const notaTecnica = t(producto.notaTecnica, producto.notaTecnicaEn, locale);
  const guia = locale === "en" && producto.guiaCompraEn ? producto.guiaCompraEn : producto.guiaCompra;
  const idealPara = t(producto.idealPara ?? "", producto.idealParaEn, locale);
  const tags = locale === "en" && producto.tagsEn ? producto.tagsEn : producto.tags;
  const nombreCategoria = categoria ? t(categoria.nombre, categoria.nombreEn, locale) : "";
  const tieneRango = producto.precioMax !== undefined && producto.precioMax > producto.precio;
  const precioTexto = tieneRango
    ? `${dict["producto.desde"]} $${producto.precio.toFixed(2)}`
    : `$${producto.precio.toFixed(2)}`;
  const similares = (await getProductosPorCategoria(producto.categoria))
    .filter((p) => p.asin !== producto.asin)
    .slice(0, 3);
  const quitarDosPuntos = (texto: string) => texto.replace(/:\s*$/, "");

  const productoJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: nombre,
    sku: producto.asin,
    image: producto.imagen,
    description: guia?.queEsYParaQueSirve ?? notaTecnica,
    ...(producto.numResenas > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: producto.rating,
        reviewCount: producto.numResenas,
      },
    }),
    offers:
      producto.precioMax && producto.precioMax > producto.precio
        ? {
            "@type": "AggregateOffer",
            lowPrice: producto.precio,
            highPrice: producto.precioMax,
            priceCurrency: producto.moneda,
            url: producto.urlAfiliado,
            availability: "https://schema.org/InStock",
          }
        : {
            "@type": "Offer",
            price: producto.precio,
            priceCurrency: producto.moneda,
            url: producto.urlAfiliado,
            availability: "https://schema.org/InStock",
          },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: dict["nav.inicio"], item: `${SITE_URL}${withLocale("/", locale)}` },
      ...(categoria
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: t(categoria.nombre, categoria.nombreEn, locale),
              item: `${SITE_URL}${withLocale(`/categorias/${categoria.slug}`, locale)}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: categoria ? 3 : 2,
        name: nombre,
        item: `${SITE_URL}${withLocale(`/productos/${producto.asin}`, locale)}`,
      },
    ],
  };


  return (
    <div className="mx-auto max-w-5xl px-4 pb-28 pt-10 sm:px-6 md:pb-14 md:pt-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productoJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <nav className="font-mono text-xs uppercase tracking-wide text-text-dim">
        <Link href={withLocale("/", locale)} className="hover:text-line">
          {dict["nav.inicio"]}
        </Link>{" "}
        {categoria && (
          <>
            /{" "}
            <Link href={withLocale(`/categorias/${categoria.slug}`, locale)} className="hover:text-line">
              {nombreCategoria}
            </Link>{" "}
          </>
        )}
        / {dict["producto.guiaDeCompra"]}
      </nav>

      <section className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-12">
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-3 z-40 rounded-full bg-ink px-3 py-1 text-xs font-extrabold text-text-light shadow-md ring-1 ring-line-dim">
            #{producto.ranking}
            {categoria && ` ${dict["producto.enCategoria"]} ${nombreCategoria}`}
          </span>
          <ImagenConZoom
            src={producto.imagen}
            alt={nombre}
            contenedorClassName="h-72 w-full border border-line-dim sm:h-96"
          />
        </div>

        <div className="flex flex-col">
          {categoria && (
            <Link
              href={withLocale(`/categorias/${categoria.slug}`, locale)}
              className="w-fit rounded-full bg-paper px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide text-line hover:bg-paper-dim"
            >
              {nombreCategoria}
            </Link>
          )}
          <h1 className="mt-3 text-2xl font-bold leading-snug text-text-light sm:text-3xl">{nombre}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
            {producto.numResenas > 0 ? (
              <>
                <Estrellas rating={producto.rating} />
                <span className="text-sm font-bold text-text-light">{producto.rating.toFixed(1)}</span>
                <span className="text-sm text-text-dim">
                  ({producto.numResenas.toLocaleString(locale)} {dict["producto.resenas"]})
                </span>
              </>
            ) : (
              <span className="text-sm text-text-dim">{dict["producto.sinResenas"]}</span>
            )}
          </div>

          <p className="mt-5 text-3xl font-extrabold text-text-light">
            {precioTexto}
            {tieneRango && <span className="text-text-dim"> — ${producto.precioMax!.toFixed(2)}</span>}
            <span className="ml-2 align-middle text-xs font-normal text-text-dim">
              {dict["producto.precioReferencial"]}
            </span>
          </p>

          <BotonAfiliado
            id="cta-principal"
            producto={producto}
            etiqueta={dict["producto.verEnAmazon"]}
            className="mt-5 w-full sm:w-auto sm:self-start"
          />

          {idealPara && (
            <div className="mt-6 rounded-2xl border border-paper-dim bg-paper/60 p-4">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-wide text-line">
                {dict["producto.idealPara"]}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-text-light">{idealPara}</p>
            </div>
          )}

          {tags && tags.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-md bg-line-dim px-2.5 py-1 text-xs font-medium text-text-light"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <div className="mx-auto mt-14 max-w-3xl">
        {guia ? (
          <div className="space-y-10">
            <section>
              <h2 className="text-xl font-bold text-text-light">{dict["producto.queEsYParaQueSirve"]}</h2>
              <p className="mt-3 text-base leading-relaxed text-text-dim">{guia.queEsYParaQueSirve}</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-light">{dict["producto.ejemplosPracticos"]}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-line-dim bg-ink-2 p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper text-line">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 11.5 12 4l9 7.5" />
                      <path d="M5 10v9h14v-9" />
                    </svg>
                  </span>
                  <h3 className="mt-3 text-sm font-bold text-text-light">{quitarDosPuntos(dict["producto.enCasa"])}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-text-dim">{guia.ejemploHogar}</p>
                </div>
                <div className="rounded-2xl border border-line-dim bg-ink-2 p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper text-line">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="7" width="18" height="13" rx="2" />
                      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                  </span>
                  <h3 className="mt-3 text-sm font-bold text-text-light">{quitarDosPuntos(dict["producto.enNegocio"])}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-text-dim">{guia.ejemploNegocio}</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-light">{dict["producto.guiaParaNoEquivocarte"]}</h2>
              <ul className="mt-4 space-y-3">
                {guia.puntosClave.map((punto) => (
                  <li key={punto} className="flex gap-3 rounded-2xl border border-line-dim bg-ink-2 p-4">
                    <svg className="mt-0.5 shrink-0 text-accent-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" />
                      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
                    </svg>
                    <span className="text-sm leading-relaxed text-text-dim">{punto}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="flex gap-4 rounded-2xl border border-paper-dim bg-paper/60 p-5">
              <svg className="mt-0.5 shrink-0 text-line" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 18h6" />
                <path d="M10 21h4" />
                <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z" />
              </svg>
              <div>
                <h2 className="text-base font-bold text-text-light">{dict["producto.consejoDeInversion"]}</h2>
                <p className="mt-1 text-sm leading-relaxed text-text-light">{guia.consejoInversion}</p>
              </div>
            </section>
          </div>
        ) : (
          notaTecnica && <p className="text-base leading-relaxed text-text-dim">{notaTecnica}</p>
        )}

        <div className="mt-10 rounded-3xl border border-line-dim bg-ink-2 p-6 text-center">
          <p className="text-sm font-semibold text-text-light">{nombre}</p>
          <p className="mt-1 text-2xl font-extrabold text-text-light">
            {precioTexto}
            <span className="ml-2 align-middle text-xs font-normal text-text-dim">
              {dict["producto.precioReferencial"]}
            </span>
          </p>
          <BotonAfiliado
            id="cta-final"
            producto={producto}
            etiqueta={dict["producto.verPrecioActual"]}
            className="mt-4 w-full sm:w-auto"
          />
        </div>

        <GlosarioDeCampo producto={producto} locale={locale} />
      </div>

      {similares.length > 0 && (
        <section className="mt-16 border-t border-line-dim/60 pt-10">
          <h2 className="text-xl font-bold text-text-light">{dict["producto.productosSimilares"]}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similares.map((p) => (
              <ProductCard key={p.asin} producto={p} locale={locale} />
            ))}
          </div>
          {categoria && (
            <Link
              href={withLocale(`/categorias/${categoria.slug}`, locale)}
              className="mt-6 inline-block text-sm font-semibold text-line hover:underline"
            >
              {dict["producto.verRankingCategoria"]} {nombreCategoria} →
            </Link>
          )}
        </section>
      )}

      <BarraCtaFija
        producto={producto}
        nombre={nombre}
        precioTexto={precioTexto}
        etiqueta={dict["producto.verEnAmazon"]}
        idBotonPrincipal="cta-principal"
        idBotonFinal="cta-final"
      />
    </div>
  );
}
