# Riego Trazado

Sitio de afiliados de Amazon enfocado en riego inteligente/automatizado. Rankea
mensualmente controladores WiFi, sensores de humedad, válvulas solenoides,
kits de goteo, módulos de relé/DIY y bombas, y monetiza con enlaces de Amazon
Associates.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS v4
- **Datos de producto:** `/data/productos.json`, versionado en git (ver
  [Arquitectura de datos](#arquitectura-de-datos))
- **Contenido editorial:** Markdown en `/content` (artículos y páginas)
- **Automatización mensual:** `scripts/actualizar-productos.mjs` contra la
  Amazon Product Advertising API (PA-API 5.0)
- **Analítica:** Google Analytics 4 (opcional, ver [Analítica](#analítica))

## Levantar el proyecto en local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). El sitio funciona out of
the box con el catálogo mock incluido en `data/productos.json` — no necesitas
credenciales de PA-API para desarrollar o revisar el diseño.

## Arquitectura de datos

No hay base de datos en la nube. Todo el contenido vive versionado en el
repo:

| Ruta | Qué contiene |
|---|---|
| `/data/productos.json` | Catálogo de productos (precio, rating, imagen, ranking, y la nota técnica editorial) |
| `/content/articulos/*.md` | Artículos de guía, con frontmatter (`titulo`, `fecha`, `descripcion`, `categoria`) |
| `/content/paginas/*.md` | Contenido de "Acerca de" y "Política de privacidad" |
| `scripts/config/asins-por-categoria.json` | Lista curada de ASINs por categoría que el script mensual refresca |

El acceso a productos está aislado detrás de `getProductos()` en
[`src/lib/productos.ts`](src/lib/productos.ts). Si el catálogo crece y
decides migrar a Firestore, **solo tenés que reescribir la implementación
interna de esa función** — las páginas y componentes que la consumen
(`getProductosPorCategoria`, `ProductCard`, etc.) no cambian.

## Editar contenido

### Nota técnica de un producto

Abrí `data/productos.json`, buscá el producto por `asin` y editá el campo
`notaTecnica`. Es texto plano, no Markdown. **El script mensual nunca
sobrescribe este campo si el ASIN ya existe en el catálogo** — solo lo
completa con `"[PENDIENTE DE REDACTAR]"` en productos nuevos.

### Agregar un artículo nuevo

1. Creá un archivo en `content/articulos/tu-slug.md`.
2. Agregá el frontmatter:
   ```md
   ---
   titulo: "Título del artículo"
   fecha: "2026-09-01"
   descripcion: "Descripción corta para SEO/listados."
   categoria: "controladores-wifi" # opcional, debe ser un slug válido de src/lib/categorias.ts
   ---

   Contenido en Markdown...
   ```
3. El artículo aparece automáticamente en `/articulos` y en el sitemap — no
   hay que registrarlo en ningún otro lado.

### Editar "Acerca de" o "Política de privacidad"

Editá directamente `content/paginas/acerca-de.md` o
`content/paginas/privacidad.md`. Buscá las marcas `[PENDIENTE DE REDACTAR]`
para saber qué falta completar (Amazon Associates exige contenido real antes
de aprobar la cuenta).

## Script de actualización mensual (PA-API)

`scripts/actualizar-productos.mjs`:

1. Lee la lista curada de ASINs por categoría (`scripts/config/asins-por-categoria.json`).
2. Consulta `GetItems` de PA-API 5.0 en tandas de hasta 10 ASINs, respetando
   el límite de 1 request/segundo de cuentas nuevas.
3. Ordena cada categoría por número de reseñas (proxy de "más vendido" — PA-API
   no expone un sales-rank confiable y uniforme entre marketplaces).
4. Reescribe `data/productos.json` **preservando `notaTecnica`** para los
   ASINs que ya existían.

> **Por qué una lista curada de ASINs y no una búsqueda automática de
> bestsellers:** PA-API 5.0 no tiene un endpoint público de "más vendidos"
> confiable en todos los marketplaces. Mantener una lista de ASINs por
> categoría (editable en `scripts/config/asins-por-categoria.json`) también
> mantiene estable qué producto corresponde a qué nota técnica editorial mes
> a mes, en vez de que el ranking cambie de productos sin que vos lo hayas
> decidido.

### Variables de entorno

Copiá `.env.local.example` a `.env.local` y completá:

```
AMAZON_ACCESS_KEY=
AMAZON_SECRET_KEY=
AMAZON_PARTNER_TAG=
```

**Nunca las hardcodees en el código.** En producción, configuralas como
secrets del repo (GitHub Actions) o variables de entorno del proyecto
(Vercel) — nunca en `vercel.json` ni committeadas.

### Correr el script

```bash
# Modo real (requiere credenciales PA-API aprobadas)
npm run actualizar-productos

# Modo simulado, sin llamar a la API — útil para probar la lógica de
# fusión/preservación de notas técnicas
npm run actualizar-productos:mock
```

## Configurar el cron mensual

Hay dos formas de disparar el script el día 1 de cada mes. **Recomendamos
GitHub Actions** porque puede escribir y commitear directo al repo; Vercel
Cron no puede (ver por qué abajo).

### Opción A — GitHub Actions (recomendada)

Ya está en `.github/workflows/actualizar-productos.yml`, con
`cron: "0 6 1 * *"` (día 1 de cada mes, 06:00 UTC).

1. En GitHub: **Settings → Secrets and variables → Actions**, agregá
   `AMAZON_ACCESS_KEY`, `AMAZON_SECRET_KEY`, `AMAZON_PARTNER_TAG`.
2. Listo — el workflow corre solo el día 1 de cada mes, y si hay cambios en
   `data/productos.json` los commitea automáticamente. Vercel redeploya solo
   al detectar el nuevo commit (si tenés el deploy automático de Vercel
   conectado a la rama).
3. Podés dispararlo manualmente desde la pestaña **Actions** del repo
   (`workflow_dispatch`) para probarlo sin esperar al día 1.

### Opción B — Vercel Cron

Vercel Cron solo puede invocar un endpoint HTTP — **no puede** ejecutar el
script ni commitear al repo, porque el filesystem de una función serverless
de Vercel es de solo lectura en producción. Por eso `vercel.json` y
`/api/cron/actualizar-productos` están armados para que Vercel Cron
**dispare el workflow de GitHub Actions** (vía `repository_dispatch`), que es
quien hace el trabajo real.

Si preferís esta opción:

1. En Vercel, configurá las variables de entorno del proyecto:
   - `CRON_SECRET` (un string random; Vercel lo manda automático como header
     `Authorization: Bearer <CRON_SECRET>` en cada invocación de cron)
   - `GITHUB_TOKEN` (Personal Access Token con permiso para disparar
     workflows en el repo)
   - `GITHUB_REPO` (`tu-usuario/riego-trazado`)
2. El cron de `vercel.json` ya apunta a `/api/cron/actualizar-productos` con
   el mismo `"0 6 1 * *"`.

Si no vas a usar esta opción, podés borrar `vercel.json` y
`src/app/api/cron/actualizar-productos/` sin afectar nada más.

## Analítica: GA4 vs. Plausible

Se integró **Google Analytics 4** (`src/components/GoogleAnalytics.tsx`),
activo solo si definís `NEXT_PUBLIC_GA_ID`. Trade-offs frente a Plausible:

| | GA4 | Plausible |
|---|---|---|
| Costo | Gratis | De pago (o self-hosted) |
| Detalle de datos | Mucho más granular: embudos, atribución, audiencias | Métricas esenciales, panel simple |
| Privacidad / cookies | Usa cookies, requiere banner de consentimiento en UE | Sin cookies, no requiere banner en la mayoría de los casos |
| Peso/rendimiento | Script más pesado | Script minúsculo (~1kb) |
| Curva de aprendizaje | Alta | Baja |

Para un sitio de afiliados donde quizás quieras analizar embudo de clic a
Amazon por categoría/producto, GA4 da más profundidad gratis. Si priorizás
privacidad y simplicidad y no te importa pagar, Plausible es más prolijo.
Cambiar a Plausible es agregar su script (`<script defer data-domain="..." src="https://plausible.io/js/script.js">`)
en vez de `GoogleAnalytics.tsx` — el resto del sitio no depende de esto.

## Deploy en Vercel

1. Conectá el repo en [vercel.com/new](https://vercel.com/new).
2. Framework preset: Next.js (se detecta solo).
3. Variables de entorno del proyecto (Production):
   - `NEXT_PUBLIC_SITE_URL` (tu dominio real, para sitemap/metadata/OG)
   - `NEXT_PUBLIC_GA_ID` (opcional)
   - `AMAZON_ACCESS_KEY`, `AMAZON_SECRET_KEY`, `AMAZON_PARTNER_TAG` (solo si
     vas a correr el script desde una función serverless; si usás GitHub
     Actions como en la Opción A, estas van como secrets de GitHub, no acá)
4. Deploy. El sitio es estático en casi todas sus rutas (`○`/`●` en el output
   de `next build`), salvo el endpoint de cron opcional.

## Cumplimiento (Amazon Associates)

- Disclosure de afiliado visible en el [footer](src/components/Footer.tsx) de
  todas las páginas.
- Los enlaces de producto llevan `rel="nofollow sponsored noopener noreferrer"`.
- Los precios se muestran como referenciales ("Precio referencial, ver en
  Amazon") — el precio real solo se confirma en Amazon.
- El script de actualización solo usa PA-API oficial, nunca scraping de
  amazon.com.
- El cliente PA-API respeta 1 request/segundo (ver
  `scripts/lib/paapiCliente.mjs`).

## Estructura del proyecto

```
content/
  articulos/          # Guías en Markdown
  paginas/            # Acerca de, Privacidad
data/
  productos.json       # Catálogo (reescrito por el script mensual)
scripts/
  actualizar-productos.mjs
  lib/
    firmarPaApi.mjs     # Firma AWS SigV4 para PA-API
    paapiCliente.mjs     # Cliente GetItems + rate limiting
  config/
    asins-por-categoria.json
src/
  app/                 # Rutas (App Router)
  components/
  lib/
    productos.ts        # Capa de acceso a datos (getProductos)
    contenido.ts         # Capa de acceso a contenido Markdown
    categorias.ts         # Lista fija de categorías
    tipos.ts               # Tipos compartidos
.github/workflows/
  actualizar-productos.yml
```

## Pendiente antes de lanzar

- [ ] Completar los `[PENDIENTE DE REDACTAR]` en `content/paginas/acerca-de.md`
      y en los artículos de `content/articulos/`.
- [ ] Reemplazar los ASINs mock en `scripts/config/asins-por-categoria.json`
      por ASINs reales una vez aprobada la cuenta de Associates.
- [ ] Escribir las notas técnicas reales en `data/productos.json`.
- [ ] Configurar `NEXT_PUBLIC_SITE_URL` con el dominio final.
- [ ] Decidir y configurar analítica (GA4 o Plausible).
