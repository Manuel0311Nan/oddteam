/**
 * Spanish UI labels and colors. Official names (types, items, moves, places)
 * come from the data (PokéAPI); these are only interface texts.
 */

import type { Difficulty, Encounter, Rarity, TypeName } from "@/lib/types";

/** Background / foreground per type, chosen for AA contrast (specs/06). */
export const TYPE_COLORS: Record<TypeName, { bg: string; fg: string }> = {
  normal: { bg: "#C9C8A6", fg: "#17171C" },
  fire: { bg: "#E2621E", fg: "#17171C" },
  water: { bg: "#2F6DB5", fg: "#FFFFFF" },
  electric: { bg: "#F7D02C", fg: "#17171C" },
  grass: { bg: "#8FD06A", fg: "#17171C" },
  ice: { bg: "#9ED8DB", fg: "#17171C" },
  fighting: { bg: "#A8291F", fg: "#FFFFFF" },
  poison: { bg: "#8A3E94", fg: "#FFFFFF" },
  ground: { bg: "#E2BF65", fg: "#17171C" },
  flying: { bg: "#C7B8F7", fg: "#17171C" },
  psychic: { bg: "#F98AAD", fg: "#17171C" },
  bug: { bg: "#A9B820", fg: "#17171C" },
  rock: { bg: "#C9B26A", fg: "#17171C" },
  ghost: { bg: "#5B4C8A", fg: "#FFFFFF" },
  dragon: { bg: "#5A35D9", fg: "#FFFFFF" },
  dark: { bg: "#4A3B33", fg: "#FFFFFF" },
  steel: { bg: "#C3C3D6", fg: "#17171C" },
  fairy: { bg: "#F2B6DE", fg: "#17171C" },
};

export const RARITY_LABEL: Record<Rarity, string> = {
  guaranteed: "Garantizado",
  common: "Común",
  uncommon: "Poco común",
  rare: "Raro",
  "very-rare": "Muy raro",
};

/** Generic method labels; item/move-based ones come from method-names.json. */
const GENERIC_METHOD_LABEL: Record<string, string> = {
  walk: "hierba o cueva",
  gift: "regalo",
  "gift-egg": "huevo de regalo",
  static: "encuentro fijo",
  "npc-trade": "intercambio",
  "feebas-tile-fishing": "pesca en casillas concretas",
  "roaming-grass": "errante",
  "roaming-water": "errante",
};

export function methodLabel(encounter: Pick<Encounter, "method" | "kind">, names: Record<string, string>): string {
  const m = encounter.method ?? encounter.kind;
  return names[m] ?? GENERIC_METHOD_LABEL[m] ?? m;
}

export const SEGMENT_TONE = (order: number, total: number): { bg: string; fg: string; bar: string } => {
  const third = total / 3;
  if (order < Math.min(2, third)) return { bg: "#E4F0DA", fg: "#24461A", bar: "#3E7A2A" };
  if (order < third * 2) return { bg: "#FBEBC8", fg: "#5A3D00", bar: "#B07A00" };
  return { bg: "#F7DCD3", fg: "#6E1F0E", bar: "#C42F17" };
};

/** Difficulty pill colors (specs/05), from easiest to hardest. AA contrast. */
export const DIFFICULTY_TONE: Record<Difficulty, { bg: string; fg: string }> = {
  easy: { bg: "#E4F0DA", fg: "#24461A" },
  normal: { bg: "#FBEBC8", fg: "#5A3D00" },
  hard: { bg: "#F7DCD3", fg: "#6E1F0E" },
  challenge: { bg: "#17171C", fg: "#FFFFFF" },
};

export const DIFFICULTY_COMPONENT_LABELS = {
  availability: "Disponibilidad",
  bosses: "Combates",
  stats: "Stats",
  friction: "Fricción",
} as const;

export const DIFFICULTY_COMPONENT_HINTS = {
  availability: "Cuándo se completa el equipo",
  bosses: "Veredictos contra los jefes",
  stats: "Stats base de las formas en cada combate",
  friction: "Evoluciones tardías, MO, únicos y falta de ataques de su tipo",
} as const;
