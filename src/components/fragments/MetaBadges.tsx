import Link from "next/link";

export interface MetaBadgesData {
  work: {
    era: string | null;
    year: number | null;
    author: { slug: string; name: string };
  };
  topics: { slug: string; name: string }[];
}

type MetaBadgesVariant = "default" | "compact" | "onDark";

/** Ficha técnica: badges de Época, Autor, Año y Tópico bajo el titular. */
export function MetaBadges({
  fragment,
  variant = "default",
  disableLinks = false,
}: {
  fragment: MetaBadgesData;
  variant?: MetaBadgesVariant;
  /** Si es `true`, los badges se muestran como texto plano (para usarlos dentro de otro enlace). */
  disableLinks?: boolean;
}) {
  const topicCount = variant === "compact" ? 1 : 3;

  const badges: { label: string; href?: string }[] = [];
  if (fragment.work.era) badges.push({ label: fragment.work.era });
  badges.push({
    label: fragment.work.author.name,
    href: disableLinks ? undefined : `/autores/${fragment.work.author.slug}`,
  });
  if (fragment.work.year) badges.push({ label: String(fragment.work.year) });
  for (const topic of fragment.topics.slice(0, topicCount)) {
    badges.push({ label: topic.name, href: disableLinks ? undefined : `/topicos/${topic.slug}` });
  }

  if (badges.length === 0) return null;

  const basePill =
    variant === "onDark"
      ? "rounded-full border border-white/30 bg-black/30 px-3 py-1 text-xs text-white backdrop-blur-sm"
      : "rounded-full border border-line bg-paper-soft px-3 py-1 text-xs text-ink-soft";

  const hoverPill =
    variant === "onDark"
      ? "transition-colors hover:border-white/70"
      : "transition-colors hover:border-accent hover:text-accent";

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge, i) =>
        badge.href ? (
          <Link key={`${badge.label}-${i}`} href={badge.href} className={`${basePill} ${hoverPill}`}>
            {badge.label}
          </Link>
        ) : (
          <span key={`${badge.label}-${i}`} className={basePill}>
            {badge.label}
          </span>
        ),
      )}
    </div>
  );
}
