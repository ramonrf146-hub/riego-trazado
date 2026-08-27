"use client";

import { useEffect } from "react";
import type { Producto } from "@/lib/tipos";

function IconoCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10l4 4 8-8" stroke="var(--accent-2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconoCerrar() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Insignias calculadas a partir de datos reales del catálogo (precio,
 * rating, reseñas) — nunca texto inventado. Solo se otorgan cuando hay
 * una diferencia real entre los productos comparados.
 */
function calcularInsignias(productos: Producto[]): Record<string, string[]> {
  const insignias: Record<string, string[]> = {};
  for (const p of productos) insignias[p.asin] = [];
  if (productos.length < 2) return insignias;

  const precios = productos.map((p) => p.precio);
  const ratings = productos.map((p) => p.rating);
  const resenas = productos.map((p) => p.numResenas);

  const precioMin = Math.min(...precios);
  const ratingMax = Math.max(...ratings);
  const resenasMax = Math.max(...resenas);

  const empatePrecio = precios.filter((v) => v === precioMin).length === productos.length;
  const empateRating = ratings.filter((v) => v === ratingMax).length === productos.length;
  const empateResenas = resenas.filter((v) => v === resenasMax).length === productos.length;

  productos.forEach((p) => {
    if (!empatePrecio && p.precio === precioMin) insignias[p.asin].push("💰 Precio más bajo");
    if (!empateRating && p.rating === ratingMax) insignias[p.asin].push("⭐ Mejor valorado");
    if (!empateResenas && p.numResenas === resenasMax && p.numResenas > 0) {
      insignias[p.asin].push("🏆 Más reseñado");
    }
  });

  return insignias;
}

export default function ComparadorModal({
  productos,
  onCerrar,
}: {
  productos: Producto[];
  onCerrar: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const todasLasTags = Array.from(
    new Set(productos.flatMap((p) => p.tags ?? []))
  );
  const insignias = calcularInsignias(productos);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Comparar productos"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6"
    >
      <div className="flex max-h-[92vh] w-full flex-col rounded-t-3xl bg-ink-2 sm:max-w-4xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-line-dim/40 px-5 py-4">
          <h2 className="text-lg font-bold text-text-light">
            Comparando {productos.length} producto{productos.length > 1 ? "s" : ""}
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar comparación"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line-dim text-text-dim transition-colors hover:border-line hover:text-line"
          >
            <IconoCerrar />
          </button>
        </div>

        <div className="overflow-x-auto overflow-y-auto p-5">
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${productos.length}, minmax(220px, 1fr))` }}
          >
            {productos.map((producto) => (
              <div key={producto.asin} className="flex flex-col gap-3">
                <div className="flex h-32 items-center justify-center rounded-xl bg-image-bg p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={producto.imagen} alt={producto.nombre} className="h-full w-full object-contain" />
                </div>
                <h3 className="text-sm font-bold leading-snug text-text-light">{producto.nombre}</h3>
                <p className="text-base font-bold text-text-light">
                  ${producto.precio.toFixed(2)}
                  {producto.precioMax && producto.precioMax > producto.precio && (
                    <span className="text-text-dim"> — ${producto.precioMax.toFixed(2)}</span>
                  )}
                </p>
                <p className="text-xs text-text-dim">
                  {producto.numResenas > 0
                    ? `${producto.rating.toFixed(1)} ★ · ${producto.numResenas.toLocaleString("es")} reseñas`
                    : "Sin reseñas todavía"}
                </p>

                {insignias[producto.asin]?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {insignias[producto.asin].map((insignia) => (
                      <span
                        key={insignia}
                        className="rounded-full bg-accent-2/15 px-2 py-1 text-[11px] font-semibold text-accent-2"
                      >
                        {insignia}
                      </span>
                    ))}
                  </div>
                )}

                {producto.idealPara && (
                  <p className="rounded-lg bg-line-dim/40 px-2.5 py-2 text-xs leading-snug text-text-light">
                    <span className="font-semibold text-text-dim">Ideal para: </span>
                    {producto.idealPara}
                  </p>
                )}

                {producto.notaTecnica && (
                  <p className="text-xs leading-relaxed text-text-dim">{producto.notaTecnica}</p>
                )}
              </div>
            ))}
          </div>

          {todasLasTags.length > 0 && (
            <div className="mt-6 border-t border-line-dim/40 pt-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-dim">
                Especificaciones
              </p>
              <div className="space-y-1">
                {todasLasTags.map((tag) => (
                  <div
                    key={tag}
                    className="grid items-center gap-4 border-b border-line-dim/20 py-2"
                    style={{ gridTemplateColumns: `180px repeat(${productos.length}, minmax(220px, 1fr))` }}
                  >
                    <span className="text-xs text-text-dim">{tag}</span>
                    {productos.map((producto) => (
                      <span key={producto.asin} className="flex items-center">
                        {producto.tags?.includes(tag) ? (
                          <IconoCheck />
                        ) : (
                          <span className="text-text-dim/40">—</span>
                        )}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            className="mt-6 grid gap-4 border-t border-line-dim/40 pt-4"
            style={{ gridTemplateColumns: `repeat(${productos.length}, minmax(220px, 1fr))` }}
          >
            {productos.map((producto) => (
              <a
                key={producto.asin}
                href={producto.urlAfiliado}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className="flex items-center justify-center rounded-xl bg-accent px-3 py-3 text-center text-sm font-bold text-ink transition-opacity hover:opacity-90"
              >
                Ver en Amazon
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
