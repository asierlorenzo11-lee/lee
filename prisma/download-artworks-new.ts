/** Download artworks for new medieval fragments via Wikimedia API */
import fs from "fs";
import path from "path";

const ARTWORKS_DIR = path.join(__dirname, "../public/images/artworks");
const UA = "LEE-app/1.0 (educational project; contact asierlorenzo11@gmail.com)";

// dest filename → Commons file title (no "File:" prefix)
const fileTitles: Record<string, string> = {
  // Jarchas
  "alhambra-leones.jpg": "Alhambra Lions Court DSCF8670.jpg",
  "mezquita-cordoba-arcos.jpg": "Mezquita cordoba arco interior.jpg",
  "andalus-cantigas-musicos.jpg": "Cantigas de Santa Maria, Musician's Codex, page 209R.jpg",
  // Cantigas
  "pergamino-vindel.jpg": "2018. Pergamiño Vindel '01.jpg",
  "aivazovsky-mar-negro.jpg": "Aivazovsky - The Black Sea.jpg",
  // Villancicos
  "tres-riches-heures-enero.jpg": "Les Très Riches Heures du duc de Berry - Janvier.jpg",
  "avila-murallas-vista.jpg": "Murallas de Ávila - 01.jpg",
  "olivos-jaen.jpg": "The Endless Olive Orchards of Jaen - panoramio.jpg",
  "bruegel-danza-gallos.jpg": "Pieter Aertsen 003.jpg",
  // Alfonso X
  "cantigas-musicos-alfons.jpg": "Añafiles en las Cantigas de Alfonso X el Sabio.jpg",
  "codex-manesse-caballero.jpg": "Codex Manesse Heinrich von Breslau.jpg",
  // Amadís
  "uccello-san-jorge-dragon.jpg": "Paolo Uccello 042.jpg",
  // Sendebar
  "kalila-dimna-sabios.jpg": "Court of Bahram-Shah of Ghazna, Kalila and Dimna, folio 6a, end of 13th century, Topkapi H.363.jpg",
  // Conde Lucanor
  "golondrina-hirundo-rustica.jpg": "Hirundo rustica Ormoz.jpg",
  "aertsen-cocinera.jpg": "Pieter Aertsen - The Cook - Google Art Project.jpg",
  "murillo-ninos-dados.jpg": "Bartolomé Esteban Perez Murillo - Young Boys Playing Dice - WGA16394.jpg",
  "brueghel-caceria-pajaros.jpg": "Pieter_Bruegel_the_Elder_-_Hunters_in_the_Snow_(Winter)_-_Google_Art_Project.jpg",
};

async function getThumbUrl(fileTitle: string): Promise<string | null> {
  const encoded = encodeURIComponent("File:" + fileTitle);
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encoded}&prop=imageinfo&iiprop=url|thumburl&iiurlwidth=960&format=json&formatversion=2`;
  const res = await fetch(apiUrl, { headers: { "User-Agent": UA } });
  if (!res.ok) return null;
  const data = await res.json() as any;
  const pages = data?.query?.pages;
  if (!pages || pages.length === 0) return null;
  const page = pages[0];
  if (page.missing) return null;
  const info = page?.imageinfo?.[0];
  if (!info) return null;
  return (info.thumburl as string) ?? (info.url as string) ?? null;
}

async function download(url: string, dest: string): Promise<void> {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
}

async function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const entries = Object.entries(fileTitles);
  let ok = 0, err = 0;
  for (const [destName, fileTitle] of entries) {
    const destPath = path.join(ARTWORKS_DIR, destName);
    if (fs.existsSync(destPath)) {
      console.log(`  SKIP: ${destName}`);
      ok++;
      continue;
    }
    await sleep(300);
    try {
      const thumbUrl = await getThumbUrl(fileTitle);
      if (!thumbUrl) { console.error(`  NO URL: ${destName} (${fileTitle})`); err++; continue; }
      await sleep(200);
      await download(thumbUrl, destPath);
      const size = fs.statSync(destPath).size;
      if (size < 5000) { fs.unlinkSync(destPath); console.error(`  SMALL: ${destName} (${size} bytes)`); err++; continue; }
      console.log(`  OK: ${destName} (${Math.round(size/1024)} KB)`);
      ok++;
    } catch (e: any) {
      console.error(`  FAIL: ${destName} — ${e.message}`);
      err++;
    }
  }
  console.log(`\nOK: ${ok}  FAIL: ${err}`);
}
main().catch(console.error);
