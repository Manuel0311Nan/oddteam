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

### D-023 · 2026-11-07 · La Ruta se calcula en el navegador, sin route.json
**Decisión:** no se genera `data/generated/{game}/route.json`. La Ruta se calcula con la función pura `buildRoute` (`src/lib/analysis/route.ts`) a partir de los enfrentamientos que ya se precalculan en el build para el generador (`04`). Se hace en el navegador y con cualquier combinación de opciones. `pickRoute` elige las recomendaciones con la semilla. Sustituye a la sección "Precálculo" de `08`.
**Motivo:**
- Son unas 100 líneas × 9 paradas sobre datos ya calculados, así que tarda milisegundos.
- La spec ya pedía recalcular en el cliente al cambiar legendarios o intercambio. Con un `route.json` habría dos caminos para lo mismo y un archivo más que podría quedarse desfasado respecto a los datos.

**También:**
- Una recomendación por **línea evolutiva** en cada parada (Wurmple → Beautifly o Dustox, Machoke o Machamp): la de mejor puntuación.
- La URL de la Ruta añade `r`, las pulsaciones de "Ver otras" por parada, para que un enlace compartido reproduzca exactamente lo que se ve.
- El factor ×0,5 para especies de tramos anteriores se aplica a `routeScore`, así que afecta tanto a qué candidatos entran en la lista como al muestreo.

### D-024 · 2026-11-07 · Las capturas en la Ruta, para la 2.0
**Decisión:** marcar en la Ruta los Pokémon capturados, con una barra inferior de lo capturado, queda para la **2.0**. Se mantiene D-008: la Ruta de la 1.0 no tiene estado de partida. El diseño acordado está en `07`, "Capturas en la Ruta":
- lo capturado desaparece de las paradas siguientes;
- la barra tiene como mucho 6, y solo muestra la imagen.

**Motivo:** Manuel prefiere no ampliar el alcance de la 1.0. Con cuentas, las capturas se guardan con la partida del jugador.

### D-025 · 2026-11-09 · Tipografía Fredoka
**Decisión:** la tipografía de la interfaz pasa de Bricolage Grotesque a **Fredoka**, de Google Fonts. JetBrains Mono se queda para semillas y números de Pokédex. Se aplica en la web (`layout.tsx`, `--font-sans`) y en el diseño de referencia.
**Motivo:** Manuel quería una letra más cercana a la animación y a los juegos de niños. De las tres opciones que se probaron sobre la interfaz (Fredoka, Baloo 2, y Lilita One con Nunito), Fredoka es la más legible en texto pequeño, como tarjetas y tablas de combates, sin perder el aire infantil.
**Notas:**
- Fredoka llega hasta el peso 700, así que las clases `font-extrabold` (800) se pintan con 700.
- Las imágenes de Open Graph siguen con la letra por defecto de `next/og` hasta que se incluya el archivo de la fuente.

### D-026 · 2026-11-09 · Versión de datos por juego
**Decisión:**
- Cada juego tiene su propia `dataVersion`, guardada en `games.json`. Es el hash de los archivos que ese juego lee: su carpeta, los movimientos y MT de su grupo de versiones, la tabla de tipos de su generación y los nombres de tipos.
- `meta.json` guarda el hash de todas.
- `pnpm data:build --game=x` ya no borra los demás juegos de `games.json`.
- Los juegos sin overrides (sin `game.json`) no salen en la web ni tienen destacados.

**Motivo:** al añadir Platino, construir un solo juego dejaba `games.json` con ese juego y Esmeralda desaparecía. Además, una `dataVersion` global hacía que curar Platino marcara como «datos anteriores» los enlaces de Esmeralda y dejara sus destacados desfasados.

### D-027 · 2026-11-09 · Curación de Sinnoh (Platino)
**Decisión:**
1. **Nombres de lugares de WikiDex.** PokéAPI no trae ningún nombre en español de Sinnoh. Los overrides llevan `name` por zona, sacado de WikiDex. Cuando WikiDex da dos nombres («Ciudad Eterna/Ciudad Vetusta»), se usa el segundo, que es el de los juegos en España: es el mismo que usan sus páginas de gimnasios. Los detalles entre paréntesis (planta, norte/sur) son descriptivos.
2. **Árboles de miel.** Cuentan como encuentro salvaje desde que se consigue la Miel (2º tramo). La rareza es como mínimo «raro» (`minRarity` del método): hay que esperar 6 horas reales y el grupo del árbol es aleatorio. Munchlax queda «muy raro» por su porcentaje.
3. **`pokemon-ranger`** no cuenta: es el huevo de Manaphy traído de otro juego.
4. **Evoluciones por lugar** (Leafeon, Glaceon, Magnezone, Probopass): la elección de método lleva el tramo del lugar.
5. **Supercaña:** en Platino se consigue en la Zona Combate, así que todo lo que solo sale con Supercaña es post-juego.
6. **Movimientos de los jefes:** se toman de WikiDex, que usa los nombres de la 4ª generación («Canto helado», «Foco resplandor»), y se traducen a los identificadores de PokéAPI. En la web se ven con el nombre moderno de PokéAPI («Esquirla Helada», «Cañón Resplandor»).

**Motivo:** cumplir D-016 y D-017 con lo que PokéAPI no da para Sinnoh, sin escribir nombres de memoria ni dar por disponible algo antes de tiempo.

### D-028 · 2026-11-09 · Solo cuenta lo que se captura en el propio juego
**Decisión:**
- **Especies sin encuentro.** Una especie que está en la Pokédex de la versión pero no se puede capturar ni recibir jugando, porque solo llega transferida o intercambiada desde otro juego, no cuenta. Tampoco cuentan sus evoluciones. Se apunta en `versions/{game}.ts` como no obtenible, sin `todo`. En Platino son Murkrow, Misdreavus, Glameow y Stunky, con Honchkrow, Mismagius, Purugly y Skuntank.
- **Objetos evolutivos.** Solo cuentan los que tienen una ubicación fija en el juego. Se cotejan ruta por ruta con la guía de WikiDex del juego y, si la guía no los menciona, con la ficha del objeto en WikiDex o con Bulbapedia. Excavar en el Subsuelo y los objetos equipados en Pokémon salvajes son aleatorios: se anotan, pero no cuentan. Por eso la Escama Dragón queda excluida en Platino.

**Motivo:** decisión de Manuel. Un equipo válido se consigue jugando ese juego, no trayendo Pokémon de fuera ni dependiendo del azar.

### D-029 · 2026-11-11 · Alcance de la historia: Johto o Johto y Kanto
**Decisión:** un juego puede tener varios **alcances**, que son hasta dónde se juega la historia. HeartGold y SoulSilver tienen dos:
- **Solo Johto**, por defecto: hasta el campeón de la Liga;
- **Johto y Kanto**: sigue por los 8 gimnasios de Kanto y acaba en Rojo.

El alcance es una opción más del generador y de la Ruta, no un juego aparte:
- Cada alcance acaba en un tramo (`until`). Se declara en `scopes` del override de la familia, y el primero es el de por defecto.
- Con un alcance, solo entran las líneas que se consiguen **y se completan** dentro de él. Si la forma final necesita un objeto o un lugar de fuera, la línea no cuenta, aunque las primeras formas sí estén.
- La dificultad, la tabla de combates y la Ruta solo cuentan los tramos y jefes de ese alcance.
- En la URL, el alcance va como noveno campo de `o`, con la versión `2` del formato. Sin alcance se sigue escribiendo la versión `1`, así que los enlaces de Esmeralda y Platino no cambian. Un enlace `1` abre el alcance por defecto.
- Los ids de alcance solo llevan minúsculas, cifras y `_`, porque `-` separa los campos de `o`. El validador lo comprueba.
- Los equipos destacados se calculan con el alcance por defecto.

**Motivo:** Manuel quiere poder generar equipos solo con Pokémon de Johto, sin que el generador proponga algo que no aparece hasta Kanto. Duplicar el juego habría duplicado datos, URL y destacados. Con una opción, todo eso se comparte.
**Pendiente:** las recomendaciones para Kanto a partir del equipo de Johto quedan como idea para más adelante.

### D-030 · 2026-11-11 · Curación de HeartGold/SoulSilver
**Decisión:**
1. **Kanto en un solo tramo.** Los 8 gimnasios de Kanto no tienen orden fijo, así que comparten el tramo `kanto`, que cierra Azul (pide las otras 7 medallas). Su nivel esperado es el del as de Azul − 2. Las MT que dan esos gimnasios no se cuentan para esos combates (quedan como post-juego).
2. **Lo que pide las 16 medallas** (Cueva Celeste, Ruta 28, Monte Plateado, Treparrocas) queda fuera de los dos alcances, y también Rojo.
3. **Carpa Pokéathlon.** Su canje por puntos atleta cuenta como ubicación fija de los objetos evolutivos, con su día de la semana. Abre desde el 3er gimnasio. Las piedras que solo canjea con la Pokédex Nacional cuentan desde Kanto. No cuentan: objetos de Pokémon salvajes, regalos por teléfono (llamadas al azar), premios del Concurso de captura de bichos, la Lotería de Ciudad Trigal, el Pokéwalker ni Pokémon Battle Revolution.
4. **Golpe Cabeza.** Los árboles especiales y secretos tienen rareza mínima «raro»: el juego no indica cuáles son.
5. **No cuentan:** los fósiles (salen al azar rompiendo rocas), los huevos de Primo (piden palabras que el juego no da), los bloques de la Zona Safari (llegan con la Pokédex Nacional y tardan días), los premios del Casino (D-020) y el Spearow que se presta en Ciudad Trigal.
6. **Zona Safari** sin bloques: cuenta desde el 7º tramo, cuando ya se pueden hacer los dos retos de Baoba que abren sus zonas.
7. **Frente Batalla:** abre tras ganar la Liga, así que sus premios cuentan desde Kanto.

**Motivo:** aplicar D-016, D-020 y D-028 a lo que tiene de nuevo HGSS: una segunda región sin orden de gimnasios y muchos objetos que solo se canjean.
**Confirmado por Manuel (2026-11-11):** la Carpa Pokéathlon cuenta. Sin ella, en Plata SoulSilver no hay ninguna Piedra Trueno con ubicación fija y Raichu o Jolteon no saldrían.

### D-031 · 2026-11-12 · Rojo Fuego y Verde Hoja entran en la 1.0
**Decisión:** Rojo Fuego y Verde Hoja se añaden como quinta familia (`frlg`), antes de Negro 2 y Blanco 2. La 1.0 pasa a **8 versiones de 5 familias**. Curación:
1. **Una sola historia, sin alcances.** Acaba en la Liga. De las Islas Sete, Prima, Secunda y Tera se visitan tras el 7º gimnasio. Quarta a Sétima, la Cueva Celeste y el camino del Rubí del Monte Ascuas son post-juego.
2. **Pokédex Nacional.** Hasta tenerla, que la da Oak tras la Liga, ningún Pokémon evoluciona a una especie de fuera de Kanto (Golbat no llega a Crobat, ni Eevee a Espeon). Se modela con `nationalDexEvolutions` en el override de la familia: esas evoluciones son post-juego.
3. **Piedras evolutivas.** Las cuatro básicas se compran en el Centro Comercial de Azulona, así que cuentan desde el 3er gimnasio. La Piedra Lunar está en el Monte Moon.
4. **Campeón.** Su equipo depende de tu inicial: se curan las tres variantes (D-032).
5. **Fósiles.** El del Monte Moon es a elegir: Hélix o Domo. El Ámbar Viejo es fijo. Los dos cuentan, al revés que en HGSS, porque no son al azar.

**Motivo:** Manuel quiere tener los remakes de los juegos iniciales. Reutilizan la mayor parte del pipeline y de la curación de Kanto.

### D-032 · 2026-11-12 · Jefes que dependen del inicial
**Decisión:** un jefe puede tener variantes según el inicial que eligió el jugador. Se declara con `ifStarter` en el override del jefe. El campeón de Rojo Fuego y Verde Hoja tiene tres:
- si eliges a Bulbasaur, Azul lleva a Charizard, con Exeggutor y Gyarados;
- si eliges a Charmander, lleva a Blastoise, con Arcanine y Exeggutor;
- si eliges a Squirtle, lleva a Venusaur, con Gyarados y Arcanine.

Pidgeot, Alakazam y Rhydon están en las tres.
- **Si el equipo lleva un inicial**, la tabla de combates y la dificultad usan solo la variante de ese inicial.
- **Si no lleva ninguno**, no se sabe qué inicial eligió el jugador. Salen las tres variantes, cada una marcada con «si elegiste a…», y en la dificultad se reparten el peso de un solo campeón.
- La Ruta no tiene equipo, así que su parada de la Liga cuenta las tres.

**Motivo:** Manuel pasó los tres equipos. Movimientos de la página de Azul en WikiDex; niveles cotejados con Serebii. En dos variantes, el nivel 59 y el 61 están al revés que en la lista de Manuel; se sigue a las dos fuentes, que coinciden.
