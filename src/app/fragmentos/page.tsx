import type { Metadata } from "next";
import { SectionHeader } from "@/components/layout/SectionHeader";
import {
  getAllCharacters,
  getAllConstellations,
  getAllTopics,
  getAllItineraries,
  getAuthorsWithFragments,
  getErasWithFragments,
  getFragmentsIndex,
  type FragmentIndexFilters,
} from "@/lib/queries";
import { FragmentGrid } from "@/components/fragments/FragmentGrid";
import { FragmentFilters } from "@/components/fragments/FragmentFilters";

export const metadata: Metadata = {
  title: "Fragmentos",
  description: "Todos los textos de la antología: fragmentos seleccionados con anotaciones, figuras retóricas, contexto histórico y preguntas de comprensión.",
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function paramValue(searchParams: Record<string, string | string[] | undefined>, key: string) {
  const raw = searchParams[key];
  return Array.isArray(raw) ? raw[0] : raw;
}

export default async function FragmentosPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const q = paramValue(sp, "q")?.trim() ?? "";
  const filters: FragmentIndexFilters = {
    autor: paramValue(sp, "autor"),
    epoca: paramValue(sp, "epoca"),
    itinerario: paramValue(sp, "itinerario"),
    constelacion: paramValue(sp, "constelacion"),
    topico: paramValue(sp, "topico"),
    personaje: paramValue(sp, "personaje"),
  };

  const [fragments, authors, eras, itineraries, constellations, topics, characters] =
    await Promise.all([
      getFragmentsIndex(filters),
      getAuthorsWithFragments(),
      getErasWithFragments(),
      getAllItineraries(),
      getAllConstellations(),
      getAllTopics(),
      getAllCharacters(),
    ]);

  const displayFragments = q
    ? fragments.filter(
        (f) =>
          f.headline.toLowerCase().includes(q.toLowerCase()) ||
          f.title.toLowerCase().includes(q.toLowerCase()) ||
          f.work.title.toLowerCase().includes(q.toLowerCase()) ||
          f.work.author.name.toLowerCase().includes(q.toLowerCase()),
      )
    : fragments;

  const groups = [
    { key: "autor", label: "Autor", options: authors, value: filters.autor },
    { key: "epoca", label: "Época", options: eras, value: filters.epoca },
    {
      key: "itinerario",
      label: "Itinerario",
      options: itineraries.map((i) => ({ slug: i.slug, name: i.title })),
      value: filters.itinerario,
    },
    { key: "constelacion", label: "Constelación", options: constellations, value: filters.constelacion },
    { key: "topico", label: "Tópico", options: topics, value: filters.topico },
    { key: "personaje", label: "Personaje", options: characters.map((c) => ({ slug: c.slug, name: c.name })), value: filters.personaje },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <SectionHeader href="/fragmentos" description="Los textos de la antología y sus anotaciones." />

      <FragmentFilters
        q={q}
        filters={{
          autor: filters.autor,
          epoca: filters.epoca,
          itinerario: filters.itinerario,
          constelacion: filters.constelacion,
          topico: filters.topico,
          personaje: filters.personaje,
        }}
        groups={groups}
      />

      <p className="mt-6 text-sm text-ink-soft">
        {displayFragments.length} fragmento{displayFragments.length === 1 ? "" : "s"}
      </p>

      <div className="mt-4">
        <FragmentGrid fragments={displayFragments} />
      </div>
    </div>
  );
}
