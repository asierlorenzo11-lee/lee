import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
const p = new PrismaClient({ adapter: new PrismaLibSql({ url: "file:./prisma/dev.db" }) });
async function main() {
  const its = await p.itinerary.findMany({
    include: { items: { orderBy: { order: "asc" }, include: { fragment: { select: { slug: true, title: true, work: { select: { author: { select: { name: true } } } } } } } } },
    orderBy: { title: "asc" },
  });
  for (const it of its) {
    console.log(`\n=== ${it.title} (${it.slug}) ===`);
    for (const item of it.items) {
      console.log(`  ${item.order}. ${item.fragment.title} — ${item.fragment.work.author.name} [${item.fragment.slug}]`);
    }
  }

  // Also list all fragments with their topics/constellations for designing new itineraries
  const frags = await p.fragment.findMany({
    where: { status: "published" },
    select: { slug: true, title: true, work: { select: { author: { select: { name: true } }, year: true } } },
    orderBy: [{ work: { year: "asc" } }, { order: "asc" }],
  });
  console.log("\n\n=== ALL PUBLISHED FRAGMENTS ===");
  for (const f of frags) {
    console.log(`${f.work.year ?? "?"} | ${f.work.author.name} | ${f.title} [${f.slug}]`);
  }
}
main().finally(() => p.$disconnect());
