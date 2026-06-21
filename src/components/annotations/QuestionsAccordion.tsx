"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { useReadingSettings } from "@/components/reading-settings/ReadingSettingsProvider";
import { AnnotationContent } from "./AnnotationContent";
import type { FragmentAnnotation } from "@/lib/annotations";

const GROUP_ORDER = ["literal", "interpretativo", "valorativo"] as const;

const GROUP_LABELS: Record<string, string> = {
  literal: "Comprensión literal",
  interpretativo: "Interpretación",
  valorativo: "Valoración personal",
};

export function QuestionsAccordion({ annotations }: { annotations: FragmentAnnotation[] }) {
  const { layers } = useReadingSettings();
  const questions = annotations.filter((a) => a.type === "pregunta");

  if (!layers.preguntas || questions.length === 0) return null;

  const groups = GROUP_ORDER.map((key) => ({
    key,
    label: GROUP_LABELS[key],
    items: questions
      .filter((q) => q.questionGroup === key)
      .sort((a, b) => a.order - b.order),
  })).filter((g) => g.items.length > 0);

  if (groups.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-4 font-serif text-xl italic">Comentario</h2>
      <Accordion.Root type="multiple" className="space-y-2">
        {groups.map((group) => (
          <Accordion.Item
            key={group.key}
            value={group.key}
            className="rounded border border-line"
          >
            <Accordion.Header>
              <Accordion.Trigger className="group flex w-full items-center justify-between px-4 py-3 text-left font-medium">
                {group.label}
                <ChevronDown
                  size={18}
                  aria-hidden
                  className="shrink-0 transition-transform group-data-[state=open]:rotate-180"
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
              <ol className="list-decimal space-y-3 px-4 pb-4 pl-9 text-sm">
                {group.items.map((q) => (
                  <li key={q.id}>
                    <AnnotationContent content={q.content} />
                  </li>
                ))}
              </ol>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  );
}
