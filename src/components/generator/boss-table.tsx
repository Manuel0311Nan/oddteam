"use client";

import { ChevronDown } from "lucide-react";
import { bossesForTeam } from "@/lib/analysis/boss-variants";
import { teamVerdict, type Verdict } from "@/lib/analysis/bosses";
import type { MoveSource } from "@/lib/analysis/moves";
import type { ClientGame } from "@/lib/game-data";
import { bossesInScope, scopeMaxRank } from "@/lib/generator/scope";
import type { PoolEntry } from "@/lib/types";
import { TypeBadge } from "./type-badge";

const VERDICT: Record<Verdict, { label: string; className: string }> = {
  advantage: { label: "Ventaja", className: "bg-advantage text-advantage-foreground" },
  neutral: { label: "Neutro", className: "bg-neutral text-neutral-foreground" },
  tough: { label: "Complicado", className: "bg-tough text-tough-foreground" },
};

function kindLabel(id: string, kind: string): string {
  if (kind === "gym") {
    const n = /^gym-(\d+)$/.exec(id)?.[1];
    return n ? `Gimnasio ${n}` : id.startsWith("kanto-") ? "Gimnasio de Kanto" : "Gimnasio";
  }
  if (kind === "elite-four") return "Alto Mando";
  if (kind === "champion") return "Campeón";
  return "Rival";
}

function sourceLabel(source: MoveSource, game: ClientGame): string {
  if (source.kind === "level") return `Nv. ${source.level}`;
  const tm = game.tms[source.number];
  const number = source.number.replace(/^TM/, "MT").replace(/^HM/, "MO");
  return `${number}${tm ? ` · ${tm.where}` : ""}${tm && !tm.repeatable ? " · un solo uso" : ""}`;
}

/** "Contra los jefes": verdict per boss and, on demand, moves and TMs per member (specs/04, specs/06). */
export function BossTable({ team, game, scope }: { team: readonly PoolEntry[]; game: ClientGame; scope?: string }) {
  const name = (id: number) => game.species[id]?.name ?? `#${id}`;

  return (
    <section className="flex flex-col gap-3.5 rounded-2xl border border-border bg-card p-5" aria-labelledby="bosses-title">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="bosses-title" className="text-[22px] font-extrabold">
          Contra los jefes
        </h2>
        <span className="text-sm text-muted-foreground">Orientativo: tipos, niveles y ataques a tiempo</span>
      </div>

      <ul className="flex flex-col">
        {bossesForTeam(bossesInScope(game.bosses, game.segments, scopeMaxRank(game, scope)), team).map((boss) => {
          const v = teamVerdict(team, boss, game.matchups);
          const keys = [...new Set(v.answers.filter((x): x is number => x !== null))];
          const level = game.segments.find((s) => s.id === boss.segment)?.expectedLevel;
          const unavailable = team.filter((m) => !v.available.includes(m.finalFormId));
          return (
            <li key={boss.id} className="border-b border-[#ECE7DC] last:border-b-0">
              <details className="group">
                <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 py-2.5 [&::-webkit-details-marker]:hidden">
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="font-bold">{boss.name}</span>
                      {/* On narrow screens the type column is hidden: show it next to the name. */}
                      <span className="sm:hidden">
                        <TypeBadge type={boss.mainType} name={game.typeNames[boss.mainType] ?? boss.mainType} />
                      </span>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {kindLabel(boss.id, boss.kind)}
                      {boss.ifStarter !== undefined ? ` · si elegiste a ${name(boss.ifStarter)}` : ""}
                      {level ? ` · as al nv ${Math.max(...boss.team.map((m) => m.level))}` : ""}
                    </span>
                  </span>
                  <span className="hidden sm:block">
                    <TypeBadge type={boss.mainType} name={game.typeNames[boss.mainType] ?? boss.mainType} />
                  </span>
                  <span className="hidden min-w-0 flex-1 truncate text-sm text-[#3A3832] md:block">
                    {keys.length ? keys.map(name).join(", ") : "—"}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${VERDICT[v.verdict].className}`}>
                    {VERDICT[v.verdict].label}
                  </span>
                  <ChevronDown aria-hidden className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>

                <div className="flex flex-col gap-4 pb-4 pt-1">
                  <p className="text-sm">
                    {v.reason}
                    {v.weak.length ? ` Débiles a su tipo: ${v.weak.map(name).join(", ")}.` : ""}
                  </p>

                  {v.available.length ? (
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {team
                        .filter((m) => v.available.includes(m.finalFormId))
                        .map((m) => {
                          const mu = game.matchups[m.finalFormId]?.[boss.id];
                          if (!mu) return null;
                          const formName = name(mu.formId);
                          return (
                            <li key={m.finalFormId} className="flex flex-col gap-1.5 rounded-xl bg-background p-3">
                              <span className="text-sm font-bold">
                                {name(m.finalFormId)}
                                {mu.formId !== m.finalFormId ? (
                                  <span className="font-normal text-muted-foreground"> (aún como {formName}, nv {mu.level})</span>
                                ) : null}
                                {mu.weakness >= 2 ? (
                                  <span className="ml-1.5 rounded bg-tough px-1.5 text-xs font-bold text-tough-foreground">
                                    recibe ×{mu.weakness}
                                  </span>
                                ) : null}
                              </span>
                              {mu.moves.length ? (
                                <ol className="flex flex-col gap-0.5 text-[13px]">
                                  {mu.moves.map((mv) => (
                                    <li key={mv.moveId}>
                                      <span className="font-semibold">{game.moveNames[mv.moveId] ?? mv.moveId}</span>{" "}
                                      <span className="text-muted-foreground">({sourceLabel(mv.source, game)})</span>
                                    </li>
                                  ))}
                                </ol>
                              ) : (
                                <span className="text-[13px] text-muted-foreground">Sin ataques de daño a tiempo.</span>
                              )}
                            </li>
                          );
                        })}
                    </ul>
                  ) : null}

                  {(() => {
                    // Group by TM: a single-use TM can only go to one of the members.
                    const byTm = new Map<string, { boost: (typeof game.matchups)[number][string]["tmBoosts"][number]; members: number[] }>();
                    for (const m of team) {
                      if (!v.available.includes(m.finalFormId)) continue;
                      for (const b of game.matchups[m.finalFormId]?.[boss.id]?.tmBoosts ?? []) {
                        const key = b.source.kind === "tm" ? b.source.number : b.moveId;
                        const g = byTm.get(key) ?? { boost: b, members: [] };
                        g.members.push(m.finalFormId);
                        byTm.set(key, g);
                      }
                    }
                    const boosts = [...byTm.values()];
                    if (!boosts.length) return null;
                    return (
                      <div className="flex flex-col gap-1.5">
                        <h3 className="text-[13px] font-bold uppercase tracking-[0.08em] text-muted-foreground">MT recomendadas</h3>
                        <ul className="flex flex-col gap-1 text-[13px]">
                          {boosts.map(({ members, boost }) => {
                            const single =
                              boost.source.kind === "tm" && game.tms[boost.source.number]?.repeatable === false && members.length > 1;
                            return (
                              <li key={boost.moveId}>
                                <span className="font-semibold">{game.moveNames[boost.moveId] ?? boost.moveId}</span> —{" "}
                                {sourceLabel(boost.source, game)} — para {members.map(name).join(single ? " o " : ", ")}
                                {single ? " (elige uno)" : ""}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })()}

                  {unavailable.length ? (
                    <p className="text-[13px] text-muted-foreground">Aún no disponibles: {unavailable.map((m) => name(m.finalFormId)).join(", ")}.</p>
                  ) : null}
                </div>
              </details>
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-muted-foreground">
        Las evoluciones por amistad, belleza u otras condiciones no se dan por hechas. Físico/especial según la clasificación
        moderna.
      </p>
    </section>
  );
}
