import type { SegmentOverride } from "../types";

/**
 * Story segments of Emerald, closed by each gym and the League.
 * expectedLevel = level of the boss's ace − 2 (specs/02); aces from bosses.ts.
 * Order of gyms: Bulbapedia walkthrough (Parts 2, 3, 5, 7, 8, 11, 14, 17, 19).
 */
export const segments: readonly SegmentOverride[] = [
  { id: "pre-gym-1", label: "Antes del 1er gimnasio", expectedLevel: 13, source: "serebii-emerald-gyms", note: "Roxanne: Nosepass nv 15" },
  { id: "gym-1-2", label: "Entre el 1er y el 2º gimnasio", expectedLevel: 17, source: "serebii-emerald-gyms", note: "Brawly: Makuhita nv 19" },
  { id: "gym-2-3", label: "Entre el 2º y el 3er gimnasio", expectedLevel: 22, source: "serebii-emerald-gyms", note: "Wattson: Manectric nv 24" },
  { id: "gym-3-4", label: "Entre el 3er y el 4º gimnasio", expectedLevel: 27, source: "serebii-emerald-gyms", note: "Flannery: Torkoal nv 29" },
  { id: "gym-4-5", label: "Entre el 4º y el 5º gimnasio", expectedLevel: 29, source: "serebii-emerald-gyms", note: "Norman: Slaking nv 31" },
  { id: "gym-5-6", label: "Entre el 5º y el 6º gimnasio", expectedLevel: 31, source: "serebii-emerald-gyms", note: "Winona: Altaria nv 33" },
  { id: "gym-6-7", label: "Entre el 6º y el 7º gimnasio", expectedLevel: 40, source: "serebii-emerald-gyms", note: "Tate y Liza: Lunatone/Solrock nv 42" },
  { id: "gym-7-8", label: "Entre el 7º y el 8º gimnasio", expectedLevel: 44, source: "serebii-emerald-gyms", note: "Juan: Kingdra nv 46" },
  { id: "league", label: "Calle Victoria y Liga Pokémon", expectedLevel: 56, source: "serebii-emerald-elite", note: "Plubio (Wallace): Milotic nv 58" },
];
