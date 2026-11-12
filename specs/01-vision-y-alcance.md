# 01 · Visión y alcance

**Estado:** Acordado

## Problema

Al rejugar un Pokémon se acaba casi siempre usando el mismo equipo. Los generadores aleatorios que existen sacan Pokémon que **no se pueden conseguir** en ese juego, que llegan demasiado tarde o que no evolucionan sin intercambio. Además, no dicen si el equipo es viable ni cómo afrontar cada gimnasio.

## Propuesta

Una web que, para un juego concreto:

1. Genera equipos aleatorios **válidos** para la historia.
2. Explica **cuándo y dónde** se consigue cada miembro.
3. Analiza el equipo **contra cada jefe**, con los ataques y MT que tendrá disponibles a tiempo.
4. Estima la **dificultad** y ofrece **equipos destacados** por nivel.

## Público

Jugadores que rejuegan títulos de la saga (originales, remakes o emulación) y quieren variedad, desde el casual que quiere probar algo distinto hasta quien busca un reto.

## Fases

### 1.0 — Generador (sin backend)

- **8 versiones de 5 familias** al lanzar (D-031). Orden de curación: **Esmeralda → Platino → HeartGold + SoulSilver → Rojo Fuego + Verde Hoja → Negro 2 + Blanco 2**. Cada versión entra solo cuando su override (base de la familia + diferencias de la versión) está completo y validado.
- Cada versión tiene sus exclusivos: el pool de Negro 2 no incluye lo que solo sale en Blanco 2, y al revés.
- Generador con todas las opciones de `03`.
- Línea de tiempo de disponibilidad.
- Análisis de jefes por tipos y por ataques disponibles (`04`).
- Dificultad estimada y filtro por dificultad (`05`).
- Equipos destacados por juego y dificultad, precalculados.
- **Modo Ruta:** recomendaciones de qué capturar en cada tramo, antes de cada jefe (`08`).
- URL compartible con semilla.
- Historial local (`localStorage`) para no repetir especies recientes.
- Responsive: móvil y escritorio.

### 2.0 — Comunidad (backend)

Cuentas, equipos guardados, estado de partida y valoraciones. Ver `07`.

### Más adelante (sin compromiso)

- Juegos de mundo abierto (Escarlata/Púrpura, Leyendas), que necesitan otro modelo de tramos.
- Más familias: Rubí/Zafiro, Diamante/Perla, Rojo Fuego/Verde Hoja, remakes (Rubí Omega/Zafiro Alfa…).
- Ajuste de clase de daño clásica por juego, si se echa en falta.

## Fuera de alcance

- Competitivo: EVs, IVs, naturalezas óptimas, sets, Showdown.
- Nuzlocke y sus reglas (posible extensión futura, no en 1.0).
- Hacks y ROMs modificadas.
- App nativa. La web es responsive y, si hace falta, PWA.

## Métricas de éxito (1.0)

- 0 equipos imposibles reportados en los juegos publicados.
- Tiempo hasta el primer equipo: menos de 5 s desde la portada.
- Contenido estático: LCP < 1,5 s en móvil 4G.
