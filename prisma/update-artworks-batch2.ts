import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

const UPDATES: Record<string, string> = {
  "calisto-es-rechazado-por-melibea": "/images/artworks/calisto-es-rechazado-por-melibea.jpg",
  "procesion-satirica-a-felipe-iv":   "/images/artworks/procesion-satirica-a-felipe-iv.jpg",
  "mi-agravio-mudo-mi-ser":           "/images/artworks/mi-agravio-mudo-mi-ser.jpg",
};

async function main() {
  for (const [slug, imageUrl] of Object.entries(UPDATES)) {
    const frag = await prisma.fragment.findUnique({ where: { slug } });
    if (!frag) { console.warn(`⚠ No encontrado: ${slug}`); continue; }
    await prisma.fragment.update({
      where: { id: frag.id },
      data: { artworkImageUrl: imageUrl, artworkTitle: null, artworkAuthor: null, artworkCaption: null },
    });
    console.log(`✓ ${slug}`);
  }
  console.log("\nListo.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
