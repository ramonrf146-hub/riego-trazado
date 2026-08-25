import type { Categoria } from "./tipos";

/**
 * Lista fija de categorías del sitio. Cambiar aquí se propaga a filtros,
 * páginas de categoría y navegación.
 */
export const CATEGORIAS: Categoria[] = [
  {
    slug: "controladores-wifi",
    nombre: "Controladores WiFi",
    descripcion: "Cerebro del sistema: programan y disparan el riego por zona desde una app.",
  },
  {
    slug: "sensores-humedad",
    nombre: "Sensores de humedad",
    descripcion: "Miden la humedad real del suelo para regar solo cuando hace falta.",
  },
  {
    slug: "valvulas-solenoides",
    nombre: "Válvulas solenoides",
    descripcion: "Abren y cierran el paso de agua por zona bajo orden del controlador.",
  },
  {
    slug: "kits-goteo",
    nombre: "Kits de goteo",
    descripcion: "Distribución de agua de baja presión directa a la raíz de la planta.",
  },
  {
    slug: "modulos-rele",
    nombre: "Módulos de relé/automatización DIY",
    descripcion: "Piezas de automatización para proyectos de riego hechos a medida.",
  },
  {
    slug: "bombas",
    nombre: "Bombas",
    descripcion: "Presurizan el sistema cuando no hay presión de red suficiente.",
  },
];

export function getCategoriaPorSlug(slug: string): Categoria | undefined {
  return CATEGORIAS.find((c) => c.slug === slug);
}
