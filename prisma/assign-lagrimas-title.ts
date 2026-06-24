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
    where: { slug: "la-vida-empieza-entre-lagrimas-y-caca" },
    data: {
      artworkTitle: "Vanitas: niño dormido con calavera",
      artworkAuthor: null,
      artworkCaption: null,
    },
  })
  .then((r) => console.log(`✓ ${r.slug} → ${r.artworkTitle}`))
  .finally(() => prisma.$disconnect());
