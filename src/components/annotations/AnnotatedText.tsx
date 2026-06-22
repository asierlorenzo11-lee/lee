"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import * as Popover from "@radix-ui/react-popover";
import { useReadingSettings } from "@/components/reading-settings/ReadingSettingsProvider";
import {
  buildSegments,
  LAYER_BY_ANNOTATION_TYPE,
  type FragmentAnnotation,
  type TextSegment,
} from "@/lib/annotations";
import { AnnotationCard } from "./AnnotationCard";
import { ContextMarker } from "./ContextMarker";
import { ContextPanel } from "./ContextPanel";

/** Wraps parenthetical stage directions in <em> for italic rendering. */
function withStageDirections(text: string): ReactNode {
  const parts = text.split(/(\([^)]*\))/);
  if (parts.length === 1) return text;
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("(") && part.endsWith(")") ? (
          <em key={i} className="text-ink-soft">{part}</em>
        ) : (
          part || null
        )
      )}
    </>
  );
}

export function AnnotatedText({
  text,
  annotations,
}: {
  text: string;
  annotations: FragmentAnnotation[];
}) {
  const { layers } = useReadingSettings();
  const [activeContext, setActiveContext] = useState<FragmentAnnotation | null>(null);

  const activeAnnotations = useMemo(
    () =>
      annotations.filter((a) => {
        const layer = LAYER_BY_ANNOTATION_TYPE[a.type];
        return layer ? layers[layer] : false;
      }),
    [annotations, layers],
  );

  const segments = useMemo(
    () => buildSegments(text, activeAnnotations),
    [text, activeAnnotations],
  );

  return (
    <>
      <div className="prose-reading">
        {segments.map((segment, i) => (
          <Segment key={i} segment={segment} onOpenContext={setActiveContext} />
        ))}
      </div>
      <ContextPanel annotation={activeContext} onClose={() => setActiveContext(null)} />
    </>
  );
}

function Segment({
  segment,
  onOpenContext,
}: {
  segment: TextSegment;
  onOpenContext: (annotation: FragmentAnnotation) => void;
}) {
  const contextoAnno = segment.annotations.find((a) => a.type === "contexto");
  const contextoEnd = segment.annotations.find(
    (a) => a.type === "contexto" && a.anchorEnd === segment.end,
  );
  const interactive = segment.annotations.filter((a) => a.type !== "contexto");

  const figuras = interactive.filter((a) => a.type === "figura");
  const figureCategories = [
    ...new Set(figuras.map((a) => a.category).filter((c): c is string => !!c)),
  ];
  const hasFigura = figuras.length > 0;
  const hasGlosa = interactive.some((a) => a.type === "glosa");
  const hasIntertext = interactive.some((a) => a.type === "intertextualidad");

  // Background: si hay dos categorías de figura distintas, degradado diagonal visible.
  const figureStyle: React.CSSProperties | undefined =
    figureCategories.length >= 2
      ? {
          background: `linear-gradient(135deg, var(--color-figure-${figureCategories[0]}) 50%, var(--color-figure-${figureCategories[1]}) 50%)`,
        }
      : undefined;

  const highlightClass = hasFigura
    ? "figure-highlight"
    : contextoAnno
      ? "context-highlight"
      : hasIntertext
        ? "intertext-highlight"
        : hasGlosa
          ? "gloss-highlight"
          : null;

  if (interactive.length === 0) {
    return (
      <>
        {contextoAnno ? (
          <span className={highlightClass!}>{withStageDirections(segment.text)}</span>
        ) : (
          withStageDirections(segment.text)
        )}
        {contextoEnd && <ContextMarker annotation={contextoEnd} onOpen={onOpenContext} />}
      </>
    );
  }

  const classes = ["annotation-btn"];
  if (highlightClass) classes.push(highlightClass);
  if (hasGlosa) classes.push("gloss-term");
  if (hasIntertext) classes.push("intertext-link");

  return (
    <>
      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            type="button"
            className={classes.join(" ")}
            data-category={figureCategories.length === 1 ? figureCategories[0] : undefined}
            style={figureStyle}
          >
            {segment.text}
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="z-50 w-[min(20rem,90vw)] space-y-3 rounded border border-line bg-paper p-3 font-sans shadow-lg"
            sideOffset={6}
          >
            {interactive.map((a) => (
              <AnnotationCard key={a.id} annotation={a} />
            ))}
            <Popover.Arrow className="fill-paper" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {contextoEnd && <ContextMarker annotation={contextoEnd} onOpen={onOpenContext} />}
    </>
  );
}
