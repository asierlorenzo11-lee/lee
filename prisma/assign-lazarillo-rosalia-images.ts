import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

const artworks: Record<string, { artworkImageUrl: string; artworkTitle: string; artworkAuthor: string | null; artworkCaption: string | null }> = {
  "prologo-honra-cria-las-artes": {
    artworkImageUrl: "/images/artworks/lazarillo-prologo.jpg",
    artworkTitle: "Muchacho pícaro",
    artworkAuthor: null,
    artworkCaption: null,
  },
  "el-arca-del-pan": {
    artworkImageUrl: "/images/artworks/lazarillo-arca-del-pan.jpg",
    artworkTitle: "El arca del pan",
    artworkAuthor: null,
    artworkCaption: null,
  },
  "la-negra-honra": {
    artworkImageUrl: "/images/artworks/lazarillo-escudero-honra.avif",
    artworkTitle: "Las andanzas de Lázaro",
    artworkAuthor: null,
    artworkCaption: null,
  },
  "lazaro-pregonero": {
    artworkImageUrl: "/images/artworks/lazarillo-pregonero.jpg",
    artworkTitle: "Vida de Lázaro de Tormes",
    artworkAuthor: null,
    artworkCaption: null,
  },
  "adios-rios-adios-fontes": {
    artworkImageUrl: "/images/artworks/rosalia-adios-rios.jpg",
    artworkTitle: "O emigrante",
    artworkAuthor: "Alfonso Daniel Rodríguez Castelao, 1916",
    artworkCaption: "O emigrante · Castelao (1916)",
  },
  "yo-no-se-lo-que-busco": {
    artworkImageUrl: "/images/artworks/rosalia-orillas-del-sar.jpg",
    artworkTitle: "Christina's World",
    artworkAuthor: "Andrew Wyeth, 1948",
    artworkCaption: "Christina's World · Andrew Wyeth (1948), MoMA",
  },
  "las-literatas-carta-a-eduarda": {
    artworkImageUrl: "/images/artworks/rosalia-las-literatas.jpg",
    artworkTitle: "El talento servido en bandeja",
    artworkAuthor: null,
    artworkCaption: null,
  },
};

async function main() {
  for (const [slug, data] of Object.entries(artworks)) {
    const r = await prisma.fragment.update({ where: { slug }, data });
    console.log(`✓ ${r.slug} → ${r.artworkImageUrl}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
