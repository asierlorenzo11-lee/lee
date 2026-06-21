import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Mostrar los fragmentos sin personajes con su obra/autor para identificar los que SÍ deberían tener
  const fragments = await prisma.fragment.findMany({
    where: { status: "published", characters: { none: {} } },
    select: { 
      slug: true, 
      headline: true,
      title: true,
      work: { select: { title: true, author: { select: { name: true } } } }
    },
    orderBy: [{ work: { author: { birthYear: "asc" } } }, { order: "asc" }]
  });
  
  for (const f of fragments) {
    console.log(`[${f.slug}]`);
    console.log(`  "${f.headline}" (${f.title})`);
    console.log(`  Obra: ${f.work.title} — ${f.work.author.name}`);
  }
  
  // Mostrar personajes existentes
  const chars = await prisma.character.findMany({ select: { slug: true, name: true }, orderBy: { name: "asc" } });
  console.log("\nPERSONAJES EXISTENTES:");
  for (const c of chars) console.log(`  ${c.name} (${c.slug})`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
