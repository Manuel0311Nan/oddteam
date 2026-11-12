/**
 * Estimated difficulty of a team (specs/05-dificultad.md). Pure.
 *
 * It measures battles, not how hard the team is to catch (D-011): rarity has
 * its own indicator ("Esfuerzo de captura"). Uses the precomputed matchups of
 * specs/04, so it is cheap enough to run inside the generator loop.
 */

import type { Boss, Difficulty, PoolEntry, Segment } from "@/lib/types";
import { bossesForTeam, variantShare } from "./boss-variants";
import { type Matchups, teamVerdict } from "./bosses";
import {
  AVAILABILITY_EARLY_PENALTY,
  AVAILABILITY_EARLY_WANTED,
  BOSS_WEIGHTS,
  DIFFICULTY_CUTS,
  DIFFICULTY_WEIGHTS,
  FRICTION_POINTS,
  LATE_EVOLUTION_LEVEL,
  LATE_SEGMENT_FRACTION,
  STATS_TOTAL_HIGH,
  STATS_TOTAL_LOW,
  VERDICT_POINTS,
} from "./constants";

export type DifficultyData = {
  segments: readonly Segment[];
  bosses: readonly Boss[];
  matchups: Matchups;
  /** Base stat total of a species (forms used in battles). */
  statTotalOf: (speciesId: number) => number;
};

export type DifficultyComponents = {
  availability: number;
  bosses: number;
  stats: number;
  friction: number;
};

export type DifficultyResult = {
  /** 0–100, higher = harder. */
  score: number;
  level: Difficulty;
  components: DifficultyComponents;
};

/** Encounter methods that need a field move or a key item. */
const FIELD_METHODS = new Set([
  "surf",
  "old-rod",
  "good-rod",
  "super-rod",
  "rock-smash",
  "seaweed",
  "feebas-tile-fishing",
  "devon-scope",
]);

const clamp = (x: number) => Math.max(0, Math.min(100, x));

export function levelOf(score: number): Difficulty {
  if (score >= DIFFICULTY_CUTS.challenge) return "challenge";
  if (score >= DIFFICULTY_CUTS.hard) return "hard";
  if (score >= DIFFICULTY_CUTS.normal) return "normal";
  return "easy";
}

export function computeDifficulty(team: readonly PoolEntry[], allData: DifficultyData): DifficultyResult {
  // Starter-dependent bosses (D-032): only the one this team will face, or all of them sharing one weight.
  const data: DifficultyData = { ...allData, bosses: bossesForTeam(allData.bosses, team) };
  const order = new Map(data.segments.map((s) => [s.id, s.order]));
  const orderOf = (id: string) => order.get(id) ?? Number.POSITIVE_INFINITY;
  const lastOrder = Math.max(1, ...data.segments.map((s) => s.order));

  const availability = availabilityScore(team, orderOf, lastOrder);
  const bosses = bossesScore(team, data, orderOf);
  const stats = statsScore(team, data);
  const friction = frictionScore(team, data, orderOf, lastOrder);

  const raw =
    DIFFICULTY_WEIGHTS.availability * availability +
    DIFFICULTY_WEIGHTS.bosses * bosses +
    DIFFICULTY_WEIGHTS.stats * stats +
    DIFFICULTY_WEIGHTS.friction * friction;
  const score = Math.round(clamp(raw));
  return {
    score,
    level: levelOf(score),
    components: {
      availability: Math.round(availability),
      bosses: Math.round(bosses),
      stats: Math.round(stats),
      friction: Math.round(friction),
    },
  };
}

/** When the team is complete: mean segment order of the members, plus a penalty for a thin start. */
function availabilityScore(team: readonly PoolEntry[], orderOf: (id: string) => number, lastOrder: number): number {
  if (team.length === 0) return 100;
  const orders = team.map((m) => Math.min(orderOf(m.firstAvailable), lastOrder));
  const mean = orders.reduce((a, b) => a + b, 0) / orders.length;
  const early = orders.filter((o) => o === 0).length;
  const penalty = early < Math.min(AVAILABILITY_EARLY_WANTED, team.length) ? AVAILABILITY_EARLY_PENALTY : 0;
  return clamp((mean / lastOrder) * 100 + penalty);
}

/** Weighted mean of the specs/04 verdicts. */
function bossesScore(team: readonly PoolEntry[], data: DifficultyData, orderOf: (id: string) => number): number {
  const gyms = data.bosses.filter((b) => b.kind === "gym");
  const lastGym = gyms.reduce<Boss | undefined>((a, b) => (!a || orderOf(b.segment) > orderOf(a.segment) ? b : a), undefined);
  let total = 0;
  let weights = 0;
  for (const boss of data.bosses) {
    const w =
      boss.kind === "champion"
        ? BOSS_WEIGHTS.champion
        : boss.kind === "elite-four"
          ? BOSS_WEIGHTS.eliteFour
          : boss === lastGym
            ? BOSS_WEIGHTS.lastGym
            : 1;
    const share = variantShare(boss, data.bosses);
    total += w * share * VERDICT_POINTS[teamVerdict(team, boss, data.matchups).verdict];
    weights += w * share;
  }
  return weights ? total / weights : 0;
}

/** Inverse of the mean base stat total of the forms each member has in each battle it is available for. */
function statsScore(team: readonly PoolEntry[], data: DifficultyData): number {
  const totals: number[] = [];
  for (const boss of data.bosses) {
    for (const m of team) {
      const mu = data.matchups[m.finalFormId]?.[boss.id];
      if (mu?.available) totals.push(data.statTotalOf(mu.formId));
    }
  }
  if (totals.length === 0) return 100;
  const mean = totals.reduce((a, b) => a + b, 0) / totals.length;
  return clamp(((STATS_TOTAL_HIGH - mean) / (STATS_TOTAL_HIGH - STATS_TOTAL_LOW)) * 100);
}

/** Late evolutions, field-only encounters, one-shot members and lack of own-type moves. */
function frictionScore(
  team: readonly PoolEntry[],
  data: DifficultyData,
  orderOf: (id: string) => number,
  lastOrder: number,
): number {
  if (team.length === 0) return 0;
  const late = (segment: string) => orderOf(segment) >= lastOrder * LATE_SEGMENT_FRACTION;
  let total = 0;
  for (const m of team) {
    let points = 0;
    if (m.evolution.some((s) => s.trigger === "level-up" && (s.minLevel ?? 0) > LATE_EVOLUTION_LEVEL)) {
      points += FRICTION_POINTS.lateLevel;
    }
    if (m.evolution.some((s) => s.trigger === "use-item" && late(s.segment))) points += FRICTION_POINTS.lateItem;

    // Ways to get it in its first segment: does every one need a field move, or is it one-shot?
    const first = m.encounters.filter((e) => e.segment === m.firstAvailable);
    if (first.length && first.every((e) => e.method !== undefined && FIELD_METHODS.has(e.method))) {
      points += FRICTION_POINTS.fieldOnly;
    }
    if (m.encounters.length && m.encounters.every((e) => e.unique)) points += FRICTION_POINTS.unique;

    const rows = data.bosses.map((b) => data.matchups[m.finalFormId]?.[b.id]).filter((r) => r?.available);
    if (rows.length) {
      const without = rows.filter((r) => !r?.hasStab).length;
      points += FRICTION_POINTS.noStab * (without / rows.length);
    }
    total += Math.min(100, points);
  }
  return total / team.length;
}

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Paseo",
  normal: "Normal",
  hard: "Exigente",
  challenge: "Reto",
};
