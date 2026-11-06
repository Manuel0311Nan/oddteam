import type { SourceId } from "../sources";
import type { Availability, TmOverride } from "../types";

/**
 * Where each Emerald TM/HM is obtained and the earliest segment in which it
 * can be had. Locations: PokéTools (cheapest source) and Smogon (requirements).
 * Gym rewards are available in the segment after that gym.
 * Game Corner coins can be bought with money in Mauville, so those TMs count.
 * The move of each number comes from PokéAPI (machines.json).
 *
 * Place names use PokéAPI's Spanish names. Places PokéAPI has only in English
 * (Casa Trampa, Casino, Centro Comercial…) are provisional translations until
 * checked on WikiDex (D-017). "Nao Abandonada" is checked on WikiDex.
 */

const S: readonly SourceId[] = ["poketools-emerald-tms", "smogon-emerald-items"];
const tm = (
  where: string,
  segment: Availability,
  repeatable = false,
  extra: Partial<Pick<TmOverride, "note" | "todo">> = {},
): TmOverride => ({ where, segment, repeatable, source: S, ...extra });

export const tms: Readonly<Record<string, TmOverride>> = {
  TM01: tm("Ruta 115 (zona norte, con Surf desde el sur)", "gym-5-6"),
  TM02: tm("Cascada Meteoro, sala trasera del sótano (Surf y Cascada)", "league"),
  TM03: tm("Arrecípolis, recompensa de Galán", "league"),
  TM04: tm("Ciudad Algaria, recompensa de Vito y Leti", "gym-7-8"),
  TM05: tm("Ruta 114, caballero con un Poochyena", "gym-3-4"),
  TM06: tm("Senda Ígnea (tras una roca de Fuerza)", "gym-4-5", false, { note: "Fuerza con la Medalla Calor" }),
  TM07: tm("Cueva Cardumen", "gym-7-8"),
  TM08: tm("Pueblo Azuliza, recompensa de Marcial", "gym-2-3"),
  TM09: tm("Ruta 104, de una persona", "pre-gym-1"),
  TM10: tm("Mercado de Ciudad Portual ($1000) · anciana de Ciudad Arborada", "gym-2-3", true),
  TM11: tm("Gruta Solar (con Surf, Ruta 120)", "gym-5-6"),
  TM12: tm("Casa Trampa, premio del 5º desafío", "gym-5-6", false, {
    todo: "Confirmar con qué medalla se abre el 5º desafío de la Casa Trampa",
  }),
  TM13: tm("Casino de Malvalona (4000 fichas) · Nao Abandonada (Llave Almacén)", "gym-2-3", true),
  TM14: tm("Centro Comercial de Ciudad Calagua, 4ª planta ($5500)", "gym-6-7", true),
  TM15: tm("Centro Comercial de Ciudad Calagua, 4ª planta ($7500)", "gym-6-7", true),
  TM16: tm("Centro Comercial de Ciudad Calagua, 4ª planta ($3000)", "gym-6-7", true),
  TM17: tm("Centro Comercial de Ciudad Calagua, 4ª planta ($3000)", "gym-6-7", true),
  TM18: tm("Nao Abandonada (Buceo en el sótano, sala 1)", "gym-7-8"),
  TM19: tm("Ruta 123 (con Surf alrededor del Monte Pírico)", "gym-6-7"),
  TM20: tm("Centro Comercial de Ciudad Calagua, 4ª planta ($3000)", "gym-6-7", true),
  TM21: tm("Pueblo Oromar (con un Pokémon poco feliz)", "gym-7-8"),
  TM22: tm("Zona Safari (Bici Carrera y Surf)", "gym-6-7"),
  TM23: tm("Cascada Meteoro", "gym-3-4", false, {
    todo: "Confirmar si la MT23 de Cascada Meteoro requiere Surf o Cascada",
  }),
  TM24: tm("Casino de Malvalona (4000 fichas) · Erico tras Malvalanova", "gym-2-3", true),
  TM25: tm("Centro Comercial de Ciudad Calagua, 4ª planta ($5500)", "gym-6-7", true),
  TM26: tm("Caverna Abisal (Buceo, Golpe Roca, Fuerza y Surf)", "gym-7-8"),
  TM27: tm("Pueblo Pardal, Prof. Cozmo tras recuperar el meteorito · Pueblo Oromar", "gym-4-5", false, {
    note: "Conservador: el meteorito se recupera en el Monte Cenizo y se entrega después",
  }),
  TM28: tm("Ruta 114, Maníaco de los fósiles", "gym-3-4"),
  TM29: tm("Casino de Malvalona (3500 fichas) · Calle Victoria", "gym-2-3", true),
  TM30: tm("Monte Pírico, 6ª planta (Surf)", "gym-6-7"),
  TM31: tm("Arrecípolis (con Surf)", "gym-7-8"),
  TM32: tm("Casino de Malvalona (1500 fichas) · Ruta 113 (oculta)", "gym-2-3", true),
  TM33: tm("Centro Comercial de Ciudad Calagua, 4ª planta ($3000)", "gym-6-7", true),
  TM34: tm("Ciudad Malvalona, recompensa de Erico", "gym-3-4"),
  TM35: tm("Casino de Malvalona (4000 fichas)", "gym-2-3", true),
  TM36: tm("Pueblo Azuliza, niña del edificio noroeste", "gym-1-2"),
  TM37: tm("Ruta 111", "gym-4-5", false, {
    note: "Conservador: se asume en el desierto (Gafas Aislantes)",
    todo: "Confirmar si la MT37 está en el desierto o en la Ruta 111 sur",
  }),
  TM38: tm("Centro Comercial de Ciudad Calagua, 4ª planta ($5500)", "gym-6-7", true),
  TM39: tm("Ciudad Férrica, recompensa de Petra", "gym-1-2"),
  TM40: tm("Ciudad Arborada, recompensa de Alana", "gym-6-7"),
  TM41: tm("Ciudad Portual, marinero de la Tienda de Batalla", "gym-2-3"),
  TM42: tm("Ciudad Petalia, recompensa de Norman", "gym-5-6"),
  TM43: tm("Ruta 111, de una persona", "gym-3-4"),
  TM44: tm("Ciudad Calagua, hombre junto a la casa del Quitamovimientos", "gym-6-7"),
  TM45: tm("Pueblo Verdegal", "gym-3-4"),
  TM46: tm("Ciudad Portual", "gym-2-3"),
  TM47: tm("Cueva Granito", "gym-2-3"),
  TM48: tm("Monte Pírico", "gym-6-7"),
  TM49: tm("S.S. Marea", "post-game"),
  TM50: tm("Pueblo Lavacalda, recompensa de Candela", "gym-4-5"),

  HM01: tm("Ciudad Férrica, casa del Cortador", "pre-gym-1", true),
  HM02: tm("Ruta 119, tras vencer al rival", "gym-5-6", true),
  HM03: tm("Ciudad Petalia, padre de Wally tras vencer a Norman", "gym-5-6", true),
  HM04: tm("Túnel Fervergal, tras usar Golpe Roca", "gym-3-4", true),
  HM05: tm("Cueva Granito, montañero de la 1ª planta", "gym-2-3", true),
  HM06: tm("Ciudad Malvalona, casa a la derecha del Centro Pokémon", "gym-2-3", true),
  HM07: tm("Arrecípolis, Plubio tras despertar a Rayquaza", "gym-7-8", true),
  HM08: tm("Ciudad Algaria, Máximo tras el Centro Espacial", "gym-7-8", true),
};
