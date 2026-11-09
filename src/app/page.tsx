import { ArrowRight, Route, Shuffle, Trophy } from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "@/components/site/site-header";
import { CATALOG } from "@/lib/catalog";
import { listGames } from "@/lib/game-data";
import { cn } from "@/lib/utils";

const MODES = [
  { icon: Shuffle, title: "Equipo", text: "Seis Pokémon que puedes conseguir de verdad, con dónde, cuándo y cómo de raros son." },
  { icon: Route, title: "Ruta", text: "Qué capturar en cada tramo antes de cada jefe, sin cerrarte a un equipo." },
  { icon: Trophy, title: "Destacados", text: "Equipos ya elegidos por dificultad: de Paseo a Reto." },
] as const;

export default function HomePage() {
  const games = new Map(listGames().map((g) => [g.slug, g]));

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-[1280px] flex-col gap-10 px-4 pt-10 pb-16 sm:px-6">
        <section className="flex max-w-2xl flex-col gap-3">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Deja de jugar siempre con el mismo equipo</h1>
          <p className="text-lg text-muted-foreground">
            Elige tu juego y genera un equipo aleatorio que puedes conseguir de verdad en la historia: sin exclusivos de la otra
            versión, sin intercambios si no quieres y repartido a lo largo de la aventura.
          </p>
          <Link href="/como-funciona" className="inline-flex items-center gap-1.5 self-start text-[15px] font-bold underline underline-offset-4">
            Cómo funciona <ArrowRight aria-hidden className="size-4" />
          </Link>
        </section>

        <section aria-labelledby="games-title" className="flex flex-col gap-4">
          <h2 id="games-title" className="text-[13px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
            Elige tu juego
          </h2>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-4">
            {CATALOG.map((family) => {
              const available = family.versions.filter((v) => games.has(v.slug));
              return (
                <li
                  key={family.slug}
                  className={cn(
                    "flex flex-col gap-4 rounded-2xl p-5",
                    available.length ? "border border-border bg-card" : "border border-dashed border-[#BDB5A6]",
                  )}
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-muted-foreground">
                      {family.region} · Generación {family.generation}
                    </span>
                    <h3 className="text-2xl font-extrabold">{family.title}</h3>
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2">
                    {family.versions.map((v) => {
                      const game = games.get(v.slug);
                      return game ? (
                        <Link
                          key={v.slug}
                          href={`/${v.slug}`}
                          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-foreground px-4 text-[15px] font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        >
                          {v.name}
                          {!game.publishable ? (
                            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold">borrador</span>
                          ) : null}
                        </Link>
                      ) : (
                        <span
                          key={v.slug}
                          className="inline-flex min-h-11 items-center rounded-xl border border-[#BDB5A6] px-4 text-[15px] font-semibold text-muted-foreground"
                        >
                          {v.name} · próximamente
                        </span>
                      );
                    })}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="modes-title" className="flex flex-col gap-4">
          <h2 id="modes-title" className="text-[13px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
            Tres formas de usarlo
          </h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {MODES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex flex-col gap-2 rounded-2xl bg-card p-5">
                <Icon aria-hidden className="size-6 text-primary" strokeWidth={2.2} />
                <h3 className="text-lg font-extrabold">{title}</h3>
                <p className="text-[15px] text-muted-foreground">{text}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
