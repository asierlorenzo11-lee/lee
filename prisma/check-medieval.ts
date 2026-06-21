import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  const works = await prisma.work.findMany({
    include: {
      author: { select: { name: true, slug: true } },
      fragments: { select: { title: true, slug: true, order: true }, orderBy: { order: "asc" } },
    },
    orderBy: [{ author: { name: "asc" } }, { year: "asc" }],
  });

  const medieval = works.filter(w => {
    const y = w.year ?? 0;
    // Medieval: up to ~1500, or by key authors
    return y <= 1500 || ["anónimo","juan manuel","berceo","alfonso x","arcipreste"].some(k =>
      w.author.name.toLowerCase().includes(k)
    );
  });

  console.log(`=== OBRAS MEDIEVALES EN LEE (${medieval.length}) ===\n`);
  for (const w of medieval) {
    console.log(`[${w.author.name}] "${w.title}" (${w.year ?? "s/f"}) — ${w.fragments.length} fragmentos`);
    for (const f of w.fragments) {
      console.log(`   ${f.order}. ${f.title} (${f.slug})`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
