import Link from "next/link";

type NavTarget = { slug: string; title: string; headline: string } | null;

interface ItineraryContext {
  slug: string;
  title: string;
  position: number;
  total: number;
}

function navHref(slug: string, itineraryContext: ItineraryContext | null) {
  return itineraryContext ? `/fragmentos/${slug}?itinerario=${itineraryContext.slug}` : `/fragmentos/${slug}`;
}

export function PrevNextNav({
  prev,
  next,
  itineraryContext,
}: {
  prev: NavTarget;
  next: NavTarget;
  itineraryContext: ItineraryContext | null;
}) {
  if (!prev && !next && !itineraryContext) return null;

  return (
    <nav className="border-t border-line pt-6">
      {itineraryContext && (
        <p className="mb-4 text-sm text-ink-soft">
          Itinerario{" "}
          <Link href={`/itinerarios/${itineraryContext.slug}`} className="italic hover:text-accent">
            «{itineraryContext.title}»
          </Link>
          {" · "}
          parada {itineraryContext.position} de {itineraryContext.total}
        </p>
      )}
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-12">
        {prev ? (
          <Link href={navHref(prev.slug, itineraryContext)} className="group flex-1">
            <span className="block text-xs tracking-wide text-ink-soft uppercase">
              <span className="inline-block transition-transform duration-200 group-hover:-translate-x-1">‹</span>
              {" Anterior"}
            </span>
            <span className="mt-1 block font-serif italic text-ink transition-colors group-hover:text-accent">
              {prev.headline}
            </span>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        {next ? (
          <Link href={navHref(next.slug, itineraryContext)} className="group flex-1 text-right">
            <span className="block text-xs tracking-wide text-ink-soft uppercase">
              {"Siguiente "}
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">›</span>
            </span>
            <span className="mt-1 block font-serif italic text-ink transition-colors group-hover:text-accent">
              {next.headline}
            </span>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </nav>
  );
}
