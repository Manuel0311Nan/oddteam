import type { VersionOverrides } from "../../types";
import { exclusiveOf, UNOBTAINABLE_IN_BOTH } from "./shared";

const LG = "Verde Hoja" as const;

/** FireRed's differences inside the FRLG family: Leaf Green's exclusives. */
export const version: VersionOverrides = {
  game: "firered",
  unobtainable: {
    ...UNOBTAINABLE_IN_BOTH,
    sandshrew: exclusiveOf(LG),
    sandslash: exclusiveOf(LG, "Sandshrew"),
    vulpix: exclusiveOf(LG),
    ninetales: exclusiveOf(LG, "Vulpix"),
    bellsprout: exclusiveOf(LG),
    weepinbell: exclusiveOf(LG, "Bellsprout"),
    victreebel: exclusiveOf(LG, "Bellsprout"),
    slowpoke: exclusiveOf(LG),
    slowbro: exclusiveOf(LG, "Slowpoke"),
    staryu: exclusiveOf(LG),
    starmie: exclusiveOf(LG, "Staryu"),
    magmar: exclusiveOf(LG),
    pinsir: exclusiveOf(LG),
  },
};
