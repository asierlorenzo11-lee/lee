import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const a = await prisma.author.findUnique({
    where: { slug: "angel-de-saavedra-duque-de-rivas" },
  });
  console.log(JSON.stringify(a, null, 2));
  const works = await prisma.work.findMany({
    where: { author: { slug: "angel-de-saavedra-duque-de-rivas" } },
    select: { slug: true, title: true },
  });
  console.log("Obras:", JSON.stringify(works));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
