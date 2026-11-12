# Informe de datos · firered

Generado por `pnpm data:build`. Lista lo que PokéAPI **no** resuelve y hay que curar en `data/overrides/` (fase F3).

## Resumen

- Versión: `firered` · grupo `firered-leafgreen` · Gen 3 · región `kanto`
- Especies en el dex regional: 151
- Especies con datos: 224
- Zonas con encuentros en esta versión: 139
- Encuentros agregados: 1017 (2 excluidos por condición)
- Especies capturables en estado salvaje: 113
- Especies obtenibles (salvaje, regalo, estático, intercambio, errante): 139
- Especies alcanzables obteniendo o evolucionando: 199
- MT/MO del grupo de versiones: 58

## 1. Métodos de encuentro → `key-items.ts`

Los métodos salvajes necesitan el tramo en que se habilitan (`walk` suele estar desde el principio; cañas, Surf, Golpe Roca… no). Un método **sin clasificar** hay que añadirlo a `scripts/build-data/encounters.ts`.

| Método | Tipo | Encuentros |
|---|---|---|
| `walk` | Salvaje | 479 |
| `super-rod` | Salvaje | 203 |
| `good-rod` | Salvaje | 130 |
| `surf` | Salvaje | 87 |
| `old-rod` | Salvaje | 49 |
| `rock-smash` | Salvaje | 26 |
| `gift` | Regalo | 17 |
| `static` | Estático | 9 |
| `npc-trade` | Intercambio | 9 |
| `roaming-grass` | Errante | 3 |
| `colosseum-bonus-disc-jpn` | Excluido | 2 |
| `pokeflute` | Estático | 2 |
| `gift-egg` | Regalo | 1 |

## 1b. Regalos, estáticos, intercambios y errantes que ya trae PokéAPI → revisar

Hay que comprobarlos, asignarles tramo y marcar los estáticos de una sola oportunidad (`unique`).

- [ ] Regalo: Bulbasaur (#1) · Pallet Town · nv 5 · `gift`
- [ ] Regalo: Charmander (#4) · Pallet Town · nv 5 · `gift`
- [ ] Regalo: Squirtle (#7) · Pallet Town · nv 5 · `gift`
- [ ] Regalo: Clefairy (#35) · Celadon City · nv 8 · `gift`
- [ ] Regalo: Abra (#63) · Celadon City · nv 9 · `gift`
- [ ] Regalo: Hitmonlee (#106) · Saffron City · nv 25 · `gift`
- [ ] Regalo: Hitmonchan (#107) · Saffron City · nv 25 · `gift`
- [ ] Regalo: Scyther (#123) · Celadon City · nv 25 · `gift`
- [ ] Regalo: Magikarp (#129) · Route 3 · nv 5 · `gift`
- [ ] Regalo: Magikarp (#129) · Route 4 · nv 5 · `gift`
- [ ] Regalo: Lapras (#131) · Saffron City · nv 25 · `gift`
- [ ] Regalo: Eevee (#133) · Celadon City · nv 25 · `gift`
- [ ] Regalo: Porygon (#137) · Celadon City · nv 26 · `gift`
- [ ] Regalo: Omanyte (#138) · Cinnabar Island · nv 5 · `gift`
- [ ] Regalo: Kabuto (#140) · Cinnabar Island · nv 5 · `gift`
- [ ] Regalo: Aerodactyl (#142) · Cinnabar Island · nv 5 · `gift`
- [ ] Regalo: Dratini (#147) · Celadon City · nv 18 · `gift`
- [ ] Regalo: Togepi (#175) · Water Labyrinth · nv 5 · `gift-egg`
- [ ] Errante: Raikou (#243) · Roaming Kanto · nv 50 · `roaming-grass`
- [ ] Errante: Entei (#244) · Roaming Kanto · nv 50 · `roaming-grass`
- [ ] Errante: Suicune (#245) · Roaming Kanto · nv 50 · `roaming-grass`
- [ ] Estático: Hypno (#97) · Berry Forest · nv 30 · `static`
- [ ] Estático: Electrode (#101) · Kanto Power Plant · nv 34 · `static`
- [ ] Estático: Snorlax (#143) · Route 12 · nv 30 · `pokeflute`
- [ ] Estático: Snorlax (#143) · Route 16 · nv 30 · `pokeflute`
- [ ] Estático: Articuno (#144) · Seafoam Islands · nv 50 · `static`
- [ ] Estático: Zapdos (#145) · Kanto Power Plant · nv 50 · `static`
- [ ] Estático: Moltres (#146) · Mt. Ember · nv 50 · `static`
- [ ] Estático: Mewtwo (#150) · Cerulean Cave · nv 70 · `static`
- [ ] Estático: Lugia (#249) · Navel Rock · nv 70 · `static`
- [ ] Estático: Ho-Oh (#250) · Navel Rock · nv 70 · `static`
- [ ] Estático: Deoxys (#386) · Birth Island · nv 30 · `static`
- [ ] Intercambio: Nidoran♀ (#29) · Kanto Underground Path · nv 5–100 · `npc-trade`
- [ ] Intercambio: Nidorina (#30) · Route 11 · nv 16–100 · `npc-trade`
- [ ] Intercambio: Farfetch’d (#83) · Vermilion City · nv 5–100 · `npc-trade`
- [ ] Intercambio: Seel (#86) · Cinnabar Island · nv 5–100 · `npc-trade`
- [ ] Intercambio: Electrode (#101) · Cinnabar Island · nv 3–100 · `npc-trade`
- [ ] Intercambio: Lickitung (#108) · Route 18 · nv 33–100 · `npc-trade`
- [ ] Intercambio: Tangela (#114) · Cinnabar Island · nv 5–100 · `npc-trade`
- [ ] Intercambio: Mr. Mime (#122) · Route 2 · nv 5–100 · `npc-trade`
- [ ] Intercambio: Jynx (#124) · Cerulean City · nv 20–100 · `npc-trade`

## 2. Condiciones de encuentro

| Condición | Encuentros | ¿Cuenta? |
|---|---|---|
| `coins-180` | 1 | Sí |
| `coins-2800` | 1 | Sí |
| `coins-500` | 1 | Sí |
| `coins-5500` | 1 | Sí |
| `coins-9999` | 1 | Sí |
| `first-party-pokemon-high-friendship` | 1 | Sí |
| `item-dome-fossil` | 1 | Sí |
| `item-helix-fossil` | 1 | Sí |
| `item-old-amber` | 1 | Sí |
| `starter-bulbasaur` | 1 | Sí |
| `starter-charmander` | 1 | Sí |
| `starter-squirtle` | 1 | Sí |
| `story-progress-beat-elite-four-round-two` | 3 | Sí |
| `trade-abra` | 1 | Sí |
| `trade-golduck` | 1 | Sí |
| `trade-nidoran-m` | 1 | Sí |
| `trade-nidorino` | 1 | Sí |
| `trade-poliwhirl` | 1 | Sí |
| `trade-ponyta` | 1 | Sí |
| `trade-raichu` | 1 | Sí |
| `trade-spearow` | 1 | Sí |
| `trade-venonat` | 1 | Sí |

## 3. Zonas → `locations.ts`

Cada zona necesita su tramo de la historia. Las que no se visitan en la historia (post-juego, Zona Safari…) también se marcan.

139 zonas no tienen nombre en español en PokéAPI; se muestra el inglés hasta que se cure.

| Ubicación | Zonas | Especies distintas |
|---|---|---|
| `berry-forest` | `berry-forest-area` | 16 |
| `birth-island` | `birth-island-area` | 1 |
| `bond-bridge` | `bond-bridge-area` | 14 |
| `canyon-entrance` | `canyon-entrance-area` | 7 |
| `cape-brink` | `cape-brink-area` | 13 |
| `celadon-city` | `celadon-city-area`, `celadon-city-celadon-mansion`, `celadon-city-prize-corner` | 10 |
| `cerulean-cave` | `cerulean-cave-1f`, `cerulean-cave-2f`, `cerulean-cave-b1f` | 19 |
| `cerulean-city` | `cerulean-city-area` | 7 |
| `cinnabar-island` | `cinnabar-island-area`, `cinnabar-island-cinnabar-lab` | 14 |
| `digletts-cave` | `digletts-cave-area` | 2 |
| `dilford-chamber` | `dilford-chamber-area` | 1 |
| `five-island` | `five-island-area` | 9 |
| `five-isle-meadow` | `five-isle-meadow-area` | 14 |
| `four-island` | `four-island-area` | 7 |
| `fuchsia-city` | `fuchsia-city-area` | 6 |
| `green-path` | `green-path-area` | 8 |
| `icefall-cave` | `icefall-cave-1f`, `icefall-cave-b1f`, `icefall-cave-entrance`, `icefall-cave-waterfall` | 19 |
| `kanto-altering-cave` | `kanto-altering-cave-a`, `kanto-altering-cave-b`, `kanto-altering-cave-c`, `kanto-altering-cave-d`, `kanto-altering-cave-e`, `kanto-altering-cave-f`, `kanto-altering-cave-g`, `kanto-altering-cave-h`, `kanto-altering-cave-i` | 9 |
| `kanto-pokecenter` | `kanto-pokecenter-area` | 2 |
| `kanto-power-plant` | `kanto-power-plant-area` | 7 |
| `kanto-route-1` | `kanto-route-1-area` | 2 |
| `kanto-route-10` | `kanto-route-10-area` | 9 |
| `kanto-route-11` | `kanto-route-11-area` | 10 |
| `kanto-route-12` | `kanto-route-12-area` | 11 |
| `kanto-route-13` | `kanto-route-13-area` | 12 |
| `kanto-route-14` | `kanto-route-14-area` | 6 |
| `kanto-route-15` | `kanto-route-15-area` | 6 |
| `kanto-route-16` | `kanto-route-16-area` | 5 |
| `kanto-route-17` | `kanto-route-17-area` | 5 |
| `kanto-route-18` | `kanto-route-18-area` | 6 |
| `kanto-route-2` | `kanto-route-2-north-towards-pewter-city`, `kanto-route-2-south-towards-viridian-city` | 5 |
| `kanto-route-22` | `kanto-route-22-area` | 9 |
| `kanto-route-23` | `kanto-route-23-area` | 12 |
| `kanto-route-24` | `kanto-route-24-area` | 13 |
| `kanto-route-25` | `kanto-route-25-area` | 13 |
| `kanto-route-3` | `kanto-route-3-area`, `kanto-route-3-pokemon-center` | 7 |
| `kanto-route-4` | `kanto-route-4-area`, `kanto-route-4-pokemon-center` | 10 |
| `kanto-route-5` | `kanto-route-5-area` | 3 |
| `kanto-route-6` | `kanto-route-6-area` | 9 |
| `kanto-route-7` | `kanto-route-7-area` | 4 |
| `kanto-route-8` | `kanto-route-8-area` | 4 |
| `kanto-route-9` | `kanto-route-9-area` | 3 |
| `kanto-safari-zone` | `kanto-safari-zone-area-1-east`, `kanto-safari-zone-area-2-north`, `kanto-safari-zone-area-3-west`, `kanto-safari-zone-middle` | 22 |
| `kanto-sea-route-19` | `kanto-sea-route-19-area` | 7 |
| `kanto-sea-route-20` | `kanto-sea-route-20-area` | 7 |
| `kanto-sea-route-21` | `kanto-sea-route-21-area` | 8 |
| `kanto-underground-path` | `kanto-underground-path-area` | 1 |
| `kanto-victory-road-2` | `kanto-victory-road-2-1f`, `kanto-victory-road-2-2f`, `kanto-victory-road-2-3f` | 9 |
| `kindle-road` | `kindle-road-area` | 15 |
| `liptoo-chamber` | `liptoo-chamber-area` | 1 |
| `lost-cave` | `lost-cave-item-rooms`, `lost-cave-room-1`, `lost-cave-room-10`, `lost-cave-room-2`, `lost-cave-room-3`, `lost-cave-room-4`, `lost-cave-room-5`, `lost-cave-room-6`, `lost-cave-room-7`, `lost-cave-room-8`, `lost-cave-room-9` | 5 |
| `memorial-pillar` | `memorial-pillar-area` | 9 |
| `monean-chamber` | `monean-chamber-area` | 1 |
| `mt-ember` | `mt-ember-1f-cave-behind-team-rocket`, `mt-ember-area`, `mt-ember-b1f`, `mt-ember-b2f`, `mt-ember-b3f`, `mt-ember-cave`, `mt-ember-inside`, `mt-ember-summit` | 11 |
| `mt-moon` | `mt-moon-1f`, `mt-moon-b1f`, `mt-moon-b2f` | 4 |
| `navel-rock` | `navel-rock-area` | 2 |
| `one-island` | `one-island-area` | 8 |
| `outcast-island` | `outcast-island-area` | 8 |
| `pallet-town` | `pallet-town-area` | 11 |
| `pattern-bush` | `pattern-bush-area` | 7 |
| `pokemon-mansion` | `pokemon-mansion-1f`, `pokemon-mansion-2f`, `pokemon-mansion-3f`, `pokemon-mansion-b1f` | 7 |
| `pokemon-tower` | `pokemon-tower-3f`, `pokemon-tower-4f`, `pokemon-tower-5f`, `pokemon-tower-6f`, `pokemon-tower-7f` | 3 |
| `resort-gorgeous` | `resort-gorgeous-area` | 9 |
| `rixy-chamber` | `rixy-chamber-area` | 1 |
| `roaming-kanto` | `roaming-kanto-area` | 3 |
| `rock-tunnel` | `rock-tunnel-1f`, `rock-tunnel-b1f` | 6 |
| `ruin-valley` | `ruin-valley-area` | 14 |
| `saffron-city` | `saffron-city-fighting-dojo`, `saffron-city-silph-co-7f` | 3 |
| `scufib-chamber` | `scufib-chamber-area` | 1 |
| `seafoam-islands` | `seafoam-islands-1f`, `seafoam-islands-b1f`, `seafoam-islands-b2f`, `seafoam-islands-b3f`, `seafoam-islands-b4f` | 11 |
| `sevault-canyon` | `sevault-canyon-area` | 11 |
| `ss-anne` | `ss-anne-area` | 7 |
| `tanoby-ruins` | `tanoby-ruins-area` | 8 |
| `three-isle-port` | `three-isle-port-area` | 1 |
| `trainer-tower` | `trainer-tower-area` | 8 |
| `treasure-beach` | `treasure-beach-area` | 12 |
| `vermilion-city` | `vermilion-city-area` | 8 |
| `viapos-chamber` | `viapos-chamber-area` | 1 |
| `viridian-city` | `viridian-city-area` | 6 |
| `viridian-forest` | `viridian-forest-area` | 5 |
| `water-labyrinth` | `water-labyrinth-area` | 10 |
| `water-path` | `water-path-area` | 15 |
| `weepth-chamber` | `weepth-chamber-area` | 1 |

## 4. Especies del dex sin forma conocida de conseguirlas → `special-encounters.ts`

PokéAPI no da ningún encuentro (salvaje, regalo, estático, intercambio) ni se obtienen evolucionando algo obtenible. Pueden ser fósiles, huevos, encuentros que faltan en PokéAPI, exclusivas de otra versión o no obtenibles. Hay que revisarlas una a una.

- [ ] Sandshrew (#27)
- [ ] Sandslash (#28)
- [ ] Vulpix (#37)
- [ ] Ninetales (#38)
- [ ] Bellsprout (#69)
- [ ] Weepinbell (#70)
- [ ] Victreebel (#71)
- [ ] Slowpoke (#79)
- [ ] Slowbro (#80)
- [ ] Staryu (#120)
- [ ] Starmie (#121)
- [ ] Magmar (#126)
- [ ] Pinsir (#127)
- [ ] Mew (#151) · singular

## 5. Evoluciones → `evolution-items.ts` y revisión

### Objetos evolutivos a ubicar (10)

- [ ] `dragon-scale`
- [ ] `fire-stone`
- [ ] `kings-rock`
- [ ] `leaf-stone`
- [ ] `metal-coat`
- [ ] `moon-stone`
- [ ] `sun-stone`
- [ ] `thunder-stone`
- [ ] `up-grade`
- [ ] `water-stone`

### Métodos descartados automáticamente (4)

Usan objetos que no existen en esta generación (PokéAPI mezcla métodos de todos los juegos).

- Sandshrew (#27) → Sandslash (#28): use-item · objeto ice-stone no existe en esta generación
- Vulpix (#37) → Ninetales (#38): use-item · objeto ice-stone no existe en esta generación
- Slowpoke (#79) → Slowbro (#80): use-item · objeto galarica-cuff no existe en esta generación
- Slowpoke (#79) → Slowking (#199): use-item · objeto galarica-wreath no existe en esta generación

### Por intercambio (10) — no válidas sin la opción "Evoluciones por intercambio"

- [ ] Poliwhirl (#61) → Politoed (#186): trade lleva kings-rock
- [ ] Kadabra (#64) → Alakazam (#65): trade
- [ ] Machoke (#67) → Machamp (#68): trade
- [ ] Graveler (#75) → Golem (#76): trade
- [ ] Slowpoke (#79) → Slowking (#199): trade lleva kings-rock
- [ ] Haunter (#93) → Gengar (#94): trade
- [ ] Onix (#95) → Steelix (#208): trade lleva metal-coat
- [ ] Seadra (#117) → Kingdra (#230): trade lleva dragon-scale
- [ ] Scyther (#123) → Scizor (#212): trade lleva metal-coat
- [ ] Porygon (#137) → Porygon2 (#233): trade lleva up-grade

### Con varios métodos posibles (4) — elegir el válido en esta versión

PokéAPI junta métodos de todos los juegos; hay que quedarse con el de esta versión.

- [ ] Rattata (#19) → Raticate (#20): level-up nv 20 | level-up nv 20 night
- [ ] Meowth (#52) → Persian (#53): level-up nv 28 | level-up amistad
- [ ] Voltorb (#100) → Electrode (#101): level-up nv 30 | use-item leaf-stone
- [ ] Cubone (#104) → Marowak (#105): level-up nv 28 | level-up nv 28 night

### Otros disparadores (0)


### Con objeto (24)

- [ ] Pikachu (#25) → Raichu (#26): use-item thunder-stone
- [ ] Nidorina (#30) → Nidoqueen (#31): use-item moon-stone
- [ ] Nidorino (#33) → Nidoking (#34): use-item moon-stone
- [ ] Clefairy (#35) → Clefable (#36): use-item moon-stone
- [ ] Vulpix (#37) → Ninetales (#38): use-item fire-stone
- [ ] Jigglypuff (#39) → Wigglytuff (#40): use-item moon-stone
- [ ] Gloom (#44) → Vileplume (#45): use-item leaf-stone
- [ ] Gloom (#44) → Bellossom (#182): use-item sun-stone
- [ ] Growlithe (#58) → Arcanine (#59): use-item fire-stone
- [ ] Poliwhirl (#61) → Poliwrath (#62): use-item water-stone
- [ ] Poliwhirl (#61) → Politoed (#186): trade lleva kings-rock
- [ ] Weepinbell (#70) → Victreebel (#71): use-item leaf-stone
- [ ] Slowpoke (#79) → Slowking (#199): trade lleva kings-rock
- [ ] Shellder (#90) → Cloyster (#91): use-item water-stone
- [ ] Onix (#95) → Steelix (#208): trade lleva metal-coat
- [ ] Voltorb (#100) → Electrode (#101): level-up nv 30 | use-item leaf-stone
- [ ] Exeggcute (#102) → Exeggutor (#103): use-item leaf-stone
- [ ] Seadra (#117) → Kingdra (#230): trade lleva dragon-scale
- [ ] Staryu (#120) → Starmie (#121): use-item water-stone
- [ ] Scyther (#123) → Scizor (#212): trade lleva metal-coat
- [ ] Eevee (#133) → Vaporeon (#134): use-item water-stone
- [ ] Eevee (#133) → Jolteon (#135): use-item thunder-stone
- [ ] Eevee (#133) → Flareon (#136): use-item fire-stone
- [ ] Porygon (#137) → Porygon2 (#233): trade lleva up-grade

## 6. Legendarios y singulares con encuentro salvaje

Ninguno.

## 7. Otros avisos

- Especies con estadísticas antiguas aplicadas (past_stats): 29
- Movimientos sin nombre en español: 0
- Los porcentajes de PokéAPI se revisan contra una segunda fuente antes de publicar (specs/02).

## Estado de curación (fase F3)

✅ **Listo para publicar**: sin errores ni TODO.

- Zonas con tramo: 138/138
- MT/MO ubicadas: 58/58
- Jefes: 15
- Encuentros que cuentan para la historia: 646
- Pool: 75 entradas (formas finales) de 68 líneas evolutivas

### Avisos (no bloquean)

**solo post-juego** (1)

- [ ] mewtwo solo se obtiene en el post-juego (fuera del pool)
