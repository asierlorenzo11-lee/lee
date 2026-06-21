import { prisma } from "./db";
import { Prisma } from "@/generated/prisma/client";

const fragmentWithWorkInclude = {
  work: { include: { author: true } },
  topics: true,
} satisfies Prisma.FragmentInclude;

export type FragmentCardData = Prisma.FragmentGetPayload<{
  include: typeof fragmentWithWorkInclude;
}>;

export async function getFragmentBySlug(slug: string) {
  return prisma.fragment.findFirst({
    where: { slug, status: "published" },
    include: {
      work: { include: { author: true } },
      annotations: {
        orderBy: { order: "asc" },
        include: {
          linkTargetFragment: { select: { slug: true, title: true } },
        },
      },
      constellations: true,
      characters: true,
      topics: true,
      places: true,
      itineraryItems: { include: { itinerary: true } },
    },
  });
}

export type FragmentDetail = NonNullable<Awaited<ReturnType<typeof getFragmentBySlug>>>;

/** Fragmento anterior/siguiente dentro de la misma obra, según su orden de lectura. */
export async function getAdjacentFragments(workId: string, order: number) {
  const [prev, next] = await Promise.all([
    prisma.fragment.findFirst({
      where: { workId, status: "published", order: { lt: order } },
      orderBy: { order: "desc" },
      select: { slug: true, title: true, headline: true },
    }),
    prisma.fragment.findFirst({
      where: { workId, status: "published", order: { gt: order } },
      orderBy: { order: "asc" },
      select: { slug: true, title: true, headline: true },
    }),
  ]);
  return { prev, next };
}

/** Vecinos del fragmento dentro de un itinerario concreto. */
export async function getItineraryNeighbors(itinerarySlug: string, fragmentId: string) {
  const itinerary = await prisma.itinerary.findUnique({
    where: { slug: itinerarySlug },
    include: {
      items: {
        orderBy: { order: "asc" },
        include: {
          fragment: { select: { id: true, slug: true, title: true, headline: true } },
        },
      },
    },
  });
  if (!itinerary) return null;

  const index = itinerary.items.findIndex((item) => item.fragmentId === fragmentId);
  if (index === -1) return null;

  return {
    itinerary: { slug: itinerary.slug, title: itinerary.title },
    position: index + 1,
    total: itinerary.items.length,
    prev: index > 0 ? itinerary.items[index - 1].fragment : null,
    next: index < itinerary.items.length - 1 ? itinerary.items[index + 1].fragment : null,
  };
}

/** Otros fragmentos publicados que comparten constelación, tópico o personaje. */
export async function getRelatedFragments(fragment: FragmentDetail, take = 3) {
  const constellationSlugs = fragment.constellations.map((c) => c.slug);
  const topicSlugs = fragment.topics.map((t) => t.slug);
  const characterSlugs = fragment.characters.map((c) => c.slug);

  const or: Prisma.FragmentWhereInput[] = [];
  if (constellationSlugs.length > 0) {
    or.push({ constellations: { some: { slug: { in: constellationSlugs } } } });
  }
  if (topicSlugs.length > 0) {
    or.push({ topics: { some: { slug: { in: topicSlugs } } } });
  }
  if (characterSlugs.length > 0) {
    or.push({ characters: { some: { slug: { in: characterSlugs } } } });
  }
  if (or.length === 0) return [];

  return prisma.fragment.findMany({
    where: {
      status: "published",
      id: { not: fragment.id },
      OR: or,
    },
    take,
    include: fragmentWithWorkInclude,
  });
}

/** El fragmento destacado más reciente para la portada. */
export async function getFeaturedFragment() {
  return prisma.fragment.findFirst({
    where: { status: "published", featured: true },
    orderBy: { featuredDate: "desc" },
    include: fragmentWithWorkInclude,
  });
}

/** Fragmentos publicados para el mosaico de la portada (o catálogos generales). */
export async function getPublishedFragments(options?: { excludeId?: string; take?: number }) {
  return prisma.fragment.findMany({
    where: {
      status: "published",
      ...(options?.excludeId ? { id: { not: options.excludeId } } : {}),
    },
    orderBy: [{ work: { year: "asc" } }, { order: "asc" }],
    take: options?.take,
    include: fragmentWithWorkInclude,
  });
}

// ---------------------------------------------------------------------------
// Obras
// ---------------------------------------------------------------------------

export async function getAllWorks() {
  return prisma.work.findMany({
    include: {
      author: true,
      fragments: { where: { status: "published" }, select: { id: true } },
    },
    orderBy: { year: "asc" },
  });
}

export async function getWorkBySlug(slug: string) {
  return prisma.work.findUnique({
    where: { slug },
    include: {
      author: true,
      fragments: { where: { status: "published" }, orderBy: { order: "asc" } },
    },
  });
}

// ---------------------------------------------------------------------------
// Autores
// ---------------------------------------------------------------------------

export async function getAllAuthors() {
  return prisma.author.findMany({
    include: {
      works: {
        include: { fragments: { where: { status: "published" }, select: { id: true } } },
      },
    },
    orderBy: { birthYear: "asc" },
  });
}

export async function getAuthorBySlug(slug: string) {
  return prisma.author.findUnique({
    where: { slug },
    include: {
      works: {
        orderBy: { year: "asc" },
        include: {
          fragments: {
            where: { status: "published" },
            orderBy: { order: "asc" },
            select: {
              id: true,
              slug: true,
              title: true,
              headline: true,
              location: true,
              artworkImageUrl: true,
            },
          },
        },
      },
    },
  });
}

export async function getRelatedAuthors(era: string, excludeSlug: string) {
  return prisma.author.findMany({
    where: { era, slug: { not: excludeSlug } },
    select: {
      slug: true,
      name: true,
      portraitUrl: true,
      birthYear: true,
      deathYear: true,
      country: true,
    },
    take: 5,
  });
}

// ---------------------------------------------------------------------------
// Fragmentos (índice con filtros)
// ---------------------------------------------------------------------------

export interface FragmentIndexFilters {
  constelacion?: string;
  topico?: string;
  personaje?: string;
  autor?: string;
  epoca?: string;
  itinerario?: string;
}

export async function getFragmentsIndex(filters: FragmentIndexFilters) {
  return prisma.fragment.findMany({
    where: {
      status: "published",
      ...(filters.constelacion
        ? { constellations: { some: { slug: filters.constelacion } } }
        : {}),
      ...(filters.topico ? { topics: { some: { slug: filters.topico } } } : {}),
      ...(filters.personaje ? { characters: { some: { slug: filters.personaje } } } : {}),
      ...(filters.autor ? { work: { author: { slug: filters.autor } } } : {}),
      ...(filters.epoca ? { work: { author: { era: filters.epoca } } } : {}),
      ...(filters.itinerario
        ? { itineraryItems: { some: { itinerary: { slug: filters.itinerario } } } }
        : {}),
    },
    orderBy: [{ work: { year: "asc" } }, { order: "asc" }],
    include: fragmentWithWorkInclude,
  });
}

export async function getAuthorsWithFragments() {
  return prisma.author.findMany({
    where: { works: { some: { fragments: { some: { status: "published" } } } } },
    select: { slug: true, name: true },
    orderBy: { birthYear: "asc" },
  });
}

const ERA_ORDER = [
  "Al-Ándalus",
  "Edad Media",
  "Prerrenacimiento",
  "Renacimiento",
  "Barroco",
  "Ilustración",
  "Romanticismo",
  "Modernismo",
  "Generación del 27",
];

export async function getErasWithFragments(): Promise<{ slug: string; name: string }[]> {
  const rows = await prisma.author.findMany({
    where: {
      era: { not: null },
      works: { some: { fragments: { some: { status: "published" } } } },
    },
    select: { era: true },
    distinct: ["era"],
  });
  return rows
    .filter((r) => r.era)
    .map((r) => ({ slug: r.era!, name: r.era! }))
    .sort((a, b) => ERA_ORDER.indexOf(a.name) - ERA_ORDER.indexOf(b.name));
}

// ---------------------------------------------------------------------------
// Itinerarios
// ---------------------------------------------------------------------------

const ITINERARY_SLUG_ORDER = [
  "nombrar-el-amor",
  "nombrar-el-valor",
  "nombrar-la-muerte",
  "nombrar-el-tiempo",
  "nombrar-la-fe",
  "nombrar-el-poder",
  "nombrar-la-ausencia",
];

function sortItineraries<T extends { slug: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const ia = ITINERARY_SLUG_ORDER.indexOf(a.slug);
    const ib = ITINERARY_SLUG_ORDER.indexOf(b.slug);
    if (ia === -1 && ib === -1) return a.slug.localeCompare(b.slug);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}

export async function getAllItineraries() {
  const rows = await prisma.itinerary.findMany({
    include: { items: { select: { fragmentId: true } } },
  });
  return sortItineraries(rows);
}

export async function getAllItinerariesWithItems() {
  const rows = await prisma.itinerary.findMany({
    include: {
      items: {
        orderBy: { order: "asc" },
        include: {
          fragment: {
            select: {
              slug: true,
              title: true,
              work: { select: { title: true, author: { select: { name: true } } } },
            },
          },
        },
      },
    },
  });
  return sortItineraries(rows);
}

export async function getItineraryBySlug(slug: string) {
  return prisma.itinerary.findUnique({
    where: { slug },
    include: {
      items: {
        orderBy: { order: "asc" },
        include: { fragment: { include: { work: { include: { author: true } } } } },
      },
    },
  });
}

// ---------------------------------------------------------------------------
// Tópicos, personajes, constelaciones
// ---------------------------------------------------------------------------

export async function getAllTopics() {
  return prisma.topic.findMany({
    include: { fragments: { where: { status: "published" }, select: { id: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getTopicBySlug(slug: string) {
  return prisma.topic.findUnique({
    where: { slug },
    include: {
      fragments: { where: { status: "published" }, include: fragmentWithWorkInclude },
    },
  });
}

export async function getAllCharacters() {
  return prisma.character.findMany({
    include: { fragments: { where: { status: "published" }, select: { id: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getCharacterBySlug(slug: string) {
  return prisma.character.findUnique({
    where: { slug },
    include: {
      fragments: { where: { status: "published" }, include: fragmentWithWorkInclude },
    },
  });
}

export async function getAllConstellations() {
  return prisma.constellation.findMany({
    include: { fragments: { where: { status: "published" }, select: { id: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getConstellationBySlug(slug: string) {
  return prisma.constellation.findUnique({
    where: { slug },
    include: {
      fragments: { where: { status: "published" }, include: fragmentWithWorkInclude },
    },
  });
}

// ---------------------------------------------------------------------------
// Épocas y lugares
// ---------------------------------------------------------------------------

/** Obras publicadas agrupadas por época, ordenadas cronológicamente. */
export async function getEras() {
  const works = await prisma.work.findMany({
    where: { fragments: { some: { status: "published" } } },
    include: {
      author: true,
      fragments: {
        where: { status: "published", artworkImageUrl: { not: null } },
        select: { artworkImageUrl: true },
        take: 1,
      },
    },
    orderBy: { year: "asc" },
  });

  const groups = new Map<string, {
    era: string;
    minYear: number | null;
    coverImage: string | null;
    works: typeof works;
  }>();

  for (const work of works) {
    const era = work.era ?? "Sin época";
    const group = groups.get(era) ?? { era, minYear: null, coverImage: null, works: [] };
    group.works.push(work);
    if (work.year !== null && (group.minYear === null || work.year < group.minYear)) {
      group.minYear = work.year;
    }
    if (!group.coverImage && work.fragments[0]?.artworkImageUrl) {
      group.coverImage = work.fragments[0].artworkImageUrl;
    }
    groups.set(era, group);
  }

  return [...groups.values()].sort(
    (a, b) => (a.minYear ?? Infinity) - (b.minYear ?? Infinity),
  );
}

/** Fragmentos publicados con los datos mínimos para la línea de tiempo. */
export async function getTimelineData() {
  return prisma.fragment.findMany({
    where: { status: "published" },
    select: {
      id: true,
      slug: true,
      headline: true,
      work: {
        select: {
          title: true,
          year: true,
          era: true,
          author: {
            select: {
              id: true,
              slug: true,
              name: true,
              birthYear: true,
              deathYear: true,
              era: true,
            },
          },
        },
      },
    },
    orderBy: { work: { year: "asc" } },
  });
}

export async function getAllPlaces() {
  return prisma.place.findMany({
    include: {
      fragments: { where: { status: "published" }, include: fragmentWithWorkInclude },
    },
    orderBy: { name: "asc" },
  });
}

// ---------------------------------------------------------------------------
// Constelaciones — mapa interactivo
// ---------------------------------------------------------------------------

export async function getConstellationsForMap() {
  const raw = await prisma.constellation.findMany({
    include: {
      fragments: {
        where: { status: "published" },
        select: {
          slug: true,
          title: true,
          work: { select: { author: { select: { name: true } } } },
        },
        orderBy: { order: "asc" },
        take: 10,
      },
    },
    orderBy: { name: "asc" },
  });
  return raw.map((c) => ({
    slug: c.slug,
    name: c.name,
    fragments: c.fragments.map((f) => ({
      slug: f.slug,
      title: f.title,
      author: f.work.author.name,
    })),
  }));
}

// ---------------------------------------------------------------------------
// Búsqueda global (fragmentos + autores + obras)
// ---------------------------------------------------------------------------

export async function searchGlobal(query: string) {
  const q = query.trim();
  if (q.length < 2) return { fragments: [], authors: [], works: [] };

  const [fragments, authors, works] = await Promise.all([
    prisma.fragment.findMany({
      where: {
        status: "published",
        OR: [
          { title: { contains: q } },
          { headline: { contains: q } },
          { work: { title: { contains: q } } },
          { work: { author: { name: { contains: q } } } },
          { text: { contains: q } },
        ],
      },
      take: 6,
      select: {
        slug: true,
        title: true,
        headline: true,
        work: { select: { title: true, author: { select: { name: true } } } },
      },
    }),
    prisma.author.findMany({
      where: { name: { contains: q } },
      take: 4,
      select: { slug: true, name: true, era: true, portraitUrl: true },
    }),
    prisma.work.findMany({
      where: {
        fragments: { some: { status: "published" } },
        OR: [
          { title: { contains: q } },
          { author: { name: { contains: q } } },
        ],
      },
      take: 4,
      select: {
        slug: true,
        title: true,
        year: true,
        author: { select: { name: true } },
      },
    }),
  ]);

  return { fragments, authors, works };
}

// ---------------------------------------------------------------------------
// Búsqueda (sólo fragmentos, usada en /buscar)
// ---------------------------------------------------------------------------

const SEARCH_RESULTS_LIMIT = 40;
const SEARCH_TIER_LIMIT = 20;

/**
 * Búsqueda con relevancia por niveles: los resultados se agrupan en
 * "tiers" (cabecera/título > obra/autor > etiquetas > texto completo) y se
 * concatenan en ese orden, sin duplicados, sin necesidad de FTS5/SQL crudo.
 */
export async function searchFragments(query: string) {
  const q = query.trim();
  if (!q) return [];

  const seen = new Set<string>();
  const results: FragmentCardData[] = [];

  const addTier = async (where: Prisma.FragmentWhereInput) => {
    if (results.length >= SEARCH_RESULTS_LIMIT) return;
    const matches = await prisma.fragment.findMany({
      where: {
        status: "published",
        id: { notIn: [...seen] },
        ...where,
      },
      include: fragmentWithWorkInclude,
      take: SEARCH_TIER_LIMIT,
    });
    for (const match of matches) {
      if (results.length >= SEARCH_RESULTS_LIMIT) break;
      seen.add(match.id);
      results.push(match);
    }
  };

  // Tier 1: coincidencia en la cabecera o el título del fragmento.
  await addTier({
    OR: [{ title: { contains: q } }, { headline: { contains: q } }],
  });

  // Tier 2: coincidencia en la obra o el autor.
  await addTier({
    OR: [{ work: { title: { contains: q } } }, { work: { author: { name: { contains: q } } } }],
  });

  // Tier 3: coincidencia en constelaciones, tópicos o personajes.
  await addTier({
    OR: [
      { constellations: { some: { name: { contains: q } } } },
      { topics: { some: { name: { contains: q } } } },
      { characters: { some: { name: { contains: q } } } },
    ],
  });

  // Tier 4: coincidencia en el texto completo del fragmento.
  await addTier({ text: { contains: q } });

  return results.slice(0, SEARCH_RESULTS_LIMIT);
}
