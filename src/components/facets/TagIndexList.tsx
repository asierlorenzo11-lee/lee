import Link from "next/link";

export function TagIndexList({
  items,
  basePath,
}: {
  items: { slug: string; name: string; description?: string | null; count: number }[];
  basePath: string;
}) {
  return (
    <ul className="mt-8 divide-y divide-line">
      {items.map((item) => (
        <li key={item.slug} className="py-4">
          <Link href={`${basePath}/${item.slug}`} className="group block">
            <p className="font-serif text-xl italic text-ink group-hover:text-accent">
              {item.name}
            </p>
            {item.description && <p className="mt-1 text-sm text-ink-soft">{item.description}</p>}
            <p className="mt-1 text-sm text-ink-soft">
              {item.count} fragmento{item.count === 1 ? "" : "s"}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
