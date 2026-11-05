import { describe, expect, it } from "vitest";
import {
  createRng,
  deriveSeed,
  formatSeed,
  newSeed,
  parseSeed,
  seedToParam,
} from "@/lib/rng";

const sample = (seed: number, n = 20) => {
  const rng = createRng(seed);
  return Array.from({ length: n }, () => rng.next());
};

describe("createRng", () => {
  it("is reproducible for the same seed", () => {
    expect(sample(0x7f3a91c2)).toEqual(sample(0x7f3a91c2));
  });

  it("differs between seeds", () => {
    expect(sample(1)).not.toEqual(sample(2));
  });

  it("keeps a stable sequence across versions of the code", () => {
    // Golden values: if this test fails, shared URLs would produce different teams.
    const rng = createRng(42);
    const values = [rng.next(), rng.next(), rng.next()].map((v) => v.toFixed(10));
    expect(values).toMatchInlineSnapshot(`
      [
        "0.6011037519",
        "0.4482905590",
        "0.8524657935",
      ]
    `);
  });

  it("produces floats in [0, 1)", () => {
    for (const v of sample(123, 5000)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it("int() covers the whole inclusive range", () => {
    const rng = createRng(7);
    const seen = new Set<number>();
    for (let i = 0; i < 2000; i++) seen.add(rng.int(1, 6));
    expect([...seen].sort()).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("int() rejects invalid ranges", () => {
    const rng = createRng(7);
    expect(() => rng.int(5, 1)).toThrow(RangeError);
    expect(() => rng.int(0.5, 2)).toThrow(RangeError);
  });

  it("pick() rejects empty arrays", () => {
    expect(() => createRng(1).pick([])).toThrow(RangeError);
  });

  it("weightedPick() never picks zero-weight items", () => {
    const rng = createRng(99);
    const items = ["a", "b", "c"] as const;
    for (let i = 0; i < 1000; i++) {
      expect(rng.weightedPick(items, (x) => (x === "b" ? 0 : 1))).not.toBe("b");
    }
  });

  it("weightedPick() follows the weights roughly", () => {
    const rng = createRng(2024);
    let heavy = 0;
    const runs = 10_000;
    for (let i = 0; i < runs; i++) {
      if (rng.weightedPick(["heavy", "light"], (x) => (x === "heavy" ? 3 : 1)) === "heavy") {
        heavy++;
      }
    }
    expect(heavy / runs).toBeGreaterThan(0.72);
    expect(heavy / runs).toBeLessThan(0.78);
  });

  it("weightedPick() throws when no weight is positive", () => {
    expect(() => createRng(1).weightedPick([1, 2], () => 0)).toThrow(RangeError);
  });

  it("shuffle() returns a permutation and leaves the input untouched", () => {
    const input = [1, 2, 3, 4, 5, 6];
    const out = createRng(5).shuffle(input);
    expect(out.slice().sort()).toEqual(input);
    expect(input).toEqual([1, 2, 3, 4, 5, 6]);
  });
});

describe("deriveSeed", () => {
  it("is deterministic and label-sensitive", () => {
    expect(deriveSeed(10, "slot", 3)).toBe(deriveSeed(10, "slot", 3));
    expect(deriveSeed(10, "slot", 3)).not.toBe(deriveSeed(10, "slot", 4));
    expect(deriveSeed(10, "slot", 3)).not.toBe(deriveSeed(11, "slot", 3));
  });

  it("does not collide on label boundaries", () => {
    expect(deriveSeed(1, "ab", "c")).not.toBe(deriveSeed(1, "a", "bc"));
  });
});

describe("seed formatting", () => {
  it("formats for display and URL", () => {
    expect(formatSeed(0x7f3a91c2)).toBe("7F3A-91C2");
    expect(formatSeed(0x1)).toBe("0000-0001");
    expect(seedToParam(0x7f3a91c2)).toBe("7F3A91C2");
  });

  it("parses with or without dash and in any case", () => {
    expect(parseSeed("7F3A-91C2")).toBe(0x7f3a91c2);
    expect(parseSeed("7f3a91c2")).toBe(0x7f3a91c2);
    expect(parseSeed(" 0000-0001 ")).toBe(1);
  });

  it("rejects anything else", () => {
    for (const bad of ["", "7F3A", "7F3A-91C2X", "ZZZZ-ZZZZ", "7F-3A91C2"]) {
      expect(parseSeed(bad)).toBeNull();
    }
  });

  it("round-trips", () => {
    for (const seed of [0, 1, 0xffffffff, 0x7f3a91c2]) {
      expect(parseSeed(formatSeed(seed))).toBe(seed);
      expect(parseSeed(seedToParam(seed))).toBe(seed);
    }
  });

  it("newSeed() returns an unsigned 32-bit integer", () => {
    const seed = newSeed();
    expect(Number.isInteger(seed)).toBe(true);
    expect(seed).toBeGreaterThanOrEqual(0);
    expect(seed).toBeLessThanOrEqual(0xffffffff);
  });
});
