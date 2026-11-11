# Informe de datos · soulsilver

Generado por `pnpm data:build`. Lista lo que PokéAPI **no** resuelve y hay que curar en `data/overrides/` (fase F3).

## Resumen

- Versión: `soulsilver` · grupo `heartgold-soulsilver` · Gen 4 · región `johto`
- Especies en el dex regional: 256
- Especies con datos: 437
- Zonas con encuentros en esta versión: 172
- Encuentros agregados: 3170 (29 excluidos por condición)
- Especies capturables en estado salvaje: 235
- Especies obtenibles (salvaje, regalo, estático, intercambio, errante): 273
- Especies alcanzables obteniendo o evolucionando: 392
- MT/MO del grupo de versiones: 100

## 1. Métodos de encuentro → `key-items.ts`

Los métodos salvajes necesitan el tramo en que se habilitan (`walk` suele estar desde el principio; cañas, Surf, Golpe Roca… no). Un método **sin clasificar** hay que añadirlo a `scripts/build-data/encounters.ts`.

| Método | Tipo | Encuentros |
|---|---|---|
| `walk` | Salvaje | 1876 |
| `headbutt` | Salvaje | 350 |
| `super-rod` | Salvaje | 263 |
| `good-rod` | Salvaje | 242 |
| `surf` | Salvaje | 190 |
| `old-rod` | Salvaje | 163 |
| `gift` | Regalo | 29 |
| `static` | Estático | 18 |
| `rock-smash` | Salvaje | 18 |
| `npc-trade` | Intercambio | 10 |
| `gift-egg` | Regalo | 4 |
| `roaming-grass` | Errante | 3 |
| `pokeflute` | Estático | 2 |
| `pokemon-ranger` | Excluido | 1 |
| `squirt-bottle` | Estático | 1 |

## 1b. Regalos, estáticos, intercambios y errantes que ya trae PokéAPI → revisar

Hay que comprobarlos, asignarles tramo y marcar los estáticos de una sola oportunidad (`unique`).

- [ ] Regalo: Bulbasaur (#1) · Pallet Town · nv 5 · `gift`
- [ ] Regalo: Charmander (#4) · Pallet Town · nv 5 · `gift`
- [ ] Regalo: Squirtle (#7) · Pallet Town · nv 5 · `gift`
- [ ] Regalo: Spearow (#21) · Goldenrod City · nv 20 · `gift`
- [ ] Regalo: Sandshrew (#27) · Goldenrod City · nv 15 · `gift`
- [ ] Regalo: Abra (#63) · Goldenrod City · nv 15 · `gift`
- [ ] Regalo: Tentacool (#72) · Cianwood City · nv 15 · `gift`
- [ ] Regalo: Mr. Mime (#122) · Celadon City · nv 15 · `gift`
- [ ] Regalo: Eevee (#133) · Celadon City · nv 15 · `gift`
- [ ] Regalo: Eevee (#133) · Goldenrod City · nv 5 · `gift`
- [ ] Regalo: Porygon (#137) · Celadon City · nv 15 · `gift`
- [ ] Regalo: Omanyte (#138) · Pewter City · nv 20 · `gift`
- [ ] Regalo: Kabuto (#140) · Pewter City · nv 20 · `gift`
- [ ] Regalo: Aerodactyl (#142) · Pewter City · nv 20 · `gift`
- [ ] Regalo: Dratini (#147) · Dragon's Den · nv 15 · `gift`
- [ ] Regalo: Dratini (#147) · Dragon's Den · nv 15 · `gift`
- [ ] Regalo: Dratini (#147) · Goldenrod City · nv 15 · `gift`
- [ ] Regalo: Chikorita (#152) · New Bark Town · nv 5 · `gift`
- [ ] Regalo: Cyndaquil (#155) · New Bark Town · nv 5 · `gift`
- [ ] Regalo: Totodile (#158) · New Bark Town · nv 5 · `gift`
- [ ] Regalo: Togepi (#175) · Violet City · nv 1 · `gift-egg`
- [ ] Regalo: Mareep (#179) · Violet City · nv 1 · `gift-egg`
- [ ] Regalo: Wooper (#194) · Violet City · nv 1 · `gift-egg`
- [ ] Regalo: Shuckle (#213) · Cianwood City · nv 15 · `gift`
- [ ] Regalo: Slugma (#218) · Violet City · nv 1 · `gift-egg`
- [ ] Regalo: Tyrogue (#236) · Mt. Mortar · nv 10 · `gift`
- [ ] Regalo: Treecko (#252) · Saffron City · nv 5 · `gift`
- [ ] Regalo: Torchic (#255) · Saffron City · nv 5 · `gift`
- [ ] Regalo: Mudkip (#258) · Saffron City · nv 5 · `gift`
- [ ] Regalo: Lileep (#345) · Pewter City · nv 20 · `gift`
- [ ] Regalo: Anorith (#347) · Pewter City · nv 20 · `gift`
- [ ] Regalo: Cranidos (#408) · Pewter City · nv 20 · `gift`
- [ ] Regalo: Shieldon (#410) · Pewter City · nv 20 · `gift`
- [ ] Errante: Raikou (#243) · Roaming Johto · nv 40 · `roaming-grass`
- [ ] Errante: Entei (#244) · Roaming Johto · nv 40 · `roaming-grass`
- [ ] Errante: Latios (#381) · Roaming Johto · nv 35 · `roaming-grass`
- [ ] Estático: Geodude (#74) · Team Rocket HQ · nv 21 · `static`
- [ ] Estático: Voltorb (#100) · Team Rocket HQ · nv 23 · `static`
- [ ] Estático: Electrode (#101) · Team Rocket HQ · nv 23 · `static`
- [ ] Estático: Koffing (#109) · Team Rocket HQ · nv 21 · `static`
- [ ] Estático: Gyarados (#130) · Lake of Rage · nv 30 · `static`
- [ ] Estático: Lapras (#131) · Union Cave · nv 20 · `static`
- [ ] Estático: Snorlax (#143) · Route 11 · nv 50 · `pokeflute`
- [ ] Estático: Snorlax (#143) · Route 12 · nv 50 · `pokeflute`
- [ ] Estático: Articuno (#144) · Seafoam Islands · nv 50 · `static`
- [ ] Estático: Zapdos (#145) · Route 10 · nv 50 · `static`
- [ ] Estático: Moltres (#146) · Mt. Silver · nv 50 · `static`
- [ ] Estático: Mewtwo (#150) · Cerulean Cave · nv 70 · `static`
- [ ] Estático: Sudowoodo (#185) · Route 36 · nv 20 · `squirt-bottle`
- [ ] Estático: Suicune (#245) · Route 25 · nv 40 · `static`
- [ ] Estático: Lugia (#249) · Whirl Islands · nv 45 · `static`
- [ ] Estático: Ho-Oh (#250) · Bell Tower · nv 70 · `static`
- [ ] Estático: Groudon (#383) · Embedded Tower · nv 50 · `static`
- [ ] Estático: Rayquaza (#384) · Embedded Tower · nv 50 · `static`
- [ ] Estático: Dialga (#483) · Sinjoh Ruins · nv 1 · `static`
- [ ] Estático: Palkia (#484) · Sinjoh Ruins · nv 1 · `static`
- [ ] Estático: Giratina (#487) · Sinjoh Ruins · nv 1 · `static`
- [ ] Intercambio: Pikachu (#25) · Saffron City · nv 2–100 · `npc-trade`
- [ ] Intercambio: Machop (#66) · Goldenrod City · nv 1–100 · `npc-trade`
- [ ] Intercambio: Magneton (#82) · Kanto Power Plant · nv 19–100 · `npc-trade`
- [ ] Intercambio: Dodrio (#85) · Blackthorn City · nv 30–100 · `npc-trade`
- [ ] Intercambio: Onix (#95) · Violet City · nv 1–100 · `npc-trade`
- [ ] Intercambio: Voltorb (#100) · Olivine City · nv 1–100 · `npc-trade`
- [ ] Intercambio: Rhyhorn (#111) · Diglett's Cave · nv 1–100 · `npc-trade`
- [ ] Intercambio: Xatu (#178) · Pewter City · nv 16–100 · `npc-trade`
- [ ] Intercambio: Steelix (#208) · Olivine City · nv 1–100 · `npc-trade`
- [ ] Intercambio: Beldum (#374) · Saffron City · nv 31–100 · `npc-trade`

## 2. Condiciones de encuentro

| Condición | Encuentros | ¿Cuenta? |
|---|---|---|
| `bug-catching-contest-no` | 17 | Sí |
| `bug-catching-contest-yes` | 40 | Sí |
| `coins-200` | 1 | Sí |
| `coins-2100` | 1 | Sí |
| `coins-3333` | 1 | Sí |
| `coins-6666` | 1 | Sí |
| `coins-700` | 1 | Sí |
| `coins-9999` | 1 | Sí |
| `headbutt-tree-common` | 178 | Sí |
| `headbutt-tree-rare` | 159 | Sí |
| `headbutt-tree-secret` | 13 | Sí |
| `item-armor-fossil` | 1 | Sí |
| `item-claw-fossil` | 1 | Sí |
| `item-dome-fossil` | 1 | Sí |
| `item-helix-fossil` | 1 | Sí |
| `item-old-amber` | 1 | Sí |
| `item-root-fossil` | 1 | Sí |
| `item-skull-fossil` | 1 | Sí |
| `johto-safari-blocks-forest-min-10` | 2 | Sí |
| `johto-safari-blocks-forest-min-14` | 3 | Sí |
| `johto-safari-blocks-forest-min-15` | 4 | Sí |
| `johto-safari-blocks-forest-min-18` | 1 | Sí |
| `johto-safari-blocks-forest-min-20` | 3 | Sí |
| `johto-safari-blocks-forest-min-28` | 4 | Sí |
| `johto-safari-blocks-forest-min-3` | 6 | Sí |
| `johto-safari-blocks-forest-min-35` | 20 | Sí |
| `johto-safari-blocks-forest-min-4` | 2 | Sí |
| `johto-safari-blocks-forest-min-42` | 2 | Sí |
| `johto-safari-blocks-forest-min-49` | 4 | Sí |
| `johto-safari-blocks-forest-min-5` | 5 | Sí |
| `johto-safari-blocks-forest-min-56` | 1 | Sí |
| `johto-safari-blocks-forest-min-8` | 3 | Sí |
| `johto-safari-blocks-inactive` | 200 | Sí |
| `johto-safari-blocks-peak-min-10` | 8 | Sí |
| `johto-safari-blocks-peak-min-15` | 4 | Sí |
| `johto-safari-blocks-peak-min-21` | 1 | Sí |
| `johto-safari-blocks-peak-min-24` | 4 | Sí |
| `johto-safari-blocks-peak-min-28` | 5 | Sí |
| `johto-safari-blocks-peak-min-3` | 4 | Sí |
| `johto-safari-blocks-peak-min-35` | 7 | Sí |
| `johto-safari-blocks-peak-min-4` | 2 | Sí |
| `johto-safari-blocks-peak-min-42` | 6 | Sí |
| `johto-safari-blocks-peak-min-49` | 7 | Sí |
| `johto-safari-blocks-peak-min-5` | 6 | Sí |
| `johto-safari-blocks-peak-min-56` | 7 | Sí |
| `johto-safari-blocks-peak-min-6` | 3 | Sí |
| `johto-safari-blocks-peak-min-63` | 2 | Sí |
| `johto-safari-blocks-peak-min-8` | 2 | Sí |
| `johto-safari-blocks-plains-min-10` | 8 | Sí |
| `johto-safari-blocks-plains-min-12` | 5 | Sí |
| `johto-safari-blocks-plains-min-14` | 2 | Sí |
| `johto-safari-blocks-plains-min-15` | 1 | Sí |
| `johto-safari-blocks-plains-min-2` | 2 | Sí |
| `johto-safari-blocks-plains-min-24` | 4 | Sí |
| `johto-safari-blocks-plains-min-28` | 1 | Sí |
| `johto-safari-blocks-plains-min-3` | 8 | Sí |
| `johto-safari-blocks-plains-min-35` | 4 | Sí |
| `johto-safari-blocks-plains-min-4` | 1 | Sí |
| `johto-safari-blocks-plains-min-49` | 2 | Sí |
| `johto-safari-blocks-plains-min-5` | 5 | Sí |
| `johto-safari-blocks-plains-min-6` | 1 | Sí |
| `johto-safari-blocks-water-min-10` | 12 | Sí |
| `johto-safari-blocks-water-min-12` | 1 | Sí |
| `johto-safari-blocks-water-min-13` | 1 | Sí |
| `johto-safari-blocks-water-min-14` | 6 | Sí |
| `johto-safari-blocks-water-min-15` | 3 | Sí |
| `johto-safari-blocks-water-min-16` | 1 | Sí |
| `johto-safari-blocks-water-min-18` | 3 | Sí |
| `johto-safari-blocks-water-min-2` | 5 | Sí |
| `johto-safari-blocks-water-min-20` | 2 | Sí |
| `johto-safari-blocks-water-min-24` | 1 | Sí |
| `johto-safari-blocks-water-min-28` | 1 | Sí |
| `johto-safari-blocks-water-min-3` | 12 | Sí |
| `johto-safari-blocks-water-min-35` | 7 | Sí |
| `johto-safari-blocks-water-min-4` | 4 | Sí |
| `johto-safari-blocks-water-min-42` | 1 | Sí |
| `johto-safari-blocks-water-min-49` | 1 | Sí |
| `johto-safari-blocks-water-min-5` | 6 | Sí |
| `johto-safari-blocks-water-min-6` | 5 | Sí |
| `johto-safari-blocks-water-min-7` | 1 | Sí |
| `johto-safari-blocks-water-min-8` | 3 | Sí |
| `johto-safari-blocks-water-min-9` | 3 | Sí |
| `other-correct-password` | 3 | Sí |
| `other-event-arceus-in-party` | 3 | Sí |
| `other-received-kanto-starter` | 3 | Sí |
| `other-snorlax-11-beat-league` | 1 | Sí |
| `radio-hoenn` | 211 | Sí |
| `radio-off` | 416 | Sí |
| `radio-sinnoh` | 189 | Sí |
| `story-progress-awakened-beasts` | 2 | Sí |
| `story-progress-beat-red` | 6 | Sí |
| `story-progress-before-national-dex` | 10 | Sí |
| `story-progress-national-dex` | 30 | Sí |
| `story-progress-receive-tm-from-claire` | 1 | Sí |
| `story-progress-returned-machine-part` | 1 | Sí |
| `story-progress-vermilion-copycat` | 1 | Sí |
| `story-progress-zephyr-badge` | 1 | Sí |
| `swarm-no` | 64 | Sí |
| `swarm-yes` | 28 | No |
| `time-day` | 312 | Sí |
| `time-morning` | 313 | Sí |
| `time-night` | 292 | Sí |
| `trade-any-pokemon` | 1 | Sí |
| `trade-bellsprout` | 1 | Sí |
| `trade-bonsly` | 1 | Sí |
| `trade-dragonair` | 1 | Sí |
| `trade-drowzee` | 1 | Sí |
| `trade-dugtrio` | 1 | Sí |
| `trade-forretress` | 1 | Sí |
| `trade-haunter` | 1 | Sí |
| `trade-krabby` | 1 | Sí |
| `trade-pikachu` | 1 | Sí |
| `weekday-friday` | 1 | Sí |
| `weekday-saturday` | 10 | Sí |
| `weekday-thursday` | 10 | Sí |
| `weekday-tuesday` | 10 | Sí |

## 3. Zonas → `locations.ts`

Cada zona necesita su tramo de la historia. Las que no se visitan en la historia (post-juego, Zona Safari…) también se marcan.

172 zonas no tienen nombre en español en PokéAPI; se muestra el inglés hasta que se cure.

| Ubicación | Zonas | Especies distintas |
|---|---|---|
| `azalea-town` | `azalea-town-area` | 3 |
| `bell-tower` | `bell-tower-10f`, `bell-tower-2f`, `bell-tower-3f`, `bell-tower-4f`, `bell-tower-5f`, `bell-tower-6f`, `bell-tower-7f`, `bell-tower-8f`, `bell-tower-9f`, `bell-tower-roof` | 7 |
| `blackthorn-city` | `blackthorn-city-area` | 3 |
| `burned-tower` | `burned-tower-1f`, `burned-tower-b1f` | 9 |
| `celadon-city` | `celadon-city-area`, `celadon-city-prize-corner` | 8 |
| `cerulean-cave` | `cerulean-cave-1f`, `cerulean-cave-2f`, `cerulean-cave-b1f` | 23 |
| `cerulean-city` | `cerulean-city-area` | 6 |
| `cherrygrove-city` | `cherrygrove-city-area` | 12 |
| `cianwood-city` | `cianwood-city-area`, `cianwood-city-kirks-house`, `cianwood-city-pokemon-center` | 8 |
| `cinnabar-island` | `cinnabar-island-area` | 6 |
| `dark-cave` | `dark-cave-blackthorn-city-entrance`, `dark-cave-violet-city-entrance` | 13 |
| `digletts-cave` | `digletts-cave-area` | 7 |
| `dragons-den` | `dragons-den-area` | 3 |
| `ecruteak-city` | `ecruteak-city-area` | 7 |
| `embedded-tower` | `embedded-tower-groundon-room`, `embedded-tower-rayquaza-room` | 2 |
| `fuchsia-city` | `fuchsia-city-area` | 6 |
| `goldenrod-city` | `goldenrod-city-bills-house`, `goldenrod-city-department-store-5f`, `goldenrod-city-game-corner`, `goldenrod-city-north-gate` | 6 |
| `ice-path` | `ice-path-1f`, `ice-path-b1f`, `ice-path-b2f`, `ice-path-b3f` | 9 |
| `ilex-forest` | `ilex-forest-area` | 17 |
| `johto-pokemart` | `johto-pokemart-area` | 1 |
| `johto-route-29` | `johto-route-29-area` | 10 |
| `johto-route-30` | `johto-route-30-area` | 15 |
| `johto-route-31` | `johto-route-31-area` | 16 |
| `johto-route-32` | `johto-route-32-area` | 19 |
| `johto-route-33` | `johto-route-33-area` | 10 |
| `johto-route-34` | `johto-route-34-area` | 20 |
| `johto-route-35` | `johto-route-35-area` | 19 |
| `johto-route-36` | `johto-route-36-area` | 13 |
| `johto-route-37` | `johto-route-37-area` | 11 |
| `johto-route-38` | `johto-route-38-area` | 15 |
| `johto-route-39` | `johto-route-39-area` | 13 |
| `johto-route-42` | `johto-route-42-area` | 13 |
| `johto-route-43` | `johto-route-43-area` | 15 |
| `johto-route-44` | `johto-route-44-area` | 15 |
| `johto-route-45` | `johto-route-45-area` | 14 |
| `johto-route-46` | `johto-route-46-area` | 8 |
| `johto-route-47` | `johto-route-47-area`, `johto-route-47-cave-gate`, `johto-route-47-inside-cave` | 45 |
| `johto-route-48` | `johto-route-48-area` | 15 |
| `johto-safari-zone` | `johto-safari-zone-desert`, `johto-safari-zone-forest`, `johto-safari-zone-marshland`, `johto-safari-zone-meadow`, `johto-safari-zone-mountain`, `johto-safari-zone-peak`, `johto-safari-zone-plains`, `johto-safari-zone-rocky-beach`, `johto-safari-zone-savannah`, `johto-safari-zone-swamp`, `johto-safari-zone-wasteland`, `johto-safari-zone-wetland` | 152 |
| `johto-sea-route-40` | `johto-sea-route-40-area` | 7 |
| `johto-sea-route-41` | `johto-sea-route-41-area` | 6 |
| `kanto-power-plant` | `kanto-power-plant-area` | 1 |
| `kanto-route-1` | `kanto-route-1-area` | 12 |
| `kanto-route-10` | `kanto-route-10-area` | 14 |
| `kanto-route-11` | `kanto-route-11-area` | 11 |
| `kanto-route-12` | `kanto-route-12-area` | 11 |
| `kanto-route-13` | `kanto-route-13-area` | 19 |
| `kanto-route-14` | `kanto-route-14-area` | 15 |
| `kanto-route-15` | `kanto-route-15-area` | 14 |
| `kanto-route-16` | `kanto-route-16-area` | 11 |
| `kanto-route-17` | `kanto-route-17-area` | 7 |
| `kanto-route-18` | `kanto-route-18-area` | 11 |
| `kanto-route-2` | `kanto-route-2-north-towards-pewter-city`, `kanto-route-2-south-towards-viridian-city` | 14 |
| `kanto-route-22` | `kanto-route-22-area` | 16 |
| `kanto-route-24` | `kanto-route-24-area` | 14 |
| `kanto-route-25` | `kanto-route-25-area` | 21 |
| `kanto-route-26` | `kanto-route-26-area` | 19 |
| `kanto-route-27` | `kanto-route-27-area` | 21 |
| `kanto-route-28` | `kanto-route-28-area` | 17 |
| `kanto-route-3` | `kanto-route-3-area` | 13 |
| `kanto-route-4` | `kanto-route-4-area` | 16 |
| `kanto-route-5` | `kanto-route-5-area` | 12 |
| `kanto-route-6` | `kanto-route-6-area` | 17 |
| `kanto-route-7` | `kanto-route-7-area` | 13 |
| `kanto-route-8` | `kanto-route-8-area` | 13 |
| `kanto-route-9` | `kanto-route-9-area` | 12 |
| `kanto-sea-route-19` | `kanto-sea-route-19-area` | 8 |
| `kanto-sea-route-20` | `kanto-sea-route-20-area` | 6 |
| `kanto-sea-route-21` | `kanto-sea-route-21-area` | 15 |
| `kanto-victory-road-1` | `kanto-victory-road-1-1f`, `kanto-victory-road-1-2f`, `kanto-victory-road-1-3f` | 10 |
| `lake-of-rage` | `lake-of-rage-area` | 6 |
| `mt-moon` | `mt-moon-1f`, `mt-moon-2f`, `mt-moon-mt-moon-square` | 10 |
| `mt-mortar` | `mt-mortar-1f`, `mt-mortar-b1f`, `mt-mortar-lower-cave`, `mt-mortar-upper-cave` | 17 |
| `mt-silver` | `mt-silver-1f`, `mt-silver-1f-top`, `mt-silver-2f`, `mt-silver-3f`, `mt-silver-4f`, `mt-silver-mountainside`, `mt-silver-outside`, `mt-silver-top` | 35 |
| `national-park` | `national-park-area` | 31 |
| `new-bark-town` | `new-bark-town-area` | 13 |
| `olivine-city` | `olivine-city-area`, `olivine-city-gym` | 9 |
| `pallet-town` | `pallet-town-area` | 13 |
| `pewter-city` | `pewter-city-area`, `pewter-city-pewter-museum-of-science` | 12 |
| `roaming-johto` | `roaming-johto-area` | 3 |
| `rock-tunnel` | `rock-tunnel-1f`, `rock-tunnel-b1f` | 12 |
| `ruins-of-alph` | `ruins-of-alph-interior-a`, `ruins-of-alph-interior-b`, `ruins-of-alph-interior-c`, `ruins-of-alph-interior-d`, `ruins-of-alph-outside` | 12 |
| `safari-zone-gate` | `safari-zone-gate-area` | 4 |
| `saffron-city` | `saffron-city-magnet-train-station`, `saffron-city-silph-co` | 5 |
| `seafoam-islands` | `seafoam-islands-1f`, `seafoam-islands-b1f`, `seafoam-islands-b2f`, `seafoam-islands-b3f`, `seafoam-islands-b4f` | 19 |
| `sinjoh-ruins` | `sinjoh-ruins-area` | 3 |
| `slowpoke-well` | `slowpoke-well-1f`, `slowpoke-well-b1f` | 11 |
| `sprout-tower` | `sprout-tower-2f`, `sprout-tower-3f` | 6 |
| `team-rocket-hq` | `team-rocket-hq-area` | 4 |
| `tohjo-falls` | `tohjo-falls-area` | 12 |
| `union-cave` | `union-cave-1f`, `union-cave-b1f`, `union-cave-b2f` | 22 |
| `unknown-all-bugs` | `unknown-all-bugs-area` | 1 |
| `unknown-all-poliwag` | `unknown-all-poliwag-area` | 2 |
| `unknown-all-rattata` | `unknown-all-rattata-area` | 5 |
| `vermilion-city` | `vermilion-city-area`, `vermilion-city-ss-anne-dock` | 12 |
| `violet-city` | `violet-city-area`, `violet-city-poke-mart`, `violet-city-pokemon-center` | 12 |
| `viridian-city` | `viridian-city-area` | 7 |
| `viridian-forest` | `viridian-forest-area` | 17 |
| `whirl-islands` | `whirl-islands-1f`, `whirl-islands-b1f`, `whirl-islands-b2f`, `whirl-islands-b3f` | 15 |

## 4. Especies del dex sin forma conocida de conseguirlas → `special-encounters.ts`

PokéAPI no da ningún encuentro (salvaje, regalo, estático, intercambio) ni se obtienen evolucionando algo obtenible. Pueden ser fósiles, huevos, encuentros que faltan en PokéAPI, exclusivas de otra versión o no obtenibles. Hay que revisarlas una a una.

- [ ] Pichu (#172) · bebé
- [ ] Spinarak (#167)
- [ ] Ariados (#168)
- [ ] Cleffa (#173) · bebé
- [ ] Igglybuff (#174) · bebé
- [ ] Growlithe (#58)
- [ ] Arcanine (#59)
- [ ] Mankey (#56)
- [ ] Primeape (#57)
- [ ] Magby (#240) · bebé
- [ ] Smoochum (#238) · bebé
- [ ] Elekid (#239) · bebé
- [ ] Gligar (#207)
- [ ] Phanpy (#231)
- [ ] Donphan (#232)
- [ ] Mantine (#226)
- [ ] Mew (#151) · singular
- [ ] Celebi (#251) · singular

## 5. Evoluciones → `evolution-items.ts` y revisión

### Objetos evolutivos a ubicar (23)

- [ ] `dawn-stone`
- [ ] `deep-sea-scale`
- [ ] `deep-sea-tooth`
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

### Métodos descartados automáticamente (5)

Usan objetos que no existen en esta generación (PokéAPI mezcla métodos de todos los juegos).

- Sandshrew (#27) → Sandslash (#28): use-item · objeto ice-stone no existe en esta generación
- Vulpix (#37) → Ninetales (#38): use-item · objeto ice-stone no existe en esta generación
- Slowpoke (#79) → Slowbro (#80): use-item · objeto galarica-cuff no existe en esta generación
- Slowpoke (#79) → Slowking (#199): use-item · objeto galarica-wreath no existe en esta generación
- Eevee (#133) → Glaceon (#471): use-item · objeto ice-stone no existe en esta generación

### Por intercambio (17) — no válidas sin la opción "Evoluciones por intercambio"

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
- [ ] Clamperl (#366) → Huntail (#367): trade lleva deep-sea-tooth
- [ ] Clamperl (#366) → Gorebyss (#368): trade lleva deep-sea-scale

### Con varios métodos posibles (9) — elegir el válido en esta versión

PokéAPI junta métodos de todos los juegos; hay que quedarse con el de esta versión.

- [ ] Rattata (#19) → Raticate (#20): level-up nv 20 | level-up nv 20 night
- [ ] Meowth (#52) → Persian (#53): level-up nv 28 | level-up amistad
- [ ] Magneton (#82) → Magnezone (#462): level-up mt-coronet | level-up chargestone-cave | level-up kalos-route-13 | level-up blush-mountain | level-up vast-poni-canyon | use-item thunder-stone | level-up new-mauville
- [ ] Voltorb (#100) → Electrode (#101): level-up nv 30 | use-item leaf-stone
- [ ] Cubone (#104) → Marowak (#105): level-up nv 28 | level-up nv 28 night
- [ ] Eevee (#133) → Leafeon (#470): level-up eterna-forest | level-up pinwheel-forest | level-up kalos-route-20 | use-item leaf-stone | level-up petalburg-woods | level-up lush-jungle
- [ ] Eevee (#133) → Glaceon (#471): level-up sinnoh-route-217 | level-up twist-mountain | level-up frost-cavern | level-up shoal-cave | level-up mount-lanakila
- [ ] Cyndaquil (#155) → Quilava (#156): level-up nv 14 | level-up nv 17
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
- [ ] Roselia (#315) → Roserade (#407): use-item shiny-stone
- [ ] Dusclops (#356) → Dusknoir (#477): trade lleva reaper-cloth
- [ ] Clamperl (#366) → Huntail (#367): trade lleva deep-sea-tooth
- [ ] Clamperl (#366) → Gorebyss (#368): trade lleva deep-sea-scale

## 6. Legendarios y singulares con encuentro salvaje

Ninguno.

## 7. Otros avisos

- Especies con estadísticas antiguas aplicadas (past_stats): 43
- Movimientos sin nombre en español: 0
- Los porcentajes de PokéAPI se revisan contra una segunda fuente antes de publicar (specs/02).

## Estado de curación (fase F3)

✅ **Listo para publicar**: sin errores ni TODO.

- Zonas con tramo: 171/171
- MT/MO ubicadas: 100/100
- Jefes: 21
- Encuentros que cuentan para la historia: 2539
- Pool: 165 entradas (formas finales) de 146 líneas evolutivas

### Avisos (no bloquean)

**solo post-juego** (12)

- [ ] sneasel solo se obtiene en el post-juego (fuera del pool)
- [ ] bulbasaur solo se obtiene en el post-juego (fuera del pool)
- [ ] ivysaur solo se obtiene en el post-juego (fuera del pool)
- [ ] venusaur solo se obtiene en el post-juego (fuera del pool)
- [ ] charmander solo se obtiene en el post-juego (fuera del pool)
- [ ] charmeleon solo se obtiene en el post-juego (fuera del pool)
- [ ] charizard solo se obtiene en el post-juego (fuera del pool)
- [ ] squirtle solo se obtiene en el post-juego (fuera del pool)
- [ ] wartortle solo se obtiene en el post-juego (fuera del pool)
- [ ] blastoise solo se obtiene en el post-juego (fuera del pool)
- [ ] moltres solo se obtiene en el post-juego (fuera del pool)
- [ ] mewtwo solo se obtiene en el post-juego (fuera del pool)
