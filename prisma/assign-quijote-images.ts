import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

function anchor(text: string, needle: string) {
  const anchorStart = text.indexOf(needle);
  if (anchorStart === -1) throw new Error(`Ancla no encontrada: "${needle.slice(0, 60)}"`);
  return { anchorStart, anchorEnd: anchorStart + needle.length };
}

const artworks: Record<string, { artworkImageUrl: string; artworkTitle: string; artworkAuthor: string | null; artworkCaption: string | null }> = {
  "yo-se-quien-soy": {
    artworkImageUrl: "/images/artworks/quijote-yo-se-quien-soy.jpg",
    artworkTitle: "Don Quijote",
    artworkAuthor: "Gustave Doré, 1863",
    artworkCaption: "Ilustración de Gustave Doré para el Quijote (1863)",
  },
  "discurso-edad-de-oro": {
    artworkImageUrl: "/images/artworks/quijote-edad-de-oro.jpg",
    artworkTitle: "Don Quijote con los cabreros",
    artworkAuthor: "Juan Antonio González, 1885",
    artworkCaption: null,
  },
  "discurso-de-marcela": {
    artworkImageUrl: "/images/artworks/quijote-marcela.jpg",
    artworkTitle: "Marcela ante la tumba de Grisóstomo",
    artworkAuthor: null,
    artworkCaption: null,
  },
  "discurso-armas-y-letras": {
    artworkImageUrl: "/images/artworks/quijote-armas-y-letras.jpg",
    artworkTitle: "Don Quijote a la mesa",
    artworkAuthor: null,
    artworkCaption: null,
  },
  "discurso-de-la-libertad": {
    artworkImageUrl: "/images/artworks/quijote-discurso-libertad.jpg",
    artworkTitle: "Don Quijote y Sancho Panza",
    artworkAuthor: null,
    artworkCaption: null,
  },
};

async function main() {
  for (const [slug, data] of Object.entries(artworks)) {
    const r = await prisma.fragment.update({ where: { slug }, data });
    console.log(`✓ ${r.slug} → ${r.artworkImageUrl}`);
  }

  // ── La quema de la biblioteca: foto histórica real, no ilustración del Quijote ──
  const quema = await prisma.fragment.findUniqueOrThrow({ where: { slug: "quema-de-la-biblioteca" } });
  await prisma.fragment.update({
    where: { slug: "quema-de-la-biblioteca" },
    data: {
      artworkImageUrl: "/images/artworks/quijote-quema-biblioteca.jpg",
      artworkTitle: "Quema de libros en A Coruña",
      artworkAuthor: "19 de agosto de 1936",
      artworkCaption:
        "Fotografía real (no una ilustración del Quijote): la quema pública de más de mil libros —de Blasco Ibáñez, Unamuno, Ortega y Gasset, Pío Baroja, y de bibliotecas como la del Centro Germinal— en la Dársena de A Coruña, frente al Real Club Náutico, en agosto de 1936.",
    },
  });
  console.log(`✓ quema-de-la-biblioteca → foto histórica A Coruña 1936`);

  await prisma.annotation.create({
    data: {
      fragmentId: quema.id,
      type: "intertextualidad",
      ...anchor(quema.text, "Vaya al fuego"),
      order: 10,
      content: `La quema de libros que aquí es una sátira contra las novelas de caballerías —arbitraria, hasta cómica— tuvo en la propia ciudad de A Coruña un equivalente real y trágico: la noche del 19 de agosto de 1936, tropas franquistas quemaron públicamente más de mil libros requisados a bibliotecas y particulares de la ciudad. Manuel Rivas reconstruye ese episodio en su novela *Os libros arden mal* (2006), cuyo título advierte precisamente de lo que la escena de Cervantes ya intuía con humor: que un libro no se destruye solo con el fuego, y que quien decide qué se quema rara vez tiene una razón mejor que el capricho del cura y el ama.`,
    },
  });
  console.log(`✓ Anotación de intertextualidad añadida (Manuel Rivas, Os libros arden mal)`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
