/**
 * Server-side access to data/generated (read at build time; never fetches PokéAPI).
 * The client receives a ClientGame: only what the generator and the UI need.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import type {
  GeneratedGameListEntry,
  GeneratedItem,
  GeneratedMeta,
  GeneratedMethodNames,
  GeneratedSpecies,
  GeneratedTypeNames,
} from "@/lib/generated-types";
import type { Game, PoolEntry, Segment, Typing } from "@/lib/types";

const DATA_DIR = join(process.cwd(), "data", "generated");

function readJson<T>(...path: string[]): T {
  return JSON.parse(readFileSync(join(DATA_DIR, ...path), "utf8")) as T;
}

/** Drafts (games with errors or TODO) are visible in development or with ODDTEAM_SHOW_DRAFTS=1 (D-018). */
export function draftsVisible(): boolean {
  return process.env.NODE_ENV !== "production" || process.env.ODDTEAM_SHOW_DRAFTS === "1";
}

export function listGames(): GeneratedGameListEntry[] {
  const games = readJson<GeneratedGameListEntry[]>("games.json");
  return draftsVisible() ? games : games.filter((g) => g.publishable);
}

export type ClientSpecies = { id: number; name: string; typing: Typing; sprite: string | null };

export type ClientGame = {
  slug: string;
  name: string;
  region: string;
  publishable: boolean;
  dataVersion: string;
  segments: Segment[];
  pool: PoolEntry[];
  species: Record<number, ClientSpecies>;
  typeNames: Record<string, string>;
  methodNames: Record<string, string>;
  itemNames: Record<string, string>;
  starters: { speciesId: number; name: string }[];
};

export function loadClientGame(slug: string): ClientGame | null {
  const entry = listGames().find((g) => g.slug === slug);
  if (!entry) return null;

  const game = readJson<Game>(slug, "game.json");
  const species = readJson<GeneratedSpecies[]>(slug, "pokeapi", "species.json");
  const meta = readJson<GeneratedMeta>("meta.json");
  const typeNames = readJson<GeneratedTypeNames>("type-names.json");
  const methodNames = readJson<GeneratedMethodNames>(slug, "pokeapi", "method-names.json");
  const items = readJson<Record<string, GeneratedItem>>(slug, "pokeapi", "items.json");

  // Only the species the pool can show (bases, every form of each line, encountered forms).
  const needed = new Set<number>();
  for (const p of game.pool) {
    needed.add(p.speciesId);
    needed.add(p.finalFormId);
    for (const s of p.evolution) needed.add(s.toSpeciesId);
    for (const e of p.encounters) needed.add(e.asSpeciesId);
  }
  const speciesMap: Record<number, ClientSpecies> = {};
  for (const s of species) {
    if (needed.has(s.id)) speciesMap[s.id] = { id: s.id, name: s.name, typing: s.typing, sprite: s.sprite };
  }

  // Trim encounter fields the client does not use.
  const pool: PoolEntry[] = game.pool.map((p) => ({
    ...p,
    encounters: p.encounters.map(({ conditions: _c, locationAreaId: _l, ...e }) => ({
      ...e,
      conditions: [],
      locationAreaId: "",
    })),
  }));

  return {
    slug,
    name: entry.name,
    region: entry.region,
    publishable: entry.publishable,
    dataVersion: meta.dataVersion,
    segments: [...game.segments],
    pool,
    species: speciesMap,
    typeNames: Object.fromEntries(Object.entries(typeNames).map(([k, v]) => [k, v.name])),
    methodNames: Object.fromEntries(Object.entries(methodNames).map(([k, v]) => [k, v.name])),
    itemNames: Object.fromEntries(Object.entries(items).map(([k, v]) => [k, v.name])),
    starters: pool
      .filter((p) => p.flags.starter)
      .map((p) => ({ speciesId: p.speciesId, name: speciesMap[p.speciesId]?.name ?? String(p.speciesId) })),
  };
}
