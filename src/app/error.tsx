"use client";

import Link from "next/link";
import { useEffect } from "react";

/** Unexpected error inside a page (generation errors have their own message in the generator). */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex max-w-[1280px] flex-col items-start gap-4 px-4 pt-16 pb-24 sm:px-6">
      <h1 className="text-4xl font-extrabold tracking-tight">Algo ha fallado</h1>
      <p className="max-w-[60ch] text-lg text-muted-foreground">
        No es culpa tuya. Prueba otra vez; si el enlace venía de otra persona, puede que sea de una versión anterior de los datos.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-11 items-center rounded-xl bg-foreground px-4 text-[15px] font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Reintentar
        </button>
        <Link href="/" className="inline-flex min-h-11 items-center rounded-xl border border-foreground px-4 text-[15px] font-bold">
          Elegir juego
        </Link>
      </div>
    </main>
  );
}
