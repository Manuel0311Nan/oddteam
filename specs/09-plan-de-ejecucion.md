# 09 · Plan de ejecución

**Estado:** Borrador · Vivo (se actualiza al cerrar cada fase)

Orden de construcción de la 1.0, de lo más básico a lo más completo. Cada fase deja algo que funciona y se puede probar. Las fases son incrementales: no se empieza una hasta que la anterior cumple su "Hecho cuando".

> **Rutas:** el código de la web va en `src/` (`app/`, `components/`, `lib/`, `store/`), y `data/`, `scripts/` y `specs/` en la raíz (D-012). En las specs, `lib/…` significa `src/lib/…`.

## Hitos

| Hito | Tras la fase | Qué hay |
|---|---|---|
| **M1 · Esmeralda jugable** | F4 | Generador de equipos válidos para Esmeralda, con URL compartible. Sin análisis de combates. |
| **M2 · Esmeralda completa (beta)** | F8 | Combates, ataques, MT, dificultad, destacados, Ruta y portada. Se puede enseñar. |
| **M3 · 1.0** | F10 | 6 versiones publicadas, nombre y dominio cerrados. |

## Tamaño orientativo

**S** = una sesión · **M** = unas pocas sesiones · **L** = varias semanas de trabajo intermitente. El grueso del esfuerzo está en **curar datos**, no en programar.

---

## F0 · Base del repositorio · S

**Objetivo:** dejar el proyecto listo para trabajar con reglas claras.

- Resolver la decisión `src/` y apuntarla en `decisiones.md` (D-012). Ajustar CLAUDE.md si hace falta.
- Instalar Vitest, Zustand y shadcn/ui (init). Añadir `tsx` para los scripts.
- Scripts en `package.json`: `typecheck`, `test`, `data:build`, `data:featured`.
- TypeScript estricto (`strict`, `noUncheckedIndexedAccess`).
- Crear la estructura de carpetas vacía con un `README` mínimo en `data/overrides/` y `data/generated/`.
- CI en GitHub Actions: lint + typecheck + test en cada PR.
- Conectar con Vercel (preview por PR).
- Añadir `.cache/` al `.gitignore`.

**Hecho cuando:** `pnpm lint && pnpm typecheck && pnpm test` pasa en local y en CI, y hay un deploy de preview.

---

## F1 · Núcleo de dominio · S–M

**Objetivo:** las piezas puras que todo lo demás usa, con tests.

- `lib/types.ts`: `Game`, `Segment`, `PoolEntry`, `Encounter`, `Boss`, `TmEntry`, `Rarity`, opciones del generador (`02`, `03`).
- `lib/rng.ts`: mulberry32, subsemillas, formato `XXXX-XXXX`.
- `lib/url-state.ts`: codificar y decodificar opciones, semilla y huecos fijados.
- `lib/analysis/types.ts`: efectividad de tipos a partir de una tabla de tipos por generación.
- `lib/analysis/constants.ts`: umbrales de rareza y valores por defecto.

**Hecho cuando:** tests verdes de reproducibilidad del RNG, ida y vuelta de la URL y efectividades conocidas (incluido "Hada no existe en Gen 3").

---

## F2 · Pipeline de datos (solo PokéAPI) · M

**Objetivo:** sacar de PokéAPI todo lo que se puede automatizar para Esmeralda, sin curación todavía.

- `scripts/build-data/fetch.ts`: cliente con caché en disco, ritmo moderado y `--fresh`.
- `normalize.ts`: especies, tipos (con `past_types`), stats, sprites, nombres en español, cadenas evolutivas, learnsets por grupo de versiones, movimientos (con `past_values`), MT del grupo, tabla de tipos por generación.
- Encuentros **por versión** con `chance`, método y condiciones, agregados según `02`.
- `write.ts`: `data/generated/emerald/*`, `type-chart/gen-3.json`, `meta.json` con `dataVersion`.
- Un informe en consola de lo que falta (zonas sin tramo, métodos sin habilitar…), que sirve de lista de tareas para F3.

**Hecho cuando:** `pnpm data:build` genera los JSON de Esmeralda desde caché en segundos, y el informe lista lo que hay que curar.

---

## F3 · Curación de Esmeralda · L

**Objetivo:** completar lo que PokéAPI no tiene, con fuentes. Es la fase más larga y la que más importa.

Orden sugerido (cada paso desbloquea al siguiente):

1. `segments.ts`: tramos y `expectedLevel`.
2. `locations.ts`: cada zona con su tramo.
3. `key-items.ts`: cuándo se habilitan las cañas, Surf, Golpe Roca, Buceo…
4. `special-encounters.ts`: regalos, estáticos e intercambios in-game.
5. `evolution-items.ts`: dónde y cuándo se consiguen piedras y objetos.
6. `bosses.ts`: 8 líderes, Alto Mando y campeón, con equipos, niveles, movimientos y MT de recompensa.
7. `tms.ts`: ubicación y tramo de cada MT y MO.
8. `versions/emerald.ts`: correcciones de encuentros y porcentajes revisados.

En paralelo: `merge.ts` y `validate.ts` con todas las reglas de `02`.

Cada override cita su fuente en un comentario. Lo no verificado se marca `TODO`.

**Hecho cuando:** el validador pasa en verde para Esmeralda, sin ningún `TODO`.

---

## F4 · Generador de equipos · M → **M1**

**Objetivo:** primera versión usable.

**Lógica** (`lib/generator/`):
- `filter.ts`: restricciones duras, incluida la rareza.
- `pick.ts`: huecos tempranos, muestreo ponderado y penalización por historial.
- `validate.ts`: tipos, líneas evolutivas, inicial y progresión.
- Errores que dicen qué restricción es imposible.
- Test de muestreo: 10 000 equipos con combinaciones de opciones, 0 inválidos.

**Interfaz** (según el diseño):
- `/emerald` estático, panel de opciones, `PokemonCard` con rareza, `TeamHeader` con semilla y esfuerzo de captura, `AvailabilityTimeline`.
- Fijar y Cambiar, copiar enlace, aviso de `dataVersion` distinta.
- Historial y habituales en `localStorage`, con try/catch.
- Responsive y accesible (`06`).

**Hecho cuando:** se genera, se fija, se cambia y se comparte un equipo de Esmeralda en móvil y escritorio, y ningún equipo generado es imposible.

---

## F5 · Análisis de combates · M

**Objetivo:** el valor diferencial: cómo afrontar cada jefe.

- `lib/analysis/moves.ts`: movimientos disponibles a tiempo (nivel + MT) y puntuación (`04`), con la lista de penalizaciones.
- `lib/analysis/bosses.ts`: miembros disponibles por jefe, veredicto y MT recomendadas.
- Interfaz: `BossTable` con el veredicto y detalle desplegable (`<details>`) con ataques y MT por miembro.
- Tests: nunca se recomienda un ataque fuera de tiempo; clase de daño moderna.

**Hecho cuando:** cada jefe de Esmeralda muestra veredicto, ataques y MT coherentes para varios equipos de prueba revisados a mano.

---

## F6 · Dificultad y destacados · M

**Objetivo:** clasificar equipos y ofrecer sugerencias listas.

- `lib/analysis/difficulty.ts` con los cuatro componentes de `05`.
- Calibración: 5 equipos de referencia de Esmeralda con dificultad conocida, convertidos en test de regresión.
- Filtro de dificultad en el generador y `DifficultyBadge`.
- `scripts/featured/`: genera, puntúa y elige 10 equipos variados por nivel.
- Página `/emerald/destacados` con pestañas y navegación Generador / Destacados.

**Hecho cuando:** los 5 equipos de referencia caen en su nivel y la página de destacados enlaza al generador con su semilla.

---

## F7 · Modo Ruta · M

**Objetivo:** recomendaciones por tramo (`08`).

- `lib/analysis/route.ts`: candidatos, `shortTerm`, `longTerm`, factor de rareza y etiqueta.
- Cálculo en el cliente sobre los enfrentamientos precalculados (D-023: sin `route.json`).
- Selección con semilla, variedad entre paradas y "Ver otras".
- Interfaz: pestañas Equipo / Ruta, `RouteStop`, `RouteCandidateCard`. Diseño de móvil antes de programarlo.
- Tests de `08`.

**Hecho cuando:** la Ruta de Esmeralda no recomienda nada no capturable en su parada ni ataques fuera de tiempo, y es reproducible por semilla.

---

## F8 · Portada, contenido y pulido · S–M → **M2**

**Objetivo:** que se pueda enseñar.

- Portada con tarjetas por familia y botones de versión.
- Página "Cómo funciona": qué es válido, fuentes, dificultad, rareza y limitaciones (clase de daño moderna).
- Estados de carga, error y enlace antiguo.
- Revisión de accesibilidad y rendimiento (LCP < 1,5 s en móvil).
- Metadatos, Open Graph por equipo compartido, favicon propio.
- Aviso legal de proyecto de fans no afiliado.

**Hecho cuando:** Esmeralda completa está en un dominio de preview y se puede compartir con otras personas para pedir opinión.

---

## F9 · Más versiones · L (×3)

**Objetivo:** pasar de 1 a 6 versiones. Se repite el ciclo de F3 por familia, en este orden:

1. **Platino**: valida que el pipeline sirve para Gen 4.
2. **HeartGold + SoulSilver**: primera familia con dos versiones. Valida `versions/{game}.ts` y el cambio de versión en la cabecera.
3. **Negro 2 + Blanco 2**: Gen 5 y estaciones.

Por cada familia: curación de overrides, validador en verde, 5 equipos de referencia para calibrar la dificultad y revisión de la Ruta.

Lo aprendido en cada familia se pasa a las specs y a `decisiones.md` antes de empezar la siguiente.

**Hecho cuando:** las 6 versiones pasan el validador y tienen destacados y Ruta.

---

## F10 · Lanzamiento 1.0 · S → **M3**

- Comprobar dominio y marca (EUIPO/OEPM) y cerrar el nombre (D-010).
- Decidir el encaje con la marca Zoen.
- Dominio propio en Vercel.
- Recoger feedback de las primeras personas y priorizar lo siguiente: más familias, mejoras de la Ruta o arrancar la 2.0 (`07`).

---

## Forma de trabajar con Claude Code

- **Una fase, una rama, una PR.** Las fases grandes (F3, F9) se parten en PR por archivo de override.
- Al empezar una fase se le pide a Claude Code que **lea la spec correspondiente** y proponga las tareas antes de escribir código.
- Al cerrar una fase: actualizar el estado en este documento, anotar decisiones nuevas y marcar las specs implicadas como "Acordado".
- Commits en español y **sin trailers de coautoría**.
- Si durante el desarrollo algo no encaja con una spec, se para y se decide: o se cambia la spec (con entrada en `decisiones.md`) o se cambia el código.

## Riesgos

| Riesgo | Mitigación |
|---|---|
| La curación lleva mucho más de lo previsto | Esmeralda primero y completa; el resto de familias son opcionales para M2. |
| Datos de PokéAPI incompletos o erróneos | Informe de huecos en F2, overrides con fuente y validador que bloquea publicar. |
| La dificultad no "se siente" bien | Equipos de referencia y pesos en constantes; recalibración con feedback y, en la 2.0, con la comunidad. |
| Alcance que crece (más ideas) | Lo que no está en una spec "Acordado" va a una lista de ideas, no al código de la fase en curso. |

## Estado

| Fase | Estado |
|---|---|
| F0 | Casi lista: herramientas, estructura, tema y CI hechos (`pnpm check` y build en verde). Falta subir a GitHub, ver CI en verde y conectar Vercel. |
| F1 | Hecha: tipos, RNG con semilla, opciones y URL (D-013), tabla de tipos y rareza, con 47 tests. |
| F2 | Hecha: pipeline con caché y 2 fuentes (D-014), capa pokeapi de Esmeralda (246 especies, 115 zonas, 765 encuentros, 329 movimientos, 58 MT/MO) e informe de huecos (D-015). 77 tests. |
| F3 | En curso: overrides de Esmeralda con fuentes (114/114 zonas, 58/58 MT/MO, 13 jefes con movimientos), merge y validador (D-016). Pool: 102 formas finales de 93 líneas. Quedan 22 TODO por verificar y reverificar contra Bulbapedia/Serebii/WikiDex lo tomado de otras webs (D-017). |
| F4 | Hecha (M1): generador puro con 15 tests y muestreo de 10 000 equipos sin inválidos; portada, `/[game]` estático, opciones, tarjetas, línea de tiempo, Fijar/Cambiar, enlace reproducible (D-019), historial local y borradores (D-018). Pendiente: ver la preview en Vercel con `ODDTEAM_SHOW_DRAFTS=1`. |
| F5 | Hecha: `analysis/moves.ts` (formas y ataques a tiempo, puntuación) y `analysis/bosses.ts` (precálculo por entrada y jefe, veredicto), `BossTable` desplegable con ataques, MT agrupadas y "elige uno" para las de un solo uso. Premios del Casino fuera (D-020). 31 tests de análisis, 116 en total. |
| F6 | Hecha, con calibración provisional: `analysis/difficulty.ts` (4 componentes), cortes y umbral calibrados (D-021), filtro de dificultad en el generador, `DifficultyBadge` con desglose, `data:featured` (20 000 equipos, 10 por nivel, D-022) y `/emerald/destacados` con pestañas. 5 equipos de referencia provisionales: falta confirmarlos con partidas reales. 139 tests. |
| F7 | Hecha: `analysis/route.ts` (paradas, shortTerm/longTerm, etiquetas, MT del tramo y selección con semilla), `/emerald/ruta` con pestañas Equipo / Ruta / Destacados, "Ver otras" en la URL y opciones de intercambio, legendarios y excluidos. Sin `route.json` (D-023). 154 tests. |
| F8–F10 | Pendiente |
