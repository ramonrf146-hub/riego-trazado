"use client";

import { useEffect, useState } from "react";
import type { Producto } from "@/lib/tipos";
import { registrarClicAfiliado } from "@/lib/analitica";

interface Props {
  producto: Producto;
  nombre: string;
  precioTexto: string;
  etiqueta: string;
  /** Botón principal de arriba: la barra aparece cuando ya se scrolleó más allá. */
  idBotonPrincipal: string;
  /** Botón final de la página: la barra se oculta mientras este está a la vista. */
  idBotonFinal: string;
}

export default function BarraCtaFija({
  producto,
  nombre,
  precioTexto,
  etiqueta,
  idBotonPrincipal,
  idBotonFinal,
}: Props) {
  const [pasoElPrincipal, setPasoElPrincipal] = useState(false);
  const [finalVisible, setFinalVisible] = useState(false);

  useEffect(() => {
    const principal = document.getElementById(idBotonPrincipal);
    const final = document.getElementById(idBotonFinal);
    if (!principal || !final) return;

    const obsPrincipal = new IntersectionObserver(([entrada]) => {
      setPasoElPrincipal(!entrada.isIntersecting && entrada.boundingClientRect.top < 0);
    });
    const obsFinal = new IntersectionObserver(([entrada]) => {
      setFinalVisible(entrada.isIntersecting);
    });
    obsPrincipal.observe(principal);
    obsFinal.observe(final);
    return () => {
      obsPrincipal.disconnect();
      obsFinal.disconnect();
    };
  }, [idBotonPrincipal, idBotonFinal]);

  const visible = pasoElPrincipal && !finalVisible;

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line-dim bg-ink/95 px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-3xl items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-text-light">{nombre}</p>
          <p className="text-sm font-bold text-text-light">{precioTexto}</p>
        </div>
        <a
          href={producto.urlAfiliado}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          tabIndex={visible ? 0 : -1}
          onClick={() => registrarClicAfiliado(producto)}
          className="shrink-0 rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-ink shadow-md shadow-accent/30 active:scale-[0.98]"
        >
          {etiqueta}
        </a>
      </div>
    </div>
  );
}
