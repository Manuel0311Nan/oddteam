import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { GeneratedMove, GeneratedSpecies } from "@/lib/generated-types";
import type { Game, PoolEntry } from "@/lib/types";
import { analyzeEntryVsBoss, computeMatchups, mainType, teamVerdict } from "./bosses";
import { availableMoves, type CombatData, formsAt, type Learnset } from "./moves";
import type { TypeChart } from "./types";

// Real Emerald data produced by `pnpm data:build`.
const read = <T>(...p: string[]) => JSON.parse(readFileSync(join(process.cwd(), "data", "generated", ...p), "utf8")) as T;
const game = read<Game>("emerald", "game.json");
const species = new Map(read<GeneratedSpecies[]>("emerald", "pokeapi", "species.json").map((s) => [s.id, s]));
const learnsets = read<Record<number, Learnset>>("emerald", "pokeapi", "learnsets.json");
const moves = read<Record<string, GeneratedMove>>("emerald", "moves.json");
const chart = read<TypeChart>("type-chart", "gen-3.json");
const rank = new Map(game.segments.map((s) => [s.id, s.order]));

const data: CombatData = {
  chart,
  typingOf: (id) => species.get(id)!.typing,
  statsOf: (id) => species.get(id)!.baseStats,
  learnsets,
  moves,
  tms: game.tms,
  rankOf: (s) => rank.get(s) ?? Number.POSITIVE_INFINITY,
};

const entry = (finalFormId: number) => game.pool.find((p) => p.finalFormId === finalFormId) as PoolEntry;
const boss = (id: string) => game.bosses.find((b) => b.id === id)!;
const SWAMPERT = 260;

describe("formsAt", () => {
  it("evolves by level only up to the expected level", () => {
    expect(formsAt(entry(SWAMPERT), 13, 0, data)).toEqual([258]); // Mudkip at Roxanne
    expect(formsAt(entry(SWAMPERT), 22, 2, data)).toEqual([258, 259]); // Marshtomp at Wattson
    expect(formsAt(entry(SWAMPERT), 44, 7, data)).toEqual([258, 259, 260]);
  });

  it("waits for the evolution item", () => {
    const ludicolo = entry(272); // Lotad → Lombre (nv 14) → Ludicolo (Water Stone, gym-6-7)
    expect(formsAt(ludicolo, 40, rank.get("gym-5-6")!, data)).toEqual([270, 271]);
    expect(formsAt(ludicolo, 40, rank.get("gym-6-7")!, data)).toEqual([270, 271, 272]);
  });

  it("never assumes friendship or beauty evolutions", () => {
    const milotic = entry(350);
    expect(formsAt(milotic, 56, 8, data)).toEqual([349]);
  });
});

describe("availableMoves", () => {
  it("only lists moves learned in time", () => {
    for (const b of game.bosses) {
      const r = rank.get(b.segment)!;
      const level = game.segments.find((s) => s.id === b.segment)!.expectedLevel;
      for (const e of game.pool) {
        if ((rank.get(e.firstAvailable) ?? 99) > r) continue;
        const forms = formsAt(e, level, r, data);
        for (const m of availableMoves(forms, level, r, data)) {
          if (m.source.kind === "level") expect(m.source.level).toBeLessThanOrEqual(level);
          else {
            const tm = game.tms.find((t) => t.number === (m.source as { number: string }).number)!;
            expect(rank.get(tm.segment) ?? Number.POSITIVE_INFINITY, `${tm.number} vs ${b.id}`).toBeLessThanOrEqual(r);
          }
        }
      }
    }
  });
});

describe("analyzeEntryVsBoss", () => {
  it("rates Mudkip's Water Gun as the answer to Roxanne", () => {
    const m = analyzeEntryVsBoss(entry(SWAMPERT), boss("gym-1"), game.segments, data);
    expect(m.formId).toBe(258);
    expect(m.moves[0]?.moveId).toBe("water-gun");
    // ×4 against both Geodude; ×2 against Nosepass is below the "effective" threshold
    // because Water Gun is special and Mudkip's Attack is higher than its Sp. Atk.
    expect(m.bestPerOpponent[0]).toBeGreaterThanOrEqual(120);
    expect(m.bestPerOpponent[1]).toBeGreaterThanOrEqual(120);
    expect(m.bestPerOpponent[2]).toBeLessThan(120);
  });

  it("flags Wingull's ×4 weakness against Wattson", () => {
    expect(analyzeEntryVsBoss(entry(279), boss("gym-3"), game.segments, data).weakness).toBe(4);
  });

  it("marks members not yet available", () => {
    const flygon = entry(330); // Trapinch: desert, after the 4th gym
    expect(analyzeEntryVsBoss(flygon, boss("gym-1"), game.segments, data).available).toBe(false);
  });

  it("uses the boss's main type", () => {
    expect(mainType(boss("gym-3").team.map((m) => data.typingOf(m.speciesId)))).toBe("electric");
  });
});

describe("teamVerdict", () => {
  const matchups = computeMatchups(game.pool, game.bosses, game.segments, data);

  it("gives advantage to a Mudkip team against Roxanne", () => {
    expect(teamVerdict([entry(SWAMPERT)], boss("gym-1"), matchups).verdict).toBe("advantage");
  });

  it("is tough when nobody is available", () => {
    expect(teamVerdict([entry(330)], boss("gym-1"), matchups)).toMatchObject({ verdict: "tough", available: [] });
  });

  it("is tough when half the available team is weak to the main type", () => {
    // Torchic (weak to Rock) alone against Roxanne
    expect(teamVerdict([entry(257)], boss("gym-1"), matchups).verdict).toBe("tough");
  });

  it("is deterministic", () => {
    expect(computeMatchups(game.pool, game.bosses, game.segments, data)).toEqual(matchups);
  });
});
