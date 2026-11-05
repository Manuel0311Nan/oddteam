# 03 · Generador

**Estado:** Borrador

## Opciones

| Opción | Valores | Por defecto |
|---|---|---|
| Juego | juegos publicados | — (obligatorio) |
| Tamaño | 1–6 | 6 |
| Inicial | ninguno / aleatorio / elegir uno | aleatorio |
| Tipos | sin repetir / máx. 2 por tipo / libre / monotipo (+ tipo) | sin repetir |
| Progresión equilibrada | sí / no | sí (≥ 3 miembros antes del 2º gimnasio) |
| Evoluciones por intercambio | sí / no | no |
| Legendarios y singulares | sí / no | no |
| Dificultad | cualquiera / Paseo / Normal / Exigente / Reto | cualquiera |
| Rareza | cualquiera / sin muy raros / solo fáciles de encontrar (común, poco común o garantizado) | sin muy raros |
| Excluir habituales | lista de especies | vacía (se guarda en local) |

"Tipos" se evalúa sobre la **forma final** del Pokémon.

## Algoritmo

1. **Pool filtrado:** se aplican las restricciones duras (juego, legendarios, intercambio, excluidos, monotipo, rareza). La rareza se mide sobre la **mejor opción** de la especie (`02`): Skarmory cuenta como raro aunque haya una zona peor donde sea muy raro.
2. **Fijados:** se mantienen los huecos que el usuario ha fijado.
3. **Huecos tempranos:** si la progresión equilibrada está activa, se rellenan primero los huecos necesarios con especies de `pre-gym-1` y `gym-1-2`.
4. **Resto:** muestreo ponderado. Las especies del historial reciente pesan menos (×0,25) para no repetir.
5. **Validación** (`validate.ts`):
   - sin especies repetidas ni misma línea evolutiva;
   - regla de tipos cumplida;
   - inicial según la opción;
   - progresión equilibrada cumplida.
6. **Dificultad:** si hay filtro, se calcula (`05`) y se descarta el equipo si no cae en el nivel pedido.
7. **Reintentos:** hasta 500 intentos. Si no hay solución, se devuelve un error que dice **qué restricción** lo impide (p. ej., "monotipo Hielo + Paseo no tiene solución en Esmeralda").

## Esfuerzo de captura

Cada equipo muestra un indicador **Esfuerzo de captura: bajo / medio / alto**, calculado a partir de la rareza de sus miembros (alto si hay algún muy raro o 2+ raros; medio si hay un raro; bajo en el resto). Es **independiente de la dificultad**, que mide los combates (`05`).

## Semilla y URL

- RNG: `mulberry32`. La semilla se muestra en formato `XXXX-XXXX` (hex).
- URL: `/{game}?s=7F3A91C2&o=<opciones codificadas>&l=<huecos fijados>`.
- La misma URL debe reproducir el mismo equipo **mientras no cambie `dataVersion`**. Si cambió, se avisa: "Este enlace se creó con datos anteriores; el equipo puede variar".

## Acciones del usuario

- **Generar**: semilla nueva y nuevo equipo completo (respetando los fijados).
- **Fijar / desfijar** un hueco.
- **Cambiar** un hueco: solo ese hueco, con subsemilla derivada.
- **Copiar enlace**.

## Historial local

- Se guardan en `localStorage` los últimos 20 equipos generados (semilla, opciones, especies).
- Alimenta la penalización de repetición y la lista "habituales" sugerida.
- Si `localStorage` falla, la web sigue funcionando sin historial.

## Casos límite

- Juegos donde el inicial se elige entre 3: con "aleatorio" sale uno de los 3, que ocupa un hueco.
- Especies con forma regional o variantes de versión: se modelan como especies distintas en el pool.
- Equipos de menos de 6: la progresión equilibrada se ajusta en proporción (redondeo hacia arriba).
