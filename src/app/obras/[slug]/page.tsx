import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWorkBySlug } from "@/lib/queries";
import { excerpt } from "@/lib/text";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Markdown } from "@/components/ui/Markdown";
import { FragmentListItem } from "@/components/fragments/FragmentListItem";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);
  if (!work) return {};
  return { title: work.title, description: excerpt(work.synopsis, 160) };
}

export default async function ObraPage({ params }: PageProps) {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);
  if (!work) notFound();

  return (
    <div>
      <Breadcrumbs items={[{ href: "/obras", label: "Obras" }, { label: work.title }]} />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm text-ink-soft">
          <Link href={`/autores/${work.author.slug}`} className="hover:text-accent">
            {work.author.name}
          </Link>
          {work.year ? ` · ${work.year}` : ""}
          {work.era ? ` · ${work.era}` : ""}
          {` · ${work.genre}`}
        </p>
        <h1 className="mt-2 font-serif text-3xl italic">{work.title}</h1>
        {work.translatedTitle && <p className="mt-1 text-ink-soft">{work.translatedTitle}</p>}

        <div className="mt-4">
          <Markdown content={work.synopsis} className="text-ink-soft" />
        </div>

        <h2 className="mt-10 font-serif text-xl italic">Fragmentos</h2>
        <ul className="mt-2 divide-y divide-line">
          {work.fragments.map((fragment) => (
            <FragmentListItem
              key={fragment.id}
              href={`/fragmentos/${fragment.slug}`}
              location={fragment.location}
              headline={fragment.headline}
              title={fragment.title}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
