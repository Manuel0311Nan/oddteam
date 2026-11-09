import type { SpecialEncounterOverride } from "../types";

/**
 * Corrections and extra data for the gifts, statics, trades and roamers that
 * PokéAPI already lists for Platinum (report.md, section 1b). Entries not listed
 * here keep the segment of their area, method and conditions.
 */
const W = "bulbapedia-platinum-walkthrough" as const;

export const specialEncounters: readonly SpecialEncounterOverride[] = [
  // Starters: one of three on Route 201.
  ...(["turtwig", "chimchar", "piplup"] as const).map(
    (species): SpecialEncounterOverride => ({
      species,
      area: "sinnoh-route-201-area",
      method: "gift",
      segment: "pre-gym-1",
      starter: true,
      exclusiveGroup: "starter-sinnoh",
      source: W,
      note: "Parte 1: el profesor Serbal ofrece uno en la Ruta 201",
    }),
  ),

  { species: "eevee", area: "hearthome-city-area", method: "gift", segment: "gym-2-3", unique: true, source: W, note: "Parte 6: regalo de Bebe en Ciudad Corazón" },
  { species: "togepi", area: "eterna-city-west-gate", method: "gift-egg", unique: true, source: W, note: "Huevo de Cintia tras el Edificio Galaxia (la condición marca el tramo)" },
  { species: "riolu", area: "iron-island-b2f-left", method: "gift-egg", unique: true, source: W, note: "Huevo de Quinoa en la Isla Hierro (Parte 13)" },
  {
    species: "porygon",
    area: "veilstone-city-area",
    method: "gift",
    segment: "gym-3-4",
    unique: true,
    source: "wikidex-guia-platino",
    note: "Guía WikiDex p. 10: un señor de una casa de Ciudad Rocavelo lo regala si tienes un hueco en el equipo",
  },

  // Statics that are not legendary.
  {
    species: "drifloon",
    area: "valley-windworks-area",
    method: "static",
    unique: false,
    rarity: "rare",
    source: W,
    note: "Solo los viernes, tras vencer a Marte en el Valle Eólico; vuelve cada semana",
  },
  { species: "spiritomb", area: "sinnoh-route-209-area", method: "static", unique: true, source: W, note: "Piedra Espíritu y 32 personas en el Subsuelo (Parte 6)" },
  { species: "rotom", area: "old-chateau-2f-left-room", method: "static", segment: "gym-2-3", unique: true, source: ["pokeapi", W], note: "Televisor de la Vieja Mansión, de noche" },

  // Feebas: four random tiles in the Mt. Coronet lake.
  {
    species: "feebas",
    area: "mt-coronet-b1f",
    method: "feebas-tile-fishing",
    rarity: "very-rare",
    source: W,
    note: "Solo en cuatro casillas aleatorias del lago del sótano del Monte Corona (Parte 14)",
  },
];
