#!/usr/bin/env node
// @ts-check
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { obtenerItems } from "./lib/paapiCliente.mjs";

/**
 * Script de actualización mensual del catálogo (/data/productos.json).
 *
 * Qué hace:
 *   1. Lee la lista curada de ASINs por categoría en
 *      scripts/config/asins-por-categoria.json.
 *   2. Consulta PA-API (GetItems, en tandas de hasta 10 ASINs) para
 *      refrescar precio, imagen, rating y número de reseñas.
 *   3. Ordena cada categoría por número de reseñas (proxy de "más
 *      vendido" — PA-API no expone sales rank de forma consistente).
 *   4. Escribe /data/productos.json PRESERVANDO los campos editoriales/
 *      manuales de cada ASIN existente: "notaTecnica", "activo" (gestión de
 *      enlaces — pausar sin borrar) y "precioMax" (rango de precio). Los
 *      ASINs nuevos quedan con notaTecnica = "[PENDIENTE DE REDACTAR]" y
 *      sin esos otros campos.
 *
 * Uso:
 *   node scripts/actualizar-productos.mjs           # requiere credenciales PA-API
 *   node scripts/actualizar-productos.mjs --mock     # no llama a la API, usa datos simulados
 *
 * Variables de entorno requeridas (modo real):
 *   AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, AMAZON_PARTNER_TAG
 * Opcionales (con default para marketplace EE.UU.):
 *   AMAZON_HOST, AMAZON_REGION, AMAZON_MARKETPLACE
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.join(__dirname, "..");
const RUTA_PRODUCTOS = path.join(RAIZ, "data", "productos.json");
const RUTA_CONFIG_ASINS = path.join(
  RAIZ,
  "scripts",
  "config",
  "asins-por-categoria.json"
);

const MODO_MOCK = process.argv.includes("--mock");

function leerJson(ruta) {
  return JSON.parse(fs.readFileSync(ruta, "utf-8"));
}

function cargarCredenciales() {
  const { AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, AMAZON_PARTNER_TAG } = process.env;

  if (!AMAZON_ACCESS_KEY || !AMAZON_SECRET_KEY || !AMAZON_PARTNER_TAG) {
    throw new Error(
      "Faltan variables de entorno de PA-API (AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, " +
        "AMAZON_PARTNER_TAG). Configúralas o corré el script con --mock para probar " +
        "sin credenciales."
    );
  }

  return {
    accessKey: AMAZON_ACCESS_KEY,
    secretKey: AMAZON_SECRET_KEY,
    partnerTag: AMAZON_PARTNER_TAG,
  };
}

function agruparEnTandas(items, tamano) {
  const tandas = [];
  for (let i = 0; i < items.length; i += tamano) {
    tandas.push(items.slice(i, i + tamano));
  }
  return tandas;
}

/** Genera datos simulados para --mock, sin llamar a PA-API. */
function simularItems(asins) {
  return asins.map((asin, i) => ({
    asin,
    nombre: `Producto simulado ${asin}`,
    imagen: "/mock/placeholder.svg",
    precio: Number((15 + i * 7.5).toFixed(2)),
    moneda: "USD",
    rating: Number((4.5 - i * 0.1).toFixed(1)),
    numResenas: 1000 - i * 50,
    urlAfiliado: `https://www.amazon.com/dp/${asin}`,
  }));
}

async function obtenerItemsPorCategoria(asinsPorCategoria, credenciales) {
  /** @type {Record<string, ReturnType<typeof simularItems>>} */
  const resultado = {};

  for (const [categoria, asins] of Object.entries(asinsPorCategoria)) {
    if (categoria.startsWith("_")) continue; // ignora comentarios en el JSON

    console.log(`→ ${categoria}: consultando ${asins.length} ASIN(s)...`);

    if (MODO_MOCK) {
      resultado[categoria] = simularItems(asins);
      continue;
    }

    const tandas = agruparEnTandas(asins, 10);
    const items = [];
    for (const tanda of tandas) {
      const itemsTanda = await obtenerItems(tanda, credenciales);
      items.push(...itemsTanda);
    }
    resultado[categoria] = items;
  }

  return resultado;
}

function fusionarConCatalogoExistente(itemsPorCategoria, catalogoExistente) {
  // Campos editoriales/manuales que el script NUNCA debe pisar para un ASIN
  // que ya existía: la nota técnica, el estado activo/pausado (gestión de
  // enlaces) y el techo de un rango de precio cargado a mano.
  const datosManualesPorAsin = new Map(
    catalogoExistente.map((p) => [
      p.asin,
      { notaTecnica: p.notaTecnica, activo: p.activo, precioMax: p.precioMax },
    ])
  );
  const hoy = new Date().toISOString().slice(0, 10);
  const nuevoCatalogo = [];

  for (const [categoria, items] of Object.entries(itemsPorCategoria)) {
    // "Más vendido" aproximado por nº de reseñas (ver comentario en
    // scripts/config/asins-por-categoria.json).
    const ordenados = [...items].sort(
      (a, b) => (b.numResenas ?? 0) - (a.numResenas ?? 0)
    );

    ordenados.forEach((item, indice) => {
      const manual = datosManualesPorAsin.get(item.asin);
      const producto = {
        asin: item.asin,
        nombre: item.nombre,
        categoria,
        precio: item.precio ?? 0,
        moneda: item.moneda ?? "USD",
        imagen: item.imagen,
        rating: item.rating ?? 0,
        numResenas: item.numResenas ?? 0,
        ranking: indice + 1,
        notaTecnica: manual?.notaTecnica ?? "[PENDIENTE DE REDACTAR]",
        urlAfiliado: item.urlAfiliado,
        actualizadoEn: hoy,
      };
      // Solo agregamos estos campos si ya existían — así un ASIN nuevo no
      // arrastra "activo"/"precioMax" innecesarios.
      if (manual?.activo === false) producto.activo = false;
      if (manual?.precioMax !== undefined) producto.precioMax = manual.precioMax;

      nuevoCatalogo.push(producto);
    });
  }

  return nuevoCatalogo;
}

async function main() {
  console.log(
    MODO_MOCK
      ? "Ejecutando en modo --mock (sin llamadas reales a PA-API)\n"
      : "Ejecutando actualización mensual contra PA-API\n"
  );

  const credenciales = MODO_MOCK ? null : cargarCredenciales();
  const asinsPorCategoria = leerJson(RUTA_CONFIG_ASINS);
  const catalogoExistente = fs.existsSync(RUTA_PRODUCTOS)
    ? leerJson(RUTA_PRODUCTOS)
    : [];

  const itemsPorCategoria = await obtenerItemsPorCategoria(
    asinsPorCategoria,
    credenciales
  );

  const nuevoCatalogo = fusionarConCatalogoExistente(
    itemsPorCategoria,
    catalogoExistente
  );

  fs.writeFileSync(RUTA_PRODUCTOS, JSON.stringify(nuevoCatalogo, null, 2) + "\n");

  const notasPendientes = nuevoCatalogo.filter(
    (p) => p.notaTecnica === "[PENDIENTE DE REDACTAR]"
  ).length;

  console.log(`\n✓ ${nuevoCatalogo.length} productos escritos en data/productos.json`);
  if (notasPendientes > 0) {
    console.log(
      `  ${notasPendientes} producto(s) nuevo(s) quedaron con nota técnica pendiente de redactar.`
    );
  }
}

main().catch((error) => {
  console.error("\n✗ Falló la actualización:", error.message);
  process.exitCode = 1;
});
