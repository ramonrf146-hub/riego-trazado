import { glosarioParaProducto } from "@/lib/glosario";
import type { Producto } from "@/lib/tipos";

/**
 * Traduce y explica en criollo la jerga en inglés que aparece en un
 * producto (RS485, Dry Contact, Gauge, etc.) para que el técnico pueda
 * usar el vocabulario correcto frente a un cliente o un manual.
 */
export default function GlosarioDeCampo({ producto }: { producto: Producto }) {
  const textoBusqueda = [producto.nombre, ...(producto.tags ?? []), producto.notaTecnica].join(" ");
  const terminos = glosarioParaProducto(textoBusqueda);

  if (terminos.length === 0) return null;

  return (
    <section className="mt-10 rounded-3xl border border-line-dim bg-ink-2 p-6">
      <p className="font-mono text-xs font-semibold uppercase tracking-wide text-accent-2">
        Glosario de campo
      </p>
      <h2 className="mt-2 text-lg font-bold text-text-light">
        Términos en inglés que vas a escuchar con este equipo
      </h2>
      <p className="mt-1 text-sm text-text-dim">
        Para que puedas usar el vocabulario correcto frente a un cliente, un
        proveedor o un manual en inglés.
      </p>

      <dl className="mt-5 space-y-4">
        {terminos.map((termino, i) => (
          <div
            key={termino.terminoEn}
            className={i > 0 ? "border-t border-line-dim/40 pt-4" : ""}
          >
            <dt className="text-sm font-bold text-text-light">
              {termino.terminoEn}{" "}
              <span className="font-medium text-accent-2">— {termino.terminoEs}</span>
            </dt>
            <dd className="mt-1 text-sm leading-relaxed text-text-dim">
              {termino.definicion}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
