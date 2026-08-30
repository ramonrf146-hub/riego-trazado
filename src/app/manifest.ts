import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HidroLab — Riego automatizado con criterio técnico",
    short_name: "HidroLab",
    description:
      "Ranking mensual con criterio técnico de controladores WiFi, sensores de humedad, válvulas, kits de goteo y bombas para riego automatizado.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#0f172a",
    icons: [
      { src: "/icon-192", sizes: "192x192", type: "image/png" },
      { src: "/icon-512", sizes: "512x512", type: "image/png" },
    ],
  };
}
