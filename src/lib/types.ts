/**
 * Domain types shared by the data pipeline, the generator and the analysis.
 * Source of truth: specs/02-datos-y-pipeline.md and specs/03-generador.md.
 *
 * Identifiers use PokéAPI slugs (English). Spanish labels live in the data
 * (`name`, `where`, `label`) or in the UI layer.
 */

// ---------------------------------------------------------------------------
// Games
// ---------------------------------------------------------------------------

/** A concrete game version. The version is the unit of the whole product (D-009). */
export const GAME_SLUGS = [
  "emerald",
  "platinum",
  "heartgold",
  "soulsilver",
  "black-2",
  "white-2",
] as const;
export type GameSlug = (typeof GAME_SLUGS)[number];

export function isGameSlug(value: string): value is GameSlug {
  return (GAME_SLUGS as readonly string[]).includes(value);
}

/** Override family: versions that share story, map and most bosses. */
export const FAMILY_SLUGS = ["emerald", "platinum", "hgss", "b2w2"] as const;
export type FamilySlug = (typeof FAMILY_SLUGS)[number];

// ---------------------------------------------------------------------------
// Types (elemental)
// ---------------------------------------------------------------------------

/** The 18 elemental types, as PokéAPI slugs. Not every generation has all of them. */
export const TYPE_NAMES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
] as const;
export type TypeName = (typeof TYPE_NAMES)[number];

export function isTypeName(value: string): value is TypeName {
  return (TYPE_NAMES as readonly string[]).includes(value);
}

/** One or two types, in display order. */
export type Typing = readonly [TypeName] | readonly [TypeName, TypeName];

/** Damage class: always the modern PokéAPI value, in every game (D-005). */
export type DamageClass = "physical" | "special" | "status";

// ---------------------------------------------------------------------------
// Story progression
// ---------------------------------------------------------------------------

/** A stretch of the story between two milestones (usually gyms). */
export type Segment = {
  id: string; // "pre-gym-1", "gym-1-2", …, "league"
  label: string; // "Antes del 1er gimnasio"
  order: number; // 0-based, strictly increasing
  expectedLevel: number; // player's expected level when closing this segment
};

// ---------------------------------------------------------------------------
// Encounters and pool
// ---------------------------------------------------------------------------

export type EncounterKind = "wild" | "gift" | "static" | "trade-ingame" | "roaming";

export const RARITIES = ["guaranteed", "common", "uncommon", "rare", "very-rare"] as const;
export type Rarity = (typeof RARITIES)[number];

/** One way of getting a species in a given version (specs/02, "Probabilidad de encuentro"). */
export type Encounter = {
  asSpeciesId: number; // species actually encountered (e.g. the pre-evolution)
  kind: EncounterKind;
  locationAreaId: string;
  where: string; // Spanish location name
  method?: string; // "walk", "surf", "super-rod"… (wild only)
  chance?: number; // aggregated % (wild only)
  conditions: readonly string[]; // ["time-night"]…
  levels: readonly [number, number];
  segment: string; // Segment.id when it becomes possible
  unique: boolean; // one-shot static encounter
  /** Encounters sharing a group are mutually exclusive (one starter, one fossil…). */
  exclusiveGroup?: string;
  /** Curated rarity when the chance is misleading (e.g. Feebas tiles). */
  rarity?: Rarity;
};

export type EvolutionTrigger = "level-up" | "use-item" | "trade" | "friendship" | "other";

/** One step from a species to the next form in its line. */
export type EvolutionStep = {
  fromSpeciesId: number;
  toSpeciesId: number;
  trigger: EvolutionTrigger;
  minLevel?: number;
  itemId?: string; // "water-stone"…
  segment: string; // earliest Segment.id in which the step is possible
  needsTrade: boolean;
};

export type PoolFlags = {
  legendary: boolean;
  mythical: boolean;
  starter: boolean;
  needsTrade: boolean; // reaching finalFormId requires trading
};

/** A species that can be obtained in a version, with everything the generator needs. */
export type PoolEntry = {
  speciesId: number; // the line's base form available in this version
  finalFormId: number; // final form reachable in this version
  evolutionLineId: number; // PokéAPI evolution-chain id, to avoid two members of one line
  firstAvailable: string; // Segment.id (species or pre-evolution)
  encounters: readonly Encounter[];
  rarity: Rarity; // best option in its first available segment
  evolution: readonly EvolutionStep[];
  flags: PoolFlags;
};

/** A species as shown in the UI and used by the analysis. */
export type Species = {
  id: number;
  name: string; // Spanish name, English fallback
  typing: Typing; // already adjusted to the generation (past_types)
  baseStats: BaseStats;
  sprite?: string; // PokéAPI sprite URL
};

export type BaseStats = {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
};

// ---------------------------------------------------------------------------
// Bosses, moves, TMs
// ---------------------------------------------------------------------------

export type BossKind = "gym" | "elite-four" | "champion" | "rival";

export type BossPokemon = {
  speciesId: number;
  level: number;
  moves: readonly string[]; // move slugs
};

export type Boss = {
  id: string; // "gym-3"
  name: string; // "Erico"
  kind: BossKind;
  segment: string; // segment in which the fight happens
  team: readonly BossPokemon[];
  rewardTm?: string; // TM number given, e.g. "TM34"
};

export type Move = {
  id: string; // PokéAPI slug
  name: string; // Spanish name
  type: TypeName | null; // adjusted to the version group (past_values); null = "???" (Curse, Gen 2–4)
  damageClass: DamageClass;
  power: number | null;
  accuracy: number | null;
};

export type TmEntry = {
  number: string; // "TM03", "HM01"
  moveId: string;
  where: string;
  segment: string;
  repeatable: boolean;
};

export type ItemLocation = {
  itemId: string;
  where: string;
  segment: string;
};

// ---------------------------------------------------------------------------
// Game data bundle
// ---------------------------------------------------------------------------

/**
 * How much of the story a team covers, for games whose story continues after
 * the League (HGSS: Johto, then Kanto). The first scope is the default (D-029).
 */
export type GameScope = {
  id: string; // "johto", "johto-kanto"
  label: string; // "Solo Johto"
  /** Last segment included (inclusive). */
  until: string;
};

export type Game = {
  slug: GameSlug;
  family: FamilySlug;
  pairedVersion?: GameSlug;
  versionGroup: string; // PokéAPI version-group slug
  generation: number;
  region: string;
  segments: readonly Segment[];
  pool: readonly PoolEntry[];
  bosses: readonly Boss[];
  tms: readonly TmEntry[];
  evolutionItems: readonly ItemLocation[];
  /** Only in games with more than one scope (D-029). */
  scopes?: readonly GameScope[];
};

// ---------------------------------------------------------------------------
// Generator options (specs/03-generador.md)
// ---------------------------------------------------------------------------

export const TEAM_SIZE_MIN = 1;
export const TEAM_SIZE_MAX = 6;

export type StarterOption =
  | { mode: "none" }
  | { mode: "random" }
  | { mode: "pick"; speciesId: number };

export type TypeRule =
  | { mode: "unique" } // no repeated types
  | { mode: "max-two" } // at most two members per type
  | { mode: "free" }
  | { mode: "mono"; type: TypeName };

export const DIFFICULTIES = ["easy", "normal", "hard", "challenge"] as const;
/** Paseo / Normal / Exigente / Reto. */
export type Difficulty = (typeof DIFFICULTIES)[number];
export type DifficultyFilter = "any" | Difficulty;

export type RarityFilter = "any" | "no-very-rare" | "easy-only";

export type GeneratorOptions = {
  size: number; // TEAM_SIZE_MIN..TEAM_SIZE_MAX
  starter: StarterOption;
  typeRule: TypeRule;
  balancedProgression: boolean;
  allowTradeEvolutions: boolean;
  allowLegendaries: boolean; // legendaries and mythicals
  difficulty: DifficultyFilter;
  rarity: RarityFilter;
  excluded: readonly number[]; // species ids, sorted and unique
  /** GameScope id; undefined = the game's default (first) scope (D-029). */
  scope?: string;
};
