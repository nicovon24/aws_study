import type { Metadata } from "next";
import { JetBrains_Mono, Source_Sans_3 } from "next/font/google";
import { Suspense } from "react";
import { ExamProvider, LocaleProvider, FavoritesProvider } from "@/hooks";
import AuthProvider from "@/components/providers/AuthProvider";
import { Loader } from "@/components/skeletons";
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
  title: "AWS Prep — CLF-C02 y AIF-C01",
  description:
    "Plataforma de estudio multi-certificación para AWS Certified Cloud Practitioner y AWS Certified AI Practitioner.",
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
            <Suspense fallback={<Loader label="AWS PREP" />}>
              <ExamProvider>
                <FavoritesProvider>{children}</FavoritesProvider>
              </ExamProvider>
            </Suspense>
          </LocaleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
