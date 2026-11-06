/**
 * Featured teams (specs/05, "Equipos destacados"). Pure: the script feeds it
 * generated and scored teams; it picks a varied set per difficulty level.
 */

import { DIFFICULTIES, type Difficulty } from "@/lib/types";
import type { DifficultyComponents } from "./difficulty";

export const FEATURED_PER_LEVEL = 10;
/** No species appears in more than this many teams of the same level. */
export const FEATURED_MAX_REPEAT = 2;
export const FEATURED_SAMPLES = 20_000;

export type ScoredTeam = {
  seed: number;
  /** Final-form id of the starter in the team, if any. */
  starter?: number;
  /** Final-form ids, in generation order. */
  team: readonly number[];
  score: number;
  level: Difficulty;
  components: DifficultyComponents;
};

export type FeaturedTeam = ScoredTeam & { options: string };

export type FeaturedFile = {
  game: string;
  dataVersion: string;
  samples: number;
  levels: Record<Difficulty, FeaturedTeam[]>;
};

/**
 * Greedy, in candidate order (already random by seed): a team is taken while
 * none of its species has reached FEATURED_MAX_REPEAT in that level. Identical
 * teams (same members in any order) count once.
 *
 * The starter is exempt from that cap (D-022): with the default options every
 * team has one of the 3 starters, so ≤ 2 per species would allow only 6 teams.
 * Starters are spread instead: at most ceil(perLevel / starters) per starter,
 * relaxed in a second pass if a level is still short.
 */
export function selectFeatured(
  candidates: readonly ScoredTeam[],
  perLevel = FEATURED_PER_LEVEL,
  maxRepeat = FEATURED_MAX_REPEAT,
): Record<Difficulty, ScoredTeam[]> {
  const starters = new Set(candidates.map((c) => c.starter).filter((s): s is number => s !== undefined));
  const starterCap = Math.max(maxRepeat, Math.ceil(perLevel / Math.max(1, starters.size)));
  const out = Object.fromEntries(DIFFICULTIES.map((d) => [d, [] as ScoredTeam[]])) as Record<Difficulty, ScoredTeam[]>;
  const uses = Object.fromEntries(DIFFICULTIES.map((d) => [d, new Map<number, number>()])) as Record<Difficulty, Map<number, number>>;
  const taken = new Set<ScoredTeam>();

  // Pass 1 spreads the starters; pass 2 fills what is left without that spread
  // (some starters rarely give hard teams), keeping the cap for everyone else.
  for (const cap of [starterCap, Number.POSITIVE_INFINITY]) {
    const seen = new Set<string>();
    for (const c of candidates) {
      const key = [...c.team].sort((a, b) => a - b).join(".");
      if (seen.has(key)) continue;
      seen.add(key);
      if (taken.has(c)) continue;
      const chosen = out[c.level];
      if (chosen.length >= perLevel) continue;
      const count = uses[c.level];
      if (c.team.some((id) => (count.get(id) ?? 0) >= (id === c.starter ? cap : maxRepeat))) continue;
      if (chosen.some((t) => [...t.team].sort((a, b) => a - b).join(".") === key)) continue;
      chosen.push(c);
      taken.add(c);
      for (const id of c.team) count.set(id, (count.get(id) ?? 0) + 1);
    }
  }
  // Easiest first inside each level, so the tab reads as a gradient.
  for (const d of DIFFICULTIES) out[d].sort((a, b) => a.score - b.score || a.seed - b.seed);
  return out;
}
