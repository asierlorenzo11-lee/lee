import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FragmentGrid } from "@/components/fragments/FragmentGrid";
import type { FragmentCardData } from "@/lib/queries";

export function TagDetail({
  breadcrumbLabel,
  breadcrumbHref,
  name,
  description,
  fragments,
}: {
  breadcrumbLabel: string;
  breadcrumbHref: string;
  name: string;
  description?: string | null;
  fragments: FragmentCardData[];
}) {
  return (
    <div>
      <Breadcrumbs items={[{ href: breadcrumbHref, label: breadcrumbLabel }, { label: name }]} />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="font-serif text-3xl italic">{name}</h1>
        {description && <p className="mt-3 max-w-2xl text-ink-soft">{description}</p>}
        <div className="mt-8">
          <FragmentGrid fragments={fragments} />
        </div>
      </div>
    </div>
  );
}
