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
    where: { status: "published", artworkImageUrl: null },
    select: {
      slug: true,
      headline: true,
      work: { select: { title: true, author: { select: { name: true } } } },
    },
    orderBy: [{ work: { author: { name: "asc" } } }, { order: "asc" }],
  });

  console.log(`\nFragmentos sin imagen: ${frags.length}\n`);
  for (const f of frags) {
    console.log(`${f.work.author.name} · ${f.work.title}`);
    console.log(`  ${f.slug}`);
    console.log(`  ${f.headline}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
