import type { BossOverride } from "../types";

/**
 * Platinum bosses, first battle (no rematches). Teams, levels and moves:
 * WikiDex gym and League pages (Platinum tables, Spanish move names mapped to
 * PokéAPI slugs). Gym levels cross-checked with Serebii.
 * In Platinum, Fantina (Hearthome) is the 3rd gym, not the 5th as in Diamond/Pearl.
 * Spanish leader names from WikiDex.
 */
export const bosses: readonly BossOverride[] = [
  {
    id: "gym-1",
    name: "Roco",
    kind: "gym",
    segment: "pre-gym-1",
    rewardTm: "TM76",
    source: ["wikidex-gimnasio-pirita", "serebii-platinum-gyms"],
    team: [
      { species: "geodude", level: 12, moves: ["rock-throw", "stealth-rock"] },
      { species: "onix", level: 12, moves: ["stealth-rock", "rock-throw", "screech"] },
      { species: "cranidos", level: 14, moves: ["headbutt", "leer", "pursuit"] },
    ],
  },
  {
    id: "gym-2",
    name: "Gardenia",
    kind: "gym",
    segment: "gym-1-2",
    rewardTm: "TM86",
    source: ["wikidex-gimnasio-vetusta", "serebii-platinum-gyms"],
    team: [
      { species: "turtwig", level: 20, moves: ["razor-leaf", "sunny-day", "reflect", "grass-knot"] },
      { species: "cherrim", level: 20, moves: ["leech-seed", "magical-leaf", "safeguard", "grass-knot"] },
      { species: "roserade", level: 22, moves: ["poison-sting", "stun-spore", "magical-leaf", "grass-knot"] },
    ],
  },
  {
    id: "gym-3",
    name: "Fantina",
    kind: "gym",
    segment: "gym-2-3",
    rewardTm: "TM65",
    source: ["wikidex-gimnasio-corazon", "serebii-platinum-gyms"],
    team: [
      { species: "duskull", level: 24, moves: ["will-o-wisp", "pursuit", "future-sight", "shadow-sneak"] },
      { species: "haunter", level: 24, moves: ["shadow-claw", "sucker-punch", "hypnosis", "confuse-ray"] },
      { species: "mismagius", level: 26, moves: ["shadow-ball", "magical-leaf", "psybeam", "confuse-ray"] },
    ],
  },
  {
    id: "gym-4",
    name: "Brega",
    kind: "gym",
    segment: "gym-3-4",
    rewardTm: "TM60",
    source: ["wikidex-gimnasio-rocavelo", "serebii-platinum-gyms"],
    team: [
      { species: "meditite", level: 28, moves: ["fake-out", "rock-tomb", "confusion", "drain-punch"] },
      { species: "machoke", level: 29, moves: ["karate-chop", "focus-energy", "strength", "rock-tomb"] },
      { species: "lucario", level: 32, moves: ["metal-claw", "bone-rush", "force-palm", "drain-punch"] },
    ],
  },
  {
    id: "gym-5",
    name: "Mananti",
    kind: "gym",
    segment: "gym-4-5",
    rewardTm: "TM55",
    source: ["wikidex-gimnasio-pradera", "serebii-platinum-gyms"],
    team: [
      { species: "gyarados", level: 33, moves: ["brine", "waterfall", "bite", "twister"] },
      { species: "quagsire", level: 34, moves: ["rock-tomb", "water-pulse", "mud-shot", "yawn"] },
      { species: "floatzel", level: 37, moves: ["brine", "ice-fang", "crunch", "aqua-jet"] },
    ],
  },
  {
    id: "gym-6",
    name: "Acerón",
    kind: "gym",
    segment: "gym-5-6",
    rewardTm: "TM91",
    source: ["wikidex-gimnasio-canal", "serebii-platinum-gyms"],
    team: [
      { species: "magneton", level: 37, moves: ["flash-cannon", "tri-attack", "metal-sound", "thunderbolt"] },
      { species: "steelix", level: 38, moves: ["flash-cannon", "ice-fang", "earthquake", "sandstorm"] },
      { species: "bastiodon", level: 41, moves: ["metal-burst", "iron-defense", "taunt", "stone-edge"] },
    ],
  },
  {
    id: "gym-7",
    name: "Inverna",
    kind: "gym",
    segment: "gym-6-7",
    rewardTm: "TM72",
    source: ["wikidex-gimnasio-puntaneva", "serebii-platinum-gyms"],
    team: [
      { species: "sneasel", level: 40, moves: ["feint-attack", "slash", "ice-shard", "aerial-ace"] },
      { species: "piloswine", level: 40, moves: ["avalanche", "earthquake", "hail", "stone-edge"] },
      { species: "abomasnow", level: 42, moves: ["avalanche", "focus-blast", "water-pulse", "wood-hammer"] },
      { species: "froslass", level: 44, moves: ["double-team", "blizzard", "shadow-ball", "psychic"] },
    ],
  },
  {
    id: "gym-8",
    name: "Lectro",
    kind: "gym",
    segment: "gym-7-8",
    rewardTm: "TM57",
    source: ["wikidex-gimnasio-marina", "serebii-platinum-gyms"],
    team: [
      { species: "jolteon", level: 46, moves: ["iron-tail", "charge-beam", "quick-attack", "thunder-wave"] },
      { species: "raichu", level: 46, moves: ["signal-beam", "charge-beam", "focus-blast", "quick-attack"] },
      { species: "luxray", level: 48, moves: ["fire-fang", "ice-fang", "thunder-fang", "crunch"] },
      { species: "electivire", level: 50, moves: ["thunder-punch", "quick-attack", "fire-punch", "giga-impact"] },
    ],
  },
  {
    id: "elite-1",
    name: "Alecrán",
    kind: "elite-four",
    segment: "league",
    source: ["wikidex-liga-sinnoh"],
    team: [
      { species: "yanmega", level: 49, moves: ["bug-buzz", "air-slash", "u-turn", "double-team"] },
      { species: "scizor", level: 49, moves: ["iron-head", "x-scissor", "night-slash", "quick-attack"] },
      { species: "vespiquen", level: 50, moves: ["attack-order", "defend-order", "heal-order", "power-gem"] },
      { species: "heracross", level: 51, moves: ["close-combat", "megahorn", "stone-edge", "night-slash"] },
      { species: "drapion", level: 53, moves: ["cross-poison", "x-scissor", "aerial-ace", "ice-fang"] },
    ],
  },
  {
    id: "elite-2",
    name: "Gaia",
    kind: "elite-four",
    segment: "league",
    source: ["wikidex-liga-sinnoh"],
    team: [
      { species: "whiscash", level: 50, moves: ["sandstorm", "earth-power", "zen-headbutt", "aqua-tail"] },
      { species: "gliscor", level: 53, moves: ["earthquake", "fire-fang", "thunder-fang", "ice-fang"] },
      { species: "hippowdon", level: 52, moves: ["earthquake", "stone-edge", "yawn", "crunch"] },
      { species: "golem", level: 52, moves: ["thunder-punch", "fire-punch", "earthquake", "sandstorm"] },
      { species: "rhyperior", level: 55, moves: ["earthquake", "rock-wrecker", "megahorn", "avalanche"] },
    ],
  },
  {
    id: "elite-3",
    name: "Fausto",
    kind: "elite-four",
    segment: "league",
    source: ["wikidex-liga-sinnoh"],
    team: [
      { species: "houndoom", level: 52, moves: ["flamethrower", "sludge-bomb", "sunny-day", "dark-pulse"] },
      { species: "flareon", level: 55, moves: ["overheat", "giga-impact", "quick-attack", "will-o-wisp"] },
      { species: "rapidash", level: 53, moves: ["sunny-day", "flare-blitz", "solar-beam", "bounce"] },
      { species: "infernape", level: 55, moves: ["flare-blitz", "thunder-punch", "earthquake", "mach-punch"] },
      { species: "magmortar", level: 57, moves: ["flamethrower", "thunderbolt", "solar-beam", "hyper-beam"] },
    ],
  },
  {
    id: "elite-4",
    name: "Delos",
    kind: "elite-four",
    segment: "league",
    source: ["wikidex-liga-sinnoh"],
    team: [
      { species: "mr-mime", level: 53, moves: ["psychic", "light-screen", "reflect", "thunderbolt"] },
      { species: "espeon", level: 55, moves: ["psychic", "shadow-ball", "signal-beam", "quick-attack"] },
      { species: "bronzong", level: 54, moves: ["calm-mind", "psychic", "earthquake", "gyro-ball"] },
      { species: "alakazam", level: 56, moves: ["focus-blast", "psychic", "energy-ball", "recover"] },
      { species: "gallade", level: 59, moves: ["psycho-cut", "drain-punch", "leaf-blade", "stone-edge"] },
    ],
  },
  {
    id: "champion",
    name: "Cintia",
    kind: "champion",
    segment: "league",
    source: ["wikidex-liga-sinnoh"],
    team: [
      { species: "spiritomb", level: 58, moves: ["dark-pulse", "shadow-ball", "silver-wind", "psychic"] },
      { species: "roserade", level: 58, moves: ["extrasensory", "shadow-ball", "toxic", "energy-ball"] },
      { species: "togekiss", level: 60, moves: ["aura-sphere", "air-slash", "water-pulse", "shock-wave"] },
      { species: "lucario", level: 60, moves: ["aura-sphere", "shadow-ball", "extreme-speed", "stone-edge"] },
      { species: "milotic", level: 58, moves: ["surf", "ice-beam", "mirror-coat", "dragon-pulse"] },
      { species: "garchomp", level: 62, moves: ["flamethrower", "dragon-rush", "earthquake", "giga-impact"] },
    ],
  },
];
