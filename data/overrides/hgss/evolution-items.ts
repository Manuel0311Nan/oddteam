import type { EvolutionChoice, EvolutionItemOverride } from "../types";

/**
 * Where the evolution items used in HeartGold/SoulSilver are obtained, and the
 * earliest segment in which one can be had. Cross-checked with the WikiDex guide
 * (pages 1–27) and, for items the guide does not mention, with each item's
 * WikiDex page (HGSS row).
 *
 * Counted (D-028, D-030): items at a fixed place, gifts from a fixed NPC and the
 * Pokéathlon Dome exchange (fixed days, athlete points). The Dome is next to the
 * National Park, so it is open from the 3rd gym on (guide p. 6).
 * Not counted: items held by wild Pokémon, phone gifts (random calls), Bug-Catching
 * Contest prizes (random), the Pokéwalker (another device) and Pokémon Battle
 * Revolution (another game). Rock Climb needs the 16 badges, so items behind it
 * are post-game (D-029).
 */
const A = "Carpa Pokéathlon" as const;
const G = "wikidex-guia-hgss" as const;

export const evolutionItems: Readonly<Record<string, EvolutionItemOverride>> = {
  "fire-stone": {
    where: `${A} (martes, 2500 puntos) · abuelo de Bill, Ruta 25, enseñándole un Vulpix`,
    segment: "gym-3-4",
    source: "wikidex-piedra-fuego",
  },
  "water-stone": {
    where: `${A} (miércoles, 2500 puntos) · Islas Espuma · abuelo de Bill, enseñándole un Staryu`,
    segment: "gym-3-4",
    source: ["wikidex-piedra-agua", G],
    note: "Guía p. 23: Islas Espuma",
  },
  "thunder-stone": {
    where: `${A} (jueves, 2500 puntos)`,
    segment: "gym-3-4",
    source: "wikidex-piedra-trueno",
    note: "El abuelo de Bill la da por un Pichu, que solo se consigue criando",
  },
  "leaf-stone": {
    where: `${A} (sábados, 2500 puntos) · Bosque Verde (suroeste) · abuelo de Bill, enseñándole un Oddish`,
    segment: "gym-3-4",
    source: "wikidex-piedra-hoja",
  },
  "moon-stone": {
    where: `${A} (lunes, 3000 puntos) · detrás de las Cataratas Tohjo · Plaza Monte Moon (lunes por la noche)`,
    segment: "gym-3-4",
    source: ["wikidex-piedra-lunar", G],
    note: "Guía p. 13: Cataratas Tohjo",
  },
  "sun-stone": {
    where: `${A} (lunes, viernes y domingos, 3000 puntos, con la Pokédex Nacional)`,
    segment: "kanto",
    source: "wikidex-piedra-solar",
    note: "Antes, solo como premio del Concurso de captura de bichos, que no cuenta",
  },
  "shiny-stone": {
    where: `${A} (con la Pokédex Nacional, 3000 puntos)`,
    segment: "kanto",
    source: "wikidex-piedra-dia",
    note: "La del Parque Nacional necesita Treparrocas",
  },
  "dusk-stone": {
    where: `${A} (con la Pokédex Nacional, 3000 puntos)`,
    segment: "kanto",
    source: "wikidex-piedra-noche",
    note: "También en la Cueva Celeste (16 medallas)",
  },
  "dawn-stone": {
    where: "Silph S.A.: la lleva el Beldum que se cambia por un Forretress · Carpa Pokéathlon (con la Pokédex Nacional)",
    segment: "kanto",
    source: ["wikidex-piedra-alba", G],
    note: "Guía p. 16: intercambio de Beldum. También en el Monte Plateado",
  },
  "kings-rock": {
    where: `Pozo Slowpoke (sótano), regalo de un joven · ${A} (lunes, jueves y domingos, 3000 puntos)`,
    segment: "gym-3-4",
    source: "wikidex-roca-del-rey",
    note: "Conservador: el sótano del pozo se cuenta con Fuerza; la Carpa abre antes",
  },
  "metal-coat": {
    where: `${A} (viernes, 2500 puntos) · regalo en el S.S. Aqua · lo lleva el Magneton de la Central de Energía`,
    segment: "gym-3-4",
    source: ["wikidex-revestimiento-metalico", G],
    note: "Guía p. 15: S.S. Aqua",
  },
  "dragon-scale": {
    where: "Monte Mortero, 1ª planta (con Surf y Cascada) · Carpa Pokéathlon (con la Pokédex Nacional)",
    segment: "league",
    source: ["wikidex-escama-dragon", G],
    note: "Cascada se usa con la Medalla Dragón (8º gimnasio)",
  },
  "up-grade": { where: "Silph S.A., el guardia junto al ascensor", segment: "kanto", source: ["wikidex-mejora", G], note: "Guía p. 16" },
  "deep-sea-tooth": { where: "Ruta 20", segment: "kanto", source: "wikidex-diente-marino" },
  "deep-sea-scale": { where: "Ruta 20", segment: "kanto", source: "wikidex-escama-marina" },
  "razor-claw": {
    where: "Frente Batalla (Servicio de Intercambio, 48 PB)",
    segment: "kanto",
    source: ["wikidex-garra-afilada", "wikidex-frente-batalla-4g"],
    note: "El Frente Batalla abre tras ganar la Liga",
  },
  "razor-fang": {
    where: "Frente Batalla (Servicio de Intercambio, 48 PB)",
    segment: "kanto",
    source: ["wikidex-colmillo-agudo", "wikidex-frente-batalla-4g"],
    note: "El Frente Batalla abre tras ganar la Liga",
  },
  protector: { where: "Monte Mortero (con Treparrocas)", segment: "post-game", source: "wikidex-protector" },
  "dubious-disc": { where: "Ruta 42, desde el Monte Mortero (con Treparrocas)", segment: "post-game", source: "wikidex-disco-extrano" },
  magmarizer: { where: "Isla Canela (con Treparrocas)", segment: "post-game", source: "wikidex-magmatizador" },
  electirizer: { where: "Cueva Celeste", segment: "post-game", source: ["wikidex-electrizador", G], note: "Guía p. 18: la cueva pide las 16 medallas" },
  "reaper-cloth": { where: "Ruta 28 (con Surf) · Monte Plateado", segment: "post-game", source: ["wikidex-tela-terrible", G], note: "Guía p. 27" },
  "oval-stone": {
    where: "Túnel Roca, sótano 1 (con Treparrocas)",
    segment: "post-game",
    source: "wikidex-piedra-oval",
    note: "También la llevan los Chansey salvajes (50 %) y la dan por teléfono, pero eso no cuenta",
  },
};

/**
 * PokéAPI lists methods from every game; these pick the one valid in HGSS
 * (report.md, "Con varios métodos posibles"). Johto and Kanto have no moss rock,
 * ice rock or magnetic field, so those evolutions are not possible (excluded).
 */
export const evolutionChoices: readonly EvolutionChoice[] = [
  { from: "rattata", to: "raticate", keep: { trigger: "level-up", minLevel: 20 }, source: "pokeapi", note: "La variante nocturna es la de Alola (Gen 7)" },
  { from: "meowth", to: "persian", keep: { trigger: "level-up", minLevel: 28 }, source: "pokeapi", note: "La evolución por amistad es la de Alola (Gen 7)" },
  { from: "voltorb", to: "electrode", keep: { trigger: "level-up", minLevel: 30 }, source: "pokeapi", note: "La Piedra Hoja es la de Hisui (Gen 8)" },
  { from: "cubone", to: "marowak", keep: { trigger: "level-up", minLevel: 28 }, source: "pokeapi", note: "La variante nocturna es la de Alola (Gen 7)" },
  { from: "cyndaquil", to: "quilava", keep: { trigger: "level-up", minLevel: 14 }, source: "pokeapi", note: "Nivel 17 es el de Leyendas Pokémon: Arceus" },
  ...(
    [
      ["eevee", "leafeon"],
      ["eevee", "glaceon"],
      ["magneton", "magnezone"],
      ["nosepass", "probopass"],
    ] as const
  ).map(
    ([from, to]): EvolutionChoice => ({
      from,
      to,
      keep: { trigger: "level-up" },
      segment: "excluded",
      source: "pokeapi",
      note: "Evoluciona en un lugar concreto (Roca Musgo, Roca Hielo o campo magnético) que no existe en Johto ni en Kanto",
    }),
  ),
];
