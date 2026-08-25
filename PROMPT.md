# Prompt para Claude Code — Sitio de afiliados "Riego Trazado"

Copia y pega todo el bloque de abajo como tu primer mensaje a Claude Code.

---

## PROMPT

Quiero que construyas un sitio de afiliados de Amazon enfocado en riego inteligente/automatizado (controladores WiFi, sensores de humedad, válvulas solenoides, kits de goteo, módulos de relé, bombas). El sitio debe rankear mensualmente los productos más vendidos de esas categorías y monetizar con enlaces de Amazon Associates.

Ya tengo un prototipo visual aprobado (HTML/CSS estático) que debes usar como referencia exacta de diseño — te lo adjunto/describo abajo. No reinventes la dirección visual, constrúyela sobre esta base.

### 1. Stack técnico

- **Frontend:** Next.js 14+ (App Router) con TypeScript y Tailwind CSS, desplegable en Vercel.
- **Datos de productos:** capa de datos separada (JSON o base de datos ligera tipo SQLite/Postgres) que se actualiza mensualmente vía script, no hardcodeada en los componentes.
- **Automatización de actualización mensual:** un script en Node.js que corre como cron job (Vercel Cron o GitHub Actions) el día 1 de cada mes, consulta la Amazon Product Advertising API (PA-API 5.0) para las categorías definidas, y regenera el archivo/tabla de productos.
- **Analítica:** integrar Google Analytics 4 o Plausible (a elegir, explica trade-offs).
- **SEO:** metadata dinámica por página, sitemap.xml, robots.txt, datos estructurados (schema.org Product y ItemList) para que el ranking mensual aparezca bien en resultados de búsqueda.

### 2. Sistema de diseño (obligatorio, no cambiar)

**Concepto:** estética de "plano técnico / blueprint industrial" aplicada al riego — refuerza la idea de que el sitio evalúa productos con criterio de ingeniería, no solo popularidad.

**Paleta (variables CSS):**
```
--ink:       #0E2530   /* fondo principal */
--ink-2:     #123244
--paper:     #F0EDE4   /* fondo de tarjetas/secciones claras */
--paper-dim: #E4E0D3
--line:      #7FD7DD   /* líneas y acentos tipo plano técnico */
--line-dim:  #3E6B72   /* bordes sutiles */
--accent:    #E8863A   /* naranja tipo válvula/alerta — CTAs */
--accent-2:  #8FBF6B   /* verde — elementos "activos"/orgánicos */
--text-light:#EDF3F2
--text-dim:  #9FB8BC
```

**Tipografía:**
- Encabezados y elementos técnicos/etiquetas: `JetBrains Mono` (Google Fonts)
- Cuerpo de texto: `Public Sans` (Google Fonts)

**Elemento de firma (hero):** diagrama SVG tipo plano técnico animado — muestra el flujo de agua desde la fuente, pasando por una válvula solenoide, hasta el aspersor, con un sensor de humedad y un controlador WiFi conectados por líneas punteadas tipo circuito. Las líneas de flujo tienen animación de `stroke-dashoffset` para simular movimiento de agua/datos. Debe respetar `prefers-reduced-motion`.

**Componentes clave a replicar:**
- Header sticky con blur, logo con ícono de válvula/gota en SVG
- Grid de "stats" (productos evaluados, categorías, etc.)
- Tarjetas de producto estilo "hoja de datos técnica": ícono en caja oscura, número de ranking, categoría en mono, precio, botón de afiliado
- Filtros por categoría (client-side)
- Sección "Cómo armamos el ranking" en 4 pasos, layout tipo grid con bordes finos
- Banda de newsletter con fondo claro contrastante
- Footer con disclosure obligatorio de Amazon Associates

### 3. Estructura de categorías y datos de producto

Categorías fijas: Controladores WiFi, Sensores de humedad, Válvulas solenoides, Kits de goteo, Módulos de relé/automatización DIY, Bombas.

Cada producto necesita: nombre, ASIN, categoría, precio actual, imagen (vía PA-API, no hardcodeada ni con scraping), rating y número de reseñas, ranking del mes, y un campo de "nota técnica" editorial (texto corto que yo escribo/edito manualmente — esto NO viene de la API, es contenido diferenciador).

### 3.1 Dónde vive el contenido (arquitectura de datos)

No quiero una base de datos en la nube desde el día uno. Todo el contenido debe vivir **dentro del propio repositorio**, versionado con git, para poder editarlo y desplegarlo junto con el código sin configurar infraestructura extra:

- `/content/articulos/` — artículos editoriales en Markdown (ej. "Cómo elegir un controlador de riego WiFi"), con frontmatter (título, fecha, descripción, categoría).
- `/content/paginas/` — contenido estático tipo Markdown para "Acerca de" y "Política de privacidad".
- `/data/productos.json` (o `/data/productos/*.json` por categoría) — catálogo de productos, incluyendo el campo editorial de "nota técnica". Este archivo es el que reescribe automáticamente el script mensual de la PA-API, preservando las notas técnicas ya escritas (no las sobrescribas si ya existen para ese ASIN).

Estructura el proyecto para que Next.js lea estos archivos en build time (o server components), sin necesidad de una base de datos externa por ahora.

**Ruta de migración futura (no implementar todavía, solo dejar el código desacoplado para que sea fácil migrar después):** si el catálogo crece a varios cientos de productos o necesito editar contenido sin tocar código, migraré `/data/productos.json` a Firebase (Firestore), que ya uso en otros proyectos. Por eso: aísla el acceso a datos de producto detrás de una capa simple (ej. una función `getProductos()`) para que el día de mañana solo cambie la implementación interna de esa función, no los componentes que la consumen.

### 3.2 Contenido inicial a generar como scaffolding

Amazon Associates exige un sitio con contenido real (no solo enlaces) antes de aprobar la cuenta de afiliado. Genera el scaffolding de estas piezas con contenido placeholder claramente marcado como "[PENDIENTE DE REDACTAR]" donde no tengas información real, para que yo lo complete después:

- Página "Acerca de" (`/content/paginas/acerca-de.md`) con estructura lista (quién soy, por qué existe el sitio, credibilidad técnica) — dejo el texto real para después.
- Página de "Política de privacidad" (`/content/paginas/privacidad.md`) — puedes generar una plantilla estándar adaptable, no placeholder vacío, ya que esta sí es mayormente boilerplate legal.
- 2-3 artículos en `/content/articulos/` con estructura de encabezados lista pero contenido marcado como pendiente (ej. "Cómo elegir un controlador de riego WiFi", "Sensor de humedad vs. temporizador: cuál te conviene", "Guía rápida de válvulas solenoides para riego residencial").
- El footer y cualquier página que enlace "Acerca de" / "Privacidad" deben apuntar a estas rutas desde ya, aunque el contenido esté pendiente.

### 4. Reglas de cumplimiento (críticas)

- Incluir el disclosure de afiliado de Amazon Associates de forma visible en el footer y cerca de los enlaces de producto.
- NO hacer scraping directo de amazon.com para obtener bestsellers — solo usar la PA-API oficial una vez aprobada la cuenta.
- Los precios deben indicar que son referenciales y pueden cambiar (los precios reales solo se muestran en Amazon).
- Cachear datos de la API respetando los límites de rate de PA-API (no más de 1 request/segundo en cuentas nuevas).

### 5. Lo que necesito que entregues

1. Proyecto Next.js completo y funcional localmente con datos de ejemplo (mock) mientras no tengo la cuenta de afiliado aprobada.
2. El script de actualización mensual como función separada, documentado, con variables de entorno para las credenciales de PA-API (`AMAZON_ACCESS_KEY`, `AMAZON_SECRET_KEY`, `AMAZON_PARTNER_TAG`) — nunca hardcodeadas.
3. Instrucciones claras de cómo configurar el cron job en Vercel o GitHub Actions.
4. README con pasos de deploy, cómo agregar/editar las "notas técnicas" editoriales de cada producto, y cómo agregar un nuevo artículo en `/content/articulos/`.
5. El scaffolding de contenido descrito en 3.2 (Acerca de, Privacidad, artículos), listo para que yo edite el texto directamente en los archivos Markdown.

Empieza generando la estructura del proyecto y el layout base, y ve mostrándome avances por partes en vez de todo de una vez.

---

## Notas antes de usarlo

- Si aún no tienes la cuenta de Amazon Associates aprobada, dile a Claude Code que use datos mock — así puedes tener el sitio listo y solo conectar la API cuando te aprueben.
- Si prefieres WordPress en vez de Next.js (más rápido de lanzar, menos control), cambia la sección 1 pidiendo un tema personalizado + plugin de afiliados en vez del stack de Next.js.
- Guarda las credenciales de PA-API como variables de entorno desde el principio — nunca las escribas directamente en el prompt ni en el código.
