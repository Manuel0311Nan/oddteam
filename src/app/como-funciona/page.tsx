import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site/site-header";
import {
  DIFFICULTY_CUTS,
  DIFFICULTY_WEIGHTS,
  EFFECTIVE_LEVEL_PIVOT,
  RARITY_THRESHOLDS,
  SCORE_EFFECTIVE,
} from "@/lib/analysis/constants";

const description =
  "Qué es un equipo válido, de dónde salen los datos y cómo se calculan la rareza, los combates, la dificultad y la Ruta.";

export const metadata: Metadata = {
  title: "Cómo funciona · OddTeam",
  description,
  openGraph: { title: "Cómo funciona · OddTeam", description, url: "/como-funciona" },
};

const pct = (x: number) => `${Math.round(x * 100)} %`;

const SECTIONS = [
  { id: "valido", title: "Qué es un equipo válido" },
  { id: "datos", title: "De dónde salen los datos" },
  { id: "rareza", title: "Cuándo y con qué probabilidad" },
  { id: "jefes", title: "Contra los jefes" },
  { id: "dificultad", title: "Dificultad" },
  { id: "ruta", title: "La Ruta" },
  { id: "enlaces", title: "Semillas y enlaces" },
  { id: "limites", title: "Limitaciones" },
] as const;

function Section({ id, children }: { id: (typeof SECTIONS)[number]["id"]; children: React.ReactNode }) {
  const title = SECTIONS.find((s) => s.id === id)?.title;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="flex scroll-mt-6 flex-col gap-3">
      <h2 id={`${id}-title`} className="text-2xl font-extrabold tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function HowItWorksPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-[1280px] flex-col gap-8 px-4 pt-10 pb-16 sm:px-6 lg:flex-row lg:items-start lg:gap-12">
        <nav aria-label="En esta página" className="lg:sticky lg:top-6 lg:w-[240px] lg:shrink-0">
          <h2 className="mb-2 text-[13px] font-bold uppercase tracking-[0.08em] text-muted-foreground">En esta página</h2>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[15px] lg:flex-col">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="inline-flex min-h-9 items-center font-semibold underline-offset-4 hover:underline">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <article className="flex max-w-[72ch] flex-col gap-10 text-[16px] leading-relaxed [&_li]:ml-5 [&_li]:list-disc [&_p]:text-[#3A3832] [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul]:text-[#3A3832]">
          <header className="flex flex-col gap-3">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">Cómo funciona</h1>
            <p className="text-lg">
              OddTeam propone equipos que puedes conseguir y usar de verdad en la historia de una versión concreta, y te
              cuenta cómo les irá. Esto es lo que hay detrás, incluido lo que todavía no sabe hacer.
            </p>
          </header>

          <Section id="valido">
            <p>Un equipo es válido si puedes completarlo jugando esa versión con normalidad:</p>
            <ul>
              <li>Todos sus miembros se consiguen en esa versión: captura, regalo, intercambio dentro del juego o evolución.</li>
              <li>Nada exclusivo de la otra versión de la pareja.</li>
              <li>Sin legendarios ni singulares, salvo que actives la opción.</li>
              <li>Las evoluciones se completan sin intercambiar con otra consola, salvo que actives la opción.</li>
              <li>Nunca dos miembros de la misma línea evolutiva, y como mucho un inicial.</li>
              <li>
                En los juegos que siguen tras la Liga, como Plata SoulSilver, eliges el <strong>alcance</strong>: solo Johto o
                Johto y Kanto. Con «Solo Johto», cada miembro se consigue y termina de evolucionar antes de la Liga, y los
                combates acaban en el campeón.
              </li>
            </ul>
            <p>
              Tampoco cuenta lo que depende de eventos, del post-juego o de hardware extra, ni lo que se pesca o se alcanza
              con Surf antes de tener la caña o la medalla necesaria.
            </p>
          </Section>

          <Section id="datos">
            <p>
              Los datos base salen de <a href="https://pokeapi.co" className="font-semibold underline underline-offset-4">PokéAPI</a>:
              especies, tipos, estadísticas, movimientos, encuentros y sus porcentajes. Se descargan una vez al preparar la web,
              nunca mientras la usas.
            </p>
            <p>
              Lo que PokéAPI no tiene se cura a mano, con una fuente citada en cada dato: en qué momento de la historia se llega a
              cada zona, los equipos de los líderes, dónde está cada MT y cuándo se consiguen la caña o Surf. Las fuentes son
              Bulbapedia, Serebii y WikiDex, por ese orden; WikiDex también para los nombres en español.
            </p>
            <ul>
              <li>Ante la duda, siempre el momento más tardío posible: prefiere decirte que algo llega tarde a proponerte algo imposible.</li>
              <li>Los premios del Casino no cuentan: su coste en fichas no es realista en una partida normal.</li>
              <li>
                Un juego cuyos datos aún tienen algo sin verificar sale marcado como <strong>borrador</strong>.
              </li>
            </ul>
          </Section>

          <Section id="rareza">
            <p>
              La historia se divide en <strong>tramos</strong>, de un jefe al siguiente. Cada Pokémon dice en qué tramo puedes
              conseguirlo y dónde, con la probabilidad del encuentro:
            </p>
            <ul>
              <li>
                <strong>Común</strong> desde el {RARITY_THRESHOLDS.common} %, <strong>poco común</strong> desde el{" "}
                {RARITY_THRESHOLDS.uncommon} %, <strong>raro</strong> desde el {RARITY_THRESHOLDS.rare} % y{" "}
                <strong>muy raro</strong> por debajo. Regalos, encuentros fijos e intercambios del juego son{" "}
                <strong>garantizados</strong>.
              </li>
              <li>
                El <strong>esfuerzo de captura</strong> del equipo es alto con algún muy raro o dos raros, medio con un raro y
                bajo en el resto.
              </li>
            </ul>
            <p>La rareza no entra en la dificultad: lo que cuesta encontrarlo es otra cosa que lo que cuesta ganar con él.</p>
          </Section>

          <Section id="jefes">
            <p>
              Para cada líder, el Alto Mando y el campeón, se mira en qué forma llega cada miembro al nivel esperado de ese tramo
              y qué ataques tiene <strong>a tiempo</strong>: los que aprende por nivel hasta entonces y las MT ya conseguidas.
            </p>
            <ul>
              <li>
                Cada ataque se puntúa con su potencia, precisión, bonus por ser de su tipo, eficacia contra el equipo del jefe y si
                usa la mejor estadística del Pokémon (Ataque o Ataque Especial).
              </li>
              <li>
                Un ataque es <strong>eficaz</strong> desde {SCORE_EFFECTIVE} puntos, y el listón sube a partir del nivel{" "}
                {EFFECTIVE_LEVEL_PIVOT}, porque los ataques también mejoran.
              </li>
              <li>
                <strong>Ventaja</strong> si cubres a la mayoría de su equipo y nadie recibe ×4; <strong>Complicado</strong> si no
                cubres a nadie o la mitad del equipo es débil a su tipo; <strong>Neutro</strong> en el resto.
              </li>
              <li>Las MT de un solo uso se marcan, y si sirven a varios miembros te recuerda que elijas uno.</li>
            </ul>
          </Section>

          <Section id="dificultad">
            <p>Cada equipo tiene una nota de 0 a 100 (más alta, más difícil) que combina cuatro cosas:</p>
            <ul>
              <li>
                <strong>Disponibilidad</strong> ({pct(DIFFICULTY_WEIGHTS.availability)}): cuándo se completa el equipo y si
                empiezas con al menos dos.
              </li>
              <li>
                <strong>Combates</strong> ({pct(DIFFICULTY_WEIGHTS.bosses)}): los veredictos contra los jefes, con más peso para el
                último gimnasio, el Alto Mando y el campeón.
              </li>
              <li>
                <strong>Stats</strong> ({pct(DIFFICULTY_WEIGHTS.stats)}): las estadísticas base de las formas que tendrás en cada
                combate.
              </li>
              <li>
                <strong>Fricción</strong> ({pct(DIFFICULTY_WEIGHTS.friction)}): evoluciones tardías, Pokémon que solo se consiguen
                con MO o una vez, y combates sin ataques de su tipo.
              </li>
            </ul>
            <p>
              <strong>Paseo</strong> por debajo de {DIFFICULTY_CUTS.normal}, <strong>Normal</strong> hasta {DIFFICULTY_CUTS.hard},{" "}
              <strong>Exigente</strong> hasta {DIFFICULTY_CUTS.challenge} y <strong>Reto</strong> desde ahí. Los cortes están
              calibrados con equipos de referencia y se irán ajustando con partidas reales.
            </p>
          </Section>

          <Section id="ruta">
            <p>
              La Ruta no te da un equipo cerrado: en cada tramo te sugiere qué capturar antes del próximo jefe, siempre algo que ya
              puedes conseguir en ese punto.
            </p>
            <ul>
              <li>
                <strong>Para quedarse</strong>: rinde bien contra los jefes que vienen después. <strong>Para salir del paso</strong>:
                ayuda contra el próximo, pero luego se queda corto.
              </li>
              <li>Prioriza lo que aparece por primera vez en ese tramo, y lo raro pesa menos.</li>
              <li>No guarda tu partida: con el mismo enlace, cualquiera ve la misma Ruta.</li>
            </ul>
          </Section>

          <Section id="enlaces">
            <p>
              Todo lo aleatorio sale de una <strong>semilla</strong>. El enlace guarda la semilla, las opciones y el equipo
              completo, así que abre exactamente lo mismo en cualquier dispositivo. Si los datos han cambiado desde que se creó, te
              avisa.
            </p>
          </Section>

          <Section id="limites">
            <ul>
              <li>
                <strong>Físico o especial</strong>: se usa siempre la clasificación moderna de cada ataque, también en juegos
                antiguos donde dependía del tipo. En Esmeralda, por ejemplo, Mordisco cuenta como físico aunque en el juego original
                sea especial.
              </li>
              <li>
                <strong>Habilidades y objetos</strong> no se tienen en cuenta. Shedinja (1 PS) o Slaking (Ausente) pueden parecer
                más cómodos de lo que son.
              </li>
              <li>
                Las evoluciones por <strong>amistad, belleza u otras condiciones</strong> no se dan por hechas en los combates.
              </li>
              <li>No simula combates ni calcula daño exacto: es una orientación.</li>
              <li>Nada competitivo: sin EVs, IVs ni sets.</li>
            </ul>
            <p>
              ¿Has encontrado un dato mal? Es un proyecto de fans y los datos se revisan a mano: cualquier corrección ayuda.
            </p>
          </Section>

          <p>
            <Link href="/" className="font-bold underline underline-offset-4">
              Elegir juego
            </Link>
          </p>
        </article>
      </main>
    </>
  );
}
