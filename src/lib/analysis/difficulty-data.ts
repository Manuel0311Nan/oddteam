import type { ClientGame } from "@/lib/game-data";
import { bossesInScope, scopeMaxRank } from "@/lib/generator/scope";
import type { DifficultyData } from "./difficulty";

/**
 * Difficulty inputs from the data the generator page already has, limited to a
 * story scope (D-029): its segments and the bosses fought in it.
 */
export function difficultyDataOf(
  game: Pick<ClientGame, "segments" | "bosses" | "matchups" | "statTotals" | "scopes">,
  scope?: string,
): DifficultyData {
  const maxRank = scopeMaxRank(game, scope);
  return {
    segments: game.segments.filter((s) => s.order <= maxRank),
    bosses: bossesInScope(game.bosses, game.segments, maxRank),
    matchups: game.matchups,
    statTotalOf: (id) => game.statTotals[id] ?? 0,
  };
}
