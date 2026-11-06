import { DIFFICULTY_LABELS, type DifficultyResult } from "@/lib/analysis/difficulty";
import { DIFFICULTY_COMPONENT_HINTS, DIFFICULTY_COMPONENT_LABELS, DIFFICULTY_TONE } from "@/lib/ui/labels";

/** "Dificultad: Normal" pill (specs/05). */
export function DifficultyPill({ result, compact = false }: { result: DifficultyResult; compact?: boolean }) {
  const tone = DIFFICULTY_TONE[result.level];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[13px] font-bold"
      style={{ backgroundColor: tone.bg, color: tone.fg }}
    >
      {compact ? null : "Dificultad: "}
      {DIFFICULTY_LABELS[result.level]}
      <span className="font-mono text-[11px] font-semibold opacity-80">{result.score}</span>
    </span>
  );
}

/** Pill plus, on demand, the four components that make the score. */
export function DifficultyBadge({ result }: { result: DifficultyResult }) {
  const keys = Object.keys(DIFFICULTY_COMPONENT_LABELS) as (keyof typeof DIFFICULTY_COMPONENT_LABELS)[];
  return (
    <details className="group relative">
      <summary className="cursor-pointer list-none rounded-full focus-visible:outline-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
        <DifficultyPill result={result} />
        <span className="sr-only"> · ver desglose</span>
      </summary>
      <div className="absolute left-0 top-full z-10 mt-2 flex w-[min(300px,calc(100vw-32px))] flex-col gap-2.5 rounded-xl border border-border bg-card p-3.5 shadow-lg">
        <p className="text-[13px] text-muted-foreground">Puntuación de 0 a 100: cuanto más alta, más difícil. Mide combates, no rareza.</p>
        <ul className="flex flex-col gap-2">
          {keys.map((k) => (
            <li key={k} className="flex flex-col gap-1">
              <span className="flex justify-between text-[13px]">
                <span className="font-semibold" title={DIFFICULTY_COMPONENT_HINTS[k]}>
                  {DIFFICULTY_COMPONENT_LABELS[k]}
                </span>
                <span className="font-mono">{result.components[k]}</span>
              </span>
              <span className="h-1.5 overflow-hidden rounded-full bg-background" aria-hidden>
                <span className="block h-full rounded-full bg-foreground" style={{ width: `${result.components[k]}%` }} />
              </span>
              <span className="text-xs text-muted-foreground">{DIFFICULTY_COMPONENT_HINTS[k]}</span>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
