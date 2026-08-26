"use client";

import { useEffect, useState } from "react";

const CLAVE_VISTO = "ht-disclosure-toast-visto";

/**
 * Toast de disclosure de afiliado: aparece una vez por navegador y se
 * oculta a los pocos segundos (buena UX). El link "Info" queda visible
 * siempre después — Amazon exige que el disclosure esté accesible, no
 * solo que destelle una vez.
 */
export default function AmazonDisclosureToast() {
  const [mostrarToast, setMostrarToast] = useState(false);
  const [mostrarInfo, setMostrarInfo] = useState(false);

  useEffect(() => {
    let yaVisto = false;
    try {
      yaVisto = sessionStorage.getItem(CLAVE_VISTO) === "1";
    } catch {
      // sessionStorage no disponible (modo privado, etc.) — igual mostramos el toast una vez.
    }
    if (yaVisto) return;

    const aparecer = setTimeout(() => {
      setMostrarToast(true);
      try {
        sessionStorage.setItem(CLAVE_VISTO, "1");
      } catch {
        /* no-op */
      }
    }, 1200);

    return () => clearTimeout(aparecer);
  }, []);

  useEffect(() => {
    if (!mostrarToast) return;
    const ocultar = setTimeout(() => setMostrarToast(false), 5000);
    return () => clearTimeout(ocultar);
  }, [mostrarToast]);

  return (
    <>
      {mostrarToast && (
        <div
          role="status"
          className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-sm rounded-2xl border border-line-dim/60 bg-ink-2/95 px-4 py-3 text-center text-xs text-text-dim shadow-xl backdrop-blur transition-transform sm:left-auto sm:right-4"
        >
          Como Afiliado de Amazon, HidroLab gana por compras calificadas.
          Los precios están sujetos a confirmación en Amazon.
        </div>
      )}

      <button
        type="button"
        onClick={() => setMostrarInfo((v) => !v)}
        aria-label="Ver aviso de afiliación de Amazon"
        className="fixed bottom-4 right-4 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-line-dim/60 bg-ink-2/90 text-sm font-bold text-text-dim shadow-lg backdrop-blur transition-colors hover:text-accent"
      >
        i
      </button>

      {mostrarInfo && (
        <div
          role="dialog"
          aria-label="Aviso de afiliación de Amazon"
          className="fixed bottom-16 right-4 z-30 max-w-xs rounded-2xl border border-line-dim/60 bg-ink-2 p-4 text-xs leading-relaxed text-text-dim shadow-xl"
        >
          <strong className="text-text-light">Aviso de afiliación:</strong>{" "}
          HidroLab es un participante en el Programa de Afiliados de Amazon
          Services LLC. Ganamos comisión por compras calificadas realizadas
          a través de nuestros enlaces, sin costo adicional para vos. Los
          precios mostrados son referenciales — el precio real solo se
          confirma en Amazon.
        </div>
      )}
    </>
  );
}
