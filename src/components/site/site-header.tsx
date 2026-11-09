import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-ring">
          <svg aria-hidden width="34" height="34" viewBox="0 0 34 34" fill="none">
            <circle cx="17" cy="17" r="15" stroke="currentColor" strokeWidth="2.5" />
            <path d="M2 17h30" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="17" cy="17" r="5" fill="var(--background)" stroke="currentColor" strokeWidth="2.5" />
            <path d="M4.5 12a13 13 0 0 1 25 0" stroke="var(--primary)" strokeWidth="2.5" />
          </svg>
          <span className="flex flex-col">
            <span className="text-[22px] font-extrabold tracking-tight">OddTeam</span>
            <span className="hidden text-[13px] text-muted-foreground sm:block">Equipos aleatorios y válidos para la historia</span>
          </span>
        </Link>
        <Link
          href="/como-funciona"
          className="inline-flex min-h-11 items-center rounded-xl px-2 text-[15px] font-bold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
        >
          Cómo funciona
        </Link>
      </div>
    </header>
  );
}
