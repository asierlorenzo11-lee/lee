import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";
const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db", authToken: process.env.TURSO_AUTH_TOKEN });
const prisma = new PrismaClient({ adapter });
async function main() {
  const f = await prisma.fragment.findUnique({
    where: { slug: "neruda-oda-manrique" },
    select: {
      text: true,
      annotations: { select: { type: true, order: true, anchorStart: true, anchorEnd: true }, orderBy: { order: "asc" } },
    },
  });
  if (!f) { console.log("Fragment not found"); return; }
  console.log("TEXT:\n" + f.text);
  console.log("\nANOTACIONES:");
  for (const a of f.annotations) {
    const snippet = f.text.slice(a.anchorStart ?? 0, a.anchorEnd ?? 0);
    console.log(`  [${a.type}] order=${a.order} anchor="${snippet}"`);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
