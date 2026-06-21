import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const p = new PrismaClient({ adapter });

const artworks: Record<string, string> = {
  "romance-del-rey-moro-alhama":    "/images/artworks/romance-rey-moro-alhama.jpg",
  "romance-del-prisionero":         "/images/artworks/romance-prisionero-mayo.jpg",
  "romance-de-bernardo-del-carpio": "/images/artworks/romance-bernardo-carpio.jpg",
  "yo-soy-la-muerte-cierta":        "/images/artworks/danza-macabra-holbein.jpg",
};

async function main() {
  for (const [slug, url] of Object.entries(artworks)) {
    const res = await p.fragment.updateMany({
      where: { slug, artworkImageUrl: null },
      data: { artworkImageUrl: url },
    });
    console.log(`  ${res.count > 0 ? "✓" : "skip"} ${slug} → ${url}`);
  }

  // Update portrait for Danza de la muerte author
  const aRes = await p.author.updateMany({
    where: { slug: "anonimo-danza-de-la-muerte", portraitUrl: null },
    data: { portraitUrl: "/images/authors/anonimo-danza-de-la-muerte.jpg" },
  });
  console.log(`  ${aRes.count > 0 ? "✓" : "skip"} anonimo-danza-de-la-muerte portrait`);
}

main().catch(console.error).finally(() => p.$disconnect());
