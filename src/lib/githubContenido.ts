import "server-only";

const OWNER = "ramonrf146-hub";
const REPO = "riego-trazado";
const RUTA_ARCHIVO = "data/productos.json";
const RAMA = "main";

interface ArchivoGitHub {
  sha: string;
  contenido: string;
}

interface CambiosProducto {
  precio?: number;
  precioMax?: number | null;
  activo?: boolean;
  notaTecnica?: string;
  idealPara?: string;
}

async function leerArchivo(): Promise<ArchivoGitHub> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("Falta GITHUB_TOKEN en las variables de entorno del servidor.");

  const respuesta = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${RUTA_ARCHIVO}?ref=${RAMA}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
      cache: "no-store",
    }
  );

  if (!respuesta.ok) {
    throw new Error(`No se pudo leer el catálogo desde GitHub (${respuesta.status}): ${await respuesta.text()}`);
  }

  const datos = await respuesta.json();
  const contenido = Buffer.from(datos.content, "base64").toString("utf-8");
  return { sha: datos.sha, contenido };
}

async function escribirArchivo(contenido: string, sha: string, mensaje: string): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("Falta GITHUB_TOKEN en las variables de entorno del servidor.");

  const respuesta = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${RUTA_ARCHIVO}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: mensaje,
      content: Buffer.from(contenido, "utf-8").toString("base64"),
      sha,
      branch: RAMA,
    }),
  });

  if (!respuesta.ok) {
    throw new Error(`No se pudo guardar el cambio en GitHub (${respuesta.status}): ${await respuesta.text()}`);
  }
}

/**
 * Edita un producto directo en GitHub (no en el disco local) y sube un
 * commit real — Vercel toma ese push y redespliega solo, igual que
 * cuando editamos el archivo a mano en este chat.
 */
export async function actualizarProductoEnGitHub(asin: string, cambios: CambiosProducto): Promise<void> {
  const { sha, contenido } = await leerArchivo();
  const productos = JSON.parse(contenido) as Array<Record<string, unknown>>;

  const indice = productos.findIndex((p) => p.asin === asin);
  if (indice === -1) throw new Error(`No se encontró el producto ${asin} en el catálogo.`);

  const producto = productos[indice];
  if (cambios.precio !== undefined) producto.precio = cambios.precio;
  if (cambios.precioMax !== undefined) {
    if (cambios.precioMax === null) delete producto.precioMax;
    else producto.precioMax = cambios.precioMax;
  }
  if (cambios.activo !== undefined) producto.activo = cambios.activo;
  if (cambios.notaTecnica !== undefined) producto.notaTecnica = cambios.notaTecnica;
  if (cambios.idealPara !== undefined) producto.idealPara = cambios.idealPara;

  const nuevoContenido = JSON.stringify(productos, null, 2) + "\n";
  const nombre = typeof producto.nombre === "string" ? producto.nombre : asin;
  await escribirArchivo(nuevoContenido, sha, `Editar "${nombre}" desde el panel admin`);
}
