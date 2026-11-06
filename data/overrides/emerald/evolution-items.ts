import type { EvolutionChoice, EvolutionItemOverride } from "../types";

/**
 * Where the evolution items used in Emerald are obtained, and the earliest
 * segment in which one can be had. Source: Smogon item locations guide; the
 * segment follows the story requirements it lists (Strength, Dive…).
 */
export const evolutionItems: Readonly<Record<string, EvolutionItemOverride>> = {
  "moon-stone": {
    where: "Cascada Meteoro (planta principal)",
    segment: "gym-3-4",
    source: "smogon-emerald-items",
  },
  "fire-stone": {
    where: "Senda Ígnea (tras una roca de Fuerza) · Ruta 124 (cazatesoros, Parcela Roja)",
    segment: "gym-4-5",
    source: ["smogon-emerald-items", "dittobase-emerald-hms"],
    note: "Fuerza se usa con la Medalla Calor (4º gimnasio)",
  },
  "thunder-stone": {
    where: "Malvalanova (junto al generador) · Ruta 124 (Parcela Amarilla)",
    segment: "gym-5-6",
    source: "smogon-emerald-items",
  },
  "leaf-stone": {
    where: "Ruta 119 (rincón junto a una pequeña cascada) · Ruta 124 (Parcela Verde)",
    segment: "gym-5-6",
    source: "smogon-emerald-items",
  },
  "water-stone": {
    where: "Ruta 124 (cazatesoros, Parcela Azul) · Nao Abandonada (requiere Buceo)",
    segment: "gym-6-7",
    source: "smogon-emerald-items",
    note: "La Ruta 124 se alcanza en la Parte 14; las parcelas se encuentran buceando",
    todo: "Las parcelas se encuentran bajo el agua: confirmar si hay alguna antes de Buceo; si no, pasar a gym-7-8",
  },
  "sun-stone": {
    where: "Centro Espacial de Ciudad Algaria (marinero) · equipada en Solrock salvaje",
    segment: "gym-7-8",
    source: "smogon-emerald-items",
    note: "Conservador: tras el suceso del Centro Espacial (después del 7º gimnasio)",
  },
  "dragon-scale": {
    where: "Equipada en Bagon y Horsea salvajes",
    segment: "gym-7-8",
    source: "smogon-emerald-items",
    note: "Conservador: Horsea con Supercaña en las Rutas 132–134 (Parte 17)",
  },
  "deep-sea-tooth": {
    where: "Capitán Stern, a cambio del Escáner (Nao Abandonada); se elige uno",
    segment: "gym-7-8",
    source: "smogon-emerald-items",
    note: "El Escáner está en una zona del Nao Abandonada que requiere Buceo",
  },
  "deep-sea-scale": {
    where: "Capitán Stern, a cambio del Escáner (Nao Abandonada); se elige uno",
    segment: "gym-7-8",
    source: "smogon-emerald-items",
    note: "El Escáner está en una zona del Nao Abandonada que requiere Buceo",
  },
};

/**
 * PokéAPI lists methods from every game; these pick the one valid in Emerald
 * (report.md, "Con varios métodos posibles").
 */
export const evolutionChoices: readonly EvolutionChoice[] = [
  {
    from: "voltorb",
    to: "electrode",
    keep: { trigger: "level-up", minLevel: 30 },
    source: "pokeapi",
    note: "La evolución con Piedra Hoja es la de la forma de Hisui (Gen 8)",
    todo: "Confirmar con una fuente de Gen 3",
  },
  {
    from: "cyndaquil",
    to: "quilava",
    keep: { trigger: "level-up", minLevel: 14 },
    source: "pokeapi",
    note: "El nivel 17 corresponde a Leyendas Pokémon: Arceus",
    todo: "Confirmar con una fuente de Gen 3",
  },
  {
    from: "meowth",
    to: "persian",
    keep: { trigger: "level-up", minLevel: 28 },
    source: "pokeapi",
    note: "La evolución por amistad es la de Meowth de Alola (Gen 7)",
    todo: "Confirmar con una fuente de Gen 3",
  },
];
