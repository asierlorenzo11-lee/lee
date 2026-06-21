import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  const { count } = await prisma.work.updateMany({
    where: { era: "Tránsito a la Edad Moderna" },
    data: { era: "Prerrenacimiento" },
  });
  console.log(`✓ ${count} obra(s) renombradas → "Prerrenacimiento"`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
