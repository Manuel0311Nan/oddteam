import { describe, expect, it } from "vitest";
import {
  generationNumber,
  localizedName,
  moveValuesForVersionGroup,
  valueForGeneration,
} from "./resolve";

const gen = (n: string) => ({ name: `generation-${n}`, url: "" });
const vg = (name: string) => ({ name, url: "" });

describe("generationNumber", () => {
  it("parses roman numerals", () => {
    expect(generationNumber("generation-i")).toBe(1);
    expect(generationNumber("generation-iii")).toBe(3);
    expect(generationNumber("generation-iv")).toBe(4);
    expect(generationNumber("generation-vi")).toBe(6);
    expect(generationNumber("generation-ix")).toBe(9);
    expect(generationNumber(gen("v"))).toBe(5);
  });
});

describe("valueForGeneration (past_types / past_stats / past_damage_relations)", () => {
  // Clefairy: Fairy now, Normal up to and including Gen V.
  const history = [{ generation: gen("v"), value: ["normal"] }];

  it("uses the past value up to its last generation", () => {
    expect(valueForGeneration(["fairy"], history, 3)).toEqual(["normal"]);
    expect(valueForGeneration(["fairy"], history, 5)).toEqual(["normal"]);
  });

  it("uses the current value after it", () => {
    expect(valueForGeneration(["fairy"], history, 6)).toEqual(["fairy"]);
  });

  it("picks the earliest applicable entry when there are several", () => {
    // Ghost half_damage_to: Gen I list, then Gen II–V list, then current.
    const ghost = [
      { generation: gen("i"), value: "gen1" },
      { generation: gen("v"), value: "gen2-5" },
    ];
    expect(valueForGeneration("current", ghost, 1)).toBe("gen1");
    expect(valueForGeneration("current", ghost, 3)).toBe("gen2-5");
    expect(valueForGeneration("current", ghost, 6)).toBe("current");
  });
});

describe("moveValuesForVersionGroup (past_values)", () => {
  const order: Record<string, number> = {
    emerald: 8,
    "black-white": 11,
    "sun-moon": 17,
  };
  const orderOf = (name: string) => order[name] ?? 0;
  // Tackle today: 40 / 100. 35 / 95 before Black-White, 50 before Sun-Moon.
  const tackleNow = { power: 40, accuracy: 100, type: "normal" };
  const tacklePast = [
    { version_group: vg("black-white"), power: 35, accuracy: 95, type: null },
    { version_group: vg("sun-moon"), power: 50, accuracy: null, type: null },
  ];

  it("returns Gen 3 values for Emerald", () => {
    expect(moveValuesForVersionGroup(tackleNow, tacklePast, order.emerald!, orderOf)).toEqual({
      power: 35,
      accuracy: 95,
      type: "normal",
    });
  });

  it("returns intermediate values between changes", () => {
    expect(moveValuesForVersionGroup(tackleNow, tacklePast, 12, orderOf)).toEqual({
      power: 50,
      accuracy: 100,
      type: "normal",
    });
  });

  it("returns current values after the last change", () => {
    expect(moveValuesForVersionGroup(tackleNow, tacklePast, 20, orderOf)).toEqual(tackleNow);
  });

  it("applies type changes (e.g. Bite was Normal before Gen II)", () => {
    const now = { power: 60, accuracy: 100, type: "dark" };
    const past = [{ version_group: vg("gold-silver"), power: null, accuracy: null, type: vg("normal") }];
    const o = (n: string) => ({ "red-blue": 1, "gold-silver": 3, emerald: 8 })[n] ?? 0;
    expect(moveValuesForVersionGroup(now, past, 1, o).type).toBe("normal");
    expect(moveValuesForVersionGroup(now, past, 8, o).type).toBe("dark");
  });
});

describe("localizedName", () => {
  const lang = (name: string) => ({ name, url: "" });
  it("prefers Spanish, then English, then the slug", () => {
    expect(
      localizedName(
        [
          { name: "Tackle", language: lang("en") },
          { name: "Placaje", language: lang("es") },
        ],
        "tackle",
      ),
    ).toEqual({ es: "Placaje", en: "Tackle", hasEs: true });
    expect(localizedName([{ name: "Route 101", language: lang("en") }], "x")).toEqual({
      es: "Route 101",
      en: "Route 101",
      hasEs: false,
    });
    expect(localizedName([], "hoenn-route-101")).toEqual({
      es: "hoenn-route-101",
      en: "hoenn-route-101",
      hasEs: false,
    });
  });
});
