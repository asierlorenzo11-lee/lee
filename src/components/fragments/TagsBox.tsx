import Link from "next/link";
import type { FragmentDetail } from "@/lib/queries";

const pill =
  "rounded-full border border-line bg-paper px-3 py-1 text-xs text-ink-soft transition-colors hover:border-accent hover:text-accent";

/** Cuadro lateral con personajes, constelaciones y tópicos del fragmento. */
export function TagsBox({ fragment }: { fragment: FragmentDetail }) {
  const hasChars = fragment.characters.length > 0;
  const hasConsts = fragment.constellations.length > 0;
  const hasTopics = fragment.topics.length > 0;
  if (!hasChars && !hasConsts && !hasTopics) return null;

  return (
    <section className="rounded-lg border border-line bg-paper-soft p-4">
      {hasChars && (
        <div className={hasConsts || hasTopics ? "mb-4" : ""}>
          <h3 className="mb-2 text-xs font-semibold tracking-wide text-ink-soft uppercase">
            Personajes
          </h3>
          <div className="flex flex-wrap gap-2">
            {fragment.characters.map((c) => (
              <Link key={c.slug} href={`/personajes/${c.slug}`} className={pill}>
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {(hasConsts || hasTopics) && (
        <div>
          <h3 className="mb-2 text-xs font-semibold tracking-wide text-ink-soft uppercase">
            Etiquetas
          </h3>
          <div className="flex flex-wrap gap-2">
            {fragment.constellations.map((constellation) => (
              <Link key={constellation.slug} href={`/constelaciones/${constellation.slug}`} className={pill}>
                {constellation.name}
              </Link>
            ))}
            {fragment.topics.map((topic) => (
              <Link key={topic.slug} href={`/topicos/${topic.slug}`} className={pill}>
                {topic.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
