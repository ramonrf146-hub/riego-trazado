"use client";

import type { Producto } from "@/lib/tipos";
import { registrarClicAfiliado } from "@/lib/analitica";

function IconoFlecha() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

interface Props {
  producto: Producto;
  etiqueta: string;
  id?: string;
  className?: string;
}

export default function BotonAfiliado({ producto, etiqueta, id, className }: Props) {
  return (
    <a
      id={id}
      href={producto.urlAfiliado}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      onClick={() => registrarClicAfiliado(producto)}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-3.5 text-sm font-bold text-ink shadow-lg shadow-accent/30 transition-transform active:scale-[0.98] ${className ?? ""}`}
    >
      {etiqueta}
      <IconoFlecha />
    </a>
  );
}
