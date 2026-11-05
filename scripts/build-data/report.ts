/**
 * Markdown report of what PokéAPI does not cover for a game.
 * It is the to-do list for phase F3 (curation of data/overrides).
 */

import type { RemovedEvolutionDetail } from "./normalize";
import type {
  GeneratedEvolutionChain,
  GeneratedGameInfo,
  GeneratedLocationArea,
  GeneratedSpecies,
  GeneratedEncounter,
} from "@/lib/generated-types";

export type ReportInput = {
  game: GeneratedGameInfo;
  species: ReadonlyMap<number, GeneratedSpecies>;
  areas: readonly GeneratedLocationArea[];
  encounters: readonly GeneratedEncounter[];
  chains: readonly GeneratedEvolutionChain[];
  statsChanged: readonly number[];
  removedEvolutions: readonly RemovedEvolutionDetail[];
  movesWithoutSpanish: number;
  machines: number;
};

const name = (s: ReadonlyMap<number, GeneratedSpecies>, id: number) =>
  `${s.get(id)?.name ?? `#${id}`} (#${id})`;

export function buildReport(input: ReportInput): string {
  const { game, species, areas, encounters, chains } = input;
  const lines: string[] = [];
  const push = (...l: string[]) => lines.push(...l);

  const counted = encounters.filter((e) => !e.excluded);
  const wild = counted.filter((e) => e.kind === "wild");
  const guaranteed = counted.filter((e) => e.kind !== "wild");
  const wildSpecies = new Set(wild.map((e) => e.speciesId));
  const obtainable = new Set(counted.map((e) => e.speciesId));

  // Species reachable by evolving something obtainable.
  const reachable = new Set(obtainable);
  let grew = true;
  while (grew) {
    grew = false;
    for (const chain of chains) {
      for (const step of chain.steps) {
        if (reachable.has(step.fromSpeciesId) && !reachable.has(step.toSpeciesId)) {
          reachable.add(step.toSpeciesId);
          grew = true;
        }
      }
    }
  }

  push(
    `# Informe de datos · ${game.slug}`,
    "",
    "Generado por `pnpm data:build`. Lista lo que PokéAPI **no** resuelve y hay que curar en `data/overrides/` (fase F3).",
    "",
    "## Resumen",
    "",
    `- Versión: \`${game.version}\` · grupo \`${game.versionGroup}\` · Gen ${game.generation} · región \`${game.region}\``,
    `- Especies en el dex regional: ${game.regionalDex.length}`,
    `- Especies con datos: ${species.size}`,
    `- Zonas con encuentros en esta versión: ${areas.length}`,
    `- Encuentros agregados: ${encounters.length} (${encounters.length - counted.length} excluidos por condición)`,
    `- Especies capturables en estado salvaje: ${wildSpecies.size}`,
    `- Especies obtenibles (salvaje, regalo, estático, intercambio, errante): ${obtainable.size}`,
    `- Especies alcanzables obteniendo o evolucionando: ${reachable.size}`,
    `- MT/MO del grupo de versiones: ${input.machines}`,
    "",
  );

  // Methods → key-items.ts
  const methods = new Map<string, { kind: string; count: number }>();
  for (const e of encounters) {
    const entry = methods.get(e.method) ?? { kind: e.kind, count: 0 };
    entry.count++;
    methods.set(e.method, entry);
  }
  const KIND_LABEL: Record<string, string> = {
    wild: "Salvaje",
    gift: "Regalo",
    static: "Estático",
    "trade-ingame": "Intercambio",
    roaming: "Errante",
    excluded: "Excluido",
    unclassified: "**Sin clasificar** (no cuenta)",
  };
  push(
    "## 1. Métodos de encuentro → `key-items.ts`",
    "",
    "Los métodos salvajes necesitan el tramo en que se habilitan (`walk` suele estar desde el principio; cañas, Surf, Golpe Roca… no). Un método **sin clasificar** hay que añadirlo a `scripts/build-data/encounters.ts`.",
    "",
    "| Método | Tipo | Encuentros |",
    "|---|---|---|",
    ...[...methods]
      .sort((a, b) => b[1].count - a[1].count)
      .map(([m, v]) => `| \`${m}\` | ${KIND_LABEL[v.kind] ?? v.kind} | ${v.count} |`),
    "",
  );

  // Guaranteed encounters already in PokéAPI
  const areaName = new Map(areas.map((a) => [a.id, a.name]));
  push(
    "## 1b. Regalos, estáticos, intercambios y errantes que ya trae PokéAPI → revisar",
    "",
    "Hay que comprobarlos, asignarles tramo y marcar los estáticos de una sola oportunidad (`unique`).",
    "",
    ...(guaranteed.length === 0
      ? ["Ninguno."]
      : guaranteed
          .slice()
          .sort((a, b) => a.kind.localeCompare(b.kind) || a.speciesId - b.speciesId)
          .map(
            (e) =>
              `- [ ] ${KIND_LABEL[e.kind] ?? e.kind}: ${name(species, e.speciesId)} · ${areaName.get(e.locationAreaId) ?? e.locationAreaId} · nv ${e.levels[0]}${e.levels[1] !== e.levels[0] ? `–${e.levels[1]}` : ""} · \`${e.method}\``,
          )),
    "",
  );

  // Conditions
  const conditions = new Map<string, { count: number; excluded: boolean }>();
  for (const e of encounters) {
    for (const c of e.conditions) {
      const entry = conditions.get(c) ?? { count: 0, excluded: e.excluded };
      entry.count++;
      conditions.set(c, entry);
    }
  }
  push("## 2. Condiciones de encuentro", "");
  if (conditions.size === 0) {
    push("Ninguna en esta versión.", "");
  } else {
    push(
      "| Condición | Encuentros | ¿Cuenta? |",
      "|---|---|---|",
      ...[...conditions]
        .sort()
        .map(([c, v]) => `| \`${c}\` | ${v.count} | ${v.excluded ? "No" : "Sí"} |`),
      "",
    );
  }

  // Areas → locations.ts
  const byLocation = new Map<string, GeneratedLocationArea[]>();
  for (const a of areas) byLocation.set(a.location, [...(byLocation.get(a.location) ?? []), a]);
  const missingEs = areas.filter((a) => !a.hasSpanishName).length;
  push(
    "## 3. Zonas → `locations.ts`",
    "",
    "Cada zona necesita su tramo de la historia. Las que no se visitan en la historia (post-juego, Zona Safari…) también se marcan.",
    missingEs > 0 ? `\n${missingEs} zonas no tienen nombre en español en PokéAPI; se muestra el inglés hasta que se cure.` : "",
    "",
    "| Ubicación | Zonas | Especies distintas |",
    "|---|---|---|",
    ...[...byLocation]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([loc, list]) => {
        const ids = new Set(encounters.filter((e) => list.some((a) => a.id === e.locationAreaId)).map((e) => e.speciesId));
        return `| \`${loc}\` | ${list.map((a) => `\`${a.id}\``).join(", ")} | ${ids.size} |`;
      }),
    "",
  );

  // Dex species not reachable in the wild
  const notWild = game.regionalDex.filter((id) => !reachable.has(id));
  push(
    "## 4. Especies del dex sin forma conocida de conseguirlas → `special-encounters.ts`",
    "",
    "PokéAPI no da ningún encuentro (salvaje, regalo, estático, intercambio) ni se obtienen evolucionando algo obtenible. Pueden ser fósiles, huevos, encuentros que faltan en PokéAPI, exclusivas de otra versión o no obtenibles. Hay que revisarlas una a una.",
    "",
    ...(notWild.length === 0
      ? ["Ninguna."]
      : notWild.map((id) => {
          const s = species.get(id);
          const tags = [s?.legendary ? "legendario" : "", s?.mythical ? "singular" : "", s?.baby ? "bebé" : ""].filter(Boolean);
          return `- [ ] ${name(species, id)}${tags.length ? ` · ${tags.join(", ")}` : ""}`;
        })),
    "",
  );

  // Evolutions
  const allSteps = chains.flatMap((c) => c.steps);
  const trade = allSteps.filter((s) => s.details.some((d) => d.trigger === "trade"));
  const items = allSteps.filter((s) => s.details.some((d) => d.item || d.heldItem));
  const multiple = allSteps.filter((s) => s.details.length !== 1);
  const special = allSteps.filter((s) =>
    s.details.some((d) => !["level-up", "trade", "use-item"].includes(d.trigger)),
  );
  const itemSet = new Set(allSteps.flatMap((s) => s.details.flatMap((d) => [d.item, d.heldItem].filter(Boolean))));
  const stepLine = (s: (typeof allSteps)[number]) =>
    `- [ ] ${name(species, s.fromSpeciesId)} → ${name(species, s.toSpeciesId)}: ${s.details
      .map((d) => [d.trigger, d.minLevel ? `nv ${d.minLevel}` : "", d.item ?? "", d.heldItem ? `lleva ${d.heldItem}` : "", d.minHappiness ? "amistad" : "", d.minBeauty ? "belleza" : "", d.timeOfDay ?? "", d.knownMove ?? "", d.location ?? ""].filter(Boolean).join(" "))
      .join(" | ")}`;

  push(
    "## 5. Evoluciones → `evolution-items.ts` y revisión",
    "",
    `### Objetos evolutivos a ubicar (${itemSet.size})`,
    "",
    ...[...itemSet].sort().map((i) => `- [ ] \`${i}\``),
    "",
    `### Métodos descartados automáticamente (${input.removedEvolutions.length})`,
    "",
    "Usan objetos que no existen en esta generación (PokéAPI mezcla métodos de todos los juegos).",
    "",
    ...input.removedEvolutions.map(
      (r) => `- ${name(species, r.fromSpeciesId)} → ${name(species, r.toSpeciesId)}: ${r.detail.trigger} · ${r.reason}`,
    ),
    "",
    `### Por intercambio (${trade.length}) — no válidas sin la opción "Evoluciones por intercambio"`,
    "",
    ...trade.map(stepLine),
    "",
    `### Con varios métodos posibles (${multiple.length}) — elegir el válido en esta versión`,
    "",
    "PokéAPI junta métodos de todos los juegos; hay que quedarse con el de esta versión.",
    "",
    ...multiple.map(stepLine),
    "",
    `### Otros disparadores (${special.length})`,
    "",
    ...special.map(stepLine),
    "",
    `### Con objeto (${items.length})`,
    "",
    ...items.map(stepLine),
    "",
  );

  // Legendaries in the wild
  const legends = [...wildSpecies].filter((id) => species.get(id)?.legendary || species.get(id)?.mythical);
  push(
    "## 6. Legendarios y singulares con encuentro salvaje",
    "",
    ...(legends.length === 0 ? ["Ninguno."] : legends.map((id) => `- ${name(species, id)}`)),
    "",
    "## 7. Otros avisos",
    "",
    `- Especies con estadísticas antiguas aplicadas (past_stats): ${input.statsChanged.length}`,
    `- Movimientos sin nombre en español: ${input.movesWithoutSpanish}`,
    "- Los porcentajes de PokéAPI se revisan contra una segunda fuente antes de publicar (specs/02).",
    "",
  );

  return lines.join("\n");
}
