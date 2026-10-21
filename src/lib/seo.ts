/**
 * Utilidades de SEO on-page. Los <title> y las meta description largos se
 * truncan en los resultados de Google (~60 y ~155 caracteres), así que se
 * acortan aquí en vez de depender del texto editorial completo.
 */

/** Nombre corto de producto para el <title>: corta en " — " / " - ", quita el paréntesis final y no parte palabras. */
export function tituloCorto(nombre: string, max = 48): string {
  const base = nombre
    .split(/\s[—–-]\s/)[0]
    .replace(/\s*\([^)]*\)\s*$/, "")
    .trim();
  if (base.length <= max) return base;
  const corte = base.slice(0, max);
  const espacio = corte.lastIndexOf(" ");
  return (espacio > 20 ? corte.slice(0, espacio) : corte).trim();
}

/** Recorta una descripción a `max` caracteres: prefiere terminar en punto y, si no, en palabra con "…". */
export function recortar(texto: string, max = 155): string {
  const limpio = texto.replace(/\s+/g, " ").trim();
  if (limpio.length <= max) return limpio;
  const ventana = limpio.slice(0, max);
  const punto = Math.max(ventana.lastIndexOf(". "), ventana.lastIndexOf("? "), ventana.lastIndexOf("! "));
  if (punto >= 90) return ventana.slice(0, punto + 1);
  const espacio = ventana.lastIndexOf(" ");
  return `${ventana.slice(0, espacio > 60 ? espacio : max - 1).replace(/[,;:\s]+$/, "")}…`;
}
