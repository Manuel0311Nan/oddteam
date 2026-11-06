/**
 * Tunable thresholds and weights for the analysis.
 * Only what is decided in the specs lives here; later phases add their own
 * blocks (combat F5, difficulty F6, route F7).
 */

import type { Rarity } from "@/lib/types";

/** Minimum aggregated encounter chance (%) for each wild rarity (specs/02, "Rareza"). */
export const RARITY_THRESHOLDS = {
  common: 20,
  uncommon: 5,
  rare: 1,
} as const;

/** Order from easiest to hardest to obtain. */
export const RARITY_ORDER: readonly Rarity[] = [
  "guaranteed",
  "common",
  "uncommon",
  "rare",
  "very-rare",
];

/** Spanish labels for the UI. */
export const RARITY_LABELS: Record<Rarity, string> = {
  guaranteed: "Garantizado",
  common: "Común",
  uncommon: "Poco común",
  rare: "Raro",
  "very-rare": "Muy raro",
};

// ---------------------------------------------------------------------------
// Combat analysis (specs/04). Calibrated in phase F6 with reference teams.
// ---------------------------------------------------------------------------

/** STAB multiplier. */
export const STAB = 1.5;

/**
 * Curated penalties for moves whose raw power overstates their use in a
 * playthrough (recharge, charge turn, self-KO, recoil). specs/04.
 */
export const MOVE_PENALTIES: Readonly<Record<string, number>> = {
  "hyper-beam": 0.5,
  "solar-beam": 0.6,
  explosion: 0.3,
  "self-destruct": 0.3,
  "double-edge": 0.85,
};

/**
 * Score of a reference attack: a 60-power STAB move, neutral, with the
 * attacker's best stat (60 × 1.5 = 90). Thresholds are expressed against it.
 */
export const SCORE_EFFECTIVE = 120; // e.g. 60-power super effective, or 80-power STAB neutral
export const SCORE_WEAK = 60;

/**
 * Moves get stronger as the story advances: from this expected level on, the
 * "effective" threshold grows in proportion (lv 40 → 160, lv 56 → 224). Without
 * it almost any team covers the Elite Four (calibration F6, D-021).
 */
export const EFFECTIVE_LEVEL_PIVOT = 30;

export function effectiveThreshold(level: number): number {
  return SCORE_EFFECTIVE * Math.max(1, level / EFFECTIVE_LEVEL_PIVOT);
}

/** A TM is recommended when it improves the member's best score by at least this ratio. */
export const TM_IMPROVEMENT = 1.2;

/** Ataques mostrados por miembro y jefe. */
export const TOP_MOVES = 3;

// ---------------------------------------------------------------------------
// Difficulty (specs/05). Calibrated in F6 with the reference teams of each game
// (src/lib/analysis/difficulty.test.ts). Changing a value here can move a
// reference team to another level: the regression test will say so.
// ---------------------------------------------------------------------------

/** Weights of the four components (sum 1). */
export const DIFFICULTY_WEIGHTS = {
  availability: 0.3,
  bosses: 0.4,
  stats: 0.15,
  friction: 0.15,
} as const;

/**
 * Lower bound (inclusive) of each level on the 0–100 score. "easy" starts at 0.
 * Calibrated in F6 (D-021): the spec's initial cuts (25/50/75) left no hard or
 * challenge team among 5 000 default Emerald teams, whose scores range ~5–52.
 */
export const DIFFICULTY_CUTS = {
  normal: 20,
  hard: 30,
  challenge: 40,
} as const;

/** Verdict → points for the bosses component. */
export const VERDICT_POINTS = { advantage: 0, neutral: 50, tough: 100 } as const;

/** Extra weight of the decisive battles (the rest weigh 1). */
export const BOSS_WEIGHTS = { lastGym: 1.5, eliteFour: 1.5, champion: 2 } as const;

/** Availability: points added when fewer than 2 members are there before the 1st gym. */
export const AVAILABILITY_EARLY_PENALTY = 25;
/** Members wanted before the 1st gym (capped by team size). */
export const AVAILABILITY_EARLY_WANTED = 2;

/** Stats: average base stat total of the forms used per battle; HIGH → 0 points, LOW → 100. */
export const STATS_TOTAL_HIGH = 480;
export const STATS_TOTAL_LOW = 300;

/** Friction points per member (capped at 100), averaged over the team. */
export const FRICTION_POINTS = {
  /** A level evolution above this level… */
  lateLevel: 30,
  /** …or an item evolution whose item arrives in the second half of the story. */
  lateItem: 25,
  /** Only obtainable with a field move or key item (Surf, rods, Rock Smash, Dive…). */
  fieldOnly: 15,
  /** Only obtainable once (static or gift without alternative). */
  unique: 15,
  /** Scaled by the share of battles without a move of its own type. */
  noStab: 30,
} as const;
export const LATE_EVOLUTION_LEVEL = 40;
/** "Second half": segment order ≥ this fraction of the last segment's order. */
export const LATE_SEGMENT_FRACTION = 0.5;
