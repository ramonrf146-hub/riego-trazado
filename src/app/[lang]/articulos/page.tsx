import type { Metadata } from "next";
import Link from "next/link";
import { getArticulos } from "@/lib/contenido";
import { getCategoriaPorSlug } from "@/lib/categorias";
import { getDictionary, t, withLocale, type Locale } from "@/lib/i18n";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://riegocom.uk";

function normalizarLocale(lang: string): Locale {
  return lang === "en" ? "en" : "es";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = normalizarLocale(lang);
  return {
    title: locale === "en" ? "Guides & articles" : "Guías y artículos",
    description:
      locale === "en"
        ? "Technical guides on automated irrigation: how to choose WiFi controllers, moisture sensors, solenoid valves, and more."
        : "Guías técnicas sobre riego automatizado: cómo elegir controladores WiFi, sensores de humedad, válvulas solenoides y más.",
    alternates: {
      canonical: withLocale("/articulos", locale),
      languages: {
        es: `${SITE_URL}/articulos`,
        en: `${SITE_URL}/en/articulos`,
        "x-default": `${SITE_URL}/articulos`,
      },
    },
  };
}

export default async function ArticulosPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = normalizarLocale(lang);
  const dict = getDictionary(locale);
  const articulos = await getArticulos(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-wide text-accent">{dict["articulos.eyebrow"]}</p>
      <h1 className="mt-2 text-3xl font-semibold text-text-light">
        {dict["articulos.titulo"]}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-text-dim">
        {dict["articulos.descripcion"]}
      </p>

      <ul className="mt-10 divide-y divide-line-dim/30 border-y border-line-dim/40">
        {articulos.map((articulo) => {
          const categoria = articulo.categoria
            ? getCategoriaPorSlug(articulo.categoria)
            : undefined;

          return (
            <li key={articulo.slug} className="py-6">
              <Link href={withLocale(`/articulos/${articulo.slug}`, locale)} className="group block">
                {categoria && (
                  <span className="font-mono text-[11px] uppercase tracking-wide text-line">
                    {t(categoria.nombre, categoria.nombreEn, locale)}
                  </span>
                )}
                <h2 className="mt-1 text-lg font-semibold text-text-light group-hover:text-line">
                  {articulo.titulo}
                </h2>
                <p className="mt-1 text-sm text-text-dim">{articulo.descripcion}</p>
                <time
                  dateTime={articulo.fecha}
                  className="mt-2 block font-mono text-[11px] text-text-dim/70"
                >
                  {articulo.fecha}
                </time>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
