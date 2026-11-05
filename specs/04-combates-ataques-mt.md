# 04 · Combates, ataques recomendados y MT

**Estado:** Borrador

## Objetivo

Para cada jefe, decir:

1. **Qué miembros del equipo están disponibles** en ese momento.
2. **Qué ataques tendrá cada uno a tiempo** (por nivel o por MT ya conseguida) y cuáles son los mejores.
3. Un **veredicto** del combate: Ventaja / Neutro / Complicado.

## Disponibilidad en cada combate

Un miembro cuenta para un jefe si su especie (o preevolución) se obtiene en un tramo **anterior o igual** al del jefe.

Para ese combate se usa la **forma esperada al nivel esperado**: si la evolución es por nivel ≤ `expectedLevel` del tramo, se usa la forma evolucionada; si es por objeto, solo si el objeto se consigue antes.

## Ataques disponibles

Un movimiento está disponible para un miembro en un combate si cumple una de estas condiciones:

- Lo aprende **por nivel** con `level_learned_at ≤ expectedLevel`, en su forma actual o en una anterior.
- Es una **MT/MO** que puede aprender y cuya ubicación tiene un tramo **≤** el del jefe. Las MT de un solo uso cuentan, pero se marcan como tales.
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
- mejoran el mejor ataque de ese miembro contra ese jefe en un ≥ 20 %.

Formato: *"MT03 [movimiento] — en [zona] ([tramo]) — para Pelipper"*.

## Veredicto del combate

Para cada Pokémon del jefe se calcula el mejor `score` del equipo disponible y el riesgo defensivo:

- **Ventaja:** el mejor ataque supera el umbral alto contra la mayoría del equipo del jefe y ningún miembro clave recibe x4.
- **Complicado:** ningún miembro disponible tiene un ataque eficaz, o la mitad o más del equipo disponible es débil al tipo principal del jefe.
- **Neutro:** el resto.

Los umbrales se calibran con equipos reales de prueba (ver `05`) y viven en `lib/analysis/constants.ts`.

## Fuera de alcance (1.0)

- Simulación de combate, cálculo de daño exacto, IA del rival.
- Objetos de combate y habilidades. Como mucho, se mencionan las habilidades que anulan un tipo (Levitación, Absorbe Agua…) en el riesgo defensivo, si el override lo indica.
