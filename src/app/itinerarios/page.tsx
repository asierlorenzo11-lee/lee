export const revalidate = 3600;

import type { Metadata } from "next";
import { getAllItinerariesWithItems } from "@/lib/queries";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { ItinerarioCard } from "@/components/itinerarios/ItinerarioCard";

export const metadata: Metadata = {
  title: "Itinerarios",
  description: "Recorridos temáticos por la literatura española: Nombrar el amor, la muerte, el tiempo, la fe, el poder, la ausencia... textos que se responden a través de los siglos.",
};

export default async function ItinerariosPage() {
  const itineraries = await getAllItinerariesWithItems();

  return (
    <div className="section-itinerarios">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <SectionHeader
          href="/itinerarios"
          description="Recorridos temáticos que enlazan fragmentos de distintas obras y épocas."
        />

        <div className="flex flex-col gap-4 pb-24">
          {itineraries.map((it, i) => (
            <ItinerarioCard
              key={it.slug}
              slug={it.slug}
              title={it.title}
              description={it.description}
              paradas={it.items.map((item) => ({
                slug: item.fragment.slug,
                title: item.fragment.title,
                workTitle: item.fragment.work.title,
                authorName: item.fragment.work.author.name,
              }))}
              index={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
