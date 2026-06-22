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
    where: { slug: "destierro-del-cid" },
    data: {
      artworkImageUrl: "/images/artworks/destierro-del-cid.jpg",
      artworkTitle: "El Cid (fotograma)",
      artworkAuthor: "Anthony Mann, 1961",
      artworkCaption: "El Cid · Anthony Mann (1961)",
    },
  })
  .then((r) => console.log(`✓ ${r.slug} → ${r.artworkImageUrl}`))
  .finally(() => prisma.$disconnect());
