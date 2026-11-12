import type { SpecialEncounterOverride } from "../types";

/**
 * Corrections and extra data for the gifts, statics, trades and roamers that
 * PokéAPI already lists for HeartGold/SoulSilver (report.md, section 1b). Entries
 * not listed here keep the segment of their area, method and conditions.
 * What differs between the versions (when Lugia and Ho-Oh can be caught, Latios
 * or Latias) goes in versions/{game}.ts.
 */
const G = "wikidex-guia-hgss" as const;

export const specialEncounters: readonly SpecialEncounterOverride[] = [
  // Starters: one of three in Elm's lab.
  ...(["chikorita", "cyndaquil", "totodile"] as const).map(
    (species): SpecialEncounterOverride => ({
      species,
      area: "new-bark-town-area",
      method: "gift",
      segment: "pre-gym-1",
      starter: true,
      exclusiveGroup: "starter-johto",
      source: G,
      note: "p. 2: el profesor Elm ofrece uno en su laboratorio",
    }),
  ),

  // Gifts.
  { species: "togepi", area: "violet-city-poke-mart", method: "gift-egg", unique: true, source: G, note: "p. 3: huevo misterioso del ayudante de Elm, tras la Medalla Céfiro" },
  { species: "eevee", area: "goldenrod-city-bills-house", method: "gift", unique: true, source: G, note: "p. 6: Bill lo regala en su casa de Ciudad Trigal" },
  {
    species: "spearow",
    area: "goldenrod-city-north-gate",
    method: "gift",
    segment: "excluded",
    source: G,
    note: "p. 6: el guardia lo presta para llevarlo a la Ruta 31 y hay que devolverlo",
  },
  { species: "shuckle", area: "cianwood-city-kirks-house", method: "gift", unique: true, source: G, note: "p. 8: regalo del chaval de la casa junto al herbolario" },
  {
    species: "tyrogue",
    area: "mt-mortar-b1f",
    method: "gift",
    segment: "kanto",
    unique: true,
    source: G,
    note: "p. 9: el Maestro Dojo lo regala al final del Monte Mortero, tras vencer al Alto Mando",
  },
  { species: "dratini", area: "dragons-den-area", method: "gift", unique: true, source: G, note: "p. 11: regalo del anciano del Santuario Dragón" },

  // Statics that are not legendary.
  { species: "sudowoodo", area: "johto-route-36-area", method: "squirt-bottle", unique: true, source: G, note: "p. 6: se moja con la Regadera Squirtle" },
  { species: "lapras", area: "union-cave-b2f", method: "static", unique: false, rarity: "rare", source: G, note: "p. 4: solo los viernes, con Surf; vuelve cada semana" },
  { species: "gyarados", area: "lake-of-rage-area", method: "static", unique: true, source: G, note: "p. 9: el Gyarados rojo del Lago de la Furia" },
  ...(["geodude", "voltorb", "koffing", "electrode"] as const).map(
    (species): SpecialEncounterOverride => ({
      species,
      area: "team-rocket-hq-area",
      method: "static",
      unique: true,
      source: ["pokeapi", G],
      note: "p. 9: encuentros fijos del Escondite Rocket",
    }),
  ),
  ...(["kanto-route-11-area", "kanto-route-12-area"] as const).map(
    (area): SpecialEncounterOverride => ({
      species: "snorlax",
      area,
      method: "pokeflute",
      unique: true,
      exclusiveGroup: "snorlax",
      source: [G, "bulbapedia-hgss-events"],
      note: "p. 20: Snorlax de la Cueva Diglett, que se despierta con la Poké Flauta del Pokégear",
    }),
  ),

  // Legendaries (only with the legendary option).
  { species: "suicune", area: "kanto-route-25-area", method: "static", unique: true, source: G, note: "p. 18: tras vencer a Misty, junto a la casa de Bill" },
  { species: "articuno", area: "seafoam-islands-b4f", method: "static", unique: true, source: G, note: "p. 23" },
  { species: "zapdos", area: "kanto-route-10-area", method: "static", unique: true, source: G, note: "p. 24: junto a la Central de Energía" },
  ...(["raikou", "entei"] as const).map(
    (species): SpecialEncounterOverride => ({
      species,
      area: "roaming-johto-area",
      method: "roaming-grass",
      unique: true,
      source: G,
      note: "p. 6: vaga por Johto tras la escena de la Torre Quemada",
    }),
  ),
];
