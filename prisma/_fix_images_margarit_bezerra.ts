import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  ...(process.env.TURSO_AUTH_TOKEN ? { authToken: process.env.TURSO_AUTH_TOKEN } : {}),
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Retrato Joan Margarit
  const a1 = await prisma.author.updateMany({
    where: { slug: "joan-margarit" },
    data: { portraitUrl: "/images/authors/joan-margarit.jpg" },
  });
  console.log("Margarit retrato:", a1.count);

  // Artwork fragmento La libertad (Margarit)
  const f1 = await prisma.fragment.updateMany({
    where: { slug: "la-libertad-margarit" },
    data: {
      artworkImageUrl: "/images/artworks/delacroix-libertad.jpg",
      artworkTitle: "La libertad guiando al pueblo",
      artworkAuthor: "Eugène Delacroix",
    },
  });
  console.log("La libertad artwork:", f1.count);

  // Artwork fragmento Bezerra
  const f2 = await prisma.fragment.updateMany({
    where: { slug: "bezerra-teresa-escribir-en-espana" },
    data: {
      artworkImageUrl: "/images/artworks/bernini-extasis-teresa.jpg",
      artworkTitle: "El éxtasis de Santa Teresa",
      artworkAuthor: "Gian Lorenzo Bernini",
    },
  });
  console.log("Bezerra artwork:", f2.count);
}

main().catch(console.error).finally(() => prisma.$disconnect());
