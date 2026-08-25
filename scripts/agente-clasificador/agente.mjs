#!/usr/bin/env node
// @ts-check
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Agente de mantenimiento de catálogo — clasificador de inventario.
 *
 * HERRAMIENTA INDEPENDIENTE, NO CONECTADA AL SITIO RIEGO TRAZADO.
 * Riego Trazado está enfocado 100% en riego residencial (branding,
 * artículos, categorías y lo declarado ante Amazon Associates). Este
 * agente clasifica un inventario de hardware de automatización/hogar
 * inteligente y control industrial B2B — un mercado y público distintos.
 * Se deja como script standalone en scripts/agente-clasificador/ para no
 * mezclar categorías/contenido en el catálogo en vivo (data/productos.json)
 * hasta que se decida si va a un sitio nuevo o a una sección aparte.
 *
 * Qué hace:
 *   1. Lee un origen de datos LOCAL estructurado (config/inventario-fuente.json).
 *      No consulta ninguna API externa por ahora — es el punto de
 *      extensión para conectar PA-API u otro origen más adelante.
 *   2. Clasifica cada item en una de las ramas definidas en
 *      config/reglas-clasificacion.json, buscando palabras clave en el
 *      nombre + descripción del producto (sin distinguir mayúsculas ni
 *      acentos).
 *   3. Dentro de cada rama, ordena por número de reseñas (proxy de
 *      demanda/"alta rotación") y asigna un ranking.
 *   4. Escribe el resultado en output/inventario-clasificado.json y
 *      muestra un resumen por consola.
 *
 * Uso:
 *   node scripts/agente-clasificador/agente.mjs
 *   node scripts/agente-clasificador/agente.mjs --fuente ruta/a/otro.json
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RUTA_REGLAS = path.join(__dirname, "config", "reglas-clasificacion.json");
const RUTA_SALIDA = path.join(__dirname, "output", "inventario-clasificado.json");

function leerJson(ruta) {
  return JSON.parse(fs.readFileSync(ruta, "utf-8"));
}

function rutaFuente() {
  const idx = process.argv.indexOf("--fuente");
  if (idx !== -1 && process.argv[idx + 1]) {
    return path.resolve(process.argv[idx + 1]);
  }
  return path.join(__dirname, "config", "inventario-fuente.json");
}

function normalizar(texto) {
  return (texto ?? "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, ""); // quita acentos (marcas diacríticas combinantes)
}

/** Devuelve el id de rama de la primera coincidencia, o null si no matchea ninguna. */
function clasificarItem(item, ramas) {
  const texto = normalizar(`${item.nombre ?? ""} ${item.descripcion ?? ""}`);
  for (const rama of ramas) {
    const coincide = rama.palabrasClave.some((palabra) =>
      texto.includes(normalizar(palabra))
    );
    if (coincide) return rama.id;
  }
  return null;
}

function agruparYRankear(items, ramas, ramaSinClasificar) {
  const grupos = new Map(ramas.map((r) => [r.id, []]));
  grupos.set(ramaSinClasificar.id, []);

  for (const item of items) {
    const ramaId = clasificarItem(item, ramas) ?? ramaSinClasificar.id;
    grupos.get(ramaId).push(item);
  }

  const nombrePorId = new Map(
    [...ramas, ramaSinClasificar].map((r) => [r.id, r.nombre])
  );

  const resultado = {};
  for (const [ramaId, itemsDeRama] of grupos.entries()) {
    const ordenados = [...itemsDeRama].sort(
      (a, b) => (b.numResenas ?? 0) - (a.numResenas ?? 0)
    );
    resultado[ramaId] = {
      nombre: nombrePorId.get(ramaId),
      productos: ordenados.map((item, indice) => ({
        ...item,
        ranking: indice + 1,
      })),
    };
  }
  return resultado;
}

function main() {
  const { ramas, ramaSinClasificar } = leerJson(RUTA_REGLAS);
  const fuente = rutaFuente();

  if (!fs.existsSync(fuente)) {
    throw new Error(`No se encontró el origen de datos local: ${fuente}`);
  }

  console.log(`→ Leyendo inventario desde ${path.relative(process.cwd(), fuente)}`);
  const items = leerJson(fuente);
  console.log(`→ ${items.length} item(s) a clasificar\n`);

  const clasificado = agruparYRankear(items, ramas, ramaSinClasificar);

  fs.mkdirSync(path.dirname(RUTA_SALIDA), { recursive: true });
  fs.writeFileSync(RUTA_SALIDA, JSON.stringify(clasificado, null, 2) + "\n");

  console.log("Resumen de clasificación:");
  for (const [ramaId, grupo] of Object.entries(clasificado)) {
    console.log(`  · ${grupo.nombre}: ${grupo.productos.length} producto(s)`);
  }

  const sinClasificar = clasificado[ramaSinClasificar.id]?.productos.length ?? 0;
  if (sinClasificar > 0) {
    console.log(
      `\n⚠ ${sinClasificar} producto(s) no matchearon ninguna palabra clave — revisá ` +
        `config/reglas-clasificacion.json o el nombre/descripción del producto.`
    );
  }

  console.log(`\n✓ Resultado escrito en ${path.relative(process.cwd(), RUTA_SALIDA)}`);
}

main();
