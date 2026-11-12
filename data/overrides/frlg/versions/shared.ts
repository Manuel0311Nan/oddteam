import type { Sourced } from "../../types";

/** Pieces both FRLG versions share in their versions/{game}.ts. */

/** Exclusive of the other version (D-028). `from` names the base form when it is an evolution. */
export const exclusiveOf = (other: "Rojo Fuego" | "Verde Hoja", from?: string): Sourced => ({
  source: "pokeapi",
  note: from
    ? `Evoluciona de ${from}, exclusivo de ${other} (D-028)`
    : `No sale en esta versión: es exclusivo de ${other} (D-028)`,
});

/** Not obtainable playing either version. */
export const UNOBTAINABLE_IN_BOTH: Readonly<Record<string, Sourced>> = {
  porygon: { source: ["pokeapi", "wikidex-guia-rfvh"], note: "Solo como premio del Casino de Azulona, que no cuenta (D-020)" },
  mew: { source: "pokeapi", note: "Singular de evento: no se obtiene jugando" },
};
