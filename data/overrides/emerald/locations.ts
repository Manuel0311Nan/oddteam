import type { Availability, LocationOverride } from "../types";

/**
 * When each Emerald area with encounters becomes reachable.
 *
 * Main source: order of the Bulbapedia walkthrough (Parts 1–22). An area takes
 * the segment of the first Part that covers it. When the walkthrough lists a
 * place after a gym it could be reached a little earlier; the later segment is
 * kept on purpose (conservative: never claim earlier availability).
 * Encounter methods add their own gate (key-items.ts): e.g. Surf, rods.
 */

const at = (
  segment: Availability,
  note: string,
  extra: Omit<Partial<LocationOverride>, "segment" | "note"> = {},
): LocationOverride => ({ segment, note, source: "bulbapedia-emerald-walkthrough", ...extra });

const postGame = (note: string) => at("post-game", note);

export const locations: Readonly<Record<string, LocationOverride>> = {
  // Part 1
  "littleroot-town-area": at("pre-gym-1", "Parte 1 (sus encuentros son regalos del post-juego: special-encounters.ts)"),
  "hoenn-route-101-area": at("pre-gym-1", "Parte 1"),
  "hoenn-route-103-area": at("pre-gym-1", "Parte 1"),
  "hoenn-route-102-area": at("pre-gym-1", "Parte 1"),
  "petalburg-city-area": at("pre-gym-1", "Parte 1"),

  // Part 2
  "hoenn-route-104-area": at("pre-gym-1", "Parte 2"),
  "petalburg-woods-area": at("pre-gym-1", "Parte 2"),
  "rustboro-city-area": at("pre-gym-1", "Parte 2"),
  "hoenn-route-116-area": at("gym-1-2", "Parte 2, tras el gimnasio de Rustboro"),
  "rusturf-tunnel-area": at("gym-1-2", "Parte 2, tras el gimnasio de Rustboro"),

  // Part 3
  "hoenn-route-105-area": at("gym-5-6", "Parte 3 solo en el barco del Sr. Briney; con Surf en la Parte 8. Todos sus encuentros son en el agua"),
  "hoenn-route-106-area": at("gym-1-2", "Parte 3", {
    todo: "Verificar desde qué tramo se puede pescar en la Ruta 106 sin Surf (orilla junto a Pueblo Azuliza)",
  }),
  "dewford-town-area": at("gym-1-2", "Parte 3 (pesca desde el pueblo con la Caña Vieja que dan allí)"),
  "granite-cave-1f": at("gym-2-3", "Parte 3, tras el gimnasio de Azuliza"),
  "granite-cave-1fsmall-room": at("gym-2-3", "Parte 3, tras el gimnasio de Azuliza"),
  "granite-cave-b1f": at("gym-2-3", "Parte 3, tras el gimnasio de Azuliza"),
  "granite-cave-b2f": at("gym-2-3", "Parte 3, tras el gimnasio de Azuliza"),
  "hoenn-route-107-area": at("gym-5-6", "Parte 3 solo en barco; con Surf en la Parte 8. Encuentros en el agua"),
  "hoenn-route-108-area": at("gym-5-6", "Parte 3 solo en barco; con Surf en la Parte 8. Encuentros en el agua"),
  "hoenn-route-109-area": at("gym-2-3", "Parte 3 (llegada a Portual por la playa)"),

  // Part 4
  "slateport-city-area": at("gym-2-3", "Parte 4"),
  "hoenn-route-110-area": at("gym-2-3", "Parte 4"),

  // Part 5
  "hoenn-route-117-area": at("gym-3-4", "Parte 5, tras el gimnasio de Malvalona"),

  // Part 6
  "hoenn-route-111-area": at(
    "gym-3-4",
    "Parte 6 (Ruta 111 sur). Las capturas a pie de PokéAPI son del desierto (Sandshrew, Trapinch, Cacnea, Baltoy), al que se entra con las Gafas Aislantes en la Parte 8",
    { methods: { walk: "gym-4-5" } },
  ),
  "hoenn-route-112-area": at("gym-3-4", "Parte 6"),
  "fiery-path-area": at("gym-3-4", "Parte 6"),
  "hoenn-route-113-area": at("gym-3-4", "Parte 6"),
  "hoenn-route-114-area": at("gym-3-4", "Parte 6"),

  // Part 7
  "meteor-falls-area": at("gym-3-4", "Parte 7"),
  "meteor-falls-b1f": at("gym-3-4", "Parte 7"),
  "meteor-falls-back": at("league", "Zona trasera: Surf y Cascada (MO07, Medalla Lluvia)", {
    source: ["bulbapedia-emerald-walkthrough", "smogon-emerald-items", "dittobase-emerald-hms"],
  }),
  "meteor-falls-backsmall-room": at("league", "Sala trasera: Surf y Cascada (MO07, Medalla Lluvia)", {
    source: ["bulbapedia-emerald-walkthrough", "smogon-emerald-items", "dittobase-emerald-hms"],
  }),
  "hoenn-route-115-area": at("gym-3-4", "Parte 7"),
  "jagged-pass-area": at("gym-3-4", "Parte 7"),
  "lavaridge-town-area": at("gym-3-4", "Parte 7"),

  // Part 8
  "mirage-tower-area": at("gym-4-5", "Parte 8 (desierto de la Ruta 111)"),

  // Part 9
  "abandoned-ship-area": at("gym-5-6", "Parte 9"),
  "new-mauville-entrance": at("gym-5-6", "Parte 9"),
  "new-mauville-area": at("gym-5-6", "Parte 9"),
  "hoenn-route-118-area": at("gym-5-6", "Parte 9"),

  // Part 10
  "hoenn-route-119-area": at("gym-5-6", "Parte 10"),
  "hoenn-route-119-weather-institute": at("gym-5-6", "Parte 10"),
  "fortree-city-area": at("gym-5-6", "Parte 10"),
  "hoenn-route-120-area": at("gym-5-6", "Parte 10"),

  // Part 11
  "hoenn-route-121-area": at("gym-6-7", "Parte 11, tras el gimnasio de Arborada"),
  "hoenn-safari-zone-se": at("gym-6-7", "Parte 11"),
  "hoenn-safari-zone-sw": at("gym-6-7", "Parte 11"),
  "hoenn-safari-zone-nwmach-bike-area": at("gym-6-7", "Parte 11"),
  "hoenn-safari-zone-neacro-bike-area": at("gym-6-7", "Parte 11"),
  "hoenn-route-122-area": at("gym-6-7", "Parte 11"),

  // Part 12
  "mt-pyre-1f": at("gym-6-7", "Parte 12"),
  "mt-pyre-2f": at("gym-6-7", "Parte 12"),
  "mt-pyre-3f": at("gym-6-7", "Parte 12"),
  "mt-pyre-4f": at("gym-6-7", "Parte 12"),
  "mt-pyre-5f": at("gym-6-7", "Parte 12"),
  "mt-pyre-6f": at("gym-6-7", "Parte 12"),
  "mt-pyre-outside": at("gym-6-7", "Parte 12"),
  "mt-pyre-summit": at("gym-6-7", "Parte 12"),
  "hoenn-route-123-area": at("gym-6-7", "Parte 12"),
  "magma-hideout-area": at("gym-6-7", "Parte 12 (Guarida Magma)"),
  "team-magma-hideout-area": at("gym-6-7", "Parte 12 (Guarida Magma)"),

  // Part 13
  "lilycove-city-area": at("gym-6-7", "Parte 13"),
  "team-aqua-hideout-area": at("gym-6-7", "Parte 13"),

  // Part 14
  "hoenn-route-124-area": at("gym-6-7", "Parte 14"),
  "mossdeep-city-area": at("gym-6-7", "Parte 14"),
  "hoenn-route-125-area": at("gym-6-7", "Parte 14"),
  "mossdeep-city-stevens-house": at("post-game", "Regalo de Beldum en casa de Máximo", {
    source: "pokeapi",
    todo: "Verificar con una fuente que el Beldum de casa de Máximo es post-juego en Esmeralda",
  }),

  // Part 15
  "shoal-cave-low-tide": at("gym-7-8", "Parte 15"),
  "shoal-cave-high-tide": at("gym-7-8", "Parte 15"),
  "shoal-cave-b1f": at("gym-7-8", "Parte 15"),
  "shoal-cave-b2f": at("gym-7-8", "Parte 15"),
  "shoal-cave-b3f": at("gym-7-8", "Parte 15"),
  "hoenn-route-124-underwater": at("gym-7-8", "Bajo el agua: Buceo tras el 7º gimnasio (Parte 15)", {
    source: ["bulbapedia-emerald-walkthrough", "dittobase-emerald-hms"],
  }),
  "hoenn-route-127-area": at("gym-7-8", "Parte 15"),
  "hoenn-route-128-area": at("gym-7-8", "Parte 15"),
  "seafloor-cavern-area": at("gym-7-8", "Parte 15"),

  // Part 16
  "hoenn-route-126-area": at("gym-7-8", "Parte 16"),
  "hoenn-route-126-underwater": at("gym-7-8", "Parte 16 (Buceo)", {
    source: ["bulbapedia-emerald-walkthrough", "dittobase-emerald-hms"],
  }),
  "sootopolis-city-area": at("gym-7-8", "Parte 16"),
  "cave-of-origin-entrance": at("gym-7-8", "Parte 16"),
  "cave-of-origin-1f": at("gym-7-8", "Parte 16"),
  "cave-of-origin-b1f": at("gym-7-8", "Parte 16"),
  "cave-of-origin-b2f": at("gym-7-8", "Parte 16"),
  "cave-of-origin-b3f": at("gym-7-8", "Parte 16"),
  "hoenn-route-129-area": at("gym-7-8", "Parte 16"),
  "hoenn-route-130-area": at("gym-7-8", "Parte 16"),
  "hoenn-route-131-area": at("gym-7-8", "Parte 16"),
  "pacifidlog-town-area": at("gym-7-8", "Parte 16"),

  // Part 17
  "hoenn-route-132-area": at("gym-7-8", "Parte 17"),
  "hoenn-route-133-area": at("gym-7-8", "Parte 17"),
  "hoenn-route-134-area": at("gym-7-8", "Parte 17"),
  "desert-ruins-area": at("gym-7-8", "Parte 17"),
  "island-cave-area": at("gym-7-8", "Parte 17"),
  "ancient-tomb-area": at("gym-7-8", "Parte 17"),
  "sky-pillar-1f": at("gym-7-8", "Parte 17"),
  "sky-pillar-3f": at("gym-7-8", "Parte 17"),
  "sky-pillar-5f": at("gym-7-8", "Parte 17"),
  "sky-pillar-apex": at("gym-7-8", "Parte 17"),

  // Part 18
  "ever-grande-city-area": at("league", "Parte 18"),
  "hoenn-victory-road-1f": at("league", "Parte 18"),
  "hoenn-victory-road-b1f": at("league", "Parte 18"),
  "hoenn-victory-road-b2f": at("league", "Parte 18"),

  // Post-game (Parts 20–22)
  "hoenn-safari-zone-expansion-north": postGame("Parte 20 (ampliación de la Zona Safari)"),
  "hoenn-safari-zone-expansion-south": postGame("Parte 20 (ampliación de la Zona Safari)"),
  "hoenn-altering-cave-area": postGame("Parte 20"),
  "desert-underpass-area": postGame("Parte 20"),
  "terra-cave-area": postGame("Parte 20"),
  "marine-cave-area": postGame("Parte 20"),
  "hoenn-battle-frontier-area": postGame("Parte 21"),
  "artisan-cave-area": at("post-game", "Se entra desde el Frente Batalla", {
    todo: "Verificar con una fuente el acceso a la Cueva Arte (no aparece en las partes del walkthrough)",
  }),
  "faraway-island-area": postGame("Parte 22"),
  "southern-island-area": postGame("Parte 22"),
  "roaming-hoenn-area": at("post-game", "Latios/Latias vagan tras el Salón de la Fama", { source: "pokeapi" }),

  // Never count
  "mirage-island-area": at("excluded", "Aparece solo ciertos días al azar; no forma parte normal de la historia (D-016)", {
    source: "pokeapi",
  }),
  "hoenn-pokecenter-area": at("excluded", "Solo encuentros del disco bonus de Colosseum", { source: "pokeapi" }),
};
