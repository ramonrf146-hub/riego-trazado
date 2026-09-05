export type Locale = "es" | "en";

export const LOCALES: Locale[] = ["es", "en"];

/** Español es siempre el fallback: nunca renderizamos un campo vacío por
 * falta de traducción, aunque el objetivo es traducir todo el contenido. */
export function t(es: string, en: string | undefined, locale: Locale): string {
  return locale === "en" && en ? en : es;
}

/** Antepone /en a una ruta interna cuando el locale es inglés. El
 * español nunca lleva prefijo (son las URLs históricas del sitio). */
export function withLocale(path: string, locale: Locale): string {
  if (locale === "es") return path;
  return path === "/" ? "/en" : `/en${path}`;
}

type Dictionary = {
  [K in keyof typeof es]: string;
};

const es = {
  "nav.categorias": "Categorías",
  "nav.guias": "Guías",
  "nav.guiasYArticulos": "Guías y artículos",
  "nav.verRanking": "Ver ranking",
  "nav.abrirMenu": "Abrir menú",
  "nav.cerrarMenu": "Cerrar menú",
  "nav.inicio": "Inicio",

  "lang.es": "ES",
  "lang.en": "EN",
  "lang.switchAria": "Cambiar idioma",

  "home.eyebrow": "Riego automatizado, evaluado como ingeniería",
  "home.heroTitulo":
    "El ranking mensual de riego inteligente que sí revisa las especificaciones",
  "home.heroDescripcion":
    "Controladores WiFi, sensores de humedad, válvulas solenoides, kits de goteo, módulos de relé y bombas — rankeados con datos de venta reales y notas técnicas editoriales, no solo popularidad.",
  "home.verRankingDelMes": "Ver ranking del mes",
  "home.comoEvaluamos": "Cómo evaluamos",
  "home.rankingEyebrow": "Ranking del mes",
  "home.rankingTitulo": "Los más vendidos, filtrados por categoría",
  "home.rankingNota":
    "Precios referenciales al momento de la última actualización. El precio real y la disponibilidad se confirman siempre en Amazon.",
  "home.heroDiagramaAlt":
    "Diagrama de un sistema de riego automatizado: Alexa y una app envían comandos a un controlador WiFi central, que muestra un dashboard, recibe telemetría de sensores, y controla una válvula solenoide por señal de 24V AC hasta el aspersor",

  "buscador.eyebrow": "Buscador rápido",
  "buscador.titulo": "¿Qué producto te conviene?",
  "buscador.descripcion": "Dos clics y te decimos cuál del ranking se ajusta mejor a tu caso.",
  "buscador.resultadoIntro": "Según lo que elegiste, este es el que más te conviene:",
  "buscador.precioReferencial": "precio referencial",
  "buscador.verGuiaCompleta": "Ver guía completa",
  "buscador.empezarDeNuevo": "Empezar de nuevo",
  "buscador.elegirOpcion": "Elegí la opción que más se parece a tu situación:",
  "buscador.volver": "← Volver",

  "ranking.todas": "Todas",
  "ranking.sinProductos": "Aún no hay productos rankeados en esta categoría.",
  "ranking.verProductoAnterior": "Ver producto anterior",
  "ranking.verProductoSiguiente": "Ver producto siguiente",
  "ranking.deslizar": "Deslizá para ver el siguiente →",
  "ranking.seleccionados": "seleccionados",
  "ranking.comparar": "Comparar",
  "ranking.cancelarComparacion": "Cancelar comparación",

  "producto.masVendido": "🏆 Más vendido",
  "producto.mejorValorado": "⭐ Mejor valorado",
  "producto.sinResenas": "Sin reseñas todavía",
  "producto.resenas": "reseñas",
  "producto.compararEste": "Comparar este producto",
  "producto.precioReferencial": "precio referencial",
  "producto.desde": "Desde",
  "producto.verGuiaCompra": "Ver guía de compra completa",
  "producto.verEnAmazon": "Ver en Amazon",
  "producto.verPrecioActual": "Ver precio actual en Amazon",
  "producto.verDisponibilidad": "Ver disponibilidad en Amazon",
  "producto.revisarEnAmazon": "Revisar en Amazon",
  "producto.guiaDeCompra": "Guía de compra",
  "producto.queEsYParaQueSirve": "¿Qué es y para qué sirve?",
  "producto.ejemplosPracticos": "Ejemplos prácticos de uso",
  "producto.enCasa": "En casa: ",
  "producto.enNegocio": "En un negocio o taller: ",
  "producto.guiaParaNoEquivocarte": "Guía para no equivocarte al comprar",
  "producto.consejoDeInversion": "El consejo de inversión",

  "comparador.comparando": "Comparando",
  "comparador.producto": "producto",
  "comparador.cerrarComparacion": "Cerrar comparación",
  "comparador.precioMasBajo": "💰 Precio más bajo",
  "comparador.mejorValorado": "⭐ Mejor valorado",
  "comparador.masResenado": "🏆 Más reseñado",
  "comparador.idealPara": "Ideal para: ",
  "comparador.especificaciones": "Especificaciones",

  "metodologia.eyebrow": "Metodología",
  "metodologia.titulo": "Cómo armamos el ranking",

  "stats.productosEvaluados": "Productos evaluados",
  "stats.categoriasCubiertas": "Categorías cubiertas",
  "stats.actualizacion": "Actualización",
  "stats.mensual": "Mensual",
  "stats.ultimoCorte": "Último corte",

  "newsletter.eyebrow": "Para el día a día en el jardín y el taller",
  "newsletter.titulo": "El inglés técnico de riego que necesitás, en una sola hoja",
  "newsletter.emailLabel": "Correo electrónico",
  "newsletter.emailPlaceholder": "tu@correo.com",
  "newsletter.boton": "Quiero la hoja de referencia",
  "newsletter.enviadoMensaje": "Listo, ya es tuya.",
  "newsletter.abrirHoja": "Abrir hoja de referencia",

  "glosario.eyebrow": "Glosario de campo",
  "glosario.titulo": "Términos en inglés que vas a escuchar con este equipo",
  "glosario.descripcion":
    "Para que puedas usar el vocabulario correcto frente a un cliente, un proveedor o un manual en inglés.",

  "disclosure.toast":
    "Como Afiliado de Amazon, HidroLab gana por compras calificadas. Los precios están sujetos a confirmación en Amazon.",
  "disclosure.verAviso": "Ver aviso de afiliación de Amazon",
  "disclosure.aviso": "Aviso de afiliación:",
  "disclosure.texto":
    "HidroLab es un participante en el Programa de Afiliados de Amazon Services LLC. Ganamos comisión por compras calificadas realizadas a través de nuestros enlaces, sin costo adicional para vos. Los precios mostrados son referenciales — el precio real solo se confirma en Amazon.",

  "footer.descripcion":
    "Ranking mensual de riego automatizado evaluado con criterio de ingeniería, no solo popularidad.",
  "footer.categorias": "Categorías",
  "footer.sitio": "Sitio",
  "footer.guiasYArticulos": "Guías y artículos",
  "footer.acercaDe": "Acerca de",
  "footer.privacidad": "Política de privacidad",
  "footer.avisoAfiliacion": "Aviso de afiliación:",
  "footer.avisoTexto":
    "HidroLab es un participante en el Programa de Afiliados de Amazon Services LLC, un programa de publicidad de afiliados diseñado para proporcionar un medio para que los sitios obtengan comisiones por publicidad, publicitando y enlazando a Amazon.com. Como Afiliado de Amazon, ganamos por compras calificadas. Los precios mostrados son referenciales y pueden cambiar — el precio real solo se confirma en Amazon.",
  "footer.derechos": "Todos los derechos reservados.",

  "articulos.eyebrow": "Guías",
  "articulos.titulo": "Artículos y guías técnicas",
  "articulos.descripcion":
    "Explicaciones de fondo para elegir bien cada pieza de tu sistema de riego automatizado.",

  "articulo.productosRelacionados": "Productos relacionados",
  "articulo.verRankingCompleto": "Ver ranking completo →",

  "categoria.rankingDelMes": "Ranking del mes",
  "categoria.sinProductos": "Aún no hay productos rankeados en esta categoría.",
} as const;

const en: Dictionary = {
  "nav.categorias": "Categories",
  "nav.guias": "Guides",
  "nav.guiasYArticulos": "Guides & articles",
  "nav.verRanking": "See ranking",
  "nav.abrirMenu": "Open menu",
  "nav.cerrarMenu": "Close menu",
  "nav.inicio": "Home",

  "lang.es": "ES",
  "lang.en": "EN",
  "lang.switchAria": "Switch language",

  "home.eyebrow": "Automated irrigation, evaluated like engineering",
  "home.heroTitulo":
    "The monthly smart-irrigation ranking that actually checks the specs",
  "home.heroDescripcion":
    "WiFi controllers, soil moisture sensors, solenoid valves, drip kits, relay modules, and pumps — ranked with real sales data and editorial technical notes, not just popularity.",
  "home.verRankingDelMes": "See this month's ranking",
  "home.comoEvaluamos": "How we evaluate",
  "home.rankingEyebrow": "This month's ranking",
  "home.rankingTitulo": "Best sellers, filtered by category",
  "home.rankingNota":
    "Reference prices as of the last update. The actual price and availability are always confirmed on Amazon.",
  "home.heroDiagramaAlt":
    "Diagram of an automated irrigation system: Alexa and an app send commands to a central WiFi controller, which shows a dashboard, receives sensor telemetry, and drives a solenoid valve via a 24V AC signal to the sprinkler head",

  "buscador.eyebrow": "Quick finder",
  "buscador.titulo": "Which product is right for you?",
  "buscador.descripcion": "Two clicks and we'll tell you which one in the ranking fits your case best.",
  "buscador.resultadoIntro": "Based on what you picked, this is the best fit for you:",
  "buscador.precioReferencial": "reference price",
  "buscador.verGuiaCompleta": "See full guide",
  "buscador.empezarDeNuevo": "Start over",
  "buscador.elegirOpcion": "Pick the option that best matches your situation:",
  "buscador.volver": "← Back",

  "ranking.todas": "All",
  "ranking.sinProductos": "No products ranked in this category yet.",
  "ranking.verProductoAnterior": "See previous product",
  "ranking.verProductoSiguiente": "See next product",
  "ranking.deslizar": "Swipe to see more →",
  "ranking.seleccionados": "selected",
  "ranking.comparar": "Compare",
  "ranking.cancelarComparacion": "Cancel comparison",

  "producto.masVendido": "🏆 Best seller",
  "producto.mejorValorado": "⭐ Top rated",
  "producto.sinResenas": "No reviews yet",
  "producto.resenas": "reviews",
  "producto.compararEste": "Compare this product",
  "producto.precioReferencial": "reference price",
  "producto.desde": "From",
  "producto.verGuiaCompra": "See full buying guide",
  "producto.verEnAmazon": "View on Amazon",
  "producto.verPrecioActual": "See current price on Amazon",
  "producto.verDisponibilidad": "Check availability on Amazon",
  "producto.revisarEnAmazon": "Check it out on Amazon",
  "producto.guiaDeCompra": "Buying guide",
  "producto.queEsYParaQueSirve": "What is it and what's it for?",
  "producto.ejemplosPracticos": "Real-world use cases",
  "producto.enCasa": "At home: ",
  "producto.enNegocio": "In a business or workshop: ",
  "producto.guiaParaNoEquivocarte": "How to avoid buying the wrong one",
  "producto.consejoDeInversion": "The investment takeaway",

  "comparador.comparando": "Comparing",
  "comparador.producto": "product",
  "comparador.cerrarComparacion": "Close comparison",
  "comparador.precioMasBajo": "💰 Lowest price",
  "comparador.mejorValorado": "⭐ Top rated",
  "comparador.masResenado": "🏆 Most reviewed",
  "comparador.idealPara": "Best for: ",
  "comparador.especificaciones": "Specifications",

  "metodologia.eyebrow": "Methodology",
  "metodologia.titulo": "How we build the ranking",

  "stats.productosEvaluados": "Products evaluated",
  "stats.categoriasCubiertas": "Categories covered",
  "stats.actualizacion": "Updates",
  "stats.mensual": "Monthly",
  "stats.ultimoCorte": "Last update",

  "newsletter.eyebrow": "For everyday use in the yard and the workshop",
  "newsletter.titulo": "The irrigation technical-terms cheat sheet you need, on one page",
  "newsletter.emailLabel": "Email address",
  "newsletter.emailPlaceholder": "you@email.com",
  "newsletter.boton": "Send me the cheat sheet",
  "newsletter.enviadoMensaje": "Done, it's yours.",
  "newsletter.abrirHoja": "Open the reference sheet",

  "glosario.eyebrow": "Field glossary",
  "glosario.titulo": "Terms you'll hear about this equipment",
  "glosario.descripcion":
    "So you can use the right vocabulary with a customer, a supplier, or a manual.",

  "disclosure.toast":
    "As an Amazon Associate, HidroLab earns from qualifying purchases. Prices shown are subject to confirmation on Amazon.",
  "disclosure.verAviso": "See Amazon affiliate disclosure",
  "disclosure.aviso": "Affiliate disclosure:",
  "disclosure.texto":
    "HidroLab is a participant in the Amazon Services LLC Associates Program. We earn a commission on qualifying purchases made through our links, at no extra cost to you. Prices shown are reference prices — the actual price is only confirmed on Amazon.",

  "footer.descripcion":
    "A monthly automated-irrigation ranking evaluated with engineering rigor, not just popularity.",
  "footer.categorias": "Categories",
  "footer.sitio": "Site",
  "footer.guiasYArticulos": "Guides & articles",
  "footer.acercaDe": "About",
  "footer.privacidad": "Privacy policy",
  "footer.avisoAfiliacion": "Affiliate disclosure:",
  "footer.avisoTexto":
    "HidroLab is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. As an Amazon Associate, we earn from qualifying purchases. Prices shown are reference prices and may change — the actual price is only confirmed on Amazon.",
  "footer.derechos": "All rights reserved.",

  "articulos.eyebrow": "Guides",
  "articulos.titulo": "Articles and technical guides",
  "articulos.descripcion":
    "In-depth explanations to help you pick the right piece for your automated irrigation system.",

  "articulo.productosRelacionados": "Related products",
  "articulo.verRankingCompleto": "See full ranking →",

  "categoria.rankingDelMes": "This month's ranking",
  "categoria.sinProductos": "No products ranked in this category yet.",
};

const DICTIONARIES: Record<Locale, Dictionary> = { es, en };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}
