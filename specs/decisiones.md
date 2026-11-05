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
