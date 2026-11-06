import { describe, expect, it } from "vitest";
import type { Difficulty } from "@/lib/types";
import { type ScoredTeam, selectFeatured } from "./featured";

const c = (seed: number, team: number[], level: Difficulty, score = 10): ScoredTeam => ({
  seed,
  team,
  level,
  score,
  components: { availability: 0, bosses: 0, stats: 0, friction: 0 },
});

describe("selectFeatured", () => {
  it("caps teams per level", () => {
    const cands = Array.from({ length: 30 }, (_, i) => c(i, [i * 10 + 1, i * 10 + 2], "easy"));
    expect(selectFeatured(cands, 10).easy).toHaveLength(10);
  });

  it("never repeats a species more than allowed in one level", () => {
    const cands = Array.from({ length: 10 }, (_, i) => c(i, [1, 100 + i], "normal"));
    const out = selectFeatured(cands, 10, 2).normal;
    expect(out).toHaveLength(2);
  });

  it("counts repetitions per level, not globally", () => {
    const cands = [c(1, [1, 2], "easy"), c(2, [1, 3], "easy"), c(3, [1, 4], "hard"), c(4, [1, 5], "hard")];
    const out = selectFeatured(cands, 10, 2);
    expect(out.easy).toHaveLength(2);
    expect(out.hard).toHaveLength(2);
  });

  it("spreads the starters instead of capping them at 2 (D-022)", () => {
    const starters = [252, 255, 258];
    const cands = Array.from({ length: 40 }, (_, i) => ({ ...c(i, [starters[i % 3]!, 1000 + i], "easy"), starter: starters[i % 3] }));
    const out = selectFeatured(cands, 10, 2).easy;
    expect(out).toHaveLength(10);
    for (const s of starters) expect(out.filter((t) => t.starter === s).length).toBeLessThanOrEqual(4);
  });

  it("skips identical teams in another order", () => {
    const out = selectFeatured([c(1, [1, 2, 3], "easy"), c(2, [3, 1, 2], "easy")]);
    expect(out.easy.map((t) => t.seed)).toEqual([1]);
  });

  it("sorts each level from easiest to hardest", () => {
    const out = selectFeatured([c(1, [1], "hard", 38), c(2, [2], "hard", 31), c(3, [3], "hard", 35)]);
    expect(out.hard.map((t) => t.score)).toEqual([31, 35, 38]);
  });
});
