# CLAUDE.md — Generador de equipos aleatorios para partidas de Pokémon

> Nombre del proyecto: **OddTeam** (pendiente de comprobar dominio y marca). El detalle funcional está en `specs/`. Este archivo resume el contexto y fija las reglas de trabajo.

## Qué es este proyecto

Una web que genera **equipos aleatorios pero válidos para jugar la historia de una versión concreta de un juego Pokémon** (Esmeralda, Platino, HeartGold, SoulSilver, Negro 2, Blanco 2…). Cada versión es un juego propio, con sus exclusivos. El objetivo es dejar de jugar siempre con los mismos 6 Pokémon.

Un equipo es **válido** cuando el jugador puede conseguirlo y usarlo jugando ese juego con normalidad:

- Todos sus miembros se obtienen en esa versión (captura, regalo, intercambio in-game o evolución).
- Nada exclusivo de la otra versión de la pareja.
- Sin legendarios ni singulares, salvo que se active la opción.
- Las evoluciones se completan sin intercambiar con otra consola, salvo que se active la opción.

Además de generar el equipo, la web lo **analiza**:

- Cuándo está disponible cada miembro en la historia, dónde y **con qué probabilidad** (rareza y esfuerzo de captura).
- Cómo le va al equipo contra cada líder y el Alto Mando.
- Qué **ataques recomendados** y qué **MT** tiene cada Pokémon a tiempo para cada combate.
- Una **dificultad estimada** (Paseo / Normal / Exigente / Reto).

Y tiene un segundo modo, **Ruta**: en vez de un equipo cerrado, recomienda qué capturar en cada tramo antes de cada jefe, indicando si es para quedarse o para salir del paso.

No es una herramienta competitiva: nada de EVs, IVs, sets ni Showdown.

## Fuentes de verdad

| Tema | Documento |
|---|---|
| Visión, alcance y fases | `specs/01-vision-y-alcance.md` |
| Datos, PokéAPI y pipeline de build | `specs/02-datos-y-pipeline.md` |
| Generador (opciones, algoritmo, semilla) | `specs/03-generador.md` |
| Líderes, ataques recomendados y MT | `specs/04-combates-ataques-mt.md` |
| Dificultad y equipos destacados | `specs/05-dificultad.md` |
| Interfaz | `specs/06-interfaz.md` |
| Versión 2.0: cuentas y comunidad | `specs/07-v2-cuentas-y-comunidad.md` |
| Modo Ruta | `specs/08-modo-ruta.md` |
| Plan de ejecución (fases y estado) | `specs/09-plan-de-ejecucion.md` |
| Registro de decisiones | `specs/decisiones.md` |

Si el código y una spec no coinciden, **se para y se pregunta**: no se cambia ninguno de los dos en silencio. Cada decisión nueva se apunta en `specs/decisiones.md`.

## Stack

- **Next.js 15** (App Router) + **TypeScript** estricto
- **Tailwind + shadcn/ui**
- **Zustand** para el estado del generador
- **Vitest** para la lógica pura
- Datos del juego como **JSON estático versionado en el repo**, generado por script desde PokéAPI y combinado con overrides curados
- Despliegue en **Vercel**
- **Versión 1.0 sin base de datos ni autenticación.** Prisma + Neon + Auth.js llegan en la 2.0 (`specs/07`).

## Arquitectura en una frase

`scripts/build-data/` descarga PokéAPI **una vez**, lo combina con `data/overrides/` y escribe `data/generated/`. La web importa esos JSON en build. La lógica (`src/lib/`) es **pura**: recibe datos + opciones + semilla y devuelve resultados, sin React ni fetch.

## Estructura de carpetas

El código de la web vive en `src/` (alias `@/*` → `src/*`). Datos, scripts y specs van en la raíz (D-012).

```
src/
  app/
    page.tsx                    # portada: familias y versiones
    como-funciona/page.tsx      # explicación de reglas, datos y límites
    [game]/page.tsx             # generador (estático con generateStaticParams)
    [game]/ruta/page.tsx        # modo Ruta: recomendaciones por tramo
    [game]/destacados/page.tsx  # equipos destacados por dificultad
  components/
    generator/                  # opciones, tarjeta, línea de tiempo, tabla de combates, dificultad
    route/                      # modo Ruta
    featured/                   # pestañas de destacados
    site/                       # cabecera, pie con aviso legal, navegación Equipo / Ruta / Destacados, imagen OG
    ui/                         # shadcn
  lib/
    generator/                  # filter, pick, validate
    analysis/                   # types (tabla de tipos), moves (ataques recomendados), bosses, difficulty, route
    game-data.ts                # lee data/generated en el servidor y prepara los datos del cliente
    ui/labels.ts                # textos y colores de la interfaz (los nombres oficiales vienen de los datos)
    catalog.ts                  # familias y versiones de la portada (solo etiquetas)
    site.ts                     # URL pública para metadatos
    rng.ts                      # mulberry32 con semilla
    url-state.ts                # codificar/decodificar opciones y semilla en la URL
    types.ts
    utils.ts                    # cn() de shadcn
  store/
    generator.ts                # Zustand
data/
  overrides/{family}/         # CURADO A MANO: base compartida de la familia (progresión, líderes, MT…)
    versions/{game}.ts        # solo las diferencias de cada versión (exclusivos, zonas, jefes)
  generated/                  # GENERADO: nunca se edita a mano
scripts/
  build-data/                 # extracción de PokéAPI + merge + validación
  featured/                   # genera y puntúa equipos destacados
specs/
```

## Comandos

```
pnpm dev                 # desarrollo
pnpm build               # build de producción
pnpm lint                # ESLint
pnpm typecheck           # tsc --noEmit
pnpm test                # Vitest (una pasada)
pnpm test:watch          # Vitest en modo watch
pnpm check               # lint + typecheck + test (lo mismo que CI)
pnpm data:build          # PokéAPI → data/generated (+ overrides desde F3), con caché local
pnpm data:build --game=emerald
pnpm data:build --fresh  # ignora la caché y vuelve a descargar
pnpm data:build --source=pokeapi   # API en vivo en vez del volcado de GitHub (D-014)
pnpm data:build --strict # falla si algún juego tiene errores o TODO (antes de publicar)
pnpm data:build --no-featured  # sin recalcular los destacados (por defecto se recalculan, D-021)
pnpm data:featured       # recalcula solo los equipos destacados
```

Antes de dar una tarea por terminada, `pnpm check` tiene que pasar.

Variables de entorno: `ODDTEAM_SHOW_DRAFTS=1` muestra los juegos en borrador en un build de producción (D-018). En desarrollo siempre se ven.

## Convenciones

- TypeScript estricto, sin `any`.
- Código, identificadores y comentarios en inglés; **textos de la interfaz en español**.
- Nombres de Pokémon, movimientos, tipos, objetos y zonas en español en la UI. Se usan los `names` de PokéAPI con idioma `es` y, si falta, `en`.
- Componentes de servidor por defecto; `"use client"` solo donde haya interacción (el generador).
- Toda la aleatoriedad pasa por `src/lib/rng.ts` con semilla. Misma semilla + opciones + versión de datos = mismo equipo.
- **Clase de daño (físico/especial): siempre la moderna de PokéAPI, en todos los juegos.** Es una decisión tomada (`specs/decisiones.md`).
- Los overrides se escriben en TypeScript tipado (`data/overrides/{family}/*.ts`) para que el compilador detecte errores.
- **La unidad es la versión, no la generación ni el grupo de versiones.** Pool, exclusivos, URL y datos generados son por versión. Los overrides se agrupan por familia solo para no duplicar curación (`specs/02`, D-009).
- Tests obligatorios para `src/lib/generator/` y `src/lib/analysis/`. Van junto al código como `*.test.ts`.
- Commits en español, descriptivos. **Sin trailers de coautoría de Claude** (`Co-Authored-By`, `Claude-Session`): los commits aparecen solo como de Manuel. Lo mismo en PRs: sin la línea "Generated with Claude Code".

## Qué NO hacer

- ❌ No llamar a PokéAPI en runtime ni desde el cliente. Solo desde `scripts/build-data/`, y con caché local.
- ❌ No editar a mano `data/generated/`. Las correcciones van en `data/overrides/`.
- ❌ No contar un método de encuentro sin clasificar: se añade a `scripts/build-data/encounters.ts` con su tipo (D-015).
- ❌ No usar el dex regional de PokéAPI como pool sin filtrar: incluye exclusivos de la otra versión y especies imposibles.
- ❌ No filtrar encuentros por grupo de versiones: siempre por versión (`version_details[].version`).
- ❌ No dar por iguales dos versiones de una familia: lo que cambia va en `versions/{game}.ts`, y Esmeralda y Platino son familias propias.
- ❌ No dar por completos los encuentros de PokéAPI en Gen 6 en adelante: se revisan y se completan en overrides.
- ❌ No contar como disponibles los encuentros que dependen de masivas, Pokéradar, ranura de GBA u otras condiciones de post-juego o hardware.
- ❌ No dar por disponible un encuentro de pesca, Surf, Golpe Roca, etc. antes de que se habilite ese método (`key-items.ts`).
- ❌ No mezclar rareza y dificultad: la dificultad mide combates; la rareza va en "Esfuerzo de captura" (D-011).
- ❌ No inventar datos de líderes, MT o ubicaciones. Si un dato no está verificado, se marca `todo` en el override y el juego no se publica.
- ❌ No curar sin `source`. Cada dato de `data/overrides/` cita una fuente de `data/overrides/sources.ts`.
- ❌ No usar otras webs que las de la jerarquía de fuentes (D-017): PokéAPI → Bulbapedia → Serebii / WikiDex. WikiDex para nombres en español.
- ❌ No adelantar la disponibilidad ante la duda: se asigna el tramo más tardío posible (D-016).
- ❌ No escribir de memoria nombres de lugares en español: se usan los de PokéAPI y, si no los tiene, los de WikiDex.
- ❌ No recomendar un ataque o una MT que el Pokémon no tenga **a tiempo** para ese combate: nivel esperado o MT conseguida antes de ese tramo.
- ❌ No calcular físico/especial por tipo en Gen 1–3: se usa la clase moderna en todos los juegos.
- ❌ No devolver equipos que no pasan la validación. Error claro o nada.
- ❌ No meter dos miembros de la misma línea evolutiva.
- ❌ No usar `Math.random()` en lógica de dominio.
- ❌ No usar sprites, artwork ni estética oficial fuera de los sprites que sirve PokéAPI.
- ❌ No añadir base de datos, auth ni rutas de API en la 1.0.
- ❌ No añadir funciones competitivas (EVs, IVs, sets, Showdown).
- ❌ No añadir estado de partida al modo Ruta ("ya lo tengo", huecos del equipo) en la 1.0: está fuera de alcance (`specs/decisiones.md`, D-008).
- ❌ No recomendar en la Ruta un Pokémon que todavía no se puede capturar en esa parada.
- ❌ No publicar un juego sin su override completo y el validador de datos en verde.
