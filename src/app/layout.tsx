import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Million Project - Gestión de Propiedades",
  description:
    "Plataforma para gestión y búsqueda de propiedades inmobiliarias",
  keywords: "propiedades, inmobiliaria, búsqueda, gestión, Colombia",
  authors: [{ name: "Ismael Parra" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
