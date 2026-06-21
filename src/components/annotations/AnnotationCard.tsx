import Link from "next/link";
import { BookOpen, ExternalLink } from "lucide-react";
import { AnnotationContent } from "./AnnotationContent";
import {
  ANNOTATION_TYPE_LABELS,
  FIGURE_CATEGORY_LABELS,
  type FragmentAnnotation,
} from "@/lib/annotations";

/** Tarjeta de una anotación dentro del popover de un fragmento de texto anotado. */
export function AnnotationCard({ annotation }: { annotation: FragmentAnnotation }) {
  const label =
    annotation.type === "figura"
      ? FIGURE_CATEGORY_LABELS[annotation.category ?? ""] ?? ANNOTATION_TYPE_LABELS.figura
      : ANNOTATION_TYPE_LABELS[annotation.type] ?? annotation.type;

  return (
    <div>
      <p className="mb-1 text-xs font-semibold tracking-wide text-accent uppercase">
        {label}
      </p>
      <AnnotationContent content={annotation.content} />

      {annotation.type === "intertextualidad" &&
        annotation.linkType === "internal" &&
        annotation.linkTargetFragment && (
          <Link
            href={`/fragmentos/${annotation.linkTargetFragment.slug}`}
            className="mt-2 inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
          >
            <BookOpen size={14} aria-hidden />
            Ir a «{annotation.linkTargetFragment.title}»
          </Link>
        )}

      {annotation.type === "intertextualidad" && annotation.linkType === "external" && (
        <>
          {annotation.externalCitation && (
            <p className="mt-2 border-l-2 border-line pl-2 text-sm text-ink-soft italic">
              {annotation.externalCitation}
            </p>
          )}
          {annotation.externalUrl && (
            <a
              href={annotation.externalUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
            >
              <ExternalLink size={14} aria-hidden />
              Fuente externa
            </a>
          )}
        </>
      )}
    </div>
  );
}
