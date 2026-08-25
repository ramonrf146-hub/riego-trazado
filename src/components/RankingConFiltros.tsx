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
        className="flex flex-wrap gap-2 border-b border-line-dim/40 pb-6"
      >
        <button
          role="tab"
          aria-selected={categoriaActiva === "todas"}
          onClick={() => setCategoriaActiva("todas")}
          className={`rounded-sm border px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
            categoriaActiva === "todas"
              ? "border-accent bg-accent text-ink"
              : "border-line-dim text-text-dim hover:border-line hover:text-line"
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
            className={`rounded-sm border px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
              categoriaActiva === categoria.slug
                ? "border-accent bg-accent text-ink"
                : "border-line-dim text-text-dim hover:border-line hover:text-line"
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
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {productosFiltrados.map((producto) => (
            <ProductCard key={producto.asin} producto={producto} />
          ))}
        </div>
      )}
    </div>
  );
}
