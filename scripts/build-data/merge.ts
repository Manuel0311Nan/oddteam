/**
 * Phase F3: merge the PokéAPI layer with the curated overrides into the game
 * data the web uses (`data/generated/{game}/game.json`), collecting every
 * problem the validator must report (specs/02, "Validador").
 *
 * Pure: no I/O. Conservative by design: when something is unknown the data is
 * left out (never assumed available).
 */

import { bestRarity, compareRarity, encounterRarity } from "@/lib/analysis/rarity";
import type {
  GeneratedEncounter,
  GeneratedEvolutionChain,
  GeneratedEvolutionDetail,
  GeneratedGameInfo,
  GeneratedLocationArea,
  GeneratedMachine,
  GeneratedMove,
  GeneratedSpecies,
} from "@/lib/generated-types";
import type {
  Boss,
  Encounter,
  EncounterKind,
  EvolutionStep,
  EvolutionTrigger,
  Game,
  GameSlug,
  ItemLocation,
  PoolEntry,
  Rarity,
  Segment,
  TmEntry,
} from "@/lib/types";
import type {
  Availability,
  FamilyOverrides,
  Sourced,
  SpecialEncounterOverride,
  VersionOverrides,
} from "../../data/overrides/types";

export type IssueLevel = "error" | "todo" | "warning";
export type Issue = { level: IssueLevel; area: string; message: string };

export type MergeInput = {
  game: GameSlug;
  info: GeneratedGameInfo;
  species: readonly GeneratedSpecies[];
  areas: readonly GeneratedLocationArea[];
  encounters: readonly GeneratedEncounter[];
  chains: readonly GeneratedEvolutionChain[];
  machines: readonly GeneratedMachine[];
  moves: Readonly<Record<string, GeneratedMove>>;
  family: FamilyOverrides;
  version: VersionOverrides;
};

export type MergeOutput = { game: Game; issues: Issue[]; stats: MergeStats };

export type MergeStats = {
  areasCurated: number;
  areasTotal: number;
  encountersCounted: number;
  poolEntries: number;
  poolLines: number;
  bosses: number;
  tmsCurated: number;
  tmsTotal: number;
  todos: number;
};

const NEVER = Number.POSITIVE_INFINITY;

export function merge(input: MergeInput): MergeOutput {
  const issues: Issue[] = [];
  const add = (level: IssueLevel, area: string, message: string) => issues.push({ level, area, message });
  const { family, version } = input;

  // --- TODO markers ---------------------------------------------------------
  const collectTodos = (area: string, entries: Iterable<[string, Sourced]>) => {
    for (const [key, entry] of entries) if (entry.todo) add("todo", area, `${key}: ${entry.todo}`);
  };
  collectTodos("tramos", family.segments.map((s) => [s.id, s]));
  collectTodos("zonas", Object.entries({ ...family.locations, ...(version.locations ?? {}) }));
  collectTodos("métodos", Object.entries(family.methods));
  collectTodos("condiciones", Object.entries(family.conditions));
  collectTodos("encuentros especiales", [...family.specialEncounters, ...(version.specialEncounters ?? [])].map((s) => [`${s.species}@${s.area}`, s]));
  collectTodos("objetos evolutivos", Object.entries(family.evolutionItems));
  collectTodos("evoluciones", family.evolutionChoices.map((c) => [`${c.from}→${c.to}`, c]));
  collectTodos("jefes", [...family.bosses, ...(version.bosses ?? [])].map((b) => [b.id, b]));
  collectTodos("MT", Object.entries(family.tms));
  collectTodos("especies sin obtener", Object.entries(version.unobtainable ?? {}));

  // --- Segments -------------------------------------------------------------
  const segments: Segment[] = family.segments.map((s, order) => ({
    id: s.id,
    label: s.label,
    order,
    expectedLevel: s.expectedLevel,
  }));
  const rankOf = new Map(segments.map((s) => [s.id, s.order]));
  const rank = (a: Availability, where: string): number => {
    if (a === "post-game" || a === "excluded") return NEVER;
    const r = rankOf.get(a);
    if (r === undefined) {
      add("error", "tramos", `Tramo desconocido "${a}" en ${where}`);
      return NEVER;
    }
    return r;
  };
  const segmentAt = (r: number) => (segments[r] as Segment).id;

  // --- Species --------------------------------------------------------------
  const speciesById = new Map(input.species.map((s) => [s.id, s]));
  const idBySlug = new Map(input.species.map((s) => [s.slug, s.id]));
  const resolve = (slug: string, where: string): number | undefined => {
    const id = idBySlug.get(slug);
    if (id === undefined) add("error", where, `Especie desconocida "${slug}"`);
    return id;
  };

  // --- Encounters -----------------------------------------------------------
  const locations = { ...family.locations, ...(version.locations ?? {}) };
  const areaById = new Map(input.areas.map((a) => [a.id, a]));
  const specials = [...family.specialEncounters, ...(version.specialEncounters ?? [])];
  const specialKey = (speciesId: number, area: string, method: string) => `${speciesId}|${area}|${method}`;
  const specialByKey = new Map<string, SpecialEncounterOverride>();
  for (const s of specials) {
    const id = resolve(s.species, "encuentros especiales");
    if (id === undefined) continue;
    if (!s.add && !input.encounters.some((e) => e.speciesId === id && e.locationAreaId === s.area && e.method === s.method)) {
      add("error", "encuentros especiales", `${s.species}@${s.area} (${s.method}) no existe en PokéAPI; usa "add" para añadirlo`);
    }
    specialByKey.set(specialKey(id, s.area, s.method), s);
  }

  const missingAreas = new Set<string>();
  /** Species whose only skipped encounters are post-game (not an error, just out of the story). */
  const postGameSpecies = new Set<number>();
  const isPostGame = (a: Availability | undefined) => a === "post-game";
  const missingMethods = new Set<string>();
  const encountersBySpecies = new Map<number, (Encounter & { rank: number; starter: boolean })[]>();
  let encountersCounted = 0;

  const pushEncounter = (speciesId: number, e: Encounter & { rank: number; starter: boolean }) => {
    const list = encountersBySpecies.get(speciesId) ?? [];
    list.push(e);
    encountersBySpecies.set(speciesId, list);
    encountersCounted++;
  };

  for (const e of input.encounters) {
    if (e.excluded) continue;
    const loc = locations[e.locationAreaId];
    if (!loc) {
      missingAreas.add(e.locationAreaId);
      continue;
    }
    const where = `zona ${e.locationAreaId}`;
    const special = specialByKey.get(specialKey(e.speciesId, e.locationAreaId, e.method));
    let r: number;
    if (special?.segment !== undefined) {
      r = rank(special.segment, `encuentro especial ${e.speciesId}@${e.locationAreaId}`);
    } else {
      const method = family.methods[e.method];
      if (!method) {
        missingMethods.add(e.method);
        continue;
      }
      const areaR = rank(loc.methods?.[e.method] ?? loc.segment, where);
      const methodR = rank(method.segment, `método ${e.method}`);
      r = Math.max(areaR, methodR);
    }
    for (const c of e.conditions) {
      const cond = family.conditions[c];
      if (!cond) {
        add("error", "condiciones", `Condición sin curar "${c}" (${e.locationAreaId})`);
        r = NEVER;
      } else if (cond.segment !== undefined) {
        r = Math.max(r, rank(cond.segment, `condición ${c}`));
      }
    }
    if (r === NEVER) {
      const postGame =
        isPostGame(special?.segment) ||
        (special?.segment === undefined &&
          (isPostGame(loc.methods?.[e.method] ?? loc.segment) || isPostGame(family.methods[e.method]?.segment))) ||
        e.conditions.some((c) => isPostGame(family.conditions[c]?.segment));
      if (postGame) postGameSpecies.add(e.speciesId);
      continue;
    }
    const kind: EncounterKind = e.kind === "wild" || e.kind === "gift" || e.kind === "static" || e.kind === "trade-ingame" || e.kind === "roaming" ? e.kind : "static";
    const area = areaById.get(e.locationAreaId);
    // Curated rarity: the special encounter's, else the method's floor if the chance looks easier.
    // The hardest floor among the method and the conditions (D-027, D-030).
    const floors = [family.methods[e.method]?.minRarity, ...e.conditions.map((c) => family.conditions[c]?.minRarity)].filter(
      (r): r is Rarity => r !== undefined,
    );
    const minRarity = floors.reduce<Rarity | undefined>((a, b) => (!a || compareRarity(b, a) > 0 ? b : a), undefined);
    const chanceRarity = kind === "wild" ? encounterRarity({ kind, chance: e.chance }) : undefined;
    const rarity =
      special?.rarity ??
      (minRarity && chanceRarity && compareRarity(chanceRarity, minRarity) < 0 ? minRarity : undefined);
    pushEncounter(e.speciesId, {
      asSpeciesId: e.speciesId,
      kind,
      locationAreaId: e.locationAreaId,
      where: (area?.hasSpanishName ? area.name : loc.name) ?? area?.name ?? e.locationAreaId,
      ...(kind === "wild" ? { method: e.method, chance: e.chance } : { method: e.method }),
      conditions: e.conditions,
      levels: e.levels,
      segment: segmentAt(r),
      unique: special?.unique ?? kind === "static",
      ...(special?.exclusiveGroup ? { exclusiveGroup: special.exclusiveGroup } : {}),
      ...(rarity ? { rarity } : {}),
      rank: r,
      starter: special?.starter ?? false,
    });
  }

  // Extra encounters PokéAPI does not have.
  for (const s of specials) {
    if (!s.add) continue;
    const id = idBySlug.get(s.species);
    if (id === undefined || s.segment === undefined) {
      if (s.segment === undefined) add("error", "encuentros especiales", `${s.species}@${s.area}: falta "segment"`);
      continue;
    }
    const r = rank(s.segment, `encuentro especial ${s.species}`);
    if (r === NEVER) continue;
    pushEncounter(id, {
      asSpeciesId: id,
      kind: s.add.kind,
      locationAreaId: s.area,
      where: s.add.where,
      method: s.method,
      conditions: [],
      levels: s.add.levels,
      segment: segmentAt(r),
      unique: s.unique ?? s.add.kind === "static",
      ...(s.exclusiveGroup ? { exclusiveGroup: s.exclusiveGroup } : {}),
      rank: r,
      starter: s.starter ?? false,
    });
  }

  const areasWithCounted = new Set(input.encounters.filter((e) => !e.excluded).map((e) => e.locationAreaId));
  for (const a of [...missingAreas].sort()) add("error", "zonas", `Zona sin tramo: ${a}`);
  for (const m of [...missingMethods].sort()) add("error", "métodos", `Método sin tramo: ${m}`);
  for (const id of Object.keys(locations)) {
    if (!areaById.has(id)) add("warning", "zonas", `La zona curada "${id}" no tiene encuentros en PokéAPI`);
  }

  // --- Evolution steps ------------------------------------------------------
  const itemRank = (item: string, where: string): number => {
    const loc = family.evolutionItems[item];
    if (!loc) {
      add("error", "objetos evolutivos", `Objeto sin ubicar: ${item} (${where})`);
      return NEVER;
    }
    return rank(loc.segment, `objeto ${item}`);
  };

  const choices = new Map(family.evolutionChoices.map((c) => [`${c.from}|${c.to}`, c]));
  type Step = EvolutionStep & { rank: number };
  const stepsFrom = new Map<number, Step[]>();

  for (const chain of input.chains) {
    for (const s of chain.steps) {
      const fromSlug = speciesById.get(s.fromSpeciesId)?.slug ?? String(s.fromSpeciesId);
      const toSlug = speciesById.get(s.toSpeciesId)?.slug ?? String(s.toSpeciesId);
      let details: GeneratedEvolutionDetail[] = s.details;
      const choice = choices.get(`${fromSlug}|${toSlug}`);
      if (choice) {
        details = s.details.filter(
          (d) =>
            d.trigger === choice.keep.trigger &&
            (choice.keep.minLevel === undefined || d.minLevel === choice.keep.minLevel) &&
            (choice.keep.item === undefined || d.item === choice.keep.item),
        );
        if (details.length === 0) add("error", "evoluciones", `La elección ${fromSlug}→${toSlug} no coincide con ningún método de PokéAPI`);
      } else if (details.length > 1) {
        add("error", "evoluciones", `${fromSlug}→${toSlug} tiene ${details.length} métodos; elegir uno en evolution-items.ts`);
      }
      const d = details[0];
      if (!d) continue;
      const where = `${fromSlug}→${toSlug}`;
      let r = 0;
      let trigger: EvolutionTrigger = "other";
      let needsTrade = false;
      if (d.trigger === "level-up") trigger = d.minHappiness !== undefined ? "friendship" : "level-up";
      else if (d.trigger === "use-item") trigger = "use-item";
      else if (d.trigger === "trade") {
        trigger = "trade";
        needsTrade = true;
      }
      if (d.item) r = Math.max(r, itemRank(d.item, where));
      if (d.heldItem) r = Math.max(r, itemRank(d.heldItem, where));
      if (choice?.segment !== undefined) r = Math.max(r, rank(choice.segment, `evolución ${where}`));
      const nd = family.nationalDexEvolutions;
      if (nd && s.toSpeciesId > nd.maxSpeciesId) r = Math.max(r, rank(nd.segment, `evolución ${where} (Pokédex Nacional)`));
      if (r === NEVER) continue;
      const step: Step = {
        fromSpeciesId: s.fromSpeciesId,
        toSpeciesId: s.toSpeciesId,
        trigger,
        ...(d.minLevel !== undefined ? { minLevel: d.minLevel } : {}),
        ...(d.item ? { itemId: d.item } : d.heldItem ? { itemId: d.heldItem } : {}),
        segment: segmentAt(r),
        needsTrade,
        rank: r,
      };
      stepsFrom.set(s.fromSpeciesId, [...(stepsFrom.get(s.fromSpeciesId) ?? []), step]);
    }
  }

  // In-game trades ("trade-<species>") cannot happen before the species asked for
  // can be obtained (by any means other than another trade), caught or evolved.
  const stepsTo = new Map<number, Step[]>();
  for (const list of stepsFrom.values()) for (const st of list) stepsTo.set(st.toSpeciesId, [...(stepsTo.get(st.toSpeciesId) ?? []), st]);
  const obtainRank = (id: number, seen: ReadonlySet<number> = new Set()): number => {
    if (seen.has(id)) return NEVER;
    const direct = Math.min(NEVER, ...(encountersBySpecies.get(id) ?? []).filter((x) => x.kind !== "trade-ingame").map((x) => x.rank));
    const viaEvolution = (stepsTo.get(id) ?? []).map((st) => Math.max(st.rank, obtainRank(st.fromSpeciesId, new Set([...seen, id]))));
    return Math.min(direct, ...viaEvolution);
  };
  for (const [speciesId, list] of encountersBySpecies) {
    for (let i = list.length - 1; i >= 0; i--) {
      const e = list[i] as (typeof list)[number];
      if (e.kind !== "trade-ingame") continue;
      const asked = e.conditions.find((c) => c.startsWith("trade-"))?.slice("trade-".length);
      if (!asked) continue;
      const askedId = idBySlug.get(asked);
      const askedRank = askedId === undefined ? NEVER : obtainRank(askedId);
      if (askedRank === NEVER) {
        add("warning", "intercambios", `${speciesById.get(speciesId)?.slug}: el intercambio pide ${asked}, que no se obtiene en la historia; se descarta`);
        list.splice(i, 1);
        encountersCounted--;
      } else if (askedRank > e.rank) {
        e.rank = askedRank;
        e.segment = segmentAt(askedRank);
      }
    }
    if (list.length === 0) encountersBySpecies.delete(speciesId);
  }

  // --- Pool -----------------------------------------------------------------
  const chainOf = new Map<number, number>();
  for (const c of input.chains) {
    chainOf.set(c.baseSpeciesId, c.id);
    for (const s of c.steps) {
      chainOf.set(s.fromSpeciesId, c.id);
      chainOf.set(s.toSpeciesId, c.id);
    }
  }
  const directRank = (id: number) => Math.min(NEVER, ...(encountersBySpecies.get(id) ?? []).map((e) => e.rank));

  type Path = { nodes: number[]; steps: Step[] };
  const pool: PoolEntry[] = [];
  const seenEntry = new Set<string>();
  const covered = new Set<number>();

  // Walk every line from its base form; emit() trims each path to its lowest
  // directly obtainable form, so evolved forms caught in the wild do not
  // create duplicate entries.
  const starts = new Set<number>(input.chains.map((c) => c.baseSpeciesId));
  for (const id of encountersBySpecies.keys()) if (!chainOf.has(id)) starts.add(id);
  const walk = (path: Path, noTradeTerminalEmitted: boolean) => {
    const last = path.nodes[path.nodes.length - 1] as number;
    const next = stepsFrom.get(last) ?? [];
    const nonTrade = next.filter((s) => !s.needsTrade);
    if (next.length === 0) {
      emit(path);
      return;
    }
    if (nonTrade.length === 0 && !noTradeTerminalEmitted) emit(path); // last form without trading
    for (const step of next) {
      walk({ nodes: [...path.nodes, step.toSpeciesId], steps: [...path.steps, step] }, noTradeTerminalEmitted || nonTrade.length === 0);
    }
  };
  for (const start of starts) walk({ nodes: [start], steps: [] }, false);
  // A species caught directly whose pre-evolution cannot evolve into it in this
  // game (Chansey without the Oval Stone) is not reached from its line's base:
  // walk from it too.
  for (const [id] of encountersBySpecies) {
    if (directRank(id) < NEVER && !covered.has(id)) walk({ nodes: [id], steps: [] }, false);
  }

  function emit(path: Path) {
    const finalId = path.nodes[path.nodes.length - 1] as number;
    // The entry starts at the lowest node of the path that is directly obtainable.
    const firstIdx = path.nodes.findIndex((n) => directRank(n) < NEVER);
    if (firstIdx === -1) return;
    const nodes = path.nodes.slice(firstIdx);
    const steps = path.steps.slice(firstIdx);
    for (const n of nodes) covered.add(n);
    const base = nodes[0] as number;
    const key = `${base}>${finalId}`;
    if (seenEntry.has(key)) return;
    seenEntry.add(key);

    const firstAvailable = Math.min(...nodes.map(directRank));
    const encounters = nodes.flatMap((n) => encountersBySpecies.get(n) ?? []);
    const firstEncounters = encounters.filter((e) => e.rank === firstAvailable);
    const rarity = bestRarity(firstEncounters) ?? encounterRarity({ kind: "gift" });
    const finalSpecies = speciesById.get(finalId);
    pool.push({
      speciesId: base,
      finalFormId: finalId,
      evolutionLineId: chainOf.get(base) ?? -base,
      firstAvailable: segmentAt(firstAvailable),
      encounters: encounters.map(({ rank: _r, starter: _s, ...e }) => e),
      rarity,
      evolution: steps.map(({ rank: _r, ...s }) => s),
      flags: {
        legendary: nodes.some((n) => speciesById.get(n)?.legendary) || (finalSpecies?.legendary ?? false),
        mythical: nodes.some((n) => speciesById.get(n)?.mythical) || (finalSpecies?.mythical ?? false),
        starter: encounters.some((e) => e.starter),
        needsTrade: steps.some((s) => s.needsTrade),
      },
    });
  }

  pool.sort((a, b) => (rankOf.get(a.firstAvailable) ?? 0) - (rankOf.get(b.firstAvailable) ?? 0) || a.speciesId - b.speciesId || a.finalFormId - b.finalFormId);

  // Dex species that end up nowhere. Post-game-only lines are expected (warning).
  const inPool = new Set(pool.flatMap((p) => [p.speciesId, p.finalFormId, ...p.evolution.map((s) => s.toSpeciesId)]));
  let grew = true;
  while (grew) {
    grew = false;
    for (const c of input.chains) {
      for (const s of c.steps) {
        if (postGameSpecies.has(s.fromSpeciesId) && !postGameSpecies.has(s.toSpeciesId)) {
          postGameSpecies.add(s.toSpeciesId);
          grew = true;
        }
      }
    }
  }
  const reviewed = new Set(Object.keys(version.unobtainable ?? {}));
  for (const id of input.info.regionalDex) {
    if (inPool.has(id)) continue;
    const slug = speciesById.get(id)?.slug ?? String(id);
    if (postGameSpecies.has(id)) add("warning", "solo post-juego", `${slug} solo se obtiene en el post-juego (fuera del pool)`);
    else if (!reviewed.has(slug)) add("error", "especies sin obtener", `${slug} no se puede obtener y no está revisada en versions/${input.game}.ts`);
  }

  // --- Bosses ---------------------------------------------------------------
  const bossOverrides = [...family.bosses, ...(version.bosses ?? [])];
  const bosses: Boss[] = [];
  for (const b of bossOverrides) {
    if (rank(b.segment, `jefe ${b.id}`) === NEVER) continue;
    if (b.team.length === 0) add("error", "jefes", `${b.id} sin equipo`);
    const team = b.team.flatMap((m) => {
      const id = resolve(m.species, `jefe ${b.id}`);
      for (const mv of m.moves) if (!input.moves[mv]) add("error", "jefes", `${b.id}: movimiento desconocido "${mv}"`);
      return id === undefined ? [] : [{ speciesId: id, level: m.level, moves: m.moves }];
    });
    const starterId = b.ifStarter === undefined ? undefined : resolve(b.ifStarter, `jefe ${b.id}`);
    bosses.push({
      id: b.id,
      name: b.name,
      kind: b.kind,
      segment: b.segment,
      team,
      ...(b.rewardTm ? { rewardTm: b.rewardTm } : {}),
      ...(starterId !== undefined ? { ifStarter: starterId, ifStarterLine: chainOf.get(starterId) ?? -starterId } : {}),
    });
    if (b.rewardTm && !input.machines.some((m) => m.number === b.rewardTm)) add("error", "jefes", `${b.id}: MT de recompensa desconocida ${b.rewardTm}`);
  }

  // --- TMs ------------------------------------------------------------------
  const tms: TmEntry[] = [];
  for (const m of input.machines) {
    const o = family.tms[m.number];
    if (!o) {
      add("error", "MT", `${m.number} (${m.moveId}) sin ubicar`);
      continue;
    }
    rank(o.segment, m.number);
    tms.push({ number: m.number, moveId: m.moveId, where: o.where, segment: o.segment, repeatable: o.repeatable });
  }
  for (const n of Object.keys(family.tms)) {
    if (!input.machines.some((m) => m.number === n)) add("error", "MT", `${n} curada pero no existe en este juego`);
  }

  // --- Evolution items ------------------------------------------------------
  const evolutionItems: ItemLocation[] = Object.entries(family.evolutionItems).map(([itemId, o]) => ({
    itemId,
    where: o.where,
    segment: o.segment,
  }));

  // --- Untranslated names (warnings) ----------------------------------------
  for (const a of input.areas) {
    if (!a.hasSpanishName && !locations[a.id]?.name && areasWithCounted.has(a.id)) {
      add("warning", "nombres", `Zona sin nombre en español (ni en PokéAPI ni curado): ${a.id} ("${a.nameEn}")`);
    }
  }

  const game: Game = {
    slug: input.game,
    family: family.family,
    versionGroup: input.info.versionGroup,
    generation: input.info.generation,
    region: input.info.region,
    segments,
    pool,
    bosses,
    tms,
    evolutionItems,
    ...(family.scopes?.length ? { scopes: family.scopes } : {}),
  };
  for (const sc of family.scopes ?? []) {
    if (!rankOf.has(sc.until)) add("error", "tramos", `El alcance "${sc.id}" acaba en un tramo desconocido: ${sc.until}`);
    // The id travels in the URL, where "-" separates fields (url-state.ts).
    if (!/^[a-z0-9]+(?:_[a-z0-9]+)*$/.test(sc.id)) add("error", "tramos", `Id de alcance no válido para la URL: "${sc.id}"`);
  }

  const curatedAreas = [...areasWithCounted].filter((a) => locations[a]).length;
  return {
    game,
    issues,
    stats: {
      areasCurated: curatedAreas,
      areasTotal: areasWithCounted.size,
      encountersCounted,
      poolEntries: pool.length,
      poolLines: new Set(pool.map((p) => p.evolutionLineId)).size,
      bosses: bosses.length,
      tmsCurated: tms.length,
      tmsTotal: input.machines.length,
      todos: issues.filter((i) => i.level === "todo").length,
    },
  };
}

/** Markdown block appended to report.md. */
export function curationReport(out: MergeOutput): string {
  const { stats, issues } = out;
  const errors = issues.filter((i) => i.level === "error");
  const todos = issues.filter((i) => i.level === "todo");
  const warnings = issues.filter((i) => i.level === "warning");
  const ready = errors.length === 0 && todos.length === 0;
  const group = (list: Issue[]) => {
    const byArea = new Map<string, Issue[]>();
    for (const i of list) byArea.set(i.area, [...(byArea.get(i.area) ?? []), i]);
    return [...byArea].flatMap(([area, l]) => [`**${area}** (${l.length})`, "", ...l.map((i) => `- [ ] ${i.message}`), ""]);
  };
  return [
    "## Estado de curación (fase F3)",
    "",
    ready ? "✅ **Listo para publicar**: sin errores ni TODO." : `⛔ **No publicable todavía**: ${errors.length} errores y ${todos.length} TODO.`,
    "",
    `- Zonas con tramo: ${stats.areasCurated}/${stats.areasTotal}`,
    `- MT/MO ubicadas: ${stats.tmsCurated}/${stats.tmsTotal}`,
    `- Jefes: ${stats.bosses}`,
    `- Encuentros que cuentan para la historia: ${stats.encountersCounted}`,
    `- Pool: ${stats.poolEntries} entradas (formas finales) de ${stats.poolLines} líneas evolutivas`,
    "",
    ...(errors.length ? ["### Errores", "", ...group(errors)] : []),
    ...(todos.length ? ["### TODO", "", ...group(todos)] : []),
    ...(warnings.length ? ["### Avisos (no bloquean)", "", ...group(warnings)] : []),
  ].join("\n");
}
