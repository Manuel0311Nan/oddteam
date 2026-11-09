import type { EvolutionChoice, EvolutionItemOverride } from "../types";

/**
 * Where the evolution items used in Platinum are obtained, and the earliest
 * segment in which one can be had. Cross-checked route by route with the WikiDex
 * Platinum guide (pages 2–17) and, for items the guide does not mention, with
 * each item's WikiDex page and the Bulbapedia walkthrough.
 * Only fixed field locations count: digging in the Underground and items held
 * by wild Pokémon are random, so they are noted but not used (conservative, D-016).
 */
const W = "bulbapedia-platinum-walkthrough" as const;
const G = "wikidex-guia-platino" as const;

export const evolutionItems: Readonly<Record<string, EvolutionItemOverride>> = {
  "fire-stone": { where: "Ruinas Sosiego (salas con una sola roca)", segment: "gym-3-4", source: [G, W], note: "Guía WikiDex p. 10 y Bulbapedia Parte 7; también en la Forja Fuego" },
  "water-stone": { where: "Ruinas Sosiego (salas con una sola roca)", segment: "gym-3-4", source: [G, W], note: "Guía WikiDex p. 10 y Bulbapedia Parte 7" },
  "thunder-stone": { where: "Ruinas Sosiego (salas con una sola roca)", segment: "gym-3-4", source: [G, W], note: "Guía WikiDex p. 10 y Bulbapedia Parte 7; también en Ciudad Marina" },
  "oval-stone": { where: "Torre Sagrada, 1ª planta", segment: "gym-3-4", source: "wikidex-piedra-oval", note: "También en el Subsuelo y equipada en Happiny o Chansey salvajes" },
  "razor-fang": { where: "Ruta 214", segment: "gym-4-5", source: W, note: "Bulbapedia Parte 9 (la guía de WikiDex no lo menciona)" },
  magmarizer: { where: "Ruta 214", segment: "gym-4-5", source: W, note: "Bulbapedia Parte 9 (la guía de WikiDex no lo menciona)" },
  "up-grade": { where: "Edificio Galaxia de Ciudad Vetusta", segment: "gym-2-3", source: G, note: "Guía WikiDex p. 10 (nota del Porygon); el edificio se asalta tras el 2º gimnasio" },
  "dawn-stone": { where: "Ruta 212 (con el Zahorí)", segment: "gym-5-6", source: [G, W], note: "Guía WikiDex p. 11 y Bulbapedia Parte 10" },
  "kings-rock": { where: "Pueblo Caelestis (con el Zahorí)", segment: "gym-5-6", source: G, note: "Guía WikiDex p. 12" },
  "moon-stone": {
    where: "Ciudad Vetusta, extremo noreste (con Surf) · cima del Monte Corona",
    segment: "gym-5-6",
    source: "wikidex-piedra-lunar",
    note: "Surf se usa tras el 5º gimnasio. También en el Subsuelo y equipada en Clefairy salvajes",
  },
  "leaf-stone": {
    where: "Prado Aromaflor, entrando desde la Forja Fuego",
    segment: "gym-5-6",
    source: ["wikidex-piedra-hoja", "bulbapedia-fuego-ironworks"],
    note: "A la Forja Fuego se llega con Surf. También en el Subsuelo",
  },
  electirizer: { where: "Valle Eólico (con Surf)", segment: "gym-5-6", source: "wikidex-electrizador", note: "También equipado en Electabuzz salvajes (5 %)" },
  "shiny-stone": { where: "Isla Hierro (zona final)", segment: "gym-5-6", source: W, note: "Bulbapedia Parte 13 (la guía de WikiDex no lo menciona)" },
  protector: { where: "Isla Hierro (sótano, lado oeste)", segment: "gym-5-6", source: W, note: "Bulbapedia Parte 13 (la guía de WikiDex no lo menciona)" },
  "metal-coat": { where: "Isla Hierro", segment: "gym-5-6", source: W, note: "Bulbapedia Parte 13 (la guía de WikiDex no lo menciona)" },
  "reaper-cloth": { where: "Camino al Lago Agudeza, subiendo con Treparrocas desde la Orilla Agudeza", segment: "gym-7-8", source: [G, W], note: "Guía WikiDex p. 14 y Bulbapedia Parte 15" },
  "dusk-stone": { where: "Cuartel Galaxia de Ciudad Rocavelo, junto a la puerta del almacén", segment: "gym-7-8", source: G, note: "Guía WikiDex p. 14" },
  "razor-claw": { where: "Cuartel Galaxia de Ciudad Rocavelo, sala del combate con Helio (oculto)", segment: "gym-7-8", source: "wikidex-garra-afilada", note: "También en la Calle Victoria" },
  "sun-stone": {
    where: "Orilla Valor, cima de las colinas (con Treparrocas) · Monte Corona, 5ª planta (con Golpe Roca)",
    segment: "gym-7-8",
    source: "wikidex-piedra-solar",
    note: "Treparrocas se usa tras el 7º gimnasio y el interior del Monte Corona es de la Parte 16. También en el Subsuelo",
  },
  "dubious-disc": { where: "Cuartel Galaxia de Ciudad Rocavelo", segment: "gym-7-8", source: W, note: "Bulbapedia Parte 15 (la guía de WikiDex no lo menciona)" },
  "dragon-scale": {
    where: "Solo equipada en Horsea, Seadra, Dratini o Dragonair salvajes (5 %)",
    segment: "excluded",
    source: "wikidex-escama-dragon",
    note: "No tiene ubicación fija en Platino; un objeto equipado al 5 % no cuenta",
  },
};

/**
 * PokéAPI lists methods from every game; these pick the one valid in Platinum
 * (report.md, "Con varios métodos posibles"). Place-based evolutions carry the
 * segment of the place.
 */
export const evolutionChoices: readonly EvolutionChoice[] = [
  { from: "rattata", to: "raticate", keep: { trigger: "level-up", minLevel: 20 }, source: "pokeapi", note: "La variante nocturna es la de Alola (Gen 7)" },
  { from: "meowth", to: "persian", keep: { trigger: "level-up", minLevel: 28 }, source: "pokeapi", note: "La evolución por amistad es la de Alola (Gen 7)" },
  { from: "voltorb", to: "electrode", keep: { trigger: "level-up", minLevel: 30 }, source: "pokeapi", note: "La Piedra Hoja es la de Hisui (Gen 8)" },
  { from: "cubone", to: "marowak", keep: { trigger: "level-up", minLevel: 28 }, source: "pokeapi", note: "La variante nocturna es la de Alola (Gen 7)" },
  {
    from: "eevee",
    to: "leafeon",
    keep: { trigger: "level-up" },
    segment: "gym-1-2",
    source: ["pokeapi", W],
    note: "Subir de nivel junto a la Roca Musgo del Bosque Vetusto (Parte 4)",
  },
  {
    from: "eevee",
    to: "glaceon",
    keep: { trigger: "level-up" },
    segment: "gym-6-7",
    source: ["pokeapi", W],
    note: "Subir de nivel junto a la Roca Hielo de la Ruta 217 (Parte 14)",
  },
  {
    from: "magneton",
    to: "magnezone",
    keep: { trigger: "level-up" },
    segment: "gym-2-3",
    source: "pokeapi",
    note: "Subir de nivel en el Monte Corona (entrada de la Ruta 207, Parte 6)",
  },
  {
    from: "nosepass",
    to: "probopass",
    keep: { trigger: "level-up" },
    segment: "gym-2-3",
    source: "pokeapi",
    note: "Subir de nivel en el Monte Corona (entrada de la Ruta 207, Parte 6)",
  },
];
