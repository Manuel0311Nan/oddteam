import type { VersionOverrides } from "../../types";
import { exclusiveOf, UNOBTAINABLE_IN_BOTH } from "./shared";

const FR = "Rojo Fuego" as const;

/** LeafGreen's differences inside the FRLG family: FireRed's exclusives. */
export const version: VersionOverrides = {
  game: "leafgreen",
  unobtainable: {
    ...UNOBTAINABLE_IN_BOTH,
    ekans: exclusiveOf(FR),
    arbok: exclusiveOf(FR, "Ekans"),
    oddish: exclusiveOf(FR),
    gloom: exclusiveOf(FR, "Oddish"),
    vileplume: exclusiveOf(FR, "Oddish"),
    psyduck: exclusiveOf(FR),
    golduck: exclusiveOf(FR, "Psyduck"),
    growlithe: exclusiveOf(FR),
    arcanine: exclusiveOf(FR, "Growlithe"),
    shellder: exclusiveOf(FR),
    cloyster: exclusiveOf(FR, "Shellder"),
    scyther: exclusiveOf(FR),
    electabuzz: exclusiveOf(FR),
  },
};
