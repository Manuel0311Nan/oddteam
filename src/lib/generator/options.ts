import {
  type GeneratorOptions,
  TEAM_SIZE_MAX,
  TEAM_SIZE_MIN,
} from "@/lib/types";

/** Defaults from specs/03-generador.md. */
export const DEFAULT_OPTIONS: GeneratorOptions = {
  size: 6,
  starter: { mode: "random" },
  typeRule: { mode: "unique" },
  balancedProgression: true,
  allowTradeEvolutions: false,
  allowLegendaries: false,
  difficulty: "any",
  rarity: "no-very-rare",
  excluded: [],
};

/** Sorted, unique, positive integer species ids. */
export function normalizeExcluded(ids: readonly number[]): number[] {
  return [...new Set(ids.filter((id) => Number.isInteger(id) && id > 0))].sort((a, b) => a - b);
}

/** Clamp and clean options so every consumer sees a canonical value. */
export function normalizeOptions(options: GeneratorOptions): GeneratorOptions {
  const size = Math.min(TEAM_SIZE_MAX, Math.max(TEAM_SIZE_MIN, Math.trunc(options.size)));
  return { ...options, size, excluded: normalizeExcluded(options.excluded) };
}
