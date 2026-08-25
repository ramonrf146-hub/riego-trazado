import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticulos, getArticuloPorSlug } from "@/lib/contenido";
import { getCategoriaPorSlug } from "@/lib/categorias";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articulos = await getArticulos();
  return articulos.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const articulo = await getArticuloPorSlug(slug);
  if (!articulo) return {};

  return {
    title: articulo.titulo,
    description: articulo.descripcion,
    alternates: { canonical: `/articulos/${slug}` },
    openGraph: {
      type: "article",
      title: articulo.titulo,
      description: articulo.descripcion,
      publishedTime: articulo.fecha,
    },
  };
}

export default async function ArticuloPage({ params }: Props) {
  const { slug } = await params;
  const articulo = await getArticuloPorSlug(slug);
  if (!articulo) notFound();

  const categoria = articulo.categoria ? getCategoriaPorSlug(articulo.categoria) : undefined;

  const articuloJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: articulo.titulo,
    description: articulo.descripcion,
    datePublished: articulo.fecha,
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articuloJsonLd) }}
      />

      <nav className="font-mono text-xs uppercase tracking-wide text-text-dim">
        <Link href="/articulos" className="hover:text-line">
          Guías
        </Link>{" "}
        / {articulo.titulo}
      </nav>

      {categoria && (
        <Link
          href={`/categorias/${categoria.slug}`}
          className="mt-4 inline-block font-mono text-[11px] uppercase tracking-wide text-line hover:underline"
        >
          {categoria.nombre}
        </Link>
      )}

      <h1 className="mt-2 text-3xl font-semibold text-text-light sm:text-4xl">
        {articulo.titulo}
      </h1>
      <time dateTime={articulo.fecha} className="mt-3 block font-mono text-xs text-text-dim">
        {articulo.fecha}
      </time>

      <div
        className="prose prose-invert prose-headings:font-semibold prose-a:text-line mt-8 max-w-none prose-headings:text-text-light prose-p:text-text-dim prose-li:text-text-dim prose-strong:text-text-light"
        dangerouslySetInnerHTML={{ __html: articulo.contenidoHtml }}
      />
    </article>
  );
}
