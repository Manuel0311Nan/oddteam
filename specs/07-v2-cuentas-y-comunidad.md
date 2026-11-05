# 07 · Versión 2.0: cuentas y comunidad

**Estado:** Aparcado. Se documenta ahora para que la 1.0 no lo bloquee, pero **no se implementa nada de esto en la 1.0**.

## Funciones

- Cuentas (Auth.js; Google y email mágico).
- Guardar equipos generados.
- Estado de partida por equipo: pendiente / jugando / completado / abandonado.
- Valoraciones de la comunidad: nota (1–5), dificultad percibida y comentario opcional.
- Equipos públicos y ranking por juego ("mejores equipos de Esmeralda").
- Recalibración de la dificultad con la dificultad percibida.

## Stack previsto

Prisma + PostgreSQL en Neon + Auth.js, dentro del mismo proyecto Next.js (Server Actions y rutas de servidor). Las páginas de generador siguen siendo estáticas.

## Modelo (borrador)

```prisma
model User {
  id        String   @id @default(cuid())
  // campos de Auth.js
  teams     Team[]
  plays     TeamPlay[]
  ratings   Rating[]
}

model Team {
  id          String   @id @default(cuid())
  game        String
  seed        String
  options     Json
  species     Int[]     // foto del equipo: no se recalcula desde la semilla
  dataVersion String
  visibility  Visibility @default(PRIVATE)
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  plays       TeamPlay[]
  ratings     Rating[]
  createdAt   DateTime @default(now())
}

model TeamPlay {
  userId String
  teamId String
  status PlayStatus
  @@id([userId, teamId])
}

model Rating {
  userId             String
  teamId             String
  score              Int      // 1–5
  perceivedDifficulty Difficulty?
  comment            String?
  createdAt          DateTime @default(now())
  @@id([userId, teamId])     // un voto por usuario y equipo
}
```

## Decisiones previas que la 1.0 ya respeta

- Un equipo se identifica por juego + semilla + opciones + `dataVersion`. Así la 2.0 puede guardar la **foto** del equipo sin ambigüedad.
- La lógica es pura y vive en `lib/`, así que se puede reutilizar en el servidor.

## Abierto

- ¿Votar solo si el equipo está marcado como completado?
- Moderación de comentarios.
- ¿Perfil público?
