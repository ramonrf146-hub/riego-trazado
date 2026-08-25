"use client";

import { useState } from "react";

export default function NewsletterBand() {
  const [estado, setEstado] = useState<"idle" | "enviado">("idle");

  function manejarEnvio(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    // TODO: conectar a proveedor de newsletter (ej. Buttondown, ConvertKit).
    setEstado("enviado");
  }

  return (
    <section className="bg-paper text-ink">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-ink/60">
            Ranking mensual por correo
          </p>
          <h2 className="mt-2 max-w-md text-xl font-semibold sm:text-2xl">
            Recibe el ranking del mes antes que nadie
          </h2>
          <p className="mt-2 max-w-md text-sm text-ink/70">
            Un correo al mes con los cambios de ranking y las notas técnicas
            nuevas. Sin spam.
          </p>
        </div>

        {estado === "enviado" ? (
          <p className="font-mono text-sm text-accent">
            Listo — revisa tu correo para confirmar.
          </p>
        ) : (
          <form
            onSubmit={manejarEnvio}
            className="flex w-full max-w-sm flex-col gap-2 sm:flex-row"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Correo electrónico
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="tu@correo.com"
              className="w-full rounded-sm border border-ink/20 bg-paper-dim px-3 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-ink/50 focus:outline-none"
            />
            <button
              type="submit"
              className="whitespace-nowrap rounded-sm bg-ink px-4 py-2.5 font-mono text-xs font-medium uppercase tracking-wide text-text-light transition-opacity hover:opacity-90"
            >
              Suscribirme
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
