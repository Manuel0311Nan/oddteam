import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RouteApp } from "@/components/route/route-app";
import { GameNav } from "@/components/site/game-nav";
import { SiteHeader } from "@/components/site/site-header";
import { listGames, loadClientGame } from "@/lib/game-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return listGames().map((g) => ({ game: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ game: string }> }): Promise<Metadata> {
  const { game: slug } = await params;
  const game = listGames().find((g) => g.slug === slug);
  if (!game) return {};
  const title = `Qué capturar en cada tramo de Pokémon ${game.name} · OddTeam`;
  const description = `Recomendaciones de captura antes de cada gimnasio de Pokémon ${game.name}: para quedarse o para salir del paso.`;
  return {
    title,
    description,
    openGraph: { title, description, url: `/${slug}/ruta` },
    robots: game.publishable ? undefined : { index: false },
  };
}

export default async function RoutePage({ params }: { params: Promise<{ game: string }> }) {
  const { game: slug } = await params;
  const game = loadClientGame(slug);
  if (!game) notFound();

  return (
    <>
      <SiteHeader />
      <GameNav slug={slug} current="/ruta" />
      <main className="mx-auto max-w-[1280px] px-4 pt-6 pb-16 sm:px-6">
        <RouteApp game={game} />
      </main>
    </>
  );
}
