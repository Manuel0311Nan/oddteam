import type { VersionOverrides } from "../../types";
import { embeddedTowerRoom, exclusiveOf, UNOBTAINABLE_IN_BOTH } from "./shared";

const G = "wikidex-guia-hgss" as const;
const HG = "Oro HeartGold" as const;

/**
 * SoulSilver's differences inside the HGSS family. Dex species with no known way
 * to get them (report.md, section 4) are reviewed here.
 * Lugia is caught in the story, after the Kimono Girls (guide p. 12); Ho-Oh needs
 * the Rainbow Wing, which the old man of Pewter City gives in Kanto (p. 20).
 */
export const version: VersionOverrides = {
  game: "soulsilver",
  locations: { "embedded-tower-groundon-room": embeddedTowerRoom("Groudon") },
  specialEncounters: [
    { species: "lugia", area: "whirl-islands-b3f", method: "static", unique: true, source: G, note: "p. 12: tras el ritual de las chicas Kimono, con el Ala plateada" },
    {
      species: "ho-oh",
      area: "bell-tower-roof",
      method: "static",
      segment: "kanto",
      unique: true,
      source: G,
      note: "p. 20: en Plata SoulSilver el Ala arcoíris la da el anciano de Ciudad Plateada",
    },
    { species: "latios", area: "roaming-johto-area", method: "roaming-grass", unique: true, source: "pokeapi", note: "Vaga tras hablar con la Copiona" },
  ],
  unobtainable: {
    ...UNOBTAINABLE_IN_BOTH,
    spinarak: exclusiveOf(HG),
    ariados: exclusiveOf(HG, "Spinarak"),
    growlithe: exclusiveOf(HG),
    arcanine: exclusiveOf(HG, "Growlithe"),
    mankey: exclusiveOf(HG),
    primeape: exclusiveOf(HG, "Mankey"),
    gligar: exclusiveOf(HG),
    phanpy: exclusiveOf(HG),
    donphan: exclusiveOf(HG, "Phanpy"),
    mantine: exclusiveOf(HG),
  },
};
