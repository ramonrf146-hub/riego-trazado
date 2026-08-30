import { ImageResponse } from "next/og";

export const alt = "HidroLab — Ranking mensual de riego inteligente";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
          backgroundImage:
            "linear-gradient(135deg, #0f172a 0%, #0f172a 60%, #1e293b 100%)",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 28 28" fill="none">
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
            marginTop: 36,
            fontSize: 72,
            fontWeight: 800,
            color: "#f8fafc",
            letterSpacing: "-0.02em",
          }}
        >
          HIDRO<span style={{ color: "#f59e0b" }}>_</span>LAB
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 30,
            color: "#94a3b8",
          }}
        >
          Ranking mensual de riego automatizado
        </div>
      </div>
    ),
    { ...size }
  );
}
