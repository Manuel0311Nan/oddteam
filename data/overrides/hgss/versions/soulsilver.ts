import type { Sourced, VersionOverrides } from "../../types";

const hgOnly = (note = "No sale en Plata SoulSilver: es exclusivo de Oro HeartGold (D-028)"): Sourced => ({ source: "pokeapi", note });
const baby = (parent: string): Sourced => ({ source: "pokeapi", note: `Bebé: solo por crianza de ${parent}, que no cuenta` });
const fossil = (item: string): Sourced => ({
  source: "bulbapedia-fossils",
  note: `Del ${item}, que sale al azar rompiendo rocas en las Ruinas Alfa: no cuenta (D-028)`,
});
const event = (): Sourced => ({ source: "bulbapedia-hgss-events", note: "Singular de evento: no se obtiene jugando" });

/**
 * SoulSilver's differences inside the HGSS family. Dex species with no known way
 * to get them (report.md, section 4) are reviewed here.
 */
export const version: VersionOverrides = {
  game: "soulsilver",
  unobtainable: {
    spinarak: hgOnly(),
    ariados: hgOnly("Evoluciona de Spinarak, exclusivo de Oro HeartGold (D-028)"),
    growlithe: hgOnly(),
    arcanine: hgOnly("Evoluciona de Growlithe, exclusivo de Oro HeartGold (D-028)"),
    mankey: hgOnly(),
    primeape: hgOnly("Evoluciona de Mankey, exclusivo de Oro HeartGold (D-028)"),
    gligar: hgOnly(),
    phanpy: hgOnly(),
    donphan: hgOnly("Evoluciona de Phanpy, exclusivo de Oro HeartGold (D-028)"),
    mantine: hgOnly(),
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
  },
};
