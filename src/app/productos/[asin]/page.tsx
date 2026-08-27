import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategoriaPorSlug } from "@/lib/categorias";
import { getProductos, getProductoPorAsin } from "@/lib/productos";
import GlosarioDeCampo from "@/components/GlosarioDeCampo";

interface Props {
  params: Promise<{ asin: string }>;
}

export async function generateStaticParams() {
  const productos = await getProductos();
  return productos.map((p) => ({ asin: p.asin }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { asin } = await params;
  const producto = await getProductoPorAsin(asin);
  if (!producto) return {};

  return {
    title: `${producto.nombre} — Guía de compra`,
    description: producto.guiaCompra?.queEsYParaQueSirve ?? producto.notaTecnica,
    alternates: { canonical: `/productos/${producto.asin}` },
  };
}

export default async function ProductoPage({ params }: Props) {
  const { asin } = await params;
  const producto = await getProductoPorAsin(asin);
  if (!producto) notFound();

  const categoria = getCategoriaPorSlug(producto.categoria);
  const guia = producto.guiaCompra;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <nav className="font-mono text-xs uppercase tracking-wide text-text-dim">
        <Link href="/" className="hover:text-line">
          Inicio
        </Link>{" "}
        {categoria && (
          <>
            /{" "}
            <Link href={`/categorias/${categoria.slug}`} className="hover:text-line">
              {categoria.nombre}
            </Link>{" "}
          </>
        )}
        / Guía de compra
      </nav>

      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="flex h-48 w-full items-center justify-center rounded-2xl bg-image-bg p-4 sm:h-40 sm:w-40 sm:shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={producto.imagen} alt={producto.nombre} className="h-full w-full object-contain" />
        </div>
        <div>
          <h1 className="text-2xl font-bold leading-snug text-text-light sm:text-3xl">
            {producto.nombre}
          </h1>
          <p className="mt-2 text-xs text-text-dim">
            {producto.numResenas > 0
              ? `${producto.rating.toFixed(1)} ★ · ${producto.numResenas.toLocaleString("es")} reseñas`
              : "Sin reseñas todavía"}
          </p>
          <p className="mt-2 text-xl font-bold text-text-light">
            {producto.precioMax && producto.precioMax > producto.precio
              ? `Desde $${producto.precio.toFixed(2)}`
              : `$${producto.precio.toFixed(2)}`}
            <span className="ml-2 align-middle text-[11px] font-normal text-text-dim">
              precio referencial
            </span>
          </p>
          <a
            href={producto.urlAfiliado}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center rounded-2xl bg-accent px-5 py-3 text-sm font-bold text-ink shadow-lg shadow-accent/30 transition-transform active:scale-[0.98]"
          >
            Ver en Amazon
          </a>
        </div>
      </div>

      {guia ? (
        <div className="mt-10 space-y-8 border-t border-line-dim/40 pt-8">
          <section>
            <h2 className="text-lg font-bold text-text-light">¿Qué es y para qué sirve?</h2>
            <p className="mt-2 text-sm leading-relaxed text-text-dim">{guia.queEsYParaQueSirve}</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-light">Ejemplos prácticos de uso</h2>
            <ul className="mt-2 space-y-2 text-sm leading-relaxed text-text-dim">
              <li>
                <span className="font-semibold text-text-light">En casa: </span>
                {guia.ejemploHogar}
              </li>
              <li>
                <span className="font-semibold text-text-light">En un negocio o taller: </span>
                {guia.ejemploNegocio}
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-light">Guía para no equivocarte al comprar</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text-dim">
              {guia.puntosClave.map((punto) => (
                <li key={punto}>{punto}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl bg-line-dim/40 p-5">
            <h2 className="text-lg font-bold text-text-light">El consejo de inversión</h2>
            <p className="mt-2 text-sm leading-relaxed text-text-light">{guia.consejoInversion}</p>
          </section>
        </div>
      ) : (
        producto.notaTecnica && (
          <p className="mt-10 border-t border-line-dim/40 pt-8 text-sm leading-relaxed text-text-dim">
            {producto.notaTecnica}
          </p>
        )
      )}

      <a
        href={producto.urlAfiliado}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        className="mt-10 flex items-center justify-center rounded-2xl bg-accent px-5 py-4 text-base font-bold text-ink shadow-lg shadow-accent/30 transition-transform active:scale-[0.98]"
      >
        Ver precio actual en Amazon
      </a>

      <GlosarioDeCampo producto={producto} />
    </div>
  );
}
