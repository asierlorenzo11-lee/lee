import type { Metadata } from "next";
import Link from "next/link";
import { getEras } from "@/lib/queries";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { getEraMeta } from "@/lib/eras";
import { TimelineClient, type TimelineWork } from "@/components/epocas/TimelineClient";

export const metadata: Metadata = {
  title: "Épocas",
};

export default async function EpocasPage() {
  const eras = await getEras();

  const timelineWorks: TimelineWork[] = eras.flatMap((group) =>
    group.works
      .filter((w) => w.year !== null)
      .map((w) => ({
        id: w.id,
        slug: w.slug,
        title: w.title,
        authorName: w.author.name,
        year: w.year!,
        era: group.era,
        firstFragmentSlug: null,
      })),
  );

  return (
    <div>
      <div className="mx-auto max-w-5xl px-4 pt-10 pb-4">
        <SectionHeader
          href="/epocas"
          description="De las jarchas mozárabes a García Lorca: ocho siglos de voces en español."
        />
      </div>

      {/* ── Línea de tiempo interactiva ───────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-4 py-6">
        <TimelineClient works={timelineWorks} />
      </div>

      {/* ── Lista de obras por época ───────────────────────────────────────── */}
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="space-y-12">
          {eras.map((group) => {
            const meta = getEraMeta(group.era);
            return (
              <section key={group.era} id={meta?.slug ?? group.era.toLowerCase()}>
                <div className="flex items-baseline gap-3 border-b-2 border-ink pb-2 mb-4">
                  <h2 className="font-display text-2xl font-bold italic">{group.era}</h2>
                  {meta && (
                    <span className="text-sm text-ink-soft">{meta.dateRange}</span>
                  )}
                </div>
                <ul className="divide-y divide-line">
                  {group.works.map((work) => (
                    <li key={work.id} className="py-3">
                      <Link href={`/obras/${work.slug}`} className="group block">
                        <p className="text-ink group-hover:text-accent">
                          <em>{work.title}</em>
                          {work.year ? ` (${work.year})` : ""}
                        </p>
                        <p className="text-sm text-ink-soft">{work.author.name}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
