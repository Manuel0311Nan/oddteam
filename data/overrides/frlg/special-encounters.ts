import type { SpecialEncounterOverride } from "../types";

/**
 * Corrections and extra data for the gifts, statics, trades and roamers that
 * PokéAPI already lists for FireRed/LeafGreen (report.md, section 1b). Entries
 * not listed here keep the segment of their area, method and conditions.
 * What differs between the versions goes in versions/{game}.ts.
 */
const G = "wikidex-guia-rfvh" as const;

export const specialEncounters: readonly SpecialEncounterOverride[] = [
  // Starters: one of three in Oak's lab.
  ...(["bulbasaur", "charmander", "squirtle"] as const).map(
    (species): SpecialEncounterOverride => ({
      species,
      area: "pallet-town-area",
      method: "gift",
      segment: "pre-gym-1",
      starter: true,
      exclusiveGroup: "starter-kanto",
      source: G,
      note: "p. 3: el profesor Oak ofrece uno en su laboratorio",
    }),
  ),

  // Gifts.
  ...(["kanto-route-3-pokemon-center", "kanto-route-4-pokemon-center"] as const).map(
    (area): SpecialEncounterOverride => ({
      species: "magikarp",
      area,
      method: "gift",
      unique: true,
      exclusiveGroup: "magikarp-seller",
      source: "pokeapi",
      note: "Lo vende un hombre en el Centro Pokémon junto al Monte Moon",
    }),
  ),
  { species: "eevee", area: "celadon-city-celadon-mansion", method: "gift", unique: true, source: G, note: "p. 11: en lo alto de la Mansión Azulona, por la puerta trasera" },
  ...(["hitmonlee", "hitmonchan"] as const).map(
    (species): SpecialEncounterOverride => ({
      species,
      area: "saffron-city-fighting-dojo",
      method: "gift",
      unique: true,
      exclusiveGroup: "dojo",
      source: ["pokeapi", G],
      note: "p. 15: el Dojo Karate regala uno de los dos",
    }),
  ),
  { species: "lapras", area: "saffron-city-silph-co-7f", method: "gift", unique: true, source: ["pokeapi", G], note: "p. 15: regalo en la planta 7 de Silph S.A." },
  ...(
    [
      ["omanyte", "item-helix-fossil"],
      ["kabuto", "item-dome-fossil"],
    ] as const
  ).map(
    ([species]): SpecialEncounterOverride => ({
      species,
      area: "cinnabar-island-cinnabar-lab",
      method: "gift",
      unique: true,
      exclusiveGroup: "mt-moon-fossil",
      source: G,
      note: "p. 7: en el Monte Moon se elige el Fósil Hélix o el Domo; se revive en Isla Canela",
    }),
  ),
  { species: "aerodactyl", area: "cinnabar-island-cinnabar-lab", method: "gift", unique: true, source: G, note: "p. 9: Ámbar Viejo del Museo de Ciudad Plateada, revivido en Isla Canela" },

  // Statics that are not legendary.
  ...(["kanto-route-12-area", "kanto-route-16-area"] as const).map(
    (area): SpecialEncounterOverride => ({
      species: "snorlax",
      area,
      method: "pokeflute",
      unique: true,
      source: G,
      note: "pp. 13–14: dos Snorlax, que se despiertan con la Poké Flauta",
    }),
  ),
  { species: "hypno", area: "berry-forest-area", method: "static", unique: true, source: G, note: "p. 19: el Hypno del Bosque Baya" },
  { species: "electrode", area: "kanto-power-plant-area", method: "static", unique: true, source: "pokeapi", note: "Electrode fijos de la Central Energía" },

  // Legendaries (only with the legendary option).
  { species: "moltres", area: "mt-ember-summit", method: "static", unique: true, source: G, note: "p. 19" },
  { species: "articuno", area: "seafoam-islands-b4f", method: "static", unique: true, source: G, note: "p. 19" },
  { species: "zapdos", area: "kanto-power-plant-area", method: "static", unique: true, source: G, note: "p. 19" },
];
