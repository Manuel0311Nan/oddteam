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

/** A TM is recommended when it improves the member's best score by at least this ratio. */
export const TM_IMPROVEMENT = 1.2;

/** Ataques mostrados por miembro y jefe. */
export const TOP_MOVES = 3;
