import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  const eras = ["Edad Media", "Modernismo", "Generación del 27"];
  for (const era of eras) {
    const frags = await prisma.fragment.findMany({
      where: { status: "published", artworkImageUrl: { not: null }, work: { era } },
      select: { artworkImageUrl: true, artworkTitle: true, headline: true },
    });
    console.log(`\n── ${era} (${frags.length} con imagen) ──`);
    frags.forEach(f => console.log(`  ${f.artworkTitle ?? "?"} → ${f.artworkImageUrl}`));
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
