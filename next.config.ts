import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El alias por defecto de Vercel sirve una copia completa del sitio; se redirige
  // al dominio real para no duplicar contenido ni repartir enlaces entre dos hosts.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "riego-trazado.vercel.app" }],
        destination: "https://www.riegocom.uk/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
