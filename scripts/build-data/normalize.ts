/** Pure normalizers from PokéAPI shapes to the generated layer. */

import type { TypeChart } from "@/lib/analysis/types";
import type {
  GeneratedEvolutionChain,
  GeneratedEvolutionDetail,
  GeneratedLearnset,
  GeneratedMove,
  GeneratedSpecies,
} from "@/lib/generated-types";
import { type BaseStats, type DamageClass, isTypeName, type TypeName, type Typing } from "@/lib/types";
import type {
  ApiChainLink,
  ApiEvolutionDetail,
  ApiMove,
  ApiPokemon,
  ApiSpecies,
  ApiStat,
  ApiType,
  DamageRelations,
} from "./pokeapi-types";
import {
  generationNumber,
  localizedName,
  moveValuesForVersionGroup,
  valueForGeneration,
} from "./resolve";

function idFromUrl(url: string): number {
  const match = /\/(\d+)\/?$/.exec(url);
  if (!match) throw new Error(`No id in URL: ${url}`);
  return Number(match[1]);
}

// ---------------------------------------------------------------------------
// Species
// ---------------------------------------------------------------------------

const STAT_KEYS: Record<string, keyof BaseStats> = {
  hp: "hp",
  attack: "attack",
  defense: "defense",
  "special-attack": "specialAttack",
  "special-defense": "specialDefense",
  speed: "speed",
};

/** Current stats with past_stats applied per stat (only changed stats are listed). */
export function statsForGeneration(
  current: readonly ApiStat[],
  past: readonly { generation: { name: string; url: string }; stats: ApiStat[] }[],
  generation: number,
): BaseStats {
  const result = {} as BaseStats;
  for (const s of current) {
    const key = STAT_KEYS[s.stat.name];
    if (!key) continue;
    const history = past
      .map((p) => ({
        generation: p.generation,
        value: p.stats.find((ps) => ps.stat.name === s.stat.name)?.base_stat,
      }))
      .filter((h): h is { generation: { name: string; url: string }; value: number } => h.value !== undefined);
    result[key] = valueForGeneration(s.base_stat, history, generation);
  }
  return result;
}

export function typingForGeneration(pokemon: ApiPokemon, generation: number): Typing {
  const current = pokemon.types.slice().sort((a, b) => a.slot - b.slot).map((t) => t.type.name);
  const history = pokemon.past_types.map((p) => ({
    generation: p.generation,
    value: p.types.slice().sort((a, b) => a.slot - b.slot).map((t) => t.type.name),
  }));
  const names = valueForGeneration(current, history, generation);
  const types = names.filter(isTypeName);
  if (types.length !== names.length || types.length < 1 || types.length > 2) {
    throw new Error(`Unexpected typing for ${pokemon.name}: ${names.join("/")}`);
  }
  return types as unknown as Typing;
}

function romanGeneration(n: number): string {
  const numerals = ["", "i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix"];
  return `generation-${numerals[n] ?? String(n)}`;
}

export function spriteFor(pokemon: ApiPokemon, generation: number, versionGroup: string): string | null {
  const byGen = pokemon.sprites.versions?.[romanGeneration(generation)];
  return byGen?.[versionGroup]?.front_default ?? pokemon.sprites.front_default ?? null;
}

export function normalizeSpecies(
  species: ApiSpecies,
  pokemon: ApiPokemon,
  generation: number,
  versionGroup: string,
): GeneratedSpecies {
  const name = localizedName(species.names, species.name);
  return {
    id: species.id,
    slug: species.name,
    name: name.es,
    nameEn: name.en,
    generation: generationNumber(species.generation),
    typing: typingForGeneration(pokemon, generation),
    baseStats: statsForGeneration(pokemon.stats, pokemon.past_stats ?? [], generation),
    sprite: spriteFor(pokemon, generation, versionGroup),
    legendary: species.is_legendary,
    mythical: species.is_mythical,
    baby: species.is_baby,
    captureRate: species.capture_rate,
    evolutionChainId: species.evolution_chain ? idFromUrl(species.evolution_chain.url) : null,
    evolvesFrom: species.evolves_from_species ? idFromUrl(species.evolves_from_species.url) : null,
  };
}

// ---------------------------------------------------------------------------
// Learnsets and moves
// ---------------------------------------------------------------------------

export function learnsetFor(pokemon: ApiPokemon, versionGroup: string): GeneratedLearnset {
  const levelUp: { moveId: string; level: number }[] = [];
  const machine = new Set<string>();
  const tutor = new Set<string>();
  const egg = new Set<string>();
  for (const m of pokemon.moves) {
    for (const d of m.version_group_details) {
      if (d.version_group.name !== versionGroup) continue;
      switch (d.move_learn_method.name) {
        case "level-up":
          levelUp.push({ moveId: m.move.name, level: d.level_learned_at });
          break;
        case "machine":
          machine.add(m.move.name);
          break;
        case "tutor":
          tutor.add(m.move.name);
          break;
        case "egg":
          egg.add(m.move.name);
          break;
        default:
          break;
      }
    }
  }
  const dedup = new Map(levelUp.map((l) => [`${l.moveId}@${l.level}`, l]));
  return {
    levelUp: [...dedup.values()].sort((a, b) => a.level - b.level || a.moveId.localeCompare(b.moveId)),
    machine: [...machine].sort(),
    tutor: [...tutor].sort(),
    egg: [...egg].sort(),
  };
}

export function normalizeMove(
  move: ApiMove,
  versionGroupOrder: number,
  orderOf: (versionGroup: string) => number,
): GeneratedMove {
  const values = moveValuesForVersionGroup(
    { power: move.power, accuracy: move.accuracy, type: move.type.name },
    move.past_values,
    versionGroupOrder,
    orderOf,
  );
  // "???" type (PokéAPI "unknown"): Curse in Gen 2–4. Status move, no type.
  const type = values.type === "unknown" ? null : values.type;
  if (type !== null && !isTypeName(type)) {
    throw new Error(`Unexpected move type for ${move.name}: ${values.type}`);
  }
  const damageClass = (move.damage_class?.name ?? "status") as DamageClass;
  const name = localizedName(move.names, move.name);
  return {
    id: move.name,
    name: name.es,
    nameEn: name.en,
    type,
    damageClass, // modern class in every game (D-005)
    power: values.power,
    accuracy: values.accuracy,
    generation: generationNumber(move.generation),
  };
}

/** "tm01" → "TM01", "hm05" → "HM05". */
export function machineNumber(itemSlug: string): string {
  const match = /^(tm|hm|tr)(\d+)$/.exec(itemSlug);
  if (!match) throw new Error(`Unexpected machine item: ${itemSlug}`);
  return `${(match[1] as string).toUpperCase()}${match[2] as string}`;
}

// ---------------------------------------------------------------------------
// Type chart
// ---------------------------------------------------------------------------

export function buildTypeChart(types: readonly ApiType[], generation: number): TypeChart {
  const existing = types.filter(
    (t) => isTypeName(t.name) && generationNumber(t.generation) <= generation,
  );
  const names = new Set(existing.map((t) => t.name));
  const damage: TypeChart["damage"] = {};

  for (const t of existing) {
    const relations = valueForGeneration<DamageRelations>(
      t.damage_relations,
      t.past_damage_relations.map((p) => ({ generation: p.generation, value: p.damage_relations })),
      generation,
    );
    const row: Partial<Record<TypeName, 0 | 0.5 | 2>> = {};
    const add = (refs: readonly { name: string }[], m: 0 | 0.5 | 2) => {
      for (const r of refs) if (names.has(r.name) && isTypeName(r.name)) row[r.name] = m;
    };
    add(relations.double_damage_to, 2);
    add(relations.half_damage_to, 0.5);
    add(relations.no_damage_to, 0);
    if (Object.keys(row).length > 0) damage[t.name as TypeName] = row;
  }

  const order = (n: string) => existing.find((t) => t.name === n)?.id ?? 0;
  return {
    generation,
    types: [...names].filter(isTypeName).sort((a, b) => order(a) - order(b)),
    damage,
  };
}

// ---------------------------------------------------------------------------
// Evolution chains
// ---------------------------------------------------------------------------

export function normalizeEvolutionDetail(d: ApiEvolutionDetail): GeneratedEvolutionDetail {
  const out: GeneratedEvolutionDetail = { trigger: d.trigger.name };
  if (d.min_level !== null) out.minLevel = d.min_level;
  if (d.item) out.item = d.item.name;
  if (d.held_item) out.heldItem = d.held_item.name;
  if (d.min_happiness !== null) out.minHappiness = d.min_happiness;
  if (d.min_beauty !== null) out.minBeauty = d.min_beauty;
  if (d.time_of_day) out.timeOfDay = d.time_of_day;
  if (d.known_move) out.knownMove = d.known_move.name;
  if (d.known_move_type) out.knownMoveType = d.known_move_type.name;
  if (d.location) out.location = d.location.name;
  if (d.trade_species) out.tradeSpecies = idFromUrl(d.trade_species.url);
  if (d.gender !== null) out.gender = d.gender;
  if (d.relative_physical_stats !== null) out.relativePhysicalStats = d.relative_physical_stats;
  if (d.party_species) out.partySpecies = idFromUrl(d.party_species.url);
  if (d.party_type) out.partyType = d.party_type.name;
  if (d.needs_overworld_rain) out.needsOverworldRain = true;
  return out;
}

/**
 * Flatten a chain into steps, keeping only species that exist by `generation`.
 * A step whose target is newer than the generation is dropped (e.g. Roselia → Roserade in Gen 3);
 * a newer base form is skipped and its children attach to nothing (e.g. Budew before Roselia).
 */
export function normalizeEvolutionChain(
  id: number,
  root: ApiChainLink,
  speciesGeneration: (speciesId: number) => number,
  generation: number,
): GeneratedEvolutionChain | null {
  const exists = (link: ApiChainLink) => speciesGeneration(idFromUrl(link.species.url)) <= generation;
  const steps: GeneratedEvolutionChain["steps"] = [];
  const bases: number[] = [];

  const walk = (link: ApiChainLink, parentId: number | null) => {
    const selfId = idFromUrl(link.species.url);
    const present = exists(link);
    if (present && parentId !== null) {
      steps.push({
        fromSpeciesId: parentId,
        toSpeciesId: selfId,
        // PokéAPI repeats identical methods (one per game); keep each once.
        details: [
          ...new Map(
            link.evolution_details.map(normalizeEvolutionDetail).map((d) => [JSON.stringify(d), d]),
          ).values(),
        ],
      });
    } else if (present) {
      bases.push(selfId);
    }
    for (const child of link.evolves_to) walk(child, present ? selfId : null);
  };
  walk(root, null);

  const base = bases[0];
  if (base === undefined) return null;
  return { id, baseSpeciesId: base, steps };
}

export type RemovedEvolutionDetail = {
  fromSpeciesId: number;
  toSpeciesId: number;
  detail: GeneratedEvolutionDetail;
  reason: string;
};

/**
 * Drop evolution methods that use an item that does not exist in the game's
 * generation (PokéAPI mixes methods from every game). A step left without any
 * method is impossible in this game and is dropped too.
 */
export function filterEvolutionsByItems(
  chains: readonly GeneratedEvolutionChain[],
  itemExists: (item: string) => boolean,
): { chains: GeneratedEvolutionChain[]; removed: RemovedEvolutionDetail[] } {
  const removed: RemovedEvolutionDetail[] = [];
  const result = chains.map((chain) => ({
    ...chain,
    steps: chain.steps
      .map((step) => ({
        ...step,
        details: step.details.filter((d) => {
          const missing = [d.item, d.heldItem].find((i) => i !== undefined && !itemExists(i));
          if (missing) {
            removed.push({
              fromSpeciesId: step.fromSpeciesId,
              toSpeciesId: step.toSpeciesId,
              detail: d,
              reason: `objeto ${missing} no existe en esta generación`,
            });
            return false;
          }
          return true;
        }),
      }))
      .filter((step) => step.details.length > 0),
  }));
  return { chains: result, removed };
}
