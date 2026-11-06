import Link from "next/link";
import { SiteHeader } from "@/components/site/site-header";
import { listGames } from "@/lib/game-data";

export default function HomePage() {
  const games = listGames();
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-[1280px] flex-col gap-8 px-4 pt-10 pb-16 sm:px-6">
        <section className="flex max-w-2xl flex-col gap-3">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Deja de jugar siempre con el mismo equipo</h1>
          <p className="text-lg text-muted-foreground">
            Elige tu juego y genera un equipo aleatorio que puedes conseguir de verdad en la historia: sin exclusivos de la
            otra versión, sin intercambios si no quieres y repartido a lo largo de la aventura.
          </p>
        </section>

        <section aria-labelledby="games-title" className="flex flex-col gap-4">
          <h2 id="games-title" className="text-[13px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
            Juegos
          </h2>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
            {games.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/${g.slug}`}
                  className="flex h-full flex-col gap-2 rounded-2xl border border-border bg-card p-5 hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <span className="text-sm font-semibold text-muted-foreground">
                    {g.region.charAt(0).toUpperCase() + g.region.slice(1)} · Generación {g.generation}
                  </span>
                  <span className="text-2xl font-extrabold">Pokémon {g.name}</span>
                  {!g.publishable ? (
                    <span className="self-start rounded-full border border-dashed border-[#BDB5A6] px-2.5 py-0.5 text-xs font-semibold">
                      Borrador
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
            <li className="flex flex-col gap-2 rounded-2xl border border-dashed border-[#BDB5A6] p-5 text-muted-foreground">
              <span className="text-sm font-semibold">Próximamente</span>
              <span className="text-lg font-bold">Platino · HeartGold · SoulSilver · Negro 2 · Blanco 2</span>
            </li>
          </ul>
        </section>
      </main>
    </>
  );
}
