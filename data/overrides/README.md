# data/overrides

Datos **curados a mano** que completan o corrigen PokéAPI. Organizados por familia (`specs/02-datos-y-pipeline.md`, D-009):

```
{family}/
  family.ts
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
- Lo no verificado se marca `TODO`; un juego con `TODO` no se publica.
