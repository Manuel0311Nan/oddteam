import { ImageResponse } from "next/og";
import { OG_SIZE, OgCard } from "@/components/site/og-card";
import { listGames } from "@/lib/game-data";

export const alt = "Equipo aleatorio para la historia de un juego Pokémon";
export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamicParams = false;

export function generateStaticParams() {
  return listGames().map((g) => ({ game: g.slug }));
}

/** One image per game; shared teams use it too (a per-team image would need a dynamic route). */
export default async function Image({ params }: { params: Promise<{ game: string }> }) {
  const { game: slug } = await params;
  const game = listGames().find((g) => g.slug === slug);
  return new ImageResponse(
    <OgCard
      eyebrow={`Pokémon ${game?.name ?? ""}`}
      title="Tu próximo equipo, distinto cada vez"
      subtitle="Válido para la historia: dónde capturarlo, cuándo llega y cómo le irá contra cada jefe."
    />,
    size,
  );
}
