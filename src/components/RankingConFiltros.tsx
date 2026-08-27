"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Producto } from "@/lib/tipos";
import { CATEGORIAS } from "@/lib/categorias";
import { useComparador } from "@/lib/useComparador";
import ProductCard from "./ProductCard";
import ComparadorModal from "./ComparadorModal";

const PASO_SCROLL = 400; // ancho de tarjeta (380px) + gap (20px) en desktop

function IconoChevron({ direccion }: { direccion: "izquierda" | "derecha" }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {direccion === "izquierda" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  );
}

export default function RankingConFiltros({ productos }: { productos: Producto[] }) {
  const [categoriaActiva, setCategoriaActiva] = useState<string>("todas");
  const sliderRef = useRef<HTMLDivElement>(null);
  const comparador = useComparador();
  const [puedeIzquierda, setPuedeIzquierda] = useState(false);
  const [puedeDerecha, setPuedeDerecha] = useState(false);

  const productosFiltrados = useMemo(() => {
    if (categoriaActiva === "todas") return productos;
    return productos.filter((p) => p.categoria === categoriaActiva);
  }, [productos, categoriaActiva]);

  function actualizarFlechas() {
    const el = sliderRef.current;
    if (!el) return;
    setPuedeIzquierda(el.scrollLeft > 4);
    setPuedeDerecha(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    // Medir en el mismo tick del mount a veces da clientWidth/scrollWidth
    // en 0 o desactualizados (antes de que el layout termine de asentarse).
    // Reintentar en el siguiente frame es la forma confiable de evitarlo.
    actualizarFlechas();
    const raf = requestAnimationFrame(actualizarFlechas);
    const observer = new ResizeObserver(() => actualizarFlechas());
    observer.observe(el);
    window.addEventListener("resize", actualizarFlechas);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", actualizarFlechas);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productosFiltrados]);

  function desplazar(direccion: "izquierda" | "derecha") {
    sliderRef.current?.scrollBy({
      left: direccion === "derecha" ? PASO_SCROLL : -PASO_SCROLL,
      behavior: "smooth",
    });
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filtrar por categoría"
        className="flex flex-wrap gap-2"
      >
        <button
          role="tab"
          aria-selected={categoriaActiva === "todas"}
          onClick={() => setCategoriaActiva("todas")}
          className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
            categoriaActiva === "todas"
              ? "bg-line text-ink"
              : "bg-line-dim/60 text-text-dim hover:text-text-light"
          }`}
        >
          Todas
        </button>
        {CATEGORIAS.map((categoria) => (
          <button
            key={categoria.slug}
            role="tab"
            aria-selected={categoriaActiva === categoria.slug}
            onClick={() => setCategoriaActiva(categoria.slug)}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
              categoriaActiva === categoria.slug
                ? "bg-line text-ink"
                : "bg-line-dim/60 text-text-dim hover:text-text-light"
            }`}
          >
            {categoria.nombre}
          </button>
        ))}
      </div>

      {productosFiltrados.length === 0 ? (
        <p className="mt-8 text-sm text-text-dim">
          Aún no hay productos rankeados en esta categoría.
        </p>
      ) : (
        <>
          <div className="relative mt-6">
            <div
              ref={sliderRef}
              onScroll={actualizarFlechas}
              className="cards-slider flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:gap-5"
            >
              {productosFiltrados.map((producto) => (
                <div
                  key={producto.asin}
                  className="w-[85vw] max-w-sm shrink-0 snap-start sm:w-[380px]"
                >
                  <ProductCard
                    producto={producto}
                    comparando={comparador.estaSeleccionado(producto)}
                    comparadorBloqueado={comparador.estaBloqueado(producto)}
                    onToggleComparar={() => comparador.toggleSeleccion(producto)}
                  />
                </div>
              ))}
            </div>

            {puedeIzquierda && (
              <button
                type="button"
                onClick={() => desplazar("izquierda")}
                aria-label="Ver producto anterior"
                className="absolute left-0 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-line-dim bg-ink p-2.5 text-text-light shadow-lg transition-colors hover:border-line hover:text-line sm:flex"
              >
                <IconoChevron direccion="izquierda" />
              </button>
            )}
            {puedeDerecha && (
              <button
                type="button"
                onClick={() => desplazar("derecha")}
                aria-label="Ver producto siguiente"
                className="absolute right-0 top-1/2 hidden translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-line-dim bg-ink p-2.5 text-text-light shadow-lg transition-colors hover:border-line hover:text-line sm:flex"
              >
                <IconoChevron direccion="derecha" />
              </button>
            )}
          </div>
          <p className="mt-1 text-center text-xs text-text-dim/70 sm:hidden">
            Deslizá para ver el siguiente →
          </p>
        </>
      )}

      {comparador.seleccionados.length >= 2 && !comparador.modalAbierto && (
        <div className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full border border-line-dim bg-ink-2 py-2 pl-4 pr-2 shadow-xl">
          <span className="text-sm text-text-light">
            {comparador.seleccionados.length} seleccionados
          </span>
          <button
            type="button"
            onClick={() => comparador.setModalAbierto(true)}
            className="rounded-full bg-accent-2 px-4 py-2 text-xs font-bold text-ink transition-opacity hover:opacity-90"
          >
            Comparar
          </button>
          <button
            type="button"
            onClick={comparador.limpiar}
            aria-label="Cancelar comparación"
            className="flex h-8 w-8 items-center justify-center rounded-full text-text-dim hover:text-text-light"
          >
            ✕
          </button>
        </div>
      )}

      {comparador.modalAbierto && (
        <ComparadorModal productos={comparador.seleccionados} onCerrar={comparador.limpiar} />
      )}
    </div>
  );
}
