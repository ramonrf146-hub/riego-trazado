import type { Metadata } from "next";
import { getProductos, getEstadisticas } from "@/lib/productos";
import { getDictionary, withLocale, type Locale } from "@/lib/i18n";
import HeroDiagrama from "@/components/HeroDiagrama";
import StatsGrid from "@/components/StatsGrid";
import BuscadorDeProducto from "@/components/BuscadorDeProducto";
import RankingConFiltros from "@/components/RankingConFiltros";
import ComoArmamosRanking from "@/components/ComoArmamosRanking";
import NewsletterBand from "@/components/NewsletterBand";

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
    description:
      locale === "en"
        ? "A monthly technical ranking of WiFi controllers, moisture sensors, solenoid valves, drip kits, relay modules, and pumps for automated irrigation."
        : "Ranking mensual con criterio técnico de controladores WiFi, sensores de humedad, válvulas solenoides, kits de goteo, módulos de relé y bombas para riego automatizado.",
    alternates: {
      canonical: withLocale("/", locale),
      languages: {
        es: `${SITE_URL}/`,
        en: `${SITE_URL}/en`,
        "x-default": `${SITE_URL}/`,
      },
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = normalizarLocale(lang);
  const dict = getDictionary(locale);
  const [productos, estadisticas] = await Promise.all([
    getProductos(),
    getEstadisticas(),
  ]);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line-dim/40">
        <div className="blueprint-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-line">
              {dict["home.eyebrow"]}
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-text-light sm:text-4xl lg:text-5xl">
              {dict["home.heroTitulo"]}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-text-dim">
              {dict["home.heroDescripcion"]}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#ranking"
                className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-ink shadow-lg shadow-accent/30 transition-opacity hover:opacity-90"
              >
                {dict["home.verRankingDelMes"]}
              </a>
              <a
                href="#metodologia"
                className="rounded-full border border-line-dim px-6 py-3 text-sm font-semibold text-text-light transition-colors hover:border-line"
              >
                {dict["home.comoEvaluamos"]}
              </a>
            </div>
          </div>

          <HeroDiagrama locale={locale} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <StatsGrid
          totalProductos={estadisticas.totalProductos}
          ultimaActualizacion={estadisticas.ultimaActualizacion}
          locale={locale}
        />
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-4 sm:px-6">
        <BuscadorDeProducto productos={productos} locale={locale} />
      </section>

      <section id="ranking" className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-wide text-accent">
          {dict["home.rankingEyebrow"]}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-text-light sm:text-3xl">
          {dict["home.rankingTitulo"]}
        </h2>
        <p className="mt-6 max-w-2xl text-sm text-text-dim">
          {dict["home.rankingNota"]}
        </p>

        <div className="mt-8">
          <RankingConFiltros productos={productos} locale={locale} />
        </div>
      </section>

      <div id="metodologia">
        <ComoArmamosRanking locale={locale} />
      </div>

      <NewsletterBand locale={locale} />
    </>
  );
}
