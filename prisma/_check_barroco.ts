import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const p = new PrismaClient({ adapter });
async function main() {
  const works = await p.work.findMany({
    where: { era: "Barroco" },
    include: { author: { select: { name: true } }, fragments: { select: { slug: true, title: true, headline: true }, orderBy: { order: "asc" } } },
    orderBy: { author: { name: "asc" } },
  });
  for (const w of works) {
    console.log(`\n[${w.author.name}] ${w.title} (${w.slug})`);
    for (const f of w.fragments) console.log(`  ${f.slug} | ${f.headline ?? f.title}`);
  }
  console.log(`\nTotal obras Barroco: ${works.length}`);
  console.log(`Total fragmentos: ${works.reduce((n, w) => n + w.fragments.length, 0)}`);
}
main().then(() => p.$disconnect()).catch(e => { console.error(e); p.$disconnect(); });
