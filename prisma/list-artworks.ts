import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const frags = await prisma.fragment.findMany({
    select: {
      slug: true,
      headline: true,
      artworkImageUrl: true,
      artworkTitle: true,
      artworkAuthor: true,
      artworkCaption: true,
      work: { select: { title: true, author: { select: { name: true } } } },
    },
    orderBy: [{ work: { author: { name: "asc" } } }, { order: "asc" }],
  });

  for (const f of frags) {
    console.log(`\n─ ${f.work.author.name} · ${f.work.title}`);
    console.log(`  slug:    ${f.slug}`);
    console.log(`  titular: ${f.headline}`);
    console.log(`  imagen:  ${f.artworkImageUrl ?? "(sin imagen)"}`);
    console.log(`  cuadro:  ${f.artworkTitle ?? ""} / ${f.artworkAuthor ?? ""}`);
    if (f.artworkCaption) console.log(`  caption: ${f.artworkCaption}`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
