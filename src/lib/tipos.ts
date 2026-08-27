export type CategoriaSlug =
  | "controladores-wifi"
  | "sensores-humedad"
  | "valvulas-solenoides"
  | "kits-goteo"
  | "modulos-rele"
  | "bombas";

export interface Categoria {
  slug: CategoriaSlug;
  nombre: string;
  descripcion: string;
}

/**
 * Guía de compra en lenguaje simple (sin jerga) para la página de
 * detalle del producto. Distinta de `notaTecnica`: esa es corta y para
 * el comparador; esto es contenido educativo más largo.
 */
export interface GuiaCompra {
  queEsYParaQueSirve: string;
  ejemploHogar: string;
  ejemploNegocio: string;
  puntosClave: [string, string, string];
  consejoInversion: string;
}

export interface Producto {
  asin: string;
  nombre: string;
  categoria: CategoriaSlug;
  precio: number;
  /** Opcional: si el producto tiene variantes/vendedores en rangos de precio distintos, define el techo del rango ("Desde $precio - $precioMax"). */
  precioMax?: number;
  moneda: string;
  imagen: string;
  rating: number;
  numResenas: number;
  ranking: number;
  /** Contenido editorial escrito a mano. Nunca se sobrescribe automáticamente. */
  notaTecnica: string;
  /** Una línea editorial: a qué tipo de comprador/situación le conviene este producto. Se usa en el comparador. */
  idealPara?: string;
  /** Contenido educativo largo (qué es, ejemplos, guía de compra, consejo) para /productos/[asin]. Opcional. */
  guiaCompra?: GuiaCompra;
  /** Etiquetas cortas (protocolo, voltaje, forma factor) para las píldoras técnicas de la tarjeta. Opcional. */
  tags?: string[];
  urlAfiliado: string;
  actualizadoEn: string;
  /** false = el enlace queda pausado: no se muestra en el sitio pero se conserva en el catálogo. Default true si se omite. */
  activo?: boolean;
}

export interface ArticuloFrontmatter {
  titulo: string;
  fecha: string;
  descripcion: string;
  categoria?: CategoriaSlug;
}

export interface Articulo extends ArticuloFrontmatter {
  slug: string;
  contenidoHtml: string;
}

export interface PaginaFrontmatter {
  titulo: string;
  descripcion: string;
  actualizado: string;
}

export interface Pagina extends PaginaFrontmatter {
  slug: string;
  contenidoHtml: string;
}
