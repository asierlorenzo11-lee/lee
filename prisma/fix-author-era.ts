import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Show current era values for authors
  const authors = await prisma.author.findMany({
    select: { slug: true, name: true, era: true },
    orderBy: { era: "asc" },
  });
  console.log("Current author eras:");
  authors.forEach((a) => console.log(`  ${a.slug} | ${a.era}`));

  // Rename "Tránsito a la Edad Moderna" → "Prerrenacimiento"
  const updated = await prisma.author.updateMany({
    where: { era: "Tránsito a la Edad Moderna" },
    data: { era: "Prerrenacimiento" },
  });
  console.log(`\nUpdated ${updated.count} author(s) era to Prerrenacimiento`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
