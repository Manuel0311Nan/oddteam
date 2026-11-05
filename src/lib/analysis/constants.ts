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
