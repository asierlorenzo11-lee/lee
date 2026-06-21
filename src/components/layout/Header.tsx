import Link from "next/link";
import { GlobalSearch } from "./GlobalSearch";
import { ThemeToggle } from "./ThemeToggle";
import { NavMenu } from "./NavMenu";
import { FACETS } from "@/lib/facets";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3">
        <Link href="/" className="shrink-0 font-display text-2xl font-bold italic">
          ¡LEE!
        </Link>

        <GlobalSearch />

        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <NavMenu className="lg:hidden" />
        </div>
      </div>

      <nav aria-label="Facetas" className="hidden border-t border-line lg:block">
        <div className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 py-2">
          {FACETS.map((facet) => (
            <Link
              key={facet.href}
              href={facet.href}
              className={`group relative shrink-0 overflow-hidden rounded-full px-3.5 py-1.5 text-sm font-medium ${facet.chipBg} ${facet.chipColor} transition-colors duration-200`}
            >
              <span
                className={`pointer-events-none absolute left-1/2 top-1/2 aspect-square w-0 -translate-x-1/2 -translate-y-1/2 rounded-full ${facet.fillBg} transition-[width] duration-300 ease-out group-hover:w-[200%]`}
                aria-hidden
              />
              <span className="relative flex items-center gap-1.5 transition-colors duration-300 group-hover:text-white">
                <facet.icon size={13} aria-hidden />
                {facet.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
