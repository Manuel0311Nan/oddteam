/**
 * Story scope of a team (D-029). Games without scopes cover every segment.
 * Pure helpers shared by the generator, the analysis and the route.
 */

import type { Boss, GameScope, PoolEntry, Segment } from "@/lib/types";

export type Scoped = { segments: readonly Segment[]; scopes?: readonly GameScope[] };

/** The scope in use: the requested one if it exists, else the game's default (first). */
export function resolveScope(game: Scoped, scopeId: string | undefined): GameScope | undefined {
  const scopes = game.scopes ?? [];
  return scopes.find((s) => s.id === scopeId) ?? scopes[0];
}

/** Highest segment order inside the scope (Infinity when the game has no scopes). */
export function scopeMaxRank(game: Scoped, scopeId: string | undefined): number {
  const scope = resolveScope(game, scopeId);
  if (!scope) return Number.POSITIVE_INFINITY;
  return game.segments.find((s) => s.id === scope.until)?.order ?? Number.POSITIVE_INFINITY;
}

const rankIn = (segments: readonly Segment[], id: string) =>
  segments.find((s) => s.id === id)?.order ?? Number.POSITIVE_INFINITY;

/**
 * Whether a pool entry can be completed inside the scope: obtained and fully
 * evolved (items, places) by its last segment. Conservative: an entry whose final
 * form needs something from outside the scope is out, even if the earlier forms are in.
 */
export function entryInScope(entry: PoolEntry, segments: readonly Segment[], maxRank: number): boolean {
  if (!Number.isFinite(maxRank)) return true;
  if (rankIn(segments, entry.firstAvailable) > maxRank) return false;
  return entry.evolution.every((s) => rankIn(segments, s.segment) <= maxRank);
}

/** Bosses fought inside the scope. */
export function bossesInScope<B extends Pick<Boss, "segment">>(bosses: readonly B[], segments: readonly Segment[], maxRank: number): B[] {
  if (!Number.isFinite(maxRank)) return [...bosses];
  return bosses.filter((b) => rankIn(segments, b.segment) <= maxRank);
}
