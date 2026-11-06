import { describe, expect, it } from "vitest";
import { loadClientGame } from "@/lib/game-data";
import { deriveSeed } from "@/lib/rng";
import { ROUTE_MAX_CONSECUTIVE, ROUTE_PICKS } from "./constants";
import { buildRoute, pickRoute, type RouteData, type RouteOptions } from "./route";

// Real Emerald data produced by `pnpm data:build`.
const game = loadClientGame("emerald")!;
const data: RouteData = { ...game, statTotalOf: (id) => game.statTotals[id] ?? 0 };
const DEFAULTS: RouteOptions = { allowLegendaries: false, allowTradeEvolutions: false, excluded: [] };
const rank = new Map(game.segments.map((s) => [s.id, s.order]));
const r = (id: string) => rank.get(id) ?? Number.POSITIVE_INFINITY;
const stops = buildRoute(data, DEFAULTS);
const entry = (finalFormId: number) => game.pool.find((p) => p.finalFormId === finalFormId)!;

describe("buildRoute (specs/08)", () => {
  it("has one stop per segment with a boss ahead, in order", () => {
    expect(stops.map((s) => s.segment)).toEqual(game.segments.map((s) => s.id));
    const league = stops.at(-1)!;
    expect(league.bossIds).toEqual(expect.arrayContaining(["elite-1", "elite-4", "champion"]));
  });

  it("never recommends something not obtainable yet at its stop", () => {
    for (const s of stops) {
      for (const c of [...s.starters, ...s.candidates]) {
        expect(r(c.firstAvailable)).toBeLessThanOrEqual(s.order);
        const e = entry(c.finalFormId);
        // The encounter shown (same place, species and method) is possible by then.
        const shown = e.encounters.filter((x) => x.where === c.where && x.asSpeciesId === c.speciesId && x.method === c.method);
        expect(shown.some((x) => r(x.segment) <= s.order)).toBe(true);
      }
    }
  });

  it("only cites moves the member has in time for the next boss (specs/04)", () => {
    for (const s of stops) {
      for (const c of s.candidates) {
        if (!c.reason) continue;
        const m = game.matchups[c.finalFormId]![s.bossIds[0]!]!;
        expect(m.moves.map((x) => x.moveId)).toContain(c.reason.moveId);
        if (c.reason.source.kind === "tm") {
          expect(r(game.tms[c.reason.source.number]!.segment)).toBeLessThanOrEqual(r(game.bosses.find((b) => b.id === s.bossIds[0])!.segment));
        } else {
          expect(c.reason.source.level).toBeLessThanOrEqual(c.level);
        }
      }
    }
  });

  it("shows the starters only at the first stop, and never as candidates", () => {
    expect(stops[0]!.starters.length).toBe(3);
    for (const s of stops.slice(1)) expect(s.starters).toEqual([]);
    for (const s of stops) for (const c of s.candidates) expect(entry(c.finalFormId).flags.starter).toBe(false);
  });

  it("offers one entry per evolution line", () => {
    for (const s of stops) {
      const lines = s.candidates.map((c) => c.evolutionLineId);
      expect(new Set(lines).size).toBe(lines.length);
    }
  });

  it("respects the hard options", () => {
    const withTrade = buildRoute(data, { ...DEFAULTS, allowTradeEvolutions: true });
    const all = (ss: typeof stops) => ss.flatMap((s) => s.candidates.map((c) => entry(c.finalFormId)));
    expect(all(stops).some((e) => e.flags.needsTrade)).toBe(false);
    expect(all(stops).some((e) => e.flags.legendary || e.flags.mythical)).toBe(false);
    expect(all(withTrade).some((e) => e.flags.needsTrade)).toBe(true);
  });

  it("never shows excluded species (any form of the line)", () => {
    const MARILL = 183;
    const excluded = buildRoute(data, { ...DEFAULTS, excluded: [MARILL] });
    for (const s of excluded) {
      for (const c of [...s.starters, ...s.candidates]) {
        const e = entry(c.finalFormId);
        expect([e.speciesId, ...e.evolution.map((x) => x.toSpeciesId)]).not.toContain(MARILL);
      }
    }
  });

  it("labels every candidate and keeps the scores in 0–100", () => {
    for (const s of stops) {
      for (const c of s.candidates) {
        expect(["keep", "short-term"]).toContain(c.label);
        for (const v of [c.shortTerm, c.longTerm]) expect(v).toBeGreaterThanOrEqual(0);
        for (const v of [c.shortTerm, c.longTerm]) expect(v).toBeLessThanOrEqual(100);
      }
    }
  });

  it("lists only TMs obtained in that segment", () => {
    for (const s of stops) for (const t of s.usefulTms) expect(r(game.tms[t.number]!.segment)).toBe(s.order);
  });
});

describe("pickRoute", () => {
  it("is identical with the same seed", () => {
    const a = pickRoute(stops, 777).map((p) => p.picks.map((c) => c.finalFormId));
    const b = pickRoute(stops, 777).map((p) => p.picks.map((c) => c.finalFormId));
    expect(a).toEqual(b);
  });

  it("has recommendations at every stop, with a 'keep' when there is one", () => {
    for (let i = 0; i < 50; i++) {
      for (const { stop, picks } of pickRoute(stops, deriveSeed(1, i))) {
        expect(picks.length).toBeGreaterThan(0);
        expect(picks.length).toBeLessThanOrEqual(ROUTE_PICKS);
        if (stop.candidates.some((c) => c.label === "keep")) expect(picks.some((c) => c.label === "keep")).toBe(true);
      }
    }
  });

  it("never repeats a line in more than 2 consecutive stops", () => {
    for (let i = 0; i < 50; i++) {
      const lines = pickRoute(stops, deriveSeed(2, i)).map((p) => new Set(p.picks.map((c) => c.evolutionLineId)));
      for (let k = ROUTE_MAX_CONSECUTIVE; k < lines.length; k++) {
        for (const line of lines[k]!) {
          const run = lines.slice(k - ROUTE_MAX_CONSECUTIVE, k).every((s) => s.has(line));
          expect(run).toBe(false);
        }
      }
    }
  });

  it("'Ver otras' changes that stop and keeps the earlier ones", () => {
    const base = pickRoute(stops, 99);
    let changed = false;
    for (let n = 1; n <= 5 && !changed; n++) {
      const other = pickRoute(stops, 99, [0, 0, 0, n]);
      expect(other.slice(0, 3).map((p) => p.picks)).toEqual(base.slice(0, 3).map((p) => p.picks));
      changed = other[3]!.picks.map((c) => c.finalFormId).join() !== base[3]!.picks.map((c) => c.finalFormId).join();
    }
    expect(changed).toBe(true);
  });
});
