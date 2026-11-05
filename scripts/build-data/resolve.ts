/**
 * Pure helpers that turn PokéAPI's "current + history" fields into the values
 * that applied in a given generation or version group.
 *
 * PokéAPI conventions (checked against the data):
 *  - past_types, past_stats, past_damage_relations: `generation` is the LAST
 *    generation in which the listed values applied.
 *  - move past_values: `version_group` is where the value CHANGED; the listed
 *    values are the ones that applied before it. Null fields did not change.
 */

import type { LocalizedName, NamedRef } from "./pokeapi-types";

const ROMAN: Record<string, number> = { i: 1, v: 5, x: 10 };

/** "generation-iii" → 3 */
export function generationNumber(ref: NamedRef | string): number {
  const name = typeof ref === "string" ? ref : ref.name;
  const roman = name.replace(/^generation-/, "");
  let total = 0;
  for (let i = 0; i < roman.length; i++) {
    const value = ROMAN[roman[i] as string];
    const next = ROMAN[roman[i + 1] as string];
    if (value === undefined) throw new Error(`Unknown generation: ${name}`);
    total += next !== undefined && next > value ? -value : value;
  }
  return total;
}

/**
 * Pick the value that applied in `generation` from a history list whose
 * entries are "valid up to and including entry.generation".
 */
export function valueForGeneration<T>(
  current: T,
  history: readonly { generation: NamedRef; value: T }[],
  generation: number,
): T {
  const candidates = history
    .map((h) => ({ gen: generationNumber(h.generation), value: h.value }))
    .filter((h) => h.gen >= generation)
    .sort((a, b) => a.gen - b.gen);
  return candidates.length > 0 ? (candidates[0] as { value: T }).value : current;
}

/** Fields of a move that may have changed across version groups. */
export type MoveValues = { power: number | null; accuracy: number | null; type: string };

/**
 * Values of a move in a version group, given the order of every version group.
 * For each field, the first change AFTER the target version group holds the old value.
 */
export function moveValuesForVersionGroup(
  current: MoveValues,
  pastValues: readonly {
    version_group: NamedRef;
    power: number | null;
    accuracy: number | null;
    type: NamedRef | null;
  }[],
  targetOrder: number,
  orderOf: (versionGroup: string) => number,
): MoveValues {
  const later = pastValues
    .map((p) => ({ ...p, order: orderOf(p.version_group.name) }))
    .filter((p) => p.order > targetOrder)
    .sort((a, b) => a.order - b.order);
  const result: MoveValues = { ...current };
  const pick = <K extends "power" | "accuracy">(field: K) => {
    const change = later.find((p) => p[field] !== null);
    if (change) result[field] = change[field];
  };
  pick("power");
  pick("accuracy");
  const typeChange = later.find((p) => p.type !== null);
  if (typeChange?.type) result.type = typeChange.type.name;
  return result;
}

/** Spanish name, English fallback, slug as last resort. */
export function localizedName(names: readonly LocalizedName[], fallback: string): {
  es: string;
  en: string;
  hasEs: boolean;
} {
  const es = names.find((n) => n.language.name === "es")?.name;
  const en = names.find((n) => n.language.name === "en")?.name ?? fallback;
  return { es: es ?? en, en, hasEs: es !== undefined };
}
