import { CATEGORIAS } from "@/lib/categorias";
import { getDictionary, type Locale } from "@/lib/i18n";

const MESES: Record<Locale, string[]> = {
  es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

function formatearFecha(fecha: string | null, locale: Locale) {
  if (!fecha) return "—";
  const [anio, mes] = fecha.split("-");
  return `${MESES[locale][Number(mes) - 1]} ${anio}`;
}

export default function StatsGrid({
  totalProductos,
  ultimaActualizacion,
  locale,
}: {
  totalProductos: number;
  ultimaActualizacion: string | null;
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const stats = [
    { etiqueta: dict["stats.productosEvaluados"], valor: String(totalProductos) },
    { etiqueta: dict["stats.categoriasCubiertas"], valor: String(CATEGORIAS.length) },
    { etiqueta: dict["stats.actualizacion"], valor: dict["stats.mensual"] },
    { etiqueta: dict["stats.ultimoCorte"], valor: formatearFecha(ultimaActualizacion, locale) },
  ];

  return (
    <dl className="grid grid-cols-2 divide-y divide-line-dim/30 border border-line-dim/40 sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
      {stats.map((stat) => (
        <div key={stat.etiqueta} className="px-4 py-5 text-center sm:text-left">
          <dt className="font-mono text-[11px] uppercase tracking-wide text-text-dim">
            {stat.etiqueta}
          </dt>
          <dd className="mt-1 font-mono text-2xl font-semibold text-line">
            {stat.valor}
          </dd>
        </div>
      ))}
    </dl>
  );
}
