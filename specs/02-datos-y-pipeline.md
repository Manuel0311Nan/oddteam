# 02 · Datos y pipeline

**Estado:** Borrador

## Principio

PokéAPI se consulta **solo en build**, con caché en disco. La web consume JSON estáticos. Lo que PokéAPI no tiene o tiene incompleto se cura a mano en `data/overrides/`.

## Qué sale de PokéAPI y qué se cura

| Dato | Fuente | Endpoint / archivo |
|---|---|---|
| Juego y grupo de versiones | PokéAPI | `/version/{slug}`, `/version-group/{slug}` |
| Dex regional (pool base) | PokéAPI | `/pokedex/{id}` |
| Especie: legendario, singular, cadena evolutiva, nombres ES | PokéAPI | `/pokemon-species/{id}` |
| Tipos, stats base, sprites | PokéAPI | `/pokemon/{id}` |
| Movimientos por juego: método y nivel | PokéAPI | `/pokemon/{id}` → `moves[].version_group_details` |
| Movimiento: tipo, potencia, precisión, clase de daño, valores antiguos | PokéAPI | `/move/{id}` (+ `past_values`) |
| Qué movimiento es cada MT/MO en ese juego | PokéAPI | `/machine/{id}` |
| Tabla de tipos | PokéAPI | `/type/{id}` → `damage_relations` (+ `past_damage_relations`) |
| Encuentros salvajes | PokéAPI + revisión | `/pokemon/{id}/encounters` |
| Probabilidad, método y condiciones de cada encuentro | PokéAPI + revisión | `encounters[].version_details[].encounter_details[]` → `chance`, `method`, `condition_values`, `min_level`, `max_level` |
| Evolución: disparador y requisitos | PokéAPI | `/evolution-chain/{id}` |
| Tramos de la historia | **Curado** | `overrides/{family}/segments.ts` |
| Zona → tramo | **Curado** | `overrides/{family}/locations.ts` |
| Regalos, estáticos, intercambios in-game | **Curado** | `overrides/{family}/special-encounters.ts` |
| Jefes: equipos, niveles y movimientos | **Curado** | `overrides/{family}/bosses.ts` |
| Dónde y cuándo se consigue cada MT/MO | **Curado** | `overrides/{family}/tms.ts` |
| Dónde se consiguen piedras y objetos evolutivos | **Curado** | `overrides/{family}/evolution-items.ts` |
| Cuándo se habilita cada método de encuentro (cañas, Surf, Golpe Roca, Cabezazo…) | **Curado** | `overrides/{family}/key-items.ts` |
| Diferencias de cada versión (exclusivos, encuentros, zonas, jefes) | **Curado** | `overrides/{family}/versions/{game}.ts` |

Fuentes de referencia para curar: Bulbapedia, Serebii, Pokexperto, WikiDex. Cada override indica la fuente en un comentario.

## Versiones y familias

La unidad del producto es la **versión** (`emerald`, `heartgold`, `soulsilver`…): cada una tiene su propio pool, sus exclusivos y su URL. Para no curar dos veces lo mismo, los overrides se organizan por **familia**: versiones que comparten historia, mapa y casi todos los jefes.

| Familia | Versiones | Notas |
|---|---|---|
| `emerald` | Esmeralda | Familia propia: cambia líderes, campeón y zonas respecto a Rubí/Zafiro. |
| `platinum` | Platino | Familia propia: cambia dex, líderes y zonas respecto a Diamante/Perla. |
| `hgss` | HeartGold, SoulSilver | Comparten casi todo; difieren en exclusivos y algún encuentro. |
| `b2w2` | Negro 2, Blanco 2 | Comparten casi todo; difieren en exclusivos y algunas zonas. |
| `rse` *(futuro)* | Rubí, Zafiro | Comparten base entre sí. |
| `dp` *(futuro)* | Diamante, Perla | Comparten base entre sí. |

```
data/overrides/{family}/
  family.ts               # versionGroup, versiones y su pareja
  segments.ts             # base compartida
  locations.ts
  special-encounters.ts
  bosses.ts
  tms.ts
  evolution-items.ts
  versions/{game}.ts      # solo diferencias de esa versión
```

Reglas de merge:

- El archivo de versión **sobrescribe por id** lo que define (un jefe, una zona, un encuentro especial) y **añade** lo que no existe en la base.
- Los **encuentros salvajes** se toman de PokéAPI filtrando por la versión (`version_details[].version`), nunca por grupo de versiones.
- Los exclusivos se derivan de esos encuentros. `versions/{game}.ts` solo corrige lo que PokéAPI tenga mal o incompleto.
- La salida sigue siendo **por versión**: `data/generated/{game}/…`.

### Detalles a tener en cuenta

- **Tabla de tipos por generación:** el tipo Hada no existe antes de Gen 6 y Acero/Fantasma cambiaron en Gen 6. Se usa `past_damage_relations` para construir la tabla correcta de cada juego.
- **Tipos de especie por generación:** algunas especies cambiaron de tipo (p. ej., las que ganaron Hada). Se usa `past_types` de `/pokemon/{id}`.
- **Potencia y precisión por generación:** se aplica `past_values` del movimiento según el grupo de versiones.
- **Clase de daño:** siempre la moderna, sin excepción (ver `decisiones.md`).

## Probabilidad de encuentro

PokéAPI da, por versión y por zona, cada "hueco" de encuentro con su `chance` (%), su método (`walk`, `surf`, `old-rod`, `good-rod`, `super-rod`, `rock-smash`, `headbutt`…) y sus condiciones (`time-morning`, `time-night`, `swarm-yes`, `radar-on`, `slot2-*`…).

### Cómo se agrega

1. Se agrupan los huecos por **versión + zona + método + condiciones** y se **suman** sus `chance` (una especie puede ocupar varios huecos de la misma tabla).
2. Cada grupo es un **encuentro** de la especie, con su tramo: el máximo entre el tramo de la zona y el tramo en que se habilita el método (`key-items.ts`). Pescar en la Ruta 104 no cuenta hasta tener la caña.
3. La **mejor opción** de una especie en un tramo es el encuentro disponible con mayor probabilidad.
4. Regalos, intercambios in-game y estáticos: probabilidad **garantizada** (sin porcentaje). Los estáticos se marcan además como **únicos** (si lo derrotas, se pierde).

### Condiciones

| Condición | Tratamiento |
|---|---|
| Hora del día (mañana/día/noche) | Cuenta. Se muestra la franja ("solo de noche"). |
| Temporada (Negro 2/Blanco 2) | Cuenta. Se muestra la estación. |
| Masivas (`swarm`) | **No** cuentan como disponibilidad: dependen del azar del día. Se muestran como dato extra. |
| Pokéradar, ranura de GBA (`slot2`), radio u otros que exigen post-juego o hardware | **No** cuentan. |
| Encuentros ocultos (manchas, grutas ocultas…) | Solo si se curan en `versions/{game}.ts`. |

### Rareza

Se calcula sobre la mejor opción disponible de la especie en ese tramo:

| Rareza | Probabilidad |
|---|---|
| Garantizado | regalo, estático o intercambio |
| Común | ≥ 20 % |
| Poco común | 5–19 % |
| Raro | 1–4 % |
| Muy raro | < 1 % |

Los cortes viven en `lib/analysis/constants.ts`.

### Revisión

Los porcentajes de PokéAPI se revisan en los juegos de lanzamiento contra una segunda fuente. Las correcciones van a `versions/{game}.ts` como cualquier otro override.

## Pipeline

```
scripts/build-data/
  fetch.ts       # descarga con caché en .cache/pokeapi (respeta la fair use policy)
  normalize.ts   # PokéAPI → tipos internos
  merge.ts       # aplica overrides
  validate.ts    # reglas de integridad (abajo)
  write.ts       # escribe data/generated
```

Salida:

```
data/generated/
  games.json                    # lista de juegos publicados + metadatos
  {game}/game.json              # tramos, pool, jefes, MT, objetos
  {game}/learnsets.json         # especie → movimientos (por nivel / MT / tutor)
  {versionGroup}/moves.json     # movimientos usados por ese grupo
  type-chart/{generation}.json  # tabla de tipos de esa generación
  featured/{game}.json          # equipos destacados (ver 05)
  meta.json                     # dataVersion (hash) y fecha de build
```

### Validador (bloquea la publicación de un juego)

- Toda especie del pool tiene un tramo asignado.
- Ninguna zona con encuentros queda sin tramo.
- Todos los jefes tienen equipo completo, niveles y tramo.
- Toda MT del juego tiene ubicación y tramo.
- Toda evolución por objeto tiene el objeto ubicado y con tramo.
- Todo método de encuentro usado en el juego tiene su tramo de habilitación en `key-items.ts`.
- Ninguna especie del pool depende solo de condiciones que no cuentan (masivas, Pokéradar, ranura de GBA).
- No queda ningún `TODO` en los overrides del juego (base de la familia + su versión).
- Ninguna especie del pool se obtiene **solo** en la otra versión de la familia (comparando los encuentros de ambas).
- El validador se ejecuta **por versión**: una versión de la familia puede publicarse aunque la otra no esté lista.
- Muestreo: se generan 10 000 equipos con todas las combinaciones de opciones y ninguno falla `validate`.

## Modelo (tipos internos, resumido)

```ts
type Game = {
  slug: GameSlug;               // "heartgold"
  family: string;               // "hgss"
  pairedVersion?: GameSlug;     // "soulsilver"
  versionGroup: string;         // "heartgold-soulsilver"
  generation: number;           // 3
  region: string;               // "hoenn"
  segments: Segment[];
  pool: PoolEntry[];
  bosses: Boss[];
  tms: TmEntry[];
  evolutionItems: ItemLocation[];
};

type Segment = { id: string; label: string; order: number; expectedLevel: number };

type PoolEntry = {
  speciesId: number;
  finalFormId: number;          // forma final alcanzable en este juego
  firstAvailable: string;       // Segment.id (especie o su preevolución)
  encounters: Encounter[];      // todas las formas de conseguirlo en esta versión
  rarity: Rarity;               // de la mejor opción en su primer tramo disponible
  evolution: EvolutionStep[];   // pasos hasta finalFormId con requisito y tramo en que es posible
  flags: { legendary: boolean; mythical: boolean; starter: boolean; needsTrade: boolean };
};

type Encounter = {
  asSpeciesId: number;          // la especie que se encuentra (p. ej., la preevolución)
  kind: "wild" | "gift" | "static" | "trade-ingame";
  locationAreaId: string;
  where: string;                // nombre en español de la zona
  method?: string;              // "walk", "surf", "super-rod"…  (solo wild)
  chance?: number;              // % agregado (solo wild)
  conditions: string[];         // ["time-night"]…
  levels: [number, number];
  segment: string;              // tramo en que se puede hacer
  unique: boolean;              // estático de una sola oportunidad
};

type Rarity = "guaranteed" | "common" | "uncommon" | "rare" | "very-rare";

type Boss = {
  id: string;                   // "gym-3"
  name: string;                 // "Erico"
  kind: "gym" | "elite-four" | "champion" | "rival";
  segment: string;              // tramo en que se combate
  team: { speciesId: number; level: number; moves: string[] }[];
  rewardTm?: string;            // MT que entrega
};

type TmEntry = { number: string; moveId: string; where: string; segment: string; repeatable: boolean };
```

`Segment.expectedLevel` es el nivel orientativo del jugador al cerrar ese tramo. Se cura a partir del nivel del as del jefe (por defecto, nivel del as − 2).
