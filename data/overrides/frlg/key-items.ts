import type { ConditionOverride, MethodOverride } from "../types";

/**
 * When each encounter method becomes usable in FireRed/LeafGreen. The final
 * segment of an encounter is the latest of its area and its method.
 * WikiDex guide: Old Rod in Vermilion (p. 9), Good Rod in Fuchsia and Surf in
 * the Safari Zone, usable outside it with Koga's badge (p. 14). Rock Smash
 * comes from One Island, after the 7th gym (Serebii; guide p. 17).
 */
const G = "wikidex-guia-rfvh" as const;

export const methods: Readonly<Record<string, MethodOverride>> = {
  walk: { segment: "pre-gym-1", source: G, note: "Hierba desde la Ruta 1 (p. 3)" },
  "old-rod": { segment: "gym-2-3", source: G, note: "Gurú Pescador de Ciudad Carmín (p. 9), tras el 2º gimnasio" },
  "good-rod": { segment: "gym-4-5", source: G, note: "Hermano del Gurú Pescador, en Ciudad Fucsia (p. 14)" },
  "super-rod": {
    segment: "gym-4-5",
    source: "wikidex-supercana",
    note: "Gurú Pescador de la casa de la Ruta 12, que se cruza tras despertar al Snorlax (guía p. 13)",
  },
  surf: { segment: "gym-5-6", source: G, note: "MO03 en la Zona Safari; fuera de ella se usa con la medalla de Koga (p. 14)" },
  "rock-smash": { segment: "gym-7-8", source: ["serebii-frlg-tmhm", G], note: "MO06 en Isla Prima, a la que se viaja tras el 7º gimnasio (p. 17)" },

  // No object needed: the area (or special-encounters.ts) decides.
  gift: { segment: "pre-gym-1", source: "pokeapi", note: "Sin requisito de objeto" },
  "gift-egg": { segment: "pre-gym-1", source: "pokeapi", note: "Sin requisito de objeto" },
  static: { segment: "pre-gym-1", source: "pokeapi", note: "Sin requisito de objeto" },
  "npc-trade": { segment: "pre-gym-1", source: "pokeapi", note: "Requiere el Pokémon que pide el NPC" },
  "roaming-grass": { segment: "pre-gym-1", source: "pokeapi", note: "La condición de PokéAPI marca cuándo empieza a vagar" },
  pokeflute: { segment: "gym-4-5", source: G, note: "Snorlax de las Rutas 12 y 16, con la Poké Flauta de Fuji tras la Torre Pokémon (pp. 13–14)" },
};

const free = (note: string): ConditionOverride => ({ source: "pokeapi", note });
const post = (note: string): ConditionOverride => ({ segment: "post-game", source: "pokeapi", note });
const never = (note: string): ConditionOverride => ({ segment: "excluded", source: "pokeapi", note });

/** Encounter conditions. Without `segment` they do not gate availability. */
export const conditions: Readonly<Record<string, ConditionOverride>> = {
  "trade-abra": free("Hay que entregar un Abra"),
  "trade-golduck": free("Hay que entregar un Golduck"),
  "trade-slowbro": free("Hay que entregar un Slowbro"),
  "trade-nidoran-m": free("Hay que entregar un Nidoran♂"),
  "trade-nidoran-f": free("Hay que entregar una Nidoran♀"),
  "trade-nidorino": free("Hay que entregar un Nidorino"),
  "trade-nidorina": free("Hay que entregar una Nidorina"),
  "trade-poliwhirl": free("Hay que entregar un Poliwhirl"),
  "trade-ponyta": free("Hay que entregar un Ponyta"),
  "trade-raichu": free("Hay que entregar un Raichu"),
  "trade-spearow": free("Hay que entregar un Spearow"),
  "trade-venonat": free("Hay que entregar un Venonat"),
  "story-progress-beat-elite-four-round-two": post("Perros legendarios: tras la revancha del Alto Mando"),
  "starter-bulbasaur": free("Según el inicial elegido"),
  "starter-charmander": free("Según el inicial elegido"),
  "starter-squirtle": free("Según el inicial elegido"),
  "first-party-pokemon-high-friendship": free("Con un Pokémon muy amistoso al frente del equipo"),
  ...Object.fromEntries(
    ["120", "180", "500", "750", "2500", "2800", "4600", "5500", "6500", "9999"].map((n) => [
      `coins-${n}`,
      never(`Premio del Casino (${n} fichas): no cuenta (D-020)`),
    ]),
  ),
  "item-helix-fossil": {
    source: "wikidex-guia-rfvh",
    note: "Fósil del Monte Moon: se elige uno de los dos (p. 7) y se revive en Isla Canela",
  },
  "item-dome-fossil": {
    source: "wikidex-guia-rfvh",
    note: "Fósil del Monte Moon: se elige uno de los dos (p. 7) y se revive en Isla Canela",
  },
  "item-old-amber": { source: "wikidex-guia-rfvh", note: "Ámbar Viejo del científico detrás del Museo de Ciudad Plateada, con Corte (p. 9)" },
};
