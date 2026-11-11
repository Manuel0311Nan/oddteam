/**
 * Generator state <-> URL query (specs/03-generador.md, "Semilla y URL").
 *
 *   /{game}?s=7F3A91C2&o=1-6-r-u-100-a-v-264.286&l=280.304&d=ab12cd34
 *
 *   s  seed (8 hex)
 *   o  options, versioned compact string (see encodeOptions)
 *   l  locked species ids, in slot order ("Fijar" keeps the species, not the slot)
 *   d  dataVersion the link was created with, to warn when data changed
 *
 * Missing parameters fall back to defaults; malformed ones are reported, never guessed.
 */

import { DEFAULT_OPTIONS, normalizeExcluded, normalizeOptions } from "@/lib/generator/options";
import { parseSeed, type Seed, seedToParam } from "@/lib/rng";
import {
  type DifficultyFilter,
  type GeneratorOptions,
  isTypeName,
  type RarityFilter,
  type StarterOption,
  TEAM_SIZE_MAX,
  TEAM_SIZE_MIN,
  type TypeRule,
} from "@/lib/types";

export type GeneratorUrlState = {
  seed: Seed;
  options: GeneratorOptions;
  locked: readonly number[];
  dataVersion?: string;
};

export type DecodeResult =
  | { ok: true; state: Partial<GeneratorUrlState> & { options: GeneratorOptions } }
  | { ok: false; reason: string };

const OPTIONS_VERSION = "1";
/** v2 adds the story scope as a 9th field (D-029); v1 links stay valid and mean the default scope. */
const OPTIONS_VERSION_SCOPED = "2";

const DIFFICULTY_CODES: Record<DifficultyFilter, string> = {
  any: "a",
  easy: "e",
  normal: "n",
  hard: "h",
  challenge: "c",
};

const RARITY_CODES: Record<RarityFilter, string> = {
  any: "a",
  "no-very-rare": "v",
  "easy-only": "e",
};

function invert<K extends string>(map: Record<K, string>): Map<string, K> {
  return new Map(Object.entries(map).map(([k, v]) => [v as string, k as K]));
}

const DIFFICULTY_BY_CODE = invert(DIFFICULTY_CODES);
const RARITY_BY_CODE = invert(RARITY_CODES);

function encodeStarter(starter: StarterOption): string {
  switch (starter.mode) {
    case "none":
      return "n";
    case "random":
      return "r";
    case "pick":
      return `p${starter.speciesId}`;
  }
}

function decodeStarter(code: string): StarterOption | null {
  if (code === "n") return { mode: "none" };
  if (code === "r") return { mode: "random" };
  const match = /^p(\d+)$/.exec(code);
  if (match) return { mode: "pick", speciesId: Number(match[1]) };
  return null;
}

function encodeTypeRule(rule: TypeRule): string {
  switch (rule.mode) {
    case "unique":
      return "u";
    case "max-two":
      return "m2";
    case "free":
      return "f";
    case "mono":
      return `o${rule.type}`;
  }
}

function decodeTypeRule(code: string): TypeRule | null {
  if (code === "u") return { mode: "unique" };
  if (code === "m2") return { mode: "max-two" };
  if (code === "f") return { mode: "free" };
  if (code.startsWith("o")) {
    const type = code.slice(1);
    return isTypeName(type) ? { mode: "mono", type } : null;
  }
  return null;
}

function encodeIds(ids: readonly number[]): string {
  return ids.join(".");
}

function decodeIds(text: string): number[] | null {
  if (text === "") return [];
  const parts = text.split(".");
  if (!parts.every((p) => /^\d+$/.test(p))) return null;
  return parts.map(Number);
}

/**
 * Fields, in order, separated by "-":
 * version · size · starter · typeRule · flags (balanced, trade, legendaries as 0/1) ·
 * difficulty · rarity · excluded ids ("." separated, may be empty) · [v2] scope id
 * Without a scope the v1 form is written, so links of games without scopes do not change.
 */
export function encodeOptions(options: GeneratorOptions): string {
  const o = normalizeOptions(options);
  const flags = [o.balancedProgression, o.allowTradeEvolutions, o.allowLegendaries]
    .map((f) => (f ? "1" : "0"))
    .join("");
  const scoped = o.scope !== undefined;
  return [
    scoped ? OPTIONS_VERSION_SCOPED : OPTIONS_VERSION,
    String(o.size),
    encodeStarter(o.starter),
    encodeTypeRule(o.typeRule),
    flags,
    DIFFICULTY_CODES[o.difficulty],
    RARITY_CODES[o.rarity],
    encodeIds(o.excluded),
    ...(scoped ? [o.scope as string] : []),
  ].join("-");
}

export function decodeOptions(text: string): GeneratorOptions | null {
  const parts = text.split("-");
  const scoped = parts[0] === OPTIONS_VERSION_SCOPED && parts.length === 9;
  if (!scoped && (parts.length !== 8 || parts[0] !== OPTIONS_VERSION)) return null;
  const [, sizeText, starterCode, typeCode, flags, diffCode, rarityCode, excludedText] =
    parts as [string, string, string, string, string, string, string, string];
  const scope = scoped ? (parts[8] as string) : undefined;
  if (scope !== undefined && !/^[a-z0-9]+(?:_[a-z0-9]+)*$/.test(scope)) return null;

  if (!/^\d+$/.test(sizeText)) return null;
  const size = Number(sizeText);
  if (size < TEAM_SIZE_MIN || size > TEAM_SIZE_MAX) return null;

  const starter = decodeStarter(starterCode);
  const typeRule = decodeTypeRule(typeCode);
  const difficulty = DIFFICULTY_BY_CODE.get(diffCode);
  const rarity = RARITY_BY_CODE.get(rarityCode);
  const excluded = decodeIds(excludedText);
  if (!starter || !typeRule || !difficulty || !rarity || !excluded) return null;
  if (!/^[01]{3}$/.test(flags)) return null;

  return {
    size,
    starter,
    typeRule,
    balancedProgression: flags[0] === "1",
    allowTradeEvolutions: flags[1] === "1",
    allowLegendaries: flags[2] === "1",
    difficulty,
    rarity,
    excluded: normalizeExcluded(excluded),
    ...(scope !== undefined ? { scope } : {}),
  };
}

export function encodeUrlState(state: GeneratorUrlState): URLSearchParams {
  const params = new URLSearchParams();
  params.set("s", seedToParam(state.seed));
  params.set("o", encodeOptions(state.options));
  if (state.locked.length > 0) params.set("l", encodeIds(state.locked));
  if (state.dataVersion) params.set("d", state.dataVersion);
  return params;
}

export function decodeUrlState(params: URLSearchParams): DecodeResult {
  const state: Partial<GeneratorUrlState> & { options: GeneratorOptions } = {
    options: DEFAULT_OPTIONS,
  };

  const s = params.get("s");
  if (s !== null) {
    const seed = parseSeed(s);
    if (seed === null) return { ok: false, reason: "La semilla del enlace no es válida." };
    state.seed = seed;
  }

  const o = params.get("o");
  if (o !== null) {
    const options = decodeOptions(o);
    if (!options) return { ok: false, reason: "Las opciones del enlace no son válidas." };
    state.options = options;
  }

  const l = params.get("l");
  if (l !== null) {
    const locked = decodeIds(l);
    if (!locked) return { ok: false, reason: "Los Pokémon fijados del enlace no son válidos." };
    if (new Set(locked).size !== locked.length || locked.length > state.options.size) {
      return { ok: false, reason: "Los Pokémon fijados del enlace no son válidos." };
    }
    state.locked = locked;
  }

  const d = params.get("d");
  if (d !== null) {
    if (!/^[0-9a-z]{1,32}$/i.test(d)) {
      return { ok: false, reason: "La versión de datos del enlace no es válida." };
    }
    state.dataVersion = d;
  }

  return { ok: true, state };
}

// ---------------------------------------------------------------------------
// Route mode (specs/08): /{game}/ruta?s=…&o=…&r=0.0.2&d=…
//   r  "Ver otras" presses per stop, in stop order (trailing zeros omitted)
// ---------------------------------------------------------------------------

export type RouteUrlState = {
  seed: Seed;
  options: GeneratorOptions;
  others: readonly number[];
  dataVersion?: string;
};

export function encodeRouteState(state: RouteUrlState): URLSearchParams {
  const params = new URLSearchParams();
  params.set("s", seedToParam(state.seed));
  params.set("o", encodeOptions(state.options));
  const others = [...state.others];
  while (others.length && others[others.length - 1] === 0) others.pop();
  if (others.length) params.set("r", encodeIds(others));
  if (state.dataVersion) params.set("d", state.dataVersion);
  return params;
}

export type RouteDecodeResult =
  | { ok: true; state: { seed?: Seed; options: GeneratorOptions; others: number[]; dataVersion?: string } }
  | { ok: false; reason: string };

export function decodeRouteState(params: URLSearchParams): RouteDecodeResult {
  const base = new URLSearchParams(params);
  base.delete("l");
  base.delete("r");
  const decoded = decodeUrlState(base);
  if (!decoded.ok) return decoded;
  const r = params.get("r");
  const others = r === null ? [] : decodeIds(r);
  if (!others || others.length > 64) return { ok: false, reason: "Las paradas del enlace no son válidas." };
  const { seed, options, dataVersion } = decoded.state;
  return { ok: true, state: { seed, options, others, dataVersion } };
}
