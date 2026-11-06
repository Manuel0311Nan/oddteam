import type { ConditionOverride, MethodOverride } from "../types";

/**
 * When each encounter method becomes usable in Emerald.
 * The final segment of an encounter is the latest of its area and its method.
 */
export const methods: Readonly<Record<string, MethodOverride>> = {
  walk: { segment: "pre-gym-1", source: "bulbapedia-emerald-walkthrough", note: "Hierba desde la Ruta 101 (Parte 1)" },

  "old-rod": {
    segment: "gym-1-2",
    source: "dittobase-emerald-old-rod",
    note: "Pescador al este del gimnasio de Pueblo Azuliza (Parte 3, antes del 2º gimnasio)",
  },
  "good-rod": {
    segment: "gym-5-6",
    source: ["dittobase-emerald-good-rod", "bulbapedia-emerald-walkthrough"],
    note: "Pescador en la orilla este de la Ruta 118, al otro lado del agua: requiere Surf (Parte 9, tras el 5º gimnasio)",
  },
  "super-rod": {
    segment: "gym-6-7",
    source: ["dittobase-emerald-super-rod", "bulbapedia-emerald-walkthrough"],
    note: "Pescador en la casa al este del gimnasio de Ciudad Algaria (Parte 14)",
  },
  "feebas-tile-fishing": {
    segment: "gym-1-2",
    source: "dittobase-emerald-old-rod",
    note: "Se pesca con cualquier caña; la zona (Ruta 119) marca el tramo real",
  },

  surf: {
    segment: "gym-5-6",
    source: "dittobase-emerald-hms",
    note: "MO03: el padre de Wally tras vencer a Norman; requiere la Medalla Equilibrio",
  },
  "rock-smash": {
    segment: "gym-3-4",
    source: "dittobase-emerald-hms",
    note: "MO06 en Ciudad Malvalona; requiere la Medalla Dinamo (Wattson)",
  },
  seaweed: {
    segment: "gym-7-8",
    source: "dittobase-emerald-hms",
    note: "Algas bajo el agua: Buceo (MO08) de Máximo tras el Centro Espacial; requiere la Medalla Mente",
  },

  "devon-scope": {
    segment: "gym-5-6",
    source: ["dittobase-emerald-devon-scope", "bulbapedia-emerald-walkthrough"],
    note: "Máximo la entrega en el puente norte de la Ruta 120 (Parte 10)",
  },
  "wailmer-pail": {
    segment: "post-game",
    source: ["pokeapi", "bulbapedia-emerald-walkthrough"],
    note: "Solo se usa con el Sudowoodo del Frente Batalla (Parte 21, post-juego)",
  },

  // No object needed: the area (or special-encounters.ts) decides.
  gift: { segment: "pre-gym-1", source: "pokeapi", note: "Sin requisito de objeto" },
  "gift-egg": { segment: "pre-gym-1", source: "pokeapi", note: "Sin requisito de objeto" },
  static: { segment: "pre-gym-1", source: "pokeapi", note: "Sin requisito de objeto" },
  "npc-trade": { segment: "pre-gym-1", source: "pokeapi", note: "Requiere el Pokémon que pide el NPC" },
  "roaming-grass": { segment: "pre-gym-1", source: "pokeapi", note: "La condición de PokéAPI marca el post-juego" },
  "roaming-water": { segment: "pre-gym-1", source: "pokeapi", note: "La condición de PokéAPI marca el post-juego" },
};

/** Encounter conditions that gate availability. */
export const conditions: Readonly<Record<string, ConditionOverride>> = {
  "story-progress-hall-of-fame": { segment: "post-game", source: "pokeapi", note: "Tras entrar en el Salón de la Fama" },
  "item-claw-fossil": { source: "bulbapedia-emerald-part-8", note: "Se elige un fósil en la Torre Espejismo (grupo exclusivo)" },
  "item-root-fossil": { source: "bulbapedia-emerald-part-8", note: "Se elige un fósil en la Torre Espejismo (grupo exclusivo)" },
  "trade-ralts": { source: "pokeapi", note: "Hay que entregar un Ralts" },
  "trade-volbeat": { source: "pokeapi", note: "Hay que entregar un Volbeat" },
  "trade-bagon": { source: "pokeapi", note: "Hay que entregar un Bagon" },
  "trade-skitty": { source: "pokeapi", note: "Hay que entregar un Skitty" },
  "tv-option-red": { source: "pokeapi", note: "Elección en la tele tras el Salón de la Fama" },
  "tv-option-blue": { source: "pokeapi", note: "Elección en la tele tras el Salón de la Fama" },
};
