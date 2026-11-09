/**
 * Families and versions shown on the home page (specs/06, "Portada").
 * Only labels: whether a version exists comes from data/generated/games.json.
 * Version names are the official Spanish titles.
 */

import type { FamilySlug, GameSlug } from "@/lib/types";

export type CatalogFamily = {
  slug: FamilySlug;
  title: string;
  region: string;
  generation: number;
  versions: readonly { slug: GameSlug; name: string }[];
};

export const CATALOG: readonly CatalogFamily[] = [
  { slug: "emerald", title: "Esmeralda", region: "Hoenn", generation: 3, versions: [{ slug: "emerald", name: "Esmeralda" }] },
  { slug: "platinum", title: "Platino", region: "Sinnoh", generation: 4, versions: [{ slug: "platinum", name: "Platino" }] },
  {
    slug: "hgss",
    title: "HeartGold y SoulSilver",
    region: "Johto",
    generation: 4,
    versions: [
      { slug: "heartgold", name: "HeartGold" },
      { slug: "soulsilver", name: "SoulSilver" },
    ],
  },
  {
    slug: "b2w2",
    title: "Negro 2 y Blanco 2",
    region: "Teselia",
    generation: 5,
    versions: [
      { slug: "black-2", name: "Negro 2" },
      { slug: "white-2", name: "Blanco 2" },
    ],
  },
];
