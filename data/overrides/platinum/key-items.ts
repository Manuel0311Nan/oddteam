import type { ConditionOverride, MethodOverride } from "../types";

/**
 * When each encounter method becomes usable in Platinum.
 * The final segment of an encounter is the latest of its area and its method.
 */
export const methods: Readonly<Record<string, MethodOverride>> = {
  walk: { segment: "pre-gym-1", source: "bulbapedia-platinum-walkthrough", note: "Hierba desde la Ruta 201 (Parte 1)" },

  "old-rod": {
    segment: "pre-gym-1",
    source: "bulbapedia-old-rod",
    note: "Pescador en la puerta de Ciudad Jubileo a la Ruta 218 (Ciudad Jubileo, Parte 2)",
  },
  "good-rod": {
    segment: "gym-3-4",
    source: ["bulbapedia-good-rod", "wikidex-cana-buena"],
    note: "Pescador de la Ruta 209 junto a la puerta de Ciudad Corazón; la Ruta 209 se recorre tras el 3er gimnasio (Parte 6)",
  },
  "super-rod": {
    segment: "post-game",
    source: "bulbapedia-super-rod",
    note: "Pescador de la Zona Combate junto a la puerta de la Ruta 225 (post-juego)",
  },
  "feebas-tile-fishing": {
    segment: "pre-gym-1",
    source: "bulbapedia-platinum-walkthrough",
    note: "Cualquier caña; la zona (Monte Corona, sótano) marca el tramo real",
  },
  surf: {
    segment: "gym-5-6",
    source: "bulbapedia-platinum-walkthrough",
    note: "MO03 en las Ruinas Caelestis tras vencer a Helio (Parte 11); se usa con la Medalla Ciénaga (5º gimnasio)",
  },
  "honey-tree": {
    segment: "gym-1-2",
    minRarity: "rare",
    source: ["wikidex-arbol-miel", "bulbapedia-platinum-walkthrough"],
    note: "Miel x10 del anciano del Prado Aromaflor (Parte 3). Hay que esperar 6 h reales y el grupo del árbol es aleatorio: como mínimo «raro» (D-027)",
  },

  // No object needed: the area (or special-encounters.ts) decides.
  gift: { segment: "pre-gym-1", source: "pokeapi", note: "Sin requisito de objeto" },
  "gift-egg": { segment: "pre-gym-1", source: "pokeapi", note: "Sin requisito de objeto" },
  static: { segment: "pre-gym-1", source: "pokeapi", note: "Sin requisito de objeto" },
  "npc-trade": { segment: "pre-gym-1", source: "pokeapi", note: "Requiere el Pokémon que pide el NPC" },
  "roaming-grass": { segment: "pre-gym-1", source: "pokeapi", note: "La condición de PokéAPI marca cuándo empieza a vagar" },
  "roaming-water": { segment: "pre-gym-1", source: "pokeapi", note: "La condición de PokéAPI marca cuándo empieza a vagar" },
};

const free = (note: string): ConditionOverride => ({ source: "pokeapi", note });
const post = (note: string): ConditionOverride => ({ segment: "post-game", source: "pokeapi", note });

/** Encounter conditions. Without `segment` they do not gate availability. */
export const conditions: Readonly<Record<string, ConditionOverride>> = {
  "time-morning": free("Por la mañana"),
  "time-day": free("De día"),
  "time-night": free("De noche"),
  "radar-off": free("Sin Pokéradar (el Pokéradar no cuenta)"),
  "swarm-no": free("Sin masiva (las masivas no cuentan)"),
  "slot2-none": free("Sin cartucho de GBA (la ranura no cuenta)"),
  "honey-tree-group-a": free("Grupo A del árbol de miel"),
  "honey-tree-group-b": free("Grupo B del árbol de miel"),
  "honey-tree-group-c": free("Grupo C (árboles de Munchlax)"),
  "story-progress-before-national-dex": free("Antes de la Pokédex Nacional"),
  "great-marsh-daily-slot-none": free("Gran Pantano sin el Pokémon del día"),
  ...Object.fromEntries(
    ["1", "2", "3", "4", "5", "15"].map((n) => [
      `great-marsh-daily-slot-${n}-of-32`,
      {
        segment: "post-game",
        source: "pokeapi",
        note: "Pokémon del día del Gran Pantano",
        todo: "Confirmar si los Pokémon del día del Gran Pantano requieren la Pokédex Nacional en Platino",
      } satisfies ConditionOverride,
    ]),
  ),
  "trade-machop": free("Hay que entregar un Machop"),
  "trade-buizel": free("Hay que entregar un Buizel"),
  "trade-medicham": free("Hay que entregar un Medicham"),
  "trade-finneon": free("Hay que entregar un Finneon"),

  "story-progress-defeat-mars": {
    segment: "gym-1-2",
    source: ["pokeapi", "bulbapedia-platinum-walkthrough"],
    note: "Drifloon en el Valle Eólico tras vencer a Marte (Parte 4); solo los viernes",
  },
  "story-progress-defeat-jupiter": {
    segment: "gym-2-3",
    source: ["pokeapi", "bulbapedia-platinum-walkthrough"],
    note: "Huevo de Togepi de Cintia tras el Edificio Galaxia de Ciudad Vetusta (Parte 5)",
  },
  "item-odd-keystone": {
    segment: "gym-3-4",
    source: ["pokeapi", "bulbapedia-platinum-walkthrough"],
    note: "Spiritomb: Piedra Espíritu en la torre de la Ruta 209 (Parte 6)",
  },
  "other-talked-to-32-people-underground": {
    segment: "gym-3-4",
    source: ["pokeapi", "bulbapedia-platinum-walkthrough"],
    note: "Spiritomb: hablar con 32 personas en el Subsuelo (Parte 6)",
  },
  "story-progress-beat-team-galactic-iron-island": {
    segment: "gym-5-6",
    source: ["pokeapi", "bulbapedia-platinum-walkthrough"],
    note: "Huevo de Riolu de Quinoa en la Isla Hierro (Parte 13)",
  },
  "story-progress-beat-galactic-coronet": {
    segment: "gym-7-8",
    source: ["pokeapi", "bulbapedia-platinum-walkthrough"],
    note: "Mesprit empieza a vagar tras el Monte Corona (Parte 18)",
  },

  "story-progress-national-dex": post("Tras la Pokédex Nacional (post-juego)"),
  "story-progress-hall-of-fame": post("Tras el Salón de la Fama"),
  "story-progress-oak-eterna-city": post("Tras hablar con Oak en Ciudad Vetusta (post-juego)"),
  "story-progress-cure-eldritch-nightmares": post("Cresselia: tras curar al hijo del marinero (post-juego)"),
  "other-talk-to-cynthias-grandmother": post("Dialga y Palkia en las Columnas Lanza (post-juego)"),
  "item-adamant-orb": post("Dialga: Diamansfera (post-juego)"),
  "item-lustrous-orb": post("Palkia: Lustresfera (post-juego)"),
  "other-giratina-not-caught-in-distortion-world": post("Giratina en la Cueva Retorno (post-juego)"),
  "other-regirock-regice-registeel-in-party": post("Regigigas: con los tres Regis en el equipo (post-juego)"),
  "backlot-mentioned": post("Jardín Trofeo: Pokémon del día (post-juego)"),
  "backlot-not-mentioned": post("Jardín Trofeo (post-juego)"),
  ...Object.fromEntries(
    ["armor", "claw", "dome", "helix", "root", "skull"].map((f) => [
      `item-${f}-fossil`,
      {
        segment: "post-game",
        source: "pokeapi",
        note: "Fósil del Subsuelo resucitado en el Museo Minero. Conservador: qué fósil sale antes de la Pokédex Nacional depende del ID de entrenador",
        todo: "Confirmar en WikiDex qué fósiles salen en el Subsuelo antes de la Pokédex Nacional en Platino",
      } satisfies ConditionOverride,
    ]),
  ),
  "item-old-amber": post("Ámbar Viejo: fósil de Kanto, tras la Pokédex Nacional"),
};
