import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import fs from "fs";
import path from "path";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // All used artwork URLs in DB
  const fragments = await prisma.fragment.findMany({
    where: { status: "published", artworkImageUrl: { not: null } },
    select: { artworkImageUrl: true },
  });
  const usedUrls = new Set(fragments.map((f) => f.artworkImageUrl!));

  // All files in the artworks folder
  const artworksDir = path.join(__dirname, "../public/images/artworks");
  const files = fs.readdirSync(artworksDir).filter((f) => f.match(/\.(jpg|png|webp)$/));

  console.log(`\nTotal archivos en artworks/: ${files.length}`);
  console.log(`Total URLs únicas en uso: ${usedUrls.size}`);

  const unused: string[] = [];
  for (const file of files) {
    const url = `/images/artworks/${file}`;
    if (!usedUrls.has(url)) {
      unused.push(file);
    }
  }

  console.log(`\n=== SIN USAR (${unused.length}) ===`);
  unused.forEach((f) => console.log(`  /images/artworks/${f}`));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
