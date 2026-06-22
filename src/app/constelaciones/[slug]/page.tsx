import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getConstellationBySlug } from "@/lib/queries";
import { TagDetail } from "@/components/facets/TagDetail";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const constellation = await getConstellationBySlug(slug);
  if (!constellation) return {};
  return {
    title: constellation.name,
    description: `${constellation.fragments.length} fragmentos de la antología ¡LEE! relacionados con la constelación temática «${constellation.name}».`,
  };
}

export default async function ConstelacionPage({ params }: PageProps) {
  const { slug } = await params;
  const constellation = await getConstellationBySlug(slug);
  if (!constellation) notFound();

  return (
    <TagDetail
      breadcrumbLabel="Constelaciones"
      breadcrumbHref="/constelaciones"
      name={constellation.name}
      fragments={constellation.fragments}
    />
  );
}
