"use client";

import { useState } from "react";
import Link from "next/link";
import type { Producto } from "@/lib/tipos";
import { CATEGORIAS } from "@/lib/categorias";

/**
 * Quiz de 2 pasos: elegís categoría, después elegís la opción de
 * "idealPara" que más se parece a tu situación, y te muestra el
 * producto correspondiente. Reutiliza el campo idealPara que ya
 * escribimos para cada producto — no hay lógica nueva que mantener
 * cuando se suma un producto, solo hace falta que tenga idealPara.
 */
export default function BuscadorDeProducto({ productos }: { productos: Producto[] }) {
  const [categoria, setCategoria] = useState<string | null>(null);
  const [resultado, setResultado] = useState<Producto | null>(null);

  const opcionesCategoria = categoria
    ? productos.filter((p) => p.categoria === categoria && p.idealPara)
    : [];

  function reiniciar() {
    setCategoria(null);
    setResultado(null);
  }

  return (
    <section className="rounded-3xl border border-line-dim bg-ink-2 p-6 sm:p-8">
      <p className="font-mono text-xs font-semibold uppercase tracking-wide text-accent">
        Buscador rápido
      </p>
      <h2 className="mt-2 text-xl font-bold text-text-light sm:text-2xl">
        ¿Qué producto te conviene?
      </h2>
      <p className="mt-2 text-sm text-text-dim">
        Dos clics y te decimos cuál del ranking se ajusta mejor a tu caso.
      </p>

      {resultado ? (
        <div className="mt-5">
          <p className="text-sm text-text-dim">
            Según lo que elegiste, este es el que más te conviene:
          </p>
          <div className="mt-4 flex items-center gap-4 rounded-2xl border border-line bg-ink p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resultado.imagen}
              alt={resultado.nombre}
              className="h-20 w-20 shrink-0 rounded-lg bg-image-bg object-contain p-1"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-text-light">{resultado.nombre}</p>
              <p className="text-sm text-text-dim">${resultado.precio.toFixed(2)} · precio referencial</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={`/productos/${resultado.asin}`}
              className="rounded-full bg-accent px-4 py-2.5 text-xs font-bold text-ink transition-opacity hover:opacity-90"
            >
              Ver guía completa
            </Link>
            <button
              type="button"
              onClick={reiniciar}
              className="rounded-full border border-line-dim px-4 py-2.5 text-xs font-semibold text-text-dim hover:text-text-light"
            >
              Empezar de nuevo
            </button>
          </div>
        </div>
      ) : categoria ? (
        <div className="mt-5">
          <p className="mb-3 text-sm text-text-dim">
            Elegí la opción que más se parece a tu situación:
          </p>
          <div className="flex flex-col gap-2">
            {opcionesCategoria.map((p) => (
              <button
                key={p.asin}
                type="button"
                onClick={() => setResultado(p)}
                className="rounded-xl border border-line-dim bg-ink px-4 py-3 text-left text-sm text-text-light transition-colors hover:border-line"
              >
                {p.idealPara}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setCategoria(null)}
            className="mt-4 text-xs text-text-dim hover:text-text-light"
          >
            ← Volver
          </button>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {CATEGORIAS.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setCategoria(c.slug)}
              className="rounded-xl border border-line-dim bg-ink px-4 py-3 text-left text-sm font-semibold text-text-light transition-colors hover:border-line"
            >
              {c.nombre}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
