import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FeaturedTabs, type FeaturedView } from "@/components/featured/featured-tabs";
import { GameNav } from "@/components/site/game-nav";
import { SiteHeader } from "@/components/site/site-header";
import { listGames, loadClientGame, loadFeatured } from "@/lib/game-data";
import { captureEffort } from "@/lib/generator/effort";
import { DIFFICULTIES } from "@/lib/types";
import { encodeUrlState, decodeOptions } from "@/lib/url-state";

export const dynamicParams = false;

export function generateStaticParams() {
  return listGames().map((g) => ({ game: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ game: string }> }): Promise<Metadata> {
  const { game: slug } = await params;
  const game = listGames().find((g) => g.slug === slug);
  if (!game) return {};
  const title = `Equipos destacados para Pokémon ${game.name} por dificultad · OddTeam`;
  const description = `Equipos válidos para la historia de Pokémon ${game.name}, de Paseo a Reto.`;
  return {
    title,
    description,
    openGraph: { title, description, url: `/${slug}/destacados` },
    robots: game.publishable ? undefined : { index: false },
  };
}

export default async function FeaturedPage({ params }: { params: Promise<{ game: string }> }) {
  const { game: slug } = await params;
  const game = loadClientGame(slug);
  if (!game) notFound();
  const featured = loadFeatured(slug);

  // Only what the cards show: names, typings and sprites of the featured members.
  const byFinal = new Map(game.pool.map((p) => [p.finalFormId, p]));
  const order = new Map(game.segments.map((s) => [s.id, s.order]));
  const view: FeaturedView | null = featured
    ? Object.fromEntries(
        DIFFICULTIES.map((level) => [
          level,
          featured.levels[level].map((t) => {
            const entries = t.team.map((id) => byFinal.get(id)).filter((e) => e !== undefined);
            const last = Math.max(...entries.map((e) => order.get(e.firstAvailable) ?? 0));
            const options = decodeOptions(t.options);
            const query = options
              ? encodeUrlState({ seed: t.seed, options, locked: t.team, dataVersion: featured.dataVersion }).toString()
              : "";
            return {
              key: `${t.seed}`,
              score: t.score,
              level: t.level,
              components: t.components,
              effort: captureEffort(entries),
              completeIn: game.segments.find((s) => s.order === last)?.label ?? "",
              href: `/${slug}?${query}`,
              members: t.team.map((id) => {
                const s = game.species[id];
                return { id, name: s?.name ?? `#${id}`, sprite: s?.sprite ?? null, typing: s?.typing ?? ["normal"] };
              }),
            };
          }),
        ]),
      ) as FeaturedView
    : null;

  return (
    <>
      <SiteHeader />
      <GameNav slug={slug} current="/destacados" />
      <main className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 pt-6 pb-16 sm:px-6">
        {!game.publishable ? (
          <p className="rounded-xl border border-dashed border-[#BDB5A6] bg-card px-4 py-3 text-sm">
            <strong>Borrador:</strong> los datos de {game.name} están en revisión y pueden contener errores.
          </p>
        ) : null}
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-muted-foreground">Pokémon {game.name}</span>
          <h1 className="text-4xl font-extrabold leading-none tracking-tight sm:text-[40px]">Equipos destacados</h1>
          <p className="max-w-[68ch] text-[15px] text-muted-foreground">
            Equipos válidos elegidos entre {featured?.samples.toLocaleString("es-ES") ?? "miles de"} generados con las opciones por
            defecto, sin repetir mucho los mismos Pokémon. La dificultad mide los combates, no lo que cuesta capturarlos.
          </p>
        </div>
        {view ? (
          <FeaturedTabs view={view} typeNames={game.typeNames} />
        ) : (
          <p className="rounded-xl border border-border bg-card px-4 py-3 text-[15px]">
            Los equipos destacados de {game.name} todavía no están calculados.
          </p>
        )}
      </main>
    </>
  );
}
