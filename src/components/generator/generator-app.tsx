"use client";

import { LoaderCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "zustand";
import { computeDifficulty } from "@/lib/analysis/difficulty";
import { difficultyDataOf } from "@/lib/analysis/difficulty-data";
import type { ClientGame } from "@/lib/game-data";
import { earlyNeeded } from "@/lib/generator/context";
import { CAPTURE_EFFORT_LABELS, captureEffort } from "@/lib/generator/effort";
import { formatSeed } from "@/lib/rng";
import { createGeneratorStore } from "@/store/generator";
import { revealResults } from "@/lib/ui/reveal";
import { AvailabilityTimeline } from "./availability-timeline";
import { BossTable } from "./boss-table";
import { DifficultyBadge } from "./difficulty-badge";
import { OptionsPanel } from "./options-panel";
import { PokemonCard } from "./pokemon-card";

/** Minimum time the loading state is shown, so the change is noticeable. */
const GENERATE_FEEDBACK_MS = 450;

export function GeneratorApp({ game }: { game: ClientGame }) {
  const [store] = useState(() => createGeneratorStore(game));
  const state = useStore(store);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const resultsRef = useRef<HTMLElement>(null);

  /**
   * Generating is instant, so on mobile the button looked dead: the team was
   * off-screen below the options. Show a short loading state, then bring the
   * team into view (and focus it for screen readers).
   */
  const generateWithFeedback = useCallback(() => {
    if (generating) return;
    setGenerating(true);
    setAnnouncement("");
    window.setTimeout(() => {
      store.getState().generate();
      setGenerating(false);
      const { error } = store.getState();
      setAnnouncement(error ? "No se ha podido generar el equipo." : "Equipo nuevo generado.");
      window.requestAnimationFrame(() => revealResults(resultsRef.current));
    }, GENERATE_FEEDBACK_MS);
  }, [generating, store]);

  // Read the link once on mount, then keep the URL in sync with the team.
  useEffect(() => {
    store.getState().hydrate(window.location.search);
  }, [store]);

  useEffect(() => {
    if (!state.ready || state.slots.length === 0) return;
    const q = store.getState().query();
    if (q) window.history.replaceState(null, "", `?${q}`);
  }, [state.ready, state.slots, state.seed, state.options, store]);

  const team = useMemo(() => state.slots.map((s) => s.entry), [state.slots]);
  const order = (id: string) => game.segments.find((s) => s.id === id)?.order ?? 0;
  const lastSegment = team.length
    ? game.segments.find((s) => s.order === Math.max(...team.map((m) => order(m.firstAvailable))))
    : undefined;
  const early = team.filter((m) => order(m.firstAvailable) <= 1).length;
  const effort = team.length ? captureEffort(team) : null;
  const dd = useMemo(() => difficultyDataOf(game, state.options.scope), [game, state.options.scope]);
  const difficulty = useMemo(() => (team.length ? computeDifficulty(team, dd) : null), [team, dd]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copia este enlace:", window.location.href);
    }
  };

  return (
    <div className="flex flex-wrap items-start gap-7">
      <div className="w-full lg:w-[340px] lg:shrink-0">
        <OptionsPanel game={game} options={state.options} onChange={state.setOptions} onGenerate={generateWithFeedback} generating={generating} />
      </div>

      <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-7">
        {!game.publishable ? (
          <p className="rounded-xl border border-dashed border-[#BDB5A6] bg-card px-4 py-3 text-sm">
            <strong>Borrador:</strong> los datos de {game.name} están en revisión y pueden contener errores.
          </p>
        ) : null}
        {state.notice ? (
          <p role="status" className="rounded-xl bg-tough px-4 py-3 text-sm text-tough-foreground">
            {state.notice}
          </p>
        ) : null}

        <p role="status" className="sr-only">
          {announcement}
        </p>

        <section
          ref={resultsRef}
          tabIndex={-1}
          aria-label="Resultado"
          className="flex scroll-mt-4 flex-wrap items-end justify-between gap-4 outline-none"
        >
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-muted-foreground">
              Pokémon {game.name} · {game.region.charAt(0).toUpperCase() + game.region.slice(1)}
            </span>
            <h1 className="text-4xl font-extrabold leading-none tracking-tight sm:text-[40px]">Tu próximo equipo</h1>
            {team.length ? (
              <div className="flex flex-wrap items-center gap-2.5">
                {difficulty ? <DifficultyBadge result={difficulty} /> : null}
                {effort ? (
                  <span className="rounded-full border border-foreground px-3 py-0.5 text-[13px] font-bold">
                    Esfuerzo de captura: {CAPTURE_EFFORT_LABELS[effort]}
                  </span>
                ) : null}
                <span className="text-[15px] text-muted-foreground">
                  Equipo completo en el tramo «{lastSegment?.label}» · {early} de {team.length} antes del 2º gimnasio
                  {state.options.balancedProgression ? ` (mínimo ${Math.min(team.length, earlyNeeded(team.length))})` : ""}
                </span>
              </div>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {state.seed !== null ? (
              <span className="rounded-xl border border-border bg-card px-3 py-2.5 font-mono text-[13px]">
                semilla {formatSeed(state.seed)}
              </span>
            ) : null}
            <button
              type="button"
              onClick={copyLink}
              disabled={!team.length}
              className="min-h-11 rounded-xl border border-foreground bg-card px-3.5 text-sm font-bold disabled:opacity-50"
            >
              {copied ? "¡Copiado!" : "Copiar enlace"}
            </button>
            <button
              type="button"
              onClick={generateWithFeedback}
              disabled={generating}
              aria-busy={generating}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-foreground px-3.5 text-sm font-bold text-white disabled:opacity-80"
            >
              {generating ? <LoaderCircle aria-hidden className="size-4 animate-spin" /> : null}
              {generating ? "Generando…" : "Regenerar no fijados"}
            </button>
          </div>
        </section>

        {state.error ? (
          <p role="alert" className="rounded-xl border border-destructive/40 bg-card px-4 py-3 text-[15px]">
            {state.error}
          </p>
        ) : null}

        <section aria-label="Equipo" aria-busy={!state.ready || generating} className="grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-4">
          <h2 className="sr-only">Miembros del equipo</h2>
          {!state.ready || generating
            ? Array.from({ length: state.options.size }, (_, i) => (
                <div key={i} className="h-[260px] animate-pulse rounded-2xl border border-border bg-card" />
              ))
            : state.slots.map((slot, i) => (
                <PokemonCard
                  key={`${slot.entry.finalFormId}-${i}`}
                  entry={slot.entry}
                  game={game}
                  locked={slot.locked}
                  onToggleLock={() => state.toggleLock(i)}
                  onReroll={() => state.reroll(i)}
                />
              ))}
        </section>

        {team.length ? <AvailabilityTimeline team={team} game={game} /> : null}
        {team.length ? <BossTable team={team} game={game} scope={state.options.scope} /> : null}
      </div>
    </div>
  );
}
