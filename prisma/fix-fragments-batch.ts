import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. "Él os casa, que no yo" — swap artwork to Las hijas del Cid (Pinazo)
  const r1 = await prisma.fragment.update({
    where: { slug: "las-bodas-de-las-hijas-del-cid" },
    data: {
      artworkImageUrl: "/images/artworks/las-hijas-del-cid-pinazo.jpg",
      artworkTitle: "Las hijas del Cid",
      artworkAuthor: "Ignacio Pinazo Camarlench",
      artworkCaption: "Ignacio Pinazo Camarlench · Las hijas del Cid (h. 1879)",
    },
  });
  console.log(`✓ [${r1.slug}] imagen → las-hijas-del-cid-pinazo.jpg`);

  // 2. "La música callada, la soledad sonora" — swap to Rossetti Beata Beatrix
  const r2 = await prisma.fragment.update({
    where: { slug: "cantico-espiritual-la-union" },
    data: {
      artworkImageUrl: "/images/artworks/rossetti-beata-beatrix.jpg",
      artworkTitle: "Beata Beatrix",
      artworkAuthor: "Dante Gabriel Rossetti",
      artworkCaption: "Dante Gabriel Rossetti · Beata Beatrix (h. 1864–1870)",
    },
  });
  console.log(`✓ [${r2.slug}] imagen → rossetti-beata-beatrix.jpg`);

  // 3. Headline: "Recluida en el convento..." → "Amor por correspondencia"
  const r3 = await prisma.fragment.update({
    where: { slug: "dona-ines-lee-la-carta" },
    data: { headline: "Amor por correspondencia" },
  });
  console.log(`✓ [${r3.slug}] headline → "${r3.headline}"`);

  // 4. Headline: "Don Juan conduce..." → "En esta apartada orilla ¿se respira mejor?"
  const r4 = await prisma.fragment.update({
    where: { slug: "don-juan-jardin-angel-de-amor" },
    data: { headline: "En esta apartada orilla ¿se respira mejor?" },
  });
  console.log(`✓ [${r4.slug}] headline → "${r4.headline}"`);

  // 5. Headline: "En el momento de morir..." → "Un verdadero ángel de amor"
  const r5 = await prisma.fragment.update({
    where: { slug: "don-juan-salvacion-final" },
    data: { headline: "Un verdadero ángel de amor" },
  });
  console.log(`✓ [${r5.slug}] headline → "${r5.headline}"`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
