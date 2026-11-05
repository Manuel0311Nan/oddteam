export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-4 px-6 py-16">
      <p className="text-sm font-semibold text-muted-foreground">En construcción</p>
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">OddTeam</h1>
      <p className="max-w-prose text-lg text-muted-foreground">
        Equipos aleatorios pero válidos para la historia de tu juego Pokémon, para
        no jugar siempre con los mismos.
      </p>
      <p className="font-mono text-sm text-muted-foreground">Fase 0 · base del proyecto</p>
    </main>
  );
}
