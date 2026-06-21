import type { Metadata } from "next";
import { searchFragments } from "@/lib/queries";
import { SearchBox } from "@/components/layout/SearchBox";
import { FragmentGrid } from "@/components/fragments/FragmentGrid";

export const metadata: Metadata = {
  title: "Buscar",
  robots: { index: false },
};

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function BuscarPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? await searchFragments(query) : [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-serif text-3xl italic">Buscar</h1>
      <div className="mt-4 max-w-md">
        <SearchBox defaultValue={query} />
      </div>

      {query ? (
        <>
          <p className="mt-6 text-sm text-ink-soft">
            {results.length} resultado{results.length === 1 ? "" : "s"} para «{query}»
          </p>
          <div className="mt-4">
            <FragmentGrid fragments={results} />
          </div>
        </>
      ) : (
        <p className="mt-6 text-ink-soft">
          Escribe un término para buscar en títulos, fragmentos, autores y etiquetas.
        </p>
      )}
    </div>
  );
}
