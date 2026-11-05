# 08 · Modo Ruta

**Estado:** Borrador · Entra en la 1.0

## Idea

Un segundo modo junto al generador. En lugar de proponer un equipo cerrado de 6, **recomienda qué Pokémon capturar en cada tramo de la historia**, antes de cada jefe. El jugador va construyendo su equipo sobre la marcha con ideas nuevas en cada parada.

Reutiliza los datos y la puntuación de `02` y `04`. No necesita lógica de dominio nueva más allá de puntuar especies sueltas en lugar de equipos.

## Alcance

### Dentro (1.0)

- Una parada por tramo, con su próximo jefe.
- En cada parada, **3–5 Pokémon recomendados** que se pueden capturar en ese momento.
- Para cada recomendación: dónde capturarlo, por qué sirve contra el próximo jefe y si **es para quedarse** o **para salir del paso**.
- MT útiles que se consiguen en ese tramo.
- Variedad: semilla, "Ver otras" por parada y respeto de los habituales excluidos.
- Las mismas opciones duras que el generador: legendarios, intercambio y excluidos.

### Fuera (posibles iteraciones futuras)

- Marcar lo que ya has capturado y recomendar en función de ello.
- Recomendaciones por hueco del equipo ("te falta un Agua").
- Construir o validar un equipo final desde la Ruta.

La Ruta **no tiene estado de partida**: es la misma para cualquier jugador con la misma semilla y opciones.

## Paradas

Una parada por tramo de `Game.segments`, en orden. Cada parada tiene:

- `segment`: el tramo.
- `nextBoss`: el primer jefe cuyo tramo es ≥ al de la parada. El tramo de la Liga agrupa Alto Mando y campeón.
- `expectedLevel`: el del tramo (`02`).

La **primera parada** incluye los iniciales del juego, cada uno con su valoración para la partida, antes del resto de recomendaciones.

## Candidatos de una parada

Una especie es candidata en la parada `S` si:

- se puede obtener en un tramo ≤ `S`;
- cumple las opciones duras (legendarios, intercambio, excluidos);
- no es un inicial (salvo en la primera parada).

Se priorizan las especies **que aparecen por primera vez en este tramo**. Las de tramos anteriores pueden salir, pero con menos peso (×0,5), para que cada parada aporte novedades.

## Puntuación de un candidato

Se evalúa la especie en la forma que tendrá al `expectedLevel` del tramo del jefe, con los ataques disponibles a tiempo (reglas de `04`).

```
shortTerm = mejor score de ataque (04) contra el próximo jefe, normalizado 0–100
            − penalización si recibe x2 o x4 del tipo principal del jefe

longTerm  = media ponderada de su utilidad contra los jefes restantes
            (más peso a los 2 siguientes y a la Liga)
          + bonus por stats base de la forma final alcanzable
          − penalización por evolución tardía o por objeto tardío

routeScore = (0.6 × shortTerm + 0.4 × longTerm) × rarityFactor
```

`rarityFactor` (en `constants.ts`): garantizado y común 1,0 · poco común 0,9 · raro 0,7 · muy raro 0,4. Se usa la mejor opción disponible **en esa parada**: una especie rara en la parada 2 puede ser común en la 4 si aparece en otra zona.

Los muy raros no se excluyen de la Ruta, pero solo salen si no hay alternativa razonable, y siempre con la rareza bien visible.

Etiqueta:

- **Para quedarse:** `longTerm` ≥ umbral (por defecto 55).
- **Para salir del paso:** `shortTerm` alto pero `longTerm` bajo.
- Los que no son buenos en ninguno de los dos no se recomiendan.

Los pesos y umbrales viven en `lib/analysis/constants.ts`, junto a los de dificultad.

## Precálculo

`pnpm data:build` genera `data/generated/{game}/route.json`:

```ts
type RouteData = {
  stops: {
    segment: string;
    nextBossId: string;
    starters?: RouteCandidate[];   // solo en la primera parada
    candidates: RouteCandidate[];  // top 15 por routeScore
    usefulTms: { number: string; moveId: string; where: string; forSpecies: number[] }[];
  }[];
};

type RouteCandidate = {
  speciesId: number;
  where: string;                   // zona y método
  chance?: number;                 // % de la mejor opción en esta parada (ausente si es garantizado)
  rarity: Rarity;
  conditions: string[];            // ["time-night"]…
  firstAvailable: string;
  isNewInSegment: boolean;
  routeScore: number;
  label: "keep" | "short-term";
  reason: { moveId: string; source: "level" | "tm"; vsBossType: string };
};
```

La precomputación se hace con las opciones por defecto (sin legendarios, sin intercambio). Si el usuario activa legendarios o intercambio, se recalcula en el cliente con la misma función pura (`lib/analysis/route.ts`) a partir de `game.json` y `learnsets.json`.

## Selección en el cliente

1. Se filtran los excluidos del usuario.
2. Muestreo ponderado por `routeScore` con la semilla, eligiendo 3–5 por parada.
3. **Variedad entre paradas:** una especie no se recomienda en más de 2 paradas seguidas.
4. Siempre que exista, al menos una recomendación "Para quedarse" por parada.
5. **Ver otras** en una parada: subsemilla nueva solo para esa parada.

URL: `/{game}/ruta?s=…&o=…`, con el mismo esquema que el generador (`03`).

## Interfaz

Ver `06`. Resumen: lista vertical de paradas (línea de tiempo), cada una con el próximo jefe y sus tipos, las tarjetas de recomendación con etiqueta, las MT útiles del tramo y el botón "Ver otras".

## Tests

- Ninguna recomendación está disponible después de su parada.
- Ningún ataque citado como razón está fuera de tiempo (nivel o MT).
- Con la misma semilla y opciones, la Ruta es idéntica.
- Cada parada tiene al menos una recomendación cuando el pool lo permite.
- Los excluidos nunca aparecen.
