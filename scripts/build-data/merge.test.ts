import { describe, expect, it } from "vitest";
import type {
  GeneratedEncounter,
  GeneratedEvolutionChain,
  GeneratedSpecies,
} from "@/lib/generated-types";
import type { FamilyOverrides, VersionOverrides } from "../../data/overrides/types";
import { type MergeInput, merge } from "./merge";

const sp = (id: number, slug: string, extra: Partial<GeneratedSpecies> = {}): GeneratedSpecies => ({
  id,
  slug,
  name: slug,
  nameEn: slug,
  generation: 3,
  typing: ["normal"],
  baseStats: { hp: 1, attack: 1, defense: 1, specialAttack: 1, specialDefense: 1, speed: 1 },
  sprite: null,
  legendary: false,
  mythical: false,
  baby: false,
  captureRate: 45,
  evolutionChainId: null,
  evolvesFrom: null,
  ...extra,
});

const wild = (speciesId: number, area: string, method: string, chance: number, extra: Partial<GeneratedEncounter> = {}): GeneratedEncounter => ({
  speciesId,
  pokemonId: speciesId,
  locationAreaId: area,
  method,
  kind: "wild",
  conditions: [],
  chance,
  levels: [5, 5],
  excluded: false,
  ...extra,
});

const species = [
  sp(1, "zigzagoon"),
  sp(2, "linoone"),
  sp(3, "machop"),
  sp(4, "machoke"),
  sp(5, "machamp"),
  sp(6, "magikarp"),
  sp(7, "beldum"),
  sp(8, "bagon"),
  sp(9, "horsea"),
  sp(10, "vulpix"),
  sp(11, "ninetales"),
];

const chains: GeneratedEvolutionChain[] = [
  { id: 100, baseSpeciesId: 1, steps: [{ fromSpeciesId: 1, toSpeciesId: 2, details: [{ trigger: "level-up", minLevel: 20 }] }] },
  {
    id: 101,
    baseSpeciesId: 3,
    steps: [
      { fromSpeciesId: 3, toSpeciesId: 4, details: [{ trigger: "level-up", minLevel: 28 }] },
      { fromSpeciesId: 4, toSpeciesId: 5, details: [{ trigger: "trade" }] },
    ],
  },
  { id: 102, baseSpeciesId: 6, steps: [] },
  { id: 103, baseSpeciesId: 7, steps: [] },
  { id: 104, baseSpeciesId: 8, steps: [] },
  { id: 105, baseSpeciesId: 9, steps: [] },
  { id: 106, baseSpeciesId: 10, steps: [{ fromSpeciesId: 10, toSpeciesId: 11, details: [{ trigger: "use-item", item: "fire-stone" }] }] },
];

const family: FamilyOverrides = {
  family: "emerald",
  versions: ["emerald"],
  segments: [
    { id: "s1", label: "S1", expectedLevel: 10, source: "pokeapi" },
    { id: "s2", label: "S2", expectedLevel: 20, source: "pokeapi" },
    { id: "s3", label: "S3", expectedLevel: 30, source: "pokeapi" },
  ],
  locations: {
    "route-a": { segment: "s1", source: "pokeapi" },
    "route-b": { segment: "s2", source: "pokeapi" },
    house: { segment: "post-game", source: "pokeapi" },
    "town-c": { segment: "s1", source: "pokeapi" },
  },
  methods: {
    walk: { segment: "s1", source: "pokeapi" },
    "old-rod": { segment: "s2", source: "pokeapi" },
    gift: { segment: "s1", source: "pokeapi" },
    "npc-trade": { segment: "s1", source: "pokeapi" },
  },
  conditions: { "trade-bagon": { source: "pokeapi" } },
  specialEncounters: [],
  evolutionItems: { "fire-stone": { where: "x", segment: "s3", source: "pokeapi", todo: "verificar" } },
  evolutionChoices: [],
  bosses: [
    {
      id: "gym-1",
      name: "Petra",
      kind: "gym",
      segment: "s1",
      rewardTm: "TM39",
      source: "pokeapi",
      team: [{ species: "machop", level: 12, moves: ["tackle"] }],
    },
  ],
  tms: { TM39: { where: "x", segment: "s2", repeatable: false, source: "pokeapi" } },
};

const version: VersionOverrides = { game: "emerald" };

const base = (over: Partial<MergeInput> = {}): MergeInput => ({
  game: "emerald",
  info: {
    slug: "emerald",
    name: "Esmeralda",
    nameEn: "Emerald",
    family: "emerald",
    version: "emerald",
    versionGroup: "emerald",
    versionGroupOrder: 8,
    generation: 3,
    region: "hoenn",
    regionalDex: [1, 2, 3, 4, 5, 6, 7, 10, 11],
  },
  species,
  areas: ["route-a", "route-b", "house", "town-c"].map((id) => ({ id, location: id, name: id, nameEn: id, hasSpanishName: true })),
  encounters: [
    wild(1, "route-a", "walk", 40),
    wild(2, "route-b", "walk", 10), // Linoone caught later: same line, no duplicate entry
    wild(3, "route-b", "walk", 25),
    wild(6, "route-a", "old-rod", 70), // area s1, but the rod comes in s2
    wild(7, "house", "gift", 100, { kind: "gift" }), // post-game only
    wild(9, "town-c", "npc-trade", 100, { kind: "trade-ingame", conditions: ["trade-bagon"] }),
    wild(9, "route-b", "walk", 3),
    wild(10, "route-b", "walk", 20),
  ],
  chains,
  machines: [{ number: "TM39", item: "tm39", moveId: "rock-tomb" }],
  moves: { tackle: { id: "tackle", name: "Placaje", nameEn: "Tackle", type: "normal", damageClass: "physical", power: 35, accuracy: 95, generation: 1 } },
  family,
  version,
  ...over,
});

describe("merge", () => {
  const out = merge(base());
  const entry = (from: number, to: number) => out.game.pool.find((p) => p.speciesId === from && p.finalFormId === to);

  it("takes the latest of area and method", () => {
    expect(entry(6, 6)?.firstAvailable).toBe("s2");
  });

  it("does not duplicate a line when an evolved form is also caught", () => {
    expect(out.game.pool.filter((p) => p.evolutionLineId === 100)).toHaveLength(1);
    expect(entry(1, 2)?.firstAvailable).toBe("s1");
    expect(entry(1, 2)?.encounters).toHaveLength(2);
  });

  it("adds a no-trade entry before a trade evolution and flags the trade one", () => {
    expect(entry(3, 4)?.flags.needsTrade).toBe(false);
    expect(entry(3, 5)?.flags.needsTrade).toBe(true);
  });

  it("gates item evolutions by the item segment", () => {
    expect(entry(10, 11)?.evolution[0]).toMatchObject({ trigger: "use-item", itemId: "fire-stone", segment: "s3" });
  });

  it("drops an in-game trade whose requested species cannot be obtained", () => {
    const horsea = entry(9, 9);
    expect(horsea?.encounters.map((e) => e.kind)).toEqual(["wild"]);
    expect(horsea?.rarity).toBe("rare");
    expect(out.issues.some((i) => i.area === "intercambios")).toBe(true);
  });

  it("reports post-game-only species as warnings, not errors", () => {
    expect(out.issues).toContainEqual({ level: "warning", area: "solo post-juego", message: expect.stringContaining("beldum") });
    expect(out.issues.filter((i) => i.level === "error")).toEqual([]);
  });

  it("collects TODOs", () => {
    expect(out.issues).toContainEqual({ level: "todo", area: "objetos evolutivos", message: "fire-stone: verificar" });
  });

  it("resolves bosses and TMs", () => {
    expect(out.game.bosses[0]).toMatchObject({ id: "gym-1", team: [{ speciesId: 3, level: 12, moves: ["tackle"] }] });
    expect(out.game.tms).toEqual([{ number: "TM39", moveId: "rock-tomb", where: "x", segment: "s2", repeatable: false }]);
  });
});

describe("merge errors", () => {
  it("reports areas and methods without a segment", () => {
    const out = merge(
      base({
        encounters: [wild(1, "unknown-area", "walk", 10), wild(1, "route-a", "surf", 10)],
      }),
    );
    const errors = out.issues.filter((i) => i.level === "error").map((i) => i.message);
    expect(errors).toContain("Zona sin tramo: unknown-area");
    expect(errors).toContain("Método sin tramo: surf");
  });

  it("reports dex species with no way to get them", () => {
    const out = merge(base({ encounters: [] }));
    expect(out.issues.some((i) => i.level === "error" && i.message.startsWith("zigzagoon no se puede obtener"))).toBe(true);
  });

  it("reports unknown boss moves and missing TMs", () => {
    const out = merge(
      base({
        family: {
          ...family,
          bosses: [{ ...family.bosses[0]!, team: [{ species: "machop", level: 12, moves: ["made-up"] }] }],
          tms: {},
        },
      }),
    );
    const errors = out.issues.filter((i) => i.level === "error").map((i) => i.message);
    expect(errors).toContain('gym-1: movimiento desconocido "made-up"');
    expect(errors).toContain("TM39 (rock-tomb) sin ubicar");
  });
});
