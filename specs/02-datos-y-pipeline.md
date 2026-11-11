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

Fuentes para curar (D-017): **PokéAPI** primero; **Bulbapedia** para lo que PokéAPI no tiene; **Serebii** y **WikiDex** para contrastar, y WikiDex para los nombres en español. Ninguna otra. Cada override cita su fuente (`data/overrides/sources.ts`).

## Overrides: formato

Los overrides son TypeScript tipado (`data/overrides/types.ts`). Cada dato lleva `source` (clave de `data/overrides/sources.ts`), y opcionalmente `note` y `todo`. Un `todo` es algo pendiente de verificar: **bloquea la publicación** y aparece en el informe.

```
data/overrides/
  types.ts                  # formato de todos los overrides
  sources.ts                # fuentes citadas (URL y fecha de consulta)
  {family}/
    index.ts                # junta las piezas de la familia
    segments.ts             # tramos y nivel esperado
    locations.ts            # zona → tramo (con excepciones por método)
    key-items.ts            # método → tramo (cañas, MO…) y condiciones que limitan
    special-encounters.ts   # correcciones de regalos, estáticos, intercambios (único, exclusivo, rareza…)
    evolution-items.ts      # objetos evolutivos y elección de método cuando PokéAPI da varios
    bosses.ts               # líderes, Alto Mando y campeón con equipos y movimientos
    tms.ts                  # MT/MO: ubicación, tramo y si se puede repetir
    versions/{game}.ts      # diferencias de la versión y especies del dex revisadas a mano
```

### Reglas de curación

- **Conservador:** si una fuente no permite precisar, se asigna el tramo **más tardío** posible. Nunca se da por disponible antes algo que no consta (D-016).
- El tramo de una zona es el de la primera parte del walkthrough que la recorre; los métodos (Surf, cañas…) añaden su propio requisito.
- Una MT de recompensa de gimnasio está disponible en el tramo **siguiente** a ese gimnasio.
- Las MT del Casino **no cuentan** (D-020): se usa su otra ubicación o quedan `excluded`.
- Zonas de aparición aleatoria (Isla Espejismo) y contenido de eventos o accesorios quedan como `excluded`.
- Los nombres de lugares salen de PokéAPI en español; los que solo tiene en inglés se toman de WikiDex y, mientras no se revisan, se listan como aviso.

## Merge (F3)

`merge.ts` combina la capa pokeapi con los overrides en `data/generated/{game}/game.json`:

- **Tramo de un encuentro** = el más tardío entre zona (o su excepción por método), método y condiciones. Un encuentro especial con `segment` lo sustituye.
- **Intercambios in-game** (`trade-<especie>`): no están disponibles antes de que se pueda conseguir la especie que piden por otra vía; si nunca se puede, se descartan.
- **Rareza curada:** `special-encounters.ts` puede fijar la rareza cuando el porcentaje de PokéAPI engaña (Feebas: 50 % por intento, pero solo en 6 casillas ocultas).
- **Pool por forma final:** una entrada por cada forma final alcanzable de cada línea, empezando en la forma más baja que se puede conseguir. Si la última evolución es por intercambio, hay además una entrada con la forma anterior (sin intercambio).
- **Evoluciones por objeto** requieren el objeto ubicado; su tramo es el del objeto.
- **Especies del dex fuera del pool:** si solo se obtienen en el post-juego es un aviso; si no, deben revisarse en `versions/{game}.ts`.

Niveles de incidencia en el informe: **error** y **TODO** bloquean la publicación; **aviso** no. `pnpm data:build --strict` falla si algún juego no es publicable (para CI y antes de publicar).

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
  index.ts        # orquestador: pnpm data:build [--game=…] [--fresh] [--source=…]
  config.ts       # juegos que sabe construir (slugs de PokéAPI)
  client.ts       # descarga con caché en .cache/pokeapi/<fuente>/ y concurrencia limitada
  resolve.ts      # past_types, past_stats, past_damage_relations, past_values
  normalize.ts    # PokéAPI → capa generada (especies, movimientos, MT, evoluciones, tabla de tipos)
  encounters.ts   # agregación de encuentros y clasificación de métodos
  report.ts       # informe de lo que falta por curar
  write.ts        # JSON estable y dataVersion
  merge.ts        # aplica overrides (F3)
  validate.ts     # reglas de integridad (F3)
```

### Fuente

PokéAPI tiene dos fuentes con los mismos datos (D-014):

- `github` (por defecto): el volcado estático oficial `PokeAPI/api-data`, direccionado por id. Es más rápido y no carga los servidores de PokéAPI.
- `pokeapi`: la API REST en vivo (`--source=pokeapi`).

Todo se cachea en disco; `--fresh` ignora la caché.

### Salida

Dos capas. La capa **pokeapi** (F2) es lo que sale de PokéAPI sin curar; la capa **final** (F3) la combina con `data/overrides/`.

```
data/generated/
  meta.json                         # dataVersion (hash del contenido) y juegos
  type-chart/gen-{generation}.json  # tabla de tipos de esa generación (gen-3.json…)
  {versionGroup}/moves.json         # movimientos con valores de ese grupo (past_values)
  {versionGroup}/machines.json      # número de MT/MO → movimiento
  {game}/pokeapi/game.json          # versión, grupo, generación, región, dex regional
  {game}/pokeapi/species.json       # especies con tipos y estadísticas de su generación
  {game}/pokeapi/locations.json     # zonas con encuentros en esta versión
  {game}/pokeapi/encounters.json    # encuentros agregados, con tipo y exclusión
  {game}/pokeapi/learnsets.json     # especie → movimientos (nivel / MT / tutor / huevo)
  {game}/pokeapi/evolutions.json    # cadenas limitadas a la generación
  {game}/pokeapi/items.json         # objetos evolutivos que existen en la generación
  {game}/report.md                  # informe de huecos: lista de tareas de F3
  {game}/game.json                  # F3: tramos, pool, jefes, MT, objetos (capa final)
  featured/{game}.json              # F6: equipos destacados
```

La salida es determinista: mismos datos de entrada → mismos archivos y misma `dataVersion`.

### Reglas que aplica la capa pokeapi

- **Encuentros por versión**, nunca por grupo.
- **Métodos de encuentro clasificados** (`encounters.ts`): PokéAPI codifica regalos, estáticos, intercambios y errantes como métodos (`gift`, `gift-egg`, `static`, `devon-scope`, `npc-trade`, `roaming-*`…). Cada método tiene un tipo: salvaje, regalo, estático, intercambio, errante o excluido (p. ej. `colosseum-bonus-disc-jpn`). Un método **sin clasificar no cuenta** hasta que se añade.
- **Evoluciones**: se eliminan especies posteriores a la generación, se deduplican métodos idénticos y se descartan los métodos que usan objetos que no existían en esa generación (`item.game_indices`), p. ej. Piedra Hielo para Vulpix o Escama Bella para Feebas en Gen 3. Los que siguen siendo ambiguos van al informe.
- **Maldición** (tipo "???" en Gen 2–4) queda con tipo `null`.

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
- Muestreo: se generan 10 000 equipos con todas las combinaciones de opciones y ninguno falla `validate` (F4).
- Los movimientos de los jefes existen en PokéAPI; las MT de recompensa existen en el juego.

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
  scopes?: GameScope[];         // { id, label, until }: alcances de la historia (D-029)
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

## Ampliaciones de F9 (Platino)

- `LocationOverride.name`: nombre en español de la zona cuando PokéAPI no lo tiene, de WikiDex (D-027).
- `MethodOverride.minRarity`: rareza mínima de todos los encuentros de un método (árboles de miel).
- `EvolutionChoice.segment`: tramo de las evoluciones que dependen de un lugar.
- Versión de datos por juego en `games.json`; `meta.json` guarda el hash de todas (D-026).

## Ampliaciones de F9 (HeartGold/SoulSilver)

- `GameConfig.extraRegions`: regiones de PokéAPI que el juego también recorre (HGSS lee Johto y Kanto).
- `FamilyOverrides.scopes` y `Game.scopes`: alcances de la historia (D-029).
- `ConditionOverride.minRarity`: rareza mínima por condición, como la de los métodos (árboles especiales de Golpe Cabeza, D-030). Si hay varias, gana la más difícil.
- Pool: una especie que se captura pero a la que su preevolución no puede llegar en ese juego (Chansey sin la Piedra Oval) entra con su propia línea desde ella.
- Intercambios del juego: la especie que piden cuenta como obtenible también si se consigue evolucionando (Forretress desde Pineco).
