import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategoriaPorSlug } from "@/lib/categorias";
import { getProductos, getProductoPorAsin } from "@/lib/productos";
import { getDictionary, t, withLocale, type Locale } from "@/lib/i18n";
import GlosarioDeCampo from "@/components/GlosarioDeCampo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://riegocom.uk";

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
          }
        : {
            "@type": "Offer",
            price: producto.precio,
            priceCurrency: producto.moneda,
            url: producto.urlAfiliado,
          },
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productoJsonLd) }}
      />

      <nav className="font-mono text-xs uppercase tracking-wide text-text-dim">
        <Link href={withLocale("/", locale)} className="hover:text-line">
          {dict["nav.inicio"]}
        </Link>{" "}
        {categoria && (
          <>
            /{" "}
            <Link href={withLocale(`/categorias/${categoria.slug}`, locale)} className="hover:text-line">
              {t(categoria.nombre, categoria.nombreEn, locale)}
            </Link>{" "}
          </>
        )}
        / {dict["producto.guiaDeCompra"]}
      </nav>

      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="flex h-48 w-full items-center justify-center rounded-2xl bg-image-bg p-4 sm:h-40 sm:w-40 sm:shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={producto.imagen} alt={nombre} className="h-full w-full object-contain" />
        </div>
        <div>
          <h1 className="text-2xl font-bold leading-snug text-text-light sm:text-3xl">
            {nombre}
          </h1>
          <p className="mt-2 text-xs text-text-dim">
            {producto.numResenas > 0
              ? `${producto.rating.toFixed(1)} ★ · ${producto.numResenas.toLocaleString(locale)} ${dict["producto.resenas"]}`
              : dict["producto.sinResenas"]}
          </p>
          <p className="mt-2 text-xl font-bold text-text-light">
            {producto.precioMax && producto.precioMax > producto.precio
              ? `${dict["producto.desde"]} $${producto.precio.toFixed(2)}`
              : `$${producto.precio.toFixed(2)}`}
            <span className="ml-2 align-middle text-[11px] font-normal text-text-dim">
              {dict["producto.precioReferencial"]}
            </span>
          </p>
          <a
            href={producto.urlAfiliado}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center rounded-2xl bg-accent px-5 py-3 text-sm font-bold text-ink shadow-lg shadow-accent/30 transition-transform active:scale-[0.98]"
          >
            {dict["producto.verEnAmazon"]}
          </a>
        </div>
      </div>

      {guia ? (
        <div className="mt-10 space-y-8 border-t border-line-dim/40 pt-8">
          <section>
            <h2 className="text-lg font-bold text-text-light">{dict["producto.queEsYParaQueSirve"]}</h2>
            <p className="mt-2 text-sm leading-relaxed text-text-dim">{guia.queEsYParaQueSirve}</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-light">{dict["producto.ejemplosPracticos"]}</h2>
            <ul className="mt-2 space-y-2 text-sm leading-relaxed text-text-dim">
              <li>
                <span className="font-semibold text-text-light">{dict["producto.enCasa"]}</span>
                {guia.ejemploHogar}
              </li>
              <li>
                <span className="font-semibold text-text-light">{dict["producto.enNegocio"]}</span>
                {guia.ejemploNegocio}
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-light">{dict["producto.guiaParaNoEquivocarte"]}</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text-dim">
              {guia.puntosClave.map((punto) => (
                <li key={punto}>{punto}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl bg-line-dim/40 p-5">
            <h2 className="text-lg font-bold text-text-light">{dict["producto.consejoDeInversion"]}</h2>
            <p className="mt-2 text-sm leading-relaxed text-text-light">{guia.consejoInversion}</p>
          </section>
        </div>
      ) : (
        notaTecnica && (
          <p className="mt-10 border-t border-line-dim/40 pt-8 text-sm leading-relaxed text-text-dim">
            {notaTecnica}
          </p>
        )
      )}

      <a
        href={producto.urlAfiliado}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        className="mt-10 flex items-center justify-center rounded-2xl bg-accent px-5 py-4 text-base font-bold text-ink shadow-lg shadow-accent/30 transition-transform active:scale-[0.98]"
      >
        {dict["producto.verPrecioActual"]}
      </a>

      <GlosarioDeCampo producto={producto} locale={locale} />
    </div>
  );
}
