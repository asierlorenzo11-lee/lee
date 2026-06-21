import type { getTimelineData } from "./queries";

export const TIMELINE_START = 1000;
export const TIMELINE_END = 1945;

/** Periodos aproximados (para autores anónimos sin fechas de nacimiento/muerte). */
export const ERA_RANGES: Record<string, [number, number]> = {
  "Al-Ándalus": [1000, 1250],
  "Edad Media": [1150, 1480],
  "Prerrenacimiento": [1450, 1500],
  Renacimiento: [1499, 1600],
  Barroco: [1600, 1700],
  Ilustración: [1700, 1800],
  Romanticismo: [1800, 1875],
  Modernismo: [1870, 1910],
  "Generación del 27": [1910, 1945],
};

export const ERA_COLORS: Record<string, string> = {
  "Al-Ándalus": "var(--color-era-al-andalus)",
  "Edad Media": "var(--color-era-edad-media)",
  "Prerrenacimiento": "var(--color-era-prerrenacimiento)",
  Renacimiento: "var(--color-era-renacimiento)",
  Barroco: "var(--color-era-barroco)",
  Ilustración: "var(--color-era-ilustracion)",
  Romanticismo: "var(--color-era-romanticismo)",
  Modernismo: "var(--color-era-modernismo)",
  "Generación del 27": "var(--color-era-gen27)",
};

const FALLBACK_COLOR = "var(--color-line)";

export function eraColor(era: string | null): string {
  return (era && ERA_COLORS[era]) || FALLBACK_COLOR;
}

type TimelineFragments = Awaited<ReturnType<typeof getTimelineData>>;

export type AuthorBand = {
  id: string;
  name: string;
  slug: string;
  era: string | null;
  start: number;
  end: number;
  fragments: { id: string; slug: string; headline: string; workTitle: string; year: number }[];
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** Agrupa los fragmentos por autor y calcula la franja temporal de cada autor. */
export function buildAuthorBands(fragments: TimelineFragments): AuthorBand[] {
  const byAuthor = new Map<string, AuthorBand>();

  for (const fragment of fragments) {
    const { author } = fragment.work;
    const year = fragment.work.year ?? TIMELINE_START;

    let band = byAuthor.get(author.id);
    if (!band) {
      const era = author.era ?? fragment.work.era ?? null;
      let start: number;
      let end: number;
      if (author.birthYear !== null && author.deathYear !== null) {
        start = author.birthYear;
        end = author.deathYear;
      } else {
        const range = era ? ERA_RANGES[era] : undefined;
        if (range) {
          [start, end] = range;
        } else {
          start = year - 25;
          end = year + 25;
        }
      }
      band = {
        id: author.id,
        name: author.name,
        slug: author.slug,
        era,
        start: clamp(start, TIMELINE_START, TIMELINE_END),
        end: clamp(end, TIMELINE_START, TIMELINE_END),
        fragments: [],
      };
      byAuthor.set(author.id, band);
    }

    band.fragments.push({
      id: fragment.id,
      slug: fragment.slug,
      headline: fragment.headline,
      workTitle: fragment.work.title,
      year: clamp(year, TIMELINE_START, TIMELINE_END),
    });
  }

  return [...byAuthor.values()].sort((a, b) => a.start - b.start || a.end - b.end);
}
