import Link from "next/link";
import { CATEGORIAS } from "@/lib/categorias";

export default function Footer() {
  return (
    <footer className="border-t border-line-dim/60 bg-ink-2">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="font-mono text-sm font-medium text-text-light">
              HIDRO<span className="text-accent">_</span>LAB
            </p>
            <p className="mt-3 max-w-xs text-sm text-text-dim">
              Ranking mensual de riego automatizado evaluado con criterio de
              ingeniería, no solo popularidad.
            </p>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-line">
              Categorías
            </p>
            <ul className="mt-3 space-y-2 text-sm text-text-dim">
              {CATEGORIAS.map((categoria) => (
                <li key={categoria.slug}>
                  <Link
                    href={`/categorias/${categoria.slug}`}
                    className="transition-colors hover:text-text-light"
                  >
                    {categoria.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-line">
              Sitio
            </p>
            <ul className="mt-3 space-y-2 text-sm text-text-dim">
              <li>
                <Link href="/articulos" className="transition-colors hover:text-text-light">
                  Guías y artículos
                </Link>
              </li>
              <li>
                <Link href="/acerca-de" className="transition-colors hover:text-text-light">
                  Acerca de
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="transition-colors hover:text-text-light">
                  Política de privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-line-dim/40 pt-6">
          <p className="text-xs leading-relaxed text-text-dim">
            <strong className="text-text-light">Aviso de afiliación:</strong>{" "}
            HidroLab es un participante en el Programa de Afiliados de
            Amazon Services LLC, un programa de publicidad de afiliados
            diseñado para proporcionar un medio para que los sitios obtengan
            comisiones por publicidad, publicitando y enlazando a
            Amazon.com. Como Afiliado de Amazon, ganamos por compras
            calificadas. Los precios mostrados son referenciales y pueden
            cambiar — el precio real solo se confirma en Amazon.
          </p>
          <p className="mt-4 text-xs text-text-dim/70">
            © {new Date().getFullYear()} HidroLab. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
