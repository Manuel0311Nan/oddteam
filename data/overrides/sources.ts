/**
 * Sources cited by the overrides (D-017). Consulted on 2026-11-06.
 *
 * Hierarchy:
 *  1. PokéAPI: truth for everything it has.
 *  2. Bulbapedia: main source for what PokéAPI lacks (story, bosses, TMs, items).
 *  3. Serebii and WikiDex: second sources to cross-check. WikiDex is the main
 *     source for Spanish names that PokéAPI does not have.
 * Nothing else. Entries citing other sites are pending re-verification
 * against these (see their `todo` once reviewed).
 */
export const SOURCES = {
  pokeapi: "PokéAPI (capa data/generated/{game}/pokeapi)",
  "bulbapedia-emerald-walkthrough":
    "https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Emerald",
  "bulbapedia-emerald-part-8":
    "https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Emerald/Part_8",
  "serebii-emerald-gyms": "https://serebii.net/emerald/gym.shtml",
  "serebii-emerald-elite": "https://www.serebii.net/emerald/elite.shtml",
  "pokemondb-emerald-gyms": "https://pokemondb.net/emerald/gymleaders-elitefour",
  "smogon-emerald-items": "https://www.smogon.com/ingame/guides/emerald_itemlocations",
  "poketools-emerald-tms": "https://www.poketools.com/emerald/tms",
  "dittobase-emerald-hms": "https://www.dittobase.com/emerald/hms",
  "dittobase-emerald-old-rod": "https://www.dittobase.com/emerald/items/old-rod",
  "dittobase-emerald-good-rod": "https://www.dittobase.com/emerald/items/good-rod",
  "dittobase-emerald-super-rod": "https://www.dittobase.com/emerald/items/super-rod",
  "dittobase-emerald-devon-scope": "https://www.dittobase.com/emerald/items/devon-scope",
  "serebii-feebas": "https://serebii.net/games/feebas.shtml",
  "wikidex-nao-abandonada": "https://www.wikidex.net/wiki/Nao_Abandonada",
} as const;

export type SourceId = keyof typeof SOURCES;
