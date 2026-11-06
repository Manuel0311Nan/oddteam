import type { SpecialEncounterOverride } from "../types";

/**
 * Corrections and extra data for the gifts, statics, trades and roamers that
 * PokéAPI already lists for Emerald (see report.md, section 1b).
 * Entries not listed here keep the segment of their area and method.
 */
export const specialEncounters: readonly SpecialEncounterOverride[] = [
  // Starters: one of three, at the start.
  ...(["treecko", "torchic", "mudkip"] as const).map(
    (species): SpecialEncounterOverride => ({
      species,
      area: "hoenn-route-101-area",
      method: "gift",
      segment: "pre-gym-1",
      starter: true,
      exclusiveGroup: "starter-hoenn",
      source: "bulbapedia-emerald-walkthrough",
      note: "Parte 1: se elige uno en la Ruta 101",
    }),
  ),

  // Johto starters from Prof. Birch: post-game.
  ...(["chikorita", "cyndaquil", "totodile"] as const).map(
    (species): SpecialEncounterOverride => ({
      species,
      area: "littleroot-town-area",
      method: "gift",
      segment: "post-game",
      exclusiveGroup: "starter-johto",
      source: ["pokeapi", "bulbapedia-emerald-walkthrough"],
      note: "Regalo en Villa Raíz; Villa Raíz aparece en la Parte 20 (post-juego)",
    }),
  ),

  // Fossils: choose one in Mirage Tower, revived in Rustboro.
  {
    species: "lileep",
    area: "rustboro-city-area",
    method: "gift",
    segment: "gym-4-5",
    unique: true,
    exclusiveGroup: "fossil",
    source: ["bulbapedia-emerald-part-8", "pokeapi"],
    note: "Fósil Raíz de la Torre Espejismo (Parte 8, requiere Bici Carrera y Golpe Roca)",
  },
  {
    species: "anorith",
    area: "rustboro-city-area",
    method: "gift",
    segment: "gym-4-5",
    unique: true,
    exclusiveGroup: "fossil",
    source: ["bulbapedia-emerald-part-8", "pokeapi"],
    note: "Fósil Garra de la Torre Espejismo (Parte 8, requiere Bici Carrera y Golpe Roca)",
  },

  // Feebas: PokéAPI gives 50 % per fishing attempt, but only on 6 hidden tiles
  // out of hundreds on Route 119.
  {
    species: "feebas",
    area: "hoenn-route-119-area",
    method: "feebas-tile-fishing",
    rarity: "very-rare",
    source: "serebii-feebas",
    note: "Solo en 6 de los cientos de casillas de agua de la Ruta 119; cambian con la frase de moda de Pueblo Azuliza",
  },

  // One-shot statics.
  { species: "voltorb", area: "new-mauville-area", method: "static", unique: true, source: "pokeapi", note: "Falsas Poké Balls de Malvalanova" },
  { species: "electrode", area: "new-mauville-area", method: "static", unique: true, source: "pokeapi" },
  { species: "electrode", area: "team-aqua-hideout-area", method: "static", unique: true, source: "pokeapi" },
  { species: "electrode", area: "team-magma-hideout-area", method: "static", unique: true, source: "pokeapi" },
  { species: "kecleon", area: "hoenn-route-119-area", method: "devon-scope", unique: true, source: "pokeapi" },
  { species: "kecleon", area: "hoenn-route-120-area", method: "devon-scope", unique: true, source: "pokeapi" },
  { species: "regirock", area: "desert-ruins-area", method: "static", unique: true, source: "pokeapi" },
  { species: "regice", area: "island-cave-area", method: "static", unique: true, source: "pokeapi" },
  { species: "registeel", area: "ancient-tomb-area", method: "static", unique: true, source: "pokeapi" },
  {
    species: "rayquaza",
    area: "sky-pillar-apex",
    method: "static",
    segment: "league",
    unique: true,
    source: "bulbapedia-emerald-walkthrough",
    note: "Se captura en la Parte 18 (Pilar Celeste), tras el 8º gimnasio",
  },
];
