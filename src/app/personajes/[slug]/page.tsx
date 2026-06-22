import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCharacterBySlug } from "@/lib/queries";
import { TagDetail } from "@/components/facets/TagDetail";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const character = await getCharacterBySlug(slug);
  if (!character) return {};
  return {
    title: character.name,
    description: `Fragmentos de la antología ¡LEE! en los que aparece el personaje «${character.name}».`,
  };
}

export default async function PersonajePage({ params }: PageProps) {
  const { slug } = await params;
  const character = await getCharacterBySlug(slug);
  if (!character) notFound();

  return (
    <TagDetail
      breadcrumbLabel="Personajes"
      breadcrumbHref="/personajes"
      name={character.name}
      fragments={character.fragments}
    />
  );
}
