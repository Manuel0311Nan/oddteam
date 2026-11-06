import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { GeneratedSpecies } from "@/lib/generated-types";
import { computeDifficulty } from "@/lib/analysis/difficulty";
import { difficultyDataOf } from "@/lib/analysis/difficulty-data";
import { loadClientGame } from "@/lib/game-data";
import { createRng, deriveSeed } from "@/lib/rng";
import {
  DIFFICULTIES,
  type Game,
  type GeneratorOptions,
  type PoolEntry,
  type RarityFilter,
  TYPE_NAMES,
  type TypeRule,
  type Typing,
} from "@/lib/types";
import { createContext, entryKey, isEarly, requiredGroups } from "./context";
import { captureEffort } from "./effort";
import { rejectReason } from "./filter";
import { generateTeam, rerollSlot } from "./generate";
import { DEFAULT_OPTIONS } from "./options";
import { validateTeam } from "./validate";

// Real Emerald data produced by `pnpm data:build`.
const root = join(process.cwd(), "data", "generated", "emerald");
const game = JSON.parse(readFileSync(join(root, "game.json"), "utf8")) as Game;
const species = JSON.parse(readFileSync(join(root, "pokeapi", "species.json"), "utf8")) as GeneratedSpecies[];
const typings = new Map<number, Typing>(species.map((s) => [s.id, s.typing]));
const ctx = createContext(game, typings, "Esmeralda");
const slug = new Map(species.map((s) => [s.id, s.slug]));
const names = (team: readonly PoolEntry[]) => team.map((e) => slug.get(e.finalFormId));

const HOENN_STARTERS = new Set([252, 255, 258]);

describe("generateTeam with default options", () => {
  const result = generateTeam({ ctx, options: DEFAULT_OPTIONS, seed: 0x7f3a91c2 });

  it("returns a valid team of 6", () => {
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.team).toHaveLength(6);
    expect(validateTeam(ctx, result.team, DEFAULT_OPTIONS, true)).toEqual([]);
  });

  it("is deterministic", () => {
    const again = generateTeam({ ctx, options: DEFAULT_OPTIONS, seed: 0x7f3a91c2 });
    expect(again.ok && result.ok && names(again.team)).toEqual(result.ok && names(result.team));
  });

  it("changes with the seed", () => {
    const other = generateTeam({ ctx, options: DEFAULT_OPTIONS, seed: 1 });
    expect(other.ok && result.ok && names(other.team)).not.toEqual(result.ok && names(result.team));
  });

  it("includes exactly one Hoenn starter", () => {
    if (!result.ok) throw new Error("expected a team");
    expect(result.team.filter((e) => HOENN_STARTERS.has(e.speciesId))).toHaveLength(1);
  });

  it("has at least 3 members before the 2nd gym", () => {
    if (!result.ok) throw new Error("expected a team");
    expect(result.team.filter((e) => isEarly(ctx, e)).length).toBeGreaterThanOrEqual(3);
  });
});

describe("options", () => {
  it("respects starter = none and pick", () => {
    const none = generateTeam({ ctx, options: { ...DEFAULT_OPTIONS, starter: { mode: "none" } }, seed: 5 });
    expect(none.ok && none.team.some((e) => e.flags.starter)).toBe(false);
    const pick = generateTeam({ ctx, options: { ...DEFAULT_OPTIONS, starter: { mode: "pick", speciesId: 258 } }, seed: 5 });
    expect(pick.ok && pick.team.some((e) => e.speciesId === 258)).toBe(true);
  });

  it("builds mono-type teams or explains why not", () => {
    const water = generateTeam({
      ctx,
      options: { ...DEFAULT_OPTIONS, typeRule: { mode: "mono", type: "water" }, starter: { mode: "none" } },
      seed: 9,
    });
    expect(water.ok).toBe(true);
    if (water.ok) for (const m of water.team) expect(ctx.typingOf(m.finalFormId)).toContain("water");

    const fairy = generateTeam({ ctx, options: { ...DEFAULT_OPTIONS, typeRule: { mode: "mono", type: "fairy" } }, seed: 9 });
    expect(fairy).toMatchObject({ ok: false, code: "pool-too-small" });
  });

  it("never puts two fossils together", () => {
    for (let s = 0; s < 300; s++) {
      const r = generateTeam({ ctx, options: { ...DEFAULT_OPTIONS, balancedProgression: false, typeRule: { mode: "free" } }, seed: s });
      if (!r.ok) continue;
      expect(r.team.filter((e) => requiredGroups(e).has("fossil")).length).toBeLessThanOrEqual(1);
    }
  });

  it("makes recent members less likely", () => {
    const target = ctx.pool.find((e) => isEarly(ctx, e) && !e.flags.starter) as PoolEntry;
    const appearances = (recent: number[]) => {
      let hits = 0;
      for (let s = 0; s < 400; s++) {
        const r = generateTeam({ ctx, options: { ...DEFAULT_OPTIONS, starter: { mode: "none" } }, seed: s, recent });
        if (r.ok && r.team.some((e) => entryKey(e) === entryKey(target))) hits++;
      }
      return hits;
    };
    const normal = appearances([]);
    const penalized = appearances([entryKey(target)]);
    expect(normal).toBeGreaterThan(20);
    expect(penalized).toBeLessThan(normal * 0.6);
  });

  it("rejects the difficulty filter when the context cannot estimate difficulty", () => {
    expect(generateTeam({ ctx, options: { ...DEFAULT_OPTIONS, difficulty: "hard" }, seed: 1 })).toMatchObject({
      ok: false,
      code: "difficulty-unavailable",
    });
  });
});

describe("difficulty filter (specs/03 step 6, specs/05)", () => {
  const client = loadClientGame("emerald")!;
  const dd = difficultyDataOf(client);
  const withDifficulty = createContext(game, typings, "Esmeralda", (team) => computeDifficulty(team, dd).level);

  for (const level of DIFFICULTIES) {
    it(`only returns ${level} teams`, () => {
      for (let i = 0; i < 20; i++) {
        const r = generateTeam({ ctx: withDifficulty, options: { ...DEFAULT_OPTIONS, difficulty: level }, seed: deriveSeed(7, level, i) });
        expect(r.ok).toBe(true);
        if (r.ok) expect(computeDifficulty(r.team, dd).level).toBe(level);
      }
    });
  }

  it("keeps a fully locked team as it is", () => {
    const base = generateTeam({ ctx: withDifficulty, options: { ...DEFAULT_OPTIONS, difficulty: "easy" }, seed: 3 });
    if (!base.ok) throw new Error("expected a team");
    const locked = base.team.map(entryKey);
    const r = generateTeam({ ctx: withDifficulty, options: { ...DEFAULT_OPTIONS, difficulty: "challenge" }, seed: 4, locked });
    expect(r.ok && r.team.map(entryKey)).toEqual(locked);
  });

  it("explains when no team of that level exists with the locked members", () => {
    const easy = generateTeam({ ctx: withDifficulty, options: { ...DEFAULT_OPTIONS, difficulty: "easy" }, seed: 5 });
    if (!easy.ok) throw new Error("expected a team");
    const r = generateTeam({
      ctx: withDifficulty,
      options: { ...DEFAULT_OPTIONS, difficulty: "challenge" },
      seed: 6,
      locked: easy.team.slice(0, 5).map(entryKey),
    });
    expect(r).toMatchObject({ ok: false, code: "no-difficulty" });
  });
});

describe("locked members and Cambiar", () => {
  const base = generateTeam({ ctx, options: DEFAULT_OPTIONS, seed: 42 });
  if (!base.ok) throw new Error("expected a team");

  it("keeps locked members", () => {
    const keep = [entryKey(base.team[0] as PoolEntry), entryKey(base.team[3] as PoolEntry)];
    const r = generateTeam({ ctx, options: DEFAULT_OPTIONS, seed: 99, locked: keep });
    expect(r.ok && r.team.slice(0, 2).map(entryKey)).toEqual(keep);
  });

  it("rerolls one slot and keeps the rest", () => {
    const { seed, result } = rerollSlot({ ctx, options: DEFAULT_OPTIONS, seed: 42, team: base.team, slot: 2, counter: 1 });
    expect(seed).toBe(deriveSeed(42, "slot", 2, 1));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const before = base.team.map(entryKey);
    const after = result.team.map(entryKey);
    expect(after).toHaveLength(6);
    for (const [i, id] of before.entries()) if (i !== 2) expect(after).toContain(id);
    expect(after).not.toContain(before[2]);
  });

  it("reports incompatible locked members", () => {
    const fossils = ctx.pool.filter((e) => requiredGroups(e).has("fossil")).map(entryKey);
    expect(fossils.length).toBeGreaterThanOrEqual(2);
    const r = generateTeam({ ctx, options: { ...DEFAULT_OPTIONS, typeRule: { mode: "free" } }, seed: 1, locked: fossils.slice(0, 2) });
    expect(r).toMatchObject({ ok: false, code: "invalid-locked" });
  });
});

describe("sampling (specs/02: 10 000 teams, none invalid)", () => {
  it("never returns an invalid team", () => {
    const rng = createRng(2026);
    const typeRules: TypeRule[] = [
      { mode: "unique" },
      { mode: "max-two" },
      { mode: "free" },
      ...TYPE_NAMES.map((type) => ({ mode: "mono" as const, type })),
    ];
    const rarities: RarityFilter[] = ["any", "no-very-rare", "easy-only"];
    const starterIds = [252, 255, 258];
    let ok = 0;
    let failed = 0;

    for (let i = 0; i < 10_000; i++) {
      const options: GeneratorOptions = {
        ...DEFAULT_OPTIONS,
        size: rng.int(1, 6),
        starter: rng.pick([{ mode: "none" }, { mode: "random" }, { mode: "pick", speciesId: rng.pick(starterIds) }] as const),
        typeRule: rng.next() < 0.6 ? rng.pick(typeRules.slice(0, 3)) : rng.pick(typeRules),
        balancedProgression: rng.next() < 0.5,
        allowTradeEvolutions: rng.next() < 0.5,
        allowLegendaries: rng.next() < 0.3,
        rarity: rng.pick(rarities),
        difficulty: "any",
      };
      const r = generateTeam({ ctx, options, seed: rng.int(0, 0xffffffff) });
      if (!r.ok) {
        failed++;
        expect(r.message.length).toBeGreaterThan(0);
        continue;
      }
      ok++;
      const starterAvailable = ctx.pool.some((e) => e.flags.starter && rejectReason(ctx, e, options) === null);
      expect(validateTeam(ctx, r.team, options, starterAvailable), JSON.stringify(options)).toEqual([]);
      for (const m of r.team) {
        // The picked starter is forced even if a filter (e.g. rarity) would drop it.
        if (options.starter.mode === "pick" && m.flags.starter) continue;
        expect(rejectReason(ctx, m, options), `${slug.get(m.finalFormId)} ${JSON.stringify(options)}`).toBeNull();
      }
    }
    expect(ok).toBeGreaterThan(5000);
    expect(ok + failed).toBe(10_000);
    expect(DIFFICULTIES.length).toBe(4);
  });
});

describe("captureEffort", () => {
  const e = (rarity: PoolEntry["rarity"]) => ({ rarity }) as PoolEntry;
  it("follows specs/03", () => {
    expect(captureEffort([e("common"), e("guaranteed")])).toBe("low");
    expect(captureEffort([e("rare"), e("common")])).toBe("medium");
    expect(captureEffort([e("rare"), e("rare")])).toBe("high");
    expect(captureEffort([e("very-rare")])).toBe("high");
  });
});
