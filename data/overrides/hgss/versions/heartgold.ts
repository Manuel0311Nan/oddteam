import type { VersionOverrides } from "../../types";
import { embeddedTowerRoom, exclusiveOf, UNOBTAINABLE_IN_BOTH } from "./shared";

const G = "wikidex-guia-hgss" as const;
const SS = "Plata SoulSilver" as const;

/**
 * HeartGold's differences inside the HGSS family. Dex species with no known way
 * to get them (report.md, section 4) are reviewed here.
 * Ho-Oh is caught in the story, after the Kimono Girls (guide p. 12); Lugia needs
 * the Silver Wing, which the old man of Pewter City gives in Kanto (p. 20).
 */
export const version: VersionOverrides = {
  game: "heartgold",
  locations: { "embedded-tower-kyogre-room": embeddedTowerRoom("Kyogre") },
  specialEncounters: [
    { species: "ho-oh", area: "bell-tower-roof", method: "static", unique: true, source: G, note: "p. 12: en la azotea de la Torre Campana, tras el ritual de las chicas Kimono" },
    {
      species: "lugia",
      area: "whirl-islands-b3f",
      method: "static",
      segment: "kanto",
      unique: true,
      source: G,
      note: "p. 20: en Oro HeartGold el Ala plateada la da el anciano de Ciudad Plateada",
    },
    { species: "latias", area: "roaming-johto-area", method: "roaming-grass", unique: true, source: "pokeapi", note: "Vaga tras hablar con la Copiona" },
  ],
  unobtainable: {
    ...UNOBTAINABLE_IN_BOTH,
    ledyba: exclusiveOf(SS),
    ledian: exclusiveOf(SS, "Ledyba"),
    vulpix: exclusiveOf(SS),
    ninetales: exclusiveOf(SS, "Vulpix"),
    meowth: exclusiveOf(SS),
    persian: exclusiveOf(SS, "Meowth"),
    delibird: exclusiveOf(SS),
    teddiursa: exclusiveOf(SS),
    ursaring: exclusiveOf(SS, "Teddiursa"),
    skarmory: exclusiveOf(SS),
  },
};
