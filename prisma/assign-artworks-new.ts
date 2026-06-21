/** Assign artworkImageUrl to the 17 new medieval fragments */
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

const assignments: Record<string, string> = {
  // Jarchas
  "tanto-amare":           "/images/artworks/alhambra-leones.jpg",
  "non-dormiray-mamma":    "/images/artworks/andalus-cantigas-musicos.jpg",
  "que-fare-mamma":        "/images/artworks/mezquita-cordoba-arcos.jpg",
  // Cantigas
  "de-que-morredes-filha": "/images/artworks/pergamino-vindel.jpg",
  "quantas-sabedes-amar-amigo": "/images/artworks/aivazovsky-mar-negro.jpg",
  // Villancicos
  "ya-cantan-los-gallos":  "/images/artworks/bruegel-danza-gallos.jpg",
  "al-alba-venid":         "/images/artworks/tres-riches-heures-enero.jpg",
  "en-avila-mis-ojos":     "/images/artworks/avila-murallas-vista.jpg",
  "gritos-daba-la-morenita": "/images/artworks/olivos-jaen.jpg",
  // Alfonso X
  "prologo-ochava-esfera": "/images/artworks/cantigas-musicos-alfons.jpg",
  "prologo-lapidario":     "/images/artworks/codex-manesse-caballero.jpg",
  // Amadís
  "el-endriago-amadis":    "/images/artworks/uccello-san-jorge-dragon.jpg",
  // Sendebar
  "prologo-sendebar":      "/images/artworks/kalila-dimna-sabios.jpg",
  // Conde Lucanor
  "la-golondrina-y-el-lino": "/images/artworks/golondrina-hirundo-rustica.jpg",
  "dona-truana":           "/images/artworks/aertsen-cocinera.jpg",
  "el-hombre-y-los-altramuces": "/images/artworks/murillo-ninos-dados.jpg",
  "el-cazador-de-perdices": "/images/artworks/brueghel-caceria-pajaros.jpg",
};

async function main() {
  let ok = 0, notFound = 0;
  for (const [slug, url] of Object.entries(assignments)) {
    const result = await prisma.fragment.updateMany({
      where: { slug, artworkImageUrl: null },
      data: { artworkImageUrl: url },
    });
    if (result.count > 0) {
      console.log(`  ✓ ${slug}`);
      ok++;
    } else {
      const exists = await prisma.fragment.findUnique({ where: { slug }, select: { artworkImageUrl: true } });
      if (!exists) { console.log(`  ✗ NOT FOUND: ${slug}`); notFound++; }
      else { console.log(`  (ya tiene imagen) ${slug}: ${exists.artworkImageUrl}`); }
    }
  }
  console.log(`\n✅ Asignados: ${ok}  No encontrados: ${notFound}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
