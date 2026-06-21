import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const fragments = await prisma.fragment.findMany({
    where: { status: "published" },
    select: {
      slug: true,
      title: true,
      _count: { select: { annotations: true } },
      work: { select: { title: true } },
    },
    orderBy: [{ work: { title: "asc" } }, { order: "asc" }],
  });

  const withAnnotations = fragments.filter((f) => f._count.annotations > 0);
  const withoutAnnotations = fragments.filter((f) => f._count.annotations === 0);

  console.log(`Total fragmentos publicados: ${fragments.length}`);
  console.log(`Con anotaciones: ${withAnnotations.length}`);
  console.log(`SIN anotaciones: ${withoutAnnotations.length}\n`);

  console.log("=== SIN CAPAS DE LECTURA ===\n");
  for (const f of withoutAnnotations) {
    console.log(`[${f.work.title}] ${f.slug}`);
    console.log(`  «${f.title}»`);
  }

  console.log("\n=== CON CAPAS DE LECTURA ===\n");
  for (const f of withAnnotations) {
    console.log(`[${f.work.title}] ${f.slug}  (${f._count.annotations} anot.)`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
