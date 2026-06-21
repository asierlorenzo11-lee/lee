import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({
  items,
}: {
  items: { href?: string; label: string }[];
}) {
  return (
    <nav aria-label="Migas de pan" className="border-b border-line bg-paper-soft">
      <ol className="mx-auto flex max-w-5xl flex-wrap items-center gap-1 px-4 py-2 text-sm text-ink-soft">
        <li>
          <Link href="/" className="hover:text-accent">
            Inicio
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            <ChevronRight size={14} aria-hidden />
            {item.href ? (
              <Link href={item.href} className="hover:text-accent">
                {item.label}
              </Link>
            ) : (
              <span className="text-ink">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
