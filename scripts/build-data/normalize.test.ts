import { describe, expect, it } from "vitest";
import {
  buildTypeChart,
  filterEvolutionsByItems,
  learnsetFor,
  machineNumber,
  normalizeEvolutionChain,
  statsForGeneration,
} from "./normalize";
import type { ApiChainLink, ApiPokemon, ApiType } from "./pokeapi-types";

const ref = (name: string, url = "") => ({ name, url });
const gen = (n: string) => ref(`generation-${n}`);

describe("statsForGeneration", () => {
  // Pelipper: Sp. Atk 95 now, 85 up to and including Gen VI.
  const current = [
    { base_stat: 60, stat: ref("hp") },
    { base_stat: 95, stat: ref("special-attack") },
  ];
  const past = [{ generation: gen("vi"), stats: [{ base_stat: 85, stat: ref("special-attack") }] }];

  it("applies only the stats that changed", () => {
    expect(statsForGeneration(current, past, 3)).toEqual({ hp: 60, specialAttack: 85 });
    expect(statsForGeneration(current, past, 7)).toEqual({ hp: 60, specialAttack: 95 });
  });
});

describe("learnsetFor", () => {
  const pokemon = {
    moves: [
      {
        move: ref("tackle"),
        version_group_details: [
          { level_learned_at: 1, move_learn_method: ref("level-up"), version_group: ref("emerald") },
          { level_learned_at: 1, move_learn_method: ref("level-up"), version_group: ref("ruby-sapphire") },
        ],
      },
      {
        move: ref("water-gun"),
        version_group_details: [
          { level_learned_at: 7, move_learn_method: ref("level-up"), version_group: ref("emerald") },
        ],
      },
      {
        move: ref("surf"),
        version_group_details: [
          { level_learned_at: 0, move_learn_method: ref("machine"), version_group: ref("emerald") },
        ],
      },
      {
        move: ref("mud-sport"),
        version_group_details: [
          { level_learned_at: 0, move_learn_method: ref("egg"), version_group: ref("emerald") },
        ],
      },
      {
        move: ref("hydro-pump"),
        version_group_details: [
          { level_learned_at: 46, move_learn_method: ref("level-up"), version_group: ref("x-y") },
        ],
      },
    ],
  } as unknown as ApiPokemon;

  it("keeps only the version group and splits by method", () => {
    expect(learnsetFor(pokemon, "emerald")).toEqual({
      levelUp: [
        { moveId: "tackle", level: 1 },
        { moveId: "water-gun", level: 7 },
      ],
      machine: ["surf"],
      tutor: [],
      egg: ["mud-sport"],
    });
  });
});

describe("machineNumber", () => {
  it("formats TM and HM items", () => {
    expect(machineNumber("tm01")).toBe("TM01");
    expect(machineNumber("hm05")).toBe("HM05");
    expect(() => machineNumber("potion")).toThrow();
  });
});

describe("buildTypeChart", () => {
  const rel = (to2: string[], half: string[], none: string[]) => ({
    double_damage_to: to2.map((n) => ref(n)),
    half_damage_to: half.map((n) => ref(n)),
    no_damage_to: none.map((n) => ref(n)),
  });
  const types: ApiType[] = [
    { id: 8, name: "ghost", names: [], generation: gen("i"), damage_relations: rel(["ghost", "psychic"], ["dark"], ["normal"]), past_damage_relations: [{ generation: gen("v"), damage_relations: rel(["ghost", "psychic"], ["dark", "steel"], ["normal"]) }] },
    { id: 1, name: "normal", names: [], generation: gen("i"), damage_relations: rel([], ["steel"], ["ghost"]), past_damage_relations: [] },
    { id: 9, name: "steel", names: [], generation: gen("ii"), damage_relations: rel(["fairy"], [], []), past_damage_relations: [] },
    { id: 14, name: "psychic", names: [], generation: gen("i"), damage_relations: rel([], [], []), past_damage_relations: [] },
    { id: 17, name: "dark", names: [], generation: gen("ii"), damage_relations: rel([], [], []), past_damage_relations: [] },
    { id: 18, name: "fairy", names: [], generation: gen("vi"), damage_relations: rel(["dragon"], [], []), past_damage_relations: [] },
    { id: 10001, name: "unknown", names: [], generation: gen("ii"), damage_relations: rel([], [], []), past_damage_relations: [] },
  ];

  it("builds Gen 3 without Fairy and with old Ghost relations", () => {
    const chart = buildTypeChart(types, 3);
    expect(chart.types).toEqual(["normal", "ghost", "steel", "psychic", "dark"]);
    expect(chart.damage.ghost).toEqual({ ghost: 2, psychic: 2, dark: 0.5, steel: 0.5, normal: 0 });
    expect(chart.damage.steel).toBeUndefined(); // its only relation is vs Fairy
  });

  it("builds Gen 6 with Fairy and current relations", () => {
    const chart = buildTypeChart(types, 6);
    expect(chart.types).toContain("fairy");
    expect(chart.damage.ghost).toEqual({ ghost: 2, psychic: 2, dark: 0.5, normal: 0 });
    expect(chart.damage.steel).toEqual({ fairy: 2 });
  });
});

describe("normalizeEvolutionChain", () => {
  const link = (id: number, details: object[], evolvesTo: ApiChainLink[] = []): ApiChainLink =>
    ({
      species: ref(`s${id}`, `/api/v2/pokemon-species/${id}/`),
      evolution_details: details,
      evolves_to: evolvesTo,
    }) as unknown as ApiChainLink;
  const lvl = (n: number) => ({ trigger: ref("level-up"), min_level: n, item: null, held_item: null, min_happiness: null, min_beauty: null, time_of_day: "", known_move: null, known_move_type: null, location: null, trade_species: null, gender: null, relative_physical_stats: null, needs_overworld_rain: false, party_species: null, party_type: null, turn_upside_down: false });

  // Budew (Gen 4) → Roselia (Gen 3) → Roserade (Gen 4)
  const chain = link(406, [], [link(315, [lvl(0)], [link(407, [lvl(0)])])]);
  const generations: Record<number, number> = { 406: 4, 315: 3, 407: 4 };

  it("drops species newer than the generation", () => {
    expect(normalizeEvolutionChain(1, chain, (id) => generations[id] ?? 1, 3)).toEqual({
      id: 1,
      baseSpeciesId: 315,
      steps: [],
    });
  });

  it("keeps the full line in later generations", () => {
    const result = normalizeEvolutionChain(1, chain, (id) => generations[id] ?? 1, 4);
    expect(result?.baseSpeciesId).toBe(406);
    expect(result?.steps.map((s) => [s.fromSpeciesId, s.toSpeciesId])).toEqual([
      [406, 315],
      [315, 407],
    ]);
    expect(result?.steps[0]?.details[0]).toEqual({ trigger: "level-up", minLevel: 0 });
  });
});

describe("filterEvolutionsByItems", () => {
  // Feebas → Milotic: beauty (Gen 3) or trade holding Prism Scale (Gen 5+).
  const chains = [
    {
      id: 178,
      baseSpeciesId: 349,
      steps: [
        {
          fromSpeciesId: 349,
          toSpeciesId: 350,
          details: [
            { trigger: "level-up", minBeauty: 171 },
            { trigger: "trade", heldItem: "prism-scale" },
          ],
        },
      ],
    },
    {
      id: 1,
      baseSpeciesId: 1000,
      steps: [{ fromSpeciesId: 1000, toSpeciesId: 1001, details: [{ trigger: "use-item", item: "ice-stone" }] }],
    },
  ];
  const gen3Items = new Set(["fire-stone", "dragon-scale"]);

  it("drops methods with items that do not exist and impossible steps", () => {
    const { chains: out, removed } = filterEvolutionsByItems(chains, (i) => gen3Items.has(i));
    expect(out[0]?.steps[0]?.details).toEqual([{ trigger: "level-up", minBeauty: 171 }]);
    expect(out[1]?.steps).toEqual([]);
    expect(removed.map((r) => r.reason)).toEqual([
      "objeto prism-scale no existe en esta generación",
      "objeto ice-stone no existe en esta generación",
    ]);
  });
});

describe("normalizeEvolutionChain deduplication", () => {
  it("keeps identical methods once", () => {
    const d = { trigger: { name: "level-up", url: "" }, min_level: 25, item: null, held_item: null, min_happiness: null, min_beauty: null, time_of_day: "", known_move: null, known_move_type: null, location: null, trade_species: null, gender: null, relative_physical_stats: null, needs_overworld_rain: false, party_species: null, party_type: null, turn_upside_down: false };
    const chain = {
      species: { name: "geodude", url: "/api/v2/pokemon-species/74/" },
      evolution_details: [],
      evolves_to: [
        { species: { name: "graveler", url: "/api/v2/pokemon-species/75/" }, evolution_details: [d, d], evolves_to: [] },
      ],
    } as unknown as ApiChainLink;
    expect(normalizeEvolutionChain(1, chain, () => 1, 3)?.steps[0]?.details).toEqual([
      { trigger: "level-up", minLevel: 25 },
    ]);
  });
});
