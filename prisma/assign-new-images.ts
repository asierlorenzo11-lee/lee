import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Quevedo: La vida empieza entre lágrimas y caca
  const r1 = await prisma.fragment.update({
    where: { slug: "la-vida-empieza-entre-lagrimas-y-caca" },
    data: { artworkImageUrl: "/images/artworks/vida-empieza-lagrimas-caca.jpg" },
  });
  console.log(`✓ [${r1.slug}] → ${r1.artworkImageUrl}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
