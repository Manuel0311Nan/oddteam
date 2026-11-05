import { describe, expect, it } from "vitest";
import { aggregateAreaEncounters, isExcludedCondition, methodKind } from "./encounters";
import type { ApiLocationArea } from "./pokeapi-types";

const ref = (name: string, url = "") => ({ name, url });
const pokemon = (id: number, name: string) => ref(name, `/api/v2/pokemon/${id}/`);
const detail = (chance: number, min: number, max: number, method = "walk", conds: string[] = []) => ({
  chance,
  min_level: min,
  max_level: max,
  method: ref(method),
  condition_values: conds.map((c) => ref(c)),
});

const area: ApiLocationArea = {
  id: 1,
  name: "hoenn-route-101-area",
  names: [],
  location: ref("hoenn-route-101"),
  pokemon_encounters: [
    {
      pokemon: pokemon(263, "zigzagoon"),
      version_details: [
        {
          version: ref("emerald"),
          max_chance: 45,
          encounter_details: [detail(20, 2, 2), detail(20, 3, 3), detail(5, 2, 2)],
        },
        {
          version: ref("ruby"),
          max_chance: 45,
          encounter_details: [detail(99, 2, 2)],
        },
      ],
    },
    {
      pokemon: pokemon(129, "magikarp"),
      version_details: [
        {
          version: ref("emerald"),
          max_chance: 100,
          encounter_details: [detail(70, 5, 10, "old-rod"), detail(60, 5, 10, "good-rod")],
        },
      ],
    },
    {
      pokemon: pokemon(999, "only-ruby"),
      version_details: [
        { version: ref("ruby"), max_chance: 10, encounter_details: [detail(10, 3, 3)] },
      ],
    },
  ],
};

describe("aggregateAreaEncounters", () => {
  const result = aggregateAreaEncounters(area, "emerald");

  it("keeps only the requested version", () => {
    expect(result.map((e) => e.pokemonId)).not.toContain(999);
  });

  it("sums slots of the same method and conditions and widens levels", () => {
    const zig = result.find((e) => e.pokemonId === 263);
    expect(zig).toEqual({
      pokemonId: 263,
      locationAreaId: "hoenn-route-101-area",
      method: "walk",
      conditions: [],
      chance: 45,
      levels: [2, 3],
    });
  });

  it("keeps different methods apart", () => {
    const karp = result.filter((e) => e.pokemonId === 129).map((e) => [e.method, e.chance]);
    expect(karp).toEqual([
      ["good-rod", 60],
      ["old-rod", 70],
    ]);
  });

  it("separates condition sets", () => {
    const withTime: ApiLocationArea = {
      ...area,
      pokemon_encounters: [
        {
          pokemon: pokemon(163, "hoothoot"),
          version_details: [
            {
              version: ref("heartgold"),
              max_chance: 60,
              encounter_details: [
                detail(30, 3, 3, "walk", ["time-night"]),
                detail(30, 4, 4, "walk", ["time-night"]),
                detail(10, 3, 3, "walk", ["time-morning"]),
              ],
            },
          ],
        },
      ],
    };
    const r = aggregateAreaEncounters(withTime, "heartgold");
    expect(r.map((e) => [e.conditions, e.chance])).toEqual([
      [["time-morning"], 10],
      [["time-night"], 60],
    ]);
  });
});

describe("isExcludedCondition", () => {
  it("excludes swarms, Pokéradar and GBA slot encounters", () => {
    expect(isExcludedCondition("swarm-yes")).toBe(true);
    expect(isExcludedCondition("radar-on")).toBe(true);
    expect(isExcludedCondition("slot2-ruby")).toBe(true);
  });

  it("keeps time of day, seasons and 'off/none' states", () => {
    for (const c of ["time-night", "season-spring", "swarm-no", "radar-off", "slot2-none"]) {
      expect(isExcludedCondition(c), c).toBe(false);
    }
  });
});

describe("methodKind", () => {
  it("classifies the methods PokéAPI uses in Emerald", () => {
    expect(methodKind("walk")).toBe("wild");
    expect(methodKind("feebas-tile-fishing")).toBe("wild");
    expect(methodKind("gift")).toBe("gift");
    expect(methodKind("gift-egg")).toBe("gift");
    expect(methodKind("static")).toBe("static");
    expect(methodKind("devon-scope")).toBe("static");
    expect(methodKind("npc-trade")).toBe("trade-ingame");
    expect(methodKind("roaming-grass")).toBe("roaming");
    expect(methodKind("colosseum-bonus-disc-jpn")).toBe("excluded");
  });

  it("leaves unknown methods unclassified", () => {
    expect(methodKind("some-new-method")).toBeUndefined();
  });
});
