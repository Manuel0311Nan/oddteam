import { describe, expect, it } from "vitest";
import { loadClientGame } from "@/lib/game-data";
import { computeDifficulty } from "./difficulty";
import { difficultyDataOf } from "./difficulty-data";
import { bossesForTeam, variantShare } from "./boss-variants";

// Real FireRed data: the champion has one variant per starter (D-032).
const game = loadClientGame("firered")!;
const champions = game.bosses.filter((b) => b.kind === "champion");
const starter = (slug: number) => game.pool.find((p) => p.flags.starter && p.speciesId === slug)!;
const plain = game.pool.filter((p) => !p.flags.starter).slice(0, 5);

describe("starter-dependent bosses (D-032)", () => {
  it("has one champion per starter", () => {
    expect(champions.map((c) => c.ifStarter).sort()).toEqual([1, 4, 7]);
  });

  it("keeps only the variant of the team's starter", () => {
    const kept = bossesForTeam(game.bosses, [starter(1), ...plain]).filter((b) => b.kind === "champion");
    expect(kept.map((b) => b.ifStarter)).toEqual([1]);
    expect(kept[0]!.team.at(-1)!.speciesId).toBe(6); // Charizard
  });

  it("keeps every variant, sharing one weight, when the team has no starter", () => {
    const kept = bossesForTeam(game.bosses, plain);
    expect(kept).toHaveLength(game.bosses.length);
    for (const c of champions) expect(variantShare(c, kept)).toBeCloseTo(1 / 3);
    expect(variantShare(game.bosses[0]!, kept)).toBe(1);
  });

  it("scores the difficulty against the team's own champion", () => {
    const dd = difficultyDataOf(game);
    for (const s of [1, 4, 7]) {
      const r = computeDifficulty([starter(s), ...plain], dd);
      expect(r.score).toBeGreaterThanOrEqual(0);
      expect(r.score).toBeLessThanOrEqual(100);
    }
  });
});
