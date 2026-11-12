import type { LocationOverride, Sourced } from "../../types";

/**
 * Pieces both HGSS versions share in their versions/{game}.ts: what is not
 * obtainable in either (babies, fossils, Porygon, events), how the other version's
 * exclusives are noted, and the Embedded Tower room that only exists in one.
 */

/** Exclusive of the other version (D-028). `from` names the base form when it is an evolution. */
export const exclusiveOf = (other: "Oro HeartGold" | "Plata SoulSilver", from?: string): Sourced => ({
  source: "pokeapi",
  note: from
    ? `Evoluciona de ${from}, exclusivo de ${other} (D-028)`
    : `No sale en esta versión: es exclusivo de ${other} (D-028)`,
});

const baby = (parent: string): Sourced => ({ source: "pokeapi", note: `Bebé: solo por crianza de ${parent}, que no cuenta` });
const fossil = (item: string): Sourced => ({
  source: "bulbapedia-fossils",
  note: `Del ${item}, que sale al azar rompiendo rocas en las Ruinas Alfa: no cuenta (D-028)`,
});
const event = (): Sourced => ({ source: "bulbapedia-hgss-events", note: "Singular de evento: no se obtiene jugando" });

/** Not obtainable playing either version. */
export const UNOBTAINABLE_IN_BOTH: Readonly<Record<string, Sourced>> = {
  pichu: baby("Pikachu"),
  cleffa: baby("Clefairy"),
  igglybuff: baby("Jigglypuff"),
  magby: baby("Magmar"),
  smoochum: baby("Jynx"),
  elekid: baby("Electabuzz"),
  porygon: { source: ["pokeapi", "wikidex-guia-hgss"], note: "Solo como premio del Casino de Ciudad Azulona, que no cuenta (D-020)" },
  porygon2: { source: "pokeapi", note: "Evoluciona de Porygon, que solo sale en el Casino (D-020)" },
  omanyte: fossil("Fósil Hélix"),
  omastar: fossil("Fósil Hélix"),
  kabuto: fossil("Fósil Domo"),
  kabutops: fossil("Fósil Domo"),
  aerodactyl: fossil("Ámbar Viejo"),
  mew: event(),
  celebi: event(),
};

/** Embedded Tower room of the version's Hoenn legendary (post-game in both). */
export const embeddedTowerRoom = (legendary: "Groudon" | "Kyogre"): LocationOverride => ({
  segment: "post-game",
  name: "Torre Oculta",
  note: `${legendary} y Rayquaza: evento tras capturar a Ho-Oh y Lugia (post-juego)`,
  source: ["wikidex-guia-hgss", "wikidex-johto"],
});
