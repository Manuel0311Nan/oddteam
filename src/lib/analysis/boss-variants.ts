/**
 * Boss variants that depend on the player's starter (FRLG champion, D-032).
 * Pure helpers shared by the difficulty, the boss table and their tests.
 */

import type { Boss, PoolEntry } from "@/lib/types";

type Variant = Pick<Boss, "ifStarterLine">;
type Member = Pick<PoolEntry, "evolutionLineId" | "flags">;

/**
 * The bosses a team will face. When the team has a starter, only the variant for
 * that starter is kept. Without one, the player's starter is unknown, so every
 * variant stays (each one weighs a share, see variantShare).
 */
export function bossesForTeam<B extends Variant>(bosses: readonly B[], team: readonly Member[]): B[] {
  const lines = new Set(team.filter((m) => m.flags.starter).map((m) => m.evolutionLineId));
  const matched = bosses.some((b) => b.ifStarterLine !== undefined && lines.has(b.ifStarterLine));
  return matched ? bosses.filter((b) => b.ifStarterLine === undefined || lines.has(b.ifStarterLine)) : [...bosses];
}

/** Weight of a boss among the given ones: variants split one boss's weight. */
export function variantShare(boss: Variant, bosses: readonly Variant[]): number {
  if (boss.ifStarterLine === undefined) return 1;
  const n = bosses.filter((b) => b.ifStarterLine !== undefined).length;
  return n > 0 ? 1 / n : 1;
}
