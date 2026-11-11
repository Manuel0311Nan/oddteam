import type { ConditionOverride, MethodOverride } from "../types";

/**
 * When each encounter method becomes usable in HeartGold/SoulSilver. The final
 * segment of an encounter is the latest of its area and its method.
 * Field moves need their HM and the badge that allows them outside battle
 * (WikiDex guide: Rock Smash with the Zephyr Badge, p. 3; Cut with the Hive
 * Badge, p. 5; Surf with the Fog Badge, p. 6; Whirlpool with the Glacier Badge,
 * p. 9).
 */
const G = "wikidex-guia-hgss" as const;

export const methods: Readonly<Record<string, MethodOverride>> = {
  walk: { segment: "pre-gym-1", source: G, note: "Hierba desde la Ruta 29 (p. 2)" },
  "old-rod": { segment: "gym-1-2", source: G, note: "Pescador del Centro Pokémon de la Ruta 32 (p. 4)" },
  "good-rod": { segment: "gym-4-5", source: G, note: "Hermano pescador de la casita bajo el gimnasio de Ciudad Olivo (p. 7), tras el 4º gimnasio" },
  "super-rod": { segment: "kanto", source: "wikidex-supercana", note: "Gurú Pescador de la casa de la Ruta 12, en Kanto" },
  surf: { segment: "gym-4-5", source: G, note: "MO03 en el Teatro de Danza de Ciudad Iris; se usa con la Medalla Niebla (p. 6)" },
  "rock-smash": { segment: "gym-1-2", source: G, note: "MO06 en la Ruta 36; se usa con la Medalla Céfiro (pp. 3–4)" },
  headbutt: {
    segment: "gym-2-3",
    source: ["wikidex-encinar", G],
    note: "Lo enseña un hombre junto a un árbol del Encinar, que se cruza tras el 2º gimnasio (p. 5)",
  },

  // No object needed: the area (or special-encounters.ts) decides.
  gift: { segment: "pre-gym-1", source: "pokeapi", note: "Sin requisito de objeto" },
  "gift-egg": { segment: "pre-gym-1", source: "pokeapi", note: "Sin requisito de objeto" },
  static: { segment: "pre-gym-1", source: "pokeapi", note: "Sin requisito de objeto" },
  "npc-trade": { segment: "pre-gym-1", source: "pokeapi", note: "Requiere el Pokémon que pide el NPC" },
  "roaming-grass": { segment: "pre-gym-1", source: "pokeapi", note: "La condición de PokéAPI marca cuándo empieza a vagar" },
  "squirt-bottle": { segment: "gym-3-4", source: G, note: "Regadera Squirtle de la floristería de Ciudad Trigal, tras el 3er gimnasio (p. 5)" },
  pokeflute: {
    segment: "kanto",
    source: [G, "bulbapedia-hgss-events"],
    note: "Snorlax de Kanto, que se despierta con la Poké Flauta de la radio del Pokégear (p. 20)",
  },
};

/** Block conditions PokéAPI lists for SoulSilver/HeartGold: terrain → minimum number of blocks. */
const SAFARI_BLOCKS: Readonly<Record<string, readonly number[]>> = {
    forest: [3, 4, 5, 8, 10, 14, 15, 18, 20, 28, 35, 42, 49, 56],
    peak: [3, 4, 5, 6, 8, 10, 15, 21, 24, 28, 35, 42, 49, 56, 63],
    plains: [2, 3, 4, 5, 6, 10, 12, 14, 15, 24, 28, 35, 49],
    water: [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 18, 20, 24, 28, 35, 42, 49],
};

const free = (note: string): ConditionOverride => ({ source: "pokeapi", note });
const post = (note: string): ConditionOverride => ({ segment: "post-game", source: "pokeapi", note });
const never = (note: string): ConditionOverride => ({ segment: "excluded", source: "pokeapi", note });

/** Encounter conditions. Without `segment` they do not gate availability. */
export const conditions: Readonly<Record<string, ConditionOverride>> = {
  "time-morning": free("Por la mañana"),
  "time-day": free("De día"),
  "time-night": free("De noche"),
  "weekday-tuesday": free("Los martes"),
  "weekday-thursday": free("Los jueves"),
  "weekday-saturday": free("Los sábados"),
  "weekday-friday": free("Los viernes"),
  "swarm-no": free("Sin masiva (las masivas no cuentan)"),
  "radio-off": free("Sin la radio encendida"),
  "bug-catching-contest-no": free("Fuera del Concurso de captura de bichos"),
  "bug-catching-contest-yes": free("Durante el Concurso de captura de bichos (martes, jueves y sábados); solo te quedas uno"),
  "story-progress-before-national-dex": free("Antes de la Pokédex Nacional"),
  "johto-safari-blocks-inactive": free("Zona Safari sin bloques"),

  "headbutt-tree-common": free("Árboles normales de Golpe Cabeza"),
  "headbutt-tree-rare": {
    source: "pokeapi",
    minRarity: "rare",
    note: "Árboles especiales de Golpe Cabeza: el juego no indica cuáles son, así que como mínimo «raro» (D-030)",
  },
  "headbutt-tree-secret": {
    source: "pokeapi",
    minRarity: "rare",
    note: "Árboles secretos de Golpe Cabeza: el juego no indica cuáles son, así que como mínimo «raro» (D-030)",
  },

  "radio-hoenn": {
    segment: "kanto",
    source: "wikidex-sonidos-hoenn-sinnoh",
    note: "Sonido de Hoenn: requiere haber vencido al Alto Mando y la Pokédex Nacional de Oak",
  },
  "radio-sinnoh": {
    segment: "kanto",
    source: "wikidex-sonidos-hoenn-sinnoh",
    note: "Sonido de Sinnoh: requiere haber vencido al Alto Mando y la Pokédex Nacional de Oak",
  },
  "story-progress-national-dex": {
    segment: "kanto",
    source: G,
    note: "Oak entrega la Pokédex Nacional en el puerto de Ciudad Olivo, tras la Liga (p. 15)",
  },
  "story-progress-zephyr-badge": { segment: "gym-1-2", source: ["pokeapi", G], note: "Huevo de Togepi tras la Medalla Céfiro (p. 3)" },
  "story-progress-awakened-beasts": {
    segment: "gym-3-4",
    source: ["pokeapi", G],
    note: "Raikou y Entei vagan por Johto tras la escena de la Torre Quemada (p. 6)",
  },
  "story-progress-receive-tm-from-claire": {
    segment: "league",
    source: ["pokeapi", G],
    note: "Dratini del Santuario Dragón, tras la prueba de la Guarida Dragón (p. 11)",
  },
  "story-progress-vermilion-copycat": {
    segment: "kanto",
    source: "pokeapi",
    note: "Latios vaga tras hablar con la Copiona (Kanto)",
  },
  "story-progress-returned-machine-part": {
    segment: "kanto",
    source: ["pokeapi", G],
    note: "Zapdos tras devolver la Maquinaria a la Central de Energía (p. 18)",
  },
  "other-snorlax-11-beat-league": {
    segment: "kanto",
    source: ["pokeapi", G],
    note: "Snorlax de Kanto, tras la Liga (p. 20)",
  },
  "trade-bellsprout": free("Hay que entregar un Bellsprout"),
  "trade-drowzee": free("Hay que entregar un Drowzee"),
  "trade-krabby": free("Hay que entregar un Krabby"),
  "trade-dragonair": free("Hay que entregar un Dragonair"),
  "trade-haunter": free("Hay que entregar un Haunter"),
  "trade-dugtrio": free("Hay que entregar un Dugtrio"),
  "trade-forretress": free("Hay que entregar un Forretress"),
  "trade-pikachu": free("Hay que entregar un Pikachu"),
  "trade-bonsly": never("Hay que entregar un Bonsly, que solo se consigue criando: no cuenta"),
  "trade-any-pokemon": post("Steelix de Yasmina, en las revanchas tras Rojo (guía p. 27)"),

  "story-progress-beat-red": post("Tras vencer a Rojo"),
  "other-received-kanto-starter": post("Iniciales de Hoenn tras recibir uno de Kanto, después de Rojo"),
  "other-event-arceus-in-party": never("Requiere un Arceus de evento"),
  "other-correct-password": never("Huevos de Primo: piden una combinación de palabras que el juego no da (D-030)"),
  ...Object.fromEntries(
    ["200", "700", "2100", "3333", "6666", "9999"].map((n) => [`coins-${n}`, never(`Premio del Casino (${n} fichas): no cuenta (D-020)`)]),
  ),
  ...Object.fromEntries(
    ["helix", "dome", "old-amber", "root", "claw", "skull", "armor"].map((f) => [
      f === "old-amber" ? "item-old-amber" : `item-${f}-fossil`,
      {
        segment: "excluded",
        source: "bulbapedia-fossils",
        note: "Los fósiles salen al azar rompiendo rocas (Ruinas Alfa; Cueva Acantilado tras la Liga), y los de Cranidos y Shieldon no están: no cuentan (D-028)",
      } satisfies ConditionOverride,
    ]),
  ),
  // Safari Zone blocks: Baoba hands them out after the National Pokédex, and they
  // take days to take effect (WikiDex). Never story availability.
  ...Object.fromEntries(
    Object.entries(SAFARI_BLOCKS).flatMap(([terrain, mins]) =>
      mins.map((n) => [
        `johto-safari-blocks-${terrain}-min-${n}`,
        {
          segment: "excluded",
          source: "wikidex-zona-safari-johto",
          note: "Con bloques en la Zona Safari: llegan con la Pokédex Nacional y tardan días en hacer efecto",
        } satisfies ConditionOverride,
      ]),
    ),
  ),
};
