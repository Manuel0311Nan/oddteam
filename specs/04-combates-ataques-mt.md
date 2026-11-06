# 04 · Combates, ataques recomendados y MT

**Estado:** Acordado (implementado en F5 para Esmeralda)

## Objetivo

Para cada jefe, decir:

1. **Qué miembros del equipo están disponibles** en ese momento.
2. **Qué ataques tendrá cada uno a tiempo** (por nivel o por MT ya conseguida) y cuáles son los mejores.
3. Un **veredicto** del combate: Ventaja / Neutro / Complicado.

## Disponibilidad en cada combate

Un miembro cuenta para un jefe si su especie (o preevolución) se obtiene en un tramo **anterior o igual** al del jefe.

Para ese combate se usa la **forma esperada al nivel esperado**: si la evolución es por nivel ≤ `expectedLevel` del tramo, se usa la forma evolucionada; si es por objeto (o intercambio in-game), solo si el objeto se consigue en un tramo ≤ el del jefe.

Las evoluciones por **amistad, belleza, muda u otras condiciones** no se dan por hechas: la cadena se corta ahí y se usa la forma anterior. La interfaz lo avisa en una nota al pie.

## Ataques disponibles

Un movimiento está disponible para un miembro en un combate si cumple una de estas condiciones:

- Lo aprende **por nivel** con `level_learned_at ≤ expectedLevel`, en su forma actual o en una anterior.
- Es una **MT/MO** que puede aprender **la forma actual** y cuya ubicación tiene un tramo **≤** el del jefe. Las MT de un solo uso cuentan, pero se marcan como tales.
- Los premios del **Casino** no cuentan (D-020): se usa el siguiente sitio donde se consiga la MT, o se excluye si solo está en el Casino.
- Es de un **tutor** curado con tramo ≤ el del jefe (opcional, si el override lo incluye).

Quedan fuera los movimientos de huevo y los de evento.

## Puntuación de un ataque

Para un atacante `A`, un movimiento `m` y un jefe `B`:

```
score(m) = power × (accuracy / 100)
         × stab           # 1.5 si m.type ∈ tipos de A
         × effectiveness  # media de la efectividad de m.type contra cada Pokémon de B (tabla de tipos de la generación)
         × statFit        # stat que usa m (Ataque o At. Esp. según la clase moderna) / máx(Ataque, At. Esp.) de A
         × penalty        # lista curada: Hiperrayo 0.5, Rayo Solar 0.6, Explosión/Autodestrucción 0.3, Doble Filo 0.85…
```

- Los movimientos de estado no puntúan aquí. Se pueden mostrar aparte como "útiles" en el futuro.
- Movimientos con potencia variable o sin potencia fija: se usa un valor de referencia curado o se excluyen.
- La **clase de daño es siempre la moderna**, también en Gen 1–3 (decisión registrada).

En la tarjeta se muestran los **3 mejores ataques por miembro y jefe**, indicando el origen (`Nv. 23`, `MT03 · Ruta 115`).

## MT recomendadas

Por cada jefe se listan las MT que:

- ya se han conseguido antes de ese combate (tramo ≤ jefe),
- puede aprender algún miembro disponible, y
- mejoran el mejor ataque de ese miembro contra ese jefe en un ≥ 20 % (`TM_IMPROVEMENT = 1.2`), como mucho 2 por miembro.

Se **agrupan por MT**. Si una MT de un solo uso sirve a varios miembros, se muestra una vez con *"para A o B (elige uno)"*.

Formato: *"Excavar — MT28 · Ruta 114 · un solo uso — para Blaziken o Linoone (elige uno)"*.

**Limitación conocida:** el veredicto se calcula por rival con filas precalculadas independientes, así que puede contar la misma MT de un solo uso para dos miembros. Solo la lista de recomendaciones la agrupa.

## Veredicto del combate

Para cada Pokémon del jefe se calcula el mejor `score` del equipo disponible y el riesgo defensivo:

- **Ventaja:** el mejor ataque supera el umbral alto contra la mayoría del equipo del jefe y ningún miembro clave recibe x4.
- **Complicado:** ningún miembro disponible tiene un ataque eficaz, o la mitad o más del equipo disponible es débil al tipo principal del jefe.
- **Neutro:** el resto.

En concreto (`teamVerdict`), un rival está "cubierto" si algún miembro disponible tiene contra él un ataque con `score ≥ 120 × máx(1, nivel esperado / 30)`. El umbral sube con el nivel porque los ataques también lo hacen (D-021).

- **Complicado** si no hay nadie disponible, si no se cubre a ningún rival, o si débiles × 2 ≥ disponibles.
- **Ventaja** si cubiertos × 2 > rivales y nadie recibe ×4.
- **Neutro** el resto.

Los umbrales se calibran con equipos reales de prueba (ver `05`) y viven en `src/lib/analysis/constants.ts`.

## Cálculo

El análisis de cada entrada del pool contra cada jefe se **precalcula en el servidor** al construir la página (`computeMatchups` en `loadClientGame`): forma y nivel, 3 mejores ataques, mejor puntuación por rival, debilidad y MT que mejoran. El cliente solo combina las filas de los 6 miembros (`teamVerdict`). En Esmeralda son ~31 KB comprimidos.

## Fuera de alcance (1.0)

- Simulación de combate, cálculo de daño exacto, IA del rival.
- Objetos de combate y habilidades. Como mucho, se mencionan las habilidades que anulan un tipo (Levitación, Absorbe Agua…) en el riesgo defensivo, si el override lo indica.
