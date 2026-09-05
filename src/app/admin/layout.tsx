import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import AmazonDisclosureToast from "@/components/AmazonDisclosureToast";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://riegocom.uk";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "HidroLab — Ranking mensual de riego inteligente",
    template: "%s | HidroLab",
  },
  robots: { index: false, follow: false },
};

/**
 * Layout propio para /admin: el layout raíz vive ahora en
 * `src/app/[lang]/layout.tsx` (solo aplica a rutas localizadas), así que
 * /admin —que no está bajo [lang] y debe permanecer en español, sin
 * selector de idioma— necesita su propio <html>/<body>. Es una copia
 * intencional del layout raíz original: misma fuente, mismos estilos
 * globales, mismos componentes de shell. No usar `t()`/`withLocale` acá.
 */
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-ink text-text-light">
        <GoogleAnalytics />
        <Header locale="es" />
        <main className="flex-1">{children}</main>
        <Footer locale="es" />
        <AmazonDisclosureToast />
      </body>
    </html>
  );
}
