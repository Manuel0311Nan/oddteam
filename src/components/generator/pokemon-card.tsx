"use client";

import Image from "next/image";
import { compareRarity, encounterRarity } from "@/lib/analysis/rarity";
import type { ClientGame } from "@/lib/game-data";
import type { Encounter, EvolutionStep, PoolEntry } from "@/lib/types";
import { methodLabel, RARITY_LABEL, SEGMENT_TONE } from "@/lib/ui/labels";
import { cn } from "@/lib/utils";
import { TypeBadge } from "./type-badge";

function bestFirst(entry: PoolEntry, game: ClientGame): { best: Encounter | undefined; others: Encounter[] } {
  const order = (id: string) => game.segments.find((s) => s.id === id)?.order ?? 99;
  const sorted = [...entry.encounters].sort(
    (a, b) => order(a.segment) - order(b.segment) || compareRarity(encounterRarity(a), encounterRarity(b)),
  );
  return { best: sorted[0], others: sorted.slice(1) };
}

function rarityText(e: Encounter): string {
  const r = encounterRarity(e);
  const pct = e.kind === "wild" && !e.rarity && e.chance !== undefined ? ` · ${e.chance} %` : "";
  return `${RARITY_LABEL[r]}${pct}`;
}

function stepText(step: EvolutionStep, game: ClientGame): string {
  const to = game.species[step.toSpeciesId]?.name ?? `#${step.toSpeciesId}`;
  const item = step.itemId ? (game.itemNames[step.itemId] ?? step.itemId) : null;
  switch (step.trigger) {
    case "level-up":
      return step.minLevel ? `${to} (nv ${step.minLevel})` : `${to} (subiendo de nivel)`;
    case "friendship":
      return `${to} (amistad)`;
    case "use-item":
      return `${to} (${item})`;
    case "trade":
      return `${to} (intercambio${item ? ` con ${item}` : ""})`;
    default:
      return `${to} (método especial)`;
  }
}

export function PokemonCard({
  entry,
  game,
  locked,
  onToggleLock,
  onReroll,
  disabled,
}: {
  entry: PoolEntry;
  game: ClientGame;
  locked: boolean;
  onToggleLock: () => void;
  onReroll: () => void;
  disabled?: boolean;
}) {
  const final = game.species[entry.finalFormId];
  const { best, others } = bestFirst(entry, game);
  const segment = game.segments.find((s) => s.id === entry.firstAvailable);
  const tone = SEGMENT_TONE(segment?.order ?? 0, game.segments.length);
  const caughtAs = best ? game.species[best.asSpeciesId]?.name : undefined;
  const name = final?.name ?? `#${entry.finalFormId}`;

  return (
    <article className="flex flex-col gap-3.5 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-3.5">
        <div className="flex size-[76px] shrink-0 items-center justify-center rounded-xl bg-[#FAF8F3]">
          {final?.sprite ? (
            <Image
              src={final.sprite}
              alt=""
              width={72}
              height={72}
              unoptimized
              className="[image-rendering:pixelated]"
            />
          ) : (
            <span className="font-mono text-xs text-muted-foreground">#{entry.finalFormId}</span>
          )}
        </div>
        <div className="flex min-w-0 flex-col gap-1.5">
          <span className="font-mono text-xs text-muted-foreground">#{String(entry.finalFormId).padStart(3, "0")}</span>
          <h3 className="text-xl font-extrabold leading-tight tracking-tight">{name}</h3>
          <div className="flex flex-wrap gap-1.5">
            {final?.typing.map((t) => <TypeBadge key={t} type={t} name={game.typeNames[t] ?? t} />)}
          </div>
        </div>
      </div>

      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm leading-snug">
        <dt className="text-muted-foreground">Captura</dt>
        <dd>
          {best ? (
            <>
              {caughtAs && caughtAs !== name ? `${caughtAs} · ` : ""}
              {best.where} · {methodLabel(best, game.methodNames)}
              <span
                className={cn(
                  "ml-1.5 inline-block whitespace-nowrap rounded-md px-2 text-xs font-semibold",
                  encounterRarity(best) === "rare" || encounterRarity(best) === "very-rare"
                    ? "bg-tough text-tough-foreground"
                    : "border border-[#BDB5A6] text-[#3A3832]",
                )}
              >
                {rarityText(best)}
              </span>
              {best.unique ? <span className="ml-1.5 text-xs text-muted-foreground">(una sola oportunidad)</span> : null}
            </>
          ) : (
            "—"
          )}
        </dd>
        <dt className="text-muted-foreground">Cuándo</dt>
        <dd>
          <span className="rounded-md px-2 py-0.5 text-[13px] font-semibold" style={{ backgroundColor: tone.bg, color: tone.fg }}>
            {segment?.label ?? entry.firstAvailable}
          </span>
        </dd>
        <dt className="text-muted-foreground">Evoluciona</dt>
        <dd>{entry.evolution.length === 0 ? "No evoluciona" : entry.evolution.map((s) => stepText(s, game)).join(" → ")}</dd>
      </dl>

      {others.length > 0 ? (
        <details className="text-sm">
          <summary className="cursor-pointer font-semibold text-muted-foreground">Otras formas de conseguirlo ({others.length})</summary>
          <ul className="mt-2 flex flex-col gap-1">
            {others.map((e, i) => (
              <li key={i} className="text-[13px] leading-snug">
                {game.species[e.asSpeciesId]?.name} · {e.where} · {methodLabel(e, game.methodNames)} · {rarityText(e)} ·{" "}
                <span className="text-muted-foreground">{game.segments.find((s) => s.id === e.segment)?.label}</span>
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      <div className="flex gap-2 border-t border-[#ECE7DC] pt-3">
        <button
          type="button"
          aria-pressed={locked}
          onClick={onToggleLock}
          className={cn(
            "min-h-11 flex-1 rounded-xl border border-foreground text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            locked ? "bg-foreground text-white" : "bg-card",
          )}
        >
          {locked ? "Fijado" : "Fijar"}
        </button>
        <button
          type="button"
          onClick={onReroll}
          disabled={disabled || locked}
          className="min-h-11 flex-1 rounded-xl border border-border bg-card text-sm font-semibold disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Cambiar
        </button>
      </div>
    </article>
  );
}
