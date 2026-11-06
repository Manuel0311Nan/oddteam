import type { Game, PoolEntry, Segment, Typing } from "@/lib/types";

/** Everything the generator needs about one game, independent of React and I/O. */
export type GeneratorContext = {
  gameName: string; // Spanish version name, for messages
  segments: readonly Segment[];
  pool: readonly PoolEntry[];
  typingOf: (speciesId: number) => Typing;
};

export function createContext(
  game: Pick<Game, "segments" | "pool">,
  typings: ReadonlyMap<number, Typing>,
  gameName: string,
): GeneratorContext {
  return {
    gameName,
    segments: game.segments,
    pool: game.pool,
    typingOf: (id) => {
      const t = typings.get(id);
      if (!t) throw new Error(`No typing for species ${id}`);
      return t;
    },
  };
}

/** Segments that count as "early" for balanced progression: before the 2nd gym. */
export function isEarly(ctx: GeneratorContext, entry: PoolEntry): boolean {
  const order = ctx.segments.find((s) => s.id === entry.firstAvailable)?.order ?? Number.POSITIVE_INFINITY;
  return order <= 1;
}

/** Members needed before the 2nd gym: half the team, rounded up (specs/03). */
export function earlyNeeded(size: number): number {
  return Math.ceil(size / 2);
}

/** Every species of an entry's line in this game (base → final). */
export function speciesOf(entry: PoolEntry): number[] {
  return [entry.speciesId, ...entry.evolution.map((s) => s.toSpeciesId)];
}

/**
 * Exclusive groups an entry depends on: groups shared by ALL its encounters.
 * Two members depending on the same group cannot be in one team (one starter, one fossil…).
 */
export function requiredGroups(entry: PoolEntry): Set<string> {
  const [first, ...rest] = entry.encounters;
  if (!first?.exclusiveGroup) return new Set();
  const group = first.exclusiveGroup;
  return rest.every((e) => e.exclusiveGroup === group) ? new Set([group]) : new Set();
}

/** Stable key of a pool entry (its final form is unique in the pool). */
export const entryKey = (entry: PoolEntry): number => entry.finalFormId;
