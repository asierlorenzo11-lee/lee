import fs from "fs";
import path from "path";

const ARTWORKS_DIR = path.join(__dirname, "../public/images/artworks");

const downloads: Record<string, string> = {
  "turner-fighting-temeraire.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/The_Fighting_Temeraire%2C_JMW_Turner%2C_National_Gallery.jpg/960px-The_Fighting_Temeraire%2C_JMW_Turner%2C_National_Gallery.jpg",
  "friedrich-caminante-niebla.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg/960px-Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg",
  "zurbaran-santa-teresa.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Santa_Teresa_de_Jes%C3%BAs%2C_de_Francisco_de_Zurbar%C3%A1n_%28Sacrist%C3%ADa_mayor_de_la_catedral_de_Sevilla%29.jpg/640px-Santa_Teresa_de_Jes%C3%BAs%2C_de_Francisco_de_Zurbar%C3%A1n_%28Sacrist%C3%ADa_mayor_de_la_catedral_de_Sevilla%29.jpg",
  "murillo-inmaculada.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Bartolom%C3%A9_Esteban_Perez_Murillo_-_Immaculate_Conception_-_WGA16380.jpg/640px-Bartolom%C3%A9_Esteban_Perez_Murillo_-_Immaculate_Conception_-_WGA16380.jpg",
  "constable-haywain.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/John_Constable_-_The_Hay_Wain_%281821%29.jpg/960px-John_Constable_-_The_Hay_Wain_%281821%29.jpg",
  "steen-mescolanza.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Jan_Steen_005.jpg/640px-Jan_Steen_005.jpg",
  "goya-sueno-razon.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Francisco_Jos%C3%A9_de_Goya_y_Lucientes_-_The_sleep_of_reason_produces_monsters_%28No._43%29%2C_from_Los_Caprichos_-_Google_Art_Project.jpg/960px-Francisco_Jos%C3%A9_de_Goya_y_Lucientes_-_The_sleep_of_reason_produces_monsters_%28No._43%29%2C_from_Los_Caprichos_-_Google_Art_Project.jpg",
  "velazquez-borrachos.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Vel%C3%A1zquez_-_El_Triunfo_de_Baco_o_Los_Borrachos_%28Museo_del_Prado%2C_1628-29%29.jpg/960px-Vel%C3%A1zquez_-_El_Triunfo_de_Baco_o_Los_Borrachos_%28Museo_del_Prado%2C_1628-29%29.jpg",
  "beato-liebana.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Beatus_map.jpg/640px-Beatus_map.jpg",
  "durer-melancolia.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Melencolia_I_%28Durero%29.jpg/960px-Melencolia_I_%28Durero%29.jpg",
  "bocklin-isla-muertos.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Arnold_B%C3%B6cklin_-_Die_Toteninsel_I_%28Basel%2C_Kunstmuseum%29.jpg/960px-Arnold_B%C3%B6cklin_-_Die_Toteninsel_I_%28Basel%2C_Kunstmuseum%29.jpg",
  "steenwijck-vanitas.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Harmen_Steenwijck_-_Vanitas_Still-Life_-_WGA21768.jpg/640px-Harmen_Steenwijck_-_Vanitas_Still-Life_-_WGA21768.jpg",
  "morales-piedad.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Luis_de_Morales_001.jpg/640px-Luis_de_Morales_001.jpg",
  "goya-dos-de-mayo.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/El_dos_de_mayo_de_1808_en_Madrid.jpg/960px-El_dos_de_mayo_de_1808_en_Madrid.jpg",
  "el-greco-san-francisco.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/El_Greco_and_Workshop_-_Saint_Francis_of_Assisi_in_Ecstasy_4431M09_7GB2M.jpg/640px-El_Greco_and_Workshop_-_Saint_Francis_of_Assisi_in_Ecstasy_4431M09_7GB2M.jpg",
  "claude-lorrain-pastoral.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/La_campi%C3%B1a_romana%2C1639%2C_Claude_Lorrain.jpg/640px-La_campi%C3%B1a_romana%2C1639%2C_Claude_Lorrain.jpg",
  "delacroix-femmes-alger.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Eug%C3%A8ne_Delacroix_-_The_Women_of_Algiers%2C_1834.jpg/640px-Eug%C3%A8ne_Delacroix_-_The_Women_of_Algiers%2C_1834.jpg",
  "simone-martini-virgilio.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Simone_Martini_-_Frontispice_du_Virgile.jpg/640px-Simone_Martini_-_Frontispice_du_Virgile.jpg",
  "gericault-balsa-medusa.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Raft_of_the_Medusa.jpg/960px-Raft_of_the_Medusa.jpg",
  "goya-saturno.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Francisco_de_Goya%2C_Saturno_devorando_a_su_hijo_%281819-1823%29.jpg/960px-Francisco_de_Goya%2C_Saturno_devorando_a_su_hijo_%281819-1823%29.jpg",
  "gentileschi-autorretrato.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Self-Portrait_as_the_Allegory_of_Painting_%28La_Pittura%29_-_Artemisia_Gentileschi.jpg/960px-Self-Portrait_as_the_Allegory_of_Painting_%28La_Pittura%29_-_Artemisia_Gentileschi.jpg",
  "raphael-fornarina.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Raffaello_Sanzio_-_La_Fornarina_%28ca._1519-1520%29.jpg/960px-Raffaello_Sanzio_-_La_Fornarina_%28ca._1519-1520%29.jpg",
  "goya-tres-de-mayo.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/El_Tres_de_Mayo%2C_by_Francisco_de_Goya%2C_from_Prado_thin_black_margin.jpg/960px-El_Tres_de_Mayo%2C_by_Francisco_de_Goya%2C_from_Prado_thin_black_margin.jpg",
  "goya-duelo-garrotes.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Francisco_de_Goya_y_Lucientes_-_Duelo_a_garrotazos.jpg/960px-Francisco_de_Goya_y_Lucientes_-_Duelo_a_garrotazos.jpg",
  "bruegel-danza-campesinos.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Pieter_Bruegel_the_Elder_-_The_Peasant_Dance_-_WGA3499.jpg/960px-Pieter_Bruegel_the_Elder_-_The_Peasant_Dance_-_WGA3499.jpg",
  "fuseli-pesadilla.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Johann_Heinrich_F%C3%BCssli_-_The_Nightmare_55.5.A-d1-2019-04-15.jpg/960px-Johann_Heinrich_F%C3%BCssli_-_The_Nightmare_55.5.A-d1-2019-04-15.jpg",
  "goya-pelele.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/El_pelele.jpg/640px-El_pelele.jpg",
  "klimt-danae.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Gustav_Klimt_010.jpg/640px-Gustav_Klimt_010.jpg",
  "mengs-carlos-iii.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Charles_III_of_Spain_high_resolution.jpg/640px-Charles_III_of_Spain_high_resolution.jpg",
  "velazquez-vieja-friendo.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Diego_Velazquez_-_An_Old_Woman_Cooking_Eggs_-_Google_Art_Project.jpg/960px-Diego_Velazquez_-_An_Old_Woman_Cooking_Eggs_-_Google_Art_Project.jpg",
  "david-juramento-horacios.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Le_Serment_des_Horaces_-_Jacques-Louis_David_-_Mus%C3%A9e_du_Louvre_Peintures_INV_3692_%3B_MR_1432.jpg/960px-Le_Serment_des_Horaces_-_Jacques-Louis_David_-_Mus%C3%A9e_du_Louvre_Peintures_INV_3692_%3B_MR_1432.jpg",
  "waterhouse-miranda.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Waterhouse-Miranda-The-Tempest.jpg/640px-Waterhouse-Miranda-The-Tempest.jpg",
  "goya-la-romeria.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/La_romer%C3%ADa_de_San_Isidro.jpg/640px-La_romer%C3%ADa_de_San_Isidro.jpg",
  "delacroix-sardanapalo.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/La_Mort_de_Sardanapale_-_Eug%C3%A8ne_Delacroix_-_Mus%C3%A9e_du_Louvre_Peintures_RF_2346.jpg/960px-La_Mort_de_Sardanapale_-_Eug%C3%A8ne_Delacroix_-_Mus%C3%A9e_du_Louvre_Peintures_RF_2346.jpg",
  "goya-inquisicion.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Francisco_de_Goya_-_Escena_de_Inquisici%C3%B3n_-_Google_Art_Project.jpg/640px-Francisco_de_Goya_-_Escena_de_Inquisici%C3%B3n_-_Google_Art_Project.jpg",
  "oudry-lobo.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Oudry%2C_Jean-Baptiste_-_Dead_Wolf_-_1721.jpg/640px-Oudry%2C_Jean-Baptiste_-_Dead_Wolf_-_1721.jpg",
  "velazquez-menipo.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Diego_Vel%C3%A1zquez_022.jpg/640px-Diego_Vel%C3%A1zquez_022.jpg",
  "bernini-apolo-dafne.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Apollo_and_Daphne_%28Bernini%29_%28cropped%29.jpg/960px-Apollo_and_Daphne_%28Bernini%29_%28cropped%29.jpg",
  "fragonard-columpio.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/The_Swing_%28P430%29.jpg/960px-The_Swing_%28P430%29.jpg",
  "waterhouse-dama-shalott.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/John_William_Waterhouse_-_The_Lady_of_Shalott_-_Google_Art_Project_edit.jpg/960px-John_William_Waterhouse_-_The_Lady_of_Shalott_-_Google_Art_Project_edit.jpg",
  "rossetti-beata-beatrix.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Dante_Gabriel_Rossetti_-_Beata_Beatrix%2C_1864-1870.jpg/960px-Dante_Gabriel_Rossetti_-_Beata_Beatrix%2C_1864-1870.jpg",
  "snyders-bodegon-frutas.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Frans_Snyders_-_Still_Life_with_Fruit%2C_Vegetables_and_Dead_Game_-_78.44_-_Detroit_Institute_of_Arts.jpg/640px-Frans_Snyders_-_Still_Life_with_Fruit%2C_Vegetables_and_Dead_Game_-_78.44_-_Detroit_Institute_of_Arts.jpg",
  "memling-juicio-final.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Das_J%C3%BCngste_Gericht_%28Memling%29.jpg/960px-Das_J%C3%BCngste_Gericht_%28Memling%29.jpg",
  "watteau-citerea.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/L%27Embarquement_pour_Cyth%C3%A8re%2C_by_Antoine_Watteau%2C_from_C2RMF_retouched.jpg/960px-L%27Embarquement_pour_Cyth%C3%A8re%2C_by_Antoine_Watteau%2C_from_C2RMF_retouched.jpg",
  "boucher-pastoral.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Fran%C3%A7ois_Boucher%2C_pastoral_painting_%22Shepherd_and_Shepherdess_Reposing%22.jpg/640px-Fran%C3%A7ois_Boucher%2C_pastoral_painting_%22Shepherd_and_Shepherdess_Reposing%22.jpg",
  "delacroix-libertad.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/La_Libert%C3%A9_guidant_le_peuple_-_Eug%C3%A8ne_Delacroix_-_Mus%C3%A9e_du_Louvre_Peintures_RF_129_-_apr%C3%A8s_restauration_2024.jpg/960px-La_Libert%C3%A9_guidant_le_peuple_-_Eug%C3%A8ne_Delacroix_-_Mus%C3%A9e_du_Louvre_Peintures_RF_129_-_apr%C3%A8s_restauration_2024.jpg",
  "ruisdael-molino.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/The_Windmill_at_Wijk_bij_Duurstede_1670_Ruisdael.jpg/960px-The_Windmill_at_Wijk_bij_Duurstede_1670_Ruisdael.jpg",
  "el-greco-san-martin.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/El_Greco_-_San_Mart%C3%ADn_y_el_mendigo.jpg/960px-El_Greco_-_San_Mart%C3%ADn_y_el_mendigo.jpg",
  "judith-leyster-autorretrato.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Self-portrait_by_Judith_Leyster.jpg/960px-Self-portrait_by_Judith_Leyster.jpg",
  "ghirlandaio-giovanna.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Ghirlandaio-Giovanna_Tornabuoni_cropped.jpg/960px-Ghirlandaio-Giovanna_Tornabuoni_cropped.jpg",
  "leighton-flaming-june.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Flaming_June%2C_by_Frederic_Lord_Leighton_%281830-1896%29.jpg/960px-Flaming_June%2C_by_Frederic_Lord_Leighton_%281830-1896%29.jpg",
  "pontormo-hallebardero.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Pontormo_%28Jacopo_Carucci%29_%28Italian%2C_Florentine%29_-_Portrait_of_a_Halberdier_%28Francesco_Guardi%3F%29_-_Google_Art_Project.jpg/960px-Pontormo_%28Jacopo_Carucci%29_%28Italian%2C_Florentine%29_-_Portrait_of_a_Halberdier_%28Francesco_Guardi%3F%29_-_Google_Art_Project.jpg",
  "aivazovsky-brig-mercury.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Aivazovsky%2C_Brig_Mercury_Attacked_by_Two_Turkish_Ships_1892.jpg/640px-Aivazovsky%2C_Brig_Mercury_Attacked_by_Two_Turkish_Ships_1892.jpg",
  "holbein-embajadores.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Hans_Holbein_the_Younger_-_The_Ambassadors_-_Google_Art_Project.jpg/960px-Hans_Holbein_the_Younger_-_The_Ambassadors_-_Google_Art_Project.jpg",
  "adam-elsheimer-huida.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Adam_Elsheimer_-_Die_Flucht_nach_%C3%84gypten_%28Alte_Pinakothek%29_2.jpg/640px-Adam_Elsheimer_-_Die_Flucht_nach_%C3%84gypten_%28Alte_Pinakothek%29_2.jpg",
  "raphael-triunfo-galatea.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Galatea_Raphael.jpg/640px-Galatea_Raphael.jpg",
  "chardin-raya.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Chardin_-_The_Ray%2C_c.1728.jpg/640px-Chardin_-_The_Ray%2C_c.1728.jpg",
  "velazquez-marte.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Vel%C3%A1zquez_-_Dios_Marte_%28Museo_del_Prado%2C_1639-41%29.jpg/640px-Vel%C3%A1zquez_-_Dios_Marte_%28Museo_del_Prado%2C_1639-41%29.jpg",
  "rubens-tres-gracias.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/The_Three_Graces%2C_by_Peter_Paul_Rubens%2C_from_Prado_in_Google_Earth.jpg/640px-The_Three_Graces%2C_by_Peter_Paul_Rubens%2C_from_Prado_in_Google_Earth.jpg",
  "metsu-mujer-leyendo-carta.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Woman_Reading_a_Letter_by_Gabri%C3%ABl_Metsu.jpg/960px-Woman_Reading_a_Letter_by_Gabri%C3%ABl_Metsu.jpg",
  "el-greco-pentecostes.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Pentecost%C3%A9s_%28El_Greco%2C_c._1600%29_Prado.jpg/640px-Pentecost%C3%A9s_%28El_Greco%2C_c._1600%29_Prado.jpg",
  "turner-lluvia-vapores.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Turner_-_Rain%2C_Steam_and_Speed_-_National_Gallery_file.jpg/960px-Turner_-_Rain%2C_Steam_and_Speed_-_National_Gallery_file.jpg",
  "velazquez-meninas.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Las_Meninas%2C_by_Diego_Vel%C3%A1zquez%2C_from_Prado_in_Google_Earth.jpg/960px-Las_Meninas%2C_by_Diego_Vel%C3%A1zquez%2C_from_Prado_in_Google_Earth.jpg",
  "vermeer-chica-perla.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/960px-1665_Girl_with_a_Pearl_Earring.jpg",
  "metsys-prestamista.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Le_pr%C3%AAteur_et_sa_femme_-_Quentin_Metsys_-_Mus%C3%A9e_du_Louvre_Peintures_INV_1444_%3B_MR_821.jpg/960px-Le_pr%C3%AAteur_et_sa_femme_-_Quentin_Metsys_-_Mus%C3%A9e_du_Louvre_Peintures_INV_1444_%3B_MR_821.jpg",
  "velazquez-rendicion-breda.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Vel%C3%A1zquez_-_de_Breda_o_Las_Lanzas_%28Museo_del_Prado%2C_1634-35%29.jpg/960px-Vel%C3%A1zquez_-_de_Breda_o_Las_Lanzas_%28Museo_del_Prado%2C_1634-35%29.jpg",
};

async function downloadFile(filename: string, url: string): Promise<void> {
  const dest = path.join(ARTWORKS_DIR, filename);
  if (fs.existsSync(dest)) {
    console.log(`  SKIP (exists): ${filename}`);
    return;
  }
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "LEE-app/1.0 (educational project; contact asierlorenzo11@gmail.com)" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log(`  OK: ${filename} (${buf.length} bytes)`);
  } catch (e) {
    console.error(`  FAIL: ${filename} — ${e}`);
  }
}

async function main() {
  const entries = Object.entries(downloads);
  console.log(`Descargando ${entries.length} imágenes…`);
  // 10 at a time
  for (let i = 0; i < entries.length; i += 10) {
    const batch = entries.slice(i, i + 10);
    await Promise.all(batch.map(([f, u]) => downloadFile(f, u)));
  }
  console.log("\nDone.");
}

main().catch(console.error);
