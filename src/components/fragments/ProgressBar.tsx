"use client";

import { useReadFragments } from "@/lib/readingProgress";

export function ProgressBar({ slugs }: { slugs: string[] }) {
  const { readSlugs } = useReadFragments();

  const total = slugs.length;
  const done = slugs.filter((slug) => readSlugs.has(slug)).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div>
      <div className="flex items-baseline justify-between text-sm text-ink-soft">
        <span>Progreso de lectura</span>
        <span>
          {done} de {total} paradas
        </span>
      </div>
      <div className="mt-1.5 h-2 w-full rounded-full border border-line bg-paper-soft">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
