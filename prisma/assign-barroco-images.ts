import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const p = new PrismaClient({ adapter });

const MAP: Record<string, string> = {
  "ir-y-quedarse-soneto-ausencia":          "/images/artworks/vermeer-woman-blue-reading-letter.jpg",
  "estos-los-sauces-son":                   "/images/artworks/ruisdael-three-great-trees.jpg",
  "muerome-por-llamar-juanilla":            "/images/artworks/jan-steen-merry-family.jpg",
  "de-pura-honestidad-templo-sagrado":      "/images/artworks/rubens-chapeau-de-paille.jpg",
  "la-dulce-boca-que-a-gustar-convida":     "/images/artworks/waterhouse-hylas-nymphs.jpg",
  "bermejazo-platero-de-las-cumbres":       "/images/artworks/pollaiolo-apollo-daphne.jpg",
  "fue-sueno-ayer-manana-sera-tierra":      "/images/artworks/pieter-claesz-vanitas.jpg",
  "ah-de-la-vida-nadie-me-responde":        "/images/artworks/david-bailly-vanitas.jpg",
  "mire-los-muros-de-la-patria-mia":        "/images/artworks/hubert-robert-grand-galerie.jpg",
  "es-hielo-abrasador-es-fuego-helado":     "/images/artworks/bronzino-venus-cupid-folly-time.jpg",
  "la-vida-empieza-entre-lagrimas-y-caca":  "/images/artworks/bruegel-misanthrope.jpg",
  "ay-misero-de-mi-monologotorre":          "/images/artworks/piranesi-round-tower.jpg",
  "donde-se-hallara-un-hombre-verdadero":   "/images/artworks/vermeer-lady-writing-letter-maid.jpg",
  "casilda-mientras-no-puedas":             "/images/artworks/bruegel-peasant-wedding.jpg",
  "yo-soy-un-hombre-villana-casta":         "/images/artworks/velazquez-surrender-breda.jpg",
  "yo-senor-soy-de-segovia":                "/images/artworks/murillo-joven-mendigo.jpg",
  "purpureas-rosas-sobre-galatea":          "/images/artworks/raffael-triumph-galatea.jpg",
  "era-del-anno-la-estacion-florida":       "/images/artworks/botticelli-primavera.jpg",
};

async function main() {
  for (const [slug, url] of Object.entries(MAP)) {
    const f = await p.fragment.findFirst({ where: { slug }, select: { id: true, artworkImageUrl: true } });
    if (!f) { console.log(`  ⚠ no found: ${slug}`); continue; }
    if (f.artworkImageUrl === url) { console.log(`  skip: ${slug}`); continue; }
    await p.fragment.update({ where: { id: f.id }, data: { artworkImageUrl: url } });
    console.log(`  ✓ ${slug}`);
  }
  console.log("✅ BD actualizada.");
}

main().catch(console.error).finally(() => p.$disconnect());
