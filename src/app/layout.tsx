import type { Metadata } from "next";
import { Fredoka, JetBrains_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site/site-footer";
import { SITE_NAME, siteUrl } from "@/lib/site";
import "./globals.css";

// Fredoka: rounded and friendly (D-025). Variable font, weights 300–700.
const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: "OddTeam — Equipos Pokémon aleatorios y válidos",
  description:
    "Genera equipos aleatorios que puedes conseguir de verdad en la historia de tu juego Pokémon.",
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "es_ES",
    title: "OddTeam — Equipos Pokémon aleatorios y válidos",
    description: "Genera equipos aleatorios que puedes conseguir de verdad en la historia de tu juego Pokémon.",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${fredoka.variable} ${jetbrains.variable} flex min-h-dvh flex-col`}>
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
