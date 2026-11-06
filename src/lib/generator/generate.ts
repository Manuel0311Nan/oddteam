/**
 * Team generation (specs/03-generador.md). Pure and deterministic:
 * same context + options + seed + locked + history → same result.
 */

import { createRng, deriveSeed, type Rng, type Seed } from "@/lib/rng";
import type { GeneratorOptions, PoolEntry } from "@/lib/types";
import { earlyNeeded, entryKey, type GeneratorContext, isEarly, speciesOf } from "./context";
import { filterPool } from "./filter";
import { normalizeOptions } from "./options";
import { canAdd, validateTeam } from "./validate";

export const MAX_ATTEMPTS = 500;
export const HISTORY_WEIGHT = 0.25;

export type GenerateInput = {
  ctx: GeneratorContext;
  options: GeneratorOptions;
  seed: Seed;
  /** Final-form species ids of the members to keep, in slot order. */
  locked?: readonly number[];
  /** Final-form species ids used recently; they weigh less. */
  recent?: readonly number[];
};

export type GenerateErrorCode =
  | "difficulty-unavailable"
  | "invalid-locked"
  | "pool-too-small"
  | "no-starter"
  | "no-early"
  | "no-combination";

export type GenerateResult =
  | { ok: true; team: PoolEntry[]; attempts: number }
  | { ok: false; code: GenerateErrorCode; message: string };

type Failure = "no-starter" | "no-early" | "no-combination";

export function generateTeam(input: GenerateInput): GenerateResult {
  const { ctx, seed } = input;
  const options = normalizeOptions(input.options);

  if (options.difficulty !== "any") {
    return {
      ok: false,
      code: "difficulty-unavailable",
      message: "El filtro de dificultad todavía no está disponible.",
    };
  }

  // Locked members: kept as they are (even if they do not pass the filters).
  const byFinal = new Map(ctx.pool.map((e) => [entryKey(e), e]));
  const locked: PoolEntry[] = [];
  for (const id of input.locked ?? []) {
    const entry = byFinal.get(id);
    if (!entry) return { ok: false, code: "invalid-locked", message: "Un Pokémon fijado no existe en este juego." };
    if (!canAdd(ctx, locked, entry, options)) {
      return {
        ok: false,
        code: "invalid-locked",
        message: "Los Pokémon fijados no son compatibles entre sí con estas opciones.",
      };
    }
    locked.push(entry);
  }
  if (locked.length > options.size) {
    return { ok: false, code: "invalid-locked", message: "Hay más Pokémon fijados que huecos en el equipo." };
  }

  const candidates = filterPool(ctx, options).filter((e) => !locked.includes(e));
  const distinctLines = new Set([...candidates, ...locked].map((e) => e.evolutionLineId)).size;
  if (distinctLines < options.size) {
    return {
      ok: false,
      code: "pool-too-small",
      message: `Con estas opciones solo hay ${distinctLines} líneas evolutivas disponibles en ${ctx.gameName} y el equipo necesita ${options.size}. Prueba a relajar alguna opción.`,
    };
  }

  const recent = new Set(input.recent ?? []);
  const weight = (e: PoolEntry) => (recent.has(entryKey(e)) ? HISTORY_WEIGHT : 1);
  const starters = candidates.filter((e) => e.flags.starter);
  const starterAvailable = starters.length > 0 || locked.some((e) => e.flags.starter);

  if (options.starter.mode === "pick") {
    const picked = options.starter.speciesId;
    const entry =
      locked.find((e) => speciesOf(e).includes(picked)) ??
      ctx.pool.find((e) => e.flags.starter && speciesOf(e).includes(picked));
    if (!entry) return { ok: false, code: "no-starter", message: "El inicial elegido no está disponible en este juego." };
  }

  const failures = new Map<Failure, number>();
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const rng = createRng(deriveSeed(seed, "attempt", attempt));
    const outcome = buildTeam(rng);
    if (Array.isArray(outcome)) {
      if (validateTeam(ctx, outcome, options, starterAvailable).length === 0) {
        return { ok: true, team: outcome, attempts: attempt + 1 };
      }
      failures.set("no-combination", (failures.get("no-combination") ?? 0) + 1);
    } else {
      failures.set(outcome, (failures.get(outcome) ?? 0) + 1);
    }
  }

  const [worst] = [...failures].sort((a, b) => b[1] - a[1])[0] ?? ["no-combination"];
  return { ok: false, code: worst, message: messageFor(worst) };

  function buildTeam(rng: Rng): PoolEntry[] | Failure {
    const team = [...locked];
    const pick = (pool: readonly PoolEntry[]) => {
      const ok = pool.filter((e) => !team.includes(e) && canAdd(ctx, team, e, options));
      if (ok.length === 0) return null;
      const chosen = rng.weightedPick(ok, weight);
      team.push(chosen);
      return chosen;
    };

    // Starter
    if (options.starter.mode === "pick" && !team.some((e) => speciesOf(e).includes((options.starter as { speciesId: number }).speciesId))) {
      const picked = (options.starter as { speciesId: number }).speciesId;
      const entry = ctx.pool.find((e) => e.flags.starter && speciesOf(e).includes(picked));
      if (!entry || team.length >= options.size || !canAdd(ctx, team, entry, options)) return "no-starter";
      team.push(entry);
    }
    if (options.starter.mode === "random" && starterAvailable && !team.some((e) => e.flags.starter)) {
      if (team.length >= options.size || !pick(starters)) return "no-starter";
    }

    // Balanced progression
    if (options.balancedProgression) {
      const needed = Math.min(options.size, earlyNeeded(options.size));
      const early = candidates.filter((e) => isEarly(ctx, e));
      while (team.filter((e) => isEarly(ctx, e)).length < needed) {
        if (team.length >= options.size || !pick(early)) return "no-early";
      }
    }

    // Rest (starters only if the option allows a second one, which it never does)
    const rest = candidates.filter((e) => !e.flags.starter || options.starter.mode === "none");
    while (team.length < options.size) {
      if (!pick(rest)) return "no-combination";
    }
    return team;
  }

  function messageFor(code: Failure): string {
    switch (code) {
      case "no-starter":
        return "Ningún inicial encaja con las opciones elegidas.";
      case "no-early":
        return `No hay suficientes Pokémon antes del 2º gimnasio que cumplan las opciones en ${ctx.gameName}. Desactiva la progresión equilibrada o relaja alguna opción.`;
      case "no-combination":
        return `No hay ninguna combinación de ${options.size} Pokémon que cumpla todas las opciones en ${ctx.gameName}. Prueba con otra regla de tipos o menos restricciones.`;
    }
  }
}

/** "Cambiar" one slot: keep the others, fill it with a derived seed (specs/03). */
export function rerollSlot(
  input: Omit<GenerateInput, "locked"> & { team: readonly PoolEntry[]; slot: number; counter: number },
): { seed: Seed; result: GenerateResult } {
  const seed = deriveSeed(input.seed, "slot", input.slot, input.counter);
  const keep = input.team.filter((_, i) => i !== input.slot).map(entryKey);
  const old = input.team[input.slot];
  const recent = [...(input.recent ?? []), ...(old ? [entryKey(old)] : [])];
  // The replaced member must not come back.
  const options = old
    ? { ...input.options, excluded: [...input.options.excluded, old.finalFormId] }
    : input.options;
  return { seed, result: generateTeam({ ...input, options, seed, locked: keep, recent }) };
}
