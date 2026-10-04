const ESTRELLA =
  "M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6z";

function Fila({ color }: { color: string }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 20 20" aria-hidden="true" className="shrink-0">
          <path d={ESTRELLA} fill={color} />
        </svg>
      ))}
    </span>
  );
}

/** Estrellas con relleno proporcional al rating (4.3 llena el 86% de la fila). */
export default function Estrellas({ rating }: { rating: number }) {
  const porcentaje = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <span className="relative inline-block" aria-hidden="true">
      <Fila color="var(--line-dim)" />
      <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${porcentaje}%` }}>
        <Fila color="var(--accent)" />
      </span>
    </span>
  );
}
