---
titulo: "Sensor de humedad vs. temporizador: cuál te conviene"
fecha: "2026-08-24"
descripcion: "Comparación honesta entre regar por horario fijo o por lectura real del suelo, y cuándo tiene sentido cada uno."
categoria: "sensores-humedad"
---

Esta es probablemente la decisión más importante al armar un sistema de riego automatizado, y también la que más se simplifica de más en las guías de compra. No es "cuál es mejor" — es cuál resuelve tu problema real.

## Cómo funciona cada uno

**El temporizador** riega en horarios fijos que tú programas: por ejemplo, todos los días a las 6am durante 15 minutos. No sabe si llovió ayer, si el suelo ya está húmedo, o si hace un calor inusual. Ejecuta el horario, punto.

**El sensor de humedad** mide directamente el contenido de agua en el suelo y solo activa el riego cuando está por debajo de un umbral que defines. Si llovió, no riega. Si el clima está fresco y el suelo retiene agua más tiempo, espera.

## Cuándo el temporizador es suficiente

- Plantas o césped con necesidades de agua relativamente estables y predecibles.
- Climas donde la lluvia es rara o muy predecible por temporada.
- Presupuesto ajustado — un temporizador básico cuesta una fracción de un sistema con sensores.
- Sistemas pequeños (pocas macetas, un jardín chico) donde revisar manualmente de vez en cuando no es una carga.

El riesgo real del temporizador no es que riegue de más ocasionalmente — es que lo hace de forma consistente sin que te des cuenta, lo cual desperdicia agua y puede pudrir raíces con el tiempo si nadie ajusta el horario según la estación.

## Cuándo vale la pena el sensor

- Climas con lluvia impredecible, donde regar en horario fijo significa regar bajo la lluvia con frecuencia.
- Zonas grandes o de césped, donde el desperdicio de agua por sobre-riego es económicamente significativo.
- Plantas sensibles a exceso de humedad (muchas suculentas, ciertos árboles frutales).
- Si ya tienes experiencia con proyectos DIY de automatización, un sensor de humedad con salida analógica conectado a tu propio relé te da control total sin depender de un ecosistema cerrado de una marca. El punto de entrada más barato es un [módulo de relé de 1 canal para Arduino/ESP](/productos/B00VRUAHLE) (menos de $6): controlás una sola válvula o bomba desde el microcontrolador que vos programás — eso sí, esta ficha puntual no confirma aislamiento por optoacoplador, así que conviene verificarlo antes de conectarlo a una carga de 24V AC. Si tu proyecto tiene varias zonas, el [ELEGOO de 8 canales](/productos/B09ZQRLD95) escala lo mismo hasta 8 válvulas desde un solo microcontrolador, con optoacoplador de fábrica (aislamiento eléctrico real, más seguro que el de 1 canal de arriba). Si programar un microcontrolador no es lo tuyo pero tampoco querés depender de un ecosistema cerrado grande, el [DieseRC WiFi de 2 canales](/productos/B0CGTRGLFC) es el punto intermedio: trae WiFi propio y se controla desde la app eWeLink (o Alexa/Google) apenas lo conectás, sin sumar ningún Arduino. Y si directamente no querés programar nada, el [SONOFF 4CH Pro R3](/productos/B08BHWF8KD) es un relé de 4 canales listo para usar por WiFi/app, pensado para instalar en un tablero. Si en cambio solo necesitás controlar un punto (una bomba, una válvula) y preferís algo chico para instalar cerca del propio dispositivo, el [Shelly 1 Mini Gen3](/productos/B0CQCHS2QS) es la opción — mismo enfoque sin código, pero de 1 canal y sin gabinete propio: si ese relé (o cualquiera de los de arriba) va a quedar cerca de una canilla o un tablero al aire libre, sumale una [caja estanca IP65 LeMotech](/productos/B075X15KXJ) para protegerlo de la lluvia y el riego por aspersión — sin eso, la humedad termina corroyendo los contactos en una o dos temporadas.
- Si tu casa ya tiene un hub Zigbee corriendo por otros dispositivos (un Echo de 4ª generación o más nuevo, SmartThings, Home Assistant, Hubitat o Homey — los mismos que usan tus luces o enchufes inteligentes), sumar el riego a ese ecosistema en vez de instalar una app nueva tiene sentido. El [THIRDREALITY Smart Soil Moisture Sensor Gen2](/productos/B0GHNB78F7) es justamente eso: una sonda capacitiva (el mismo principio del RAINPOINT de arriba) que habla por radio Zigbee en vez de traer su propio hub WiFi propietario. La contra es real y hay que tenerla clara antes de comprar: sin un hub Zigbee ya funcionando, esta pieza sola no sirve de nada — para ese caso el RAINPOINT con hub incluido sigue siendo la opción que anda de entrada sin nada más que comprar.

## La opción intermedia que casi nadie menciona

No es todo o nada. Muchos controladores modernos aceptan un sensor de lluvia simple (mucho más barato que uno de humedad de suelo) como "interruptor de veto": el horario sigue siendo fijo, pero el sensor cancela el riego programado si detecta lluvia reciente. Es un punto medio razonable en costo y complejidad para quien no quiere calibrar un sensor de suelo pero tampoco quiere regar bajo la lluvia. El [Orbit 57069](/productos/B000A7SPPU) es justamente ese sensor: se cablea al circuito de sensor externo de cualquier controlador de 24V AC (no solo Orbit) por unos $14, y a diferencia de los controladores WiFi de este catálogo que cancelan el riego por pronóstico de app, este reacciona a la lluvia real que está cayendo sobre tu jardín — la contra es que no mide la cantidad con precisión de estación meteorológica, así que funciona como un sí/no, no como un pluviómetro.

## Antes de automatizar: probá primero a mano

Ni temporizador ni sensor conectado — hay una tercera opción para cuando ni siquiera sabés todavía si tenés un problema real de riego. Un medidor manual como el [SONKIR 3 en 1](/productos/B07BR52P26) se clava directo en la tierra y en segundos te dice si está seca, húmeda o empapada, sin batería, sin app y por menos de $10. A diferencia de las sondas capacitivas de este ranking (pensadas para quedar enterradas y reportar por WiFi), este es un chequeo puntual: lo usás para confirmar con datos reales qué plantas o canteros tienen problemas antes de gastar en un sensor permanente ahí. Si tus macetas son grandes o profundas, el SONKIR se queda corto — el [XLUX de sonda larga](/productos/B099R6BQHB) llega 14cm más adentro, hasta donde están las raíces de verdad.

<div class="not-prose my-6 overflow-hidden rounded-2xl border border-line-dim" style="aspect-ratio:16/9">
<iframe width="100%" height="100%" src="https://www.youtube.com/embed/048w2vC_LPo" title="SONKIR Soil pH Meter, MS02 3 in 1 Soil Moisture Light pH Tester Gardening Tool Kits Review" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

## En resumen

Si tu prioridad es simplicidad y costo, un temporizador con buen horario ajustado por estación funciona bien. Si tu prioridad es ahorro de agua y precisión, o tienes plantas sensibles al exceso de riego, el sensor de humedad se paga solo con el tiempo. Y si no estás seguro, empezá con el medidor manual o el sensor de lluvia como veto — son los puntos de entrada más baratos a un sistema más inteligente.

## Ejemplos reales de este ranking

- **Temporizador con veto por lluvia:** el [Smart Sprinklers Controller](/productos/B0F883P8N1) ya trae esa función de "interruptor de veto" incorporada — programás el horario fijo y el controlador cancela solo si su app detecta lluvia, sin que tengas que sumar un sensor físico aparte.
- **Medidor manual, sin batería:** el [SONKIR 3 en 1](/productos/B07BR52P26) es la forma más barata de confirmar si una planta necesita agua antes de decidir si vale la pena automatizar esa zona.
- **Sensor de humedad de suelo:** el [RAINPOINT con sonda capacitiva](/productos/B0F596PTCF) mide directamente el suelo de forma permanente, o si además querés recibir alertas en el celular, el [RAINPOINT con hub WiFi](/productos/B0GH6WJWQK) suma esa capa de notificaciones.
- **Sensor de suelo para un ecosistema Zigbee ya existente:** el [THIRDREALITY Smart Soil Moisture Sensor Gen2](/productos/B0GHNB78F7) mide lo mismo que el RAINPOINT, pero en vez de traer su propio hub se suma al hub Zigbee que ya tenés funcionando (Echo, SmartThings, Home Assistant, Hubitat) — sin uno de esos ya instalado, no sirve de nada.
- **Sensor de lluvia como veto (la opción intermedia):** el [Orbit 57069](/productos/B000A7SPPU) es un sensor cableado de lluvia/helada, mucho más barato que cualquier sensor de suelo de este ranking — no mide humedad del suelo, solo veta el riego cuando está lloviendo o helando de verdad.
- **Medidor de caudal para detectar fugas (no mide suelo ni lluvia):** el [Hunter HC075FLOW](/productos/B084GSRXDX) es distinto a todos los de arriba — no lee humedad ni lluvia, mide el agua que pasa por la línea principal y avisa por la app Hydrawise si el caudal no tiene sentido (fuga, válvula rota u obstrucción). Solo integra con controladores Hydrawise de Hunter, como el [HPC400](/productos/B08BJBKW44) de la categoría de controladores WiFi.

<div class="not-prose my-6 overflow-hidden rounded-2xl border border-line-dim" style="aspect-ratio:16/9">
<iframe width="100%" height="100%" src="https://www.youtube.com/embed/zYRyo5MeWGw" title="Is it worth Upgrading to the 3rd Reality Gen 2 Soil Sensor?" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

## Preguntas frecuentes

**¿El sensor de humedad puede controlar la válvula o la bomba directamente, sin nada más?**
No. El sensor por sí solo solo mide y manda una señal eléctrica — necesita un relé en el medio para cerrar o abrir el circuito de la válvula o la bomba. Más arriba está la escalera completa según cuánto control (y cuánto querés programar) necesitás, desde el [relé de 1 canal](/productos/B00VRUAHLE) hasta opciones que no requieren tocar código como el [SONOFF 4CH Pro R3](/productos/B08BHWF8KD) o el [Shelly 1 Mini Gen3](/productos/B0CQCHS2QS).

**¿Qué significa que un relé tenga optoacoplador, y por qué me importa?**
Un optoacoplador separa eléctricamente la señal de control de tu microcontrolador (5V) de la carga que enciende, como una válvula de 24V AC, transmitiendo la señal por luz en vez de por un cable directo. Sin esa separación, un pico de voltaje del lado de la válvula puede llegar a dañar tu Arduino o ESP. El [ELEGOO de 8 canales](/productos/B09ZQRLD95) lo trae de fábrica confirmado; el [módulo de 1 canal](/productos/B00VRUAHLE) más barato de este ranking no lo confirma en su ficha, así que conviene revisarlo antes de conectarlo a una carga de 24V AC.

**Tengo varias válvulas pero no quiero programar nada — ¿cuál de los relés WiFi me conviene?**
Si vas a instalar todo en un tablero eléctrico y querés varias salidas controladas por un solo dispositivo, el [SONOFF 4CH Pro R3](/productos/B08BHWF8KD) (montaje en riel DIN, 4 canales) está pensado para eso. Si en cambio solo necesitás controlar un punto puntual —una bomba, una válvula— cerca de donde está el propio dispositivo, el [Shelly 1 Mini Gen3](/productos/B0CQCHS2QS) es más chico y no necesita gabinete propio, pero es de un solo canal: para varias zonas independientes necesitarías uno por zona.

**El sensor de lluvia Orbit 57069, ¿funciona solo con temporizadores básicos o también con un controlador WiFi?**
Funciona con cualquier controlador que tenga una entrada física de sensor externo de 24V AC, sea WiFi o no. La diferencia real es que los controladores WiFi de este catálogo ya cancelan el riego solo con el pronóstico de su app, sin cablear nada aparte — mientras que el [Orbit 57069](/productos/B000A7SPPU) reacciona a la lluvia real que está cayendo sobre tu jardín en ese momento, lo cual puede seguir siendo útil incluso con un controlador WiFi si preferís no depender solo del pronóstico.

**¿Puedo combinar un sensor de humedad con un temporizador en el mismo sistema?**
Sí, y es más común de lo que parece. Muchos armados reales usan el temporizador (o el controlador WiFi) para fijar el horario base, y el sensor de humedad o el sensor de lluvia de veto solo para cancelar ese horario cuando no corresponde regar. No hace falta elegir uno de forma excluyente — son complementarios, no opuestos.

**¿El Hunter HC075FLOW reemplaza al sensor de humedad o al de lluvia?**
No, resuelve un problema distinto. Los sensores de humedad y lluvia de este ranking deciden CUÁNDO regar; el HC075FLOW no decide nada por sí solo, solo mide CUÁNTA agua está pasando por la línea principal en ese momento y avisa si el número es anormal — útil para detectar una fuga o una válvula rota, no para ahorrar agua regando según el clima o el suelo.

**El Shelly 1 Mini Gen3 no trae gabinete propio — ¿cualquier caja estanca le sirve, o necesito una específica?**
No necesitás una caja especial para Shelly puntualmente, pero sí necesitás que sea IP65 (protegida contra agua y polvo) y que le entre con lugar para la cablería. La [caja LeMotech de este ranking](/productos/B075X15KXJ) cumple ambas cosas, con prensacables incluidos para pasar los cables de alimentación y salida sin dejar puntos sin sellar — le sirve igual al Shelly que al DieseRC o al relé ELEGOO de 8 canales si alguno de esos va a quedar a la intemperie. El SONOFF 4CH Pro R3, en cambio, está pensado para ir atornillado dentro de un tablero eléctrico ya cerrado, no dentro de esta caja.
