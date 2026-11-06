# data/overrides

Datos **curados a mano** que completan o corrigen PokéAPI. Organizados por familia (`specs/02-datos-y-pipeline.md`, D-009):

```
types.ts                 # formato (tipos)
sources.ts               # fuentes citadas
{family}/
  index.ts
  segments.ts
  locations.ts
  key-items.ts
  special-encounters.ts
  evolution-items.ts
  bosses.ts
  tms.ts
  versions/{game}.ts
```

Reglas:
- TypeScript tipado.
- Cada archivo cita su fuente en un comentario.
- Cada entrada tiene `source`; lo no verificado lleva `todo` y un juego con `todo` no se publica.
- Ante la duda, el tramo más tardío posible (D-016).
- El estado de curación de cada juego está al final de `data/generated/{game}/report.md`.
