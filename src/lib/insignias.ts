import type { Producto } from "./tipos";

export interface InsigniasCatalogo {
  masVendido: Set<string>;
  mejorValorado: Set<string>;
}

const MINIMO_RESENAS_PARA_VALORACION = 10;

/**
 * Calcula "más vendido" (más reseñas) y "mejor valorado" (rating más
 * alto, con un piso de reseñas para no premiar un 5.0 con 2 reseñas)
 * por categoría — nunca comparando entre categorías distintas. Solo
 * se otorga si hay una diferencia real, nunca en caso de empate.
 */
export function calcularInsigniasCatalogo(productos: Producto[]): InsigniasCatalogo {
  const porCategoria = new Map<string, Producto[]>();
  for (const p of productos) {
    if (!porCategoria.has(p.categoria)) porCategoria.set(p.categoria, []);
    porCategoria.get(p.categoria)!.push(p);
  }

  const masVendido = new Set<string>();
  const mejorValorado = new Set<string>();

  for (const lista of porCategoria.values()) {
    if (lista.length < 2) continue;

    const maxResenas = Math.max(...lista.map((p) => p.numResenas));
    if (maxResenas > 0) {
      const ganadores = lista.filter((p) => p.numResenas === maxResenas);
      if (ganadores.length < lista.length) {
        for (const p of ganadores) masVendido.add(p.asin);
      }
    }

    const elegibles = lista.filter((p) => p.numResenas >= MINIMO_RESENAS_PARA_VALORACION);
    if (elegibles.length >= 2) {
      const maxRating = Math.max(...elegibles.map((p) => p.rating));
      const ganadores = elegibles.filter((p) => p.rating === maxRating);
      if (ganadores.length < elegibles.length) {
        for (const p of ganadores) mejorValorado.add(p.asin);
      }
    }
  }

  return { masVendido, mejorValorado };
}
