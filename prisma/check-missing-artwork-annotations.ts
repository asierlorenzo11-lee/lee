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
    select: {
      slug: true,
      artworkImageUrl: true,
      artworkTitle: true,
      artworkAuthor: true,
      artworkCaption: true,
    },
    orderBy: { slug: "asc" },
  });

  const missing = fragments.filter(
    (f) => !f.artworkTitle || !f.artworkAuthor || !f.artworkCaption
  );

  console.log(`Total fragmentos con imagen: ${fragments.length}`);
  console.log(`Sin anotaciones completas: ${missing.length}\n`);

  for (const f of missing) {
    console.log(`[${f.slug}]`);
    console.log(`  url:     ${f.artworkImageUrl}`);
    console.log(`  title:   ${f.artworkTitle ?? "FALTA"}`);
    console.log(`  author:  ${f.artworkAuthor ?? "FALTA"}`);
    console.log(`  caption: ${f.artworkCaption ? f.artworkCaption.slice(0, 60) + "…" : "FALTA"}`);
    console.log();
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
