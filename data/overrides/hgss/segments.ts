import type { GameScope } from "../../../src/lib/types";
import type { SegmentOverride } from "../types";

/**
 * Story segments of HeartGold and SoulSilver, closed by each gym, the Johto
 * League and, last, the eight Kanto gyms.
 * expectedLevel = level of the boss's ace − 2 (specs/02); aces from bosses.ts.
 * Gym order of the WikiDex guide (pages 3–11): Falkner, Bugsy, Whitney, Morty,
 * Chuck, Jasmine, Pryce, Clair. Pryce's ace (34) is below Jasmine's (35), so the
 * expected level does not drop: 33 in both.
 * Kanto's gyms have no fixed order (guide pages 15–24), so they share one
 * segment, closed by Blue, who needs the other seven badges (page 23).
 */
const S = "wikidex-guia-hgss" as const;

export const segments: readonly SegmentOverride[] = [
  { id: "pre-gym-1", label: "Antes del 1er gimnasio", expectedLevel: 11, source: [S, "wikidex-gimnasio-malva"], note: "Pegaso: Pidgeotto nv 13" },
  { id: "gym-1-2", label: "Entre el 1er y el 2º gimnasio", expectedLevel: 15, source: [S, "wikidex-gimnasio-azalea"], note: "Antón: Scyther nv 17" },
  { id: "gym-2-3", label: "Entre el 2º y el 3er gimnasio", expectedLevel: 17, source: [S, "wikidex-gimnasio-trigal"], note: "Blanca: Miltank nv 19" },
  { id: "gym-3-4", label: "Entre el 3er y el 4º gimnasio", expectedLevel: 23, source: [S, "wikidex-gimnasio-iris"], note: "Morti: Gengar nv 25" },
  { id: "gym-4-5", label: "Entre el 4º y el 5º gimnasio", expectedLevel: 29, source: [S, "wikidex-gimnasio-orquidea"], note: "Aníbal: Poliwrath nv 31" },
  { id: "gym-5-6", label: "Entre el 5º y el 6º gimnasio", expectedLevel: 33, source: [S, "wikidex-gimnasio-olivo"], note: "Yasmina: Steelix nv 35" },
  { id: "gym-6-7", label: "Entre el 6º y el 7º gimnasio", expectedLevel: 33, source: [S, "wikidex-gimnasio-caoba"], note: "Fredo: Piloswine nv 34; se mantiene el 33 del tramo anterior" },
  { id: "gym-7-8", label: "Entre el 7º y el 8º gimnasio", expectedLevel: 39, source: [S, "wikidex-gimnasio-endrino"], note: "Débora: Kingdra nv 41" },
  { id: "league", label: "Calle Victoria y Liga Pokémon", expectedLevel: 48, source: [S, "wikidex-liga-johto"], note: "Lance: Dragonite nv 50" },
  {
    id: "kanto",
    label: "Kanto: los 8 gimnasios",
    expectedLevel: 58,
    source: [S, "wikidex-gimnasio-verde"],
    note: "Azul: Pidgeot nv 60. Los gimnasios de Kanto no tienen orden fijo, así que comparten tramo",
  },
];

/**
 * Story scopes (D-029). The default one, "Solo Johto", ends with the Johto
 * League; "Johto y Kanto" adds Kanto and ends with Blue. Mt. Silver and Red need
 * the 16 badges and Oak's permission (WikiDex guide page 27), so they stay
 * outside both.
 */
export const scopes: readonly GameScope[] = [
  { id: "johto", label: "Solo Johto", until: "league" },
  { id: "kanto", label: "Johto y Kanto", until: "kanto" },
];
