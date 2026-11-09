import type { Availability, LocationOverride } from "../types";

/**
 * When each Platinum area with encounters becomes reachable, and its Spanish name.
 *
 * Segment: order of the Bulbapedia walkthrough (Parts 1–26). An area takes the
 * segment of the first Part that covers it; a place listed after a gym in its
 * Part takes the next segment (conservative, D-016). Encounter methods add their
 * own gate (key-items.ts): Surf, rods, honey.
 *
 * Name: PokéAPI has no Spanish names for Sinnoh, so they come from WikiDex
 * (D-027). Where WikiDex gives two names ("anime/juego"), the second is the one
 * used in the Spanish games and is the one kept here. Floor or part details
 * after the name are descriptive, not official.
 */

const at = (
  segment: Availability,
  name: string,
  note: string,
  extra: Omit<Partial<LocationOverride>, "segment" | "note" | "name"> = {},
): LocationOverride => ({
  segment,
  name,
  note,
  source: ["bulbapedia-platinum-walkthrough", "wikidex-sinnoh"],
  ...extra,
});

const postGame = (name: string, note: string) => at("post-game", name, note);

const range = (prefix: string, floors: readonly string[]) => floors.map((f) => `${prefix}-${f}`);

export const locations: Readonly<Record<string, LocationOverride>> = {
  // Part 1
  "twinleaf-town-area": at("pre-gym-1", "Pueblo Hojaverde", "Parte 1; solo encuentros en el agua (Surf y cañas)"),
  "sinnoh-route-201-area": at("pre-gym-1", "Ruta 201", "Parte 1"),
  "lake-verity-before-galactic-intervention": at("pre-gym-1", "Lago Veraz", "Parte 1"),
  "sinnoh-route-219-area": at("pre-gym-1", "Ruta 219", "Parte 1 (al sur de Pueblo Arena); solo agua: Surf y cañas"),

  // Part 2
  "sinnoh-route-202-area": at("pre-gym-1", "Ruta 202", "Parte 2"),
  "sinnoh-route-203-area": at("pre-gym-1", "Ruta 203", "Parte 2"),
  "oreburgh-gate-1f": at("pre-gym-1", "Puerta Pirita", "Parte 2"),
  "oreburgh-gate-b1f": at("gym-5-6", "Puerta Pirita (sótano)", "Se recorre en la Parte 11, en la vuelta con Surf", {
    todo: "Confirmar qué MO hace falta para el sótano de la Puerta Pirita en Platino",
  }),
  "oreburgh-mine-1f": at("pre-gym-1", "Mina Pirita", "Parte 2"),
  "oreburgh-mine-b1f": at("pre-gym-1", "Mina Pirita (sótano)", "Parte 2"),
  "oreburgh-city-north-west-house": at("pre-gym-1", "Ciudad Pirita", "Parte 2; intercambio de un Machop por un Abra"),
  "oreburgh-city-oreburgh-mining-museum": at("pre-gym-1", "Museo Minero de Ciudad Pirita", "Parte 2; los fósiles los decide su condición"),

  // Part 3 (after the 1st gym)
  "sinnoh-route-204-south-towards-jubilife-city": at("gym-1-2", "Ruta 204 (sur)", "Parte 3, tras el gimnasio de Ciudad Pirita"),
  "sinnoh-route-204-north-towards-floaroma-town": at("gym-1-2", "Ruta 204 (norte)", "Parte 3"),
  "ravaged-path-area": at("gym-1-2", "Senda Desolada", "Parte 3"),
  "floaroma-meadow-area": at("gym-1-2", "Prado Aromaflor", "Parte 3"),

  // Part 4
  "valley-windworks-area": at("gym-1-2", "Valle Eólico", "Parte 4"),
  "sinnoh-route-205-south-towards-floaroma-town": at("gym-1-2", "Ruta 205 (sur)", "Parte 4"),
  "eterna-forest-area": at("gym-1-2", "Bosque Vetusto", "Parte 4"),
  "sinnoh-route-205-east-towards-eterna-city": at("gym-1-2", "Ruta 205 (este)", "Parte 4"),
  "eterna-city-area": at("gym-1-2", "Ciudad Vetusta", "Parte 4; solo agua"),
  "eterna-city-eterna-condominiums": at("gym-1-2", "Ciudad Vetusta", "Parte 4; intercambio de un Buizel por un Chatot (en un edificio de la ciudad)"),

  // Part 5 (after the 2nd gym)
  "eterna-city-west-gate": at("gym-2-3", "Ciudad Vetusta (puerta oeste)", "Parte 5; huevo de Togepi de Cintia"),
  ...Object.fromEntries(
    range("old-chateau", [
      "entrance",
      "dining-room",
      "2f",
      "2f-leftmost-room",
      "2f-left-room",
      "2f-middle-room",
      "2f-right-room",
      "2f-rightmost-room",
      "2f-private-room",
    ]).map((id) => [id, at("gym-2-3", "Vieja Mansión", "Parte 5; se llega con Corte desde el Bosque Vetusto")]),
  ),
  "sinnoh-route-206-area": at("gym-2-3", "Ruta 206", "Parte 5; Pista Ciclista con la Bici (WikiDex: tras el Edificio Galaxia de Ciudad Vetusta)", {
    source: ["bulbapedia-platinum-walkthrough", "wikidex-sinnoh", "wikidex-bici"],
  }),
  "wayward-cave-1f": at("gym-2-3", "Cueva Extravío", "Parte 5"),
  "wayward-cave-b1f": at("gym-2-3", "Cueva Extravío (zona oculta)", "Guía WikiDex p. 8: entrada oculta bajo la Pista Ciclista, con Destello (MT70); allí está Gible", {
    source: ["bulbapedia-platinum-walkthrough", "wikidex-guia-platino", "wikidex-sinnoh"],
  }),
  "sinnoh-route-207-area": at("gym-2-3", "Ruta 207", "Parte 5"),

  // Part 6
  "mt-coronet-1f-route-207": at("gym-2-3", "Monte Corona (entrada de la Ruta 207)", "Parte 6"),
  "sinnoh-route-208-area": at("gym-2-3", "Ruta 208", "Parte 6"),
  "hearthome-city-area": at("gym-2-3", "Ciudad Corazón", "Parte 6; Eevee de regalo"),
  "sinnoh-route-209-area": at("gym-3-4", "Ruta 209", "Parte 6, tras el gimnasio de Ciudad Corazón"),

  // Part 7
  ...Object.fromEntries(
    range("lost-tower", ["1f", "2f", "3f", "4f", "5f"]).map((id) => [
      id,
      at("gym-3-4", "Torre Sagrada", "Parte 7; las plantas 3–5 piden Despejar, que se consigue en la misma parte"),
    ]),
  ),
  ...Object.fromEntries(
    range("solaceon-ruins", [
      "1f",
      "2f",
      "b1f-a",
      "b1f-b",
      "b1f-c",
      "b2f-a",
      "b2f-b",
      "b2f-c",
      "b3f-a",
      "b3f-b",
      "b3f-c",
      "b3f-d",
      "b3f-e",
      "b4f-a",
      "b4f-b",
      "b4f-c",
      "b4f-d",
      "b5f",
    ]).map((id) => [id, at("gym-3-4", "Ruinas Sosiego", "Parte 7")]),
  ),
  "sinnoh-route-210-south-towards-solaceon-town": at("gym-3-4", "Ruta 210 (sur)", "Parte 7"),

  // Part 8
  "sinnoh-route-215-area": at("gym-3-4", "Ruta 215", "Parte 8"),
  "veilstone-city-area": at("gym-3-4", "Ciudad Rocavelo", "Parte 8"),

  // Part 9 (after the 4th gym)
  "sinnoh-route-214-area": at("gym-4-5", "Ruta 214", "Parte 9, tras el gimnasio de Ciudad Rocavelo"),
  "maniac-tunnel-26-plus-different-unown-caught": at("gym-4-5", "Mina Ruinamaníaco", "Parte 9; el túnel crece hasta Pueblo Sosiego al ver las 26 formas de Unown"),
  "ruin-maniac-cave-0-9-different-unown-caught": at("gym-4-5", "Mina Ruinamaníaco", "Parte 9"),
  "ruin-maniac-cave-10-25-different-unown-caught": at("gym-4-5", "Mina Ruinamaníaco", "Parte 9"),
  "valor-lakefront-area": at("gym-4-5", "Orilla Valor", "Parte 9"),
  "sinnoh-route-213-area": at("gym-4-5", "Ruta 213", "Parte 9"),
  "pastoria-city-area": at("gym-4-5", "Ciudad Pradera", "Parte 9; solo agua"),

  // Part 10 (after the 5th gym)
  ...Object.fromEntries(
    range("great-marsh-area", ["1", "2", "3", "4", "5", "6"]).map((id) => [
      id,
      at("gym-5-6", "Gran Pantano", "Parte 10: se abre tras el gimnasio de Ciudad Pradera y la amenaza de bomba"),
    ]),
  ),
  "sinnoh-route-212-north-towards-hearthome-city": at("gym-5-6", "Ruta 212 (norte)", "Parte 10"),
  "sinnoh-route-212-east-towards-pastoria-city": at("gym-5-6", "Ruta 212 (sur)", "Parte 10"),

  // Part 11
  "sinnoh-route-210-west-towards-celestic-town": at("gym-5-6", "Ruta 210 (norte)", "Parte 11: los Psyduck se apartan con la MedicinaSecreta"),
  "celestic-town-area": at("gym-5-6", "Pueblo Caelestis", "Parte 11"),
  "fuego-ironworks-area": at("gym-5-6", "Forja Fuego", "Parte 11; se llega con Surf desde la Ruta 205", {
    source: ["bulbapedia-platinum-walkthrough", "bulbapedia-fuego-ironworks", "wikidex-sinnoh"],
  }),

  // Part 12
  "sinnoh-sea-route-220-area": at("gym-5-6", "Ruta 220", "Parte 12; solo agua"),
  "sinnoh-route-221-area": at("gym-5-6", "Ruta 221", "Parte 12"),
  "sinnoh-route-218-area": at("gym-5-6", "Ruta 218", "Parte 12"),
  "canalave-city-area": at("gym-5-6", "Ciudad Canal", "Parte 12; solo agua"),

  // Part 13 (Iron Island before the 6th gym)
  ...Object.fromEntries(
    ["iron-island-area", ...range("iron-island", ["1f", "b1f-left", "b1f-right", "b2f-left", "b2f-right", "b3f"])].map((id) => [
      id,
      at("gym-5-6", "Isla Hierro", "Parte 13, antes del gimnasio de Ciudad Canal"),
    ]),
  ),
  "lake-valor-area": at("gym-6-7", "Lago Valor", "Parte 13, tras el gimnasio de Ciudad Canal"),
  "lake-valor-cavern": at("gym-7-8", "Lago Valor (cueva)", "Azelf, tras el Cuartel Galaxia (Parte 18)"),

  // Part 14
  "lake-verity-after-galactic-intervention": at("gym-6-7", "Lago Veraz", "Parte 14"),
  "sinnoh-route-211-west-towards-eterna-city": at("gym-6-7", "Ruta 211 (oeste)", "Parte 14 (se puede llegar antes desde Ciudad Vetusta; conservador)"),
  "sinnoh-route-211-east-towards-celestic-town": at("gym-6-7", "Ruta 211 (este)", "Parte 14"),
  "mt-coronet-1f-route-211": at("gym-6-7", "Monte Corona (entrada de la Ruta 211)", "Parte 14"),
  "mt-coronet-1f-route-216": at("gym-6-7", "Monte Corona (salida a la Ruta 216)", "Parte 14"),
  "mt-coronet-b1f": at("gym-6-7", "Monte Corona (sótano)", "Parte 14; Feebas en el lago (Despejar)"),
  "sinnoh-route-216-area": at("gym-6-7", "Ruta 216", "Parte 14"),
  "sinnoh-route-217-area": at("gym-6-7", "Ruta 217", "Parte 14"),

  // Part 15
  "acuity-lakefront-area": at("gym-6-7", "Orilla Agudeza", "Parte 15, antes del gimnasio de Ciudad Puntaneva"),
  "snowpoint-city-north-west-house": at("gym-6-7", "Ciudad Puntaneva", "Parte 15; intercambio de un Medicham por un Haunter"),
  "lake-acuity-area": at("gym-7-8", "Lago Agudeza", "Parte 15, tras el gimnasio de Ciudad Puntaneva (Escalada)"),
  "lake-acuity-cavern": at("gym-7-8", "Lago Agudeza (cueva)", "Uxie, tras el Cuartel Galaxia (Parte 18)"),

  // Part 16–17
  ...Object.fromEntries(
    [
      "mt-coronet-1f-from-exterior",
      "mt-coronet-2f",
      "mt-coronet-3f",
      "mt-coronet-4f",
      "mt-coronet-4f-small-room",
      "mt-coronet-5f",
      "mt-coronet-6f",
      "mt-coronet-exterior-snowfall",
      "mt-coronet-exterior-blizzard",
    ].map((id) => [id, at("gym-7-8", "Monte Corona (interior y cumbre)", "Parte 16")]),
  ),
  "spear-pillar-area": at("gym-7-8", "Columnas Lanza", "Parte 17; Dialga y Palkia los decide su condición (post-juego)"),
  "distortion-world-area": at("gym-7-8", "Mundo Distorsión", "Parte 17; Giratina"),

  // Part 18
  "sendoff-spring-area": at("gym-7-8", "Fuente Despedida", "Parte 18"),
  "sinnoh-route-222-area": at("gym-7-8", "Ruta 222", "Parte 18"),
  "sunyshore-city-area": at("gym-7-8", "Ciudad Marina", "Parte 18; solo agua"),
  "roaming-sinnoh-area": at("gym-7-8", "Sinnoh (errante)", "Cada errante lo decide su condición"),

  // Part 19–20
  "sinnoh-victory-road-1f": at("league", "Calle Victoria", "Parte 19"),
  "sinnoh-victory-road-2f": at("league", "Calle Victoria", "Parte 19"),
  "sinnoh-victory-road-b1f": at("league", "Calle Victoria (sótano)", "Parte 19"),
  "sinnoh-pokemon-league-area": at("league", "Liga Pokémon", "Parte 19; solo agua"),

  // Post-game (Parts 21–26)
  "sinnoh-victory-road-inside": postGame("Calle Victoria (zona interior)", "Parte 23 (post-juego)"),
  "sinnoh-victory-road-inside-b1f": postGame("Calle Victoria (zona interior)", "Parte 23 (post-juego)"),
  "sinnoh-victory-road-inside-exit": postGame("Calle Victoria (zona interior)", "Parte 23 (post-juego)"),
  "trophy-garden-area": postGame("Jardín Trofeo", "Parte 22 (post-juego)"),
  ...Object.fromEntries(
    range("snowpoint-temple", ["1f", "b1f", "b2f", "b3f", "b4f", "b5f"]).map((id) => [id, postGame("Templo Puntaneva", "Parte 22 (post-juego)")]),
  ),
  ...Object.fromEntries(
    range("turnback-cave", [
      "pillar-1",
      "pillar-2",
      "pillar-3",
      "before-pillar-1",
      "between-pillars-1-and-2",
      "between-pillars-2-and-3",
      "after-pillar-3",
    ]).map((id) => [id, postGame("Cueva Retorno", "Parte 22 (post-juego)")]),
  ),
  "sinnoh-route-224-area": postGame("Ruta 224", "Parte 23 (post-juego)"),
  "sinnoh-route-225-area": postGame("Ruta 225", "Parte 24 (post-juego)"),
  "sinnoh-sea-route-226-area": postGame("Ruta 226", "Parte 24 (post-juego)"),
  "sinnoh-sea-route-226-island-house": postGame("Ruta 226", "Parte 24 (post-juego); intercambio de un Finneon por un Magikarp"),
  "sinnoh-route-227-area": postGame("Ruta 227", "Parte 24 (post-juego)"),
  "stark-mountain-entrance": postGame("Montaña Dura", "Parte 25 (post-juego)"),
  "stark-mountain-area": postGame("Montaña Dura", "Parte 25 (post-juego)"),
  "stark-mountain-inside": postGame("Montaña Dura", "Parte 25 (post-juego)"),
  "stark-mountain-heatran-chamber": postGame("Montaña Dura", "Parte 25 (post-juego)"),
  "sinnoh-route-228-area": postGame("Ruta 228", "Parte 26 (post-juego)"),
  "sinnoh-route-229-area": postGame("Ruta 229", "Parte 26 (post-juego)"),
  "resort-area-area": postGame("Zona Descanso", "Parte 26 (post-juego)"),
  "sinnoh-sea-route-230-area": postGame("Ruta 230", "Parte 26 (post-juego)"),
  "sinnoh-sea-route-223-area": at("league", "Ruta 223", "Parte 19; solo agua"),
  "newmoon-island-area": postGame("Isla Lunanueva", "Darkrai, evento (no se obtiene jugando)"),
  "flower-paradise-area": postGame("Paraíso Floral", "Shaymin, evento (no se obtiene jugando)"),
  "sinnoh-hall-of-origin-1-area": postGame("Sala del Origen", "Arceus, evento (no se obtiene jugando)"),
  "sinnoh-pokemart-area": postGame("Tienda Pokémon", "Huevo de Manaphy desde Pokémon Ranger (otro juego)"),
};
