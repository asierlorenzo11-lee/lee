import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";
import { existsSync } from "fs";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db", authToken: process.env.TURSO_AUTH_TOKEN });
const prisma = new PrismaClient({ adapter });

async function main() {
  const authors = await prisma.author.findMany({
    select: { slug: true, name: true, portraitUrl: true },
    orderBy: { name: "asc" },
  });

  console.log("=== RETRATOS ROTOS (archivo no existe) ===");
  const broken: typeof authors = [];
  for (const a of authors) {
    if (!a.portraitUrl) {
      console.log(`  ✗ NULL     [${a.slug}] ${a.name}`);
      broken.push(a);
      continue;
    }
    // portraitUrl is like /images/authors/foo.jpg — map to public/
    const filePath = `public${a.portraitUrl}`;
    if (!existsSync(filePath)) {
      console.log(`  ✗ MISSING  [${a.slug}] ${a.name} → ${a.portraitUrl}`);
      broken.push(a);
    }
  }

  console.log("\n=== RETRATOS OK ===");
  for (const a of authors) {
    if (broken.includes(a)) continue;
    console.log(`  ✓ [${a.slug}] ${a.name}`);
  }

  console.log(`\nResumen: ${broken.length} rotos, ${authors.length - broken.length} OK`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
