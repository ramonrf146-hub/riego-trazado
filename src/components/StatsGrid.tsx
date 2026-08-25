import { CATEGORIAS } from "@/lib/categorias";

function formatearFecha(fecha: string | null) {
  if (!fecha) return "—";
  const [anio, mes] = fecha.split("-");
  const meses = [
    "ene", "feb", "mar", "abr", "may", "jun",
    "jul", "ago", "sep", "oct", "nov", "dic",
  ];
  return `${meses[Number(mes) - 1]} ${anio}`;
}

export default function StatsGrid({
  totalProductos,
  ultimaActualizacion,
}: {
  totalProductos: number;
  ultimaActualizacion: string | null;
}) {
  const stats = [
    { etiqueta: "Productos evaluados", valor: String(totalProductos) },
    { etiqueta: "Categorías cubiertas", valor: String(CATEGORIAS.length) },
    { etiqueta: "Actualización", valor: "Mensual" },
    { etiqueta: "Último corte", valor: formatearFecha(ultimaActualizacion) },
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
