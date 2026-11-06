import type { FamilyOverrides } from "../types";
import { bosses } from "./bosses";
import { evolutionChoices, evolutionItems } from "./evolution-items";
import { conditions, methods } from "./key-items";
import { locations } from "./locations";
import { segments } from "./segments";
import { specialEncounters } from "./special-encounters";
import { tms } from "./tms";

/** Emerald is a family of its own: leaders, champion and areas differ from Ruby/Sapphire (D-009). */
export const family: FamilyOverrides = {
  family: "emerald",
  versions: ["emerald"],
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
