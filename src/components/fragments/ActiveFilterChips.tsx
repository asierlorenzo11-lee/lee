import Link from "next/link";
import { X } from "lucide-react";
import type { FragmentDetail } from "@/lib/queries";

type SearchParams = Record<string, string | string[] | undefined>;

interface ChipDef {
  param: string;
  basePath: string;
  label: (fragment: FragmentDetail, value: string) => string | null;
}

const CHIP_DEFS: ChipDef[] = [
  {
    param: "constelacion",
    basePath: "/constelaciones",
    label: (fragment, value) => fragment.constellations.find((c) => c.slug === value)?.name ?? null,
  },
  {
    param: "topico",
    basePath: "/topicos",
    label: (fragment, value) => fragment.topics.find((t) => t.slug === value)?.name ?? null,
  },
  {
    param: "personaje",
    basePath: "/personajes",
    label: (fragment, value) => fragment.characters.find((c) => c.slug === value)?.name ?? null,
  },
  {
    param: "itinerario",
    basePath: "/itinerarios",
    label: (fragment, value) =>
      fragment.itineraryItems.find((item) => item.itinerary.slug === value)?.itinerary.title ?? null,
  },
];

function paramValue(searchParams: SearchParams, key: string) {
  const raw = searchParams[key];
  return Array.isArray(raw) ? raw[0] : raw;
}

export function ActiveFilterChips({
  fragment,
  searchParams,
}: {
  fragment: FragmentDetail;
  searchParams: SearchParams;
}) {
  const chips = CHIP_DEFS.flatMap((def) => {
    const value = paramValue(searchParams, def.param);
    if (!value) return [];
    const label = def.label(fragment, value);
    if (!label) return [];

    const remaining = new URLSearchParams();
    for (const other of CHIP_DEFS) {
      if (other.param === def.param) continue;
      const otherValue = paramValue(searchParams, other.param);
      if (otherValue) remaining.set(other.param, otherValue);
    }
    const query = remaining.toString();

    return [
      {
        param: def.param,
        label,
        href: `${def.basePath}/${value}`,
        removeHref: `/fragmentos/${fragment.slug}${query ? `?${query}` : ""}`,
      },
    ];
  });

  if (chips.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <span className="text-sm text-ink-soft">Explorando:</span>
      {chips.map((chip) => (
        <span
          key={chip.param}
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper-soft px-3 py-1 text-sm"
        >
          <Link href={chip.href} className="hover:text-accent">
            {chip.label}
          </Link>
          <Link href={chip.removeHref} aria-label={`Quitar filtro «${chip.label}»`} className="text-ink-soft hover:text-accent">
            <X size={14} aria-hidden />
          </Link>
        </span>
      ))}
    </div>
  );
}
