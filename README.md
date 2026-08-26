# HidroLab

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

### Gestionar enlaces: agregar, pausar, eliminar o rotar productos

El catálogo completo vive en `data/productos.json` — es la única fuente de
verdad, no hay base de datos aparte. Cada producto es un objeto con esta
forma (ver `src/lib/tipos.ts` para el tipo completo):

```json
{
  "asin": "B0F883P8N1",
  "nombre": "...",
  "categoria": "controladores-wifi",
  "precio": 39.99,
  "precioMax": 59.99,
  "moneda": "USD",
  "imagen": "https://m.media-amazon.com/images/...",
  "rating": 4.2,
  "numResenas": 415,
  "ranking": 1,
  "notaTecnica": "...",
  "urlAfiliado": "https://www.amazon.com/dp/B0F883P8N1?tag=riegotrazado-20",
  "actualizadoEn": "2026-08-24",
  "activo": true
}
```

**Agregar un producto nuevo:** copiá un objeto existente de la misma
categoría, cambiá `asin`, `nombre`, `precio`, `imagen`, `rating`,
`numResenas`, `urlAfiliado` (siempre `?tag=riegotrazado-20`) y escribí una
`notaTecnica` propia. Asigná el `ranking` que corresponda dentro de esa
categoría (1 = más destacado).

**Pausar un enlace sin borrarlo** (por ejemplo, dejó de convertir, el
vendedor subió mucho el precio, o querés sacarlo temporalmente mientras
evaluás un reemplazo): poné `"activo": false` en ese objeto. El producto
deja de aparecer en el sitio (home, categoría, sitemap) pero **el registro
queda en el archivo** con su `notaTecnica` y su historial — reactivalo
después con `"activo": true` sin tener que reescribir nada. Si el campo
`activo` no está presente, se toma como `true` (activo por defecto).

**Eliminar un producto definitivamente:** borrá el objeto completo del
array. Usalo solo cuando estés seguro de que no lo vas a volver a listar
(por ejemplo, el producto fue descontinuado en Amazon).

**Rango de precio en vez de precio fijo:** si el producto tiene variantes o
vendedores con precios distintos, agregá `precioMax` (además de `precio`,
que actúa como el mínimo del rango). La tarjeta va a mostrar
"Desde $X — $Y" en vez de un precio único. Omití `precioMax` para productos
con precio único.

**Flujo recomendado para rotar hardware según rendimiento de ventas:**
1. Revisá qué ASINs generan clics/ventas en tu panel de Amazon Associates
   (Reports → Earnings Report, filtrado por producto/tag).
2. Los productos con bajo rendimiento sostenido (varias semanas sin clics o
   sin conversión) marcalos con `"activo": false` en vez de borrarlos —
   conservás la nota técnica ya escrita por si los volvés a activar en
   temporada alta (ej. un producto de riego exterior en invierno).
3. Agregá el/los reemplazos como productos nuevos activos en la misma
   categoría, con el `ranking` que corresponda.
4. Commiteá y pusheá — Vercel redeploya solo con cada push a `main`.
5. Repetí mensualmente o cuando notes una caída de rendimiento; no hace
   falta esperar al ciclo de PA-API para reordenar manualmente el catálogo.

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

## Herramienta separada: agente clasificador de inventario

> ⚠️ **No está conectada al sitio.** HidroLab es 100% riego residencial
> (branding, artículos y lo declarado ante Amazon Associates). Este agente
> clasifica hardware de **automatización/hogar inteligente** (Tuya, Node-RED,
> ESP32) y **control industrial B2B** (variadores de frecuencia, RS485,
> PLC) — un mercado y público distintos. Se dejó como script standalone,
> deliberadamente separado de `data/productos.json` y de las categorías del
> sitio, para no mezclar catálogos hasta decidir si esto va a un sitio nuevo,
> una sección aparte, o no se usa.

Vive en `scripts/agente-clasificador/`:

```bash
node scripts/agente-clasificador/agente.mjs
```

Qué hace:
1. Lee un inventario local estructurado desde
   `scripts/agente-clasificador/config/inventario-fuente.json` (sin llamar a
   ninguna API — es el punto de extensión si más adelante querés conectar
   PA-API u otro origen).
2. Clasifica cada item en una de las dos ramas definidas en
   `scripts/agente-clasificador/config/reglas-clasificacion.json`, buscando
   palabras clave en el nombre/descripción (editá esas listas para ajustar
   qué cae en cada rama, sin tocar código).
3. Ordena cada rama por número de reseñas y escribe el resultado en
   `scripts/agente-clasificador/output/inventario-clasificado.json`.

Los productos que no matchean ninguna palabra clave de ninguna rama caen en
`sin-clasificar` para revisión manual, en vez de perderse o asignarse mal.

Usá `--fuente ruta/a/otro.json` para clasificar un inventario distinto al de
ejemplo.

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
