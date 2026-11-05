/**
 * pnpm data:build [--game=emerald] [--fresh] [--source=github|pokeapi] [--concurrency=8]
 *
 * Default source: the official static dump on GitHub (same data as the live API, D-014).
 *
 * Phase F2: downloads (with cache) everything PokéAPI knows about a game and
 * writes the raw layer to data/generated, plus a report of what must be curated.
 * Phase F3 will merge data/overrides on top (specs/02-datos-y-pipeline.md).
 */

import { join } from "node:path";
import type {
  GeneratedEvolutionChain,
  GeneratedGameInfo,
  GeneratedItem,
  GeneratedLearnset,
  GeneratedLocationArea,
  GeneratedMachine,
  GeneratedMeta,
  GeneratedMove,
  GeneratedSpecies,
  GeneratedEncounter,
} from "@/lib/generated-types";
import { validateTypeChart } from "@/lib/analysis/types";
import { createClient, idFromUrl, type PokeApiClient, type Source } from "./client";
import { findGameConfig, GAME_CONFIGS, type GameConfig } from "./config";
import { aggregateAreaEncounters, isExcludedCondition, methodKind } from "./encounters";
import {
  buildTypeChart,
  filterEvolutionsByItems,
  learnsetFor,
  machineNumber,
  normalizeEvolutionChain,
  normalizeMove,
  normalizeSpecies,
} from "./normalize";
import type {
  ApiEvolutionChain,
  ApiItem,
  ApiLocation,
  ApiLocationArea,
  ApiMachine,
  ApiMove,
  ApiPokedex,
  ApiPokemon,
  ApiRegion,
  ApiSpecies,
  ApiType,
  ApiVersionGroup,
} from "./pokeapi-types";
import { buildReport } from "./report";
import { generationNumber, localizedName } from "./resolve";
import { OutputSet } from "./write";

const ROOT = process.cwd();
const OUT_DIR = join(ROOT, "data", "generated");
const CACHE_DIR = join(ROOT, ".cache", "pokeapi");

type Args = { games: GameConfig[]; fresh: boolean; source: Source; concurrency: number };

function parseArgs(argv: readonly string[]): Args {
  const get = (flag: string) => argv.find((a) => a.startsWith(`--${flag}=`))?.split("=")[1];
  const gameArg = get("game");
  const games = gameArg ? [findGameConfig(gameArg)] : [...GAME_CONFIGS];
  if (games.some((g) => !g)) throw new Error(`Unknown game: ${gameArg}`);
  const source = (get("source") ?? process.env.ODDTEAM_POKEAPI_SOURCE ?? "github") as Source;
  if (source !== "pokeapi" && source !== "github") throw new Error(`Unknown source: ${source}`);
  return {
    games: games as GameConfig[],
    fresh: argv.includes("--fresh"),
    source,
    concurrency: Number(get("concurrency") ?? 8),
  };
}

async function byName<T>(client: PokeApiClient, resource: string, name: string): Promise<T> {
  const entry = (await client.list(resource)).find((r) => r.name === name);
  if (!entry) throw new Error(`${resource} "${name}" not found`);
  return client.get<T>(entry.url);
}

async function buildGame(client: PokeApiClient, config: GameConfig, out: OutputSet, log: (m: string) => void) {
  // Version group order lets us resolve move values per version group.
  const vgList = await client.list("version-group");
  const versionGroups = await Promise.all(vgList.map((v) => client.get<ApiVersionGroup>(v.url)));
  const vgOrder = new Map(versionGroups.map((v) => [v.name, v.order]));
  const orderOf = (name: string) => {
    const o = vgOrder.get(name);
    if (o === undefined) throw new Error(`Unknown version group: ${name}`);
    return o;
  };
  const vg = versionGroups.find((v) => v.name === config.versionGroup);
  if (!vg) throw new Error(`Version group not found: ${config.versionGroup}`);
  const generation = generationNumber(vg.generation);
  log(`  grupo ${vg.name} · Gen ${generation} · orden ${vg.order}`);

  // Locations and wild encounters of this version.
  const region = await byName<ApiRegion>(client, "region", config.region);
  const locations = await Promise.all(region.locations.map((l) => client.get<ApiLocation>(l.url)));
  const areaRefs = locations.flatMap((l) => l.areas.map((a) => ({ location: l, url: a.url })));
  const areasRaw = await Promise.all(areaRefs.map((a) => client.get<ApiLocationArea>(a.url)));
  log(`  ${locations.length} ubicaciones · ${areasRaw.length} zonas en la región`);

  const rawEncounters = areasRaw.flatMap((a) => aggregateAreaEncounters(a, config.version));
  const areasWithEncounters = areasRaw.filter((a) => rawEncounters.some((e) => e.locationAreaId === a.name));

  // pokemon id → species id for every encountered pokemon
  const encounteredPokemon = [...new Set(rawEncounters.map((e) => e.pokemonId))];
  const pokemonToSpecies = new Map<number, number>();
  await Promise.all(
    encounteredPokemon.map(async (id) => {
      const p = await client.get<ApiPokemon>(`/api/v2/pokemon/${id}/`);
      pokemonToSpecies.set(id, idFromUrl(p.species.url));
    }),
  );

  // Regional dex
  const dexes = await Promise.all(config.pokedexes.map((d) => byName<ApiPokedex>(client, "pokedex", d)));
  const regionalDex = [
    ...new Set(
      dexes.flatMap((d) =>
        d.pokemon_entries
          .slice()
          .sort((a, b) => a.entry_number - b.entry_number)
          .map((e) => idFromUrl(e.pokemon_species.url)),
      ),
    ),
  ];

  // Species closure: dex + encountered + every member of their evolution lines.
  const speciesRaw = new Map<number, ApiSpecies>();
  const chainsRaw = new Map<number, ApiEvolutionChain>();
  let pending = new Set<number>([...regionalDex, ...pokemonToSpecies.values()]);
  while (pending.size > 0) {
    const batch = [...pending].filter((id) => !speciesRaw.has(id));
    pending = new Set();
    const fetched = await Promise.all(batch.map((id) => client.get<ApiSpecies>(`/api/v2/pokemon-species/${id}/`)));
    for (const s of fetched) speciesRaw.set(s.id, s);
    const chainIds = [...new Set(fetched.flatMap((s) => (s.evolution_chain ? [idFromUrl(s.evolution_chain.url)] : [])))].filter(
      (id) => !chainsRaw.has(id),
    );
    const chains = await Promise.all(chainIds.map((id) => client.get<ApiEvolutionChain>(`/api/v2/evolution-chain/${id}/`)));
    for (const c of chains) {
      chainsRaw.set(c.id, c);
      const walk = (link: ApiEvolutionChain["chain"]) => {
        const id = idFromUrl(link.species.url);
        if (!speciesRaw.has(id)) pending.add(id);
        link.evolves_to.forEach(walk);
      };
      walk(c.chain);
    }
  }
  // Species newer than the game never appear.
  for (const [id, s] of speciesRaw) {
    if (generationNumber(s.generation) > generation) speciesRaw.delete(id);
  }
  log(`  ${speciesRaw.size} especies (dex + encuentros + líneas evolutivas)`);

  // Species details, learnsets
  const species = new Map<number, GeneratedSpecies>();
  const learnsets: Record<number, GeneratedLearnset> = {};
  const statsChanged: number[] = [];
  await Promise.all(
    [...speciesRaw.values()].map(async (s) => {
      const variety = s.varieties.find((v) => v.is_default) ?? s.varieties[0];
      if (!variety) throw new Error(`No pokemon for species ${s.name}`);
      const pokemon = await client.get<ApiPokemon>(variety.pokemon.url);
      const normalized = normalizeSpecies(s, pokemon, generation, config.versionGroup);
      species.set(s.id, normalized);
      learnsets[s.id] = learnsetFor(pokemon, config.versionGroup);
      if ((pokemon.past_stats ?? []).some((p) => generationNumber(p.generation) >= generation)) {
        statsChanged.push(s.id);
      }
    }),
  );

  // Evolution chains limited to the generation
  const speciesGeneration = (id: number) => {
    const s = speciesRaw.get(id);
    return s ? generationNumber(s.generation) : Number.POSITIVE_INFINITY;
  };
  const allChains: GeneratedEvolutionChain[] = [...chainsRaw.values()]
    .map((c) => normalizeEvolutionChain(c.id, c.chain, speciesGeneration, generation))
    .filter((c): c is GeneratedEvolutionChain => c !== null)
    .sort((a, b) => a.id - b.id);

  // Items used by evolutions: names for the UI, and drop methods whose item
  // does not exist in this generation.
  const itemSlugs = new Set(
    allChains.flatMap((c) => c.steps.flatMap((s) => s.details.flatMap((d) => [d.item, d.heldItem].filter((x): x is string => !!x)))),
  );
  const itemsRaw = await Promise.all([...itemSlugs].map((i) => byName<ApiItem>(client, "item", i)));
  const itemGens = new Map(itemsRaw.map((i) => [i.name, i.game_indices.map((g) => generationNumber(g.generation))]));
  const { chains, removed: removedEvolutions } = filterEvolutionsByItems(allChains, (item) =>
    (itemGens.get(item) ?? []).includes(generation),
  );
  const items: Record<string, GeneratedItem> = {};
  for (const i of itemsRaw) {
    if (!(itemGens.get(i.name) ?? []).includes(generation)) continue;
    const n = localizedName(i.names, i.name);
    items[i.name] = { id: i.name, name: n.es, nameEn: n.en };
  }

  // Moves of every learnset, with values of this version group
  const moveIds = new Set<string>();
  for (const l of Object.values(learnsets)) {
    for (const m of [...l.levelUp.map((x) => x.moveId), ...l.machine, ...l.tutor, ...l.egg]) moveIds.add(m);
  }
  const movesRaw = await Promise.all([...moveIds].map((m) => byName<ApiMove>(client, "move", m)));
  const moves: Record<string, GeneratedMove> = {};
  let movesWithoutSpanish = 0;
  for (const m of movesRaw) {
    moves[m.name] = normalizeMove(m, vg.order, orderOf);
    if (!localizedName(m.names, m.name).hasEs) movesWithoutSpanish++;
  }

  // Machines (TM/HM numbers) of this version group
  const machineUrls = movesRaw.flatMap((m) =>
    m.machines.filter((x) => x.version_group.name === config.versionGroup).map((x) => x.machine.url),
  );
  const machinesRaw = await Promise.all([...new Set(machineUrls)].map((u) => client.get<ApiMachine>(u)));
  const machines: GeneratedMachine[] = machinesRaw
    .map((m) => ({ number: machineNumber(m.item.name), item: m.item.name, moveId: m.move.name }))
    .sort((a, b) => a.number.localeCompare(b.number, "en", { numeric: true }));

  // Type chart for the generation
  const typeList = await client.list("type");
  const typesRaw = await Promise.all(typeList.map((t) => client.get<ApiType>(t.url)));
  const typeChart = buildTypeChart(typesRaw, generation);
  const chartErrors = validateTypeChart(typeChart);
  if (chartErrors.length > 0) throw new Error(`Invalid type chart: ${chartErrors.join("; ")}`);

  // Encounters with species ids and exclusion flag
  const encounters: GeneratedEncounter[] = rawEncounters
    .map((e) => {
      const kind: GeneratedEncounter["kind"] = methodKind(e.method) ?? "unclassified";
      return {
        speciesId: pokemonToSpecies.get(e.pokemonId) as number,
        pokemonId: e.pokemonId,
        locationAreaId: e.locationAreaId,
        method: e.method,
        kind,
        conditions: e.conditions,
        chance: e.chance,
        levels: e.levels,
        excluded:
          kind === "excluded" || kind === "unclassified" || e.conditions.some(isExcludedCondition),
      };
    })
    .sort(
      (a, b) =>
        a.locationAreaId.localeCompare(b.locationAreaId) ||
        a.speciesId - b.speciesId ||
        a.method.localeCompare(b.method) ||
        a.conditions.join(",").localeCompare(b.conditions.join(",")),
    );

  const locationById = new Map(locations.map((l) => [l.name, l]));
  const areas: GeneratedLocationArea[] = areasWithEncounters
    .map((a) => {
      const loc = locationById.get(a.location.name);
      const locName = localizedName(loc?.names ?? [], a.location.name);
      const areaName = localizedName(a.names, "");
      const suffix = areaName.en && areaName.en !== locName.en ? ` (${areaName.es})` : "";
      return {
        id: a.name,
        location: a.location.name,
        name: `${locName.es}${suffix}`,
        nameEn: `${locName.en}${areaName.en && areaName.en !== locName.en ? ` (${areaName.en})` : ""}`,
        hasSpanishName: locName.hasEs,
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));

  const info: GeneratedGameInfo = {
    slug: config.slug,
    family: config.family,
    version: config.version,
    versionGroup: config.versionGroup,
    versionGroupOrder: vg.order,
    generation,
    region: config.region,
    regionalDex: regionalDex.filter((id) => species.has(id)),
  };

  const sortedSpecies = [...species.values()].sort((a, b) => a.id - b.id);
  const base = `${config.slug}/pokeapi`;
  out.json(`${base}/game.json`, info);
  out.json(`${base}/species.json`, sortedSpecies);
  out.json(`${base}/locations.json`, areas);
  out.json(`${base}/encounters.json`, encounters);
  out.json(`${base}/learnsets.json`, learnsets);
  out.json(`${base}/evolutions.json`, chains);
  out.json(`${base}/items.json`, items);
  out.json(`${config.versionGroup}/moves.json`, moves);
  out.json(`${config.versionGroup}/machines.json`, machines);
  out.json(`type-chart/gen-${generation}.json`, typeChart);
  out.text(
    `${config.slug}/report.md`,
    buildReport({
      game: info,
      species,
      areas,
      encounters,
      chains,
      statsChanged,
      removedEvolutions,
      movesWithoutSpanish,
      machines: machines.length,
    }),
  );

  log(
    `  ${areas.length} zonas con encuentros · ${encounters.length} encuentros · ${Object.keys(moves).length} movimientos · ${machines.length} MT/MO`,
  );
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const started = Date.now();
  const log = (m: string) => console.log(m);
  const client = createClient({
    source: args.source,
    cacheDir: CACHE_DIR,
    fresh: args.fresh,
    concurrency: args.concurrency,
  });

  log(`data:build · fuente ${args.source}${args.fresh ? " · sin caché" : ""}`);
  const out = new OutputSet();
  for (const game of args.games) {
    log(`· ${game.slug}`);
    await buildGame(client, game, out, log);
  }

  const meta: GeneratedMeta = { dataVersion: out.dataVersion(), games: args.games.map((g) => g.slug) };
  out.json("meta.json", meta);
  const written = await out.writeTo(OUT_DIR);
  const { network, cache } = client.stats();
  log(
    `\n${written.length} archivos en data/generated · dataVersion ${meta.dataVersion} · ${network} descargas, ${cache} desde caché · ${((Date.now() - started) / 1000).toFixed(1)} s`,
  );
  for (const g of args.games) log(`Informe: data/generated/${g.slug}/report.md`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
