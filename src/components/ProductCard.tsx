import type { Producto } from "@/lib/tipos";
import { getCategoriaPorSlug } from "@/lib/categorias";

function Estrella({ llena, mitad }: { llena?: boolean; mitad?: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 20 20" aria-hidden="true">
      <defs>
        <linearGradient id="mediaEstrella">
          <stop offset="50%" stopColor="var(--accent)" />
          <stop offset="50%" stopColor="var(--line-dim)" />
        </linearGradient>
      </defs>
      <path
        d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6z"
        fill={mitad ? "url(#mediaEstrella)" : llena ? "var(--accent)" : "var(--line-dim)"}
      />
    </svg>
  );
}

function Rating({ rating, numResenas }: { rating: number; numResenas: number }) {
  const llenas = Math.floor(rating);
  const mitad = rating - llenas >= 0.5;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Estrella key={i} llena={i < llenas} mitad={i === llenas && mitad} />
        ))}
      </div>
      <span className="font-mono text-[11px] text-text-dim">
        {rating.toFixed(1)} · {numResenas.toLocaleString("es")}
      </span>
    </div>
  );
}

export default function ProductCard({ producto }: { producto: Producto }) {
  const categoria = getCategoriaPorSlug(producto.categoria);

  return (
    <article className="group flex flex-col overflow-hidden rounded-sm border border-line-dim/50 bg-paper text-ink transition-colors hover:border-line">
      <div className="relative flex items-center justify-between border-b border-line-dim/30 bg-ink px-3 py-2">
        <span className="font-mono text-[11px] uppercase tracking-wide text-text-dim">
          {categoria?.nombre ?? producto.categoria}
        </span>
        <span className="font-mono text-xs font-semibold text-accent">
          #{producto.ranking}
        </span>
      </div>

      <div className="flex aspect-[4/3] items-center justify-center bg-ink-2 text-text-dim">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={producto.imagen}
          alt={producto.nombre}
          loading="lazy"
          className="h-full w-full object-contain p-6 opacity-90"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-sm font-semibold leading-snug text-ink">
          {producto.nombre}
        </h3>

        <Rating rating={producto.rating} numResenas={producto.numResenas} />

        {producto.notaTecnica && (
          <p className="line-clamp-3 text-xs leading-relaxed text-ink/70">
            {producto.notaTecnica}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <div>
            <p className="font-mono text-base font-semibold text-ink">
              {producto.precioMax && producto.precioMax > producto.precio ? (
                <>
                  Desde ${producto.precio.toFixed(2)}{" "}
                  <span className="text-ink/50">— ${producto.precioMax.toFixed(2)}</span>
                </>
              ) : (
                `$${producto.precio.toFixed(2)}`
              )}
            </p>
            <p className="text-[10px] text-ink/50">
              {producto.precioMax && producto.precioMax > producto.precio
                ? "Rango referencial según vendedor/variante — precio final en Amazon"
                : "Precio referencial, ver en Amazon"}
            </p>
          </div>
          <a
            href={producto.urlAfiliado}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="whitespace-nowrap rounded-sm bg-accent px-3 py-2 font-mono text-xs font-medium uppercase tracking-wide text-ink transition-opacity hover:opacity-90"
          >
            Ver en Amazon
          </a>
        </div>
      </div>
    </article>
  );
}
