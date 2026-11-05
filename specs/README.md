# Specs — OddTeam

Boceto inicial de especificación. Cada documento indica su estado: **Borrador** (pensado, sin validar con código) o **Acordado** (decidido; para cambiarlo hay que pasar por `decisiones.md`).

| # | Documento | Estado |
|---|---|---|
| 01 | [Visión y alcance](01-vision-y-alcance.md) | Acordado |
| 02 | [Datos y pipeline](02-datos-y-pipeline.md) | Borrador |
| 03 | [Generador](03-generador.md) | Borrador |
| 04 | [Combates, ataques y MT](04-combates-ataques-mt.md) | Borrador |
| 05 | [Dificultad y destacados](05-dificultad.md) | Borrador |
| 06 | [Interfaz](06-interfaz.md) | Borrador |
| 07 | [V2: cuentas y comunidad](07-v2-cuentas-y-comunidad.md) | Aparcado (2.0) |
| 08 | [Modo Ruta](08-modo-ruta.md) | Borrador |
| 09 | [Plan de ejecución](09-plan-de-ejecucion.md) | Vivo |
| — | [Registro de decisiones](decisiones.md) | Vivo |

## Glosario

- **Juego**: una versión concreta (`emerald`, `platinum`, `heartgold`, `soulsilver`, `black-2`, `white-2`). Es la unidad de todo el proyecto: pool, exclusivos y URL son por versión.
- **Familia**: versiones que comparten historia y casi todos los jefes (`hgss`, `b2w2`). Comparten la base de los overrides; cada versión solo define sus diferencias.
- **Grupo de versiones**: agrupación de PokéAPI que comparte learnsets y MT (`emerald`, `heartgold-soulsilver`, `black-2-white-2`).
- **Tramo** (segment): parte de la historia entre dos hitos, normalmente gimnasios (`pre-gym-1`, `gym-1-2`, …, `league`).
- **Pool**: especies que se pueden obtener en un juego, cada una con su tramo de disponibilidad.
- **Jefe** (boss): combate obligatorio de la historia (líderes, Alto Mando, campeón y rivales clave si se curan).
- **Override**: dato curado a mano que completa o corrige PokéAPI.
- **Semilla**: número que hace reproducible un equipo generado o una Ruta.
- **Parada**: en el modo Ruta, un tramo con su próximo jefe y sus recomendaciones.
