import { ImageResponse } from "next/og";
import { getProductoPorAsin } from "@/lib/productos";
import { getCategoriaPorSlug } from "@/lib/categorias";

export const runtime = "nodejs";

const SIZE = { width: 1000, height: 1500 };

function Estrellas({ rating }: { rating: number }) {
  const llenas = Math.round(rating);
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="30" height="30" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2.5 L14.6 9 L21.5 9.4 L16.1 13.8 L18 20.5 L12 16.7 L6 20.5 L7.9 13.8 L2.5 9.4 L9.4 9 Z"
            fill={i < llenas ? "#f59e0b" : "none"}
            stroke="#f59e0b"
            strokeWidth="1.5"
          />
        </svg>
      ))}
    </div>
  );
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ asin: string }> }
) {
  const { asin } = await params;
  const producto = await getProductoPorAsin(asin);

  if (!producto) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0f172a",
            color: "#f8fafc",
            fontSize: 40,
          }}
        >
          HidroLab
        </div>
      ),
      { ...SIZE }
    );
  }

  const categoria = getCategoriaPorSlug(producto.categoria);
  const nombreFontSize = producto.nombre.length > 60 ? 40 : 48;
  const precioTexto =
    producto.precioMax !== undefined
      ? `Desde $${producto.precio.toFixed(2)}`
      : `$${producto.precio.toFixed(2)}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0f172a",
          backgroundImage:
            "linear-gradient(160deg, #0f172a 0%, #0f172a 55%, #1e293b 100%)",
          padding: "64px 56px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <svg width="56" height="56" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="12.5" stroke="#22d3ee" strokeWidth="1.5" />
            <path
              d="M14 4 L14 12 M14 16 L14 24 M4 14 L12 14 M16 14 L24 14"
              stroke="#22d3ee"
              strokeWidth="1.5"
            />
            <path d="M14 9 C11 12, 11 16, 14 19 C17 16, 17 12, 14 9 Z" fill="#f59e0b" />
          </svg>
          <div
            style={{
              display: "flex",
              marginLeft: 16,
              fontSize: 30,
              fontWeight: 800,
              color: "#f8fafc",
              letterSpacing: "-0.02em",
            }}
          >
            HIDRO<span style={{ color: "#f59e0b" }}>_</span>LAB
          </div>
          {categoria && (
            <div
              style={{
                display: "flex",
                marginLeft: "auto",
                fontSize: 20,
                fontWeight: 700,
                color: "#0f172a",
                background: "#f59e0b",
                borderRadius: 999,
                padding: "8px 18px",
              }}
            >
              #{producto.ranking} en {categoria.nombre}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f8fafc",
            borderRadius: 32,
            padding: 40,
            height: 560,
          }}
        >
          <img
            src={producto.imagen}
            width={520}
            height={480}
            style={{ objectFit: "contain" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: nombreFontSize,
              fontWeight: 800,
              color: "#f8fafc",
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
            }}
          >
            {producto.nombre}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Estrellas rating={producto.rating} />
            <div style={{ display: "flex", fontSize: 24, color: "#94a3b8" }}>
              {producto.rating} ({producto.numResenas} reseñas)
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 52, fontWeight: 800, color: "#22d3ee" }}>
            {precioTexto}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "2px solid #1e293b",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", fontSize: 26, color: "#f8fafc", fontWeight: 700 }}>
            Ver ficha completa →
          </div>
          <div style={{ display: "flex", fontSize: 22, color: "#64748b" }}>
            riegocom.uk
          </div>
        </div>
      </div>
    ),
    { ...SIZE }
  );
}
