import { describe, expect, it } from "vitest";
import {
  bestRarity,
  compareRarity,
  encounterRarity,
  passesRarityFilter,
  rarityFromChance,
} from "@/lib/analysis/rarity";

describe("rarityFromChance", () => {
  it("applies the thresholds from specs/02", () => {
    expect(rarityFromChance(100)).toBe("common");
    expect(rarityFromChance(20)).toBe("common");
    expect(rarityFromChance(19)).toBe("uncommon");
    expect(rarityFromChance(5)).toBe("uncommon");
    expect(rarityFromChance(4)).toBe("rare");
    expect(rarityFromChance(1)).toBe("rare");
    expect(rarityFromChance(0.5)).toBe("very-rare");
    expect(rarityFromChance(0)).toBe("very-rare");
  });

  it("rejects invalid chances", () => {
    expect(() => rarityFromChance(-1)).toThrow(RangeError);
    expect(() => rarityFromChance(Number.NaN)).toThrow(RangeError);
  });
});

describe("encounterRarity", () => {
  it("treats gifts, statics and in-game trades as guaranteed", () => {
    expect(encounterRarity({ kind: "gift" })).toBe("guaranteed");
    expect(encounterRarity({ kind: "static" })).toBe("guaranteed");
    expect(encounterRarity({ kind: "trade-ingame" })).toBe("guaranteed");
  });

  it("lets a curated rarity win over the chance", () => {
    expect(encounterRarity({ kind: "wild", chance: 50, rarity: "very-rare" })).toBe("very-rare");
  });

  it("uses the chance for wild encounters", () => {
    expect(encounterRarity({ kind: "wild", chance: 4 })).toBe("rare");
    expect(() => encounterRarity({ kind: "wild" })).toThrow(RangeError);
  });
});

describe("bestRarity", () => {
  it("picks the easiest option", () => {
    expect(
      bestRarity([
        { kind: "wild", chance: 0.5 },
        { kind: "wild", chance: 25 },
        { kind: "wild", chance: 4 },
      ]),
    ).toBe("common");
    expect(bestRarity([{ kind: "wild", chance: 1 }, { kind: "gift" }])).toBe("guaranteed");
  });

  it("returns null without encounters", () => {
    expect(bestRarity([])).toBeNull();
  });
});

describe("compareRarity and passesRarityFilter", () => {
  it("orders from easiest to hardest", () => {
    expect(compareRarity("common", "rare")).toBeLessThan(0);
    expect(compareRarity("very-rare", "guaranteed")).toBeGreaterThan(0);
  });

  it("implements the three filters", () => {
    expect(passesRarityFilter("very-rare", "any")).toBe(true);
    expect(passesRarityFilter("very-rare", "no-very-rare")).toBe(false);
    expect(passesRarityFilter("rare", "no-very-rare")).toBe(true);
    expect(passesRarityFilter("rare", "easy-only")).toBe(false);
    expect(passesRarityFilter("uncommon", "easy-only")).toBe(true);
    expect(passesRarityFilter("guaranteed", "easy-only")).toBe(true);
  });
});
