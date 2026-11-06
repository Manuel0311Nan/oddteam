/**
 * Shapes of the raw PokéAPI layer written by `pnpm data:build` (phase F2):
 *
 *   data/generated/{game}/pokeapi/*.json      per version
 *   data/generated/{versionGroup}/*.json      shared by a version group
 *   data/generated/type-chart/gen-{generation}.json
 *   data/generated/meta.json
 *
 * Phase F3 merges this layer with data/overrides into data/generated/{game}/game.json.
 */

import type { BaseStats, DamageClass, TypeName, Typing } from "@/lib/types";

export type GeneratedMeta = {
  dataVersion: string; // short content hash of every generated data file
  games: string[];
};

export type GeneratedGameInfo = {
  slug: string;
  name: string; // Spanish version name ("Esmeralda")
  nameEn: string;
  family: string;
  version: string;
  versionGroup: string;
  versionGroupOrder: number;
  generation: number;
  region: string;
  /** Species listed in the regional dex(es), in dex order. */
  regionalDex: number[];
};

export type GeneratedSpecies = {
  id: number;
  slug: string;
  name: string; // Spanish, English fallback
  nameEn: string;
  generation: number; // generation the species was introduced
  typing: Typing; // as in the game's generation
  baseStats: BaseStats; // as in the game's generation
  sprite: string | null;
  legendary: boolean;
  mythical: boolean;
  baby: boolean;
  captureRate: number;
  evolutionChainId: number | null;
  evolvesFrom: number | null;
};

export type GeneratedLocationArea = {
  id: string; // location-area slug
  location: string; // location slug
  name: string; // Spanish, English fallback
  nameEn: string;
  hasSpanishName: boolean;
};

/** One way of getting a species, as PokéAPI lists it (wild slots, gifts, statics, trades…). */
export type GeneratedEncounter = {
  speciesId: number;
  pokemonId: number;
  locationAreaId: string;
  method: string;
  /** From the method; "unclassified" until scripts/build-data/encounters.ts knows it. */
  kind: "wild" | "gift" | "static" | "trade-ingame" | "roaming" | "excluded" | "unclassified";
  conditions: string[];
  chance: number; // summed %, capped at 100
  levels: [number, number];
  /** Never counts as availability: excluded or unclassified method, or a condition such as swarms, Pokéradar, GBA slot. */
  excluded: boolean;
};

export type GeneratedLearnset = {
  levelUp: { moveId: string; level: number }[];
  machine: string[];
  tutor: string[];
  egg: string[];
};

export type GeneratedMove = {
  id: string;
  name: string;
  nameEn: string;
  type: TypeName | null; // null = "???" type (Curse in Gen 2–4)
  damageClass: DamageClass;
  power: number | null;
  accuracy: number | null;
  generation: number;
};

export type GeneratedMachine = {
  number: string; // "TM01", "HM05"
  item: string; // item slug
  moveId: string;
};

export type GeneratedEvolutionDetail = {
  trigger: string; // level-up, trade, use-item…
  minLevel?: number;
  item?: string;
  heldItem?: string;
  minHappiness?: number;
  minBeauty?: number;
  timeOfDay?: string;
  knownMove?: string;
  knownMoveType?: string;
  location?: string;
  tradeSpecies?: number;
  gender?: number;
  relativePhysicalStats?: number;
  partySpecies?: number;
  partyType?: string;
  needsOverworldRain?: boolean;
};

export type GeneratedEvolutionStep = {
  fromSpeciesId: number;
  toSpeciesId: number;
  /** PokéAPI lists every known method across all games; F3 picks the one valid here. */
  details: GeneratedEvolutionDetail[];
};

export type GeneratedEvolutionChain = {
  id: number;
  baseSpeciesId: number;
  steps: GeneratedEvolutionStep[];
};

export type GeneratedItem = { id: string; name: string; nameEn: string };

/** data/generated/games.json: games the web knows about. */
export type GeneratedGameListEntry = {
  slug: string;
  name: string;
  family: string;
  region: string;
  generation: number;
  /** No errors and no TODO in its curation (specs/02). Drafts are only shown in development. */
  publishable: boolean;
};

/** data/generated/method-names.json: Spanish names of item- or move-based encounter methods, from PokéAPI. */
export type GeneratedMethodNames = Record<string, { name: string; nameEn: string; from: "item" | "move" }>;

/** data/generated/type-names.json: Spanish names of the types, from PokéAPI. */
export type GeneratedTypeNames = Record<string, { name: string; nameEn: string }>;
