import Link from "next/link";
import type { Metadata } from "next";
import { getFeaturedFragment, getFragmentsBySlugs } from "@/lib/queries";
import { FragmentCard } from "@/components/fragments/FragmentCard";
import { FeaturedFragment } from "@/components/fragments/FeaturedFragment";
import { FadeUp } from "@/components/ui/FadeUp";
import { FACETS } from "@/lib/facets";

export const revalidate = 3600;

export const metadata: Metadata = {
  description:
    "Antología digital comentada de literatura en español: fragmentos elegidos, glosados y puestos en contexto, de la Edad Media a nuestros días.",
};

const TICKER_ITEMS = [
  { text: "Nombrar el mundo",    color: "var(--color-ink)" },
  { text: "transformar el mundo", color: "var(--color-ink)" },
  { text: "Nombrar el amor",     color: "#C0392B" },
  { text: "Nombrar el valor",    color: "#5C7A3E" },
  { text: "Nombrar el miedo",    color: "#8B6914" },
  { text: "Nombrar la ausencia", color: "#7B7B7B" },
  { text: "Nombrar la muerte",   color: "#2C3E50" },
];

const PORTADA_SLUGS = [
  "jarcha-vaise-meu-corachon",        // El corazón se va antes que tú
  "jarcha-garid-vos",                  // Mil años de mal de amores
  "la-batalla-de-don-carnal-y-dona-cuaresma", // Dura está la pelea, de muy mala manera
  "las-victimas-de-la-injusticia",     // ¡A un viejo de palos das!
  "nuestras-vidas-son-los-rios",       // Todos los ríos van al mismo mar
  "el-si-de-las-ninas-desenlace",      // «Esto es lo que se debe fiar en el sí de las niñas»
];

export default async function Home() {
  const featured = await getFeaturedFragment();
  const fragments = await getFragmentsBySlugs(PORTADA_SLUGS);

  return (
    <div>
      {/* ── PORTADA ──────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-paper text-center">

        {/* Ticker */}
        <div className="absolute top-0 left-0 right-0 z-10 overflow-hidden border-b border-line bg-paper py-3">
          <div
            className="animate-portada-ticker inline-flex whitespace-nowrap"
          >
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="inline-flex items-center">
                <span
                  className="font-serif italic pr-10"
                  style={{
                    color: item.color,
                    fontSize: "clamp(0.8rem, 1.5vw, 0.95rem)",
                    letterSpacing: "0.01em",
                  }}
                >
                  {item.text}
                </span>
                <span className="font-mono text-xs text-ink-soft pr-10" aria-hidden>✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* Etiqueta */}
        <p
          className="animate-portada-fade-in font-mono uppercase text-ink mb-6 [animation-delay:0.1s]"
          style={{
            fontSize: "clamp(0.55rem, 1vw, 0.65rem)",
            letterSpacing: "0.22em",
          }}
        >
          antología didáctica · lengua castellana y literatura
        </p>

        {/* Título */}
        <h1
          className="animate-portada-fade-up font-display font-black text-ink [animation-delay:0.2s]"
          style={{
            fontSize: "clamp(5.5rem, 20vw, 14rem)",
            lineHeight: 0.88,
            letterSpacing: "-0.03em",
          }}
        >
          ¡LEE!
        </h1>

        {/* Subtítulo */}
        <div
          className="animate-portada-fade-up mt-7 flex flex-wrap items-baseline justify-center gap-x-2 [animation-delay:0.45s]"
        >
          <em
            className="font-display italic font-normal"
            style={{ fontSize: "clamp(1.1rem, 3.5vw, 2.2rem)", color: "var(--color-accent)" }}
          >
            Nombrar
          </em>
          <span
            className="font-serif italic font-light text-ink"
            style={{ fontSize: "clamp(0.85rem, 2.2vw, 1.4rem)" }}
          >
            el mundo,
          </span>
          <em
            className="font-display italic font-normal"
            style={{ fontSize: "clamp(1.1rem, 3.5vw, 2.2rem)", color: "var(--color-accent)" }}
          >
            transformar
          </em>
          <span
            className="font-serif italic font-light text-ink"
            style={{ fontSize: "clamp(0.85rem, 2.2vw, 1.4rem)" }}
          >
            el mundo
          </span>
        </div>

        {/* Flecha entrar */}
        <div
          className="animate-portada-fade-in mt-12 [animation-delay:0.9s]"
        >
          <a href="#antologia" className="group inline-flex flex-col items-center gap-2">
            <span
              className="font-mono uppercase text-ink transition-colors duration-200 group-hover:text-accent"
              style={{ fontSize: "0.6rem", letterSpacing: "0.22em" }}
            >
              entrar
            </span>
            <span
              className="animate-portada-pulse flex h-[52px] w-[52px] items-center justify-center rounded-full border border-ink transition-colors duration-200 group-hover:bg-ink [animation-delay:1.5s]"
            >
              <span className="text-ink transition-colors duration-200 group-hover:text-paper">
                <svg
                  viewBox="0 0 24 24"
                  width={18}
                  height={18}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </span>
          </a>
        </div>

        {/* Firma */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between border-t border-line px-8 py-4">
          <span className="font-serif italic text-sm text-ink">Asier Lorenzo García</span>
          <span
            className="font-mono uppercase text-ink text-right"
            style={{ fontSize: "0.55rem", letterSpacing: "0.12em", lineHeight: 1.8 }}
          >
            IES Agra do Orzán · A Coruña<br />
            2026–2027
          </span>
        </div>
      </section>

      {/* ── ANTOLOGÍA ─────────────────────────────────────────────────────── */}
      <div id="antologia">
        {featured && <FeaturedFragment fragment={featured} />}

        {fragments.length > 0 && (
          <section className="mx-auto max-w-5xl px-4 py-12">
            <FadeUp>
              <h2 className="mb-6 font-display text-xl italic">Otros fragmentos</h2>
            </FadeUp>
            <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {fragments.map((fragment, i) => (
                <FadeUp key={fragment.id} delay={i * 60}>
                  <FragmentCard fragment={fragment} />
                </FadeUp>
              ))}
            </div>
          </section>
        )}

        <section className="mx-auto max-w-5xl px-4 py-12">
          <FadeUp>
            <h2 className="mb-6 font-display text-xl italic">Explorar por...</h2>
            <div className="grid grid-cols-2 gap-0 border-l-2 border-t-2 border-ink sm:grid-cols-3 lg:grid-cols-4">
              {FACETS.map((facet) => (
                <Link
                  key={facet.href}
                  href={facet.href}
                  className="hard-cut flex items-center gap-2 border-b-2 border-r-2 border-ink bg-paper-soft p-4 text-sm font-medium text-ink"
                >
                  <facet.icon size={15} aria-hidden />
                  {facet.label}
                </Link>
              ))}
            </div>
          </FadeUp>
        </section>
      </div>
    </div>
  );
}
