import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OddTeam — Equipos Pokémon aleatorios y válidos",
  description:
    "Genera equipos aleatorios que puedes conseguir de verdad en la historia de tu juego Pokémon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${bricolage.variable} ${jetbrains.variable}`}>
        {children}
      </body>
    </html>
  );
}
