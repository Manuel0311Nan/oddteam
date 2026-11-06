import type { BossOverride } from "../types";

type Mon = BossOverride["team"][number];
const mon = (species: string, level: number, moves: readonly string[], heldItem?: string): Mon =>
  heldItem ? { species, level, moves, heldItem } : { species, level, moves };

/**
 * Emerald gym leaders, Elite Four and Champion: teams, levels, held items and
 * moves as listed by Serebii (cross-checked with PokémonDB for levels).
 * A gym battle closes its segment; the TM reward is in tms.ts.
 * Spanish names in `name`; English in `note`.
 */
export const bosses: readonly BossOverride[] = [
  {
    id: "gym-1", name: "Petra", kind: "gym", segment: "pre-gym-1", rewardTm: "TM39",
    note: "Roxanne · Gimnasio de Ciudad Férrica · Roca",
    source: ["serebii-emerald-gyms", "pokemondb-emerald-gyms"],
    team: [
      mon("geodude", 12, ["tackle", "defense-curl", "rock-throw", "rock-tomb"]),
      mon("geodude", 12, ["tackle", "defense-curl", "rock-throw", "rock-tomb"]),
      mon("nosepass", 15, ["block", "harden", "tackle", "rock-tomb"], "oran-berry"),
    ],
  },
  {
    id: "gym-2", name: "Marcial", kind: "gym", segment: "gym-1-2", rewardTm: "TM08",
    note: "Brawly · Gimnasio de Pueblo Azuliza · Lucha",
    source: ["serebii-emerald-gyms", "pokemondb-emerald-gyms"],
    team: [
      mon("machop", 16, ["karate-chop", "low-kick", "seismic-toss", "bulk-up"]),
      mon("meditite", 16, ["focus-punch", "light-screen", "reflect", "bulk-up"]),
      mon("makuhita", 19, ["arm-thrust", "vital-throw", "reversal", "bulk-up"], "sitrus-berry"),
    ],
  },
  {
    id: "gym-3", name: "Erico", kind: "gym", segment: "gym-2-3", rewardTm: "TM34",
    note: "Wattson · Gimnasio de Ciudad Malvalona · Eléctrico",
    source: ["serebii-emerald-gyms", "pokemondb-emerald-gyms"],
    team: [
      mon("voltorb", 20, ["rollout", "spark", "self-destruct", "shock-wave"]),
      mon("electrike", 20, ["shock-wave", "leer", "quick-attack", "howl"]),
      mon("magneton", 22, ["supersonic", "shock-wave", "thunder-wave", "sonic-boom"]),
      mon("manectric", 24, ["quick-attack", "thunder-wave", "shock-wave", "howl"], "sitrus-berry"),
    ],
  },
  {
    id: "gym-4", name: "Candela", kind: "gym", segment: "gym-3-4", rewardTm: "TM50",
    note: "Flannery · Gimnasio de Pueblo Lavacalda · Fuego",
    source: ["serebii-emerald-gyms", "pokemondb-emerald-gyms"],
    team: [
      mon("numel", 24, ["overheat", "take-down", "magnitude", "sunny-day"]),
      mon("slugma", 24, ["overheat", "smog", "light-screen", "sunny-day"]),
      mon("camerupt", 26, ["overheat", "tackle", "sunny-day", "attract"]),
      mon("torkoal", 29, ["overheat", "sunny-day", "body-slam", "attract"], "white-herb"),
    ],
  },
  {
    id: "gym-5", name: "Norman", kind: "gym", segment: "gym-4-5", rewardTm: "TM42",
    note: "Norman · Gimnasio de Ciudad Petalia · Normal",
    source: ["serebii-emerald-gyms", "pokemondb-emerald-gyms"],
    team: [
      mon("spinda", 27, ["teeter-dance", "psybeam", "facade", "encore"]),
      mon("vigoroth", 27, ["slash", "facade", "encore", "feint-attack"]),
      mon("linoone", 29, ["slash", "belly-drum", "facade", "headbutt"]),
      mon("slaking", 31, ["counter", "yawn", "facade", "feint-attack"], "sitrus-berry"),
    ],
  },
  {
    id: "gym-6", name: "Alana", kind: "gym", segment: "gym-5-6", rewardTm: "TM40",
    note: "Winona · Gimnasio de Ciudad Arborada · Volador",
    source: ["serebii-emerald-gyms", "pokemondb-emerald-gyms"],
    team: [
      mon("swablu", 29, ["perish-song", "mirror-move", "safeguard", "aerial-ace"]),
      mon("tropius", 29, ["sunny-day", "aerial-ace", "solar-beam", "synthesis"]),
      mon("pelipper", 30, ["water-gun", "supersonic", "protect", "aerial-ace"]),
      mon("skarmory", 31, ["sand-attack", "fury-attack", "steel-wing", "aerial-ace"]),
      mon("altaria", 33, ["earthquake", "dragon-breath", "dragon-dance", "aerial-ace"], "oran-berry"),
    ],
  },
  {
    id: "gym-7", name: "Vito y Leti", kind: "gym", segment: "gym-6-7", rewardTm: "TM04",
    note: "Tate & Liza · Gimnasio de Ciudad Algaria · Psíquico (combate doble)",
    source: ["serebii-emerald-gyms", "pokemondb-emerald-gyms"],
    team: [
      mon("claydol", 41, ["earthquake", "ancient-power", "psychic", "light-screen"]),
      mon("xatu", 41, ["psychic", "sunny-day", "confuse-ray", "calm-mind"]),
      mon("lunatone", 42, ["light-screen", "psychic", "hypnosis", "calm-mind"], "sitrus-berry"),
      mon("solrock", 42, ["sunny-day", "solar-beam", "psychic", "flamethrower"], "sitrus-berry"),
    ],
  },
  {
    id: "gym-8", name: "Galán", kind: "gym", segment: "gym-7-8", rewardTm: "TM03",
    note: "Juan · Gimnasio de Arrecípolis · Agua. TM03 = Hidropulso según machines.json",
    source: ["serebii-emerald-gyms", "pokemondb-emerald-gyms", "poketools-emerald-tms"],
    team: [
      mon("luvdisc", 41, ["water-pulse", "attract", "sweet-kiss", "flail"]),
      mon("whiscash", 41, ["rain-dance", "water-pulse", "amnesia", "earthquake"]),
      mon("sealeo", 43, ["encore", "body-slam", "aurora-beam", "water-pulse"]),
      mon("crawdaunt", 43, ["water-pulse", "crabhammer", "taunt", "leer"]),
      mon("kingdra", 46, ["water-pulse", "double-team", "ice-beam", "rest"], "chesto-berry"),
    ],
  },
  {
    id: "elite-1", name: "Sixto", kind: "elite-four", segment: "league",
    note: "Sidney · Siniestro",
    source: ["serebii-emerald-elite", "pokemondb-emerald-gyms"],
    team: [
      mon("mightyena", 46, ["roar", "double-edge", "sand-attack", "crunch"]),
      mon("shiftry", 48, ["torment", "double-team", "swagger", "extrasensory"]),
      mon("cacturne", 46, ["leech-seed", "feint-attack", "needle-arm", "cotton-spore"]),
      mon("crawdaunt", 48, ["surf", "swords-dance", "strength", "facade"]),
      mon("absol", 49, ["aerial-ace", "rock-slide", "swords-dance", "slash"], "sitrus-berry"),
    ],
  },
  {
    id: "elite-2", name: "Fátima", kind: "elite-four", segment: "league",
    note: "Phoebe · Fantasma",
    source: ["serebii-emerald-elite", "pokemondb-emerald-gyms"],
    team: [
      mon("dusclops", 48, ["shadow-punch", "confuse-ray", "curse", "protect"]),
      mon("banette", 49, ["shadow-ball", "grudge", "will-o-wisp", "feint-attack"]),
      mon("sableye", 50, ["shadow-ball", "double-team", "night-shade", "feint-attack"]),
      mon("banette", 49, ["shadow-ball", "psychic", "thunderbolt", "facade"]),
      mon("dusclops", 51, ["shadow-ball", "ice-beam", "rock-slide", "earthquake"], "sitrus-berry"),
    ],
  },
  {
    id: "elite-3", name: "Nívea", kind: "elite-four", segment: "league",
    note: "Glacia · Hielo",
    source: ["serebii-emerald-elite", "pokemondb-emerald-gyms"],
    team: [
      mon("sealeo", 50, ["encore", "body-slam", "hail", "ice-ball"]),
      mon("glalie", 50, ["light-screen", "crunch", "icy-wind", "ice-beam"]),
      mon("sealeo", 52, ["attract", "double-edge", "hail", "blizzard"]),
      mon("glalie", 52, ["shadow-ball", "explosion", "hail", "ice-beam"]),
      mon("walrein", 53, ["surf", "body-slam", "ice-beam", "sheer-cold"], "sitrus-berry"),
    ],
  },
  {
    id: "elite-4", name: "Dracón", kind: "elite-four", segment: "league",
    note: "Drake · Dragón",
    source: ["serebii-emerald-elite", "pokemondb-emerald-gyms"],
    team: [
      mon("shelgon", 52, ["rock-tomb", "dragon-claw", "protect", "double-edge"]),
      mon("altaria", 54, ["double-edge", "dragon-breath", "dragon-dance", "aerial-ace"]),
      mon("kingdra", 53, ["smokescreen", "dragon-dance", "surf", "body-slam"]),
      mon("flygon", 53, ["flamethrower", "crunch", "dragon-breath", "earthquake"]),
      mon("salamence", 55, ["flamethrower", "dragon-claw", "rock-slide", "crunch"], "sitrus-berry"),
    ],
  },
  {
    id: "champion", name: "Plubio", kind: "champion", segment: "league",
    note: "Wallace · Agua",
    source: ["serebii-emerald-elite", "pokemondb-emerald-gyms"],
    team: [
      mon("wailord", 57, ["rain-dance", "water-spout", "double-edge", "blizzard"]),
      mon("tentacruel", 55, ["toxic", "hydro-pump", "sludge-bomb", "ice-beam"]),
      mon("ludicolo", 56, ["giga-drain", "surf", "leech-seed", "double-team"]),
      mon("whiscash", 56, ["earthquake", "surf", "amnesia", "hyper-beam"]),
      mon("gyarados", 56, ["dragon-dance", "earthquake", "hyper-beam", "surf"]),
      mon("milotic", 58, ["recover", "surf", "ice-beam", "toxic"], "sitrus-berry"),
    ],
  },
];
