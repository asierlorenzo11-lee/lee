import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const p = new PrismaClient({ adapter });

// Direct Wikimedia URLs (verified)
const ARTWORKS: Record<string, { url: string; localName: string }> = {
  "ir-y-quedarse-soneto-ausencia": {
    url: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Johannes_Vermeer_-_Woman_in_Blue_Reading_a_Letter_-_WGA24657.jpg",
    localName: "vermeer-woman-blue-reading-letter.jpg",
  },
  "estos-los-sauces-son": {
    url: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Jacob_van_Ruisdael_-_Three_Great_Trees_in_a_Mountainous_Landscape_with_a_River.png",
    localName: "ruisdael-three-great-trees.png",
  },
  "muerome-por-llamar-juanilla": {
    url: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Jan_Steen_005.jpg",
    localName: "jan-steen-merry-family.jpg",
  },
  "de-pura-honestidad-templo-sagrado": {
    url: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Le_Chapeau_de_Paille_by_Peter_Paul_Rubens.jpg",
    localName: "rubens-chapeau-de-paille.jpg",
  },
  "la-dulce-boca-que-a-gustar-convida": {
    url: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Waterhouse_Hylas_and_the_Nymphs_Manchester_Art_Gallery_1896.15.jpg",
    localName: "waterhouse-hylas-nymphs.jpg",
  },
  "bermejazo-platero-de-las-cumbres": {
    url: "https://upload.wikimedia.org/wikipedia/commons/7/71/Antonio_del_Pollaiolo_-_Apollo_and_Daphne_-_WGA18028.jpg",
    localName: "pollaiolo-apollo-daphne.jpg",
  },
  "fue-sueno-ayer-manana-sera-tierra": {
    url: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Pieter_Claesz_-_Vanitas_Still_Life_-_943_-_Mauritshuis.jpg",
    localName: "pieter-claesz-vanitas.jpg",
  },
  "ah-de-la-vida-nadie-me-responde": {
    url: "https://upload.wikimedia.org/wikipedia/commons/0/0d/David_Bailly_Vanitas1651.jpg",
    localName: "david-bailly-vanitas.jpg",
  },
  "mire-los-muros-de-la-patria-mia": {
    url: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Hubert_Robert_-_Die_Grand_Galerie_des_Louvre.jpg",
    localName: "hubert-robert-grand-galerie.jpg",
  },
  "es-hielo-abrasador-es-fuego-helado": {
    url: "https://upload.wikimedia.org/wikipedia/commons/8/83/Angelo_Bronzino_-_Venus%2C_Cupid%2C_Folly_and_Time_-_National_Gallery%2C_London.jpg",
    localName: "bronzino-venus-cupid-folly-time.jpg",
  },
  "la-vida-empieza-entre-lagrimas-y-caca": {
    url: "https://upload.wikimedia.org/wikipedia/commons/d/db/Pieter_Bruegel_the_Elder_-_The_Misanthrope_-_WGA3521.jpg",
    localName: "bruegel-misanthrope.jpg",
  },
  "ay-misero-de-mi-monologotorre": {
    url: "https://upload.wikimedia.org/wikipedia/commons/8/8d/The_Round_Tower%2C_from_%27Carceri_d%27invenzione%27_%28Imaginary_Prisons%29_MET_DP828191.jpg",
    localName: "piranesi-round-tower.jpg",
  },
  "donde-se-hallara-un-hombre-verdadero": {
    url: "https://upload.wikimedia.org/wikipedia/commons/2/20/Johannes_Vermeer_-_Lady_Writing_a_Letter_with_Her_Maid_-_WGA24696.jpg",
    localName: "vermeer-lady-writing-letter-maid.jpg",
  },
  "casilda-mientras-no-puedas": {
    url: "https://upload.wikimedia.org/wikipedia/commons/a/af/Pieter_Bruegel_the_Elder_-_Peasant_Wedding_-_Google_Art_Project.jpg",
    localName: "bruegel-peasant-wedding.jpg",
  },
  "yo-soy-un-hombre-villana-casta": {
    url: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Velazquez-The_Surrender_of_Breda.jpg",
    localName: "velazquez-surrender-breda.jpg",
  },
  "yo-senor-soy-de-segovia": {
    url: "https://upload.wikimedia.org/wikipedia/commons/1/14/Bartolom%C3%A9_Esteban_Murillo_-_Joven_mendigo_%281645-50%29.jpg",
    localName: "murillo-joven-mendigo.jpg",
  },
  "purpureas-rosas-sobre-galatea": {
    url: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Raffael_012.jpg",
    localName: "raffael-triumph-galatea.jpg",
  },
  "era-del-anno-la-estacion-florida": {
    url: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Botticelli-primavera.jpg",
    localName: "botticelli-primavera.jpg",
  },
};

function download(url: string, dest: string, attempt = 1): Promise<void> {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith("https") ? https : http;
    const req = proto.get(url, { headers: { "User-Agent": "LEE-Educational/1.0" } }, (res) => {
      if ([301, 302, 307, 308].includes(res.statusCode!)) {
        return download(res.headers.location!, dest, attempt).then(resolve).catch(reject);
      }
      if (res.statusCode === 429) {
        if (attempt > 4) { reject(new Error(`429 Too Many Requests`)); return; }
        console.log(`    ⏳ 429 – esperando ${attempt * 10}s...`);
        setTimeout(() => download(url, dest, attempt + 1).then(resolve).catch(reject), attempt * 10000);
        return;
      }
      if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
      const ws = fs.createWriteStream(dest);
      res.pipe(ws);
      ws.on("finish", resolve);
      ws.on("error", reject);
    });
    req.on("error", reject);
  });
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const artDir = path.resolve("public/images/artworks");
  if (!fs.existsSync(artDir)) fs.mkdirSync(artDir, { recursive: true });

  for (const [slug, art] of Object.entries(ARTWORKS)) {
    const fragment = await p.fragment.findFirst({ where: { slug }, select: { id: true, artworkImageUrl: true } });
    if (!fragment) { console.log(`  ⚠ fragmento no encontrado: ${slug}`); continue; }
    if (fragment.artworkImageUrl) { console.log(`  skip (ya tiene imagen): ${slug}`); continue; }

    const destPath = path.join(artDir, art.localName);
    const publicUrl = `/images/artworks/${art.localName}`;

    if (fs.existsSync(destPath)) {
      console.log(`  ✓ (archivo ya existe): ${art.localName}`);
      await p.fragment.update({ where: { id: fragment.id }, data: { artworkImageUrl: publicUrl } });
      continue;
    }

    console.log(`  ↓ ${slug}`);
    try {
      await download(art.url, destPath);
      await p.fragment.update({ where: { id: fragment.id }, data: { artworkImageUrl: publicUrl } });
      console.log(`    ✓ ${art.localName}`);
    } catch (e) {
      console.log(`    ✗ ${e}`);
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
    }

    await sleep(2500); // respeta el rate limit de Wikimedia
  }

  console.log("\n✅ Imágenes procesadas.");
}

main().catch(console.error).finally(() => p.$disconnect());
