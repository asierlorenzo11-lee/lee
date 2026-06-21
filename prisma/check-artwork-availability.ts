import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import fs from "fs";
import path from "path";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const p = new PrismaClient({ adapter });

const PENDING_SLUGS = [
  "ir-y-quedarse-soneto-ausencia",
  "estos-los-sauces-son",
  "muerome-por-llamar-juanilla",
  "de-pura-honestidad-templo-sagrado",
  "la-dulce-boca-que-a-gustar-convida",
  "bermejazo-platero-de-las-cumbres",
  "fue-sueno-ayer-manana-sera-tierra",
  "ah-de-la-vida-nadie-me-responde",
  "mire-los-muros-de-la-patria-mia",
  "la-vida-empieza-entre-lagrimas-y-caca",
  "ay-misero-de-mi-monologotorre",
  "donde-se-hallara-un-hombre-verdadero",
  "yo-senor-soy-de-segovia",
  "purpureas-rosas-sobre-galatea",
];

async function main() {
  // Get all artworkImageUrls already in use
  const used = await p.fragment.findMany({
    where: { artworkImageUrl: { not: null } },
    select: { artworkImageUrl: true, slug: true },
  });
  const usedSet = new Set(used.map(f => f.artworkImageUrl!));

  // List all files in artworks dir
  const artDir = path.resolve("public/images/artworks");
  const allFiles = fs.readdirSync(artDir).filter(f => f.match(/\.(jpg|jpeg|png|webp)$/i));

  // Files on disk not yet assigned
  const freeFiles = allFiles.filter(f => !usedSet.has(`/images/artworks/${f}`));

  console.log(`\n=== ARCHIVOS LIBRES (${freeFiles.length}) ===`);
  freeFiles.sort().forEach(f => console.log(`  ${f}`));

  console.log(`\n=== FRAGMENTOS SIN IMAGEN EN DISCO ===`);
  for (const slug of PENDING_SLUGS) {
    const f = await p.fragment.findFirst({ where: { slug }, select: { artworkImageUrl: true } });
    const assigned = f?.artworkImageUrl ?? "(nulo)";
    const filename = assigned.replace("/images/artworks/", "");
    const onDisk = fs.existsSync(path.join(artDir, filename));
    console.log(`  ${onDisk ? "✓" : "✗"} ${slug}`);
    console.log(`    → ${assigned}`);
  }
}

main().catch(console.error).finally(() => p.$disconnect());
