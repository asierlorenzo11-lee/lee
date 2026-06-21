import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const p = new PrismaClient({ adapter });
async function main() {
  const works = await p.work.findMany({
    select: { id: true, slug: true, title: true, era: true, genre: true, author: { select: { name: true, slug: true } }, fragments: { select: { slug: true, title: true } } },
    orderBy: { era: "asc" },
  });
  for (const w of works) {
    console.log(`\n[${w.era ?? "?"}] ${w.author.name} — ${w.title} (${w.slug})`);
    for (const f of w.fragments) console.log(`  → ${f.slug}: ${f.title}`);
  }
  console.log(`\nTotal obras: ${works.length}`);
  console.log(`Total fragmentos: ${works.reduce((n, w) => n + w.fragments.length, 0)}`);
}
main().catch(console.error).finally(() => p.$disconnect());
