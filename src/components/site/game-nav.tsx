import Link from "next/link";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "", label: "Equipo" },
  { href: "/ruta", label: "Ruta" },
  { href: "/destacados", label: "Destacados" },
] as const;

/** Sections of a game (specs/06). */
export function GameNav({ slug, current }: { slug: string; current: (typeof TABS)[number]["href"] }) {
  return (
    <nav aria-label="Secciones del juego" className="mx-auto max-w-[1280px] px-4 pt-5 sm:px-6">
      <ul className="flex gap-1.5">
        {TABS.map((t) => {
          const active = t.href === current;
          return (
            <li key={t.href}>
              <Link
                href={`/${slug}${t.href}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-10 items-center rounded-xl px-3.5 text-sm font-bold focus-visible:outline-2 focus-visible:outline-ring",
                  active ? "bg-foreground text-white" : "border border-border bg-card hover:bg-background",
                )}
              >
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
