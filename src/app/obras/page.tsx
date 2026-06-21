export const revalidate = 3600;

import type { Metadata } from "next";
import { getEras } from "@/lib/queries";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { BookshelfClient, type ShelfBook, type ShelfGroup } from "@/components/obras/BookshelfClient";

export const metadata: Metadata = {
  title: "Obras",
  description: "Las obras de la antología de literatura española, organizadas por época: del Cantar de Mio Cid al siglo XX.",
};

const SPINE_COLORS: { bg: string; text: string }[] = [
  { bg: "#6f93b8", text: "var(--color-paper)" },
  { bg: "#e8c468", text: "var(--color-ink)" },
  { bg: "#e3a6a1", text: "var(--color-ink)" },
  { bg: "#4fada6", text: "var(--color-paper)" },
  { bg: "#a8bd84", text: "var(--color-ink)" },
  { bg: "#e8966a", text: "var(--color-ink)" },
  { bg: "#8f7aa8", text: "var(--color-paper)" },
  { bg: "#c4b66f", text: "var(--color-ink)" },
  { bg: "#d6938a", text: "var(--color-ink)" },
  { bg: "#7a8a99", text: "var(--color-paper)" },
];

const SPINE_HEIGHTS = [232, 268, 208, 284, 244, 224];
const SPINE_WIDTHS  = [88, 100, 80, 96, 108];

export default async function ObrasPage() {
  const eras = await getEras();

  let nextIdx = 0;
  const groups: ShelfGroup[] = eras.map((group) => ({
    era: group.era,
    books: group.works.map((work): ShelfBook => {
      const i = nextIdx++;
      return {
        id: work.id,
        slug: work.slug,
        title: work.title,
        authorName: work.author.name,
        era: group.era,
        ...SPINE_COLORS[i % SPINE_COLORS.length],
        height: SPINE_HEIGHTS[i % SPINE_HEIGHTS.length],
        width:  SPINE_WIDTHS[i % SPINE_WIDTHS.length],
      };
    }),
  }));

  const eraNames = eras.map((g) => g.era);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <SectionHeader
        href="/obras"
        description="Las obras de la antología, agrupadas por época."
      />
      <div className="mt-10">
        <BookshelfClient groups={groups} eras={eraNames} />
      </div>
    </div>
  );
}
