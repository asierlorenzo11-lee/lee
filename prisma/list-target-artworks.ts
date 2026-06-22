import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

// Partial headline strings to search for (lowercased)
const NEEDLES = [
  "de entre las más ladinas",
  "en el comienço debe omne partir",
  "yo soy la muerte cierta",
  "en esto veo melibea la grandeza",
  "justicia, justicia, señores vecinos",
  "el más feo y espantoso animal",
  "antes de tiempo y casi en flor",
  "de pura honestidad templo sagrado",
  "la dulce boca que a gustar convida",
  "una sombra que está en todo",
  "del salón en el ángulo oscuro",
  "o esa tu libertad, pueblo",
  "don juan visita el panteón",
  "por el cielo va la luna",
  "recuerdos que no dejan vivir",
  "es el esposo de su eterno amor",
  "pone un sello de grandeza",
  "que es mi dios la libertad",
  "no hallé cosa en que poner los ojos",
  "¡ah de la vida",
  "érase un naricísimo",
  "fue sueño ayer",
  "¡ay mísero de mí",
  "ni vivo confiada ni celosa",
  "el matador fue bellido",
  "dilin dilon",
  "mi padre se llamó clemente",
  "el hombre que ella misma se da",
  "bermejazo platero de las cumbres",
  "más por baco que por febo",
  "almohadillas",
  "fuente ovejuna lo hizo",
  "vergüenza convertida en val",
];

async function main() {
  const all = await prisma.fragment.findMany({
    where: { status: "published" },
    select: {
      slug: true,
      headline: true,
      artworkImageUrl: true,
      artworkTitle: true,
      artworkAuthor: true,
      work: { select: { title: true, author: { select: { name: true } } } },
    },
  });

  for (const needle of NEEDLES) {
    const match = all.find((f) =>
      f.headline.toLowerCase().includes(needle.toLowerCase())
    );
    if (!match) {
      console.log(`\n⚠ NO ENCONTRADO: "${needle}"`);
      continue;
    }
    console.log(`\n${match.work.author.name} · ${match.work.title}`);
    console.log(`  slug:    ${match.slug}`);
    console.log(`  titular: ${match.headline}`);
    console.log(`  imagen:  ${match.artworkImageUrl ?? "(sin imagen)"}`);
    console.log(`  cuadro:  ${match.artworkTitle ?? "-"} / ${match.artworkAuthor ?? "-"}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
