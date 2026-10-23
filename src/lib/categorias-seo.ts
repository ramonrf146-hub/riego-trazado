import type { Locale } from "./i18n";

export interface PreguntaCategoria {
  pregunta: string;
  respuesta: string;
}

export interface ContenidoCategoria {
  /** <title> pensado para la consulta real ("irrigation pumps", "moisture sensor"…), sin el sufijo del sitio. */
  titulo: string;
  comoElegir: string[];
  faq: PreguntaCategoria[];
}

/**
 * Texto de apoyo de cada categoría (cómo elegir + preguntas frecuentes).
 * Solo afirmaciones técnicas generales: lo específico de cada producto vive
 * en su ficha. Las categorías sin entrada simplemente no muestran el bloque.
 */
export const CONTENIDO_CATEGORIAS: Record<string, Record<Locale, ContenidoCategoria>> = {
  "controladores-wifi": {
    es: {
      titulo: "Controladores WiFi para riego: ranking y guía de compra",
      comoElegir: [
        "Contá las zonas de tu jardín (cada válvula es una zona) y sumá una o dos de reserva: es la primera limitación real de cualquier controlador.",
        "Confirmá que funcione con el cableado que ya tenés: la mayoría de los sistemas residenciales usa válvulas de 24 V AC, así que revisá el voltaje antes de comprar.",
        "Mirá si la app depende de la nube del fabricante o permite control local: cambia lo que pasa si se cae internet.",
      ],
      faq: [
        {
          pregunta: "¿Cuántas zonas necesito en un controlador de riego?",
          respuesta:
            "Una por cada válvula de tu sistema, es decir, por cada sector del jardín que se riega por separado. Conviene elegir un controlador con una o dos zonas de reserva para poder ampliar después.",
        },
        {
          pregunta: "¿Un controlador WiFi sigue regando si se cae internet?",
          respuesta:
            "Depende del modelo. Normalmente el horario queda guardado en el propio equipo y sigue regando; lo que se pierde sin internet es el control desde la app y los ajustes automáticos por clima. Revisá la ficha de cada producto.",
        },
        {
          pregunta: "¿Puedo conservar mis válvulas actuales al cambiar de controlador?",
          respuesta:
            "Si son de 24 V AC (el estándar del riego residencial), un controlador WiFi las maneja sin cambiarlas. Si usan otro voltaje, vas a necesitar adaptarlas o reemplazarlas.",
        },
      ],
    },
    en: {
      titulo: "WiFi Irrigation Controllers: ranking and buying guide",
      comoElegir: [
        "Count your yard's zones (each valve is one zone) and add one or two spare: it's the first real limit of any controller.",
        "Make sure it works with the wiring you already have: most residential systems use 24 V AC valves, so check the voltage before buying.",
        "Check whether the app depends on the manufacturer's cloud or allows local control: it changes what happens when the internet goes down.",
      ],
      faq: [
        {
          pregunta: "How many zones do I need in a sprinkler controller?",
          respuesta:
            "One per valve in your system, meaning one per section of the yard that is watered separately. It's worth choosing a controller with one or two spare zones so you can expand later.",
        },
        {
          pregunta: "Does a WiFi controller keep watering if the internet goes down?",
          respuesta:
            "It depends on the model. The schedule is normally stored on the device itself and keeps running; what you lose without internet is app control and automatic weather adjustments. Check each product's page.",
        },
        {
          pregunta: "Can I keep my current valves when I change controllers?",
          respuesta:
            "If they are 24 V AC (the residential irrigation standard), a WiFi controller drives them without changes. If they use a different voltage, you will need to adapt or replace them.",
        },
      ],
    },
  },
  "sensores-humedad": {
    es: {
      titulo: "Sensores de humedad de suelo: ranking y guía de compra",
      comoElegir: [
        "Elegí el tipo de sonda: las capacitivas, sin electrodos metálicos expuestos, suelen durar más que las resistivas baratas, que se corroen con el tiempo.",
        "Decidí si solo querés medir (medidor manual) o automatizar (sensor con hub o WiFi cuya lectura pueda disparar el riego).",
        "Revisá cómo se conecta: WiFi directo, Zigbee con hub o Bluetooth cambian qué tan lejos del router puede estar el sensor.",
      ],
      faq: [
        {
          pregunta: "¿Qué diferencia hay entre un sensor de humedad y un medidor manual?",
          respuesta:
            "El medidor manual se clava en la tierra y da una lectura puntual cuando vos lo usás. Un sensor con hub o WiFi mide de forma continua y puede avisarte o disparar el riego.",
        },
        {
          pregunta: "¿Un sensor de humedad sirve para regar automáticamente?",
          respuesta:
            "Sí, siempre que su lectura la pueda usar un controlador o tu hub de domótica. Los sensores que solo mandan alertas a la app no abren válvulas por sí solos.",
        },
        {
          pregunta: "¿Por qué las sondas capacitivas duran más?",
          respuesta:
            "Porque no tienen electrodos metálicos en contacto directo con el suelo que se corroan, como pasa con las sondas resistivas.",
        },
      ],
    },
    en: {
      titulo: "Soil Moisture Sensors: ranking and buying guide",
      comoElegir: [
        "Pick the probe type: capacitive probes, with no exposed metal electrodes, usually outlast cheap resistive ones, which corrode over time.",
        "Decide whether you only want to measure (manual meter) or to automate (a sensor with a hub or WiFi whose reading can trigger watering).",
        "Check how it connects: direct WiFi, Zigbee with a hub, or Bluetooth change how far from the router the sensor can sit.",
      ],
      faq: [
        {
          pregunta: "What is the difference between a soil moisture sensor and a manual meter?",
          respuesta:
            "A manual meter is pushed into the soil and gives a one-time reading when you use it. A sensor with a hub or WiFi measures continuously and can alert you or trigger watering.",
        },
        {
          pregunta: "Can a soil moisture sensor water automatically?",
          respuesta:
            "Yes, as long as a controller or your home-automation hub can use its reading. Sensors that only send alerts to an app don't open valves on their own.",
        },
        {
          pregunta: "Why do capacitive probes last longer?",
          respuesta:
            "They have no metal electrodes in direct contact with the soil to corrode, which is what happens with resistive probes.",
        },
      ],
    },
  },
  "valvulas-solenoides": {
    es: {
      titulo: "Válvulas solenoides de riego: ranking y guía de compra",
      comoElegir: [
        "Fijate en el diámetro de rosca (por ejemplo 3/4\" o 1\") y que coincida con tu tubería.",
        "Confirmá el voltaje de la bobina (24 V AC es lo habitual en riego residencial) y que tu controlador lo entregue.",
        "Revisá la presión mínima de operación: algunas válvulas necesitan una presión mínima para cerrar bien.",
      ],
      faq: [
        {
          pregunta: "¿Qué voltaje usa una válvula solenoide de riego?",
          respuesta:
            "En riego residencial lo habitual es 24 V AC. Verificá la etiqueta de la bobina antes de comprar, porque hay modelos de otros voltajes.",
        },
        {
          pregunta: "¿Puedo conectar una válvula solenoide directo a la corriente de la casa?",
          respuesta:
            "No. Una bobina de 24 V AC necesita un transformador y un controlador que la active; conectarla directo a 120 V la daña.",
        },
        {
          pregunta: "¿Qué significa que una válvula sea \"normalmente cerrada\"?",
          respuesta:
            "Que permanece cerrada sin energía y solo abre cuando el controlador la alimenta. Si falla la corriente, el agua deja de pasar.",
        },
      ],
    },
    en: {
      titulo: "Irrigation Solenoid Valves: ranking and buying guide",
      comoElegir: [
        "Check the thread size (for example 3/4\" or 1\") and make sure it matches your piping.",
        "Confirm the coil voltage (24 V AC is typical for residential irrigation) and that your controller supplies it.",
        "Look at the minimum operating pressure: some valves need a minimum pressure to close properly.",
      ],
      faq: [
        {
          pregunta: "What voltage does an irrigation solenoid valve use?",
          respuesta:
            "In residential irrigation it is usually 24 V AC. Check the coil label before buying, since some models use other voltages.",
        },
        {
          pregunta: "Can I connect a solenoid valve straight to household power?",
          respuesta:
            "No. A 24 V AC coil needs a transformer and a controller to switch it; connecting it directly to 120 V damages it.",
        },
        {
          pregunta: "What does a \"normally closed\" valve mean?",
          respuesta:
            "It stays closed with no power and only opens when the controller energizes it. If power fails, water stops flowing.",
        },
      ],
    },
  },
  "kits-goteo": {
    es: {
      titulo: "Kits de riego por goteo: ranking y guía de compra",
      comoElegir: [
        "Calculá cuántas plantas o metros de línea necesitás: cada kit indica la cantidad máxima de goteros o la longitud que cubre.",
        "Fijate si incluye regulador de presión y filtro: el goteo trabaja a baja presión.",
        "Confirmá si necesitás un temporizador incluido o si lo vas a conectar a un controlador existente.",
      ],
      faq: [
        {
          pregunta: "¿Un kit de goteo ahorra agua frente a los aspersores?",
          respuesta:
            "Entrega el agua directo a la raíz y a baja presión, lo que reduce la evaporación y la escorrentía frente al aspersor. Cuánto ahorra depende del cultivo, el suelo y el clima.",
        },
        {
          pregunta: "¿Necesito un regulador de presión para riego por goteo?",
          respuesta:
            "Si la presión de tu red supera la que soportan las líneas de goteo (en general alrededor de 25 PSI), sí. Revisá la ficha técnica del kit.",
        },
        {
          pregunta: "¿Puedo automatizar un kit de goteo?",
          respuesta:
            "Sí: conectándolo a un temporizador o a una válvula comandada por un controlador WiFi.",
        },
      ],
    },
    en: {
      titulo: "Drip Irrigation Kits: ranking and buying guide",
      comoElegir: [
        "Work out how many plants or feet of line you need: each kit states the maximum number of emitters or the length it covers.",
        "Check whether it includes a pressure regulator and a filter: drip systems run at low pressure.",
        "Confirm whether you need an included timer or will connect it to an existing controller.",
      ],
      faq: [
        {
          pregunta: "Does a drip kit save water compared with sprinklers?",
          respuesta:
            "It delivers water straight to the roots at low pressure, which reduces evaporation and runoff compared with a sprinkler. How much it saves depends on the crop, soil and climate.",
        },
        {
          pregunta: "Do I need a pressure regulator for drip irrigation?",
          respuesta:
            "If your mains pressure is higher than what drip lines tolerate (generally around 25 PSI), yes. Check the kit's spec sheet.",
        },
        {
          pregunta: "Can I automate a drip kit?",
          respuesta:
            "Yes: connect it to a timer or to a valve driven by a WiFi controller.",
        },
      ],
    },
  },
  "modulos-rele": {
    es: {
      titulo: "Módulos de relé para riego DIY: ranking y guía",
      comoElegir: [
        "Verificá el voltaje y la corriente que soporta cada canal frente a la carga que vas a conmutar.",
        "Elegí el protocolo según tu sistema: WiFi (por ejemplo eWeLink o Matter), Modbus/RS485 o Zigbee.",
        "Para cargas de 24 V AC, como las válvulas, confirmá que los contactos del relé sean aptos para corriente alterna.",
      ],
      faq: [
        {
          pregunta: "¿Para qué sirve un relé WiFi en un sistema de riego?",
          respuesta:
            "Para encender o apagar una válvula o una bomba desde una app o una automatización, sin cambiar el controlador que ya tenés.",
        },
        {
          pregunta: "¿Un relé puede manejar una bomba directamente?",
          respuesta:
            "Solo si la corriente de la bomba está dentro del límite del relé. Para bombas grandes se usa un contactor accionado por el relé.",
        },
        {
          pregunta: "¿Necesito saber programar para usar un módulo de relé?",
          respuesta:
            "No en los modelos con app propia; sí en integraciones avanzadas como ESPHome o Node-RED.",
        },
      ],
    },
    en: {
      titulo: "Relay Modules for DIY Irrigation: ranking and guide",
      comoElegir: [
        "Check the voltage and current each channel can handle against the load you will switch.",
        "Pick the protocol that fits your system: WiFi (for example eWeLink or Matter), Modbus/RS485 or Zigbee.",
        "For 24 V AC loads such as valves, confirm the relay contacts are rated for alternating current.",
      ],
      faq: [
        {
          pregunta: "What is a WiFi relay for in an irrigation system?",
          respuesta:
            "To switch a valve or a pump on and off from an app or an automation, without replacing the controller you already have.",
        },
        {
          pregunta: "Can a relay drive a pump directly?",
          respuesta:
            "Only if the pump's current is within the relay's rating. For larger pumps a contactor driven by the relay is used.",
        },
        {
          pregunta: "Do I need to program to use a relay module?",
          respuesta:
            "Not with models that have their own app; yes for advanced integrations such as ESPHome or Node-RED.",
        },
      ],
    },
  },
  bombas: {
    es: {
      titulo: "Bombas de riego: ranking y guía de compra",
      comoElegir: [
        "Calculá el caudal y la presión (o altura) que necesita tu sistema antes de mirar la potencia.",
        "Fijate si es autocebante y si es de superficie o sumergible, según dónde esté tu fuente de agua.",
        "Revisá la potencia y el voltaje (por ejemplo 115 o 230 V) que admite tu instalación eléctrica.",
      ],
      faq: [
        {
          pregunta: "¿Cuándo necesito una bomba en un sistema de riego?",
          respuesta:
            "Cuando la presión de la red no alcanza para tus zonas o cuando el agua viene de un pozo, una cisterna o un tanque.",
        },
        {
          pregunta: "¿Qué significa que una bomba sea autocebante?",
          respuesta:
            "Que puede aspirar y llenarse sola de agua sin cebarla a mano cada vez que arranca, dentro de su altura máxima de aspiración.",
        },
        {
          pregunta: "¿Conviene una bomba de superficie o una sumergible?",
          respuesta:
            "La de superficie va fuera del agua y aspira; la sumergible va dentro del pozo o el tanque y empuja el agua. Depende de dónde esté tu fuente.",
        },
      ],
    },
    en: {
      titulo: "Irrigation Pumps: ranking and buying guide",
      comoElegir: [
        "Work out the flow and pressure (or head) your system needs before looking at horsepower.",
        "Check whether it is self-priming and whether it is a surface or submersible type, depending on where your water source is.",
        "Check the power and voltage (for example 115 or 230 V) your electrical installation supports.",
      ],
      faq: [
        {
          pregunta: "When do I need a pump in an irrigation system?",
          respuesta:
            "When mains pressure isn't enough for your zones, or when water comes from a well, a cistern or a tank.",
        },
        {
          pregunta: "What does self-priming mean for a pump?",
          respuesta:
            "It can draw water and fill itself without being primed by hand each time it starts, within its maximum suction lift.",
        },
        {
          pregunta: "Should I choose a surface pump or a submersible one?",
          respuesta:
            "A surface pump sits outside the water and pulls; a submersible one sits inside the well or tank and pushes the water. It depends on where your source is.",
        },
      ],
    },
  },
};
