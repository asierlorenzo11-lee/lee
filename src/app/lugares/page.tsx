import type { Metadata } from "next";
import { getAllPlaces } from "@/lib/queries";
import { FragmentGrid } from "@/components/fragments/FragmentGrid";
import { PlacesMapClient } from "@/components/places/PlacesMapClient";
import { SectionHeader } from "@/components/layout/SectionHeader";

export const metadata: Metadata = {
  title: "Lugares",
};

export default async function LugaresPage() {
  const places = await getAllPlaces();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <SectionHeader href="/lugares" description="Un mapa de los lugares donde transcurren los fragmentos. Pulsa un punto para ver qué se lee allí." />

      <div className="mt-6">
        <PlacesMapClient places={places} />
      </div>

      <div className="mt-10 space-y-10">
        {places.map((place) => (
          <section key={place.id}>
            <h2 className="font-display text-xl italic">{place.name}</h2>
            {place.description && <p className="mt-1 text-ink-soft">{place.description}</p>}
            <div className="mt-4">
              <FragmentGrid fragments={place.fragments} />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
