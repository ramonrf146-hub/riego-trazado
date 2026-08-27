"use client";

import { useState } from "react";
import type { Producto } from "./tipos";

const MAX_COMPARADOS = 3;

/**
 * Maneja la selección de productos para comparar. Solo permite comparar
 * dentro de la misma categoría (comparar un enchufe con un VFD no ayuda a
 * elegir nada) — seleccionar un producto de otra categoría reinicia la
 * selección con ese producto nuevo.
 */
export function useComparador() {
  const [seleccionados, setSeleccionados] = useState<Producto[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);

  function toggleSeleccion(producto: Producto) {
    setSeleccionados((prev) => {
      const yaEsta = prev.some((p) => p.asin === producto.asin);
      if (yaEsta) return prev.filter((p) => p.asin !== producto.asin);
      if (prev.length > 0 && prev[0].categoria !== producto.categoria) {
        return [producto];
      }
      if (prev.length >= MAX_COMPARADOS) return prev;
      return [...prev, producto];
    });
  }

  function limpiar() {
    setSeleccionados([]);
    setModalAbierto(false);
  }

  function estaSeleccionado(producto: Producto) {
    return seleccionados.some((p) => p.asin === producto.asin);
  }

  function estaBloqueado(producto: Producto) {
    return (
      seleccionados.length > 0 &&
      seleccionados[0].categoria !== producto.categoria &&
      !estaSeleccionado(producto)
    );
  }

  return {
    seleccionados,
    modalAbierto,
    setModalAbierto,
    toggleSeleccion,
    limpiar,
    estaSeleccionado,
    estaBloqueado,
    maxAlcanzado: seleccionados.length >= MAX_COMPARADOS,
  };
}
