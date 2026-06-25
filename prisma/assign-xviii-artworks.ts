import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

const updates: Record<
  string,
  { artworkImageUrl: string; artworkTitle: string; artworkAuthor: string | null; artworkCaption: string | null }
> = {
  "feijoo-dictados-aulas": {
    artworkImageUrl: "/images/artworks/feijoo-dispendio-tiempo.jpg",
    artworkTitle: "¿Si sabrá más el discípulo?",
    artworkAuthor: "Francisco de Goya, 1799",
    artworkCaption: "Los Caprichos, n.º 37 · Francisco de Goya (1799)",
  },
  "feijoo-atraso-cientifico": {
    artworkImageUrl: "/images/artworks/feijoo-atraso-cientifico.jpg",
    artworkTitle: "El sueño de la razón produce monstruos",
    artworkAuthor: "Francisco de Goya, 1799",
    artworkCaption: "Los Caprichos, n.º 43 · Francisco de Goya (1799)",
  },
  "arroyal-casa-vieja": {
    artworkImageUrl: "/images/artworks/arroyal-casa-vieja.jpg",
    artworkTitle: "¿Qué alboroto es éste?",
    artworkAuthor: "Francisco de Goya, c. 1820-1823",
    artworkCaption: "Los desastres de la guerra, n.º 65 · Francisco de Goya",
  },
  "carta-xii-cadalso": {
    artworkImageUrl: "/images/artworks/cadalso-cochero-noble.jpg",
    artworkTitle: "El cacharrero",
    artworkAuthor: "Francisco de Goya, 1779",
    artworkCaption: "El cacharrero · Francisco de Goya (1779), Museo del Prado",
  },
  "carta-xiii-cadalso": {
    artworkImageUrl: "/images/artworks/cadalso-noble-inutil.jpg",
    artworkTitle: "Hasta su abuelo",
    artworkAuthor: "Francisco de Goya, 1799",
    artworkCaption: "Los Caprichos, n.º 39 · Francisco de Goya (1799)",
  },
  "jovellanos-rios-circulacion": {
    artworkImageUrl: "/images/artworks/jovellanos-rios-circulacion.jpg",
    artworkTitle: "Mapa antiguo de España",
    artworkAuthor: null,
    artworkCaption: null,
  },
  "jovellanos-instruccion-publica": {
    artworkImageUrl: "/images/artworks/jovellanos-instruccion-publica.jpg",
    artworkTitle: "Un experimento con un pájaro en la máquina neumática",
    artworkAuthor: "Joseph Wright of Derby, 1768",
    artworkCaption: "Joseph Wright of Derby (1768), National Gallery, Londres",
  },
};

async function main() {
  for (const [slug, data] of Object.entries(updates)) {
    const r = await prisma.fragment.update({ where: { slug }, data });
    console.log(`✓ ${r.slug} → ${r.artworkImageUrl}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
