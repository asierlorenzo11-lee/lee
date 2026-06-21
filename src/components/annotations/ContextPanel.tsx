"use client";

import { SidePanel } from "@/components/ui/SidePanel";
import { AnnotationContent } from "./AnnotationContent";
import type { FragmentAnnotation } from "@/lib/annotations";

export function ContextPanel({
  annotation,
  onClose,
}: {
  annotation: FragmentAnnotation | null;
  onClose: () => void;
}) {
  return (
    <SidePanel
      open={annotation !== null}
      onOpenChange={(open) => !open && onClose()}
      title="Contexto"
    >
      {annotation && <AnnotationContent content={annotation.content} />}
    </SidePanel>
  );
}
