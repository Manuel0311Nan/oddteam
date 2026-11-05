/**
 * Type effectiveness for a given generation.
 *
 * The chart is built by the data pipeline from PokéAPI `damage_relations`
 * plus `past_damage_relations` (specs/02) and written to
 * data/generated/type-chart/{generation}.json. This module only reads it.
 */

import type { TypeName, Typing } from "@/lib/types";

export type Multiplier = 0 | 0.5 | 1 | 2;

/** Only non-neutral relations are listed; anything missing is ×1. */
export type TypeChart = {
  generation: number;
  types: readonly TypeName[];
  damage: Partial<Record<TypeName, Partial<Record<TypeName, Exclude<Multiplier, 1>>>>>;
};

export class UnknownTypeError extends Error {
  constructor(
    readonly type: TypeName,
    readonly generation: number,
  ) {
    super(`Type "${type}" does not exist in generation ${generation}`);
    this.name = "UnknownTypeError";
  }
}

export function hasType(chart: TypeChart, type: TypeName): boolean {
  return chart.types.includes(type);
}

function assertType(chart: TypeChart, type: TypeName): void {
  if (!hasType(chart, type)) throw new UnknownTypeError(type, chart.generation);
}

/** Multiplier of one attacking type against one defending type. */
export function singleMultiplier(
  chart: TypeChart,
  attack: TypeName,
  defend: TypeName,
): Multiplier {
  assertType(chart, attack);
  assertType(chart, defend);
  return chart.damage[attack]?.[defend] ?? 1;
}

/** Multiplier of an attacking type against a typing: 0, 0.25, 0.5, 1, 2 or 4. */
export function effectiveness(chart: TypeChart, attack: TypeName, defending: Typing): number {
  return defending.reduce<number>((acc, t) => acc * singleMultiplier(chart, attack, t), 1);
}

/** How every attacking type of the generation hits this typing. */
export function defensiveProfile(
  chart: TypeChart,
  defending: Typing,
): Map<TypeName, number> {
  return new Map(chart.types.map((attack) => [attack, effectiveness(chart, attack, defending)]));
}

/** Attacking types that hit this typing for ×2 or more, strongest first. */
export function weaknesses(chart: TypeChart, defending: Typing): { type: TypeName; multiplier: number }[] {
  return [...defensiveProfile(chart, defending)]
    .filter(([, m]) => m >= 2)
    .map(([type, multiplier]) => ({ type, multiplier }))
    .sort((a, b) => b.multiplier - a.multiplier);
}

/** Structural checks used by the data pipeline before writing a chart. */
export function validateTypeChart(chart: TypeChart): string[] {
  const errors: string[] = [];
  if (new Set(chart.types).size !== chart.types.length) errors.push("Duplicated types");
  for (const [attack, row] of Object.entries(chart.damage) as [TypeName, Record<string, number>][]) {
    if (!hasType(chart, attack)) errors.push(`Unknown attacking type: ${attack}`);
    for (const [defend, m] of Object.entries(row)) {
      if (!hasType(chart, defend as TypeName)) errors.push(`Unknown defending type: ${defend}`);
      if (m !== 0 && m !== 0.5 && m !== 2) errors.push(`Invalid multiplier ${attack}→${defend}: ${m}`);
    }
  }
  return errors;
}
