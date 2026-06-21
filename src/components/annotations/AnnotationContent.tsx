import { Markdown } from "@/components/ui/Markdown";

export function AnnotationContent({ content }: { content: string }) {
  return <Markdown content={content} className="text-sm leading-relaxed text-ink" />;
}
