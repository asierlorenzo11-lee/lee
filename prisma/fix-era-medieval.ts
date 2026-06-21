import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const p = new PrismaClient({ adapter });

// Fix inconsistency: works/authors with era="Medieval" should be "Edad Media"
async function main() {
  const workRes = await p.work.updateMany({ where: { era: "Medieval" }, data: { era: "Edad Media" } });
  console.log(`Works updated: ${workRes.count}`);

  const authorRes = await p.author.updateMany({ where: { era: "Medieval" }, data: { era: "Edad Media" } });
  console.log(`Authors updated: ${authorRes.count}`);

  // Verify
  const check = await p.work.findMany({ where: { era: "Edad Media" }, select: { slug: true, era: true } });
  console.log("\nWorks now in 'Edad Media':", check.map(w => w.slug).join(", "));
}

main().catch(console.error).finally(() => p.$disconnect());
