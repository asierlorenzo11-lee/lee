import { getFacet } from "@/lib/facets";

const SECTION_META: Record<string, string> = {
  "/obras":          "estante de libros",
  "/autores":        "galería de autoras y autores",
  "/fragmentos":     "textos de la antología",
  "/itinerarios":    "recorridos temáticos",
  "/constelaciones": "mapa estelar",
  "/topicos":        "índice temático",
  "/epocas":         "línea del tiempo",
  "/personajes":     "índice de personajes",
  "/lugares":        "mapa literario",
  "/buscar":         "búsqueda global",
};

export function SectionHeader({
  href,
  title,
  description,
}: {
  href: string;
  title?: string;
  description?: string;
}) {
  const facet = getFacet(href);
  const label = title ?? facet?.label ?? "";
  const meta = SECTION_META[href];

  return (
    <div className="border-b-2 border-accent pb-8 mb-10">
      <div className="flex items-end justify-between gap-8">
        <div>
          {meta && (
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-accent mb-3">
              {meta}
            </p>
          )}
          <h1
            className="font-display font-black text-ink leading-[0.9] tracking-tight"
            style={{ fontSize: "clamp(3rem, 8vw, 6rem)", letterSpacing: "-0.03em" }}
          >
            {label}
          </h1>
        </div>
        {description && (
          <p
            className="hidden sm:block font-serif italic font-light text-ink-soft text-right max-w-xs leading-relaxed self-end pb-1"
            style={{ fontSize: "clamp(0.85rem, 1.4vw, 1rem)" }}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
