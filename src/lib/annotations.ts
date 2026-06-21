import type { AnnotationLayer } from "@/components/reading-settings/ReadingSettingsProvider";

/** Forma de una anotación tal como se consulta para la pantalla de fragmento. */
export interface FragmentAnnotation {
  id: string;
  type: string;
  anchorStart: number | null;
  anchorEnd: number | null;
  category: string | null;
  questionGroup: string | null;
  order: number;
  content: string;
  linkType: string | null;
  externalUrl: string | null;
  externalCitation: string | null;
  linkTargetFragment: { slug: string; title: string } | null;
}

export interface TextSegment {
  start: number;
  end: number;
  text: string;
  annotations: FragmentAnnotation[];
}

/** Relaciona el `type` de una anotación con la capa conmutable correspondiente. */
export const LAYER_BY_ANNOTATION_TYPE: Record<string, AnnotationLayer> = {
  glosa: "glosa",
  contexto: "contexto",
  figura: "figuras",
  intertextualidad: "intertextualidad",
  pregunta: "preguntas",
};

export const FIGURE_CATEGORY_LABELS: Record<string, string> = {
  tropo: "Tropo",
  topos: "Tópico",
  sintaxis: "Recurso sintáctico",
  sonoro: "Recurso sonoro",
};

export const ANNOTATION_TYPE_LABELS: Record<string, string> = {
  glosa: "Significado",
  contexto: "Contexto",
  figura: "Estilo",
  pregunta: "Debate",
  intertextualidad: "Conexiones culturales",
};

/**
 * Divide `text` en segmentos según los anchors de `annotations`, de modo que
 * cada segmento tenga un conjunto estable de anotaciones que lo cubren
 * (admite anclas que se solapan parcialmente, no solo anidadas).
 */
export function buildSegments(
  text: string,
  annotations: FragmentAnnotation[],
): TextSegment[] {
  const anchored = annotations.filter(
    (a) => a.anchorStart != null && a.anchorEnd != null,
  ) as (FragmentAnnotation & { anchorStart: number; anchorEnd: number })[];

  if (anchored.length === 0) {
    return text.length > 0
      ? [{ start: 0, end: text.length, text, annotations: [] }]
      : [];
  }

  const breakpoints = new Set<number>([0, text.length]);
  for (const a of anchored) {
    breakpoints.add(a.anchorStart);
    breakpoints.add(a.anchorEnd);
  }
  const sorted = [...breakpoints].sort((a, b) => a - b);

  const segments: TextSegment[] = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    const start = sorted[i];
    const end = sorted[i + 1];
    if (start === end) continue;
    const covering = anchored.filter(
      (a) => a.anchorStart <= start && a.anchorEnd >= end,
    );
    segments.push({ start, end, text: text.slice(start, end), annotations: covering });
  }
  return segments;
}
