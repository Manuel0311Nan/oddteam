# Registro de decisiones

Formato: fecha · decisión · motivo · alternativas descartadas. Las decisiones nuevas se añaden al final.

---

### D-001 · 2026-11-05 · Web, no app nativa
**Motivo:** datos estáticos, generador puro en cliente y URLs compartibles con semilla. No hace falta nada nativo.
**Descartado:** app con Expo. Si se quiere instalar, PWA.

### D-002 · 2026-11-05 · Next.js 15 en lugar de Astro
**Motivo:** la 2.0 trae cuentas y comunidad, y el stack habitual (Next.js + Auth.js + Prisma + Neon) ya está rodado. Las páginas de juego siguen siendo estáticas con `generateStaticParams`.
**Descartado:** Astro con isla React. Encajaba mejor para la 1.0 sola, pero con una 2.0 con backend se añadiría fricción.

### D-003 · 2026-11-05 · 1.0 sin backend; cuentas y comunidad en la 2.0
**Motivo:** el valor principal es el generador en varios juegos. El backend se documenta (`07`) pero no se implementa.

### D-004 · 2026-11-05 · PokéAPI solo en build, más overrides curados
**Motivo:** fair use de PokéAPI, velocidad y datos incompletos (progresión, regalos, líderes, ubicación de MT).

### D-005 · 2026-11-05 · Clase de daño moderna en todos los juegos
**Decisión:** físico/especial se toma siempre de la clasificación moderna de PokéAPI, también en Gen 1–3.
**Motivo:** cálculo simple y coherente entre juegos.
**Consecuencia asumida:** en Gen 1–3 algunas recomendaciones no coinciden con el juego real (p. ej., Bola Sombra es física en Gen 3). Se explica en "Cómo funciona". Podría añadirse un ajuste por juego en el futuro sin cambiar el resto.

### D-006 · 2026-11-05 · Juegos de lanzamiento: Esmeralda, Platino, HeartGold, Negro 2
**Motivo:** progresión lineal por gimnasios y buenos datos en PokéAPI. Mundo abierto queda fuera de la 1.0.
**Estado:** sustituida por D-009.

### D-007 · 2026-11-05 · Nombre provisional "SinRepetir"
**Estado:** sustituida por D-010.

### D-008 · 2026-11-05 · Modo Ruta en la 1.0, sin estado de partida
**Decisión:** se añade un modo que recomienda qué capturar en cada tramo (`08`), dentro de la 1.0.
**Motivo:** reutiliza datos y puntuación de `04`; da ideas progresivas sin imponer un equipo cerrado.
**Fuera por ahora:** marcar lo ya capturado, recomendaciones por hueco del equipo y construir el equipo final desde la Ruta. Se reconsiderarán en una iteración posterior.

### D-009 · 2026-11-05 · La versión es la unidad; overrides por familia
**Decisión:** cada versión (HeartGold, SoulSilver…) es un juego propio con su pool, sus exclusivos y su URL. Los overrides se organizan por familia: una base compartida y un archivo de diferencias por versión (`02`).
**Motivo:** respetar los exclusivos de cada versión sin curar dos veces la historia, las MT y los jefes.
**Lanzamiento:** Esmeralda, Platino, HeartGold, SoulSilver, Negro 2 y Blanco 2 (sustituye a D-006).
**Matiz (D-009):** Esmeralda y Platino son familias propias porque cambian jefes y zonas respecto a sus "hermanos" (Rubí/Zafiro, Diamante/Perla), que se añadirán más adelante como familias separadas.

### D-010 · 2026-11-05 · Nombre: OddTeam
**Decisión:** el proyecto se llama **OddTeam** ("equipo poco común": equipos que no sueles usar).
**Motivo:** expresa el objetivo, se entiende en inglés y español y no usa "Poke" ni términos de la marca Pokémon.
**Descartados:**
- *Teampoke*: "Poke" en el nombre aumenta el riesgo frente a la marca y ya hay nombres parecidos en el nicho (poketeam, PokeRoll).
- *SingularTeam*: en español "singular" es el término oficial de los Pokémon míticos; se leería como "equipo de singulares".
- *RosterLab*: ya existe (software de turnos).
**Pendiente:** comprobar disponibilidad de dominio y buscar la marca en EUIPO/OEPM antes de publicar. Encaje con la marca Zoen / convención "-Lab" sin decidir.

### D-011 · 2026-11-05 · Probabilidad de encuentro y rareza
**Decisión:** se usa la probabilidad de encuentro de PokéAPI (`chance`, método y condiciones), agregada por zona, método y condiciones, para calcular la **rareza** de cada especie en cada tramo (`02`).
**Uso:**
- Generador: opción "Rareza" (por defecto, sin muy raros) e indicador **Esfuerzo de captura**.
- Ruta: factor de rareza en la puntuación.
- Interfaz: rareza y porcentaje visibles en las tarjetas.
**Matices:**
- La rareza **no** entra en la dificultad, que mide combates (`05`); va en un indicador aparte.
- Masivas, Pokéradar y ranura de GBA no cuentan como disponibilidad.
- Pescar, Surf, Golpe Roca, etc. solo cuentan desde que se habilita el método (`key-items.ts`).

### D-012 · 2026-11-05 · Código en `src/`; datos, scripts y specs en la raíz
**Decisión:** `app/`, `components/`, `lib/` y `store/` van dentro de `src/` (alias `@/*` → `src/*`), como los generó create-next-app. `data/`, `scripts/` y `specs/` quedan en la raíz.
**Motivo:** separa el código de la web de los datos curados y los scripts de build, y no obliga a reorganizar lo generado.
**Nota:** en las specs, `lib/…` se refiere a `src/lib/…`.

### D-013 · 2026-11-05 · La URL fija especies, no posiciones
**Decisión:** el parámetro `l` guarda los **ids de especie** de los miembros fijados, y la URL lleva además la `dataVersion` (`d`). "Cambiar" un hueco fija temporalmente al resto y usa una semilla derivada.
**Motivo:** con solo semilla + índices de hueco, un equipo con miembros fijados de generaciones anteriores no se puede reproducir. Así cualquier enlace reproduce el equipo exacto mientras no cambien los datos.
**Detalle:** formato en `specs/03` e implementación en `src/lib/url-state.ts`.

### D-014 · 2026-11-05 · Fuente de PokéAPI: volcado estático en GitHub por defecto
**Decisión:** `data:build` usa por defecto `PokeAPI/api-data` (volcado oficial en GitHub, mismos datos que la API) y permite `--source=pokeapi` para la API en vivo.
**Motivo:** más rápido, sin límites de uso y sin carga para los servidores de PokéAPI. Con caché local, el build completo de un juego tarda segundos.

### D-015 · 2026-11-05 · Capa "pokeapi" separada de la capa final
**Decisión:** la fase F2 escribe lo que sale de PokéAPI en `data/generated/{game}/pokeapi/` junto a un informe (`report.md`); la fase F3 combina esa capa con los overrides en `data/generated/{game}/game.json`.
**Motivo:** permite revisar qué viene de PokéAPI y qué se ha curado, y regenerar una capa sin tocar la otra.
**Detalles aplicados:** métodos de encuentro clasificados por tipo (los desconocidos no cuentan), evoluciones con objetos inexistentes en la generación descartadas, Maldición sin tipo (`specs/02`).

### D-016 · 2026-11-06 · Criterios de curación
**Decisión:**
- **Conservador:** ante la duda, el tramo más tardío posible; nunca se da por disponible antes algo que no consta.
- Una zona toma el tramo de la primera parte del walkthrough que la recorre; Surf, cañas y demás métodos añaden su requisito.
- Las MT de gimnasio cuentan desde el tramo siguiente a ese gimnasio. ~~Las MT del Casino cuentan~~ (corregido en D-020).
- Aparición aleatoria (Isla Espejismo), eventos y accesorios → `excluded`.
- Un intercambio in-game no está disponible antes que la especie que pide.
- La rareza se puede fijar a mano cuando el porcentaje de PokéAPI engaña (Feebas).
- Especies solo del post-juego: fuera del pool, como aviso.
**Motivo:** que el generador nunca proponga un equipo imposible; si se equivoca, que sea por proponer algo más tarde de lo posible.

### D-017 · 2026-11-06 · Jerarquía de fuentes
**Decisión:**
1. **PokéAPI** es la verdad para todo lo que tiene (especies, tipos, estadísticas, movimientos, encuentros, porcentajes, evoluciones, números de MT). Solo se corrige con un motivo documentado (D-016).
2. **Bulbapedia** es la fuente principal para lo que PokéAPI no tiene: orden de la historia, jefes, ubicación de MT, MO, cañas y objetos.
3. **Serebii** y **WikiDex** son fuentes de contraste. **WikiDex** es además la fuente principal de **nombres en español** que PokéAPI no tiene (lugares, objetos, personajes).
4. **Ninguna otra web.** Si un dato no está en estas fuentes, queda como `todo`.

**Motivo:** curar siempre con los mismos sitios, para que los datos sean coherentes entre juegos y se puedan revisar.
**Consecuencia:** los datos de Esmeralda tomados de PokémonDB, Smogon, PokéTools y Dittobase se reverifican contra Bulbapedia (o Serebii/WikiDex); si alguna página de Bulbapedia no se puede consultar, Serebii hace de principal.
**Ejemplo:** el lugar que había traducido como "Barco Abandonado" es oficialmente "Nao Abandonada" según WikiDex.

### D-018 · 2026-11-06 · Juegos en borrador
**Decisión:** un juego con errores o TODO en su curación es un **borrador**. Se ve en desarrollo y con `ODDTEAM_SHOW_DRAFTS=1` (p. ej., en las previews de Vercel), con un aviso visible y `noindex`. En producción sin esa variable no se genera su página.
**Motivo:** poder probar la web con datos reales sin publicar un juego que aún no cumple "Qué NO hacer" (validador en verde).

### D-019 · 2026-11-06 · La URL lleva el equipo completo
**Decisión:** el parámetro `l` guarda las formas finales de **todo** el equipo, no solo los fijados (sustituye a la parte de D-013 sobre `l`).
**Motivo:** el historial local hace menos probables los Pokémon ya usados; con la semilla sola, el mismo enlace daría equipos distintos en otro dispositivo. Con el equipo en la URL el enlace siempre reproduce el mismo equipo; la semilla sigue sirviendo para los siguientes "Generar" y "Cambiar".

### D-020 · 2026-11-06 · Los premios del Casino no cuentan
**Decisión:** las MT que se consiguen con fichas del Casino **no cuentan** como disponibles. Si una MT tiene otra ubicación, se usa esa; si solo está en el Casino, queda `excluded`. Corrige D-016.
**Motivo:** al revisar el análisis de combates, las MT del Casino (Lanzallamas, Rayo Hielo, Psíquico por miles de fichas) aparecían como recomendadas antes del 3er gimnasio. Su coste en fichas no es alcanzable en ese punto de una partida normal, así que inflaban el análisis.

### D-021 · 2026-11-07 · Calibración de la dificultad y destacados siempre al día
**Decisión:**
1. **Cortes de nivel 20 / 30 / 40** (Paseo < 20 ≤ Normal < 30 ≤ Exigente < 40 ≤ Reto) en vez de los iniciales 25 / 50 / 75. Pesos sin cambios (0,30 · 0,40 · 0,15 · 0,15).
2. **El umbral de "ataque eficaz" sube con el nivel** del combate: `120 × máx(1, nivel / 30)` (nv 40 → 160, nv 56 → 224). Afecta al veredicto de `04`.
3. `pnpm data:build` **recalcula los destacados** al terminar (`--no-featured` para saltarlo). `pnpm data:featured` sigue existiendo para recalcularlos solos. La página de destacados no muestra un archivo de otra `dataVersion`.

**Motivo:**
- Con 5 000 equipos de Esmeralda con opciones por defecto, las puntuaciones iban de ~5 a ~52 con los cortes iniciales. No salía ningún equipo Exigente ni Reto.
- Con el umbral fijo de 120, el 100 % de los equipos tenía Ventaja contra Sixto, Nívea y Dracón, porque a nivel 56 casi cualquier ataque del tipo propio pasa de 120.

Con estos cambios, en 20 000 equipos por defecto el reparto es: Paseo ~39 %, Normal ~47 %, Exigente ~12 % y Reto ~1,6 %.

**Pendiente:** los 5 equipos de referencia de `difficulty.test.ts` son **provisionales**: están elegidos por construcción (pronto y fuertes frente a tarde y débiles), no por partidas reales. Manuel los confirma o corrige con su experiencia, y se recalibra.

### D-022 · 2026-11-07 · El inicial no cuenta para la variedad de destacados
**Decisión:** en los destacados, el límite de "ninguna especie en más de 2 equipos del mismo nivel" no se aplica al inicial. Los iniciales se reparten en dos pasadas:
1. Primera pasada: como mucho `ceil(10 / iniciales)` equipos por inicial.
2. Segunda pasada: sin ese límite, si al nivel le faltan equipos.

**Motivo:** con las opciones por defecto todos los equipos llevan uno de los 3 iniciales, así que el límite de 2 dejaba solo 6 equipos por nivel. Además, Swampert casi nunca sale en equipos difíciles.
