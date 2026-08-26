"use client";

import type { Producto } from "@/lib/tipos";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const CTAS_AFILIADO = [
  "Ver disponibilidad en Amazon",
  "Ver precio actual en Amazon",
  "Revisar en Amazon",
];

/** Registra en GA4 cada clic a un enlace de afiliado — sin esto, la
 * analítica solo ve vistas de página, nunca si alguien realmente
 * hizo clic hacia Amazon. */
function registrarClicAfiliado(producto: Producto) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "click_afiliado", {
      asin: producto.asin,
      nombre_producto: producto.nombre,
      categoria: producto.categoria,
      valor: producto.precio,
      moneda: producto.moneda,
    });
  }
}

function IconoFlecha() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function IconoEstrella({ llena, mitad }: { llena?: boolean; mitad?: boolean }) {
  return (
    <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true">
      <defs>
        <linearGradient id="mediaEstrella">
          <stop offset="50%" stopColor="var(--accent)" />
          <stop offset="50%" stopColor="var(--line-dim)" />
        </linearGradient>
      </defs>
      <path
        d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6z"
        fill={mitad ? "url(#mediaEstrella)" : llena ? "var(--accent)" : "var(--line-dim)"}
      />
    </svg>
  );
}

export default function ProductCard({ producto }: { producto: Producto }) {
  const llenas = Math.floor(producto.rating);
  const mitad = producto.rating - llenas >= 0.5;
  const cta = CTAS_AFILIADO[producto.ranking % CTAS_AFILIADO.length];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-line-dim/60 bg-ink-2 shadow-xl shadow-black/20">
      <div className="relative flex h-56 items-center justify-center bg-image-bg p-5 sm:h-64">
        <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-ink text-base font-extrabold text-text-light shadow-lg shadow-black/30">
          #{producto.ranking}
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={producto.imagen}
          alt={producto.nombre}
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <h3 className="text-lg font-bold leading-snug text-text-light sm:text-xl">
          {producto.nombre}
        </h3>

        {producto.tags && producto.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {producto.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-line-dim px-2.5 py-1 text-xs font-medium text-text-light"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <IconoEstrella key={i} llena={i < llenas} mitad={i === llenas && mitad} />
            ))}
          </div>
          <span className="text-xs text-text-dim">
            {producto.numResenas > 0
              ? `${producto.rating.toFixed(1)} · ${producto.numResenas.toLocaleString("es")} reseñas`
              : "Sin reseñas todavía"}
          </span>
        </div>

        {producto.notaTecnica && (
          <p className="flex-1 text-sm leading-relaxed text-text-dim">
            {producto.notaTecnica}
          </p>
        )}

        <div className="mt-auto space-y-3">
          <p className="text-lg font-bold text-text-light">
            {producto.precioMax && producto.precioMax > producto.precio ? (
              <>
                Desde ${producto.precio.toFixed(2)}{" "}
                <span className="text-text-dim">— ${producto.precioMax.toFixed(2)}</span>
              </>
            ) : (
              `$${producto.precio.toFixed(2)}`
            )}
            <span className="ml-2 align-middle text-[11px] font-normal text-text-dim">
              precio referencial
            </span>
          </p>

          <a
            href={producto.urlAfiliado}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            onClick={() => registrarClicAfiliado(producto)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-4 text-base font-bold text-ink shadow-lg shadow-accent/30 transition-transform active:scale-[0.98]"
          >
            {cta}
            <IconoFlecha />
          </a>
        </div>
      </div>
    </article>
  );
}
