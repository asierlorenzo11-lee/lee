import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

prisma.fragment
  .update({
    where: { slug: "la-afrenta-de-corpes" },
    data: {
      artworkImageUrl: "/images/artworks/afrenta-de-corpes.jpg",
      artworkTitle: "La afrenta de Corpes",
      artworkAuthor: null,
      artworkCaption: null,
    },
  })
  .then((r) => console.log(`✓ ${r.slug} → ${r.artworkImageUrl}`))
  .finally(() => prisma.$disconnect());
