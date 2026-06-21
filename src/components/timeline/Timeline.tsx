"use client";

import { useState } from "react";
import Link from "next/link";
import { buildAuthorBands, eraColor, ERA_COLORS, TIMELINE_START, TIMELINE_END } from "@/lib/timeline";
import type { getTimelineData } from "@/lib/queries";

const PX_PER_YEAR = 1.4;
const LEFT_MARGIN = 190;
const RIGHT_MARGIN = 24;
const TOP_MARGIN = 44;
const ROW_HEIGHT = 34;
const BOTTOM_MARGIN = 48;

const CENTURY_NUMERALS: Record<number, string> = {
  1000: "XI",
  1100: "XII",
  1200: "XIII",
  1300: "XIV",
  1400: "XV",
  1500: "XVI",
  1600: "XVII",
  1700: "XVIII",
  1800: "XIX",
};

const ERA_LABELS: [string, string][] = [
  ["Al-Ándalus", "era-al-andalus"],
  ["Edad Media", "era-edad-media"],
  ["Prerrenacimiento", "era-prerrenacimiento"],
  ["Renacimiento", "era-renacimiento"],
  ["Barroco", "era-barroco"],
  ["Romanticismo", "era-romanticismo"],
];

function yearToX(year: number) {
  return LEFT_MARGIN + (year - TIMELINE_START) * PX_PER_YEAR;
}

type DotTooltip = {
  x: number;
  y: number;
  headline: string;
  workTitle: string;
  year: number;
  slug: string;
} | null;

export function Timeline({
  fragments,
}: {
  fragments: Awaited<ReturnType<typeof getTimelineData>>;
}) {
  const [tooltip, setTooltip] = useState<DotTooltip>(null);
  const [hoveredBandId, setHoveredBandId] = useState<string | null>(null);
  const [hoveredDotSlug, setHoveredDotSlug] = useState<string | null>(null);

  const bands = buildAuthorBands(fragments);
  const width = yearToX(TIMELINE_END) + RIGHT_MARGIN;
  const height = TOP_MARGIN + bands.length * ROW_HEIGHT + BOTTOM_MARGIN;

  const centuryTicks: number[] = [];
  for (let year = TIMELINE_START; year <= TIMELINE_END; year += 100) {
    centuryTicks.push(year);
  }

  const legendY = TOP_MARGIN + bands.length * ROW_HEIGHT + 14;

  return (
    <div className="relative">
      {/* Floating tooltip — fixed to viewport so it's not clipped by overflow-x-auto */}
      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 max-w-[220px] rounded-lg border border-line bg-paper px-3 py-2 shadow-lg"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, calc(-100% - 10px))",
          }}
        >
          <p className="font-serif text-sm italic leading-snug text-ink">{tooltip.headline}</p>
          <p className="mt-0.5 text-xs text-ink-soft">
            {tooltip.workTitle}
            {tooltip.year ? ` · ${tooltip.year}` : ""}
          </p>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-line">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          role="img"
          aria-label="Línea de tiempo de autores y fragmentos, del siglo XI al XIX"
          className="min-w-[900px]"
        >
          {/* Century grid lines */}
          {centuryTicks.map((year) => (
            <g key={year}>
              <line
                x1={yearToX(year)}
                x2={yearToX(year)}
                y1={TOP_MARGIN - 18}
                y2={height - BOTTOM_MARGIN + 6}
                className="stroke-line"
                strokeWidth={1}
              />
              {CENTURY_NUMERALS[year] && (
                <text
                  x={yearToX(year) + PX_PER_YEAR * 50}
                  y={TOP_MARGIN - 24}
                  textAnchor="middle"
                  className="fill-ink-soft font-sans text-[11px] tracking-wider uppercase"
                >
                  Siglo {CENTURY_NUMERALS[year]}
                </text>
              )}
            </g>
          ))}

          {/* Author rows */}
          {bands.map((band, i) => {
            const y = TOP_MARGIN + i * ROW_HEIGHT;
            const rowCenter = y + ROW_HEIGHT / 2;
            const isHovered = hoveredBandId === band.id;

            return (
              <g
                key={band.id}
                onMouseEnter={() => setHoveredBandId(band.id)}
                onMouseLeave={() => setHoveredBandId(null)}
              >
                {/* Row hover background */}
                {isHovered && (
                  <rect
                    x={0}
                    y={y}
                    width={width}
                    height={ROW_HEIGHT}
                    fill="var(--color-paper-soft)"
                    opacity={0.8}
                  />
                )}

                {/* Author name — links to author page */}
                <Link href={`/autores/${band.slug}`}>
                  <text
                    x={8}
                    y={rowCenter}
                    dominantBaseline="middle"
                    className={`font-display text-sm italic transition-colors ${isHovered ? "fill-accent" : "fill-ink"}`}
                  >
                    {band.name}
                  </text>
                </Link>

                {/* Era band (lifespan bar) */}
                <rect
                  x={yearToX(band.start)}
                  y={y + 8}
                  width={Math.max(yearToX(band.end) - yearToX(band.start), 4)}
                  height={ROW_HEIGHT - 16}
                  rx={3}
                  fill={eraColor(band.era)}
                  opacity={isHovered ? 1 : 0.75}
                  style={{ transition: "opacity 150ms ease" }}
                />

                {/* Fragment dots */}
                {band.fragments.map((fragment) => {
                  const isActive = hoveredDotSlug === fragment.slug;
                  return (
                    <Link key={fragment.id} href={`/fragmentos/${fragment.slug}`}>
                      <circle
                        cx={yearToX(fragment.year)}
                        cy={rowCenter}
                        r={isActive ? 7 : 5}
                        className="fill-accent stroke-paper cursor-pointer"
                        strokeWidth={isActive ? 2 : 1.5}
                        style={{ transition: "r 150ms ease, stroke-width 150ms ease" }}
                        onMouseEnter={(e) => {
                          setHoveredDotSlug(fragment.slug);
                          setTooltip({
                            x: e.clientX,
                            y: e.clientY,
                            headline: fragment.headline,
                            workTitle: fragment.workTitle,
                            year: fragment.year,
                            slug: fragment.slug,
                          });
                        }}
                        onMouseLeave={() => {
                          setHoveredDotSlug(null);
                          setTooltip(null);
                        }}
                      />
                    </Link>
                  );
                })}
              </g>
            );
          })}

          {/* Era legend */}
          {(() => {
            let lx = LEFT_MARGIN;
            return ERA_LABELS.map(([label, colorKey]) => {
              const color = `var(--color-${colorKey})`;
              const itemX = lx;
              lx += label.length * 7.2 + 26;
              return (
                <g key={label}>
                  <rect x={itemX} y={legendY} width={12} height={12} rx={2} fill={color} />
                  <text
                    x={itemX + 16}
                    y={legendY + 6}
                    dominantBaseline="middle"
                    className="fill-ink-soft font-sans text-[10px]"
                  >
                    {label}
                  </text>
                </g>
              );
            });
          })()}
        </svg>
      </div>
    </div>
  );
}
