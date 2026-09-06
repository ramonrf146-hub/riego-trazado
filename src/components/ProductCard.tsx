"use client";

import Link from "next/link";
import type { Producto } from "@/lib/tipos";
import { getDictionary, t, withLocale, type Locale } from "@/lib/i18n";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

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

interface ProductCardProps {
  producto: Producto;
  locale: Locale;
  comparando?: boolean;
  comparadorBloqueado?: boolean;
  onToggleComparar?: () => void;
  masVendido?: boolean;
  mejorValorado?: boolean;
}

export default function ProductCard({
  producto,
  locale,
  comparando = false,
  comparadorBloqueado = false,
  onToggleComparar,
  masVendido = false,
  mejorValorado = false,
}: ProductCardProps) {
  const dict = getDictionary(locale);
  const nombre = t(producto.nombre, producto.nombreEn, locale);
  const ctasAfiliado = [
    dict["producto.verDisponibilidad"],
    dict["producto.verPrecioActual"],
    dict["producto.revisarEnAmazon"],
  ];
  const llenas = Math.floor(producto.rating);
  const mitad = producto.rating - llenas >= 0.5;
  const cta = ctasAfiliado[producto.ranking % ctasAfiliado.length];
  const tags = producto.tagsEn && locale === "en" ? producto.tagsEn : producto.tags;
  const notaTecnica = t(producto.notaTecnica, producto.notaTecnicaEn, locale);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line-dim/60 bg-ink-2 shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-line/10">
      <div className="relative flex h-36 items-center justify-center overflow-hidden bg-image-bg p-3 sm:h-40">
        <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm font-extrabold text-text-light shadow-lg shadow-black/30">
          #{producto.ranking}
        </span>
        {(masVendido || mejorValorado) && (
          <div className="absolute right-3 top-3 flex flex-col items-end gap-1">
            {masVendido && (
              <span className="rounded-full bg-accent-2 px-2 py-0.5 text-[10px] font-bold text-ink shadow-lg shadow-black/30">
                {dict["producto.masVendido"]}
              </span>
            )}
            {mejorValorado && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-ink shadow-lg shadow-black/30">
                {dict["producto.mejorValorado"]}
              </span>
            )}
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={producto.imagen}
          alt={nombre}
          loading="lazy"
          className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <h3 className="text-base font-bold leading-snug text-text-light transition-colors duration-300 group-hover:text-line">
          {nombre}
        </h3>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-line-dim px-2 py-0.5 text-[11px] font-medium text-text-light"
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
              ? `${producto.rating.toFixed(1)} · ${producto.numResenas.toLocaleString(locale)} ${dict["producto.resenas"]}`
              : dict["producto.sinResenas"]}
          </span>
        </div>

        {onToggleComparar && (
          <label
            className={`flex items-center gap-2 text-xs ${
              comparadorBloqueado ? "cursor-not-allowed text-text-dim/40" : "cursor-pointer text-text-dim"
            }`}
          >
            <input
              type="checkbox"
              checked={comparando}
              disabled={comparadorBloqueado}
              onChange={onToggleComparar}
              className="h-4 w-4 rounded border-line-dim accent-[var(--accent-2)]"
            />
            {dict["producto.compararEste"]}
          </label>
        )}

        {notaTecnica && (
          <p className="line-clamp-4 flex-1 text-xs leading-relaxed text-text-dim">
            {notaTecnica}
          </p>
        )}

        <div className="mt-auto space-y-2">
          <p className="text-base font-bold text-text-light">
            {producto.precioMax && producto.precioMax > producto.precio ? (
              <>
                {dict["producto.desde"]} ${producto.precio.toFixed(2)}{" "}
                <span className="text-text-dim">— ${producto.precioMax.toFixed(2)}</span>
              </>
            ) : (
              `$${producto.precio.toFixed(2)}`
            )}
            <span className="ml-2 align-middle text-[11px] font-normal text-text-dim">
              {dict["producto.precioReferencial"]}
            </span>
          </p>

          <a
            href={producto.urlAfiliado}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            onClick={() => registrarClicAfiliado(producto)}
            className="flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-bold text-ink shadow-lg shadow-accent/30 transition-transform active:scale-[0.98]"
          >
            {cta}
            <IconoFlecha />
          </a>

          {producto.guiaCompra && (
            <Link
              href={withLocale(`/productos/${producto.asin}`, locale)}
              className="block text-center text-xs font-semibold text-text-dim underline-offset-2 hover:text-text-light hover:underline"
            >
              {dict["producto.verGuiaCompra"]}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
