# Estado actual — HidroLab (riegocom.uk)

> Este archivo se actualiza en cada checkpoint importante para poder retomar el trabajo desde cualquier PC con solo hacer `git pull`. No es un log línea por línea — para el detalle exacto de cada cambio, ver `git log`.

## Sitio
Afiliado Amazon de riego / jardín. Tag de afiliado: `riegotrazado-20`.
Catálogo en `data/productos.json`, artículos en `content/articulos/` (ES) y `content/articulos-en/` (EN).

## Pendiente
- Ninguna tarea abierta específica de este sitio en este momento.
- Workflow automático de PA-API: falla todos los meses por falta de credenciales. Es intencional — el usuario está esperando acceso, previsto para octubre 2026. No desactivar ni "arreglar" sin que lo pida.

## Últimos cambios importantes
- 2026-09-11: agregados NDS 117BC Jumbo Valve Box (B000IBN9M2) y Tondiamo Gel Connectors 40-pack (B09H7DQN1V) a `valvulas-solenoides`, linkeados en `guia-rapida-valvulas-solenoides.md` (ES/EN). Manifiesto de Pines actualizado a v9.
- Antes: regulador de presión Orbit 67798 (kits-goteo) linkeado en guía de vacaciones; video oficial de Orbit sumado a la guía de válvulas; schema FAQPage agregado a artículos con preguntas frecuentes; artículo de bombas + refuerzo SEO técnico (breadcrumbs, OG images).

## Convenciones a respetar
- Todo producto nuevo: entrada bilingüe (ES/EN) siguiendo el schema existente en `productos.json`, con al menos una limitación real declarada.
- Enlazar el producto nuevo en al menos un artículo relacionado existente.
- Actualizar y republicar el artifact "Manifiesto de Pines" (Pinterest) sin que el usuario lo pida — es compartido entre HidroLab y AutomatizaLab.
- Validar JSON + build antes de commitear. Verificar la URL en producción antes de reportar como terminado.
