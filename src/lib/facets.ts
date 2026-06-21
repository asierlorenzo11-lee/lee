import {
  BookOpen,
  User,
  FileText,
  Route,
  Sparkles,
  Tag,
  Clock,
  Drama,
  MapPin,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Facet = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Light tinted bg + colored text — rest state */
  chipBg: string;
  chipColor: string;
  /** Full saturated bg for the circular hover fill */
  fillBg: string;
};

export const FACETS: Facet[] = [
  { href: "/obras",          label: "Obras",          icon: BookOpen,  chipBg: "bg-red-100",    chipColor: "text-red-700",    fillBg: "bg-red-600"    },
  { href: "/autores",        label: "Autores",        icon: User,       chipBg: "bg-sky-100",    chipColor: "text-sky-700",    fillBg: "bg-sky-600"    },
  { href: "/fragmentos",     label: "Fragmentos",     icon: FileText,   chipBg: "bg-emerald-100",chipColor: "text-emerald-700",fillBg: "bg-emerald-600"},
  { href: "/itinerarios",    label: "Itinerarios",    icon: Route,      chipBg: "bg-teal-100",   chipColor: "text-teal-700",   fillBg: "bg-teal-600"   },
  { href: "/constelaciones", label: "Constelaciones", icon: Sparkles,   chipBg: "bg-violet-100", chipColor: "text-violet-700", fillBg: "bg-violet-600" },
  { href: "/topicos",        label: "Tópicos",        icon: Tag,        chipBg: "bg-amber-100",  chipColor: "text-amber-700",  fillBg: "bg-amber-600"  },
  { href: "/epocas",         label: "Épocas",         icon: Clock,      chipBg: "bg-orange-100", chipColor: "text-orange-700", fillBg: "bg-orange-600" },
  { href: "/personajes",     label: "Personajes",     icon: Drama,      chipBg: "bg-rose-100",   chipColor: "text-rose-700",   fillBg: "bg-rose-600"   },
  { href: "/lugares",        label: "Lugares",        icon: MapPin,     chipBg: "bg-lime-100",   chipColor: "text-lime-700",   fillBg: "bg-lime-600"   },
];

export function getFacet(href: string): Facet | undefined {
  return FACETS.find((f) => f.href === href);
}
