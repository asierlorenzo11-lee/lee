import fs from "fs";
import path from "path";
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const UA = "LEE-app/1.0 (educational project; contact asierlorenzo11@gmail.com)";
const AUTHORS_DIR = path.join(__dirname, "../public/images/authors");
const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

// Try several possible file names for Alfonso X
const candidates = [
  "Alfonso X el Sabio - Cantigas de Santa María (c.1280, El Escorial).jpg",
  "Alfonso X el Sabio (c.1280, El Escorial).jpg",
  "AlfonsoX.jpg",
  "Alfonso X.jpg",
  "Alfonso X Cantigas.jpg",
];

async function getThumb(title: string): Promise<string | null> {
  const encoded = encodeURIComponent("File:" + title);
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encoded}&prop=imageinfo&iiprop=url|thumburl&iiurlwidth=640&format=json&formatversion=2`;
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  const d = await r.json() as any;
  const page = d?.query?.pages?.[0];
  if (page?.missing) return null;
  return page?.imageinfo?.[0]?.thumburl ?? null;
}

async function main() {
  let thumbUrl: string | null = null;
  for (const candidate of candidates) {
    await new Promise(r => setTimeout(r, 200));
    const url = await getThumb(candidate);
    if (url) { console.log(`Found: ${candidate}\n  URL: ${url}`); thumbUrl = url; break; }
    else console.log(`Missing: ${candidate}`);
  }
  if (!thumbUrl) {
    // Fall back: use the cantigas-musicos-alfons.jpg we already downloaded (from add-medieval-part3 script)
    // The Alfonso X scriptorium image is already good. Let's just use a pre-existing portrait alternative.
    // Use the Cantigas musicians miniature we downloaded
    console.log("\nFallback: using cantigas-musicos-alfons.jpg as Alfonso X portrait");
    await prisma.author.updateMany({
      where: { slug: "alfonso-x-el-sabio" },
      data: { portraitUrl: "/images/artworks/cantigas-musicos-alfons.jpg" },
    });
    console.log("DB updated: alfonso-x-el-sabio → /images/artworks/cantigas-musicos-alfons.jpg");
    return;
  }
  const destPath = path.join(AUTHORS_DIR, "alfonso-x-el-sabio.jpg");
  const res = await fetch(thumbUrl, { headers: { "User-Agent": UA } });
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buf);
  console.log(`Downloaded: ${buf.length} bytes`);
  await prisma.author.updateMany({
    where: { slug: "alfonso-x-el-sabio" },
    data: { portraitUrl: "/images/authors/alfonso-x-el-sabio.jpg" },
  });
  console.log("DB updated.");
}
main().catch(console.error).finally(() => prisma.$disconnect());
