"use client";
import { usePathname } from "next/navigation";

const SECTION_MAP: Array<[string, string]> = [
  ["/obras", "section-obras"],
  ["/autores", "section-autores"],
  ["/fragmentos", "section-fragmentos"],
  ["/itinerarios", "section-itinerarios"],
  ["/constelaciones", "section-constelaciones"],
  ["/topicos", "section-topicos"],
  ["/epocas", "section-epocas"],
  ["/personajes", "section-personajes"],
  ["/lugares", "section-lugares"],
  ["/buscar", "section-buscar"],
];

export function SectionAccentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const match = SECTION_MAP.find(([prefix]) => pathname.startsWith(prefix));
  return <div className={match?.[1] ?? ""}>{children}</div>;
}
