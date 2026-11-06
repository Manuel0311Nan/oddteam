import type { ClientGame } from "@/lib/game-data";
import type { DifficultyData } from "./difficulty";

/** Difficulty inputs from the data the generator page already has. */
export function difficultyDataOf(game: Pick<ClientGame, "segments" | "bosses" | "matchups" | "statTotals">): DifficultyData {
  return {
    segments: game.segments,
    bosses: game.bosses,
    matchups: game.matchups,
    statTotalOf: (id) => game.statTotals[id] ?? 0,
  };
}
