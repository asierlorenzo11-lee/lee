import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTopicBySlug } from "@/lib/queries";
import { excerpt } from "@/lib/text";
import { TagDetail } from "@/components/facets/TagDetail";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug);
  if (!topic) return {};
  return {
    title: topic.name,
    description: topic.description ? excerpt(topic.description, 160) : undefined,
  };
}

export default async function TopicoPage({ params }: PageProps) {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug);
  if (!topic) notFound();

  return (
    <TagDetail
      breadcrumbLabel="Tópicos"
      breadcrumbHref="/topicos"
      name={topic.name}
      description={topic.description}
      fragments={topic.fragments}
    />
  );
}
