export interface TerminoGlosario {
  terminoEn: string;
  terminoEs: string;
  definicion: string;
  /** Palabras/frases que, si aparecen en el nombre, tags o nota técnica del producto (sin distinguir mayúsculas), activan este término. */
  palabrasClave: string[];
}

/**
 * Diccionario compartido de jerga técnica en inglés. Se filtra por
 * producto en GlosarioDeCampo — no todo término aplica a todo producto.
 */
export const GLOSARIO: TerminoGlosario[] = [
  {
    terminoEn: "RS485",
    terminoEs: "RS485 (bus serial industrial)",
    definicion:
      "Un par de cables por donde varios equipos industriales se turnan para \"hablar\" con una sola computadora — como una línea telefónica compartida donde cada aparato tiene su propio número.",
    palabrasClave: ["rs485"],
  },
  {
    terminoEn: "Modbus",
    terminoEs: "Modbus",
    definicion:
      "El \"idioma\" que usan la mayoría de los equipos industriales para reportar datos — define cómo se arma el mensaje, sin importar si viaja por cable serial (RTU) o por red (TCP).",
    palabrasClave: ["modbus"],
  },
  {
    terminoEn: "PoE (Power over Ethernet)",
    terminoEs: "PoE — Alimentación por Ethernet",
    definicion:
      "El mismo cable de red que lleva los datos también lleva la corriente eléctrica, así no hace falta un enchufe cerca del equipo.",
    palabrasClave: ["poe"],
  },
  {
    terminoEn: "Dry Contact",
    terminoEs: "Contacto seco",
    definicion:
      "Un interruptor que solo abre o cierra un circuito, sin importarle el voltaje del otro lado — como el dedo de un robot que aprieta un botón ajeno.",
    palabrasClave: ["contacto seco", "dry contact"],
  },
  {
    terminoEn: "Variable Frequency Drive (VFD)",
    terminoEs: "Variador de frecuencia (VFD)",
    definicion:
      "El \"acelerador\" de un motor eléctrico: regula la velocidad en vez de solo prenderlo o apagarlo a máxima potencia.",
    palabrasClave: ["vfd", "variador de frecuencia", "control vectorial"],
  },
  {
    terminoEn: "Soft Starter",
    terminoEs: "Arrancador suave",
    definicion:
      "Suaviza el momento de arranque de un motor grande para que no dé un \"tirón\" eléctrico — el motor termina girando a velocidad fija, a diferencia de un VFD que regula velocidad todo el tiempo.",
    palabrasClave: ["arrancador suave", "soft starter"],
  },
  {
    terminoEn: "DIN Rail",
    terminoEs: "Riel DIN",
    definicion:
      "Una tira metálica ranurada donde se enganchan los componentes de un tablero eléctrico sin tornillos, para que queden ordenados y sea fácil cambiarlos.",
    palabrasClave: ["riel din", "din rail", "ts35"],
  },
  {
    terminoEn: "Optocoupler",
    terminoEs: "Optoacoplador",
    definicion:
      "Una pieza que separa eléctricamente dos circuitos (uno chico y uno grande) usando luz en vez de cable directo — como un guante de goma que evita tocar un cable pelado.",
    palabrasClave: ["optoacoplador", "optocoupler"],
  },
  {
    terminoEn: "GFCI (Ground Fault Circuit Interrupter)",
    terminoEs: "GFCI — Disyuntor diferencial",
    definicion:
      "Corta la corriente apenas detecta que parte de ella se está yendo por un camino que no debería (como a través de una persona), protegiendo contra descargas.",
    palabrasClave: ["gfci"],
  },
  {
    terminoEn: "AWG (American Wire Gauge)",
    terminoEs: "AWG — Calibre de cable",
    definicion:
      "La escala que mide el grosor de un cable — a menor número, más grueso el cable y más corriente soporta.",
    palabrasClave: ["awg", "gauge"],
  },
  {
    terminoEn: "IP Rating",
    terminoEs: "Grado de protección IP",
    definicion:
      "Un código de dos números que indica qué tan protegido está un equipo contra polvo (primer número) y agua (segundo número) — más alto, más protegido.",
    palabrasClave: ["ip65", "ip20", "ip44", "ip67"],
  },
  {
    terminoEn: "HVAC",
    terminoEs: "HVAC — Climatización",
    definicion:
      "Sigla en inglés para calefacción, ventilación y aire acondicionado — el sistema completo que regula la temperatura de un espacio.",
    palabrasClave: ["hvac"],
  },
  {
    terminoEn: "Matter",
    terminoEs: "Matter (estándar de casa inteligente)",
    definicion:
      "Un estándar que permite que dispositivos de distintas marcas (Alexa, Google Home, Apple Home) se controlen entre sí sin depender de una sola app.",
    palabrasClave: ["matter"],
  },
  {
    terminoEn: "Normally Open / Normally Closed (NO/NC)",
    terminoEs: "Normalmente abierto / cerrado (NO/NC)",
    definicion:
      "Describe el estado por defecto de un interruptor o válvula cuando no recibe ninguna señal — \"cerrado\" significa que no deja pasar nada hasta que se lo active.",
    palabrasClave: ["no/nc", "normalmente cerrada", "normalmente abierta"],
  },
  {
    terminoEn: "TVS (Transient Voltage Suppressor)",
    terminoEs: "Protección TVS",
    definicion:
      "Un componente que absorbe picos repentinos de voltaje (como los de una tormenta eléctrica) antes de que dañen el resto del circuito.",
    palabrasClave: ["tvs"],
  },
  {
    terminoEn: "Capacitive Probe",
    terminoEs: "Sonda capacitiva",
    definicion:
      "Mide humedad usando un campo eléctrico en vez de contacto metálico directo — por eso no se corroe con el tiempo como las sondas más baratas.",
    palabrasClave: ["capacitiva", "capacitive"],
  },
  {
    terminoEn: "Self-Priming",
    terminoEs: "Autocebante",
    definicion:
      "Una bomba que puede sacar el aire de su propia tubería sola al arrancar, sin necesitar que la llenes de agua a mano antes de prenderla.",
    palabrasClave: ["autocebante", "self-priming", "self priming"],
  },
  {
    terminoEn: "GPH (Gallons Per Hour)",
    terminoEs: "GPH — Galones por hora",
    definicion:
      "La cantidad de agua que una bomba puede mover en una hora — a mayor GPH, más rápido llena o vacía un espacio.",
    palabrasClave: ["gph"],
  },
  {
    terminoEn: "PSI (Pounds per Square Inch)",
    terminoEs: "PSI — Libras por pulgada cuadrada",
    definicion:
      "La unidad con la que se mide la presión del agua — cuanto más alto el número, más fuerza tiene el chorro.",
    palabrasClave: ["psi"],
  },
  {
    terminoEn: "Solenoid Valve",
    terminoEs: "Válvula solenoide",
    definicion:
      "Una válvula que se abre o cierra sola al recibir una señal eléctrica, en vez de necesitar que alguien la gire a mano.",
    palabrasClave: ["solenoide", "solenoid"],
  },
];

/** Filtra el glosario según el texto real de un producto (nombre + tags + nota técnica). */
export function glosarioParaProducto(textoBusqueda: string, maximo = 4): TerminoGlosario[] {
  const texto = textoBusqueda.toLowerCase();
  return GLOSARIO.filter((termino) =>
    termino.palabrasClave.some((clave) => texto.includes(clave))
  ).slice(0, maximo);
}
