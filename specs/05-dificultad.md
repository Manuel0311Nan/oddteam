# 05 · Dificultad y equipos destacados

**Estado:** Borrador (pendiente de calibrar con partidas reales)

## Niveles

| Nivel | Para quién |
|---|---|
| **Paseo** | Quiere variedad sin sufrir. |
| **Normal** | Partida estándar, algún combate exige pensar. |
| **Exigente** | Equipo que llega tarde o tiene combates cuesta arriba. |
| **Reto** | Para quien busca sufrir: huecos tardíos, malos enfrentamientos, poca cobertura. |

## Puntuación (0–100, más alto = más difícil)

```
difficulty = 0.30 × availability
           + 0.40 × bosses
           + 0.15 × stats
           + 0.15 × friction
```

Cada componente se normaliza a 0–100:

- **availability:** cuándo se completa el equipo. Media ponderada del orden de tramo de cada miembro, más una penalización si hay menos de 2 miembros antes del 1er gimnasio.
- **bosses:** media de los veredictos de `04` (Ventaja = 0, Neutro = 50, Complicado = 100), con más peso para el último gimnasio, el Alto Mando y el campeón.
- **stats:** inverso de la media de stats base de las formas que se usan en cada tramo.
- **friction:** evoluciones tardías (nivel > 40), objetos evolutivos tardíos, zonas que exigen MO u objetos clave, pocos ataques del tipo propio a tiempo.

Cortes iniciales: `< 25` Paseo · `25–50` Normal · `50–75` Exigente · `≥ 75` Reto. Los pesos y cortes son parámetros en `lib/analysis/constants.ts`.

## Calibración

1. Se curan 5 equipos de referencia por juego, de los que se conozca la dificultad real (partidas propias o consenso de la comunidad).
2. Se ajustan pesos y cortes hasta que los 5 caen en su nivel.
3. Test de regresión: esos equipos no pueden cambiar de nivel sin actualizar el test a propósito.

En la 2.0, las valoraciones de "dificultad percibida" de la comunidad sirven para recalibrar.

## Equipos destacados

`pnpm data:featured`:

1. Genera N = 20 000 equipos por juego con opciones por defecto y semillas deterministas.
2. Puntúa cada uno.
3. Por nivel, elige **10 equipos** maximizando la variedad: ninguna especie aparece en más de 2 equipos del mismo nivel.
4. Escribe `data/generated/featured/{game}.json` con semilla y opciones, de modo que cada destacado se abre en el generador con su URL.

Página: `/{game}/destacados`, con pestañas por nivel.

## Dificultad y rareza

La dificultad mide **los combates**, no lo que cuesta capturar el equipo. La rareza se refleja en un indicador aparte, **Esfuerzo de captura** (`03`). Excepción: un miembro **único** (estático de una sola oportunidad) suma algo de `friction`, porque perderlo deja un hueco sin alternativa.
