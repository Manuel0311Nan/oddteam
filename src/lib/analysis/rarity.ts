import { RARITY_ORDER, RARITY_THRESHOLDS } from "@/lib/analysis/constants";
import type { Encounter, Rarity, RarityFilter } from "@/lib/types";

/** Rarity of a wild encounter from its aggregated chance (%). */
export function rarityFromChance(chance: number): Rarity {
  if (!Number.isFinite(chance) || chance < 0) {
    throw new RangeError(`Invalid encounter chance: ${chance}`);
  }
  if (chance >= RARITY_THRESHOLDS.common) return "common";
  if (chance >= RARITY_THRESHOLDS.uncommon) return "uncommon";
  if (chance >= RARITY_THRESHOLDS.rare) return "rare";
  return "very-rare";
}

/** Rarity of one encounter: gifts, statics and in-game trades are guaranteed. */
export function encounterRarity(encounter: Pick<Encounter, "kind" | "chance">): Rarity {
  if (encounter.kind !== "wild") return "guaranteed";
  if (encounter.chance === undefined) {
    throw new RangeError("Wild encounter without chance");
  }
  return rarityFromChance(encounter.chance);
}

/** Negative if `a` is easier to obtain than `b`. */
export function compareRarity(a: Rarity, b: Rarity): number {
  return RARITY_ORDER.indexOf(a) - RARITY_ORDER.indexOf(b);
}

/** Easiest rarity among the given encounters, or null if there are none. */
export function bestRarity(encounters: readonly Pick<Encounter, "kind" | "chance">[]): Rarity | null {
  let best: Rarity | null = null;
  for (const e of encounters) {
    const r = encounterRarity(e);
    if (best === null || compareRarity(r, best) < 0) best = r;
  }
  return best;
}

/** Whether a rarity passes the generator's "Rareza" option (specs/03). */
export function passesRarityFilter(rarity: Rarity, filter: RarityFilter): boolean {
  switch (filter) {
    case "any":
      return true;
    case "no-very-rare":
      return rarity !== "very-rare";
    case "easy-only":
      return rarity === "guaranteed" || rarity === "common" || rarity === "uncommon";
  }
}
