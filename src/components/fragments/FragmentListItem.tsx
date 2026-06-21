import Link from "next/link";

export function FragmentListItem({
  href,
  location,
  headline,
  title,
  meta,
}: {
  href: string;
  location: string;
  headline: string;
  title: string;
  meta?: string;
}) {
  return (
    <li className="py-3">
      <Link href={href} className="group block">
        <p className="text-xs tracking-wide text-ink-soft uppercase">{location}</p>
        <p className="font-serif text-lg italic text-ink group-hover:text-accent">{headline}</p>
        <p className="text-sm text-ink-soft">
          {title}
          {meta ? ` — ${meta}` : ""}
        </p>
      </Link>
    </li>
  );
}
