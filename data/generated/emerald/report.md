# Informe de datos · emerald

Generado por `pnpm data:build`. Lista lo que PokéAPI **no** resuelve y hay que curar en `data/overrides/` (fase F3).

## Resumen

- Versión: `emerald` · grupo `emerald` · Gen 3 · región `hoenn`
- Especies en el dex regional: 202
- Especies con datos: 246
- Zonas con encuentros en esta versión: 115
- Encuentros agregados: 765 (2 excluidos por condición)
- Especies capturables en estado salvaje: 133
- Especies obtenibles (salvaje, regalo, estático, intercambio, errante): 154
- Especies alcanzables obteniendo o evolucionando: 233
- MT/MO del grupo de versiones: 58

## 1. Métodos de encuentro → `key-items.ts`

Los métodos salvajes necesitan el tramo en que se habilitan (`walk` suele estar desde el principio; cañas, Surf, Golpe Roca… no). Un método **sin clasificar** hay que añadirlo a `scripts/build-data/encounters.ts`.

| Método | Tipo | Encuentros |
|---|---|---|
| `walk` | Salvaje | 266 |
| `good-rod` | Salvaje | 140 |
| `surf` | Salvaje | 128 |
| `old-rod` | Salvaje | 97 |
| `super-rod` | Salvaje | 82 |
| `static` | Estático | 13 |
| `gift` | Regalo | 10 |
| `rock-smash` | Salvaje | 8 |
| `seaweed` | Salvaje | 6 |
| `npc-trade` | Intercambio | 4 |
| `colosseum-bonus-disc-jpn` | Excluido | 2 |
| `devon-scope` | Estático | 2 |
| `roaming-grass` | Errante | 2 |
| `roaming-water` | Errante | 2 |
| `wailmer-pail` | Estático | 1 |
| `feebas-tile-fishing` | Salvaje | 1 |
| `gift-egg` | Regalo | 1 |

## 1b. Regalos, estáticos, intercambios y errantes que ya trae PokéAPI → revisar

Hay que comprobarlos, asignarles tramo y marcar los estáticos de una sola oportunidad (`unique`).

- [ ] Regalo: Chikorita (#152) · Villa Raíz · nv 5 · `gift`
- [ ] Regalo: Cyndaquil (#155) · Villa Raíz · nv 5 · `gift`
- [ ] Regalo: Totodile (#158) · Villa Raíz · nv 5 · `gift`
- [ ] Regalo: Treecko (#252) · Ruta 101 · nv 5 · `gift`
- [ ] Regalo: Torchic (#255) · Ruta 101 · nv 5 · `gift`
- [ ] Regalo: Mudkip (#258) · Ruta 101 · nv 5 · `gift`
- [ ] Regalo: Lileep (#345) · Ciudad Férrica · nv 20 · `gift`
- [ ] Regalo: Anorith (#347) · Ciudad Férrica · nv 20 · `gift`
- [ ] Regalo: Castform (#351) · Ruta 119 · nv 25 · `gift`
- [ ] Regalo: Wynaut (#360) · Pueblo Lavacalda · nv 5 · `gift-egg`
- [ ] Regalo: Beldum (#374) · Ciudad Algaria · nv 5 · `gift`
- [ ] Errante: Latias (#380) · Roaming Hoenn · nv 40 · `roaming-grass`
- [ ] Errante: Latias (#380) · Roaming Hoenn · nv 40 · `roaming-water`
- [ ] Errante: Latios (#381) · Roaming Hoenn · nv 40 · `roaming-grass`
- [ ] Errante: Latios (#381) · Roaming Hoenn · nv 40 · `roaming-water`
- [ ] Estático: Voltorb (#100) · Malvalanova · nv 25 · `static`
- [ ] Estático: Electrode (#101) · Malvalanova · nv 30 · `static`
- [ ] Estático: Electrode (#101) · Guarida Aqua · nv 30 · `static`
- [ ] Estático: Electrode (#101) · Guarida Magma · nv 30 · `static`
- [ ] Estático: Mew (#151) · Faraway Island · nv 30 · `static`
- [ ] Estático: Sudowoodo (#185) · Hoenn Battle Frontier · nv 40 · `wailmer-pail`
- [ ] Estático: Kecleon (#352) · Ruta 119 · nv 30 · `devon-scope`
- [ ] Estático: Kecleon (#352) · Ruta 120 · nv 30 · `devon-scope`
- [ ] Estático: Regirock (#377) · Ruinas del Desierto · nv 40 · `static`
- [ ] Estático: Regice (#378) · Cueva Insular · nv 40 · `static`
- [ ] Estático: Registeel (#379) · Tumba Antigua · nv 40 · `static`
- [ ] Estático: Latias (#380) · Isla del Sur · nv 50 · `static`
- [ ] Estático: Latios (#381) · Isla del Sur · nv 50 · `static`
- [ ] Estático: Kyogre (#382) · Marine Cave · nv 70 · `static`
- [ ] Estático: Groudon (#383) · Terra Cave · nv 70 · `static`
- [ ] Estático: Rayquaza (#384) · Pilar Celeste · nv 70 · `static`
- [ ] Intercambio: Meowth (#52) · Hoenn Battle Frontier · nv 5–100 · `npc-trade`
- [ ] Intercambio: Horsea (#116) · Pueblo Oromar · nv 5–100 · `npc-trade`
- [ ] Intercambio: Seedot (#273) · Ciudad Férrica · nv 4–100 · `npc-trade`
- [ ] Intercambio: Plusle (#311) · Ciudad Arborada · nv 5–100 · `npc-trade`

## 2. Condiciones de encuentro

| Condición | Encuentros | ¿Cuenta? |
|---|---|---|
| `item-claw-fossil` | 1 | Sí |
| `item-root-fossil` | 1 | Sí |
| `story-progress-hall-of-fame` | 2 | Sí |
| `trade-bagon` | 1 | Sí |
| `trade-ralts` | 1 | Sí |
| `trade-skitty` | 1 | Sí |
| `trade-volbeat` | 1 | Sí |
| `tv-option-blue` | 1 | Sí |
| `tv-option-red` | 1 | Sí |

## 3. Zonas → `locations.ts`

Cada zona necesita su tramo de la historia. Las que no se visitan en la historia (post-juego, Zona Safari…) también se marcan.

13 zonas no tienen nombre en español en PokéAPI; se muestra el inglés hasta que se cure.

| Ubicación | Zonas | Especies distintas |
|---|---|---|
| `abandoned-ship` | `abandoned-ship-area` | 3 |
| `ancient-tomb` | `ancient-tomb-area` | 1 |
| `artisan-cave` | `artisan-cave-area` | 1 |
| `cave-of-origin` | `cave-of-origin-1f`, `cave-of-origin-b1f`, `cave-of-origin-b2f`, `cave-of-origin-b3f`, `cave-of-origin-entrance` | 3 |
| `desert-ruins` | `desert-ruins-area` | 1 |
| `desert-underpass` | `desert-underpass-area` | 3 |
| `dewford-town` | `dewford-town-area` | 5 |
| `ever-grande-city` | `ever-grande-city-area` | 7 |
| `faraway-island` | `faraway-island-area` | 1 |
| `fiery-path` | `fiery-path-area` | 6 |
| `fortree-city` | `fortree-city-area` | 1 |
| `granite-cave` | `granite-cave-1f`, `granite-cave-1fsmall-room`, `granite-cave-b1f`, `granite-cave-b2f` | 7 |
| `hoenn-altering-cave` | `hoenn-altering-cave-area` | 1 |
| `hoenn-battle-frontier` | `hoenn-battle-frontier-area` | 2 |
| `hoenn-pokecenter` | `hoenn-pokecenter-area` | 2 |
| `hoenn-route-101` | `hoenn-route-101-area` | 6 |
| `hoenn-route-102` | `hoenn-route-102-area` | 10 |
| `hoenn-route-103` | `hoenn-route-103-area` | 8 |
| `hoenn-route-104` | `hoenn-route-104-area` | 7 |
| `hoenn-route-105` | `hoenn-route-105-area` | 5 |
| `hoenn-route-106` | `hoenn-route-106-area` | 5 |
| `hoenn-route-107` | `hoenn-route-107-area` | 5 |
| `hoenn-route-108` | `hoenn-route-108-area` | 5 |
| `hoenn-route-109` | `hoenn-route-109-area` | 5 |
| `hoenn-route-110` | `hoenn-route-110-area` | 11 |
| `hoenn-route-111` | `hoenn-route-111-area` | 9 |
| `hoenn-route-112` | `hoenn-route-112-area` | 2 |
| `hoenn-route-113` | `hoenn-route-113-area` | 3 |
| `hoenn-route-114` | `hoenn-route-114-area` | 10 |
| `hoenn-route-115` | `hoenn-route-115-area` | 9 |
| `hoenn-route-116` | `hoenn-route-116-area` | 6 |
| `hoenn-route-117` | `hoenn-route-117-area` | 9 |
| `hoenn-route-118` | `hoenn-route-118-area` | 11 |
| `hoenn-route-119` | `hoenn-route-119-area`, `hoenn-route-119-weather-institute` | 12 |
| `hoenn-route-120` | `hoenn-route-120-area` | 10 |
| `hoenn-route-121` | `hoenn-route-121-area` | 11 |
| `hoenn-route-122` | `hoenn-route-122-area` | 6 |
| `hoenn-route-123` | `hoenn-route-123-area` | 11 |
| `hoenn-route-124` | `hoenn-route-124-area`, `hoenn-route-124-underwater` | 9 |
| `hoenn-route-125` | `hoenn-route-125-area` | 6 |
| `hoenn-route-126` | `hoenn-route-126-area`, `hoenn-route-126-underwater` | 9 |
| `hoenn-route-127` | `hoenn-route-127-area` | 6 |
| `hoenn-route-128` | `hoenn-route-128-area` | 7 |
| `hoenn-route-129` | `hoenn-route-129-area` | 7 |
| `hoenn-route-130` | `hoenn-route-130-area` | 7 |
| `hoenn-route-131` | `hoenn-route-131-area` | 6 |
| `hoenn-route-132` | `hoenn-route-132-area` | 7 |
| `hoenn-route-133` | `hoenn-route-133-area` | 7 |
| `hoenn-route-134` | `hoenn-route-134-area` | 7 |
| `hoenn-safari-zone` | `hoenn-safari-zone-expansion-north`, `hoenn-safari-zone-expansion-south`, `hoenn-safari-zone-neacro-bike-area`, `hoenn-safari-zone-nwmach-bike-area`, `hoenn-safari-zone-se`, `hoenn-safari-zone-sw` | 38 |
| `hoenn-victory-road` | `hoenn-victory-road-1f`, `hoenn-victory-road-b1f`, `hoenn-victory-road-b2f` | 16 |
| `island-cave` | `island-cave-area` | 1 |
| `jagged-pass` | `jagged-pass-area` | 3 |
| `lavaridge-town` | `lavaridge-town-area` | 1 |
| `lilycove-city` | `lilycove-city-area` | 6 |
| `littleroot-town` | `littleroot-town-area` | 3 |
| `magma-hideout` | `magma-hideout-area` | 3 |
| `marine-cave` | `marine-cave-area` | 1 |
| `meteor-falls` | `meteor-falls-area`, `meteor-falls-b1f`, `meteor-falls-back`, `meteor-falls-backsmall-room` | 8 |
| `mirage-island` | `mirage-island-area` | 1 |
| `mirage-tower` | `mirage-tower-area` | 2 |
| `mossdeep-city` | `mossdeep-city-area`, `mossdeep-city-stevens-house` | 7 |
| `mt-pyre` | `mt-pyre-1f`, `mt-pyre-2f`, `mt-pyre-3f`, `mt-pyre-4f`, `mt-pyre-5f`, `mt-pyre-6f`, `mt-pyre-outside`, `mt-pyre-summit` | 5 |
| `new-mauville` | `new-mauville-area`, `new-mauville-entrance` | 4 |
| `pacifidlog-town` | `pacifidlog-town-area` | 7 |
| `petalburg-city` | `petalburg-city-area` | 4 |
| `petalburg-woods` | `petalburg-woods-area` | 7 |
| `roaming-hoenn` | `roaming-hoenn-area` | 2 |
| `rustboro-city` | `rustboro-city-area` | 3 |
| `rusturf-tunnel` | `rusturf-tunnel-area` | 1 |
| `seafloor-cavern` | `seafloor-cavern-area` | 5 |
| `shoal-cave` | `shoal-cave-b1f`, `shoal-cave-b2f`, `shoal-cave-b3f`, `shoal-cave-high-tide`, `shoal-cave-low-tide` | 7 |
| `sky-pillar` | `sky-pillar-1f`, `sky-pillar-3f`, `sky-pillar-5f`, `sky-pillar-apex` | 6 |
| `slateport-city` | `slateport-city-area` | 5 |
| `sootopolis-city` | `sootopolis-city-area` | 3 |
| `southern-island` | `southern-island-area` | 2 |
| `team-aqua-hideout` | `team-aqua-hideout-area` | 1 |
| `team-magma-hideout` | `team-magma-hideout-area` | 1 |
| `terra-cave` | `terra-cave-area` | 1 |

## 4. Especies del dex sin forma conocida de conseguirlas → `special-encounters.ts`

PokéAPI no da ningún encuentro (salvaje, regalo, estático, intercambio) ni se obtienen evolucionando algo obtenible. Pueden ser fósiles, huevos, encuentros que faltan en PokéAPI, exclusivas de otra versión o no obtenibles. Hay que revisarlas una a una.

- [ ] Surskit (#283)
- [ ] Masquerain (#284)
- [ ] Azurill (#298) · bebé
- [ ] Meditite (#307)
- [ ] Medicham (#308)
- [ ] Roselia (#315)
- [ ] Zangoose (#335)
- [ ] Lunatone (#337)
- [ ] Igglybuff (#174) · bebé
- [ ] Pichu (#172) · bebé
- [ ] Jirachi (#385) · singular
- [ ] Deoxys (#386) · singular

## 5. Evoluciones → `evolution-items.ts` y revisión

### Objetos evolutivos a ubicar (9)

- [ ] `deep-sea-scale`
- [ ] `deep-sea-tooth`
- [ ] `dragon-scale`
- [ ] `fire-stone`
- [ ] `leaf-stone`
- [ ] `moon-stone`
- [ ] `sun-stone`
- [ ] `thunder-stone`
- [ ] `water-stone`

### Métodos descartados automáticamente (3)

Usan objetos que no existen en esta generación (PokéAPI mezcla métodos de todos los juegos).

- Sandshrew (#27) → Sandslash (#28): use-item · objeto ice-stone no existe en esta generación
- Vulpix (#37) → Ninetales (#38): use-item · objeto ice-stone no existe en esta generación
- Feebas (#349) → Milotic (#350): trade · objeto prism-scale no existe en esta generación

### Por intercambio (6) — no válidas sin la opción "Evoluciones por intercambio"

- [ ] Kadabra (#64) → Alakazam (#65): trade
- [ ] Machoke (#67) → Machamp (#68): trade
- [ ] Graveler (#75) → Golem (#76): trade
- [ ] Seadra (#117) → Kingdra (#230): trade lleva dragon-scale
- [ ] Clamperl (#366) → Huntail (#367): trade lleva deep-sea-tooth
- [ ] Clamperl (#366) → Gorebyss (#368): trade lleva deep-sea-scale

### Con varios métodos posibles (3) — elegir el válido en esta versión

PokéAPI junta métodos de todos los juegos; hay que quedarse con el de esta versión.

- [ ] Meowth (#52) → Persian (#53): level-up nv 28 | level-up amistad
- [ ] Voltorb (#100) → Electrode (#101): level-up nv 30 | use-item leaf-stone
- [ ] Cyndaquil (#155) → Quilava (#156): level-up nv 14 | level-up nv 17

### Otros disparadores (1)

- [ ] Nincada (#290) → Shedinja (#292): shed

### Con objeto (14)

- [ ] Pikachu (#25) → Raichu (#26): use-item thunder-stone
- [ ] Vulpix (#37) → Ninetales (#38): use-item fire-stone
- [ ] Jigglypuff (#39) → Wigglytuff (#40): use-item moon-stone
- [ ] Gloom (#44) → Vileplume (#45): use-item leaf-stone
- [ ] Gloom (#44) → Bellossom (#182): use-item sun-stone
- [ ] Voltorb (#100) → Electrode (#101): level-up nv 30 | use-item leaf-stone
- [ ] Seadra (#117) → Kingdra (#230): trade lleva dragon-scale
- [ ] Staryu (#120) → Starmie (#121): use-item water-stone
- [ ] Sunkern (#191) → Sunflora (#192): use-item sun-stone
- [ ] Lombre (#271) → Ludicolo (#272): use-item water-stone
- [ ] Nuzleaf (#274) → Shiftry (#275): use-item leaf-stone
- [ ] Skitty (#300) → Delcatty (#301): use-item moon-stone
- [ ] Clamperl (#366) → Huntail (#367): trade lleva deep-sea-tooth
- [ ] Clamperl (#366) → Gorebyss (#368): trade lleva deep-sea-scale

## 6. Legendarios y singulares con encuentro salvaje

Ninguno.

## 7. Otros avisos

- Especies con estadísticas antiguas aplicadas (past_stats): 29
- Movimientos sin nombre en español: 0
- Los porcentajes de PokéAPI se revisan contra una segunda fuente antes de publicar (specs/02).

## Estado de curación (fase F3)

⛔ **No publicable todavía**: 0 errores y 22 TODO.

- Zonas con tramo: 114/114
- MT/MO ubicadas: 58/58
- Jefes: 13
- Encuentros que cuentan para la historia: 714
- Pool: 102 entradas (formas finales) de 93 líneas evolutivas

### TODO

**zonas** (3)

- [ ] hoenn-route-106-area: Verificar desde qué tramo se puede pescar en la Ruta 106 sin Surf (orilla junto a Pueblo Azuliza)
- [ ] mossdeep-city-stevens-house: Verificar con una fuente que el Beldum de casa de Máximo es post-juego en Esmeralda
- [ ] artisan-cave-area: Verificar con una fuente el acceso a la Cueva Arte (no aparece en las partes del walkthrough)

**objetos evolutivos** (1)

- [ ] water-stone: Las parcelas se encuentran bajo el agua: confirmar si hay alguna antes de Buceo; si no, pasar a gym-7-8

**evoluciones** (3)

- [ ] voltorb→electrode: Confirmar con una fuente de Gen 3
- [ ] cyndaquil→quilava: Confirmar con una fuente de Gen 3
- [ ] meowth→persian: Confirmar con una fuente de Gen 3

**MT** (3)

- [ ] TM12: Confirmar con qué medalla se abre el 5º desafío de la Casa Trampa
- [ ] TM23: Confirmar si la MT23 de Cascada Meteoro requiere Surf o Cascada
- [ ] TM37: Confirmar si la MT37 está en el desierto o en la Ruta 111 sur

**especies sin obtener** (12)

- [ ] lunatone: Confirmar que en Esmeralda solo se obtiene por intercambio
- [ ] surskit: Revisar: ¿solo masivas en Esmeralda?
- [ ] masquerain: Depende de Surskit
- [ ] azurill: Revisar si se considera obtenible por crianza
- [ ] meditite: Revisar si hay encuentros en Esmeralda
- [ ] medicham: Depende de Meditite
- [ ] roselia: Revisar: ¿solo masivas en Esmeralda?
- [ ] zangoose: Revisar si es exclusivo de otra versión en Esmeralda
- [ ] igglybuff: Revisar si se considera obtenible por crianza
- [ ] pichu: Revisar si se considera obtenible por crianza
- [ ] jirachi: Confirmar: no obtenible jugando
- [ ] deoxys: Confirmar: no obtenible jugando

### Avisos (no bloquean)

**solo post-juego** (7)

- [ ] beldum solo se obtiene en el post-juego (fuera del pool)
- [ ] metang solo se obtiene en el post-juego (fuera del pool)
- [ ] metagross solo se obtiene en el post-juego (fuera del pool)
- [ ] latias solo se obtiene en el post-juego (fuera del pool)
- [ ] latios solo se obtiene en el post-juego (fuera del pool)
- [ ] kyogre solo se obtiene en el post-juego (fuera del pool)
- [ ] groudon solo se obtiene en el post-juego (fuera del pool)

**nombres** (12)

- [ ] Zona sin nombre en español en PokéAPI: abandoned-ship-area ("Abandoned Ship")
- [ ] Zona sin nombre en español en PokéAPI: artisan-cave-area ("Artisan Cave")
- [ ] Zona sin nombre en español en PokéAPI: desert-underpass-area ("Desert Underpass")
- [ ] Zona sin nombre en español en PokéAPI: faraway-island-area ("Faraway Island")
- [ ] Zona sin nombre en español en PokéAPI: hoenn-altering-cave-area ("Altering Cave")
- [ ] Zona sin nombre en español en PokéAPI: hoenn-battle-frontier-area ("Hoenn Battle Frontier")
- [ ] Zona sin nombre en español en PokéAPI: magma-hideout-area ("Magma Hideout")
- [ ] Zona sin nombre en español en PokéAPI: marine-cave-area ("Marine Cave")
- [ ] Zona sin nombre en español en PokéAPI: mirage-island-area ("mirage-island (Mirage Island)")
- [ ] Zona sin nombre en español en PokéAPI: mirage-tower-area ("Mirage Tower")
- [ ] Zona sin nombre en español en PokéAPI: roaming-hoenn-area ("Roaming Hoenn")
- [ ] Zona sin nombre en español en PokéAPI: terra-cave-area ("Terra Cave")
