"use client";

import { LoaderCircle, RefreshCw, X } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { CollapsiblePanel, Segmented, Switch } from "@/components/ui/segmented";
import { DIFFICULTY_LABELS } from "@/lib/analysis/difficulty";
import type { ClientGame } from "@/lib/game-data";
import { type DifficultyFilter, type GeneratorOptions, type RarityFilter, TYPE_NAMES, type TypeName } from "@/lib/types";

type Props = {
  game: ClientGame;
  options: GeneratorOptions;
  onChange: (patch: Partial<GeneratorOptions>) => void;
  onGenerate: () => void;
  /** True while a team is being generated (loading state of the button). */
  generating?: boolean;
};

const Heading = ({ children, id }: { children: React.ReactNode; id?: string }) => (
  <h2 id={id} className="text-[13px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
    {children}
  </h2>
);

export function OptionsPanel({ game, options, onChange, onGenerate, generating = false }: Props) {
  const typeOptions = TYPE_NAMES.filter((t) => game.typeNames[t]).map((t) => ({ value: t, label: game.typeNames[t] as string }));
  const starterMode = options.starter.mode;
  const typeMode = options.typeRule.mode;

  return (
    <CollapsiblePanel label="Opciones" summary={optionsSummary(game, options)}>
      {game.scopes && game.scopes.length > 1 ? (
        <section className="flex flex-col gap-2.5">
          <Heading>Alcance</Heading>
          <Segmented
            label="Alcance de la historia"
            value={options.scope ?? game.scopes[0]!.id}
            options={game.scopes.map((sc) => ({ value: sc.id, label: sc.label }))}
            onChange={(v) => onChange({ scope: v })}
          />
        </section>
      ) : null}

      <section className="flex flex-col gap-2.5">
        <Heading>Tamaño del equipo</Heading>
        <Segmented
          label="Tamaño del equipo"
          value={String(options.size)}
          options={["1", "2", "3", "4", "5", "6"].map((v) => ({ value: v, label: v }))}
          onChange={(v) => onChange({ size: Number(v) })}
        />
      </section>

      <section className="flex flex-col gap-2.5">
        <Heading>Inicial</Heading>
        <Segmented
          label="Inicial"
          value={starterMode}
          options={[
            { value: "none", label: "Ninguno" },
            { value: "random", label: "Aleatorio" },
            { value: "pick", label: "Elegir" },
          ]}
          onChange={(v) =>
            onChange({
              starter:
                v === "pick"
                  ? { mode: "pick", speciesId: game.starters[0]?.speciesId ?? 0 }
                  : { mode: v as "none" | "random" },
            })
          }
        />
        {options.starter.mode === "pick" ? (
          <label className="flex flex-col gap-1.5 text-[13px] text-muted-foreground">
            Inicial elegido
            <select
              value={options.starter.speciesId}
              onChange={(e) => onChange({ starter: { mode: "pick", speciesId: Number(e.target.value) } })}
              className="min-h-11 rounded-xl border border-border bg-card px-3 text-[15px] text-foreground"
            >
              {game.starters.map((s) => (
                <option key={s.speciesId} value={s.speciesId}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </section>

      <section className="flex flex-col gap-2.5">
        <Heading>Tipos</Heading>
        <Segmented
          label="Regla de tipos"
          columns={2}
          value={typeMode}
          options={[
            { value: "unique", label: "Sin repetir" },
            { value: "max-two", label: "Máx. 2 por tipo" },
            { value: "free", label: "Libre" },
            { value: "mono", label: "Monotipo" },
          ]}
          onChange={(v) =>
            onChange({
              typeRule:
                v === "mono"
                  ? { mode: "mono", type: options.typeRule.mode === "mono" ? options.typeRule.type : "water" }
                  : { mode: v as "unique" | "max-two" | "free" },
            })
          }
        />
        {options.typeRule.mode === "mono" ? (
          <label className="flex flex-col gap-1.5 text-[13px] text-muted-foreground">
            Tipo del equipo
            <select
              value={options.typeRule.type}
              onChange={(e) => onChange({ typeRule: { mode: "mono", type: e.target.value as TypeName } })}
              className="min-h-11 rounded-xl border border-border bg-card px-3 text-[15px] text-foreground"
            >
              {typeOptions.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </section>

      <section className="flex flex-col gap-2.5">
        <Heading>Dificultad</Heading>
        <Segmented<DifficultyFilter>
          label="Dificultad"
          columns={5}
          value={options.difficulty}
          options={[
            { value: "any", label: "Todas" },
            { value: "easy", label: "Paseo" },
            { value: "normal", label: "Normal" },
            { value: "hard", label: "Exig." },
            { value: "challenge", label: "Reto" },
          ]}
          onChange={(v) => onChange({ difficulty: v })}
        />
      </section>

      <section className="flex flex-col gap-2.5">
        <Heading>Rareza</Heading>
        <Segmented<RarityFilter>
          label="Rareza"
          value={options.rarity}
          options={[
            { value: "any", label: "Cualquiera" },
            { value: "no-very-rare", label: "Sin muy raros" },
            { value: "easy-only", label: "Solo fáciles" },
          ]}
          onChange={(v) => onChange({ rarity: v })}
        />
      </section>

      <section className="flex flex-col gap-1">
        <Heading>Reglas</Heading>
        <Switch
          label="Progresión equilibrada"
          hint="La mitad del equipo antes del 2º gimnasio"
          checked={options.balancedProgression}
          onChange={(v) => onChange({ balancedProgression: v })}
        />
        <Switch
          label="Evoluciones por intercambio"
          hint="Requiere otra consola"
          checked={options.allowTradeEvolutions}
          onChange={(v) => onChange({ allowTradeEvolutions: v })}
        />
        <Switch
          label="Legendarios"
          hint="Y singulares"
          checked={options.allowLegendaries}
          onChange={(v) => onChange({ allowLegendaries: v })}
        />
      </section>

      <ExcludedPicker game={game} excluded={options.excluded} onChange={(excluded) => onChange({ excluded })} />

      <button
        type="button"
        onClick={onGenerate}
        disabled={generating}
        aria-busy={generating}
        className="flex min-h-[52px] items-center justify-center gap-2.5 rounded-xl bg-primary text-[17px] font-extrabold text-primary-foreground hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-progress disabled:brightness-90"
      >
        {generating ? (
          <LoaderCircle aria-hidden className="size-5 animate-spin" strokeWidth={2.4} />
        ) : (
          <RefreshCw aria-hidden className="size-5" strokeWidth={2.4} />
        )}
        {generating ? "Generando…" : "Generar equipo"}
      </button>
      <p className="-mt-2 text-center text-xs text-muted-foreground">Las opciones se aplican al generar.</p>
    </CollapsiblePanel>
  );
}

/** "6 · inicial aleatorio · sin repetir tipos · Paseo" (specs/06). */
export function optionsSummary(game: ClientGame, o: GeneratorOptions): string {
  const starter =
    o.starter.mode === "none"
      ? "sin inicial"
      : o.starter.mode === "random"
        ? "inicial aleatorio"
        : `con ${game.species[o.starter.speciesId]?.name ?? "inicial"}`;
  const types =
    o.typeRule.mode === "unique"
      ? "sin repetir tipos"
      : o.typeRule.mode === "max-two"
        ? "máx. 2 por tipo"
        : o.typeRule.mode === "free"
          ? "tipos libres"
          : `monotipo ${game.typeNames[o.typeRule.type] ?? o.typeRule.type}`;
  const scope = game.scopes && game.scopes.length > 1 ? (game.scopes.find((sc) => sc.id === o.scope) ?? game.scopes[0])?.label : null;
  return [
    scope,
    String(o.size),
    starter,
    types,
    o.difficulty === "any" ? null : DIFFICULTY_LABELS[o.difficulty],
    o.allowTradeEvolutions ? "con intercambio" : null,
    o.allowLegendaries ? "con legendarios" : null,
    o.excluded.length ? `${o.excluded.length} excluidos` : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function ExcludedPicker({
  game,
  excluded,
  onChange,
}: {
  game: ClientGame;
  excluded: readonly number[];
  onChange: (ids: number[]) => void;
}) {
  const listId = useId();
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Any species of a pool line can be excluded (excluding one form excludes its line entries).
  const byName = useMemo(() => {
    const ids = new Set<number>();
    for (const p of game.pool) {
      ids.add(p.speciesId);
      for (const s of p.evolution) ids.add(s.toSpeciesId);
    }
    const map = new Map<string, number>();
    for (const id of ids) {
      const n = game.species[id]?.name;
      if (n) map.set(n.toLocaleLowerCase("es"), id);
    }
    return map;
  }, [game]);

  const add = () => {
    const id = byName.get(text.trim().toLocaleLowerCase("es"));
    if (!id) {
      setError("No encuentro ese Pokémon en este juego.");
      return;
    }
    setError(null);
    setText("");
    if (!excluded.includes(id)) onChange([...excluded, id]);
  };

  return (
    <section className="flex flex-col gap-2.5">
      <Heading>Excluir mis habituales</Heading>
      {excluded.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5">
          {excluded.map((id) => {
            const name = game.species[id]?.name ?? `#${id}`;
            return (
              <li key={id} className="inline-flex items-center gap-1 rounded-full bg-background py-1 pr-1 pl-3 text-sm font-semibold">
                {name}
                <button
                  type="button"
                  aria-label={`Quitar ${name}`}
                  onClick={() => onChange(excluded.filter((x) => x !== id))}
                  className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-card"
                >
                  <X aria-hidden className="size-4" />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
      >
        <label className="flex min-w-0 flex-1 flex-col gap-1.5 text-[13px] text-muted-foreground">
          Añadir Pokémon
          <input
            list={listId}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribe un nombre…"
            className="min-h-11 w-full min-w-0 rounded-xl border border-border bg-card px-3 text-[15px] text-foreground"
          />
        </label>
        <button
          type="submit"
          className="mt-auto min-h-11 shrink-0 rounded-xl border border-foreground px-3 text-sm font-bold"
        >
          Añadir
        </button>
      </form>
      <datalist id={listId}>
        {[...byName.keys()].sort().map((n) => (
          <option key={n} value={game.species[byName.get(n) as number]?.name} />
        ))}
      </datalist>
      {error ? (
        <p role="alert" className="text-[13px] text-destructive">
          {error}
        </p>
      ) : null}
    </section>
  );
}
