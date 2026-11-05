import { describe, expect, it } from "vitest";
import {
  effectiveness,
  hasType,
  singleMultiplier,
  type TypeChart,
  UnknownTypeError,
  validateTypeChart,
  weaknesses,
} from "@/lib/analysis/types";
import { TYPE_NAMES, type TypeName } from "@/lib/types";

/*
 * Partial fixtures with well-known relations. The real charts come from
 * PokéAPI in phase F2; these only exercise the logic.
 */
const GEN3_TYPES = TYPE_NAMES.filter((t) => t !== "fairy");

const gen3: TypeChart = {
  generation: 3,
  types: GEN3_TYPES,
  damage: {
    water: { fire: 2, ground: 2, rock: 2, water: 0.5, grass: 0.5, dragon: 0.5 },
    fire: { grass: 2, water: 0.5, rock: 0.5 },
    electric: { water: 2, flying: 2, ground: 0, grass: 0.5, electric: 0.5, dragon: 0.5 },
    ground: { electric: 2, rock: 2, steel: 2, fire: 2, flying: 0 },
    grass: { water: 2, ground: 2, rock: 2, flying: 0.5 },
    ghost: { ghost: 2, psychic: 2, normal: 0, steel: 0.5, dark: 0.5 },
    dark: { ghost: 2, psychic: 2, steel: 0.5, dark: 0.5 },
  },
};

const gen6: TypeChart = {
  generation: 6,
  types: TYPE_NAMES,
  damage: {
    ...gen3.damage,
    ghost: { ghost: 2, psychic: 2, normal: 0, dark: 0.5 },
    dark: { ghost: 2, psychic: 2, dark: 0.5, fairy: 0.5 },
    dragon: { dragon: 2, fairy: 0, steel: 0.5 },
  },
};

describe("effectiveness", () => {
  it("handles single-type matchups", () => {
    expect(effectiveness(gen3, "water", ["fire"])).toBe(2);
    expect(effectiveness(gen3, "fire", ["water"])).toBe(0.5);
    expect(effectiveness(gen3, "normal", ["fire"])).toBe(1);
  });

  it("multiplies dual types (Pelipper vs Electric is ×4)", () => {
    expect(effectiveness(gen3, "electric", ["water", "flying"])).toBe(4);
    expect(effectiveness(gen3, "grass", ["water", "flying"])).toBe(1);
  });

  it("returns 0 for immunities", () => {
    expect(effectiveness(gen3, "electric", ["ground"])).toBe(0);
    expect(effectiveness(gen3, "ground", ["steel", "flying"])).toBe(0);
  });

  it("respects generation changes (Ghost and Dark vs Steel)", () => {
    expect(singleMultiplier(gen3, "ghost", "steel")).toBe(0.5);
    expect(singleMultiplier(gen6, "ghost", "steel")).toBe(1);
    expect(singleMultiplier(gen3, "dark", "steel")).toBe(0.5);
    expect(singleMultiplier(gen6, "dark", "steel")).toBe(1);
  });
});

describe("types that do not exist in a generation", () => {
  it("Fairy does not exist in Gen 3", () => {
    expect(hasType(gen3, "fairy")).toBe(false);
    expect(hasType(gen6, "fairy")).toBe(true);
    expect(() => effectiveness(gen3, "fairy", ["dragon"])).toThrow(UnknownTypeError);
    expect(() => effectiveness(gen3, "dragon", ["fairy"])).toThrow(UnknownTypeError);
  });

  it("Fairy works from Gen 6", () => {
    expect(effectiveness(gen6, "dragon", ["fairy"])).toBe(0);
  });
});

describe("weaknesses", () => {
  it("lists ×4 before ×2", () => {
    const result = weaknesses(gen3, ["water", "flying"]);
    expect(result[0]).toEqual({ type: "electric", multiplier: 4 });
  });

  it("only considers the generation's types", () => {
    const types = weaknesses(gen3, ["dragon"]).map((w) => w.type);
    expect(types).not.toContain("fairy" satisfies TypeName);
  });
});

describe("validateTypeChart", () => {
  it("accepts a well-formed chart", () => {
    expect(validateTypeChart(gen3)).toEqual([]);
  });

  it("reports unknown types and invalid multipliers", () => {
    const broken = {
      generation: 3,
      types: GEN3_TYPES,
      damage: { dragon: { fairy: 0 }, fire: { grass: 3 } },
    } as unknown as TypeChart;
    const errors = validateTypeChart(broken);
    expect(errors).toContain("Unknown defending type: fairy");
    expect(errors).toContain("Invalid multiplier fire→grass: 3");
  });
});
