/**
 * Games the pipeline knows how to build. Only PokéAPI slugs live here;
 * everything else is resolved from the API.
 */

import type { FamilySlug, GameSlug } from "@/lib/types";

export type GameConfig = {
  slug: GameSlug;
  family: FamilySlug;
  version: string; // PokéAPI version slug
  versionGroup: string; // PokéAPI version-group slug
  region: string; // PokéAPI region slug
  pokedexes: readonly string[]; // regional dexes used to list "expected" species
};

export const GAME_CONFIGS: readonly GameConfig[] = [
  {
    slug: "emerald",
    family: "emerald",
    version: "emerald",
    versionGroup: "emerald",
    region: "hoenn",
    pokedexes: ["hoenn"],
  },
];

export function findGameConfig(slug: string): GameConfig | undefined {
  return GAME_CONFIGS.find((g) => g.slug === slug);
}
