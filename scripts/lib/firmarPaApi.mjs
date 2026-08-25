import crypto from "node:crypto";

/**
 * Firma AWS Signature Version 4 para peticiones a la Amazon Product
 * Advertising API 5.0 (PA-API). PA-API no tiene un SDK oficial en npm,
 * así que firmamos las peticiones a mano siguiendo el algoritmo estándar
 * de AWS SigV4 para POST + JSON.
 *
 * Referencia: https://webservices.amazon.com/paapi5/documentation/sending-request.html
 */

const SERVICE = "ProductAdvertisingAPI";
const ALGORITMO = "AWS4-HMAC-SHA256";

function hmac(clave, dato) {
  return crypto.createHmac("sha256", clave).update(dato, "utf8").digest();
}

function sha256Hex(dato) {
  return crypto.createHash("sha256").update(dato, "utf8").digest("hex");
}

function fechaAmz(date) {
  const iso = date.toISOString().replace(/[:-]|\.\d{3}/g, "");
  return {
    amzDate: iso, // 20260101T000000Z
    fechaCorta: iso.slice(0, 8), // 20260101
  };
}

function claveDeFirma(secretKey, fechaCorta, region, service) {
  const kDate = hmac(`AWS4${secretKey}`, fechaCorta);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  return hmac(kService, "aws4_request");
}

/**
 * Construye los headers firmados para una petición POST a PA-API.
 *
 * @param {object} opciones
 * @param {string} opciones.host - ej. "webservices.amazon.com"
 * @param {string} opciones.region - ej. "us-east-1"
 * @param {string} opciones.ruta - ej. "/paapi5/getitems"
 * @param {string} opciones.target - ej. "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems"
 * @param {object} opciones.payload - cuerpo de la petición, se serializa a JSON
 * @param {string} opciones.accessKey
 * @param {string} opciones.secretKey
 */
export function construirPeticionFirmada({
  host,
  region,
  ruta,
  target,
  payload,
  accessKey,
  secretKey,
}) {
  const cuerpo = JSON.stringify(payload);
  const ahora = new Date();
  const { amzDate, fechaCorta } = fechaAmz(ahora);

  const headersFirmados = [
    "content-encoding",
    "content-type",
    "host",
    "x-amz-date",
    "x-amz-target",
  ];

  const headersParaFirma = {
    "content-encoding": "amz-1.0",
    "content-type": "application/json; charset=utf-8",
    host,
    "x-amz-date": amzDate,
    "x-amz-target": target,
  };

  const canonicalHeaders =
    headersFirmados.map((h) => `${h}:${headersParaFirma[h]}\n`).join("") + "\n";
  const signedHeadersStr = headersFirmados.join(";");

  const peticionCanonica = [
    "POST",
    ruta,
    "", // sin query string
    canonicalHeaders,
    signedHeadersStr,
    sha256Hex(cuerpo),
  ].join("\n");

  const alcanceCredencial = `${fechaCorta}/${region}/${SERVICE}/aws4_request`;
  const stringAFirmar = [
    ALGORITMO,
    amzDate,
    alcanceCredencial,
    sha256Hex(peticionCanonica),
  ].join("\n");

  const clave = claveDeFirma(secretKey, fechaCorta, region, SERVICE);
  const firma = crypto.createHmac("sha256", clave).update(stringAFirmar, "utf8").digest("hex");

  const authorization =
    `${ALGORITMO} Credential=${accessKey}/${alcanceCredencial}, ` +
    `SignedHeaders=${signedHeadersStr}, Signature=${firma}`;

  return {
    url: `https://${host}${ruta}`,
    headers: {
      ...headersParaFirma,
      Authorization: authorization,
    },
    cuerpo,
  };
}
