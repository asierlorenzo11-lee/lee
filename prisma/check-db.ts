import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const authors = await prisma.author.findMany({
    select: { slug: true, name: true },
    orderBy: { birthYear: "asc" },
  });
  console.log("AUTHORS:", JSON.stringify(authors, null, 2));

  const works = await prisma.work.findMany({
    select: { slug: true, title: true },
    orderBy: { year: "asc" },
  });
  console.log("WORKS:", JSON.stringify(works, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
