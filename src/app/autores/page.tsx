import type { Metadata } from "next";
import { getAllAuthors } from "@/lib/queries";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { AuthorGalleryClient, type AuthorCard } from "@/components/autores/AuthorGalleryClient";
import { ERA_META } from "@/lib/eras";

export const metadata: Metadata = {
  title: "Autores",
  description: "Los escritores de la antología: poetas, dramaturgos, novelistas y ensayistas de la lengua española, del siglo XI al XIX.",
};

export default async function AutoresPage() {
  const authors = await getAllAuthors();

  // Sort alphabetically by name
  const sorted = [...authors].sort((a, b) => a.name.localeCompare(b.name, "es"));

  const cards: AuthorCard[] = sorted.map((author) => {
    const years =
      author.birthYear || author.deathYear
        ? `${author.birthYear ?? "?"}–${author.deathYear ?? "?"}`
        : null;
    return {
      slug: author.slug,
      name: author.name,
      era: author.era ?? null,
      portraitUrl: author.portraitUrl ?? null,
      meta: [author.era, years].filter(Boolean).join(" · "),
    };
  });

  // Era order following ERA_META definition order
  const eraOrder = ERA_META.map((e) => e.label);
  const eras = eraOrder.filter((era) => cards.some((c) => c.era === era));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <SectionHeader
        href="/autores"
        description="Los escritores de la antología, del siglo XI al XX."
      />
      <div className="mt-8">
        <AuthorGalleryClient authors={cards} eras={eras} />
      </div>
    </div>
  );
}
