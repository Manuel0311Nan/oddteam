"use client";

import { LoaderCircle, RefreshCw, Shuffle } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ExcludedPicker } from "@/components/generator/options-panel";
import { TypeBadge } from "@/components/generator/type-badge";
import { CollapsiblePanel, Segmented, Switch } from "@/components/ui/segmented";
import { buildRoute, pickRoute, type RouteCandidate, type RouteOptions } from "@/lib/analysis/route";
import type { ClientGame } from "@/lib/game-data";
import { DEFAULT_OPTIONS, normalizeOptions } from "@/lib/generator/options";
import { formatSeed, newSeed, type Seed } from "@/lib/rng";
import type { GeneratorOptions } from "@/lib/types";
import { methodLabel, RARITY_LABEL, SEGMENT_TONE } from "@/lib/ui/labels";
import { revealResults } from "@/lib/ui/reveal";
import { decodeRouteState, encodeRouteState } from "@/lib/url-state";
import { cn } from "@/lib/utils";

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeLocal(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

const LABEL = {
  keep: { text: "Para quedarse", className: "bg-advantage text-advantage-foreground" },
  "short-term": { text: "Para salir del paso", className: "bg-neutral text-neutral-foreground" },
} as const;

const tmLabel = (number: string) => number.replace(/^TM/, "MT").replace(/^HM/, "MO");

/** Route mode (specs/08): recommendations per segment, without game state (D-008). */
export function RouteApp({ game }: { game: ClientGame }) {
  const excludedKey = `oddteam:excluded:${game.slug}`;
  const [seed, setSeed] = useState<Seed | null>(null);
  const [options, setOptions] = useState<GeneratorOptions>(DEFAULT_OPTIONS);
  const [others, setOthers] = useState<number[]>([]);
  const [generating, setGenerating] = useState(false);
  const resultsRef = useRef<HTMLElement>(null);

  // Same feedback as the generator: a short loading state, then the route in view.
  const newRoute = () => {
    if (generating) return;
    setGenerating(true);
    window.setTimeout(() => {
      setOthers([]);
      setSeed(newSeed());
      setGenerating(false);
      window.requestAnimationFrame(() => revealResults(resultsRef.current));
    }, 450);
  };
  const [notice, setNotice] = useState<string | null>(null);

  // Read the link once; without one, a fresh seed and the saved "habituales".
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const decoded = decodeRouteState(params);
    const saved = readLocal<number[]>(excludedKey, []);
    if (!decoded.ok) {
      setNotice(`${decoded.reason} Se ha generado una ruta nueva.`);
      setOptions(normalizeOptions({ ...DEFAULT_OPTIONS, excluded: saved }));
      setSeed(newSeed());
      return;
    }
    const { state } = decoded;
    setOptions(normalizeOptions(params.has("o") ? state.options : { ...state.options, excluded: saved }));
    setOthers(state.others);
    if (state.dataVersion && state.dataVersion !== game.dataVersion) {
      setNotice("Este enlace se creó con datos anteriores; la ruta puede variar.");
    }
    setSeed(state.seed ?? newSeed());
  }, [excludedKey, game.dataVersion]);

  const routeOptions: RouteOptions = useMemo(
    () => ({
      allowLegendaries: options.allowLegendaries,
      allowTradeEvolutions: options.allowTradeEvolutions,
      excluded: options.excluded,
      scope: options.scope,
    }),
    [options.allowLegendaries, options.allowTradeEvolutions, options.excluded, options.scope],
  );
  const stops = useMemo(
    () => buildRoute({ ...game, statTotalOf: (id) => game.statTotals[id] ?? 0 }, routeOptions),
    [game, routeOptions],
  );
  const picked = useMemo(() => (seed === null ? [] : pickRoute(stops, seed, others)), [stops, seed, others]);

  useEffect(() => {
    if (seed === null) return;
    const q = encodeRouteState({ seed, options, others, dataVersion: game.dataVersion }).toString();
    window.history.replaceState(null, "", `?${q}`);
  }, [seed, options, others, game.dataVersion]);

  const change = (patch: Partial<GeneratorOptions>) => {
    const next = normalizeOptions({ ...options, ...patch });
    if (patch.excluded) writeLocal(excludedKey, next.excluded);
    setOptions(next);
  };
  const seeOthers = (i: number) =>
    setOthers((prev) => {
      const next = [...prev];
      while (next.length <= i) next.push(0);
      next[i] = (next[i] ?? 0) + 1;
      return next;
    });

  const name = (id: number) => game.species[id]?.name ?? `#${id}`;
  const bossById = new Map(game.bosses.map((b) => [b.id, b]));

  return (
    <div className="flex flex-wrap items-start gap-7">
      <CollapsiblePanel
        label="Opciones de la ruta"
        className="w-full lg:w-[340px] lg:shrink-0"
        summary={
          [
            game.scopes && game.scopes.length > 1 ? (game.scopes.find((sc) => sc.id === options.scope) ?? game.scopes[0])?.label : null,
            options.allowTradeEvolutions ? "con intercambio" : "sin intercambio",
            options.allowLegendaries ? "con legendarios" : "sin legendarios",
            options.excluded.length ? `${options.excluded.length} excluidos` : null,
          ]
            .filter(Boolean)
            .join(" · ")
        }
      >
        {game.scopes && game.scopes.length > 1 ? (
          <section className="flex flex-col gap-2.5">
            <h2 className="text-[13px] font-bold uppercase tracking-[0.08em] text-muted-foreground">Alcance</h2>
            <Segmented
              label="Alcance de la historia"
              value={options.scope ?? game.scopes[0]!.id}
              options={game.scopes.map((sc) => ({ value: sc.id, label: sc.label }))}
              onChange={(v) => change({ scope: v })}
            />
          </section>
        ) : null}
        <section className="flex flex-col gap-1">
          <h2 className="text-[13px] font-bold uppercase tracking-[0.08em] text-muted-foreground">Reglas</h2>
          <Switch
            label="Evoluciones por intercambio"
            hint="Requiere otra consola"
            checked={options.allowTradeEvolutions}
            onChange={(v) => change({ allowTradeEvolutions: v })}
          />
          <Switch
            label="Legendarios"
            hint="Y singulares"
            checked={options.allowLegendaries}
            onChange={(v) => change({ allowLegendaries: v })}
          />
        </section>
        <ExcludedPicker game={game} excluded={options.excluded} onChange={(excluded) => change({ excluded })} />
        <button
          type="button"
          onClick={newRoute}
          disabled={generating}
          aria-busy={generating}
          className="flex min-h-[52px] items-center justify-center gap-2.5 rounded-xl bg-primary text-[17px] font-extrabold text-primary-foreground hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-progress disabled:brightness-90"
        >
          {generating ? (
            <LoaderCircle aria-hidden className="size-5 animate-spin" strokeWidth={2.4} />
          ) : (
            <RefreshCw aria-hidden className="size-5" strokeWidth={2.4} />
          )}
          {generating ? "Buscando…" : "Otra ruta"}
        </button>
        <p className="-mt-2 text-center text-xs text-muted-foreground">
          La ruta no guarda tu partida: con el mismo enlace, cualquiera ve la misma.
        </p>
      </CollapsiblePanel>

      <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-6">
        {!game.publishable ? (
          <p className="rounded-xl border border-dashed border-[#BDB5A6] bg-card px-4 py-3 text-sm">
            <strong>Borrador:</strong> los datos de {game.name} están en revisión y pueden contener errores.
          </p>
        ) : null}
        {notice ? (
          <p role="status" className="rounded-xl bg-tough px-4 py-3 text-sm text-tough-foreground">
            {notice}
          </p>
        ) : null}

        <section
          ref={resultsRef}
          tabIndex={-1}
          aria-label="Resultado"
          className="flex scroll-mt-4 flex-wrap items-end justify-between gap-4 outline-none"
        >
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-muted-foreground">Pokémon {game.name}</span>
            <h1 className="text-4xl font-extrabold leading-none tracking-tight sm:text-[40px]">Ruta de capturas</h1>
            <p className="max-w-[60ch] text-[15px] text-muted-foreground">
              Qué capturar en cada tramo antes de cada jefe. No es un equipo cerrado: ve eligiendo sobre la marcha.
            </p>
          </div>
          {seed !== null ? (
            <span className="rounded-xl border border-border bg-card px-3 py-2.5 font-mono text-[13px]">
              semilla {formatSeed(seed)}
            </span>
          ) : null}
        </section>

        <ol className={cn("flex flex-col transition-opacity", generating && "opacity-40")} aria-busy={generating}>
          {picked.map(({ stop, picks }, i) => {
            const segment = game.segments.find((s) => s.id === stop.segment);
            const tone = SEGMENT_TONE(stop.order, game.segments.length);
            const bosses = stop.bossIds.map((id) => bossById.get(id)).filter((b) => b !== undefined);
            const last = i === picked.length - 1;
            return (
              <li key={stop.segment} className="relative flex gap-4 pb-8 last:pb-0">
                {!last ? <span aria-hidden className="absolute top-8 bottom-0 left-[15px] w-0.5 bg-border" /> : null}
                <span
                  aria-hidden
                  className="z-[1] flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white"
                  style={{ backgroundColor: tone.bar }}
                >
                  {i + 1}
                </span>
                <section className="flex min-w-0 flex-1 flex-col gap-3.5" aria-labelledby={`stop-${stop.segment}`}>
                  <header className="flex flex-col gap-1.5">
                    <h2 id={`stop-${stop.segment}`} className="text-xl font-extrabold leading-tight">
                      {segment?.label ?? stop.segment}
                    </h2>
                    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                      <span>Nivel esperado {stop.expectedLevel}</span>
                      <span aria-hidden>·</span>
                      <span>
                        Próximo:{" "}
                        <strong className="text-foreground">
                          {bosses.length > 2 ? "Alto Mando y Campeón" : bosses.map((b) => b.name).join(" y ")}
                        </strong>
                      </span>
                      {[...new Set(bosses.map((b) => b.mainType))].map((t) => (
                        <TypeBadge key={t} type={t} name={game.typeNames[t] ?? t} />
                      ))}
                    </p>
                  </header>

                  {stop.starters.length ? (
                    <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3.5">
                      <h3 className="text-[13px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                        Iniciales · cómo le va a cada uno
                      </h3>
                      <ul className="grid gap-2 sm:grid-cols-3">
                        {stop.starters.map((c) => (
                          <li key={c.finalFormId} className="flex items-center gap-2 text-sm">
                            <Sprite game={game} id={c.finalFormId} size={40} />
                            <span className="flex min-w-0 flex-col">
                              <span className="font-bold">{name(c.finalFormId)}</span>
                              <span className="text-xs text-muted-foreground">
                                Contra el 1er jefe {c.shortTerm} · a la larga {c.longTerm}
                              </span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {picks.length ? (
                    <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,250px),1fr))] gap-3">
                      {picks.map((c) => (
                        <CandidateCard key={c.finalFormId} c={c} game={game} />
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nada que merezca la pena en este tramo con estas opciones.
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {stop.usefulTms.length ? (
                      <p className="min-w-0 flex-1 text-[13px] leading-snug">
                        <span className="font-bold">MT de este tramo: </span>
                        {stop.usefulTms
                          .map(
                            (t) =>
                              `${game.moveNames[t.moveId] ?? t.moveId} (${tmLabel(t.number)} · ${t.where}${t.repeatable ? "" : " · un solo uso"}) para ${t.forFinalForms.map(name).join(", ")}`,
                          )
                          .join(" · ")}
                      </p>
                    ) : (
                      <span />
                    )}
                    {stop.candidates.length > picks.length ? (
                      <button
                        type="button"
                        onClick={() => seeOthers(i)}
                        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-foreground bg-card px-3.5 text-sm font-bold"
                      >
                        <Shuffle aria-hidden className="size-4" />
                        Ver otras
                      </button>
                    ) : null}
                  </div>
                </section>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function Sprite({ game, id, size }: { game: ClientGame; id: number; size: number }) {
  const sprite = game.species[id]?.sprite;
  return sprite ? (
    <Image src={sprite} alt="" width={size} height={size} unoptimized className="shrink-0 [image-rendering:pixelated]" />
  ) : (
    <span className="shrink-0" style={{ width: size, height: size }} aria-hidden />
  );
}

function CandidateCard({ c, game }: { c: RouteCandidate; game: ClientGame }) {
  const name = (id: number) => game.species[id]?.name ?? `#${id}`;
  const label = LABEL[c.label];
  const rare = c.rarity === "rare" || c.rarity === "very-rare";
  const move = c.reason ? (game.moveNames[c.reason.moveId] ?? c.reason.moveId) : null;
  const source = c.reason
    ? c.reason.source.kind === "level"
      ? `nv ${c.reason.source.level}`
      : tmLabel(c.reason.source.number)
    : "";
  return (
    <li className="flex flex-col gap-2.5 rounded-2xl border border-border bg-card p-3.5">
      <div className="flex items-center gap-2.5">
        <Sprite game={game} id={c.finalFormId} size={56} />
        <div className="flex min-w-0 flex-col gap-1">
          <span className="truncate text-[17px] font-extrabold leading-tight">{name(c.finalFormId)}</span>
          <span className="flex flex-wrap gap-1">
            {game.species[c.finalFormId]?.typing.map((t) => (
              <TypeBadge key={t} type={t} name={game.typeNames[t] ?? t} />
            ))}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold", label.className)}>{label.text}</span>
        {c.isNewInSegment ? (
          <span className="rounded-full border border-foreground px-2 py-0.5 text-xs font-bold">Nuevo aquí</span>
        ) : null}
      </div>
      <p className="text-[13px] leading-snug">
        {c.speciesId !== c.finalFormId ? `${name(c.speciesId)} · ` : ""}
        {c.where} · {methodLabel({ method: c.method, kind: c.method ? "wild" : "gift" }, game.methodNames)}
        <span
          className={cn(
            "ml-1.5 inline-block whitespace-nowrap rounded-md px-2 text-xs font-semibold",
            rare ? "bg-tough text-tough-foreground" : "border border-[#BDB5A6] text-[#3A3832]",
          )}
        >
          {RARITY_LABEL[c.rarity]}
          {c.chance !== undefined ? ` · ${c.chance} %` : ""}
        </span>
      </p>
      {move && c.reason ? (
        <p className="text-[13px] leading-snug text-[#3A3832]">
          {c.formId !== c.finalFormId ? `Como ${name(c.formId)} (nv ${c.level}): ` : ""}
          <strong>{move}</strong> ({source}) contra {game.typeNames[c.reason.vsBossType] ?? c.reason.vsBossType}
          {c.weakness >= 2 ? <span className="font-semibold text-tough-foreground"> · recibe ×{c.weakness}</span> : null}
        </p>
      ) : null}
    </li>
  );
}
