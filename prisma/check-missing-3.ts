import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

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

  const terms = ["melibea", "dilin", "dilon", "procesion", "procesión", "ella misma se da", "hombre que"];

  for (const t of terms) {
    const hits = all.filter(f => f.headline.toLowerCase().includes(t.toLowerCase()));
    if (!hits.length) { console.log(`NO: "${t}"`); continue; }
    for (const h of hits) {
      console.log(`\nMATCH "${t}" → ${h.work.author.name} · ${h.work.title}`);
      console.log(`  slug:    ${h.slug}`);
      console.log(`  titular: ${h.headline}`);
      console.log(`  imagen:  ${h.artworkImageUrl ?? "(sin imagen)"}`);
    }
  }

  // Also search by title field (not headline)
  console.log("\n=== BÚSQUEDA EN title ===");
  const all2 = await prisma.fragment.findMany({
    where: { status: "published" },
    select: { slug: true, title: true, headline: true, work: { select: { title: true, author: { select: { name: true } } } } },
  });
  for (const t of ["melibea", "dilin", "procesion", "ella misma"]) {
    const hits = all2.filter(f => f.title.toLowerCase().includes(t.toLowerCase()));
    if (!hits.length) { console.log(`title NO: "${t}"`); continue; }
    for (const h of hits) {
      console.log(`\ntitle MATCH "${t}" → ${h.work.author.name}`);
      console.log(`  slug:    ${h.slug}`);
      console.log(`  title:   ${h.title}`);
      console.log(`  titular: ${h.headline}`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
