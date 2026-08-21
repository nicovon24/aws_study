import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "aws-map — nico@cloud-practitioner",
  description: "Mapa interactivo de servicios AWS para el track CLF-C02.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
