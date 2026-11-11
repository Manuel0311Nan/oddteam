# 05 · Dificultad y equipos destacados

**Estado:** Acordado (implementado en F6). Calibración provisional, pendiente de contrastar con partidas reales (D-021).

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

Cortes calibrados (D-021): `< 20` Paseo · `20–30` Normal · `30–40` Exigente · `≥ 40` Reto. Los cortes iniciales eran 25 / 50 / 75, pero no dejaban ningún equipo Exigente ni Reto. Los pesos y cortes son parámetros en `src/lib/analysis/constants.ts`.

### Detalle de la implementación (`src/lib/analysis/difficulty.ts`)

- **availability:** media de `orden del tramo / orden del último tramo` × 100, más 25 si hay menos de 2 miembros antes del 1er gimnasio.
- **bosses:** el peso es 1,5 para el último gimnasio y para cada miembro del Alto Mando, 2 para el campeón y 1 para el resto.
- **stats:** media del total de stats base de la forma que tiene cada miembro en cada combate en el que está disponible. 480 o más da 0 puntos; 300 o menos da 100.
- **friction:** puntos por miembro (como mucho 100), y luego la media del equipo:
  - +30 si tiene una evolución por nivel por encima del 40;
  - +25 si tiene una evolución por objeto en la segunda mitad de la historia;
  - +15 si en su primer tramo solo se consigue con MO u objeto clave (Surf, cañas, Golpe Roca, Buceo…);
  - +15 si es único;
  - hasta +30 según la proporción de combates sin ningún ataque de su tipo.
- Se calcula en el navegador con los enfrentamientos precalculados de `04`: unas décimas de milisegundo por equipo, así que cabe dentro del bucle del generador.

### Limitaciones conocidas

- **Habilidades:** quedan fuera (ver `04`), así que Shedinja (Superguarda, 1 PS) y Slaking (Ausente) pueden salir en equipos Paseo. Una mejora posible sería una lista curada de penalizaciones por habilidad, como la de movimientos.
- **Reparto:** los equipos Reto son pocos con las opciones por defecto (~1,6 %). Con el filtro Reto, el generador los encuentra igualmente en sus 500 intentos.

## Calibración

1. Se curan 5 equipos de referencia por juego, de los que se conozca la dificultad real (partidas propias o consenso de la comunidad). Esmeralda tiene 5 **provisionales** en `src/lib/analysis/difficulty.test.ts`, pendientes de confirmar (D-021).
2. Se ajustan pesos y cortes hasta que los 5 caen en su nivel.
3. Test de regresión: esos equipos no pueden cambiar de nivel sin actualizar el test a propósito.

En la 2.0, las valoraciones de "dificultad percibida" de la comunidad sirven para recalibrar.

## Equipos destacados

`pnpm data:featured`:

1. Genera N = 20 000 equipos por juego con opciones por defecto y semillas deterministas. En juegos con alcances, con el alcance por defecto (D-029).
2. Puntúa cada uno.
3. Por nivel, elige **10 equipos** maximizando la variedad: ninguna especie aparece en más de 2 equipos del mismo nivel. El inicial se reparte aparte (D-022). Si no hay suficientes equipos variados, el nivel muestra menos (en Esmeralda, Reto tiene 7).
4. Escribe `data/generated/featured/{game}.json` con semilla, equipo y opciones, de modo que cada destacado se abre en el generador con su URL. Las opciones llevan su nivel como filtro, así que "Regenerar" se queda en ese nivel.
5. `pnpm data:build` lo ejecuta al terminar, para que nunca vaya por detrás de los datos (D-021).

Página: `/{game}/destacados`, con pestañas por nivel.

## Dificultad y rareza

La dificultad mide **los combates**, no lo que cuesta capturar el equipo. La rareza se refleja en un indicador aparte, **Esfuerzo de captura** (`03`). Excepción: un miembro **único** (estático de una sola oportunidad) suma algo de `friction`, porque perderlo deja un hueco sin alternativa.
