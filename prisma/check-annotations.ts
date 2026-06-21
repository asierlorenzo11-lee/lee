import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const frags = await prisma.fragment.findMany({
    where: { status: "published" },
    include: {
      _count: { select: { annotations: true } },
      work: { include: { author: true } },
    },
    orderBy: [{ work: { author: { name: "asc" } } }, { order: "asc" }],
  });

  const noAnno = frags.filter((f) => f._count.annotations === 0);
  const fewAnno = frags.filter(
    (f) => f._count.annotations > 0 && f._count.annotations < 3,
  );
  const goodAnno = frags.filter((f) => f._count.annotations >= 3);

  console.log(`Total: ${frags.length} | Sin anotaciones: ${noAnno.length} | Pocas (<3): ${fewAnno.length} | Completos (≥3): ${goodAnno.length}`);

  if (noAnno.length > 0) {
    console.log("\n=== SIN ANOTACIONES ===");
    noAnno.forEach((f) =>
      console.log(`  [${f._count.annotations}] ${f.work.author.name} — "${f.work.title}" — "${f.title}" (${f.slug})`),
    );
  }

  if (fewAnno.length > 0) {
    console.log("\n=== POCAS ANOTACIONES (<3) ===");
    fewAnno.forEach((f) =>
      console.log(`  [${f._count.annotations}] ${f.work.author.name} — "${f.work.title}" — "${f.title}" (${f.slug})`),
    );
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
