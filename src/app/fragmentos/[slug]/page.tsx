import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAdjacentFragments,
  getFragmentBySlug,
  getItineraryNeighbors,
  getRelatedFragments,
} from "@/lib/queries";
import { excerpt } from "@/lib/text";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { AnnotatedText } from "@/components/annotations/AnnotatedText";
import { FigureLegend } from "@/components/annotations/FigureLegend";
import { QuestionsAccordion } from "@/components/annotations/QuestionsAccordion";
import { MarkAsReadButton } from "@/components/fragments/MarkAsReadButton";
import { AudioPlayer } from "@/components/fragments/AudioPlayer";
import { ArtworkBlock } from "@/components/fragments/ArtworkBlock";
import { RelatedFragments } from "@/components/fragments/RelatedFragments";
import { PrevNextNav } from "@/components/fragments/PrevNextNav";
import { ActiveFilterChips } from "@/components/fragments/ActiveFilterChips";
import { TagsBox } from "@/components/fragments/TagsBox";
import { ReadingLayersToolbar } from "@/components/reading-settings/ReadingLayersToolbar";
import { AccessibilityBox } from "@/components/reading-settings/AccessibilityBox";
import { FragmentReaderLayout } from "@/components/fragments/FragmentReaderLayout";
import { AnnotationLayerNotes } from "@/components/annotations/AnnotationLayerNotes";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const fragment = await getFragmentBySlug(slug);
  if (!fragment) return {};

  return {
    title: fragment.headline,
    description: excerpt(fragment.text, 160),
    openGraph: fragment.artworkImageUrl
      ? { images: [{ url: fragment.artworkImageUrl }] }
      : undefined,
  };
}

export default async function FragmentPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;

  const fragment = await getFragmentBySlug(slug);
  if (!fragment) notFound();

  const itinerarioParam = Array.isArray(sp.itinerario) ? sp.itinerario[0] : sp.itinerario;

  const [adjacent, itineraryNeighbors, related] = await Promise.all([
    getAdjacentFragments(fragment.workId, fragment.order),
    itinerarioParam ? getItineraryNeighbors(itinerarioParam, fragment.id) : Promise.resolve(null),
    getRelatedFragments(fragment),
  ]);

  const prevNext = itineraryNeighbors
    ? {
        prev: itineraryNeighbors.prev,
        next: itineraryNeighbors.next,
        itineraryContext: {
          slug: itineraryNeighbors.itinerary.slug,
          title: itineraryNeighbors.itinerary.title,
          position: itineraryNeighbors.position,
          total: itineraryNeighbors.total,
        },
      }
    : { prev: adjacent.prev, next: adjacent.next, itineraryContext: null };

  return (
    <div>
      <Breadcrumbs
        items={[
          { href: "/obras", label: "Obras" },
          { href: `/obras/${fragment.work.slug}`, label: fragment.work.title },
          { label: fragment.title },
        ]}
      />

      <article className="px-4 pt-12 pb-24 sm:px-6 lg:px-10">

        {/* ── Header ────────────────────────────────────────────────────────── */}
        <header className="mx-auto max-w-[600px]">
          {fragment.location && (
            <p className="font-sans text-[11px] tracking-[0.18em] text-ink-soft uppercase">
              {fragment.location}
            </p>
          )}
          <h1 className="mt-3 font-serif text-4xl italic leading-[1.2] text-ink sm:text-5xl">
            {fragment.headline}
          </h1>
          <p className="mt-4 text-sm text-ink-soft leading-relaxed">
            <span className="font-medium text-ink">{fragment.title}</span>
            <span className="mx-1.5 text-ink-soft/40">—</span>
            <Link
              href={`/obras/${fragment.work.slug}`}
              className="italic hover:text-accent transition-colors"
            >
              {fragment.work.title}
            </Link>
            <span className="mx-1">,</span>
            <Link
              href={`/autores/${fragment.work.author.slug}`}
              className="hover:text-accent transition-colors"
            >
              {fragment.work.author.name}
            </Link>
            {fragment.work.year ? (
              <span className="text-ink-soft/60"> ({fragment.work.year})</span>
            ) : null}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <MarkAsReadButton slug={fragment.slug} />
            {fragment.audioUrl && <AudioPlayer url={fragment.audioUrl} />}
          </div>
        </header>

        {/* ── Layer toolbar ──────────────────────────────────────────────────── */}
        <div className="mx-auto mt-10 max-w-[600px] border-t border-line pt-5 pb-1">
          <p className="mb-3 text-[10px] tracking-[0.15em] text-ink-soft uppercase font-sans">
            Capas de lectura
          </p>
          <ReadingLayersToolbar />
        </div>

        {/* ── Main content ──────────────────────────────────────────────────── */}
        <div className="mt-8">
          <FragmentReaderLayout
            text={
              <div>
                <ActiveFilterChips fragment={fragment} searchParams={sp} />
                <AnnotatedText text={fragment.text} annotations={fragment.annotations} />
                <div className="mt-8">
                  <FigureLegend annotations={fragment.annotations} />
                </div>
                <QuestionsAccordion annotations={fragment.annotations} />
                <AnnotationLayerNotes annotations={fragment.annotations} />
              </div>
            }
            aside={
              <>
                <AccessibilityBox />
                <ArtworkBlock fragment={fragment} />
                <TagsBox fragment={fragment} />
              </>
            }
          />
        </div>

        {/* ── Footer nav ────────────────────────────────────────────────────── */}
        <div className="mx-auto mt-20 max-w-4xl space-y-12">
          <RelatedFragments fragments={related} />
          <PrevNextNav {...prevNext} />
        </div>
      </article>
    </div>
  );
}
