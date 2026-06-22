import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

// Fragmentos cuya extensión real es .webp (archivo renombrado)
const FIXES: Record<string, string> = {
  "trotaconventos":                          "/images/artworks/trotaconventos.webp",
  "la-muerte-de-elisa":                      "/images/artworks/la-muerte-de-elisa.webp",
  "negra-sombra":                            "/images/artworks/negra-sombra.webp",
  "mire-los-muros-de-la-patria-mia":         "/images/artworks/mire-los-muros.webp",
  "calisto-es-rechazado-por-melibea":        "/images/artworks/calisto-es-rechazado-por-melibea.webp",
  "rima-vii":                                "/images/artworks/rima-vii.webp",
};

async function main() {
  for (const [slug, url] of Object.entries(FIXES)) {
    const frag = await prisma.fragment.findUnique({ where: { slug } });
    if (!frag) { console.warn(`⚠ No encontrado: ${slug}`); continue; }
    await prisma.fragment.update({ where: { id: frag.id }, data: { artworkImageUrl: url } });
    console.log(`✓ ${slug} → ${url}`);
  }
  console.log("\nListo.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
