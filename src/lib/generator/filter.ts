import { passesRarityFilter } from "@/lib/analysis/rarity";
import type { GeneratorOptions, PoolEntry } from "@/lib/types";
import { type GeneratorContext, speciesOf } from "./context";
import { entryInScope, scopeMaxRank } from "./scope";

export type FilterReason = "scope" | "legendary" | "trade" | "excluded" | "rarity" | "mono" | "starter";

/** Why an entry is out of the candidate pool, or null if it is in. */
export function rejectReason(
  ctx: GeneratorContext,
  entry: PoolEntry,
  options: GeneratorOptions,
): FilterReason | null {
  if (!entryInScope(entry, ctx.segments, scopeMaxRank(ctx, options.scope))) return "scope";
  if (!options.allowLegendaries && (entry.flags.legendary || entry.flags.mythical)) return "legendary";
  if (!options.allowTradeEvolutions && entry.flags.needsTrade) return "trade";
  if (options.excluded.length > 0) {
    const excluded = new Set(options.excluded);
    if (speciesOf(entry).some((id) => excluded.has(id))) return "excluded";
  }
  if (!passesRarityFilter(entry.rarity, options.rarity)) return "rarity";
  if (options.typeRule.mode === "mono" && !ctx.typingOf(entry.finalFormId).includes(options.typeRule.type)) {
    return "mono";
  }
  if (options.starter.mode === "none" && entry.flags.starter) return "starter";
  return null;
}

/** Candidate pool after the hard restrictions (specs/03, step 1), in pool order. */
export function filterPool(ctx: GeneratorContext, options: GeneratorOptions): PoolEntry[] {
  return ctx.pool.filter((e) => rejectReason(ctx, e, options) === null);
}
