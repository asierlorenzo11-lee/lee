import { FragmentGrid } from "./FragmentGrid";
import type { FragmentCardData } from "@/lib/queries";

export function RelatedFragments({ fragments }: { fragments: FragmentCardData[] }) {
  if (fragments.length === 0) return null;

  return (
    <section className="mt-4">
      <h2 className="mb-4 font-serif text-xl italic">Para seguir leyendo</h2>
      <FragmentGrid fragments={fragments} />
    </section>
  );
}
