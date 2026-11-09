import type { VersionOverrides } from "../../types";

/**
 * Platinum is the only version of its family, so it has no differences.
 * Dex species with no known way to get them (report.md, section 4) are reviewed here.
 */
export const version: VersionOverrides = {
  game: "platinum",
  unobtainable: {
    murkrow: { source: "pokeapi", note: "No se captura en Platino: solo llega transferido desde otro juego (D-028)" },
    honchkrow: { source: "pokeapi", note: "Evoluciona de Murkrow, que no se captura en Platino (D-028)" },
    misdreavus: { source: "pokeapi", note: "No se captura en Platino: solo llega transferido desde otro juego (D-028)" },
    mismagius: { source: "pokeapi", note: "Evoluciona de Misdreavus, que no se captura en Platino (D-028)" },
    glameow: { source: "pokeapi", note: "No se captura en Platino: solo llega transferido desde otro juego (D-028)" },
    purugly: { source: "pokeapi", note: "Evoluciona de Glameow, que no se captura en Platino (D-028)" },
    stunky: { source: "pokeapi", note: "No se captura en Platino: solo llega transferido desde otro juego (D-028)" },
    skuntank: { source: "pokeapi", note: "Evoluciona de Stunky, que no se captura en Platino (D-028)" },
    elekid: { source: "pokeapi", note: "Bebé: solo por crianza de Electabuzz, que no cuenta" },
    magby: { source: "pokeapi", note: "Bebé: solo por crianza de Magmar, que no cuenta" },
    electivire: {
      source: "pokeapi",
      note: "Electabuzz evoluciona intercambiándolo con Electrizador: solo con la opción de evoluciones por intercambio",
    },
    manaphy: { source: "pokeapi", note: "Solo desde Pokémon Ranger (otro juego): no se obtiene jugando Platino" },
  },
};
