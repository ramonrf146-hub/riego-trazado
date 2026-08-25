import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPagina } from "@/lib/contenido";

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await getPagina("privacidad");
  if (!pagina) return {};

  return {
    title: pagina.titulo,
    description: pagina.descripcion,
    alternates: { canonical: "/privacidad" },
  };
}

export default async function PrivacidadPage() {
  const pagina = await getPagina("privacidad");
  if (!pagina) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-text-light">{pagina.titulo}</h1>
      <div
        className="prose prose-invert prose-headings:font-semibold prose-a:text-line mt-8 max-w-none prose-headings:text-text-light prose-p:text-text-dim prose-li:text-text-dim prose-strong:text-text-light"
        dangerouslySetInnerHTML={{ __html: pagina.contenidoHtml }}
      />
    </div>
  );
}
