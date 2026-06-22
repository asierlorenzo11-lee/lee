"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-20 text-center">
      <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-accent mb-4">
        algo salió mal
      </p>
      <h1
        className="font-display font-black text-ink leading-[0.9] tracking-tight mb-8"
        style={{ fontSize: "clamp(3rem, 8vw, 6rem)", letterSpacing: "-0.03em" }}
      >
        Error
      </h1>
      <p className="font-serif italic text-ink-soft text-lg mb-10">
        No se ha podido cargar esta página.
      </p>
      <button
        onClick={reset}
        className="inline-block border-2 border-ink px-6 py-2.5 text-sm font-medium text-ink hover:bg-ink hover:text-paper transition-colors"
      >
        Reintentar
      </button>
    </div>
  );
}
