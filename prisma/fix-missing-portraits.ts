import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const updates = [
    {
      slug: "arcipreste-de-talavera",
      portraitUrl: "/images/authors/arcipreste-de-talavera.jpg",
      note: "Portada de la edición de 1498 del Corbacho (Wikimedia Commons)",
    },
    {
      slug: "diego-de-san-pedro",
      portraitUrl: "/images/authors/diego-de-san-pedro.jpg",
      note: "Grabado en madera de la primera edición de Cárcel de Amor (Sevilla, 1492)",
    },
    {
      slug: "gomez-manrique",
      portraitUrl: "/images/authors/gomez-manrique.jpg",
      note: "Portada del Cancionero General (Valencia, 1511), colección que recoge su obra",
    },
  ];

  for (const u of updates) {
    await prisma.author.update({
      where: { slug: u.slug },
      data: { portraitUrl: u.portraitUrl },
    });
    console.log(`✓ [${u.slug}] → ${u.portraitUrl}`);
    console.log(`    (${u.note})`);
  }

  // Verificación final
  const missing = await prisma.author.count({ where: { portraitUrl: null } });
  console.log(`\nAutores sin retrato tras la actualización: ${missing}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
