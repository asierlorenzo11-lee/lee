import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAuthorBySlug, getRelatedAuthors } from "@/lib/queries";
import { excerpt } from "@/lib/text";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Markdown } from "@/components/ui/Markdown";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) return {};
  return { title: author.name, description: excerpt(author.bio, 160) };
}

export default async function AutorPage({ params }: PageProps) {
  const { slug } = await params;
  const [author, related] = await Promise.all([
    getAuthorBySlug(slug),
    getAuthorBySlug(slug).then((a) =>
      a?.era ? getRelatedAuthors(a.era, slug) : Promise.resolve([])
    ),
  ]);
  if (!author) notFound();

  const totalFragments = author.works.reduce((n, w) => n + w.fragments.length, 0);
  const dates =
    author.birthYear || author.deathYear
      ? `${author.birthYear ?? "?"}–${author.deathYear ?? "?"}`
      : null;

  return (
    <div>
      <Breadcrumbs items={[{ href: "/autores", label: "Autores" }, { label: author.name }]} />

      {/* ── Hero: retrato + metadatos ───────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-col sm:flex-row gap-8 items-start">

          {/* Retrato cuadrado */}
          <div className="shrink-0 w-48 h-48 sm:w-56 sm:h-56 rounded-lg overflow-hidden bg-surface border border-line">
            {author.portraitUrl ? (
              <Image
                src={author.portraitUrl}
                alt={author.name}
                width={224}
                height={224}
                className="w-full h-full object-cover object-top"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-ink-soft">
                {author.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="font-serif text-4xl italic leading-tight mb-2">{author.name}</h1>

            <div className="flex flex-wrap gap-2 mb-4">
              {author.era && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20">
                  {author.era}
                </span>
              )}
              {author.country && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-surface border border-line text-ink-soft">
                  {author.country}
                </span>
              )}
              {dates && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-surface border border-line text-ink-soft">
                  {dates}
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-6 mb-5 text-sm">
              <div>
                <span className="font-display text-xl font-bold">{author.works.length}</span>
                <span className="text-ink-soft ml-1.5">obra{author.works.length !== 1 ? "s" : ""}</span>
              </div>
              <div>
                <span className="font-display text-xl font-bold">{totalFragments}</span>
                <span className="text-ink-soft ml-1.5">fragmento{totalFragments !== 1 ? "s" : ""}</span>
              </div>
            </div>

            {/* Bio (primeros 400 chars como resumen) */}
            {author.bio && (
              <p className="text-sm text-ink-soft leading-relaxed line-clamp-4">
                {excerpt(author.bio, 400)}
              </p>
            )}
          </div>
        </div>

        {/* ── Bio completa ───────────────────────────────────────────────────── */}
        {author.bio && (
          <div className="mt-10 prose prose-neutral max-w-none border-t border-line pt-8">
            <Markdown content={author.bio} className="text-ink leading-relaxed" />
          </div>
        )}

        {/* ── Obras ──────────────────────────────────────────────────────────── */}
        {author.works.map((work) => {
          const frags = work.fragments;
          return (
            <section key={work.id} className="mt-12">
              <div className="flex items-baseline justify-between border-b border-line pb-2 mb-5">
                <h2 className="font-display text-xl italic">
                  <Link href={`/obras/${work.slug}`} className="hover:text-accent transition-colors">
                    {work.title}
                  </Link>
                </h2>
                {work.year && (
                  <span className="text-sm text-ink-soft shrink-0 ml-3">{work.year}</span>
                )}
              </div>

              {frags.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {frags.map((fragment) => (
                    <Link
                      key={fragment.id}
                      href={`/fragmentos/${fragment.slug}`}
                      className="group flex flex-col rounded-lg overflow-hidden border border-line hover:border-accent/40 hover:shadow-md transition-all bg-surface"
                    >
                      {/* Artwork */}
                      <div className="relative aspect-[4/3] bg-ink/5 overflow-hidden">
                        {fragment.artworkImageUrl ? (
                          <Image
                            src={fragment.artworkImageUrl}
                            alt={fragment.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-ink-soft/30 text-3xl font-serif italic">
                            «
                          </div>
                        )}
                      </div>

                      {/* Label */}
                      <div className="p-3 flex-1">
                        {fragment.location && (
                          <p className="text-[10px] text-ink-soft uppercase tracking-wider mb-0.5 truncate">
                            {fragment.location}
                          </p>
                        )}
                        <p className="text-sm font-semibold leading-snug line-clamp-2">
                          {fragment.headline ?? fragment.title}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink-soft italic">Sin fragmentos publicados.</p>
              )}
            </section>
          );
        })}

        {/* ── Autores relacionados ───────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="mt-16 pt-10 border-t border-line">
            <h2 className="font-display text-lg font-semibold mb-5 text-ink-soft uppercase tracking-wider text-sm">
              Otros autores · {author.era}
            </h2>
            <div className="flex gap-4 flex-wrap">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/autores/${rel.slug}`}
                  className="flex items-center gap-3 p-3 rounded-lg border border-line hover:border-accent/40 hover:bg-surface transition-all group min-w-[180px]"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-ink/5 border border-line">
                    {rel.portraitUrl ? (
                      <Image
                        src={rel.portraitUrl}
                        alt={rel.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm font-bold text-ink-soft">
                        {rel.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-tight group-hover:text-accent transition-colors truncate">
                      {rel.name}
                    </p>
                    {(rel.birthYear || rel.deathYear) && (
                      <p className="text-xs text-ink-soft mt-0.5">
                        {rel.birthYear ?? "?"}–{rel.deathYear ?? "?"}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
