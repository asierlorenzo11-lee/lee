import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";
const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  ...(process.env.TURSO_AUTH_TOKEN ? { authToken: process.env.TURSO_AUTH_TOKEN } : {}),
});
const prisma = new PrismaClient({ adapter });
async function main() {
  const r = await prisma.author.updateMany({
    where: { slug: "paco-bezerra" },
    data: { portraitUrl: "/images/authors/bezerra.jpg" },
  });
  console.log("updated:", r.count);
}
main().catch(console.error).finally(() => prisma.$disconnect());
