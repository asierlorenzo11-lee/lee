"use client";

import { useReadingSettings } from "@/components/reading-settings/ReadingSettingsProvider";
import { FIGURE_CATEGORY_LABELS, type FragmentAnnotation } from "@/lib/annotations";

export function FigureLegend({ annotations }: { annotations: FragmentAnnotation[] }) {
  const { layers } = useReadingSettings();
  if (!layers.figuras) return null;

  const categories = [
    ...new Set(
      annotations
        .filter((a) => a.type === "figura" && a.category)
        .map((a) => a.category as string),
    ),
  ];
  if (categories.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-soft">
      <span className="font-medium text-ink">Estilo:</span>
      {categories.map((category) => (
        <span key={category} className="inline-flex items-center gap-1.5">
          <span
            className="figure-highlight inline-block size-3 rounded-sm"
            data-category={category}
            aria-hidden
          />
          {FIGURE_CATEGORY_LABELS[category] ?? category}
        </span>
      ))}
    </div>
  );
}
