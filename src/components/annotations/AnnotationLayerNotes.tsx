"use client";

import { useReadingSettings } from "@/components/reading-settings/ReadingSettingsProvider";
import { AnnotationContent } from "./AnnotationContent";
import type { FragmentAnnotation } from "@/lib/annotations";

const CATEGORY_LABELS: Record<string, string> = {
  tropo: "Tropo",
  topos: "Tópico",
  sintaxis: "Recurso sintáctico",
  sonoro: "Recurso sonoro",
};

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function NoteSection({ title, children }: SectionProps) {
  return (
    <section className="mt-10 border-t border-line pt-6">
      <h2 className="mb-3 font-serif text-xl italic">{title}</h2>
      {children}
    </section>
  );
}

export function AnnotationLayerNotes({ annotations }: { annotations: FragmentAnnotation[] }) {
  const { layers } = useReadingSettings();

  // Only unanchored annotations are handled here; anchored ones appear inline in AnnotatedText
  const unanchored = annotations.filter((a) => a.anchorStart == null || a.anchorEnd == null);

  const contextoNotes = unanchored.filter((a) => a.type === "contexto");
  const figuraNotes = unanchored.filter((a) => a.type === "figura");
  const intertextNotes = unanchored.filter((a) => a.type === "intertextualidad");

  const showContexto = layers.contexto && contextoNotes.length > 0;
  const showFigura = layers.figuras && figuraNotes.length > 0;
  const showIntertext = layers.intertextualidad && intertextNotes.length > 0;

  if (!showContexto && !showFigura && !showIntertext) return null;

  return (
    <div>
      {showContexto && (
        <NoteSection title="Contexto">
          <div className="space-y-3 text-sm leading-relaxed text-ink">
            {contextoNotes.map((a) => (
              <div key={a.id} className="rounded border-l-2 border-[var(--color-layer-contexto)] bg-[color-mix(in_srgb,var(--color-layer-contexto)_8%,transparent)] px-4 py-2.5">
                <AnnotationContent content={a.content} />
              </div>
            ))}
          </div>
        </NoteSection>
      )}

      {showFigura && (
        <NoteSection title="Estilo">
          <div className="space-y-3 text-sm leading-relaxed text-ink">
            {figuraNotes.map((a) => (
              <div key={a.id} className="rounded border-l-2 border-[var(--color-figure-tropo)] bg-[color-mix(in_srgb,var(--color-figure-tropo)_8%,transparent)] px-4 py-2.5">
                {a.category && (
                  <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.12em] text-ink-soft">
                    {CATEGORY_LABELS[a.category] ?? a.category}
                  </p>
                )}
                <AnnotationContent content={a.content} />
              </div>
            ))}
          </div>
        </NoteSection>
      )}

      {showIntertext && (
        <NoteSection title="Conexiones culturales">
          <div className="space-y-3 text-sm leading-relaxed text-ink">
            {intertextNotes.map((a) => (
              <div key={a.id} className="rounded border-l-2 border-[var(--color-layer-intertext)] bg-[color-mix(in_srgb,var(--color-layer-intertext)_8%,transparent)] px-4 py-2.5">
                <AnnotationContent content={a.content} />
              </div>
            ))}
          </div>
        </NoteSection>
      )}
    </div>
  );
}
