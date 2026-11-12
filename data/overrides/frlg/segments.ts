import type { SegmentOverride } from "../types";

/**
 * Story segments of FireRed/LeafGreen, closed by each gym and the League.
 * expectedLevel = level of the boss's ace − 2 (specs/02); aces from bosses.ts.
 * Gym order of the WikiDex guide (pages 6–20): Brock, Misty, Lt. Surge, Erika,
 * Koga, Sabrina, Blaine, Giovanni. Koga and Sabrina share their ace's level (43).
 */
const S = "wikidex-guia-rfvh" as const;

export const segments: readonly SegmentOverride[] = [
  { id: "pre-gym-1", label: "Antes del 1er gimnasio", expectedLevel: 12, source: [S, "wikidex-gimnasio-plateada"], note: "Brock: Onix nv 14" },
  { id: "gym-1-2", label: "Entre el 1er y el 2º gimnasio", expectedLevel: 19, source: [S, "wikidex-gimnasio-celeste"], note: "Misty: Starmie nv 21" },
  { id: "gym-2-3", label: "Entre el 2º y el 3er gimnasio", expectedLevel: 22, source: [S, "wikidex-gimnasio-carmin"], note: "Lt. Surge: Raichu nv 24" },
  { id: "gym-3-4", label: "Entre el 3er y el 4º gimnasio", expectedLevel: 27, source: [S, "wikidex-gimnasio-azulona"], note: "Erika: Victreebel y Vileplume nv 29" },
  { id: "gym-4-5", label: "Entre el 4º y el 5º gimnasio", expectedLevel: 41, source: [S, "wikidex-gimnasio-fucsia"], note: "Koga: Weezing nv 43" },
  { id: "gym-5-6", label: "Entre el 5º y el 6º gimnasio", expectedLevel: 41, source: [S, "wikidex-gimnasio-azafran"], note: "Sabrina: Alakazam nv 43" },
  { id: "gym-6-7", label: "Entre el 6º y el 7º gimnasio", expectedLevel: 45, source: [S, "wikidex-gimnasio-canela"], note: "Blaine: Arcanine nv 47" },
  { id: "gym-7-8", label: "Entre el 7º y el 8º gimnasio", expectedLevel: 48, source: [S, "wikidex-gimnasio-verde"], note: "Giovanni: Rhyhorn nv 50" },
  { id: "league", label: "Calle Victoria y Liga Pokémon", expectedLevel: 61, source: [S, "wikidex-liga-kanto"], note: "Azul: su inicial nv 63" },
];
