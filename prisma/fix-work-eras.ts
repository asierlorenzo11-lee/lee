import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const works = await prisma.work.findMany({
    where: { era: null },
    select: { id: true, slug: true, title: true, author: { select: { name: true, era: true } } },
  });

  console.log(`Obras con era=null: ${works.length}`);
  if (works.length === 0) { console.log("Nada que actualizar."); return; }

  let updated = 0;
  let skipped = 0;
  for (const w of works) {
    if (!w.author.era) {
      console.log(`  ⚠ [${w.slug}] "${w.title}" — autor "${w.author.name}" tampoco tiene era, omitido`);
      skipped++;
      continue;
    }
    await prisma.work.update({ where: { id: w.id }, data: { era: w.author.era } });
    console.log(`  ✓ [${w.slug}] → ${w.author.era}`);
    updated++;
  }

  console.log(`\n✅ ${updated} obras actualizadas, ${skipped} omitidas.`);

  // Verificación final
  const remaining = await prisma.work.count({ where: { era: null } });
  console.log(`Obras con era=null tras el arreglo: ${remaining}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
