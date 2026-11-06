/**
 * Battle analysis against each boss (specs/04).
 *
 * The team is generated in the browser, so the expensive part is precomputed
 * per pool entry and boss at build time (`computeMatchups`); the browser only
 * combines the six members (`teamVerdict`).
 */

import type { Boss, PoolEntry, Segment, TypeName, Typing } from "@/lib/types";
import { effectiveThreshold, TM_IMPROVEMENT, TOP_MOVES } from "./constants";
import { availableMoves, type CombatData, formsAt, mean, type MoveSource, scoreAgainst } from "./moves";
import { effectiveness } from "./types";

export type RatedMove = { moveId: string; score: number; source: MoveSource };

export type EntryVsBoss = {
  available: boolean;
  formId: number;
  level: number;
  /** Best moves by average score against the boss team. */
  moves: RatedMove[];
  /** Best score against each opponent, in boss team order. */
  bestPerOpponent: number[];
  /** Multiplier the boss's main type deals to this form. */
  weakness: number;
  /** TMs available by then that would improve the best average score by ≥ 20 %. */
  tmBoosts: RatedMove[];
  /** Has at least one damaging move of its own type by then (friction, specs/05). */
  hasStab: boolean;
};

/** Most common type in the boss team (gyms are mono-type). */
export function mainType(team: readonly Typing[]): TypeName {
  const count = new Map<TypeName, number>();
  for (const typing of team) for (const t of typing) count.set(t, (count.get(t) ?? 0) + 1);
  return [...count].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "normal";
}

export function analyzeEntryVsBoss(
  entry: PoolEntry,
  boss: Boss,
  segments: readonly Segment[],
  data: CombatData,
): EntryVsBoss {
  const bossRank = data.rankOf(boss.segment);
  const level = segments.find((s) => s.id === boss.segment)?.expectedLevel ?? 1;
  const opponents = boss.team.map((m) => data.typingOf(m.speciesId));
  const available = data.rankOf(entry.firstAvailable) <= bossRank;
  const forms = formsAt(entry, level, bossRank, data);
  const formId = forms[forms.length - 1] as number;
  const weakness = effectiveness(data.chart, mainType(opponents), data.typingOf(formId));
  if (!available) {
    return { available, formId, level, moves: [], bestPerOpponent: opponents.map(() => 0), weakness, tmBoosts: [], hasStab: false };
  }

  const rated: (RatedMove & { perOpponent: number[] })[] = [];
  for (const m of availableMoves(forms, level, bossRank, data)) {
    const perOpponent = scoreAgainst(m.moveId, formId, opponents, data);
    if (perOpponent) rated.push({ moveId: m.moveId, score: Math.round(mean(perOpponent)), perOpponent, source: m.source });
  }
  rated.sort((a, b) => b.score - a.score || a.moveId.localeCompare(b.moveId));

  // Without TMs: what the member brings by level; TMs that clearly improve it are suggestions.
  const byLevel = rated.filter((r) => r.source.kind === "level");
  const bestLevel = byLevel[0]?.score ?? 0;
  const strip = ({ perOpponent: _p, ...r }: RatedMove & { perOpponent: number[] }): RatedMove => r;
  const tmBoosts = rated
    .filter((r) => r.source.kind === "tm" && r.score >= Math.max(bestLevel * TM_IMPROVEMENT, 1))
    .slice(0, 2)
    .map(strip);

  const bestPerOpponent = opponents.map((_, i) => Math.round(Math.max(0, ...rated.map((r) => r.perOpponent[i] ?? 0))));
  const ownTypes: readonly (TypeName | null)[] = data.typingOf(formId);
  const hasStab = rated.some((r) => ownTypes.includes(data.moves[r.moveId]?.type ?? null));
  return { available, formId, level, moves: rated.slice(0, TOP_MOVES).map(strip), bestPerOpponent, weakness, tmBoosts, hasStab };
}

/** Matchups of every pool entry (by final form) against every boss (by id). */
export type Matchups = Record<number, Record<string, EntryVsBoss>>;

export function computeMatchups(
  pool: readonly PoolEntry[],
  bosses: readonly Boss[],
  segments: readonly Segment[],
  data: CombatData,
): Matchups {
  const out: Matchups = {};
  for (const entry of pool) {
    const row: Record<string, EntryVsBoss> = {};
    for (const boss of bosses) row[boss.id] = analyzeEntryVsBoss(entry, boss, segments, data);
    out[entry.finalFormId] = row;
  }
  return out;
}

export type Verdict = "advantage" | "neutral" | "tough";

export type TeamVsBoss = {
  verdict: Verdict;
  /** Members available for this battle (final-form ids), in team order. */
  available: number[];
  /** Best member against each opponent (final-form id), or null if nobody hits it well. */
  answers: (number | null)[];
  /** Available members weak to the boss's main type (×2 or more). */
  weak: number[];
  reason: string;
};

/** Verdict of specs/04 for a whole team, from the precomputed matchups. */
export function teamVerdict(team: readonly PoolEntry[], boss: Boss, matchups: Matchups): TeamVsBoss {
  const rows = team
    .map((e) => ({ id: e.finalFormId, m: matchups[e.finalFormId]?.[boss.id] }))
    .filter((r): r is { id: number; m: EntryVsBoss } => !!r.m && r.m.available);
  const available = rows.map((r) => r.id);
  const opponents = boss.team.length;

  if (rows.length === 0) {
    return { verdict: "tough", available, answers: boss.team.map(() => null), weak: [], reason: "Nadie del equipo está disponible todavía." };
  }

  const threshold = effectiveThreshold(rows[0]?.m.level ?? 1);
  const answers: (number | null)[] = [];
  let covered = 0;
  for (let i = 0; i < opponents; i++) {
    let best: { id: number; score: number } | null = null;
    for (const r of rows) {
      const s = r.m.bestPerOpponent[i] ?? 0;
      if (!best || s > best.score) best = { id: r.id, score: s };
    }
    const effective = !!best && best.score >= threshold;
    if (effective) covered++;
    answers.push(effective && best ? best.id : null);
  }
  const weak = rows.filter((r) => r.m.weakness >= 2).map((r) => r.id);
  const quadWeak = rows.filter((r) => r.m.weakness >= 4).map((r) => r.id);

  if (covered === 0) return { verdict: "tough", available, answers, weak, reason: "Ningún miembro disponible tiene un ataque eficaz." };
  if (weak.length * 2 >= rows.length) {
    return { verdict: "tough", available, answers, weak, reason: "La mitad o más del equipo disponible es débil a su tipo principal." };
  }
  if (covered * 2 > opponents && quadWeak.length === 0) {
    return { verdict: "advantage", available, answers, weak, reason: "Tienes ataques eficaces contra la mayoría de su equipo." };
  }
  return { verdict: "neutral", available, answers, weak, reason: quadWeak.length ? "Hay un miembro que recibe ×4 de su tipo principal." : "Cubres parte de su equipo." };
}
