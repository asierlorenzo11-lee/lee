import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const fragments = await prisma.fragment.findMany({
    where: { status: "published", artworkImageUrl: { not: null } },
    select: { slug: true, artworkImageUrl: true, artworkTitle: true },
    orderBy: { artworkImageUrl: "asc" },
  });

  const byUrl = new Map<string, { slug: string; artworkTitle: string | null }[]>();
  for (const f of fragments) {
    const url = f.artworkImageUrl!;
    if (!byUrl.has(url)) byUrl.set(url, []);
    byUrl.get(url)!.push({ slug: f.slug, artworkTitle: f.artworkTitle });
  }

  console.log("=== IMÁGENES REPETIDAS ===\n");
  let totalDupes = 0;
  for (const [url, frags] of byUrl.entries()) {
    if (frags.length > 1) {
      totalDupes++;
      console.log(`[${url}]`);
      for (const f of frags) {
        console.log(`  - ${f.slug}  («${f.artworkTitle}»)`);
      }
      console.log();
    }
  }
  if (totalDupes === 0) console.log("Sin repetidos.");
  else console.log(`Total imágenes repetidas: ${totalDupes}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
