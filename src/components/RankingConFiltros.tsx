"use client";

import { useMemo, useState } from "react";
import type { Producto } from "@/lib/tipos";
import { CATEGORIAS } from "@/lib/categorias";
import ProductCard from "./ProductCard";

export default function RankingConFiltros({ productos }: { productos: Producto[] }) {
  const [categoriaActiva, setCategoriaActiva] = useState<string>("todas");

  const productosFiltrados = useMemo(() => {
    if (categoriaActiva === "todas") return productos;
    return productos.filter((p) => p.categoria === categoriaActiva);
  }, [productos, categoriaActiva]);

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
          <div className="cards-slider mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:gap-5">
            {productosFiltrados.map((producto) => (
              <div
                key={producto.asin}
                className="w-[85vw] max-w-sm shrink-0 snap-start sm:w-[380px]"
              >
                <ProductCard producto={producto} />
              </div>
            ))}
          </div>
          <p className="mt-1 text-center text-xs text-text-dim/70 sm:hidden">
            Deslizá para ver el siguiente →
          </p>
        </>
      )}
    </div>
  );
}
