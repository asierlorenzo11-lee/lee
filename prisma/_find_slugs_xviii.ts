import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";
const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db", authToken: process.env.TURSO_AUTH_TOKEN });
const prisma = new PrismaClient({ adapter });
async function main() {
  const names = ["Iriarte", "Samaniego", "Jovellanos", "Tirso", "Moratín"];
  for (const n of names) {
    const frags = await prisma.fragment.findMany({
      where: { work: { author: { name: { contains: n } } }, status: "published" },
      select: { slug: true, headline: true, artworkImageUrl: true, work: { select: { title: true, author: { select: { name: true } } } } },
    });
    for (const f of frags)
      console.log(`${f.artworkImageUrl ? "✓" : "✗"} [${f.work.author.name}] ${f.slug}`);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
