import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Fragmentos con título en minúscula
  const allFrags = await prisma.fragment.findMany({
    select: { slug: true, title: true },
    orderBy: { slug: "asc" },
  });
  const lowercase = allFrags.filter(f => f.title && /^[a-záéíóúüñ]/.test(f.title));
  console.log(`\n=== FRAGMENTOS CON TÍTULO EN MINÚSCULA (${lowercase.length}) ===`);
  for (const f of lowercase) console.log(`  [${f.slug}] "${f.title}"`);

  // 2. Autores y obras del Prerrenacimiento
  const prerren = await prisma.author.findMany({
    where: { era: { contains: "rrenacimiento" } },
    include: {
      works: {
        include: { fragments: { where: { status: "published" }, select: { slug: true, title: true } } },
      },
    },
    orderBy: { name: "asc" },
  });

  console.log(`\n=== AUTORES EN PRERRENACIMIENTO (${prerren.length}) ===`);
  for (const a of prerren) {
    console.log(`\n  [${a.slug}] ${a.name}`);
    for (const w of a.works) {
      console.log(`    OBRA: "${w.title}" (${w.year ?? "s.a."}) — ${w.fragments.length} fragmentos`);
      for (const f of w.fragments) console.log(`      - [${f.slug}] "${f.title}"`);
    }
  }

  // 3. Resumen total
  console.log("\n=== TODOS LOS AUTORES CON SU ERA ===");
  const all = await prisma.author.findMany({
    select: { slug: true, name: true, era: true },
    orderBy: [{ era: "asc" }, { name: "asc" }],
  });
  for (const a of all) console.log(`  [${a.era ?? "SIN ERA"}] ${a.name}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
