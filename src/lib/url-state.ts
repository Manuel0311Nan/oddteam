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
 * difficulty · rarity · excluded ids ("." separated, may be empty)
 */
export function encodeOptions(options: GeneratorOptions): string {
  const o = normalizeOptions(options);
  const flags = [o.balancedProgression, o.allowTradeEvolutions, o.allowLegendaries]
    .map((f) => (f ? "1" : "0"))
    .join("");
  return [
    OPTIONS_VERSION,
    String(o.size),
    encodeStarter(o.starter),
    encodeTypeRule(o.typeRule),
    flags,
    DIFFICULTY_CODES[o.difficulty],
    RARITY_CODES[o.rarity],
    encodeIds(o.excluded),
  ].join("-");
}

export function decodeOptions(text: string): GeneratorOptions | null {
  const parts = text.split("-");
  if (parts.length !== 8 || parts[0] !== OPTIONS_VERSION) return null;
  const [, sizeText, starterCode, typeCode, flags, diffCode, rarityCode, excludedText] =
    parts as [string, string, string, string, string, string, string, string];

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
