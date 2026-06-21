import Link from "next/link";
import type { Metadata } from "next";
import { getAllCharacters } from "@/lib/queries";
import { SectionHeader } from "@/components/layout/SectionHeader";

export const metadata: Metadata = {
  title: "Personajes",
};

export default async function PersonajesPage() {
  const characters = await getAllCharacters();

  // Group by first letter
  const grouped = new Map<string, typeof characters>();
  for (const c of characters) {
    const letter = c.name[0].toUpperCase();
    if (!grouped.has(letter)) grouped.set(letter, []);
    grouped.get(letter)!.push(c);
  }
  const letters = [...grouped.keys()].sort((a, b) => a.localeCompare(b, "es"));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <SectionHeader href="/personajes" description="Figuras que aparecen o son evocadas en los fragmentos de la antología." />

      {/* Letras-índice */}
      <div className="mt-6 flex flex-wrap gap-2">
        {letters.map((l) => (
          <a
            key={l}
            href={`#letra-${l}`}
            className="rounded border border-line px-2.5 py-1 text-sm font-medium text-ink-soft transition-colors hover:border-accent hover:text-accent"
          >
            {l}
          </a>
        ))}
      </div>

      {/* Secciones */}
      <div className="mt-10 space-y-10">
        {letters.map((l) => (
          <section key={l} id={`letra-${l}`}>
            <h2 className="font-display text-2xl italic text-accent">{l}</h2>
            <ul className="mt-3 divide-y divide-line">
              {grouped.get(l)!.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/personajes/${c.slug}`}
                    className="group flex items-baseline justify-between gap-4 py-2.5 transition-colors hover:text-accent"
                  >
                    <span className="font-serif italic">{c.name}</span>
                    <span className="shrink-0 text-xs text-ink-soft group-hover:text-accent">
                      {c.fragments.length}{" "}
                      {c.fragments.length === 1 ? "fragmento" : "fragmentos"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
