import type { SegmentOverride } from "../types";

/**
 * Story segments of Platinum, closed by each gym and the League.
 * expectedLevel = level of the boss's ace − 2 (specs/02); aces from bosses.ts.
 * Gym order (Bulbapedia walkthrough, Parts 3, 4, 6, 8, 10, 13, 15, 19):
 * Roark, Gardenia, Fantina, Maylene, Crasher Wake, Byron, Candice, Volkner.
 */
const S = ["bulbapedia-platinum-walkthrough", "serebii-platinum-gyms"] as const;

export const segments: readonly SegmentOverride[] = [
  { id: "pre-gym-1", label: "Antes del 1er gimnasio", expectedLevel: 12, source: S, note: "Roco: Cranidos nv 14" },
  { id: "gym-1-2", label: "Entre el 1er y el 2º gimnasio", expectedLevel: 20, source: S, note: "Gardenia: Roserade nv 22" },
  { id: "gym-2-3", label: "Entre el 2º y el 3er gimnasio", expectedLevel: 24, source: S, note: "Fantina: Mismagius nv 26" },
  { id: "gym-3-4", label: "Entre el 3er y el 4º gimnasio", expectedLevel: 30, source: S, note: "Brega: Lucario nv 32" },
  { id: "gym-4-5", label: "Entre el 4º y el 5º gimnasio", expectedLevel: 35, source: S, note: "Mananti: Floatzel nv 37" },
  { id: "gym-5-6", label: "Entre el 5º y el 6º gimnasio", expectedLevel: 39, source: S, note: "Acerón: Bastiodon nv 41" },
  { id: "gym-6-7", label: "Entre el 6º y el 7º gimnasio", expectedLevel: 42, source: S, note: "Inverna: Froslass nv 44" },
  { id: "gym-7-8", label: "Entre el 7º y el 8º gimnasio", expectedLevel: 48, source: S, note: "Lectro: Electivire nv 50" },
  {
    id: "league",
    label: "Calle Victoria y Liga Pokémon",
    expectedLevel: 60,
    source: ["bulbapedia-platinum-walkthrough", "wikidex-liga-sinnoh"],
    note: "Cintia: Garchomp nv 62",
  },
];
