import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const p = new PrismaClient({ adapter });
async function main() {
  const noArt = await p.fragment.findMany({
    where: { artworkImageUrl: null },
    select: { slug: true, title: true },
    orderBy: { slug: "asc" },
  });
  console.log(`\n=== SIN ARTWORK (${noArt.length}) ===`);
  for (const f of noArt) console.log(`  ${f.slug}  —  ${f.title}`);

  const withArt = await p.fragment.findMany({
    where: { artworkImageUrl: { not: null } },
    select: { slug: true, artworkImageUrl: true },
    orderBy: { slug: "asc" },
  });
  console.log(`\n=== CON ARTWORK (${withArt.length}) ===`);
  for (const f of withArt) console.log(`  ${f.slug}\n    ${f.artworkImageUrl}`);
}
main().catch(console.error).finally(() => p.$disconnect());
