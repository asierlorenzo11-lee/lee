import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";
import {
  getAllAuthors,
  getAllWorks,
  getPublishedFragments,
  getAllItineraries,
  getAllTopics,
  getAllCharacters,
  getAllConstellations,
} from "@/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [authors, works, fragments, itineraries, topics, characters, constellations] =
    await Promise.all([
      getAllAuthors(),
      getAllWorks(),
      getPublishedFragments(),
      getAllItineraries(),
      getAllTopics(),
      getAllCharacters(),
      getAllConstellations(),
    ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/obras",
    "/autores",
    "/fragmentos",
    "/itinerarios",
    "/constelaciones",
    "/topicos",
    "/epocas",
    "/personajes",
    "/lugares",
    "/figuras",
    "/cronologia",
    "/acerca-de",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...authors.map((a) => ({ url: `${SITE_URL}/autores/${a.slug}`, changeFrequency: "yearly" as const, priority: 0.6 })),
    ...works.map((w) => ({ url: `${SITE_URL}/obras/${w.slug}`, changeFrequency: "yearly" as const, priority: 0.6 })),
    ...fragments.map((f) => ({ url: `${SITE_URL}/fragmentos/${f.slug}`, changeFrequency: "yearly" as const, priority: 0.7 })),
    ...itineraries.map((i) => ({ url: `${SITE_URL}/itinerarios/${i.slug}`, changeFrequency: "yearly" as const, priority: 0.5 })),
    ...topics.map((t) => ({ url: `${SITE_URL}/topicos/${t.slug}`, changeFrequency: "yearly" as const, priority: 0.5 })),
    ...characters.map((c) => ({ url: `${SITE_URL}/personajes/${c.slug}`, changeFrequency: "yearly" as const, priority: 0.5 })),
    ...constellations.map((c) => ({ url: `${SITE_URL}/constelaciones/${c.slug}`, changeFrequency: "yearly" as const, priority: 0.5 })),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
