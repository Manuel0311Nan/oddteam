import type { FamilyOverrides } from "../types";
import { bosses } from "./bosses";
import { evolutionChoices, evolutionItems } from "./evolution-items";
import { conditions, methods } from "./key-items";
import { locations } from "./locations";
import { segments } from "./segments";
import { specialEncounters } from "./special-encounters";
import { tms } from "./tms";

/**
 * FireRed and LeafGreen share story, map and bosses; their exclusives go in
 * versions/{game}.ts (D-009). The story ends with the League: the Islas Sete
 * beyond Tera are post-game, so there is a single scope.
 */
export const family: FamilyOverrides = {
  family: "frlg",
  versions: ["firered", "leafgreen"],
  segments,
  locations,
  methods,
  conditions,
  specialEncounters,
  evolutionItems,
  evolutionChoices,
  bosses,
  tms,
  nationalDexEvolutions: {
    maxSpeciesId: 151,
    segment: "post-game",
    source: ["bulbapedia-national-dex", "wikidex-guia-rfvh"],
    note: "Antes de la Pokédex Nacional, que da Oak tras la Liga, ningún Pokémon evoluciona a una especie de fuera de Kanto (Golbat no llega a Crobat)",
  },
};
