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
