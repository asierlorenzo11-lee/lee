import Link from "next/link";
import type { Metadata } from "next";
import { getAllTopics } from "@/lib/queries";
import { TopicIcon } from "@/components/topicos/TopicIcon";

export const metadata: Metadata = {
  title: "Tópicos",
  description: "Los grandes tópicos de la literatura española: carpe diem, ubi sunt, beatus ille, tempus fugit... ideas que reaparecen de obra en obra a lo largo de los siglos.",
};

export default async function TopicosPage() {
  const topics = await getAllTopics();

  return (
    <div>
      {/* ── CABECERA ──────────────────────────────────────────────────── */}
      <div className="border-b-2 border-accent px-6 pb-10 pt-16 sm:px-12 animate-portada-fade-up">
        <div className="mx-auto flex max-w-4xl items-end justify-between gap-8">
          <div>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-accent mb-3">
              índice temático · {topics.length} categorías
            </p>
            <h1
              className="font-display font-black text-ink leading-[0.9] tracking-tight"
              style={{ fontSize: "clamp(3.5rem, 9vw, 7rem)", letterSpacing: "-0.03em" }}
            >
              Tópicos
            </h1>
          </div>
          <p className="hidden sm:block font-serif italic font-light text-ink text-right max-w-xs leading-relaxed self-end pb-1"
             style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)" }}>
            Lugares comunes e ideas recurrentes a través de obras y épocas.
          </p>
        </div>
      </div>

      {/* ── LISTA ─────────────────────────────────────────────────────── */}
      <ul className="mx-auto max-w-4xl px-6 pb-24 sm:px-12">
        {topics.map((topic, i) => {
          const count = topic.fragments.length;
          return (
            <li key={topic.slug} className="border-b border-line">
              <Link
                href={`/topicos/${topic.slug}`}
                className="group grid grid-cols-[1fr_auto] items-start gap-4 border-l-[3px] border-l-transparent pl-5 py-9 transition-[border-color,padding,background] duration-200 hover:border-l-accent hover:pl-8 hover:bg-accent-soft"
                style={{ animationDelay: `${i * 0.06 + 0.15}s` }}
              >
                <div>
                  <div className="mb-3 flex items-center gap-3">
                    <span className="text-ink-soft transition-colors duration-200 group-hover:text-accent">
                      <TopicIcon slug={topic.slug} className="h-5 w-5" />
                    </span>
                    <span
                      className="font-display italic font-bold text-ink leading-tight transition-colors duration-200 group-hover:text-accent"
                      style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)" }}
                    >
                      {topic.name}
                    </span>
                  </div>
                  {topic.description && (
                    <p className="font-serif font-light text-ink leading-[1.75] max-w-2xl"
                       style={{ fontSize: "clamp(0.82rem, 1.3vw, 0.92rem)" }}>
                      {topic.description}
                    </p>
                  )}
                </div>
                <div className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-accent whitespace-nowrap pt-1">
                  {count} {count === 1 ? "fragmento" : "fragmentos"}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
