"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

type Option<T extends string> = { value: T; label: string };

/** Single-choice button group (radio-like), keyboard and screen-reader friendly. */
export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  columns,
}: {
  label: string;
  value: T;
  options: readonly Option<T>[];
  onChange: (value: T) => void;
  columns?: number;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="grid gap-1 rounded-xl bg-background p-1"
      style={{ gridTemplateColumns: `repeat(${columns ?? options.length}, minmax(0, 1fr))` }}
    >
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(o.value)}
            className={cn(
              "min-h-10 rounded-lg px-1 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-ring",
              selected ? "bg-card font-extrabold shadow-sm" : "font-semibold hover:bg-card/60",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** On/off switch with a visible label and hint. The whole row is clickable. */
export function Switch({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex min-h-12 cursor-pointer items-center justify-between gap-3">
      <span className="flex flex-col">
        <span className="text-[15px] font-semibold">{label}</span>
        {hint ? <span className="text-[13px] text-muted-foreground">{hint}</span> : null}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "flex h-7 w-12 shrink-0 rounded-full p-[3px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          checked ? "justify-end bg-primary" : "justify-start bg-[#8E887C]",
        )}
      >
        <span className="block size-[22px] rounded-full bg-white" />
      </button>
    </label>
  );
}

/**
 * Side panel that collapses into a summary bar below the lg breakpoint (specs/06:
 * "móvil: hoja desplegable con resumen"). Always open on desktop.
 */
export function CollapsiblePanel({
  label,
  summary,
  children,
  className,
}: {
  label: string;
  summary: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <aside aria-label={label} className={cn("flex flex-col rounded-2xl border border-border bg-card lg:sticky lg:top-6", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-14 items-center justify-between gap-3 rounded-2xl px-5 py-3 text-left focus-visible:outline-2 focus-visible:outline-ring lg:hidden"
      >
        <span className="flex min-w-0 flex-col">
          <span className="text-[15px] font-extrabold">{label}</span>
          <span className="truncate text-[13px] text-muted-foreground">{summary}</span>
        </span>
        <ChevronDown aria-hidden className={cn("size-5 shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      <div id={id} className={cn("flex-col gap-5 p-5 pt-1 lg:flex lg:pt-5", open ? "flex" : "hidden")}>
        {children}
      </div>
    </aside>
  );
}
