import type { FamilyOverrides } from "../types";
import { bosses } from "./bosses";
import { evolutionChoices, evolutionItems } from "./evolution-items";
import { conditions, methods } from "./key-items";
import { locations } from "./locations";
import { scopes, segments } from "./segments";
import { specialEncounters } from "./special-encounters";
import { tms } from "./tms";

/**
 * HeartGold and SoulSilver share story, map and bosses; what changes between them
 * (exclusives, Lugia/Ho-Oh timing) goes in versions/{game}.ts (D-009).
 * The story goes on after the Johto League, so the family has two scopes (D-029).
 */
export const family: FamilyOverrides = {
  family: "hgss",
  versions: ["heartgold", "soulsilver"],
  segments,
  scopes,
  locations,
  methods,
  conditions,
  specialEncounters,
  evolutionItems,
  evolutionChoices,
  bosses,
  tms,
};
