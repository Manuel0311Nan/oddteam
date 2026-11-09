import { ImageResponse } from "next/og";
import { OG_SIZE, OgCard } from "@/components/site/og-card";

export const alt = "OddTeam: equipos Pokémon aleatorios y válidos para la historia";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <OgCard
      eyebrow="Equipos aleatorios y válidos"
      title="Deja de jugar siempre con el mismo equipo"
      subtitle="Equipos que puedes conseguir de verdad en la historia, con análisis de cada combate."
    />,
    size,
  );
}
