"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ERA_RANGES, ERA_COLORS, TIMELINE_START, TIMELINE_END } from "@/lib/timeline";

export type TimelineWork = {
  id: string;
  slug: string;
  title: string;
  authorName: string;
  year: number;
  era: string;
  firstFragmentSlug: string | null;
};

type Tooltip = {
  work: TimelineWork;
  x: number;
  y: number;
};

const PX_PER_YEAR = 2.2;
const TOTAL_W = Math.round((TIMELINE_END - TIMELINE_START) * PX_PER_YEAR);
const ERA_BAND_H = 44;
const AXIS_Y = ERA_BAND_H + 8;
const DOT_AREA_Y = AXIS_Y + 12;
const DOT_R = 5;
const ROW_H = 16;
const BOTTOM_LABEL_Y = 24;

function xOf(year: number) {
  return Math.round((year - TIMELINE_START) * PX_PER_YEAR);
}

/** Pre-compute vertical rows to avoid dot overlap (greedy lane assignment). */
function assignRows(works: TimelineWork[]): { work: TimelineWork; row: number }[] {
  const sorted = [...works].sort((a, b) => a.year - b.year);
  const lanes: number[] = []; // rightmost x used in each lane

  return sorted.map((work) => {
    const x = xOf(work.year);
    let row = lanes.findIndex((end) => end + DOT_R * 2 + 4 <= x);
    if (row === -1) {
      row = lanes.length;
      lanes.push(x + DOT_R);
    } else {
      lanes[row] = x + DOT_R;
    }
    return { work, row };
  });
}

const YEAR_TICKS = Array.from(
  { length: Math.floor((TIMELINE_END - TIMELINE_START) / 100) + 1 },
  (_, i) => TIMELINE_START + i * 100,
);

export function TimelineClient({ works }: { works: TimelineWork[] }) {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const [activeEra, setActiveEra] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close tooltip on scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = () => setTooltip(null);
    el.addEventListener("scroll", handler);
    return () => el.removeEventListener("scroll", handler);
  }, []);

  const filtered = activeEra ? works.filter((w) => w.era === activeEra) : works;
  const placed = assignRows(filtered);
  const maxRow = placed.reduce((m, { row }) => Math.max(m, row), 0);
  const totalH = DOT_AREA_Y + (maxRow + 1) * ROW_H + DOT_R + BOTTOM_LABEL_Y + 8;

  const eraEntries = Object.entries(ERA_RANGES);

  return (
    <div>
      {/* ── Era filter chips ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveEra(null)}
          style={{ transition: "none" }}
          className={`px-3 py-1 text-xs font-semibold border-2 border-ink ${
            activeEra === null ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-ink hover:text-paper"
          }`}
        >
          TODAS
        </button>
        {eraEntries.map(([era]) => {
          const active = activeEra === era;
          const hasWorks = works.some((w) => w.era === era);
          if (!hasWorks) return null;
          return (
            <button
              key={era}
              onClick={() => setActiveEra(active ? null : era)}
              style={{
                transition: "none",
                backgroundColor: active ? ERA_COLORS[era] : undefined,
                borderColor: ERA_COLORS[era] ?? "var(--color-ink)",
              }}
              className={`px-3 py-1 text-xs font-semibold border-2 ${
                active ? "text-ink" : "text-ink hover:text-ink"
              }`}
            >
              {era}
            </button>
          );
        })}
      </div>

      {/* ── Timeline ─────────────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="overflow-x-auto pb-4 relative"
        style={{ cursor: "default" }}
      >
        <div
          className="relative"
          style={{ width: `${TOTAL_W}px`, height: `${totalH}px` }}
        >
          {/* Era color bands */}
          {eraEntries.map(([era, [start, end]]) => {
            const color = ERA_COLORS[era] ?? "var(--color-line)";
            const x = xOf(start);
            const w = xOf(end) - x;
            const dimmed = activeEra && activeEra !== era;
            return (
              <div
                key={era}
                className="absolute top-0 overflow-hidden"
                style={{
                  left: x,
                  width: w,
                  height: ERA_BAND_H,
                  backgroundColor: color,
                  opacity: dimmed ? 0.3 : 1,
                  transition: "opacity 200ms",
                  borderRight: "1px solid rgba(0,0,0,0.08)",
                }}
              >
                <span
                  className="absolute bottom-1.5 left-2 text-[10px] font-bold uppercase tracking-wider text-ink/60 whitespace-nowrap"
                  style={{ fontSize: "9px" }}
                >
                  {era}
                </span>
              </div>
            );
          })}

          {/* Horizontal axis */}
          <div
            className="absolute bg-ink/20"
            style={{ top: AXIS_Y, left: 0, width: TOTAL_W, height: 1 }}
          />

          {/* Year ticks */}
          {YEAR_TICKS.map((yr) => {
            const x = xOf(yr);
            return (
              <div key={yr} className="absolute" style={{ left: x, top: AXIS_Y - 4 }}>
                <div className="w-px bg-ink/20" style={{ height: 8 }} />
                <span
                  className="absolute top-2 text-ink-soft whitespace-nowrap"
                  style={{ fontSize: "9px", transform: "translateX(-50%)" }}
                >
                  {yr}
                </span>
              </div>
            );
          })}

          {/* Work dots */}
          {placed.map(({ work, row }) => {
            const x = xOf(work.year);
            const y = DOT_AREA_Y + row * ROW_H;
            const color = ERA_COLORS[work.era] ?? "var(--color-accent)";
            const href = work.firstFragmentSlug
              ? `/fragmentos/${work.firstFragmentSlug}`
              : `/obras/${work.slug}`;

            return (
              <Link
                key={work.id}
                href={href}
                className="absolute"
                style={{ left: x - DOT_R, top: y }}
                onMouseEnter={(e) => {
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  const containerRect = containerRef.current?.getBoundingClientRect();
                  setTooltip({
                    work,
                    x: rect.left - (containerRect?.left ?? 0) + (containerRef.current?.scrollLeft ?? 0),
                    y: rect.top - (containerRect?.top ?? 0) - 8,
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
              >
                <div
                  className="rounded-full border border-ink/20 hover:scale-150 transition-transform"
                  style={{
                    width: DOT_R * 2,
                    height: DOT_R * 2,
                    backgroundColor: color,
                    transition: "transform 150ms ease",
                  }}
                />
              </Link>
            );
          })}

          {/* Tooltip */}
          {tooltip && (
            <div
              className="pointer-events-none absolute z-20"
              style={{
                left: tooltip.x,
                top: tooltip.y,
                transform: "translate(-50%, -100%)",
              }}
            >
              <div
                className="bg-ink text-paper px-3 py-2 text-left shadow-lg"
                style={{ minWidth: 140, maxWidth: 220 }}
              >
                <p className="font-display text-sm italic font-semibold leading-tight">
                  {tooltip.work.title}
                </p>
                <p className="mt-0.5 text-[11px] opacity-70">
                  {tooltip.work.authorName} · {tooltip.work.year}
                </p>
              </div>
              <div
                className="mx-auto"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "7px solid transparent",
                  borderRight: "7px solid transparent",
                  borderTop: "7px solid var(--color-ink)",
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Count */}
      <p className="mt-2 text-xs text-ink-soft">
        {filtered.length} obra{filtered.length !== 1 ? "s" : ""}
        {activeEra ? ` del ${activeEra}` : " en la antología"}
        {" · "}
        <button
          onClick={() => setActiveEra(null)}
          className="underline underline-offset-2 hover:text-accent"
          style={{ display: activeEra ? undefined : "none" }}
        >
          Ver todas
        </button>
      </p>
    </div>
  );
}
