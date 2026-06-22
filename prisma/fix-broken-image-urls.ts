import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. cantar-de-mio-cid-folio-bodas: .jpg → .jfif
  const r1 = await prisma.fragment.updateMany({
    where: { artworkImageUrl: "/images/artworks/cantar-de-mio-cid-folio-bodas.jpg" },
    data:  { artworkImageUrl: "/images/artworks/cantar-de-mio-cid-folio-bodas.jfif" },
  });
  console.log(`✓ cantar-de-mio-cid-folio-bodas  .jpg→.jfif  (${r1.count} filas)`);

  // 2. mezquita-cordoba-arcos: .jpg → .png
  const r2 = await prisma.fragment.updateMany({
    where: { artworkImageUrl: "/images/artworks/mezquita-cordoba-arcos.jpg" },
    data:  { artworkImageUrl: "/images/artworks/mezquita-cordoba-arcos.png" },
  });
  console.log(`✓ mezquita-cordoba-arcos          .jpg→.png   (${r2.count} filas)`);

  // 3. bruegel-misanthrope.jpg: archivo inexistente → null
  const r3 = await prisma.fragment.updateMany({
    where: { artworkImageUrl: "/images/artworks/bruegel-misanthrope.jpg" },
    data:  { artworkImageUrl: null, artworkTitle: null, artworkAuthor: null, artworkCaption: null },
  });
  console.log(`✓ bruegel-misanthrope             eliminado   (${r3.count} filas)`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
