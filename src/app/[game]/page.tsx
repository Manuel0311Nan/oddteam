import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GeneratorApp } from "@/components/generator/generator-app";
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
  return {
    title: `Equipos aleatorios para Pokémon ${game.name} · OddTeam`,
    description: `Genera un equipo aleatorio que puedes conseguir de verdad en la historia de Pokémon ${game.name}.`,
    robots: game.publishable ? undefined : { index: false },
  };
}

export default async function GamePage({ params }: { params: Promise<{ game: string }> }) {
  const { game: slug } = await params;
  const game = loadClientGame(slug);
  if (!game) notFound();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1280px] px-4 pt-7 pb-16 sm:px-6">
        <GeneratorApp game={game} />
      </main>
    </>
  );
}
