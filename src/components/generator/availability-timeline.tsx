import type { ClientGame } from "@/lib/game-data";
import type { PoolEntry } from "@/lib/types";
import { SEGMENT_TONE } from "@/lib/ui/labels";

/** Which member arrives in each story segment (specs/06). */
export function AvailabilityTimeline({ team, game }: { team: readonly PoolEntry[]; game: ClientGame }) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5" aria-labelledby="timeline-title">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="timeline-title" className="text-[22px] font-extrabold">
          Cuándo tienes a cada uno
        </h2>
        <span className="text-sm text-muted-foreground">Tramos de la historia de {game.name}</span>
      </div>
      <div className="overflow-x-auto">
        <ol
          className="grid min-w-[720px] gap-1.5"
          style={{ gridTemplateColumns: `repeat(${game.segments.length}, minmax(0, 1fr))` }}
        >
          {game.segments.map((s) => {
            const members = team.filter((m) => m.firstAvailable === s.id);
            const tone = SEGMENT_TONE(s.order, game.segments.length);
            return (
              <li key={s.id} className="flex flex-col gap-2">
                <div className="h-2 rounded" style={{ backgroundColor: members.length ? tone.bar : "#DDD7CB" }} />
                <span className="text-xs font-bold text-muted-foreground">{s.label}</span>
                <span className="text-[13px] font-semibold leading-relaxed">
                  {members.map((m) => (
                    <span key={m.finalFormId} className="block">
                      {game.species[m.finalFormId]?.name}
                    </span>
                  ))}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
