# Informe de datos · platinum

Generado por `pnpm data:build`. Lista lo que PokéAPI **no** resuelve y hay que curar en `data/overrides/` (fase F3).

## Resumen

- Versión: `platinum` · grupo `platinum` · Gen 4 · región `sinnoh`
- Especies en el dex regional: 210
- Especies con datos: 442
- Zonas con encuentros en esta versión: 163
- Encuentros agregados: 2436 (529 excluidos por condición)
- Especies capturables en estado salvaje: 181
- Especies obtenibles (salvaje, regalo, estático, intercambio, errante): 212
- Especies alcanzables obteniendo o evolucionando: 299
- MT/MO del grupo de versiones: 100

## 1. Métodos de encuentro → `key-items.ts`

Los métodos salvajes necesitan el tramo en que se habilitan (`walk` suele estar desde el principio; cañas, Surf, Golpe Roca… no). Un método **sin clasificar** hay que añadirlo a `scripts/build-data/encounters.ts`.

| Método | Tipo | Encuentros |
|---|---|---|
| `walk` | Salvaje | 1716 |
| `honey-tree` | Salvaje | 231 |
| `surf` | Salvaje | 147 |
| `super-rod` | Salvaje | 129 |
| `good-rod` | Salvaje | 115 |
| `old-rod` | Salvaje | 54 |
| `static` | Estático | 14 |
| `gift` | Regalo | 12 |
| `roaming-grass` | Errante | 5 |
| `roaming-water` | Errante | 5 |
| `npc-trade` | Intercambio | 4 |
| `gift-egg` | Regalo | 2 |
| `feebas-tile-fishing` | Salvaje | 1 |
| `pokemon-ranger` | Excluido | 1 |

## 1b. Regalos, estáticos, intercambios y errantes que ya trae PokéAPI → revisar

Hay que comprobarlos, asignarles tramo y marcar los estáticos de una sola oportunidad (`unique`).

- [ ] Regalo: Eevee (#133) · Hearthome City · nv 20 · `gift`
- [ ] Regalo: Porygon (#137) · Veilstone City · nv 25 · `gift`
- [ ] Regalo: Omanyte (#138) · Oreburgh City · nv 20 · `gift`
- [ ] Regalo: Kabuto (#140) · Oreburgh City · nv 20 · `gift`
- [ ] Regalo: Aerodactyl (#142) · Oreburgh City · nv 20 · `gift`
- [ ] Regalo: Togepi (#175) · Eterna City · nv 1 · `gift-egg`
- [ ] Regalo: Lileep (#345) · Oreburgh City · nv 20 · `gift`
- [ ] Regalo: Anorith (#347) · Oreburgh City · nv 20 · `gift`
- [ ] Regalo: Turtwig (#387) · Route 201 · nv 5 · `gift`
- [ ] Regalo: Chimchar (#390) · Route 201 · nv 5 · `gift`
- [ ] Regalo: Piplup (#393) · Route 201 · nv 5 · `gift`
- [ ] Regalo: Cranidos (#408) · Oreburgh City · nv 20 · `gift`
- [ ] Regalo: Shieldon (#410) · Oreburgh City · nv 20 · `gift`
- [ ] Regalo: Riolu (#447) · Iron Island · nv 1 · `gift-egg`
- [ ] Errante: Articuno (#144) · Roaming Sinnoh · nv 60 · `roaming-grass`
- [ ] Errante: Articuno (#144) · Roaming Sinnoh · nv 60 · `roaming-water`
- [ ] Errante: Zapdos (#145) · Roaming Sinnoh · nv 60 · `roaming-grass`
- [ ] Errante: Zapdos (#145) · Roaming Sinnoh · nv 60 · `roaming-water`
- [ ] Errante: Moltres (#146) · Roaming Sinnoh · nv 60 · `roaming-grass`
- [ ] Errante: Moltres (#146) · Roaming Sinnoh · nv 60 · `roaming-water`
- [ ] Errante: Mesprit (#481) · Roaming Sinnoh · nv 50 · `roaming-grass`
- [ ] Errante: Mesprit (#481) · Roaming Sinnoh · nv 50 · `roaming-water`
- [ ] Errante: Cresselia (#488) · Roaming Sinnoh · nv 50 · `roaming-grass`
- [ ] Errante: Cresselia (#488) · Roaming Sinnoh · nv 50 · `roaming-water`
- [ ] Estático: Drifloon (#425) · Valley Windworks · nv 15 · `static`
- [ ] Estático: Spiritomb (#442) · Route 209 · nv 25 · `static`
- [ ] Estático: Rotom (#479) · Old Chateau · nv 20 · `static`
- [ ] Estático: Uxie (#480) · Lake Acuity · nv 50 · `static`
- [ ] Estático: Azelf (#482) · Lake Valor · nv 50 · `static`
- [ ] Estático: Dialga (#483) · Spear Pillar · nv 70 · `static`
- [ ] Estático: Palkia (#484) · Spear Pillar · nv 70 · `static`
- [ ] Estático: Heatran (#485) · Stark Mountain · nv 50 · `static`
- [ ] Estático: Regigigas (#486) · Snowpoint Temple · nv 1 · `static`
- [ ] Estático: Giratina (#487) · Distortion World · nv 47 · `static`
- [ ] Estático: Giratina (#487) · Turnback Cave · nv 47 · `static`
- [ ] Estático: Darkrai (#491) · Newmoon Island · nv 50 · `static`
- [ ] Estático: Shaymin (#492) · Flower Paradise · nv 30 · `static`
- [ ] Estático: Arceus (#493) · Hall of Origin · nv 80 · `static`
- [ ] Intercambio: Abra (#63) · Oreburgh City · nv 1–100 · `npc-trade`
- [ ] Intercambio: Haunter (#93) · Snowpoint City · nv 37–100 · `npc-trade`
- [ ] Intercambio: Magikarp (#129) · Sea Route 226 · nv 1–100 · `npc-trade`
- [ ] Intercambio: Chatot (#441) · Eterna City · nv 1–100 · `npc-trade`

## 2. Condiciones de encuentro

| Condición | Encuentros | ¿Cuenta? |
|---|---|---|
| `backlot-mentioned` | 16 | Sí |
| `backlot-not-mentioned` | 2 | Sí |
| `great-marsh-daily-slot-1-of-32` | 24 | Sí |
| `great-marsh-daily-slot-15-of-32` | 6 | Sí |
| `great-marsh-daily-slot-2-of-32` | 48 | Sí |
| `great-marsh-daily-slot-3-of-32` | 6 | Sí |
| `great-marsh-daily-slot-4-of-32` | 6 | Sí |
| `great-marsh-daily-slot-5-of-32` | 6 | Sí |
| `great-marsh-daily-slot-none` | 6 | Sí |
| `honey-tree-group-a` | 105 | Sí |
| `honey-tree-group-b` | 105 | Sí |
| `honey-tree-group-c` | 21 | Sí |
| `item-adamant-orb` | 1 | Sí |
| `item-armor-fossil` | 1 | Sí |
| `item-claw-fossil` | 1 | Sí |
| `item-dome-fossil` | 1 | Sí |
| `item-helix-fossil` | 1 | Sí |
| `item-lustrous-orb` | 1 | Sí |
| `item-odd-keystone` | 1 | Sí |
| `item-old-amber` | 1 | Sí |
| `item-root-fossil` | 1 | Sí |
| `item-skull-fossil` | 1 | Sí |
| `other-giratina-not-caught-in-distortion-world` | 1 | Sí |
| `other-regirock-regice-registeel-in-party` | 1 | Sí |
| `other-talk-to-cynthias-grandmother` | 2 | Sí |
| `other-talked-to-32-people-underground` | 1 | Sí |
| `radar-off` | 118 | Sí |
| `radar-on` | 50 | No |
| `slot2-emerald` | 96 | No |
| `slot2-firered` | 97 | No |
| `slot2-leafgreen` | 101 | No |
| `slot2-none` | 108 | Sí |
| `slot2-ruby` | 80 | No |
| `slot2-sapphire` | 81 | No |
| `story-progress-beat-galactic-coronet` | 2 | Sí |
| `story-progress-beat-team-galactic-iron-island` | 1 | Sí |
| `story-progress-before-national-dex` | 6 | Sí |
| `story-progress-cure-eldritch-nightmares` | 2 | Sí |
| `story-progress-defeat-jupiter` | 1 | Sí |
| `story-progress-defeat-mars` | 1 | Sí |
| `story-progress-hall-of-fame` | 2 | Sí |
| `story-progress-national-dex` | 64 | Sí |
| `story-progress-oak-eterna-city` | 6 | Sí |
| `swarm-no` | 44 | Sí |
| `swarm-yes` | 23 | No |
| `time-day` | 112 | Sí |
| `time-morning` | 116 | Sí |
| `time-night` | 112 | Sí |
| `trade-buizel` | 1 | Sí |
| `trade-finneon` | 1 | Sí |
| `trade-machop` | 1 | Sí |
| `trade-medicham` | 1 | Sí |

## 3. Zonas → `locations.ts`

Cada zona necesita su tramo de la historia. Las que no se visitan en la historia (post-juego, Zona Safari…) también se marcan.

163 zonas no tienen nombre en español en PokéAPI; se muestra el inglés hasta que se cure.

| Ubicación | Zonas | Especies distintas |
|---|---|---|
| `acuity-lakefront` | `acuity-lakefront-area` | 5 |
| `canalave-city` | `canalave-city-area` | 9 |
| `celestic-town` | `celestic-town-area` | 8 |
| `distortion-world` | `distortion-world-area` | 1 |
| `eterna-city` | `eterna-city-area`, `eterna-city-eterna-condominiums`, `eterna-city-west-gate` | 8 |
| `eterna-forest` | `eterna-forest-area` | 25 |
| `floaroma-meadow` | `floaroma-meadow-area` | 7 |
| `flower-paradise` | `flower-paradise-area` | 1 |
| `fuego-ironworks` | `fuego-ironworks-area` | 20 |
| `great-marsh` | `great-marsh-area-1`, `great-marsh-area-2`, `great-marsh-area-3`, `great-marsh-area-4`, `great-marsh-area-5`, `great-marsh-area-6` | 25 |
| `hearthome-city` | `hearthome-city-area` | 1 |
| `iron-island` | `iron-island-1f`, `iron-island-area`, `iron-island-b1f-left`, `iron-island-b1f-right`, `iron-island-b2f-left`, `iron-island-b2f-right`, `iron-island-b3f` | 18 |
| `lake-acuity` | `lake-acuity-area`, `lake-acuity-cavern` | 14 |
| `lake-valor` | `lake-valor-area`, `lake-valor-cavern` | 12 |
| `lake-verity` | `lake-verity-after-galactic-intervention`, `lake-verity-before-galactic-intervention` | 11 |
| `lost-tower` | `lost-tower-1f`, `lost-tower-2f`, `lost-tower-3f`, `lost-tower-4f`, `lost-tower-5f` | 4 |
| `maniac-tunnel` | `maniac-tunnel-26-plus-different-unown-caught` | 2 |
| `mt-coronet` | `mt-coronet-1f-from-exterior`, `mt-coronet-1f-route-207`, `mt-coronet-1f-route-211`, `mt-coronet-1f-route-216`, `mt-coronet-2f`, `mt-coronet-3f`, `mt-coronet-4f`, `mt-coronet-4f-small-room`, `mt-coronet-5f`, `mt-coronet-6f`, `mt-coronet-b1f`, `mt-coronet-exterior-blizzard`, `mt-coronet-exterior-snowfall` | 29 |
| `newmoon-island` | `newmoon-island-area` | 1 |
| `old-chateau` | `old-chateau-2f`, `old-chateau-2f-left-room`, `old-chateau-2f-leftmost-room`, `old-chateau-2f-middle-room`, `old-chateau-2f-private-room`, `old-chateau-2f-right-room`, `old-chateau-2f-rightmost-room`, `old-chateau-dining-room`, `old-chateau-entrance` | 3 |
| `oreburgh-city` | `oreburgh-city-north-west-house`, `oreburgh-city-oreburgh-mining-museum` | 8 |
| `oreburgh-gate` | `oreburgh-gate-1f`, `oreburgh-gate-b1f` | 9 |
| `oreburgh-mine` | `oreburgh-mine-1f`, `oreburgh-mine-b1f` | 3 |
| `pastoria-city` | `pastoria-city-area` | 9 |
| `ravaged-path` | `ravaged-path-area` | 8 |
| `resort-area` | `resort-area-area` | 3 |
| `roaming-sinnoh` | `roaming-sinnoh-area` | 5 |
| `ruin-maniac-cave` | `ruin-maniac-cave-0-9-different-unown-caught`, `ruin-maniac-cave-10-25-different-unown-caught` | 2 |
| `sendoff-spring` | `sendoff-spring-area` | 13 |
| `sinnoh-hall-of-origin-1` | `sinnoh-hall-of-origin-1-area` | 1 |
| `sinnoh-pokemart` | `sinnoh-pokemart-area` | 1 |
| `sinnoh-pokemon-league` | `sinnoh-pokemon-league-area` | 8 |
| `sinnoh-route-201` | `sinnoh-route-201-area` | 10 |
| `sinnoh-route-202` | `sinnoh-route-202-area` | 7 |
| `sinnoh-route-203` | `sinnoh-route-203-area` | 16 |
| `sinnoh-route-204` | `sinnoh-route-204-north-towards-floaroma-town`, `sinnoh-route-204-south-towards-jubilife-city` | 19 |
| `sinnoh-route-205` | `sinnoh-route-205-east-towards-eterna-city`, `sinnoh-route-205-south-towards-floaroma-town` | 33 |
| `sinnoh-route-206` | `sinnoh-route-206-area` | 15 |
| `sinnoh-route-207` | `sinnoh-route-207-area` | 14 |
| `sinnoh-route-208` | `sinnoh-route-208-area` | 23 |
| `sinnoh-route-209` | `sinnoh-route-209-area` | 24 |
| `sinnoh-route-210` | `sinnoh-route-210-south-towards-solaceon-town`, `sinnoh-route-210-west-towards-celestic-town` | 34 |
| `sinnoh-route-211` | `sinnoh-route-211-east-towards-celestic-town`, `sinnoh-route-211-west-towards-eterna-city` | 19 |
| `sinnoh-route-212` | `sinnoh-route-212-east-towards-pastoria-city`, `sinnoh-route-212-north-towards-hearthome-city` | 32 |
| `sinnoh-route-213` | `sinnoh-route-213-area` | 19 |
| `sinnoh-route-214` | `sinnoh-route-214-area` | 21 |
| `sinnoh-route-215` | `sinnoh-route-215-area` | 14 |
| `sinnoh-route-216` | `sinnoh-route-216-area` | 7 |
| `sinnoh-route-217` | `sinnoh-route-217-area` | 7 |
| `sinnoh-route-218` | `sinnoh-route-218-area` | 19 |
| `sinnoh-route-219` | `sinnoh-route-219-area` | 8 |
| `sinnoh-route-221` | `sinnoh-route-221-area` | 22 |
| `sinnoh-route-222` | `sinnoh-route-222-area` | 23 |
| `sinnoh-route-224` | `sinnoh-route-224-area` | 18 |
| `sinnoh-route-225` | `sinnoh-route-225-area` | 16 |
| `sinnoh-route-227` | `sinnoh-route-227-area` | 17 |
| `sinnoh-route-228` | `sinnoh-route-228-area` | 14 |
| `sinnoh-route-229` | `sinnoh-route-229-area` | 20 |
| `sinnoh-sea-route-220` | `sinnoh-sea-route-220-area` | 9 |
| `sinnoh-sea-route-223` | `sinnoh-sea-route-223-area` | 9 |
| `sinnoh-sea-route-226` | `sinnoh-sea-route-226-area`, `sinnoh-sea-route-226-island-house` | 17 |
| `sinnoh-sea-route-230` | `sinnoh-sea-route-230-area` | 18 |
| `sinnoh-victory-road` | `sinnoh-victory-road-1f`, `sinnoh-victory-road-2f`, `sinnoh-victory-road-b1f`, `sinnoh-victory-road-inside`, `sinnoh-victory-road-inside-b1f`, `sinnoh-victory-road-inside-exit` | 14 |
| `snowpoint-city` | `snowpoint-city-north-west-house` | 1 |
| `snowpoint-temple` | `snowpoint-temple-1f`, `snowpoint-temple-b1f`, `snowpoint-temple-b2f`, `snowpoint-temple-b3f`, `snowpoint-temple-b4f`, `snowpoint-temple-b5f` | 5 |
| `solaceon-ruins` | `solaceon-ruins-1f`, `solaceon-ruins-2f`, `solaceon-ruins-b1f-a`, `solaceon-ruins-b1f-b`, `solaceon-ruins-b1f-c`, `solaceon-ruins-b2f-a`, `solaceon-ruins-b2f-b`, `solaceon-ruins-b2f-c`, `solaceon-ruins-b3f-a`, `solaceon-ruins-b3f-b`, `solaceon-ruins-b3f-c`, `solaceon-ruins-b3f-d`, `solaceon-ruins-b3f-e`, `solaceon-ruins-b4f-a`, `solaceon-ruins-b4f-b`, `solaceon-ruins-b4f-c`, `solaceon-ruins-b4f-d`, `solaceon-ruins-b5f` | 1 |
| `spear-pillar` | `spear-pillar-area` | 2 |
| `stark-mountain` | `stark-mountain-area`, `stark-mountain-entrance`, `stark-mountain-heatran-chamber`, `stark-mountain-inside` | 14 |
| `sunyshore-city` | `sunyshore-city-area` | 9 |
| `trophy-garden` | `trophy-garden-area` | 21 |
| `turnback-cave` | `turnback-cave-after-pillar-3`, `turnback-cave-before-pillar-1`, `turnback-cave-between-pillars-1-and-2`, `turnback-cave-between-pillars-2-and-3`, `turnback-cave-pillar-1`, `turnback-cave-pillar-2`, `turnback-cave-pillar-3` | 12 |
| `twinleaf-town` | `twinleaf-town-area` | 6 |
| `valley-windworks` | `valley-windworks-area` | 22 |
| `valor-lakefront` | `valor-lakefront-area` | 7 |
| `veilstone-city` | `veilstone-city-area` | 1 |
| `wayward-cave` | `wayward-cave-1f`, `wayward-cave-b1f` | 6 |

## 4. Especies del dex sin forma conocida de conseguirlas → `special-encounters.ts`

PokéAPI no da ningún encuentro (salvaje, regalo, estático, intercambio) ni se obtienen evolucionando algo obtenible. Pueden ser fósiles, huevos, encuentros que faltan en PokéAPI, exclusivas de otra versión o no obtenibles. Hay que revisarlas una a una.

- [ ] Misdreavus (#200)
- [ ] Mismagius (#429)
- [ ] Murkrow (#198)
- [ ] Honchkrow (#430)
- [ ] Glameow (#431)
- [ ] Purugly (#432)
- [ ] Stunky (#434)
- [ ] Skuntank (#435)
- [ ] Manaphy (#490) · singular
- [ ] Elekid (#239) · bebé
- [ ] Magby (#240) · bebé

## 5. Evoluciones → `evolution-items.ts` y revisión

### Objetos evolutivos a ubicar (21)

- [ ] `dawn-stone`
- [ ] `dragon-scale`
- [ ] `dubious-disc`
- [ ] `dusk-stone`
- [ ] `electirizer`
- [ ] `fire-stone`
- [ ] `kings-rock`
- [ ] `leaf-stone`
- [ ] `magmarizer`
- [ ] `metal-coat`
- [ ] `moon-stone`
- [ ] `oval-stone`
- [ ] `protector`
- [ ] `razor-claw`
- [ ] `razor-fang`
- [ ] `reaper-cloth`
- [ ] `shiny-stone`
- [ ] `sun-stone`
- [ ] `thunder-stone`
- [ ] `up-grade`
- [ ] `water-stone`

### Métodos descartados automáticamente (6)

Usan objetos que no existen en esta generación (PokéAPI mezcla métodos de todos los juegos).

- Sandshrew (#27) → Sandslash (#28): use-item · objeto ice-stone no existe en esta generación
- Vulpix (#37) → Ninetales (#38): use-item · objeto ice-stone no existe en esta generación
- Slowpoke (#79) → Slowbro (#80): use-item · objeto galarica-cuff no existe en esta generación
- Slowpoke (#79) → Slowking (#199): use-item · objeto galarica-wreath no existe en esta generación
- Eevee (#133) → Glaceon (#471): use-item · objeto ice-stone no existe en esta generación
- Feebas (#349) → Milotic (#350): trade · objeto prism-scale no existe en esta generación

### Por intercambio (15) — no válidas sin la opción "Evoluciones por intercambio"

- [ ] Poliwhirl (#61) → Politoed (#186): trade lleva kings-rock
- [ ] Kadabra (#64) → Alakazam (#65): trade
- [ ] Machoke (#67) → Machamp (#68): trade
- [ ] Graveler (#75) → Golem (#76): trade
- [ ] Slowpoke (#79) → Slowking (#199): trade lleva kings-rock
- [ ] Haunter (#93) → Gengar (#94): trade
- [ ] Onix (#95) → Steelix (#208): trade lleva metal-coat
- [ ] Rhydon (#112) → Rhyperior (#464): trade lleva protector
- [ ] Seadra (#117) → Kingdra (#230): trade lleva dragon-scale
- [ ] Scyther (#123) → Scizor (#212): trade lleva metal-coat
- [ ] Electabuzz (#125) → Electivire (#466): trade lleva electirizer
- [ ] Magmar (#126) → Magmortar (#467): trade lleva magmarizer
- [ ] Porygon (#137) → Porygon2 (#233): trade lleva up-grade
- [ ] Porygon2 (#233) → Porygon-Z (#474): trade lleva dubious-disc
- [ ] Dusclops (#356) → Dusknoir (#477): trade lleva reaper-cloth

### Con varios métodos posibles (8) — elegir el válido en esta versión

PokéAPI junta métodos de todos los juegos; hay que quedarse con el de esta versión.

- [ ] Rattata (#19) → Raticate (#20): level-up nv 20 | level-up nv 20 night
- [ ] Meowth (#52) → Persian (#53): level-up nv 28 | level-up amistad
- [ ] Magneton (#82) → Magnezone (#462): level-up mt-coronet | level-up chargestone-cave | level-up kalos-route-13 | level-up blush-mountain | level-up vast-poni-canyon | use-item thunder-stone | level-up new-mauville
- [ ] Voltorb (#100) → Electrode (#101): level-up nv 30 | use-item leaf-stone
- [ ] Cubone (#104) → Marowak (#105): level-up nv 28 | level-up nv 28 night
- [ ] Eevee (#133) → Leafeon (#470): level-up eterna-forest | level-up pinwheel-forest | level-up kalos-route-20 | use-item leaf-stone | level-up petalburg-woods | level-up lush-jungle
- [ ] Eevee (#133) → Glaceon (#471): level-up sinnoh-route-217 | level-up twist-mountain | level-up frost-cavern | level-up shoal-cave | level-up mount-lanakila
- [ ] Nosepass (#299) → Probopass (#476): level-up mt-coronet | level-up chargestone-cave | level-up kalos-route-13 | level-up blush-mountain | level-up vast-poni-canyon | use-item thunder-stone | level-up new-mauville

### Otros disparadores (1)

- [ ] Nincada (#290) → Shedinja (#292): shed

### Con objeto (45)

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
- [ ] Magneton (#82) → Magnezone (#462): level-up mt-coronet | level-up chargestone-cave | level-up kalos-route-13 | level-up blush-mountain | level-up vast-poni-canyon | use-item thunder-stone | level-up new-mauville
- [ ] Shellder (#90) → Cloyster (#91): use-item water-stone
- [ ] Onix (#95) → Steelix (#208): trade lleva metal-coat
- [ ] Voltorb (#100) → Electrode (#101): level-up nv 30 | use-item leaf-stone
- [ ] Exeggcute (#102) → Exeggutor (#103): use-item leaf-stone
- [ ] Rhydon (#112) → Rhyperior (#464): trade lleva protector
- [ ] Happiny (#440) → Chansey (#113): level-up lleva oval-stone day
- [ ] Seadra (#117) → Kingdra (#230): trade lleva dragon-scale
- [ ] Staryu (#120) → Starmie (#121): use-item water-stone
- [ ] Scyther (#123) → Scizor (#212): trade lleva metal-coat
- [ ] Electabuzz (#125) → Electivire (#466): trade lleva electirizer
- [ ] Magmar (#126) → Magmortar (#467): trade lleva magmarizer
- [ ] Eevee (#133) → Vaporeon (#134): use-item water-stone
- [ ] Eevee (#133) → Jolteon (#135): use-item thunder-stone
- [ ] Eevee (#133) → Flareon (#136): use-item fire-stone
- [ ] Eevee (#133) → Leafeon (#470): level-up eterna-forest | level-up pinwheel-forest | level-up kalos-route-20 | use-item leaf-stone | level-up petalburg-woods | level-up lush-jungle
- [ ] Porygon (#137) → Porygon2 (#233): trade lleva up-grade
- [ ] Porygon2 (#233) → Porygon-Z (#474): trade lleva dubious-disc
- [ ] Togetic (#176) → Togekiss (#468): use-item shiny-stone
- [ ] Sunkern (#191) → Sunflora (#192): use-item sun-stone
- [ ] Murkrow (#198) → Honchkrow (#430): use-item dusk-stone
- [ ] Misdreavus (#200) → Mismagius (#429): use-item dusk-stone
- [ ] Gligar (#207) → Gliscor (#472): level-up lleva razor-fang night
- [ ] Sneasel (#215) → Weavile (#461): level-up lleva razor-claw night
- [ ] Lombre (#271) → Ludicolo (#272): use-item water-stone
- [ ] Nuzleaf (#274) → Shiftry (#275): use-item leaf-stone
- [ ] Kirlia (#281) → Gallade (#475): use-item dawn-stone
- [ ] Nosepass (#299) → Probopass (#476): level-up mt-coronet | level-up chargestone-cave | level-up kalos-route-13 | level-up blush-mountain | level-up vast-poni-canyon | use-item thunder-stone | level-up new-mauville
- [ ] Skitty (#300) → Delcatty (#301): use-item moon-stone
- [ ] Roselia (#315) → Roserade (#407): use-item shiny-stone
- [ ] Dusclops (#356) → Dusknoir (#477): trade lleva reaper-cloth
- [ ] Snorunt (#361) → Froslass (#478): use-item dawn-stone

## 6. Legendarios y singulares con encuentro salvaje

Ninguno.

## 7. Otros avisos

- Especies con estadísticas antiguas aplicadas (past_stats): 45
- Movimientos sin nombre en español: 0
- Los porcentajes de PokéAPI se revisan contra una segunda fuente antes de publicar (specs/02).

## Estado de curación (fase F3)

⛔ **No publicable todavía**: 0 errores y 18 TODO.

- Zonas con tramo: 162/162
- MT/MO ubicadas: 100/100
- Jefes: 13
- Encuentros que cuentan para la historia: 1351
- Pool: 104 entradas (formas finales) de 83 líneas evolutivas

### TODO

**zonas** (1)

- [ ] oreburgh-gate-b1f: Confirmar qué MO hace falta para el sótano de la Puerta Pirita en Platino

**condiciones** (12)

- [ ] great-marsh-daily-slot-1-of-32: Confirmar si los Pokémon del día del Gran Pantano requieren la Pokédex Nacional en Platino
- [ ] great-marsh-daily-slot-2-of-32: Confirmar si los Pokémon del día del Gran Pantano requieren la Pokédex Nacional en Platino
- [ ] great-marsh-daily-slot-3-of-32: Confirmar si los Pokémon del día del Gran Pantano requieren la Pokédex Nacional en Platino
- [ ] great-marsh-daily-slot-4-of-32: Confirmar si los Pokémon del día del Gran Pantano requieren la Pokédex Nacional en Platino
- [ ] great-marsh-daily-slot-5-of-32: Confirmar si los Pokémon del día del Gran Pantano requieren la Pokédex Nacional en Platino
- [ ] great-marsh-daily-slot-15-of-32: Confirmar si los Pokémon del día del Gran Pantano requieren la Pokédex Nacional en Platino
- [ ] item-armor-fossil: Confirmar en WikiDex qué fósiles salen en el Subsuelo antes de la Pokédex Nacional en Platino
- [ ] item-claw-fossil: Confirmar en WikiDex qué fósiles salen en el Subsuelo antes de la Pokédex Nacional en Platino
- [ ] item-dome-fossil: Confirmar en WikiDex qué fósiles salen en el Subsuelo antes de la Pokédex Nacional en Platino
- [ ] item-helix-fossil: Confirmar en WikiDex qué fósiles salen en el Subsuelo antes de la Pokédex Nacional en Platino
- [ ] item-root-fossil: Confirmar en WikiDex qué fósiles salen en el Subsuelo antes de la Pokédex Nacional en Platino
- [ ] item-skull-fossil: Confirmar en WikiDex qué fósiles salen en el Subsuelo antes de la Pokédex Nacional en Platino

**MT** (5)

- [ ] TM01: Confirmar qué hace falta para la MT01 de la Puerta Pirita
- [ ] TM03: Confirmar si la MT03 de la Senda Desolada requiere Surf
- [ ] TM24: Ubicar la «central eléctrica» de la MT24 y su requisito en Platino
- [ ] TM67: Confirmar el edificio de Ciudad Vetusta donde está la MT67
- [ ] HM02: Confirmar en qué parte de Platino se recibe la MO02

### Avisos (no bloquean)

**solo post-juego** (16)

- [ ] cranidos solo se obtiene en el post-juego (fuera del pool)
- [ ] rampardos solo se obtiene en el post-juego (fuera del pool)
- [ ] shieldon solo se obtiene en el post-juego (fuera del pool)
- [ ] bastiodon solo se obtiene en el post-juego (fuera del pool)
- [ ] bonsly solo se obtiene en el post-juego (fuera del pool)
- [ ] mime-jr solo se obtiene en el post-juego (fuera del pool)
- [ ] happiny solo se obtiene en el post-juego (fuera del pool)
- [ ] pichu solo se obtiene en el post-juego (fuera del pool)
- [ ] pikachu solo se obtiene en el post-juego (fuera del pool)
- [ ] raichu solo se obtiene en el post-juego (fuera del pool)
- [ ] azurill solo se obtiene en el post-juego (fuera del pool)
- [ ] skorupi solo se obtiene en el post-juego (fuera del pool)
- [ ] drapion solo se obtiene en el post-juego (fuera del pool)
- [ ] carnivine solo se obtiene en el post-juego (fuera del pool)
- [ ] dialga solo se obtiene en el post-juego (fuera del pool)
- [ ] palkia solo se obtiene en el post-juego (fuera del pool)
