import Link from "next/link";

/** Fan-project notice on every page (specs/09, F8). */
export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-8 text-[13px] text-muted-foreground sm:px-6">
        <nav aria-label="Pie" className="flex flex-wrap gap-x-5 gap-y-2 font-semibold text-foreground">
          <Link href="/" className="underline-offset-4 hover:underline">
            Inicio
          </Link>
          <Link href="/como-funciona" className="underline-offset-4 hover:underline">
            Cómo funciona
          </Link>
          <a href="https://pokeapi.co" className="underline-offset-4 hover:underline" rel="noopener">
            Datos de PokéAPI
          </a>
        </nav>
        <p className="max-w-[80ch]">
          OddTeam es un proyecto de fans sin ánimo de lucro, no afiliado ni respaldado por Nintendo, Game Freak, Creatures ni The
          Pokémon Company. Pokémon y los nombres de personajes, movimientos y lugares son marcas de sus respectivos propietarios.
          Los sprites se sirven desde PokéAPI.
        </p>
      </div>
    </footer>
  );
}
