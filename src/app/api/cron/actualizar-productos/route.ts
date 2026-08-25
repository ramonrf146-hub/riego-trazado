import { NextRequest, NextResponse } from "next/server";

/**
 * Endpoint para disparar la actualización mensual desde Vercel Cron.
 *
 * IMPORTANTE — por qué este endpoint NO corre el script directamente:
 * el sistema de archivos de una función serverless de Vercel es de solo
 * lectura en producción (salvo /tmp, que no persiste). No puede escribir
 * ni commitear data/productos.json en el repo. Por eso este endpoint
 * solo DISPARA el workflow de GitHub Actions (que sí puede escribir y
 * pushear al repo) vía `repository_dispatch`. El trabajo real lo hace
 * .github/workflows/actualizar-productos.yml.
 *
 * Si no vas a usar Vercel Cron, podés borrar esta ruta y el cron
 * "schedule" del workflow de GitHub Actions sigue funcionando solo.
 *
 * Configuración necesaria (ver README):
 *   - CRON_SECRET: secreto compartido para autenticar la llamada del cron.
 *   - GITHUB_TOKEN: Personal Access Token con permiso "repo" (o "contents"
 *     + "actions" en un token de grano fino) para disparar el workflow.
 *   - GITHUB_REPO: "usuario/repositorio".
 */
export async function GET(request: NextRequest) {
  const secretoRecibido = request.headers.get("authorization");
  if (secretoRecibido !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { GITHUB_TOKEN, GITHUB_REPO } = process.env;
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    return NextResponse.json(
      { error: "Faltan GITHUB_TOKEN o GITHUB_REPO en las variables de entorno" },
      { status: 500 }
    );
  }

  const respuesta = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/dispatches`,
    {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({ event_type: "actualizar-productos" }),
    }
  );

  if (!respuesta.ok) {
    const texto = await respuesta.text();
    return NextResponse.json(
      { error: `GitHub API respondió ${respuesta.status}: ${texto}` },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, disparado: "actualizar-productos" });
}
