import type { VersionOverrides } from "../../types";

/**
 * Emerald is the only version of its family, so it has no differences.
 * Dex species with no known way to get them (report.md, section 4) are
 * reviewed here one by one.
 */
export const version: VersionOverrides = {
  game: "emerald",
  unobtainable: {
    lunatone: {
      source: "pokeapi",
      note: "Sin encuentros en Esmeralda en PokéAPI (es exclusivo de Zafiro en Rubí/Zafiro)",
      todo: "Confirmar que en Esmeralda solo se obtiene por intercambio",
    },
    surskit: { source: "pokeapi", note: "Sin encuentros en PokéAPI", todo: "Revisar: ¿solo masivas en Esmeralda?" },
    masquerain: { source: "pokeapi", note: "Evoluciona de Surskit", todo: "Depende de Surskit" },
    azurill: { source: "pokeapi", note: "Bebé: huevo de Marill con Incienso Marino", todo: "Revisar si se considera obtenible por crianza" },
    meditite: { source: "pokeapi", note: "Sin encuentros en PokéAPI", todo: "Revisar si hay encuentros en Esmeralda" },
    medicham: { source: "pokeapi", note: "Evoluciona de Meditite", todo: "Depende de Meditite" },
    roselia: { source: "pokeapi", note: "Sin encuentros en PokéAPI", todo: "Revisar: ¿solo masivas en Esmeralda?" },
    zangoose: { source: "pokeapi", note: "Sin encuentros en PokéAPI", todo: "Revisar si es exclusivo de otra versión en Esmeralda" },
    igglybuff: { source: "pokeapi", note: "Bebé: huevo de Jigglypuff", todo: "Revisar si se considera obtenible por crianza" },
    pichu: { source: "pokeapi", note: "Bebé: huevo de Pikachu", todo: "Revisar si se considera obtenible por crianza" },
    jirachi: { source: "pokeapi", note: "Singular de evento", todo: "Confirmar: no obtenible jugando" },
    deoxys: { source: "pokeapi", note: "Singular de evento", todo: "Confirmar: no obtenible jugando" },
  },
};
