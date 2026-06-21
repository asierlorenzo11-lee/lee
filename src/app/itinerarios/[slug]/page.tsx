import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getItineraryBySlug } from "@/lib/queries";
import { excerpt } from "@/lib/text";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FragmentListItem } from "@/components/fragments/FragmentListItem";
import { ProgressBar } from "@/components/fragments/ProgressBar";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const itinerary = await getItineraryBySlug(slug);
  if (!itinerary) return {};
  return { title: itinerary.title, description: excerpt(itinerary.description, 160) };
}

export default async function ItinerarioPage({ params }: PageProps) {
  const { slug } = await params;
  const itinerary = await getItineraryBySlug(slug);
  if (!itinerary) notFound();

  const slugs = itinerary.items.map((item) => item.fragment.slug);

  return (
    <div>
      <Breadcrumbs
        items={[{ href: "/itinerarios", label: "Itinerarios" }, { label: itinerary.title }]}
      />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-serif text-3xl italic">{itinerary.title}</h1>
        <p className="mt-2 text-ink-soft">{itinerary.description}</p>

        <div className="mt-6">
          <ProgressBar slugs={slugs} />
        </div>

        <ol className="mt-8 divide-y divide-line">
          {itinerary.items.map((item, index) => (
            <FragmentListItem
              key={item.fragment.id}
              href={`/fragmentos/${item.fragment.slug}?itinerario=${itinerary.slug}`}
              location={`${index + 1}. ${item.fragment.location}`}
              headline={item.fragment.headline}
              title={item.fragment.title}
              meta={`${item.fragment.work.title}, ${item.fragment.work.author.name}`}
            />
          ))}
        </ol>
      </div>
    </div>
  );
}
