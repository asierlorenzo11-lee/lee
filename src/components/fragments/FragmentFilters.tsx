"use client";

import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

interface FilterGroup {
  key: string;
  label: string;
  options: { slug: string; name: string }[];
  value: string | undefined;
}

export function FragmentFilters({
  q,
  filters,
  groups,
}: {
  q: string;
  filters: Record<string, string | undefined>;
  groups: FilterGroup[];
}) {
  const router = useRouter();

  function href(overrides: Record<string, string | undefined>) {
    const merged = { ...filters, q: q || undefined, ...overrides };
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(merged)) {
      if (v) params.set(k, v);
    }
    const qs = params.toString();
    return qs ? `/fragmentos?${qs}` : "/fragmentos";
  }

  const hasAny = q || Object.values(filters).some(Boolean);

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <form method="get" action="/fragmentos" className="relative min-w-52 flex-1">
        {Object.entries(filters).map(([k, v]) =>
          v ? <input key={k} type="hidden" name={k} value={v} /> : null,
        )}
        <Search
          size={15}
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft"
        />
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Buscar fragmentos…"
          className="w-full rounded-lg border border-line bg-paper py-2 pl-9 pr-3 text-sm placeholder:text-ink-soft focus:border-accent focus:outline-none"
        />
      </form>

      {groups.map((group) => (
        <select
          key={group.key}
          value={group.value ?? ""}
          onChange={(e) =>
            router.push(href({ [group.key]: e.target.value || undefined }))
          }
          className="rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink-soft focus:border-accent focus:outline-none"
        >
          <option value="">{group.label}</option>
          {group.options.map((opt) => (
            <option key={opt.slug} value={opt.slug}>
              {opt.name}
            </option>
          ))}
        </select>
      ))}

      {hasAny && (
        <a
          href="/fragmentos"
          className="flex items-center gap-1 text-sm text-ink-soft transition-colors hover:text-accent"
        >
          <X size={14} aria-hidden />
          Limpiar
        </a>
      )}
    </div>
  );
}
