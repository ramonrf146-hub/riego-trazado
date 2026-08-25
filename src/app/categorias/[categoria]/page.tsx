import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CATEGORIAS, getCategoriaPorSlug } from "@/lib/categorias";
import { getProductosPorCategoria } from "@/lib/productos";
import ProductCard from "@/components/ProductCard";

interface Props {
  params: Promise<{ categoria: string }>;
}

export function generateStaticParams() {
  return CATEGORIAS.map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria: slug } = await params;
  const categoria = getCategoriaPorSlug(slug);
  if (!categoria) return {};

  return {
    title: `Ranking de ${categoria.nombre}`,
    description: `Ranking mensual de ${categoria.nombre.toLowerCase()} para riego automatizado: ${categoria.descripcion}`,
    alternates: { canonical: `/categorias/${categoria.slug}` },
  };
}

export default async function CategoriaPage({ params }: Props) {
  const { categoria: slug } = await params;
  const categoria = getCategoriaPorSlug(slug);
  if (!categoria) notFound();

  const productos = await getProductosPorCategoria(categoria.slug);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Ranking de ${categoria.nombre} — Riego Trazado`,
    itemListElement: productos.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: p.nombre,
        sku: p.asin,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: p.rating,
          reviewCount: p.numResenas,
        },
        offers:
          p.precioMax && p.precioMax > p.precio
            ? {
                "@type": "AggregateOffer",
                lowPrice: p.precio,
                highPrice: p.precioMax,
                priceCurrency: p.moneda,
                url: p.urlAfiliado,
              }
            : {
                "@type": "Offer",
                price: p.precio,
                priceCurrency: p.moneda,
                url: p.urlAfiliado,
              },
      },
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <nav className="font-mono text-xs uppercase tracking-wide text-text-dim">
        <Link href="/" className="hover:text-line">
          Inicio
        </Link>{" "}
        / {categoria.nombre}
      </nav>

      <p className="mt-4 font-mono text-xs uppercase tracking-wide text-accent">
        Ranking del mes
      </p>
      <h1 className="mt-2 text-3xl font-semibold text-text-light">
        {categoria.nombre}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-dim">
        {categoria.descripcion}
      </p>

      {productos.length === 0 ? (
        <p className="mt-10 text-sm text-text-dim">
          Aún no hay productos rankeados en esta categoría.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {productos.map((producto) => (
            <ProductCard key={producto.asin} producto={producto} />
          ))}
        </div>
      )}
    </div>
  );
}
