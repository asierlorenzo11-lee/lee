"use client";

import { Check } from "lucide-react";
import { useReadFragments } from "@/lib/readingProgress";

export function MarkAsReadButton({ slug }: { slug: string }) {
  const { isRead, toggleRead } = useReadFragments();
  const read = isRead(slug);

  return (
    <button
      type="button"
      onClick={() => toggleRead(slug)}
      aria-pressed={read}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
        read
          ? "border-accent bg-accent-soft text-accent"
          : "border-line text-ink-soft hover:border-accent hover:text-accent"
      }`}
    >
      <Check size={16} aria-hidden />
      {read ? "Leído" : "Marcar como leído"}
    </button>
  );
}
