import fs from "fs";
import path from "path";

const ARTWORKS_DIR = path.join(__dirname, "../public/images/artworks");
const UA = "LEE-app/1.0 (educational project; contact asierlorenzo11@gmail.com)";

// dest filename → Commons file title (no "File:" prefix)
const fileTitles: Record<string, string> = {
  "zurbaran-santa-teresa.jpg": "Santa_Teresa_de_Jesús,_de_Francisco_de_Zurbarán_(Sacristía_mayor_de_la_catedral_de_Sevilla).jpg",
  "murillo-inmaculada.jpg": "Bartolomé_Esteban_Perez_Murillo_-_Immaculate_Conception_-_WGA16380.jpg",
  "steen-mescolanza.jpg": "Jan_Steen_005.jpg",
  "beato-liebana.jpg": "Beatus_map.jpg",
  "steenwijck-vanitas.jpg": "Harmen_Steenwijck_-_Vanitas_Still-Life_-_WGA21768.jpg",
  "el-greco-san-francisco.jpg": "El_Greco_and_Workshop_-_Saint_Francis_of_Assisi_in_Ecstasy_4431M09_7GB2M.jpg",
  "morales-piedad.jpg": "Luis_de_Morales_001.jpg",
  "claude-lorrain-pastoral.jpg": "La_campiña_romana,1639,_Claude_Lorrain.jpg",
  "delacroix-femmes-alger.jpg": "Eugène_Delacroix_-_The_Women_of_Algiers,_1834.jpg",
  "simone-martini-virgilio.jpg": "Simone_Martini_-_Frontispice_du_Virgile.jpg",
  "goya-pelele.jpg": "El_pelele.jpg",
  "klimt-danae.jpg": "Gustav_Klimt_010.jpg",
  "mengs-carlos-iii.jpg": "Charles_III_of_Spain_high_resolution.jpg",
  "waterhouse-miranda.jpg": "Waterhouse-Miranda-The-Tempest.jpg",
  "goya-la-romeria.jpg": "La_romería_de_San_Isidro.jpg",
  "goya-inquisicion.jpg": "Francisco_de_Goya_-_Escena_de_Inquisición_-_Google_Art_Project.jpg",
  "oudry-lobo.jpg": "Oudry,_Jean-Baptiste_-_Dead_Wolf_-_1721.jpg",
  "velazquez-menipo.jpg": "Diego_Velázquez_022.jpg",
  "snyders-bodegon-frutas.jpg": "Frans_Snyders_-_Still_Life_with_Fruit,_Vegetables_and_Dead_Game_-_78.44_-_Detroit_Institute_of_Arts.jpg",
  "boucher-pastoral.jpg": "François_Boucher,_pastoral_painting_\"Shepherd_and_Shepherdess_Reposing\".jpg",
  "ghirlandaio-giovanna.jpg": "Ghirlandaio-Giovanna_Tornabuoni_cropped.jpg",
  "judith-leyster-autorretrato.jpg": "Self-portrait_by_Judith_Leyster.jpg",
  "leighton-flaming-june.jpg": "Flaming_June,_by_Frederic_Lord_Leighton_(1830-1896).jpg",
  "pontormo-hallebardero.jpg": "Pontormo_(Jacopo_Carucci)_(Italian,_Florentine)_-_Portrait_of_a_Halberdier_(Francesco_Guardi?)_-_Google_Art_Project.jpg",
  "aivazovsky-brig-mercury.jpg": "Aivazovsky,_Brig_Mercury_Attacked_by_Two_Turkish_Ships_1892.jpg",
  "adam-elsheimer-huida.jpg": "Adam_Elsheimer_-_Die_Flucht_nach_Ägypten_(Alte_Pinakothek)_2.jpg",
  "raphael-triunfo-galatea.jpg": "Galatea_Raphael.jpg",
  "velazquez-marte.jpg": "Velázquez_-_Dios_Marte_(Museo_del_Prado,_1639-41).jpg",
  "chardin-raya.jpg": "Chardin_-_The_Ray,_c.1728.jpg",
  "rubens-tres-gracias.jpg": "The_Three_Graces,_by_Peter_Paul_Rubens,_from_Prado_in_Google_Earth.jpg",
  "el-greco-pentecostes.jpg": "Pentecostés_(El_Greco,_c._1600)_Prado.jpg",
};

async function getThumbUrl(fileTitle: string): Promise<string | null> {
  const encoded = encodeURIComponent("File:" + fileTitle);
  const apiUrl =
    `https://commons.wikimedia.org/w/api.php?action=query&titles=${encoded}` +
    `&prop=imageinfo&iiprop=url|thumburl&iiurlwidth=640&format=json&formatversion=2`;
  const res = await fetch(apiUrl, { headers: { "User-Agent": UA } });
  if (!res.ok) return null;
  const data = await res.json() as any;
  const pages = data?.query?.pages;
  if (!pages || pages.length === 0) return null;
  const page = pages[0];
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

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const entries = Object.entries(fileTitles);
  console.log(`Reintentando ${entries.length} imágenes via API…\n`);
  let ok = 0;
  let err = 0;

  for (const [destName, fileTitle] of entries) {
    const destPath = path.join(ARTWORKS_DIR, destName);
    if (fs.existsSync(destPath)) {
      console.log(`  SKIP (existe): ${destName}`);
      ok++;
      continue;
    }

    await sleep(500); // be polite to the API

    try {
      const thumbUrl = await getThumbUrl(fileTitle);
      if (!thumbUrl) {
        console.error(`  FAIL (sin URL): ${destName}`);
        err++;
        continue;
      }
      await download(thumbUrl, destPath);
      const size = fs.statSync(destPath).size;
      console.log(`  OK: ${destName} (${size} bytes)  ← ${thumbUrl}`);
      ok++;
    } catch (e) {
      console.error(`  FAIL: ${destName} — ${e}`);
      err++;
    }
  }

  console.log(`\nTotal: ${ok} OK, ${err} errores`);
}

main().catch(console.error);
