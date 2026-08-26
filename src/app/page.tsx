import type { Metadata } from "next";
import { getProductos, getEstadisticas } from "@/lib/productos";
import HeroDiagrama from "@/components/HeroDiagrama";
import StatsGrid from "@/components/StatsGrid";
import RankingConFiltros from "@/components/RankingConFiltros";
import ComoArmamosRanking from "@/components/ComoArmamosRanking";
import NewsletterBand from "@/components/NewsletterBand";

export const metadata: Metadata = {
  description:
    "Ranking mensual con criterio técnico de controladores WiFi, sensores de humedad, válvulas solenoides, kits de goteo, módulos de relé y bombas para riego automatizado.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
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
              Riego automatizado, evaluado como ingeniería
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-text-light sm:text-4xl lg:text-5xl">
              El ranking mensual de riego inteligente que sí revisa las
              especificaciones
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-text-dim">
              Controladores WiFi, sensores de humedad, válvulas solenoides,
              kits de goteo, módulos de relé y bombas — rankeados con datos
              de venta reales y notas técnicas editoriales, no solo
              popularidad.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#ranking"
                className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-ink shadow-lg shadow-accent/30 transition-opacity hover:opacity-90"
              >
                Ver ranking del mes
              </a>
              <a
                href="#metodologia"
                className="rounded-full border border-line-dim px-6 py-3 text-sm font-semibold text-text-light transition-colors hover:border-line"
              >
                Cómo evaluamos
              </a>
            </div>
          </div>

          <HeroDiagrama />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <StatsGrid
          totalProductos={estadisticas.totalProductos}
          ultimaActualizacion={estadisticas.ultimaActualizacion}
        />
      </section>

      <section id="ranking" className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-wide text-accent">
          Ranking del mes
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-text-light sm:text-3xl">
          Los más vendidos, filtrados por categoría
        </h2>
        <p className="mt-6 max-w-2xl text-sm text-text-dim">
          Precios referenciales al momento de la última actualización. El
          precio real y la disponibilidad se confirman siempre en Amazon.
        </p>

        <div className="mt-8">
          <RankingConFiltros productos={productos} />
        </div>
      </section>

      <div id="metodologia">
        <ComoArmamosRanking />
      </div>

      <NewsletterBand />
    </>
  );
}
