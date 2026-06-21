import { FragmentCard } from "./FragmentCard";
import type { FragmentCardData } from "@/lib/queries";

export function FragmentGrid({ fragments }: { fragments: FragmentCardData[] }) {
  if (fragments.length === 0) {
    return <p className="text-ink-soft">Todavía no hay fragmentos asociados.</p>;
  }

  return (
    <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {fragments.map((fragment) => (
        <FragmentCard key={fragment.id} fragment={fragment} />
      ))}
    </div>
  );
}
