/**
 * Route mode (specs/08-modo-ruta.md). Pure.
 *
 * `buildRoute` scores every pool line at every stop from the precomputed
 * matchups of specs/04 (D-023: no route.json, it is cheap enough in the
 * browser). `pickRoute` chooses the recommendations shown, with a seed.
 */

import { createRng, deriveSeed, type Seed } from "@/lib/rng";
import type { Boss, Encounter, GeneratorOptions, PoolEntry, Rarity, Segment, TmEntry, TypeName } from "@/lib/types";
import type { Matchups } from "./bosses";
import {
  effectiveThreshold,
  LATE_EVOLUTION_LEVEL,
  LATE_SEGMENT_FRACTION,
  ROUTE_KEEP_THRESHOLD,
  ROUTE_LATE_EVOLUTION_PENALTY,
  ROUTE_LONG_WEIGHTS,
  ROUTE_MAX_CONSECUTIVE,
  ROUTE_OLD_FACTOR,
  ROUTE_PICKS,
  ROUTE_RARITY_FACTOR,
  ROUTE_SHORT_THRESHOLD,
  ROUTE_STATS_BONUS,
  ROUTE_TOP_CANDIDATES,
  ROUTE_UTILITY_AT_THRESHOLD,
  ROUTE_WEAKNESS_PENALTY,
  ROUTE_WEIGHTS,
} from "./constants";
import type { MoveSource } from "./moves";
import { compareRarity, encounterRarity } from "./rarity";

export type RouteLabel = "keep" | "short-term";

export type RouteCandidate = {
  /** Pool entry key (final form). */
  finalFormId: number;
  evolutionLineId: number;
  /** Species caught at this stop (may be a pre-evolution). */
  speciesId: number;
  where: string;
  method?: string;
  chance?: number;
  rarity: Rarity;
  conditions: readonly string[];
  firstAvailable: string;
  isNewInSegment: boolean;
  shortTerm: number;
  longTerm: number;
  routeScore: number;
  label: RouteLabel;
  /** Form and level at the next boss, and the best move it has in time. */
  formId: number;
  level: number;
  weakness: number;
  reason: { moveId: string; source: MoveSource; vsBossType: TypeName } | null;
};

export type RouteStop = {
  segment: string;
  order: number;
  expectedLevel: number;
  /** Next boss(es): one per gym; the League groups Elite Four and champion. */
  bossIds: string[];
  /** Only in the first stop. */
  starters: RouteCandidate[];
  /** Top candidates by routeScore (one per evolution line), best first. */
  candidates: RouteCandidate[];
  /** TMs obtained in this segment that improve a candidate against the next boss. */
  usefulTms: { number: string; moveId: string; where: string; repeatable: boolean; forFinalForms: number[] }[];
};

export type RouteData = {
  segments: readonly Segment[];
  pool: readonly PoolEntry[];
  bosses: readonly (Boss & { mainType: TypeName })[];
  matchups: Matchups;
  statTotalOf: (speciesId: number) => number;
  tms: Readonly<Record<string, Pick<TmEntry, "where" | "segment" | "repeatable" | "moveId">>>;
};

/** Hard options of the route: legendaries, trade evolutions and excluded species (specs/08). */
export type RouteOptions = Pick<GeneratorOptions, "allowLegendaries" | "allowTradeEvolutions" | "excluded">;

const clamp = (x: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, x));
const round = (x: number) => Math.round(x);

/** Every species of an entry's line in this game (base → final). */
const lineSpecies = (e: PoolEntry) => [e.speciesId, ...e.evolution.map((s) => s.toSpeciesId)];

export function passesRouteOptions(entry: PoolEntry, options: RouteOptions): boolean {
  if (!options.allowLegendaries && (entry.flags.legendary || entry.flags.mythical)) return false;
  if (!options.allowTradeEvolutions && entry.flags.needsTrade) return false;
  const excluded = new Set(options.excluded);
  return !lineSpecies(entry).some((id) => excluded.has(id));
}

export function buildRoute(data: RouteData, options: RouteOptions): RouteStop[] {
  const order = new Map(data.segments.map((s) => [s.id, s.order]));
  const rankOf = (id: string) => order.get(id) ?? Number.POSITIVE_INFINITY;
  const lastOrder = Math.max(1, ...data.segments.map((s) => s.order));
  const bossesByRank = [...data.bosses].sort((a, b) => rankOf(a.segment) - rankOf(b.segment));
  const pool = data.pool.filter((e) => passesRouteOptions(e, options));

  const stops: RouteStop[] = [];
  for (const segment of [...data.segments].sort((a, b) => a.order - b.order)) {
    const rank = segment.order;
    const nextRank = Math.min(...bossesByRank.filter((b) => rankOf(b.segment) >= rank).map((b) => rankOf(b.segment)));
    if (!Number.isFinite(nextRank)) continue; // nothing left to fight (post-game)
    const next = bossesByRank.filter((b) => rankOf(b.segment) === nextRank);
    const later = bossesByRank.filter((b) => rankOf(b.segment) > nextRank);
    const laterRanks = [...new Set(later.map((b) => rankOf(b.segment)))];

    const score = (entry: PoolEntry): RouteCandidate | null => {
      const encounter = bestEncounterAt(entry, rank, rankOf);
      if (!encounter) return null;
      const rows = next.map((b) => ({ boss: b, m: data.matchups[entry.finalFormId]?.[b.id] }));
      if (rows.some((r) => !r.m?.available)) return null;

      const shortTerm = mean(rows.map((r) => utility(r.m!.bestPerOpponent, r.m!.level, r.m!.weakness)));

      // Remaining battles: the 2 next ranks and the League weigh more. At the League, the League itself.
      const rest = later.length ? later : next;
      let total = 0;
      let weights = 0;
      for (const b of rest) {
        const m = data.matchups[entry.finalFormId]?.[b.id];
        if (!m) continue;
        const r = rankOf(b.segment);
        const w =
          r === lastOrder || b.kind === "elite-four" || b.kind === "champion"
            ? ROUTE_LONG_WEIGHTS.league
            : laterRanks.indexOf(r) < 2
              ? ROUTE_LONG_WEIGHTS.soon
              : ROUTE_LONG_WEIGHTS.other;
        total += w * utility(m.bestPerOpponent, m.level, m.weakness);
        weights += w;
      }
      const statsBonus = clamp(
        (data.statTotalOf(entry.finalFormId) - ROUTE_STATS_BONUS.center) * ROUTE_STATS_BONUS.perPoint,
        -ROUTE_STATS_BONUS.max,
        ROUTE_STATS_BONUS.max,
      );
      const late =
        entry.evolution.some((s) => s.trigger === "level-up" && (s.minLevel ?? 0) > LATE_EVOLUTION_LEVEL) ||
        entry.evolution.some((s) => s.trigger === "use-item" && rankOf(s.segment) >= lastOrder * LATE_SEGMENT_FRACTION);
      const longTerm = clamp((weights ? total / weights : 0) + statsBonus - (late ? ROUTE_LATE_EVOLUTION_PENALTY : 0));

      // Starters are always shown with their rating; other species need to be good at something.
      const label: RouteLabel | null =
        longTerm >= ROUTE_KEEP_THRESHOLD
          ? "keep"
          : shortTerm >= ROUTE_SHORT_THRESHOLD || entry.flags.starter
            ? "short-term"
            : null;
      if (!label) return null;

      const rarity = encounterRarity(encounter);
      const isNew = rankOf(entry.firstAvailable) === rank;
      const routeScore =
        (ROUTE_WEIGHTS.shortTerm * shortTerm + ROUTE_WEIGHTS.longTerm * longTerm) *
        ROUTE_RARITY_FACTOR[rarity] *
        (isNew || entry.flags.starter ? 1 : ROUTE_OLD_FACTOR);

      const first = rows[0]!;
      const move = first.m!.moves[0];
      return {
        finalFormId: entry.finalFormId,
        evolutionLineId: entry.evolutionLineId,
        speciesId: encounter.asSpeciesId,
        where: encounter.where,
        method: encounter.method,
        chance: encounter.kind === "wild" && !encounter.rarity ? encounter.chance : undefined,
        rarity,
        conditions: encounter.conditions,
        firstAvailable: entry.firstAvailable,
        isNewInSegment: isNew,
        shortTerm: round(shortTerm),
        longTerm: round(longTerm),
        routeScore: round(routeScore),
        label,
        formId: first.m!.formId,
        level: first.m!.level,
        weakness: Math.max(...rows.map((r) => r.m!.weakness)),
        reason: move ? { moveId: move.moveId, source: move.source, vsBossType: first.boss.mainType } : null,
      };
    };

    const scored = pool.map((e) => ({ e, c: score(e) })).filter((x): x is { e: PoolEntry; c: RouteCandidate } => !!x.c);
    const starters = rank === 0 ? scored.filter((x) => x.e.flags.starter).map((x) => x.c) : [];
    // One entry per evolution line (e.g. Wurmple → Beautifly or Dustox; Machoke or Machamp): the best one.
    const byLine = new Map<number, RouteCandidate>();
    for (const { e, c } of scored) {
      if (e.flags.starter) continue;
      const prev = byLine.get(c.evolutionLineId);
      if (!prev || c.routeScore > prev.routeScore || (c.routeScore === prev.routeScore && c.finalFormId < prev.finalFormId)) {
        byLine.set(c.evolutionLineId, c);
      }
    }
    const candidates = [...byLine.values()]
      .sort((a, b) => b.routeScore - a.routeScore || a.finalFormId - b.finalFormId)
      .slice(0, ROUTE_TOP_CANDIDATES);

    stops.push({
      segment: segment.id,
      order: rank,
      expectedLevel: segment.expectedLevel,
      bossIds: next.map((b) => b.id),
      starters: starters.sort((a, b) => b.routeScore - a.routeScore || a.finalFormId - b.finalFormId),
      candidates,
      usefulTms: usefulTms(data, [...starters, ...candidates], next, rank, rankOf),
    });
  }
  return stops;
}

/** Easiest encounter already possible at the stop; ties go to the most recent segment (closer to the player). */
function bestEncounterAt(entry: PoolEntry, rank: number, rankOf: (id: string) => number): Encounter | null {
  const possible = entry.encounters.filter((e) => rankOf(e.segment) <= rank);
  possible.sort(
    (a, b) =>
      compareRarity(encounterRarity(a), encounterRarity(b)) ||
      rankOf(b.segment) - rankOf(a.segment) ||
      (b.chance ?? 0) - (a.chance ?? 0) ||
      a.where.localeCompare(b.where),
  );
  return possible[0] ?? null;
}

/** 0–100: the specs/04 "effective" threshold scores 50, minus the weakness penalty. */
function utility(bestPerOpponent: readonly number[], level: number, weakness: number): number {
  const best = mean(bestPerOpponent);
  const base = (best / effectiveThreshold(level)) * ROUTE_UTILITY_AT_THRESHOLD;
  const penalty = weakness >= 4 ? ROUTE_WEAKNESS_PENALTY.quad : weakness >= 2 ? ROUTE_WEAKNESS_PENALTY.double : 0;
  return clamp(base - penalty);
}

function mean(xs: readonly number[]): number {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}

function usefulTms(
  data: RouteData,
  candidates: readonly RouteCandidate[],
  next: readonly Boss[],
  rank: number,
  rankOf: (id: string) => number,
): RouteStop["usefulTms"] {
  const out = new Map<string, RouteStop["usefulTms"][number]>();
  for (const c of candidates) {
    for (const b of next) {
      const m = data.matchups[c.finalFormId]?.[b.id];
      for (const boost of m?.tmBoosts ?? []) {
        if (boost.source.kind !== "tm") continue;
        const tm = data.tms[boost.source.number];
        if (!tm || rankOf(tm.segment) !== rank) continue;
        const entry = out.get(boost.source.number) ?? {
          number: boost.source.number,
          moveId: tm.moveId,
          where: tm.where,
          repeatable: tm.repeatable,
          forFinalForms: [],
        };
        if (!entry.forFinalForms.includes(c.finalFormId)) entry.forFinalForms.push(c.finalFormId);
        out.set(boost.source.number, entry);
      }
    }
  }
  return [...out.values()].sort((a, b) => a.number.localeCompare(b.number));
}

/** Recommendations shown at one stop. */
export type PickedStop = { stop: RouteStop; picks: RouteCandidate[] };

/**
 * Seeded choice of the recommendations (specs/08, "Selección en el cliente"):
 * weighted by routeScore, at least one "keep" when there is one, and no line in
 * more than ROUTE_MAX_CONSECUTIVE consecutive stops. `others[i]` is the number
 * of times "Ver otras" was pressed at stop i (part of the URL).
 */
export function pickRoute(stops: readonly RouteStop[], seed: Seed, others: readonly number[] = []): PickedStop[] {
  const out: PickedStop[] = [];
  for (const [i, stop] of stops.entries()) {
    const rng = createRng(deriveSeed(seed, "stop", stop.segment, others[i] ?? 0));
    // Lines shown in each of the previous ROUTE_MAX_CONSECUTIVE stops are rested.
    const recent = out.slice(-ROUTE_MAX_CONSECUTIVE).map((p) => new Set(p.picks.map((c) => c.evolutionLineId)));
    const rested = (c: RouteCandidate) => recent.length === ROUTE_MAX_CONSECUTIVE && recent.every((s) => s.has(c.evolutionLineId));
    const pool = stop.candidates.filter((c) => !rested(c));
    const picks: RouteCandidate[] = [];
    const take = (from: readonly RouteCandidate[]) => {
      const left = from.filter((c) => !picks.includes(c));
      if (left.length === 0) return;
      picks.push(rng.weightedPick(left, (c) => Math.max(1, c.routeScore)));
    };
    take(pool.filter((c) => c.label === "keep"));
    while (picks.length < ROUTE_PICKS && picks.length < pool.length) take(pool);
    picks.sort((a, b) => b.routeScore - a.routeScore || a.finalFormId - b.finalFormId);
    out.push({ stop, picks });
  }
  return out;
}
