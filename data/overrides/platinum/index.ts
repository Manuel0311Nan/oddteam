import type { FamilyOverrides } from "../types";
import { bosses } from "./bosses";
import { evolutionChoices, evolutionItems } from "./evolution-items";
import { conditions, methods } from "./key-items";
import { locations } from "./locations";
import { segments } from "./segments";
import { specialEncounters } from "./special-encounters";
import { tms } from "./tms";

/** Platinum is a family of its own: story, gym order and leaders' teams differ from Diamond/Pearl (D-009). */
export const family: FamilyOverrides = {
  family: "platinum",
  versions: ["platinum"],
  segments,
  locations,
  methods,
  conditions,
  specialEncounters,
  evolutionItems,
  evolutionChoices,
  bosses,
  tms,
};
