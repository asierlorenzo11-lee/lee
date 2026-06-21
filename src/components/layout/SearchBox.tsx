import { Search } from "lucide-react";

export function SearchBox({
  className = "",
  defaultValue = "",
}: {
  className?: string;
  defaultValue?: string;
}) {
  return (
    <form action="/buscar" method="get" className={`relative ${className}`}>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-soft"
        size={16}
        aria-hidden
      />
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="Buscar…"
        aria-label="Buscar en la antología"
        className="w-full rounded-full border border-line bg-paper-soft py-1.5 pr-3 pl-9 text-sm placeholder:text-ink-soft focus:border-accent focus:bg-paper focus:outline-none"
      />
    </form>
  );
}
