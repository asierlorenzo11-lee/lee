import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Get a sample of unanchored annotations from the 55 problem fragments
  const sample = await prisma.fragment.findMany({
    where: {
      slug: { in: [
        "romance-de-la-loba-parda",
        "el-infante-arnaldos",
        "la-guitarra-poema-cante-jondo",
        "rima-vii",
        "cancion-del-pirata",
      ]},
    },
    select: {
      slug: true,
      text: true,
      annotations: {
        where: { anchorStart: null },
        select: { type: true, anchorStart: true, anchorEnd: true, category: true, questionGroup: true, content: true, linkType: true, externalUrl: true, externalCitation: true, order: true },
        orderBy: { order: "asc" },
      },
    },
  });

  for (const f of sample) {
    console.log(`\n=== ${f.slug} ===`);
    console.log(`TEXTO (primeros 200 chars): ${f.text.slice(0,200)}`);
    console.log(`ANOTACIONES SIN ANCLA (${f.annotations.length}):`);
    for (const a of f.annotations) {
      console.log(`  type=${a.type} category=${a.category ?? "-"} group=${a.questionGroup ?? "-"}`);
      console.log(`  content: ${a.content.slice(0,150)}`);
      if (a.externalUrl) console.log(`  url: ${a.externalUrl}`);
      if (a.externalCitation) console.log(`  citation: ${a.externalCitation}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
