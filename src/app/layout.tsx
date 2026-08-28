import type { Metadata } from "next";
import { JetBrains_Mono, Source_Sans_3 } from "next/font/google";
import { LocaleProvider, FavoritesProvider } from "@/hooks";
import AuthProvider from "@/components/providers/AuthProvider";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AWS Prep — CLF-C02",
  description:
    "Mapa interactivo de servicios AWS para el track CLF-C02. Proyecto personal de estudio, no afiliado ni patrocinado por Amazon Web Services, Inc.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${sourceSans.variable} ${jetBrainsMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Tells the Dark Reader extension to leave this page alone — the app already ships its own dark theme. */}
        <meta name="darkreader-lock" />
      </head>
      <body>
        <AuthProvider>
          <LocaleProvider>
            <FavoritesProvider>{children}</FavoritesProvider>
          </LocaleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
