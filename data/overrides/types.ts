/**
 * Shape of the hand-curated overrides (specs/02-datos-y-pipeline.md).
 *
 * Every entry says where the data comes from (`source`). Anything not verified
 * carries a `todo`: the validator lists it and a game with TODOs is not published.
 */

import type { BossKind, FamilySlug, GameSlug, Rarity } from "../../src/lib/types";
import type { SourceId } from "./sources";

/** Segment id of the family, or a state that never counts as story availability. */
export type Availability = string | "post-game" | "excluded";

export type Sourced = {
  source: SourceId | readonly SourceId[];
  /** Free text: what the source says or how the value was derived. */
  note?: string;
  /** Something still to verify or complete. Blocks publication. */
  todo?: string;
};

export type SegmentOverride = Sourced & {
  id: string;
  label: string;
  /** Player level expected when closing the segment (ace of its boss − 2). */
  expectedLevel: number;
};

export type LocationOverride = Sourced & {
  /** When the area becomes reachable. */
  segment: Availability;
  /**
   * Spanish name shown in the UI when PokéAPI has none (Sinnoh, D-027).
   * Official names from WikiDex; a short Spanish detail may follow (floor, part).
   */
  name?: string;
  /** Per-method exceptions (e.g. walking encounters only in a part reached later). */
  methods?: Readonly<Record<string, Availability>>;
};

export type MethodOverride = Sourced & {
  /** When the method becomes usable (rod obtained, HM usable…). */
  segment: Availability;
  /**
   * Floor for the rarity of every encounter of this method, when the chance
   * alone overstates how easy it is (honey trees: hours of waiting, random tree group).
   */
  minRarity?: Rarity;
};

export type ConditionOverride = Sourced & {
  /** Undefined = the condition does not gate availability. */
  segment?: Availability;
};

export type SpecialEncounterOverride = Sourced & {
  species: string; // species slug
  area: string; // location-area slug (as in PokéAPI)
  method: string;
  /** Replaces the segment derived from the area and method. */
  segment?: Availability;
  unique?: boolean;
  starter?: boolean;
  /** Curated rarity when PokéAPI's chance is misleading. */
  rarity?: Rarity;
  /** Encounters in the same group are mutually exclusive (starters, fossils…). */
  exclusiveGroup?: string;
  /** True for encounters PokéAPI does not list; they are added as-is. */
  add?: { kind: "gift" | "static" | "trade-ingame"; where: string; levels: readonly [number, number] };
};

export type EvolutionItemOverride = Sourced & {
  where: string;
  segment: Availability;
};

export type EvolutionChoice = Sourced & {
  from: string; // species slug
  to: string;
  /** Which PokéAPI method is the one valid in this family. */
  keep: { trigger: string; minLevel?: number; item?: string };
  /** Earliest segment for evolutions tied to a place (moss rock, ice rock, magnetic field). */
  segment?: Availability;
};

export type BossOverride = Sourced & {
  id: string;
  name: string;
  kind: BossKind;
  /** Segment in which the battle happens (the one it closes). */
  segment: string;
  rewardTm?: string;
  team: readonly { species: string; level: number; heldItem?: string; moves: readonly string[] }[];
};

export type TmOverride = Sourced & {
  where: string;
  segment: Availability;
  /** Can be bought or obtained again. */
  repeatable: boolean;
};

export type FamilyOverrides = {
  family: FamilySlug;
  versions: readonly GameSlug[];
  segments: readonly SegmentOverride[];
  locations: Readonly<Record<string, LocationOverride>>;
  methods: Readonly<Record<string, MethodOverride>>;
  conditions: Readonly<Record<string, ConditionOverride>>;
  specialEncounters: readonly SpecialEncounterOverride[];
  evolutionItems: Readonly<Record<string, EvolutionItemOverride>>;
  evolutionChoices: readonly EvolutionChoice[];
  bosses: readonly BossOverride[];
  tms: Readonly<Record<string, TmOverride>>;
};

/** Differences of one version inside its family. */
export type VersionOverrides = {
  game: GameSlug;
  locations?: Readonly<Record<string, LocationOverride>>;
  specialEncounters?: readonly SpecialEncounterOverride[];
  bosses?: readonly BossOverride[];
  /** Dex species with no known way to get them, reviewed one by one. */
  unobtainable?: Readonly<Record<string, Sourced>>;
};
