import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPagina } from "@/lib/contenido";
import { withLocale, type Locale } from "@/lib/i18n";

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
  const pagina = await getPagina("privacidad", locale);
  if (!pagina) return {};

  return {
    title: pagina.titulo,
    description: pagina.descripcion,
    alternates: {
      canonical: withLocale("/privacidad", locale),
      languages: {
        es: `${SITE_URL}/privacidad`,
        en: `${SITE_URL}/en/privacidad`,
        "x-default": `${SITE_URL}/privacidad`,
      },
    },
  };
}

export default async function PrivacidadPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = normalizarLocale(lang);
  const pagina = await getPagina("privacidad", locale);
  if (!pagina) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-text-light">{pagina.titulo}</h1>
      <div
        className="prose prose-invert prose-headings:font-semibold prose-a:text-line mt-8 max-w-none prose-headings:text-text-light prose-p:text-text-dim prose-li:text-text-dim prose-strong:text-text-light"
        dangerouslySetInnerHTML={{ __html: pagina.contenidoHtml }}
      />
    </div>
  );
}
