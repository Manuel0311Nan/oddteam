/** The subset of PokéAPI response shapes the pipeline reads. */

export type NamedRef = { name: string; url: string };

export type LocalizedName = { name: string; language: NamedRef };

export type ApiVersionGroup = {
  id: number;
  name: string;
  order: number;
  generation: NamedRef;
  versions: NamedRef[];
  pokedexes: NamedRef[];
  regions: NamedRef[];
};

export type ApiVersion = { id: number; name: string; names: LocalizedName[]; version_group: NamedRef };

export type ApiRegion = { id: number; name: string; locations: NamedRef[] };

export type ApiLocation = {
  id: number;
  name: string;
  names: LocalizedName[];
  region: NamedRef | null;
  areas: NamedRef[];
};

export type ApiEncounterDetail = {
  chance: number;
  min_level: number;
  max_level: number;
  method: NamedRef;
  condition_values: NamedRef[];
};

export type ApiLocationArea = {
  id: number;
  name: string;
  names: LocalizedName[];
  location: NamedRef;
  pokemon_encounters: {
    pokemon: NamedRef;
    version_details: {
      version: NamedRef;
      max_chance: number;
      encounter_details: ApiEncounterDetail[];
    }[];
  }[];
};

export type ApiPokedex = {
  id: number;
  name: string;
  pokemon_entries: { entry_number: number; pokemon_species: NamedRef }[];
};

export type ApiSpecies = {
  id: number;
  name: string;
  names: LocalizedName[];
  generation: NamedRef;
  is_legendary: boolean;
  is_mythical: boolean;
  is_baby: boolean;
  capture_rate: number;
  evolution_chain: { url: string } | null;
  evolves_from_species: NamedRef | null;
  varieties: { is_default: boolean; pokemon: NamedRef }[];
};

export type ApiStat = { base_stat: number; stat: NamedRef };

export type ApiPokemon = {
  id: number;
  name: string;
  species: NamedRef;
  types: { slot: number; type: NamedRef }[];
  past_types: { generation: NamedRef; types: { slot: number; type: NamedRef }[] }[];
  stats: ApiStat[];
  past_stats?: { generation: NamedRef; stats: ApiStat[] }[];
  sprites: {
    front_default: string | null;
    versions?: Record<string, Record<string, { front_default?: string | null }>>;
  };
  moves: {
    move: NamedRef;
    version_group_details: {
      level_learned_at: number;
      move_learn_method: NamedRef;
      version_group: NamedRef;
    }[];
  }[];
};

export type ApiMove = {
  id: number;
  name: string;
  names: LocalizedName[];
  type: NamedRef;
  damage_class: NamedRef | null;
  power: number | null;
  accuracy: number | null;
  generation: NamedRef;
  past_values: {
    version_group: NamedRef;
    power: number | null;
    accuracy: number | null;
    type: NamedRef | null;
  }[];
  machines: { machine: { url: string }; version_group: NamedRef }[];
};

export type ApiMachine = {
  id: number;
  item: NamedRef;
  move: NamedRef;
  version_group: NamedRef;
};

export type DamageRelations = {
  double_damage_to: NamedRef[];
  half_damage_to: NamedRef[];
  no_damage_to: NamedRef[];
};

export type ApiType = {
  id: number;
  name: string;
  names: LocalizedName[];
  generation: NamedRef;
  damage_relations: DamageRelations;
  past_damage_relations: { generation: NamedRef; damage_relations: DamageRelations }[];
};

export type ApiEvolutionDetail = {
  trigger: NamedRef;
  min_level: number | null;
  item: NamedRef | null;
  held_item: NamedRef | null;
  min_happiness: number | null;
  min_beauty: number | null;
  time_of_day: string;
  known_move: NamedRef | null;
  known_move_type: NamedRef | null;
  location: NamedRef | null;
  trade_species: NamedRef | null;
  gender: number | null;
  relative_physical_stats: number | null;
  needs_overworld_rain: boolean;
  party_species: NamedRef | null;
  party_type: NamedRef | null;
  turn_upside_down: boolean;
};

export type ApiChainLink = {
  species: NamedRef;
  evolution_details: ApiEvolutionDetail[];
  evolves_to: ApiChainLink[];
};

export type ApiEvolutionChain = { id: number; chain: ApiChainLink };

export type ApiItem = {
  id: number;
  name: string;
  names: LocalizedName[];
  /** Generations in which the item exists. */
  game_indices: { generation: NamedRef }[];
};
