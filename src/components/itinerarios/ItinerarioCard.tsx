"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { ItinerarioIcon, ITINERARY_IDENTITY } from "./ItinerarioIcon";

type Parada = {
  slug: string;
  title: string;
  workTitle: string;
  authorName: string;
};

interface Props {
  slug: string;
  title: string;
  description: string | null;
  paradas: Parada[];
  index: number;
}

export function ItinerarioCard({ slug, title, description, paradas, index }: Props) {
  const [open, setOpen] = useState(false);
  const identity = ITINERARY_IDENTITY[slug];
  const accentColor = identity?.color ?? "var(--color-accent)";
  const accentBg = identity?.bg ?? "var(--color-accent-soft)";

  return (
    <div
      className="border border-line rounded overflow-hidden transition-colors duration-200"
      style={{
        borderColor: open ? accentColor : undefined,
        animationDelay: `${index * 0.08 + 0.05}s`,
      }}
      onMouseEnter={e => { if (!open) (e.currentTarget as HTMLElement).style.borderColor = accentColor; }}
      onMouseLeave={e => { if (!open) (e.currentTarget as HTMLElement).style.borderColor = ""; }}
    >
      {/* Head */}
      <div
        className="flex items-start justify-between gap-4 px-6 py-6 cursor-pointer select-none sm:px-8 sm:py-7"
        onClick={() => setOpen(o => !o)}
      >
        <ItinerarioIcon slug={slug} className="h-10 w-10 shrink-0 mt-0.5" />

        <div className="flex-1 min-w-0">
          <p
            className="font-display italic font-bold text-ink mb-2 leading-tight"
            style={{ fontSize: "clamp(1.2rem, 3vw, 2rem)" }}
          >
            {title}
          </p>
          {description && (
            <p className="font-serif font-light text-ink-soft leading-relaxed text-sm max-w-2xl">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-start gap-3 shrink-0 pt-1">
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.14em] whitespace-nowrap" style={{ color: accentColor }}>
            {paradas.length} {paradas.length === 1 ? "parada" : "paradas"}
          </span>
          <span
            className="flex items-center justify-center w-7 h-7 rounded-full border border-line flex-shrink-0 transition-all duration-250"
            style={open ? { background: accentColor, borderColor: accentColor } : {}}
          >
            <ChevronDown
              size={12}
              className="transition-transform duration-300"
              style={{
                stroke: open ? "white" : "var(--color-ink-soft)",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div
        className="overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ maxHeight: open ? `${paradas.length * 80 + 48}px` : "0px" }}
      >
        <div
          className="px-6 pb-8 pt-2 relative sm:px-8"
          style={{ background: accentBg }}
        >
          {/* Vertical line */}
          <div
            className="absolute top-0 bottom-8 w-px"
            style={{ left: "calc(1.5rem + 11px)", background: accentColor, opacity: 0.35 }}
          />

          {paradas.map((p, i) => (
            <Link
              key={p.slug}
              href={`/fragmentos/${p.slug}`}
              className="group relative flex flex-col gap-0.5 pl-10 py-4"
            >
              {/* Stop dot */}
              <span
                className="absolute left-0 top-4 w-[22px] h-[22px] rounded-full bg-paper border-2 flex items-center justify-center"
                style={{ borderColor: accentColor }}
              >
                <span className="font-mono text-[0.5rem] leading-none" style={{ color: accentColor }}>
                  {i + 1}
                </span>
              </span>

              <span
                className="font-mono text-[0.58rem] uppercase tracking-[0.1em] transition-colors duration-150"
                style={{ color: accentColor }}
              >
                {p.authorName}
              </span>
              <span
                className="font-display italic text-ink leading-snug transition-colors duration-150"
                style={{ fontSize: "1.05rem" }}
              >
                {p.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
