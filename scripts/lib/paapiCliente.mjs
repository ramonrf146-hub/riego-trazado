import { construirPeticionFirmada } from "./firmarPaApi.mjs";

/**
 * Cliente mínimo para el endpoint GetItems de PA-API 5.0. Los marketplaces
 * de Amazon usan hosts/regiones distintos; por defecto apuntamos a EE.UU.
 * Configurable vía AMAZON_HOST / AMAZON_REGION / AMAZON_MARKETPLACE.
 */
const HOST = process.env.AMAZON_HOST || "webservices.amazon.com";
const REGION = process.env.AMAZON_REGION || "us-east-1";
const MARKETPLACE = process.env.AMAZON_MARKETPLACE || "www.amazon.com";

const RUTA_GET_ITEMS = "/paapi5/getitems";
const TARGET_GET_ITEMS =
  "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems";

// PA-API permite 1 request/segundo en cuentas nuevas. Esperamos un poco
// más (1.1s) para dejar margen.
const INTERVALO_MIN_MS = 1100;
let ultimaPeticion = 0;

async function esperarRateLimit() {
  const ahora = Date.now();
  const transcurrido = ahora - ultimaPeticion;
  if (transcurrido < INTERVALO_MIN_MS) {
    await new Promise((r) => setTimeout(r, INTERVALO_MIN_MS - transcurrido));
  }
  ultimaPeticion = Date.now();
}

/**
 * Consulta hasta 10 ASINs a la vez (límite de PA-API por request) y
 * devuelve los datos crudos de la API: precio, imagen, rating y nº de
 * reseñas. No incluye la nota técnica editorial — eso vive solo en
 * data/productos.json y se preserva en el merge del script principal.
 */
export async function obtenerItems(asins, { accessKey, secretKey, partnerTag }) {
  if (asins.length === 0) return [];
  if (asins.length > 10) {
    throw new Error("GetItems admite máximo 10 ASINs por petición.");
  }

  await esperarRateLimit();

  const payload = {
    ItemIds: asins,
    PartnerTag: partnerTag,
    PartnerType: "Associates",
    Marketplace: MARKETPLACE,
    Resources: [
      "ItemInfo.Title",
      "Images.Primary.Large",
      "Offers.Listings.Price",
      "CustomerReviews.StarRating",
      "CustomerReviews.Count",
    ],
  };

  const { url, headers, cuerpo } = construirPeticionFirmada({
    host: HOST,
    region: REGION,
    ruta: RUTA_GET_ITEMS,
    target: TARGET_GET_ITEMS,
    payload,
    accessKey,
    secretKey,
  });

  const respuesta = await fetch(url, { method: "POST", headers, body: cuerpo });

  if (!respuesta.ok) {
    const texto = await respuesta.text();
    throw new Error(
      `PA-API respondió ${respuesta.status} ${respuesta.statusText}: ${texto}`
    );
  }

  const datos = await respuesta.json();

  if (datos.Errors?.length) {
    const mensajes = datos.Errors.map((e) => `${e.Code}: ${e.Message}`).join("; ");
    console.warn(`  ⚠ PA-API devolvió errores parciales: ${mensajes}`);
  }

  return (datos.ItemsResult?.Items ?? []).map((item) => ({
    asin: item.ASIN,
    nombre: item.ItemInfo?.Title?.DisplayValue ?? "(sin título)",
    imagen: item.Images?.Primary?.Large?.URL ?? "/mock/placeholder.svg",
    precio: item.Offers?.Listings?.[0]?.Price?.Amount ?? null,
    moneda: item.Offers?.Listings?.[0]?.Price?.Currency ?? "USD",
    rating: item.CustomerReviews?.StarRating?.Value ?? null,
    numResenas: item.CustomerReviews?.Count ?? 0,
    urlAfiliado: item.DetailPageURL,
  }));
}
