import fs from "fs";
import path from "path";
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const UA = "LEE-app/1.0 (educational project; contact asierlorenzo11@gmail.com)";
const AUTHORS_DIR = path.join(__dirname, "../public/images/authors");
const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

async function getThumbUrl(fileTitle: string): Promise<string | null> {
  const encoded = encodeURIComponent("File:" + fileTitle);
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encoded}&prop=imageinfo&iiprop=url|thumburl&iiurlwidth=640&format=json&formatversion=2`;
  const res = await fetch(apiUrl, { headers: { "User-Agent": UA } });
  if (!res.ok) return null;
  const data = await res.json() as any;
  const page = data?.query?.pages?.[0];
  if (page?.missing) return null;
  return page?.imageinfo?.[0]?.thumburl ?? page?.imageinfo?.[0]?.url ?? null;
}

async function downloadFile(url: string, dest: string): Promise<void> {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
}

async function main() {
  const todo = [
    { authorSlug: "garci-rodriguez-de-montalvo", file: "garci-rodriguez-de-montalvo.jpg", title: "Amadís de Gaula (Zaragoza, 1508).jpg" },
    { authorSlug: "anonimo-cancionero-medieval", file: "anonimo-cancionero-medieval.jpg", title: "Cancionero general.jpg" },
    // Alfonso X portrait is already a remote URL — convert to local copy
    { authorSlug: "alfonso-x-el-sabio", file: "alfonso-x-el-sabio.jpg", title: "Alfonso X el Sabio - Cantigas de Santa María (c.1280, El Escorial).jpg" },
  ];

  for (const item of todo) {
    const destPath = path.join(AUTHORS_DIR, item.file);
    const localUrl = `/images/authors/${item.file}`;

    // Download if not present
    if (!fs.existsSync(destPath)) {
      const thumbUrl = await getThumbUrl(item.title);
      if (!thumbUrl) { console.error(`  NO URL: ${item.file}`); continue; }
      await new Promise(r => setTimeout(r, 300));
      await downloadFile(thumbUrl, destPath);
      const size = fs.statSync(destPath).size;
      if (size < 5000) { fs.unlinkSync(destPath); console.error(`  SMALL: ${item.file}`); continue; }
      console.log(`  DL OK: ${item.file} (${Math.round(size/1024)} KB)`);
    } else {
      console.log(`  EXISTS: ${item.file}`);
    }

    // Update DB
    const result = await prisma.author.updateMany({
      where: { slug: item.authorSlug },
      data: { portraitUrl: localUrl },
    });
    console.log(`  DB: ${item.authorSlug} → ${localUrl} (updated: ${result.count})`);
  }

  console.log("\n✅ Retratos completados.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
