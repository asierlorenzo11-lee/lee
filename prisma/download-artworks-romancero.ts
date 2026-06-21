import fs from "fs";
import path from "path";

const UA = "LEE-app/1.0 (educational project; contact asierlorenzo11@gmail.com)";
const ARTWORKS_DIR = path.join(__dirname, "../public/images/artworks");
const AUTHORS_DIR = path.join(__dirname, "../public/images/authors");

async function getThumb(title: string): Promise<string | null> {
  const encoded = encodeURIComponent("File:" + title);
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encoded}&prop=imageinfo&iiprop=url|thumburl&iiurlwidth=700&format=json&formatversion=2`;
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  const d = await r.json() as any;
  const page = d?.query?.pages?.[0];
  if (page?.missing) return null;
  return page?.imageinfo?.[0]?.thumburl ?? null;
}

async function search(query: string): Promise<string | null> {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&srsearch=${encodeURIComponent(query)}&srlimit=5&format=json&formatversion=2`;
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  const d = await r.json() as any;
  const hits: any[] = d?.query?.search ?? [];
  return hits.length > 0 ? hits[0].title.replace("File:", "") : null;
}

async function download(url: string, dest: string): Promise<number> {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 5000) throw new Error(`Too small: ${buf.length} bytes`);
  fs.writeFileSync(dest, buf);
  return buf.length;
}

async function fetchOne(candidates: string[], destFile: string): Promise<boolean> {
  for (const c of candidates) {
    await new Promise(r => setTimeout(r, 300));
    const thumb = await getThumb(c);
    if (thumb) {
      try {
        const bytes = await download(thumb, destFile);
        console.log(`  ✓ ${path.basename(destFile)} (${Math.round(bytes/1024)} KB) ← ${c}`);
        return true;
      } catch (e: any) { console.log(`  ✗ download failed: ${e.message}`); }
    } else { console.log(`  missing: ${c}`); }
  }
  return false;
}

async function fetchSearch(query: string, destFile: string): Promise<boolean> {
  await new Promise(r => setTimeout(r, 300));
  const title = await search(query);
  if (!title) { console.log(`  no search result for: ${query}`); return false; }
  console.log(`  search → ${title}`);
  const thumb = await getThumb(title);
  if (!thumb) { console.log(`  no thumburl for: ${title}`); return false; }
  try {
    const bytes = await download(thumb, destFile);
    console.log(`  ✓ ${path.basename(destFile)} (${Math.round(bytes/1024)} KB)`);
    return true;
  } catch (e: any) { console.log(`  ✗ download failed: ${e.message}`); return false; }
}

async function main() {
  // 1. Romance del rey moro — Pradilla's "La rendición de Granada"
  console.log("\nromance-rey-moro-alhama.jpg");
  const ok1 = await fetchOne([
    "La rendición de Granada.jpg",
    "Rendicion de Granada Pradilla.jpg",
    "Francisco Pradilla - La rendición de Granada.jpg",
    "Rendicion de Granada.jpg",
  ], path.join(ARTWORKS_DIR, "romance-rey-moro-alhama.jpg"))
  || await fetchSearch("Pradilla rendicion Granada 1882", path.join(ARTWORKS_DIR, "romance-rey-moro-alhama.jpg"));
  if (!ok1) console.log("  FAILED: romance-rey-moro-alhama");

  // 2. Romance del prisionero — Très Riches Heures May calendar page
  console.log("\nromance-prisionero-mayo.jpg");
  const ok2 = await fetchOne([
    "Les Très Riches Heures du duc de Berry - mai.jpg",
    "Tres Riches Heures mai.jpg",
    "Très Riches Heures du duc de Berry mai.jpg",
    "Riches heures mai.jpg",
  ], path.join(ARTWORKS_DIR, "romance-prisionero-mayo.jpg"))
  || await fetchSearch("tres riches heures may calendar Limbourg", path.join(ARTWORKS_DIR, "romance-prisionero-mayo.jpg"));
  if (!ok2) console.log("  FAILED: romance-prisionero-mayo");

  // 3. Romance de Bernardo del Carpio — medieval knight on horseback
  console.log("\nromance-bernardo-carpio.jpg");
  const ok3 = await fetchOne([
    "Knight-errant (medieval) by Léon Bakst (1896).jpg",
    "Codex Manesse Walther von Klingen.jpg",
    "Codex Manesse Hartmann von Aue.jpg",
    "Illuminated manuscript knight horseback medieval.jpg",
  ], path.join(ARTWORKS_DIR, "romance-bernardo-carpio.jpg"))
  || await fetchSearch("Codex Manesse knight horseback tournament", path.join(ARTWORKS_DIR, "romance-bernardo-carpio.jpg"));
  if (!ok3) console.log("  FAILED: romance-bernardo-carpio");

  // 4. Danza de la muerte — Holbein or Schedel Chronicle woodcut
  console.log("\ndanza-macabra-holbein.jpg");
  const ok4 = await fetchOne([
    "Hans Holbein d. J. 008.jpg",
    "Holbein Danse Macabre The Queen.jpg",
    "Holbein's Dance of Death - The Queen.jpg",
    "Danse macabre by Hans Holbein the Younger.jpg",
    "Totentanz Holbein.jpg",
    "Schedel Weltchronik Totentanz.jpg",
    "Schedel'sche Weltchronik - Totentanz.jpg",
  ], path.join(ARTWORKS_DIR, "danza-macabra-holbein.jpg"))
  || await fetchSearch("Holbein Dance of Death woodcut 1538", path.join(ARTWORKS_DIR, "danza-macabra-holbein.jpg"));
  if (!ok4) console.log("  FAILED: danza-macabra-holbein");

  // 5. Portrait for anonimo-danza-de-la-muerte — Danza macabra illustration
  console.log("\nanonimo-danza-de-la-muerte.jpg (portrait)");
  const ok5 = await fetchOne([
    "Bernt Notke - Danse macabre (fragment).jpg",
    "Bernt Notke Totentanz.jpg",
    "Danse macabre Bernt Notke Tallinn.jpg",
    "Danse macabre of Lübeck - woman.jpg",
  ], path.join(AUTHORS_DIR, "anonimo-danza-de-la-muerte.jpg"))
  || await fetchSearch("Bernt Notke danse macabre medieval painting", path.join(AUTHORS_DIR, "anonimo-danza-de-la-muerte.jpg"));
  if (!ok5) console.log("  FAILED: anonimo-danza-de-la-muerte portrait");
}

main().catch(console.error);
