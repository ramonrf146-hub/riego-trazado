import type { Metadata } from "next";
import { JetBrains_Mono, Public_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://riegocom.uk";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Riego Trazado — Ranking mensual de riego inteligente",
    template: "%s | Riego Trazado",
  },
  description:
    "Ranking mensual con criterio técnico de controladores WiFi, sensores de humedad, válvulas solenoides, kits de goteo, módulos de relé y bombas para riego automatizado.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Riego Trazado",
    title: "Riego Trazado — Ranking mensual de riego inteligente",
    description:
      "Ranking mensual con criterio técnico de productos para riego automatizado, evaluados como un plano de ingeniería.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${jetbrainsMono.variable} ${publicSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-text-light">
        <GoogleAnalytics />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
