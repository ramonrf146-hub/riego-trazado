# Estado actual — HidroLab (riegocom.uk)

> Este archivo se actualiza en cada checkpoint importante para poder retomar el trabajo desde cualquier PC con solo hacer `git pull`. No es un log línea por línea — para el detalle exacto de cada cambio, ver `git log`.

## Sitio
Afiliado Amazon de riego / jardín. Tag de afiliado: `riegotrazado-20`.
Catálogo en `data/productos.json`, artículos en `content/articulos/` (ES) y `content/articulos-en/` (EN).

## Pendiente
- Ninguna tarea abierta específica de este sitio en este momento.
- Workflow automático de PA-API (precios, mensual): falla todos los meses por falta de credenciales. Es intencional — el usuario está esperando acceso, previsto para octubre 2026. No desactivar ni "arreglar" sin que lo pida.
- Workflow nuevo `.github/workflows/ciclo-semanal-engine.yml` (piloto de Trazado Engine, Paso 3): construido y commiteado, pero **también bloqueado por el mismo motivo** (necesita PA-API para descubrir candidatos). No activar/probar en GitHub hasta tener el acceso — ver `C:\Projects\Trazado_Engine\ESTADO_ACTUAL.md` para el detalle completo.

## Últimos cambios importantes
- 2026-09-11: agregado SONOFF 4CH Pro R3 (B08BHWF8KD) a `modulos-rele` (la categoría más floja del sitio, sin artículo propio) — **primer producto agregado con el CLI de Trazado Engine** (`node src/cli.mjs agregar-producto`) en vez del script scratch de siempre. Linkeado en `sensor-humedad-vs-temporizador.md` y `guia-rapida-valvulas-solenoides.md` (ES/EN), donde ya se mencionaba "tu propio relé" sin ningún producto. Manifiesto de Pines actualizado a v11 (ver [[project_trazado_engine]] para el detalle del bug encontrado y arreglado en `gitOps.mjs` durante esta prueba).
- 2026-09-11: agregados NDS 117BC Jumbo Valve Box (B000IBN9M2) y Tondiamo Gel Connectors 40-pack (B09H7DQN1V) a `valvulas-solenoides`, linkeados en `guia-rapida-valvulas-solenoides.md` (ES/EN). Manifiesto de Pines actualizado a v9.
- Antes: regulador de presión Orbit 67798 (kits-goteo) linkeado en guía de vacaciones; video oficial de Orbit sumado a la guía de válvulas; schema FAQPage agregado a artículos con preguntas frecuentes; artículo de bombas + refuerzo SEO técnico (breadcrumbs, OG images).

## Convenciones a respetar
- Todo producto nuevo: entrada bilingüe (ES/EN) siguiendo el schema existente en `productos.json`, con al menos una limitación real declarada.
- Enlazar el producto nuevo en al menos un artículo relacionado existente.
- Actualizar y republicar el artifact "Manifiesto de Pines" (Pinterest) sin que el usuario lo pida — es compartido entre HidroLab y AutomatizaLab.
- Validar JSON + build antes de commitear. Verificar la URL en producción antes de reportar como terminado.
