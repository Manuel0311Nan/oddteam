# 06 · Interfaz

**Estado:** Acordado (implementado hasta F8). Diseño de referencia en el lienzo de diseño (escritorio + móvil).

## Dirección visual

- Fondo crema `#F3F0E8`, superficies blancas, tinta `#17171C`, texto secundario `#5E5B55`.
- Acción principal en rojo `#C42F17`; "Ventaja" en azul `#2747A8`; "Complicado" en naranja suave.
- Tipografías: **Fredoka** (todo; redondeada y amable, D-025) y **JetBrains Mono** (semillas, números de Pokédex). Fredoka llega hasta 700: `font-extrabold` se pinta como 700.
- Colores de tipo propios con contraste AA (texto oscuro o blanco según el fondo).
- Sin estética oficial de Pokémon ni logos. Sprites servidos por PokéAPI.

## Pantallas

### Portada `/`
Elegir juego: una tarjeta por **familia** (región y generación) con botones para cada **versión** publicada (p. ej., "HeartGold" / "SoulSilver"), más los "próximamente". Cada versión lleva a su propia URL (`/heartgold`, `/soulsilver`).

En el generador y la Ruta, la cabecera muestra siempre la **versión** concreta, y si la familia tiene pareja publicada, un enlace para cambiar a ella conservando la semilla y las opciones.

### Generador `/{game}`
- **Panel de opciones** (escritorio: lateral; móvil: plegado en una barra con resumen "6 · inicial aleatorio · sin repetir tipos…", que se despliega al pulsarla). La Ruta usa el mismo patrón.
- **Cabecera del equipo:** juego, título, resumen ("Completo tras el 4º gimnasio"), **dificultad**, **esfuerzo de captura**, semilla, copiar enlace, regenerar los no fijados.
- **Tarjetas del equipo** (6): sprite, nº de Pokédex, nombre, tipos, captura (especie + zona + método), **rareza con su porcentaje** ("Raro · 4 % · hierba", "Solo de noche", "Garantizado · regalo"), tramo, evolución. Si hay otras zonas, un enlace "Otras zonas (3)" las despliega con su porcentaje. Acciones: Fijar / Cambiar. Desplegable con los **mejores ataques** por jefe.
- **Línea de tiempo:** tramos de la historia y qué miembros llegan en cada uno.
- **Contra los jefes:** tabla jefe · tipo · veredicto · clave. Al expandir una fila: ataques recomendados por miembro y **MT recomendadas** con su ubicación.

### Ruta `/{game}/ruta`
Pestaña hermana del generador ("Equipo" / "Ruta"). Comparte el panel de opciones (sin tamaño de equipo ni regla de tipos).
- Línea de tiempo vertical con una **parada por tramo**.
- Cada parada: tramo, **próximo jefe** con sus tipos y nivel orientativo, 3–5 tarjetas de recomendación y botón **Ver otras**.
- Tarjeta de recomendación: sprite, nombre, tipos, dónde capturarlo con su **rareza y porcentaje**, etiqueta **Para quedarse** / **Para salir del paso** y una línea de motivo ("[ataque] a Nv. 18, eficaz contra Roca").
- En la primera parada, los iniciales con su valoración.
- MT útiles del tramo, plegadas por defecto.

### Destacados `/{game}/destacados`
Pestañas Paseo / Normal / Exigente / Reto, con tarjetas compactas de equipo (6 mini sprites, puntuación, "Abrir en el generador").

### Cómo funciona `/como-funciona`
Página estática: qué significa "válido", de dónde salen los datos, rareza, combates, dificultad, Ruta, enlaces y limitaciones (clase de daño moderna, habilidades y objetos, evoluciones por amistad). Las cifras (umbrales, pesos, cortes) se leen de `constants.ts`, así que no se desfasan.

### Comunes
- **Cabecera:** logo y enlace a "Cómo funciona". En móvil se oculta el lema.
- **Pestañas del juego:** Equipo / Ruta / Destacados.
- **Pie en todas las páginas:** aviso de proyecto de fans no afiliado a Nintendo, Game Freak, Creatures ni The Pokémon Company, y enlace a PokéAPI.
- **Páginas de 404 y de error inesperado**, con vuelta a la portada.
- **Open Graph:** una imagen general y otra por juego. Por ahora no hay imagen por equipo compartido (ver `09`, F8).
- **Favicon propio:** `icon.svg`, `favicon.ico` y `apple-icon.png`.

## Componentes

`GameSelector`, `OptionsPanel`, `TeamHeader`, `PokemonCard`, `TypeBadge`, `SegmentPill`, `AvailabilityTimeline`, `BossTable`, `BossDetail`, `MoveList`, `TmList`, `DifficultyBadge`, `FeaturedTeamCard`, `ModeTabs`, `RouteStop`, `RouteCandidateCard`.

## Requisitos transversales

- Responsive desde 360 px. Tablas anchas con scroll horizontal en su caja.
- Accesible: controles reales (`button`, `input`, `label`), `aria-pressed` en Fijar, `role="switch"` en interruptores (todo el renglón es pulsable), contraste AA, objetivos táctiles ≥ 44 px. Revisado con axe (WCAG 2 A/AA y buenas prácticas) sin incidencias en F8.
- Todo el texto en español.
- Estados: cargando (skeleton de tarjetas), error de generación (mensaje con la restricción imposible), enlace con datos antiguos (aviso).
