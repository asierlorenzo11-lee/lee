"use client";

import { ScrollText } from "lucide-react";
import type { FragmentAnnotation } from "@/lib/annotations";

export function ContextMarker({
  annotation,
  onOpen,
}: {
  annotation: FragmentAnnotation;
  onOpen: (annotation: FragmentAnnotation) => void;
}) {
  return (
    <button
      type="button"
      className="annotation-btn context-marker"
      aria-label="Ver contextualización histórica"
      onClick={() => onOpen(annotation)}
    >
      <ScrollText size={12} aria-hidden className="inline" />
    </button>
  );
}
