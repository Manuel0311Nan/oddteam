import { describe, expect, it } from "vitest";
import { loadClientGame } from "@/lib/game-data";
import type { Difficulty, PoolEntry } from "@/lib/types";
import { DIFFICULTY_CUTS } from "./constants";
import { computeDifficulty, levelOf } from "./difficulty";
import { difficultyDataOf } from "./difficulty-data";

// Real Emerald data produced by `pnpm data:build`.
const game = loadClientGame("emerald")!;
const data = difficultyDataOf(game);
const byName = new Map(game.pool.map((p) => [game.species[p.finalFormId]!.name, p]));
const team = (...names: string[]): PoolEntry[] =>
  names.map((n) => {
    const e = byName.get(n);
    if (!e) throw new Error(`${n} is not in the Emerald pool`);
    return e;
  });

describe("levelOf", () => {
  it("uses the calibrated cuts", () => {
    expect(levelOf(0)).toBe("easy");
    expect(levelOf(DIFFICULTY_CUTS.normal - 1)).toBe("easy");
    expect(levelOf(DIFFICULTY_CUTS.normal)).toBe("normal");
    expect(levelOf(DIFFICULTY_CUTS.hard)).toBe("hard");
    expect(levelOf(DIFFICULTY_CUTS.challenge)).toBe("challenge");
    expect(levelOf(100)).toBe("challenge");
  });
});

describe("computeDifficulty", () => {
  it("returns components in 0–100 and a rounded score", () => {
    const d = computeDifficulty(team("Swampert", "Gardevoir", "Breloom"), data);
    for (const v of [d.score, ...Object.values(d.components)]) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
      expect(Number.isInteger(v)).toBe(true);
    }
  });

  it("a later team is less available", () => {
    const early = computeDifficulty(team("Swampert", "Mightyena", "Swellow"), data);
    const late = computeDifficulty(team("Swampert", "Wailord", "Glalie"), data);
    expect(late.components.availability).toBeGreaterThan(early.components.availability);
  });

  it("penalises a thin start (fewer than 2 members before the 1st gym)", () => {
    const one = computeDifficulty(team("Swampert", "Hariyama"), data); // Makuhita after gym 2
    const two = computeDifficulty(team("Swampert", "Mightyena"), data);
    expect(one.components.availability - two.components.availability).toBeGreaterThanOrEqual(25);
  });

  it("does not depend on rarity (D-011)", () => {
    const t = team("Swampert", "Gardevoir", "Breloom");
    const rare = t.map((m) => ({ ...m, rarity: "very-rare" as const }));
    expect(computeDifficulty(rare, data)).toEqual(computeDifficulty(t, data));
  });

  it("is deterministic and order-independent", () => {
    const a = computeDifficulty(team("Blaziken", "Gyarados", "Kadabra"), data);
    const b = computeDifficulty(team("Kadabra", "Blaziken", "Gyarados"), data);
    expect(a).toEqual(b);
  });
});

/**
 * Reference teams (specs/05, "Calibración"). PROVISIONAL: chosen by construction
 * (early and strong vs. late and weak), pending confirmation with real playthroughs.
 * A change in weights or cuts must not move them without updating this test on purpose.
 */
const REFERENCES: { level: Difficulty; names: string[]; why: string }[] = [
  {
    level: "easy",
    names: ["Swampert", "Gardevoir", "Breloom", "Manectric", "Swellow", "Mightyena"],
    why: "Casi todo antes del 1er gimnasio, buenas stats y cobertura",
  },
  {
    level: "normal",
    names: ["Sceptile", "Pelipper", "Hariyama", "Magneton", "Camerupt", "Altaria"],
    why: "Se completa a mitad de historia; algún gimnasio cuesta arriba",
  },
  {
    level: "hard",
    names: ["Blaziken", "Wailord", "Absol", "Glalie", "Lanturn", "Cacturne"],
    why: "Solo el inicial hasta el 5º gimnasio",
  },
  {
    level: "hard",
    names: ["Swampert", "Luvdisc", "Spinda", "Castform", "Volbeat", "Banette"],
    why: "Llega tarde y con stats bajas",
  },
  {
    level: "challenge",
    names: ["Sceptile", "Shedinja", "Seaking", "Glalie", "Ninetales", "Altaria"],
    why: "Huecos tardíos, malos enfrentamientos y poca cobertura",
  },
];

describe("reference teams (Emerald)", () => {
  for (const ref of REFERENCES) {
    it(`${ref.names.join(", ")} → ${ref.level} (${ref.why})`, () => {
      expect(computeDifficulty(team(...ref.names), data).level).toBe(ref.level);
    });
  }
});
