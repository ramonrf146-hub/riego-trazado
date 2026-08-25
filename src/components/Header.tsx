import Link from "next/link";
import { CATEGORIAS } from "@/lib/categorias";

function LogoValvula() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="14" cy="14" r="12.5" stroke="var(--line)" strokeWidth="1.5" />
      <path
        d="M14 4 L14 12 M14 16 L14 24 M4 14 L12 14 M16 14 L24 14"
        stroke="var(--line)"
        strokeWidth="1.5"
      />
      <path
        d="M14 9 C11 12, 11 16, 14 19 C17 16, 17 12, 14 9 Z"
        fill="var(--accent)"
      />
    </svg>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line-dim/60 bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <LogoValvula />
          <span className="font-mono text-sm font-medium tracking-wide text-text-light sm:text-base">
            RIEGO<span className="text-accent">_</span>TRAZADO
          </span>
        </Link>

        <nav
          aria-label="Categorías"
          className="hidden items-center gap-5 overflow-x-auto font-mono text-xs uppercase tracking-wide text-text-dim md:flex"
        >
          {CATEGORIAS.map((categoria) => (
            <Link
              key={categoria.slug}
              href={`/categorias/${categoria.slug}`}
              className="whitespace-nowrap transition-colors hover:text-line"
            >
              {categoria.nombre}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-wide">
          <Link
            href="/articulos"
            className="hidden text-text-dim transition-colors hover:text-line sm:inline"
          >
            Guías
          </Link>
          <Link
            href="/#ranking"
            className="rounded-sm border border-accent/70 px-3 py-1.5 text-accent transition-colors hover:bg-accent hover:text-ink"
          >
            Ver ranking
          </Link>
        </div>
      </div>
    </header>
  );
}
