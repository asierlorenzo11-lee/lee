import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  const cid = await prisma.fragment.findMany({
    where: { work: { slug: "cantar-de-mio-cid" } },
    select: { slug: true, headline: true }
  });
  console.log("Cantar del Cid:");
  cid.forEach(f => console.log(`  ${f.slug} — ${f.headline}`));

  const vivar = await prisma.place.findMany({ where: { name: { contains: "Vivar" } }, select: { slug: true, name: true } });
  console.log("\nVivar places:", JSON.stringify(vivar));

  const quijote = await prisma.fragment.findMany({
    where: { work: { title: { contains: "Quijote" } } },
    select: { slug: true, headline: true }
  });
  console.log("\nQuijote fragments:");
  quijote.forEach(f => console.log(`  ${f.slug}`));

  const lba = await prisma.fragment.findMany({
    where: { work: { title: { contains: "buen amor" } } },
    select: { slug: true }
  });
  console.log("\nLibro buen amor:");
  lba.forEach(f => console.log(`  ${f.slug}`));
}
main().catch(console.error).finally(() => prisma.$disconnect());
