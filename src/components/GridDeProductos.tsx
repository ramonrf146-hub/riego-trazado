"use client";

import type { Producto } from "@/lib/tipos";
import { useComparador } from "@/lib/useComparador";
import ProductCard from "./ProductCard";
import ComparadorModal from "./ComparadorModal";

/**
 * Grid estático de productos (usado en páginas de categoría, ya
 * filtradas de antemano) con la misma capacidad de comparación que el
 * slider de la home.
 */
export default function GridDeProductos({ productos }: { productos: Producto[] }) {
  const comparador = useComparador();

  return (
    <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {productos.map((producto) => (
        <ProductCard
          key={producto.asin}
          producto={producto}
          comparando={comparador.estaSeleccionado(producto)}
          comparadorBloqueado={comparador.estaBloqueado(producto)}
          onToggleComparar={() => comparador.toggleSeleccion(producto)}
        />
      ))}

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
