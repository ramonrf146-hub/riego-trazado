import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import AmazonDisclosureToast from "@/components/AmazonDisclosureToast";
import "./globals.css";

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
  description:
    "Ranking mensual con criterio técnico de controladores WiFi, sensores de humedad, válvulas solenoides, kits de goteo, módulos de relé y bombas para riego automatizado.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "HidroLab",
    title: "HidroLab — Ranking mensual de riego inteligente",
    description:
      "Ranking mensual con criterio técnico de productos para riego automatizado, evaluados como un plano de ingeniería.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-ink text-text-light">
        <GoogleAnalytics />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <AmazonDisclosureToast />
      </body>
    </html>
  );
}
