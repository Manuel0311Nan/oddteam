/**
 * Server-side access to data/generated (read at build time; never fetches PokéAPI).
 * The client receives a ClientGame: only what the generator and the UI need.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { computeMatchups, mainType, type Matchups } from "@/lib/analysis/bosses";
import type { FeaturedFile } from "@/lib/analysis/featured";
import type { Learnset } from "@/lib/analysis/moves";
import type { TypeChart } from "@/lib/analysis/types";
import type {
  GeneratedGameListEntry,
  GeneratedMove,
  GeneratedItem,
  GeneratedMeta,
  GeneratedMethodNames,
  GeneratedSpecies,
  GeneratedTypeNames,
} from "@/lib/generated-types";
import type { Boss, Game, PoolEntry, Segment, TmEntry, TypeName, Typing } from "@/lib/types";

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
  bosses: (Boss & { mainType: TypeName })[];
  /** Precomputed analysis of every pool entry against every boss (specs/04). */
  matchups: Matchups;
  moveNames: Record<string, string>;
  tms: Record<string, Pick<TmEntry, "where" | "segment" | "repeatable" | "moveId">>;
  /** Base stat total of every form used in a battle (difficulty, specs/05). */
  statTotals: Record<number, number>;
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
  const learnsets = readJson<Record<number, Learnset>>(slug, "pokeapi", "learnsets.json");
  const info = readJson<{ versionGroup: string; generation: number }>(slug, "pokeapi", "game.json");
  const moves = readJson<Record<string, GeneratedMove>>(info.versionGroup, "moves.json");
  const chart = readJson<TypeChart>("type-chart", `gen-${info.generation}.json`);

  const bySpecies = new Map(species.map((s) => [s.id, s]));
  const rank = new Map(game.segments.map((s) => [s.id, s.order]));
  const matchups = computeMatchups(game.pool, game.bosses, game.segments, {
    chart,
    typingOf: (id) => {
      const t = bySpecies.get(id)?.typing;
      if (!t) throw new Error(`No species ${id}`);
      return t;
    },
    statsOf: (id) => {
      const st = bySpecies.get(id)?.baseStats;
      if (!st) throw new Error(`No species ${id}`);
      return st;
    },
    learnsets,
    moves,
    tms: game.tms,
    rankOf: (segment) => rank.get(segment) ?? Number.POSITIVE_INFINITY,
  });

  // Only the species the pool can show (bases, every form of each line, encountered forms).
  const needed = new Set<number>();
  for (const p of game.pool) {
    needed.add(p.speciesId);
    needed.add(p.finalFormId);
    for (const s of p.evolution) needed.add(s.toSpeciesId);
    for (const e of p.encounters) needed.add(e.asSpeciesId);
  }
  for (const b of game.bosses) for (const m of b.team) needed.add(m.speciesId);
  const usedMoves = new Set<string>();
  for (const row of Object.values(matchups)) {
    for (const m of Object.values(row)) {
      needed.add(m.formId);
      for (const r of [...m.moves, ...m.tmBoosts]) usedMoves.add(r.moveId);
    }
  }
  const statTotals: Record<number, number> = {};
  for (const row of Object.values(matchups)) {
    for (const m of Object.values(row)) {
      const st = bySpecies.get(m.formId)?.baseStats;
      if (st) statTotals[m.formId] = st.hp + st.attack + st.defense + st.specialAttack + st.specialDefense + st.speed;
    }
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
    bosses: game.bosses.map((b) => ({
      ...b,
      mainType: mainType(b.team.map((m) => bySpecies.get(m.speciesId)?.typing ?? (["normal"] as Typing))),
    })),
    matchups,
    moveNames: Object.fromEntries([...usedMoves].map((id) => [id, moves[id]?.name ?? id])),
    tms: Object.fromEntries(
      game.tms.map((t) => [t.number, { where: t.where, segment: t.segment, repeatable: t.repeatable, moveId: t.moveId }]),
    ),
    statTotals,
  };
}

/**
 * Featured teams of a game (specs/05), or null if they were not computed or
 * belong to other data (they are rebuilt by `pnpm data:build`, D-021).
 */
export function loadFeatured(slug: string): FeaturedFile | null {
  const path = join(DATA_DIR, "featured", `${slug}.json`);
  if (!existsSync(path)) return null;
  const file = JSON.parse(readFileSync(path, "utf8")) as FeaturedFile;
  const meta = readJson<GeneratedMeta>("meta.json");
  if (file.dataVersion !== meta.dataVersion) {
    console.warn(`featured/${slug}.json es de otros datos (${file.dataVersion} ≠ ${meta.dataVersion}): ejecuta pnpm data:featured`);
    return null;
  }
  return file;
}
