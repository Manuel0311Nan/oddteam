/**
 * Which form and which moves a pool member has in a given battle, and how good
 * each move is (specs/04-combates-ataques-mt.md). Pure.
 */

import type { BaseStats, DamageClass, PoolEntry, TmEntry, TypeName, Typing } from "@/lib/types";
import { MOVE_PENALTIES, STAB } from "./constants";
import { effectiveness, type TypeChart } from "./types";

export type MoveData = {
  type: TypeName | null;
  damageClass: DamageClass;
  power: number | null;
  accuracy: number | null;
};

export type Learnset = {
  levelUp: readonly { moveId: string; level: number }[];
  machine: readonly string[];
};

export type CombatData = {
  chart: TypeChart;
  typingOf: (speciesId: number) => Typing;
  statsOf: (speciesId: number) => BaseStats;
  learnsets: Readonly<Record<number, Learnset>>;
  moves: Readonly<Record<string, MoveData>>;
  tms: readonly TmEntry[];
  /** Order of a segment; post-game / unknown → Infinity. */
  rankOf: (segment: string) => number;
};

/**
 * Forms reached by the battle: level evolutions at or below the expected level,
 * item and trade evolutions once their item is available. Friendship, beauty and
 * other conditions are never assumed (conservative, D-016).
 */
export function formsAt(entry: PoolEntry, level: number, bossRank: number, data: CombatData): number[] {
  const forms = [entry.speciesId];
  for (const step of entry.evolution) {
    const itemOk = data.rankOf(step.segment) <= bossRank;
    let reached = false;
    if (step.trigger === "level-up") reached = step.minLevel !== undefined && step.minLevel <= level && itemOk;
    else if (step.trigger === "use-item") reached = itemOk;
    else if (step.trigger === "trade") reached = itemOk; // only in entries that allow trading
    if (!reached) break;
    forms.push(step.toSpeciesId);
  }
  return forms;
}

/** Where a move comes from. TM details (place, single use) are looked up in game.tms by number. */
export type MoveSource = { kind: "level"; level: number } | { kind: "tm"; number: string };

export type AvailableMove = { moveId: string; source: MoveSource };

/** Level-up moves of every form so far (≤ level) and TMs the current form can use by then. Eggs and events excluded. */
export function availableMoves(forms: readonly number[], level: number, bossRank: number, data: CombatData): AvailableMove[] {
  const out = new Map<string, AvailableMove>();
  for (const form of forms) {
    for (const m of data.learnsets[form]?.levelUp ?? []) {
      if (m.level > level) continue;
      const prev = out.get(m.moveId);
      if (!prev || (prev.source.kind === "level" && m.level < prev.source.level)) {
        out.set(m.moveId, { moveId: m.moveId, source: { kind: "level", level: m.level } });
      }
    }
  }
  const current = forms[forms.length - 1] as number;
  const machine = new Set(data.learnsets[current]?.machine ?? []);
  for (const tm of data.tms) {
    if (!machine.has(tm.moveId) || out.has(tm.moveId)) continue;
    if (data.rankOf(tm.segment) > bossRank) continue;
    out.set(tm.moveId, { moveId: tm.moveId, source: { kind: "tm", number: tm.number } });
  }
  return [...out.values()];
}

/** Score of a move against each opponent (specs/04); null if it does not deal fixed damage. */
export function scoreAgainst(
  moveId: string,
  attacker: number,
  opponents: readonly Typing[],
  data: CombatData,
): number[] | null {
  const move = data.moves[moveId];
  if (!move || move.damageClass === "status" || move.power === null || move.type === null) return null;
  const stats = data.statsOf(attacker);
  const best = Math.max(stats.attack, stats.specialAttack);
  const used = move.damageClass === "physical" ? stats.attack : stats.specialAttack;
  const base =
    move.power *
    ((move.accuracy ?? 100) / 100) *
    (data.typingOf(attacker).includes(move.type) ? STAB : 1) *
    (best > 0 ? used / best : 1) *
    (MOVE_PENALTIES[moveId] ?? 1);
  const type = move.type;
  return opponents.map((t) => base * effectiveness(data.chart, type, t));
}

export const mean = (xs: readonly number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
