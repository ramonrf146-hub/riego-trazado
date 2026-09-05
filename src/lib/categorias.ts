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
    nombreEn: "WiFi Controllers",
    descripcionEn: "The system's brain: schedules and triggers irrigation by zone from an app.",
  },
  {
    slug: "sensores-humedad",
    nombre: "Sensores de humedad",
    descripcion: "Miden la humedad real del suelo para regar solo cuando hace falta.",
    nombreEn: "Moisture Sensors",
    descripcionEn: "Measure actual soil moisture so you only water when it's really needed.",
  },
  {
    slug: "valvulas-solenoides",
    nombre: "Válvulas solenoides",
    descripcion: "Abren y cierran el paso de agua por zona bajo orden del controlador.",
    nombreEn: "Solenoid Valves",
    descripcionEn: "Open and close water flow per zone on the controller's command.",
  },
  {
    slug: "kits-goteo",
    nombre: "Kits de goteo",
    descripcion: "Distribución de agua de baja presión directa a la raíz de la planta.",
    nombreEn: "Drip Kits",
    descripcionEn: "Low-pressure water distribution delivered straight to the plant's roots.",
  },
  {
    slug: "modulos-rele",
    nombre: "Módulos de relé/automatización DIY",
    descripcion: "Piezas de automatización para proyectos de riego hechos a medida.",
    nombreEn: "Relay & DIY Automation Modules",
    descripcionEn: "Automation building blocks for custom-built irrigation projects.",
  },
  {
    slug: "bombas",
    nombre: "Bombas",
    descripcion: "Presurizan el sistema cuando no hay presión de red suficiente.",
    nombreEn: "Pumps",
    descripcionEn: "Pressurize the system when mains water pressure isn't enough.",
  },
];

export function getCategoriaPorSlug(slug: string): Categoria | undefined {
  return CATEGORIAS.find((c) => c.slug === slug);
}
