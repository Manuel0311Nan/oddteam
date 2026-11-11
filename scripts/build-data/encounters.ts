/**
 * Wild encounter aggregation (specs/02, "Probabilidad de encuentro").
 *
 * PokéAPI lists every encounter slot. We keep only the target version and
 * group slots by area + species + method + conditions, summing their chance.
 */

import type { ApiLocationArea } from "./pokeapi-types";

export type WildEncounter = {
  pokemonId: number;
  locationAreaId: string; // PokéAPI location-area slug
  method: string;
  conditions: string[]; // sorted condition-value slugs
  chance: number; // summed %, capped at 100
  levels: [number, number];
};

export function idFromRef(url: string): number {
  const match = /\/(\d+)\/?$/.exec(url);
  if (!match) throw new Error(`No id in URL: ${url}`);
  return Number(match[1]);
}

export function aggregateAreaEncounters(area: ApiLocationArea, version: string): WildEncounter[] {
  const groups = new Map<string, WildEncounter>();

  for (const pe of area.pokemon_encounters) {
    const pokemonId = idFromRef(pe.pokemon.url);
    for (const vd of pe.version_details) {
      if (vd.version.name !== version) continue;
      for (const d of vd.encounter_details) {
        const conditions = d.condition_values.map((c) => c.name).sort();
        const key = [pokemonId, d.method.name, conditions.join(",")].join("|");
        const existing = groups.get(key);
        if (existing) {
          existing.chance += d.chance;
          existing.levels = [
            Math.min(existing.levels[0], d.min_level),
            Math.max(existing.levels[1], d.max_level),
          ];
        } else {
          groups.set(key, {
            pokemonId,
            locationAreaId: area.name,
            method: d.method.name,
            conditions,
            chance: d.chance,
            levels: [d.min_level, d.max_level],
          });
        }
      }
    }
  }

  return [...groups.values()]
    .map((e) => ({ ...e, chance: Math.min(100, e.chance) }))
    .sort(
      (a, b) =>
        a.pokemonId - b.pokemonId ||
        a.method.localeCompare(b.method) ||
        a.conditions.join(",").localeCompare(b.conditions.join(",")),
    );
}

/**
 * PokéAPI encodes gifts, statics, trades and roamers as encounter "methods".
 * Each method maps to an encounter kind; "excluded" methods never count as
 * availability (bonus discs, events…). Unknown methods are not counted until
 * they are classified here (they show up in the report).
 */
export type MethodKind = "wild" | "gift" | "static" | "trade-ingame" | "roaming" | "excluded";

export const ENCOUNTER_METHOD_KINDS: Readonly<Record<string, MethodKind>> = {
  // Wild
  walk: "wild",
  "old-rod": "wild",
  "good-rod": "wild",
  "super-rod": "wild",
  surf: "wild",
  "rock-smash": "wild",
  headbutt: "wild",
  "headbutt-low": "wild",
  "headbutt-normal": "wild",
  "headbutt-high": "wild",
  seaweed: "wild",
  "feebas-tile-fishing": "wild",
  "dark-grass": "wild",
  "grass-spots": "wild",
  "cave-spots": "wild",
  "bridge-spots": "wild",
  "super-rod-spots": "wild",
  "surf-spots": "wild",
  "yellow-flowers": "wild",
  "purple-flowers": "wild",
  "red-flowers": "wild",
  "rough-terrain": "wild",
  "honey-tree": "wild", // Sinnoh: honey + 6 h wait; rarity floor in key-items.ts (D-027)
  // Guaranteed
  gift: "gift",
  "gift-egg": "gift",
  static: "static",
  "devon-scope": "static",
  "wailmer-pail": "static",
  "squirt-bottle": "static",
  pokeflute: "static", // HGSS: Snorlax woken with the Poké Flute station of the Pokégear
  "npc-trade": "trade-ingame",
  // Roamers
  "roaming-grass": "roaming",
  "roaming-water": "roaming",
  // Never count
  "colosseum-bonus-disc-jpn": "excluded",
  "colosseum-bonus-disc": "excluded",
  "pokeflute-event": "excluded",
  "pokemon-ranger": "excluded", // Manaphy egg transferred from Pokémon Ranger (another game)
};

export function methodKind(method: string): MethodKind | undefined {
  return ENCOUNTER_METHOD_KINDS[method];
}

/** Conditions that never count as availability (specs/02, "Condiciones"). */
export const EXCLUDED_CONDITION_PREFIXES = ["swarm-yes", "radar-on", "slot2-"] as const;

export function isExcludedCondition(condition: string): boolean {
  return EXCLUDED_CONDITION_PREFIXES.some((p) =>
    p.endsWith("-") ? condition.startsWith(p) && condition !== "slot2-none" : condition === p,
  );
}
