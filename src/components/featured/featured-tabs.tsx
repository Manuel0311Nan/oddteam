"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { DifficultyPill } from "@/components/generator/difficulty-badge";
import { TypeBadge } from "@/components/generator/type-badge";
import { DIFFICULTY_LABELS, type DifficultyComponents } from "@/lib/analysis/difficulty";
import { CAPTURE_EFFORT_LABELS, type CaptureEffort } from "@/lib/generator/effort";
import { DIFFICULTIES, type Difficulty, type Typing } from "@/lib/types";
import { DIFFICULTY_COMPONENT_LABELS } from "@/lib/ui/labels";
import { cn } from "@/lib/utils";

export type FeaturedCard = {
  key: string;
  score: number;
  level: Difficulty;
  components: DifficultyComponents;
  effort: CaptureEffort;
  completeIn: string;
  href: string;
  members: { id: number; name: string; sprite: string | null; typing: Typing }[];
};

export type FeaturedView = Record<Difficulty, FeaturedCard[]>;

const LEVEL_HINTS: Record<Difficulty, string> = {
  easy: "Variedad sin sufrir.",
  normal: "Partida estándar: algún combate exige pensar.",
  hard: "Llega tarde o tiene combates cuesta arriba.",
  challenge: "Huecos tardíos, malos enfrentamientos y poca cobertura.",
};

/** Tabs per difficulty level (specs/05, specs/06). */
export function FeaturedTabs({ view, typeNames }: { view: FeaturedView; typeNames: Record<string, string> }) {
  const [level, setLevel] = useState<Difficulty>("easy");
  const cards = view[level];

  return (
    <div className="flex flex-col gap-5">
      <div role="tablist" aria-label="Dificultad" className="grid grid-cols-4 gap-1 rounded-xl bg-card p-1 sm:max-w-[520px]">
        {DIFFICULTIES.map((d) => (
          <button
            key={d}
            type="button"
            role="tab"
            id={`tab-${d}`}
            aria-selected={d === level}
            aria-controls={`panel-${d}`}
            onClick={() => setLevel(d)}
            className={cn(
              "min-h-11 rounded-lg px-1 text-sm focus-visible:outline-2 focus-visible:outline-ring",
              d === level ? "bg-foreground font-extrabold text-white" : "font-semibold hover:bg-background",
            )}
          >
            {DIFFICULTY_LABELS[d]}
            <span className="ml-1 text-xs opacity-70">{view[d].length}</span>
          </button>
        ))}
      </div>

      <section role="tabpanel" id={`panel-${level}`} aria-labelledby={`tab-${level}`} className="flex flex-col gap-4">
        <p className="text-[15px]">{LEVEL_HINTS[level]}</p>
        {cards.length ? (
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,360px),1fr))] gap-4">
            {cards.map((c) => (
              <li key={c.key} className="flex flex-col gap-3.5 rounded-2xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <DifficultyPill result={{ score: c.score, level: c.level, components: c.components }} />
                  <span className="text-[13px] text-muted-foreground">Esfuerzo de captura: {CAPTURE_EFFORT_LABELS[c.effort]}</span>
                </div>
                <ul className="grid grid-cols-3 gap-2">
                  {c.members.map((m) => (
                    <li key={m.id} className="flex min-w-0 flex-col items-center gap-1 rounded-xl bg-background px-1 py-2 text-center">
                      {m.sprite ? (
                        <Image src={m.sprite} alt="" width={56} height={56} className="[image-rendering:pixelated]" />
                      ) : (
                        <span className="size-14" aria-hidden />
                      )}
                      <span className="w-full truncate text-[13px] font-bold">{m.name}</span>
                      <span className="flex flex-wrap justify-center gap-1">
                        {m.typing.map((t) => (
                          <TypeBadge key={t} type={t} name={typeNames[t] ?? t} />
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
                <dl className="grid grid-cols-4 gap-1 text-center text-xs">
                  {(Object.keys(DIFFICULTY_COMPONENT_LABELS) as (keyof DifficultyComponents)[]).map((k) => (
                    <div key={k} className="flex flex-col">
                      <dt className="text-muted-foreground">{DIFFICULTY_COMPONENT_LABELS[k]}</dt>
                      <dd className="font-mono font-semibold">{c.components[k]}</dd>
                    </div>
                  ))}
                </dl>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[13px] text-muted-foreground">Completo en «{c.completeIn}»</span>
                  <Link
                    href={c.href}
                    className="inline-flex min-h-11 items-center rounded-xl bg-foreground px-3.5 text-sm font-bold text-white focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    Abrir en el generador
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[15px] text-muted-foreground">No hay equipos de este nivel con las opciones por defecto.</p>
        )}
      </section>
    </div>
  );
}
