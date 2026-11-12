import type { EvolutionChoice, EvolutionItemOverride } from "../types";

/**
 * Where the evolution items used in FireRed/LeafGreen are obtained, and the
 * earliest segment in which one can be had. Cross-checked with the WikiDex guide
 * and each item's WikiDex page (FRLG row). The Celadon Department Store sells the
 * four basic stones (guide p. 11), so they are available from the 3rd gym on.
 * Items only used by evolutions into Johto species are post-game: those
 * evolutions need the National Pokédex (family.nationalDexEvolutions).
 */
const G = "wikidex-guia-rfvh" as const;
const MALL = "Centro Comercial de Azulona, 3ª planta (2100 ₽)" as const;
const ND = "Solo la usan evoluciones a especies de Johto, que piden la Pokédex Nacional (post-juego)" as const;

export const evolutionItems: Readonly<Record<string, EvolutionItemOverride>> = {
  "moon-stone": { where: "Monte Moon (planta 1 y oculta en una roca de la planta 3)", segment: "gym-1-2", source: ["wikidex-piedra-lunar", G], note: "Guía p. 7" },
  "fire-stone": { where: `${MALL} · Monte Ascuas`, segment: "gym-3-4", source: ["wikidex-piedra-fuego", G], note: "Guía pp. 11 y 19" },
  "water-stone": { where: `${MALL} · Islas Espuma`, segment: "gym-3-4", source: ["wikidex-piedra-agua", G], note: "Guía pp. 11 y 19" },
  "thunder-stone": { where: `${MALL} · Central Energía`, segment: "gym-3-4", source: ["wikidex-piedra-trueno", G], note: "Guía pp. 11 y 19" },
  "leaf-stone": { where: `${MALL} · Zona Safari (Zona Central y Zona 1)`, segment: "gym-3-4", source: ["wikidex-piedra-hoja", G], note: "Guía pp. 11 y 14" },
  "sun-stone": { where: "Valle Ruinas, zona sureste (con Fuerza)", segment: "post-game", source: "wikidex-piedra-solar", note: "Isla Exta, tras la Liga. Solo la usa Bellossom, que pide la Pokédex Nacional" },
  "kings-rock": { where: "—", segment: "post-game", source: "bulbapedia-national-dex", note: ND },
  "metal-coat": { where: "—", segment: "post-game", source: "bulbapedia-national-dex", note: ND },
  "dragon-scale": { where: "—", segment: "post-game", source: "bulbapedia-national-dex", note: ND },
  "up-grade": { where: "—", segment: "post-game", source: "bulbapedia-national-dex", note: ND },
};

/** PokéAPI lists methods from every game; these pick the one valid in FRLG. */
export const evolutionChoices: readonly EvolutionChoice[] = [
  { from: "rattata", to: "raticate", keep: { trigger: "level-up", minLevel: 20 }, source: "pokeapi", note: "La variante nocturna es la de Alola (Gen 7)" },
  { from: "meowth", to: "persian", keep: { trigger: "level-up", minLevel: 28 }, source: "pokeapi", note: "La evolución por amistad es la de Alola (Gen 7)" },
  { from: "voltorb", to: "electrode", keep: { trigger: "level-up", minLevel: 30 }, source: "pokeapi", note: "La Piedra Hoja es la de Hisui (Gen 8)" },
  { from: "cubone", to: "marowak", keep: { trigger: "level-up", minLevel: 28 }, source: "pokeapi", note: "La variante nocturna es la de Alola (Gen 7)" },
];
