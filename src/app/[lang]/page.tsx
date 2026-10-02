import type { Metadata } from "next";
import { getProductos, getEstadisticas } from "@/lib/productos";
import { getDictionary, withLocale, type Locale } from "@/lib/i18n";
import {
  ContainerAnimated,
  ContainerInset,
  ContainerScroll,
  ContainerSticky,
  HeroVideo,
} from "@/components/ui/animated-video-on-scroll";
import StatsGrid from "@/components/StatsGrid";
import BuscadorDeProducto from "@/components/BuscadorDeProducto";
import RankingConFiltros from "@/components/RankingConFiltros";
import ComoArmamosRanking from "@/components/ComoArmamosRanking";
import NewsletterBand from "@/components/NewsletterBand";

const HERO_VIDEO = "/videos/riego-smart.mp4";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.riegocom.uk";

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
      <section className="border-b border-line-dim/40">
        <ContainerScroll className="h-[240vh]">
          <ContainerSticky className="overflow-hidden px-4 pb-10 pt-24 text-text-light sm:px-6">
            <div
              className="blueprint-grid pointer-events-none absolute inset-0"
              aria-hidden="true"
            />
            <ContainerAnimated className="relative mx-auto max-w-3xl text-center">
              <p className="font-mono text-xs uppercase tracking-wide text-line">
                {dict["home.eyebrow"]}
              </p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight text-text-light sm:text-4xl lg:text-5xl">
                {dict["home.heroTitulo"]}
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-text-dim">
                {dict["home.heroDescripcion"]}
              </p>
            </ContainerAnimated>

            <ContainerInset className="relative mx-auto max-h-[420px] w-auto py-6">
              <HeroVideo src={HERO_VIDEO} aria-hidden="true" />
            </ContainerInset>

            <ContainerAnimated
              transition={{ delay: 0.4 }}
              outputRange={[-120, 0]}
              inputRange={[0, 0.7]}
              className="relative mx-auto mt-2 flex w-fit flex-wrap justify-center gap-3"
            >
              <a
                href="#ranking"
                className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-ink shadow-lg shadow-accent/30 transition-opacity hover:opacity-90"
              >
                {dict["home.verRankingDelMes"]}
              </a>
              <a
                href="#metodologia"
                className="rounded-full border border-line-dim bg-ink/70 px-6 py-3 text-sm font-semibold text-text-light transition-colors hover:border-line"
              >
                {dict["home.comoEvaluamos"]}
              </a>
            </ContainerAnimated>
          </ContainerSticky>
        </ContainerScroll>
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
