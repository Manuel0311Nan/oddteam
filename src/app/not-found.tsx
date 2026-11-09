import Link from "next/link";
import { SiteHeader } from "@/components/site/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-[1280px] flex-col items-start gap-4 px-4 pt-16 pb-24 sm:px-6">
        <span className="font-mono text-sm text-muted-foreground">404</span>
        <h1 className="text-4xl font-extrabold tracking-tight">Esta página no existe</h1>
        <p className="max-w-[60ch] text-lg text-muted-foreground">
          Puede que el juego todavía no esté disponible o que el enlace esté mal copiado.
        </p>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-xl bg-foreground px-4 text-[15px] font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Elegir juego
        </Link>
      </main>
    </>
  );
}
