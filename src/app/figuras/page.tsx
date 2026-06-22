export const revalidate = 3600;

import Link from "next/link";
import type { Metadata } from "next";
import { getFigurasIndex } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Figuras retóricas",
  description:
    "Índice de figuras retóricas, tópicos literarios y recursos de estilo presentes en la antología ¡LEE! Con ejemplos directos de los textos.",
};

// Category display config
const CATEGORIES = [
  {
    key: "tropo",
    label: "Tropos",
    desc: "Metáforas, comparaciones, hipérboles, ironías y otras imágenes",
    bg: "bg-[#f5c4b2]/30",
    border: "border-[#d88a6e]",
    dot: "bg-[#d88a6e]",
    text: "text-[#7a2331]",
  },
  {
    key: "topos",
    label: "Tópicos literarios",
    desc: "Lugares comunes que atraviesan la tradición occidental",
    bg: "bg-[#c4dfb8]/30",
    border: "border-[#5a9e4e]",
    dot: "bg-[#5a9e4e]",
    text: "text-[#2d5a27]",
  },
  {
    key: "sintaxis",
    label: "Recursos sintácticos",
    desc: "Anáforas, paralelismos, hipérbaton, quiasmos y estructuras especulares",
    bg: "bg-[#c4d4ec]/30",
    border: "border-[#4a6fa8]",
    dot: "bg-[#4a6fa8]",
    text: "text-[#1a3a6b]",
  },
  {
    key: "sonoro",
    label: "Recursos sonoros",
    desc: "Aliteración, paronomasia, rima interna y juegos fónicos",
    bg: "bg-[#dcd4ec]/30",
    border: "border-[#7a5ea8]",
    dot: "bg-[#7a5ea8]",
    text: "text-[#4a2d7a]",
  },
] as const;

/** Extracts "Figure Name" from "**Figure Name**: description..." */
function parseFigura(content: string): { name: string; excerpt: string } {
  const match = content.match(/^\*\*([^*]+)\*\*:?\s*/);
  if (match) {
    const name = match[1].replace(/:$/, "").trim();
    const rest = content.slice(match[0].length).trim();
    const excerpt = rest.length > 140 ? rest.slice(0, 138) + "…" : rest;
    return { name, excerpt };
  }
  // No bold name — use full content as excerpt
  const plain = content.replace(/\*\*/g, "");
  return {
    name: "",
    excerpt: plain.length > 140 ? plain.slice(0, 138) + "…" : plain,
  };
}

export default async function FigurasPage() {
  const annotations = await getFigurasIndex();

  const totalFigs = annotations.length;
  const byCategory = new Map<string, typeof annotations>(
    CATEGORIES.map((c) => [c.key, []]),
  );
  for (const ann of annotations) {
    byCategory.get(ann.category ?? "")?.push(ann);
  }

  return (
    <div>
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="border-b-2 border-accent px-6 pb-10 pt-16 sm:px-12 animate-portada-fade-up">
        <div className="mx-auto flex max-w-4xl items-end justify-between gap-8">
          <div>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-accent mb-3">
              recursos de estilo · {totalFigs} anotaciones
            </p>
            <h1
              className="font-display font-black text-ink leading-[0.9] tracking-tight"
              style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)", letterSpacing: "-0.03em" }}
            >
              Figuras
            </h1>
          </div>
          <p
            className="hidden sm:block font-serif italic font-light text-ink-soft text-right max-w-xs leading-relaxed self-end pb-1"
            style={{ fontSize: "clamp(0.85rem, 1.4vw, 1rem)" }}
          >
            Tropos, tópicos, recursos sintácticos y sonoros identificados en los textos de la antología.
          </p>
        </div>
      </div>

      {/* ── Legend ───────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-4xl px-6 sm:px-12 pt-8 pb-2 flex flex-wrap gap-4">
        {CATEGORIES.map((cat) => (
          <a
            key={cat.key}
            href={`#${cat.key}`}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1 text-xs hover:border-accent hover:text-accent transition-colors"
          >
            <span className={`size-2.5 rounded-full ${cat.dot}`} aria-hidden />
            {cat.label}
            <span className="text-ink-soft">
              ({byCategory.get(cat.key)?.length ?? 0})
            </span>
          </a>
        ))}
      </div>

      {/* ── Category sections ────────────────────────────────────────────── */}
      <div className="mx-auto max-w-4xl px-6 sm:px-12 pb-24 space-y-16 pt-8">
        {CATEGORIES.map((cat) => {
          const items = byCategory.get(cat.key) ?? [];
          if (items.length === 0) return null;

          return (
            <section key={cat.key} id={cat.key}>
              {/* Section header */}
              <div className={`rounded-lg border-l-4 ${cat.border} ${cat.bg} px-5 py-4 mb-6`}>
                <div className="flex items-baseline gap-3">
                  <h2 className={`font-display text-2xl font-bold italic ${cat.text}`}>
                    {cat.label}
                  </h2>
                  <span className="text-sm text-ink-soft">
                    {items.length} {items.length === 1 ? "ejemplo" : "ejemplos"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-ink-soft">{cat.desc}</p>
              </div>

              {/* Annotation list */}
              <ul className="divide-y divide-line">
                {items.map((ann) => {
                  const { name, excerpt } = parseFigura(ann.content);
                  return (
                    <li key={ann.id} className="py-4 group">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          {name && (
                            <span
                              className={`inline-block font-display font-bold italic text-base mr-2 ${cat.text}`}
                            >
                              {name}
                            </span>
                          )}
                          {excerpt && (
                            <span className="text-sm text-ink leading-relaxed">
                              {excerpt}
                            </span>
                          )}
                        </div>
                        <Link
                          href={`/fragmentos/${ann.fragment.slug}`}
                          className="shrink-0 self-start sm:self-center text-xs text-ink-soft border border-line rounded-full px-3 py-1 hover:border-accent hover:text-accent transition-colors whitespace-nowrap"
                          title={`${ann.fragment.headline} — ${ann.fragment.work.title}, ${ann.fragment.work.author.name}`}
                        >
                          {ann.fragment.headline.length > 32
                            ? ann.fragment.headline.slice(0, 30) + "…"
                            : ann.fragment.headline}
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
