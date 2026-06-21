import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  const eras = await prisma.work.findMany({
    where: { era: { not: null } },
    select: { era: true },
    distinct: ["era"],
    orderBy: { year: "asc" },
  });
  console.log(eras.map((x) => x.era));
}
main().catch(console.error).finally(() => prisma.$disconnect());
