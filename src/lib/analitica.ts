import type { Producto } from "@/lib/tipos";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Registra en GA4 cada clic a un enlace de afiliado — sin esto, la
 * analítica solo ve vistas de página, nunca si alguien realmente
 * hizo clic hacia Amazon. */
export function registrarClicAfiliado(producto: Producto) {
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
