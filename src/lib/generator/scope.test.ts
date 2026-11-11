import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { difficultyDataOf } from "@/lib/analysis/difficulty-data";
import type { GeneratedSpecies } from "@/lib/generated-types";
import { loadClientGame } from "@/lib/game-data";
import type { Game, Typing } from "@/lib/types";
import { createContext } from "./context";
import { rejectReason } from "./filter";
import { generateTeam } from "./generate";
import { DEFAULT_OPTIONS } from "./options";
import { bossesInScope, entryInScope, resolveScope, scopeMaxRank } from "./scope";

// Real Emerald data with two synthetic scopes (D-029): Emerald itself has none.
const root = join(process.cwd(), "data", "generated", "emerald");
const base = JSON.parse(readFileSync(join(root, "game.json"), "utf8")) as Game;
const species = JSON.parse(readFileSync(join(root, "pokeapi", "species.json"), "utf8")) as GeneratedSpecies[];
const typings = new Map<number, Typing>(species.map((s) => [s.id, s.typing]));
const game: Game = {
  ...base,
  scopes: [
    { id: "early", label: "Hasta el 4º gimnasio", until: "gym-3-4" },
    { id: "full", label: "Completa", until: "league" },
  ],
};
const ctx = createContext(game, typings, "Esmeralda");
const rank = new Map(game.segments.map((s) => [s.id, s.order]));
const r = (id: string) => rank.get(id) ?? Number.POSITIVE_INFINITY;

describe("story scopes (D-029)", () => {
  it("defaults to the first scope and ignores unknown ids", () => {
    expect(resolveScope(game, undefined)?.id).toBe("early");
    expect(resolveScope(game, "nope")?.id).toBe("early");
    expect(resolveScope(game, "full")?.id).toBe("full");
    expect(scopeMaxRank(game, "early")).toBe(3);
  });

  it("covers everything in a game without scopes", () => {
    expect(scopeMaxRank(base, "early")).toBe(Number.POSITIVE_INFINITY);
    expect(base.pool.every((e) => entryInScope(e, base.segments, Number.POSITIVE_INFINITY))).toBe(true);
    expect(bossesInScope(base.bosses, base.segments, Number.POSITIVE_INFINITY)).toHaveLength(base.bosses.length);
  });

  it("only keeps lines obtained and fully evolved inside the scope", () => {
    const max = scopeMaxRank(game, "early");
    const inside = game.pool.filter((e) => entryInScope(e, game.segments, max));
    const outside = game.pool.filter((e) => !entryInScope(e, game.segments, max));
    expect(inside.length).toBeGreaterThan(0);
    expect(outside.length).toBeGreaterThan(0);
    for (const e of inside) {
      expect(r(e.firstAvailable)).toBeLessThanOrEqual(max);
      for (const step of e.evolution) expect(r(step.segment)).toBeLessThanOrEqual(max);
    }
    for (const e of outside) expect(rejectReason(ctx, e, { ...DEFAULT_OPTIONS, scope: "early" })).toBe("scope");
  });

  it("generates teams inside the scope", () => {
    const max = scopeMaxRank(game, "early");
    for (let seed = 1; seed <= 20; seed++) {
      const result = generateTeam({ ctx, options: { ...DEFAULT_OPTIONS, scope: "early" }, seed });
      if (!result.ok) continue;
      expect(result.team.every((e) => entryInScope(e, game.segments, max))).toBe(true);
    }
  });

  it("limits the bosses and segments of the difficulty", () => {
    const client = { ...loadClientGame("emerald")!, scopes: game.scopes };
    const early = difficultyDataOf(client, "early");
    expect(early.bosses.map((b) => b.id)).toEqual(["gym-1", "gym-2", "gym-3", "gym-4"]);
    expect(Math.max(...early.segments.map((s) => s.order))).toBe(3);
    expect(difficultyDataOf(client, "full").bosses).toHaveLength(game.bosses.length);
  });
});
