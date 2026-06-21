import Image from "next/image";
import Link from "next/link";

export interface PersonAvatarItem {
  slug: string;
  name: string;
  imageUrl?: string | null;
  meta?: string | null;
}

/** Paleta de color para los avatares sin imagen, variada pero armónica con el resto del sitio. */
const AVATAR_COLORS = [
  "#2f4858",
  "#6b2737",
  "#5b3a29",
  "#3e5641",
  "#4a3f5e",
  "#5c4a2e",
  "#39506b",
  "#5e3a4a",
  "#4f5d3a",
  "#3a4a4a",
];

function colorForName(name: string) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/**
 * Cuadrícula de personas (autores o personajes) ordenada alfabéticamente,
 * con avatar circular (foto o iniciales sobre color) y nombre debajo.
 */
export function PersonAvatarGrid({
  basePath,
  items,
}: {
  basePath: string;
  items: PersonAvatarItem[];
}) {
  const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name, "es"));

  return (
    <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {sorted.map((item) => (
        <Link
          key={item.slug}
          href={`${basePath}/${item.slug}`}
          className="group flex flex-col items-center gap-3 text-center"
        >
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              width={128}
              height={128}
              className="size-28 rounded-full object-cover ring-1 ring-line transition-transform group-hover:scale-105"
            />
          ) : (
            <div
              aria-hidden
              className="flex size-28 items-center justify-center rounded-full font-display text-2xl text-paper ring-1 ring-line transition-transform group-hover:scale-105"
              style={{ backgroundColor: colorForName(item.name) }}
            >
              {initials(item.name)}
            </div>
          )}
          <div>
            <p className="font-serif text-base italic text-ink group-hover:text-accent">
              {item.name}
            </p>
            {item.meta && <p className="mt-0.5 text-xs text-ink-soft">{item.meta}</p>}
          </div>
        </Link>
      ))}
    </div>
  );
}
