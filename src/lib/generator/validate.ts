import type { GeneratorOptions, PoolEntry, TypeName } from "@/lib/types";
import { earlyNeeded, type GeneratorContext, isEarly, requiredGroups } from "./context";

export type Violation =
  | { code: "size"; expected: number; actual: number }
  | { code: "duplicate-line"; lineId: number }
  | { code: "exclusive-group"; group: string }
  | { code: "type-rule"; type: TypeName }
  | { code: "starter"; detail: string }
  | { code: "balanced"; needed: number; actual: number };

/** Can `entry` join `team` without breaking a pairwise rule? (line, exclusive group, types) */
export function canAdd(
  ctx: GeneratorContext,
  team: readonly PoolEntry[],
  entry: PoolEntry,
  options: GeneratorOptions,
): boolean {
  if (team.some((m) => m.evolutionLineId === entry.evolutionLineId)) return false;
  const groups = requiredGroups(entry);
  if (groups.size > 0 && team.some((m) => [...requiredGroups(m)].some((g) => groups.has(g)))) return false;
  if (options.starter.mode !== "none" && entry.flags.starter && team.some((m) => m.flags.starter)) return false;

  const types = ctx.typingOf(entry.finalFormId);
  const counts = typeCounts(ctx, team);
  if (options.typeRule.mode === "unique" && types.some((t) => (counts.get(t) ?? 0) >= 1)) return false;
  if (options.typeRule.mode === "max-two" && types.some((t) => (counts.get(t) ?? 0) >= 2)) return false;
  if (options.typeRule.mode === "mono" && !types.includes(options.typeRule.type)) return false;
  return true;
}

function typeCounts(ctx: GeneratorContext, team: readonly PoolEntry[]): Map<TypeName, number> {
  const counts = new Map<TypeName, number>();
  for (const m of team) for (const t of ctx.typingOf(m.finalFormId)) counts.set(t, (counts.get(t) ?? 0) + 1);
  return counts;
}

/** Every rule of specs/03 step 5, on a complete team. */
export function validateTeam(
  ctx: GeneratorContext,
  team: readonly PoolEntry[],
  options: GeneratorOptions,
  starterAvailable: boolean,
): Violation[] {
  const v: Violation[] = [];
  if (team.length !== options.size) v.push({ code: "size", expected: options.size, actual: team.length });

  const lines = new Set<number>();
  for (const m of team) {
    if (lines.has(m.evolutionLineId)) v.push({ code: "duplicate-line", lineId: m.evolutionLineId });
    lines.add(m.evolutionLineId);
  }

  const groups = new Map<string, number>();
  for (const m of team) for (const g of requiredGroups(m)) groups.set(g, (groups.get(g) ?? 0) + 1);
  for (const [g, n] of groups) if (n > 1) v.push({ code: "exclusive-group", group: g });

  const counts = typeCounts(ctx, team);
  for (const [t, n] of counts) {
    if (options.typeRule.mode === "unique" && n > 1) v.push({ code: "type-rule", type: t });
    if (options.typeRule.mode === "max-two" && n > 2) v.push({ code: "type-rule", type: t });
  }
  if (options.typeRule.mode === "mono") {
    const mono = options.typeRule.type;
    for (const m of team) if (!ctx.typingOf(m.finalFormId).includes(mono)) v.push({ code: "type-rule", type: mono });
  }

  const starters = team.filter((m) => m.flags.starter);
  if (options.starter.mode === "none" && starters.length > 0) v.push({ code: "starter", detail: "hay un inicial" });
  if (options.starter.mode === "random" && starterAvailable && starters.length !== 1) {
    v.push({ code: "starter", detail: `${starters.length} iniciales` });
  }
  if (options.starter.mode === "pick") {
    const picked = options.starter.speciesId;
    if (!team.some((m) => m.speciesId === picked || m.evolution.some((s) => s.toSpeciesId === picked))) {
      v.push({ code: "starter", detail: "falta el inicial elegido" });
    }
  }

  if (options.balancedProgression) {
    const needed = Math.min(options.size, earlyNeeded(options.size));
    const actual = team.filter((m) => isEarly(ctx, m)).length;
    if (actual < needed) v.push({ code: "balanced", needed, actual });
  }
  return v;
}
