import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

// slug → { imageUrl, headline? }
// headline solo cuando cambia
const UPDATES: Record<string, { imageUrl: string; headline?: string }> = {
  // ── Lista 1 ───────────────────────────────────────────────────────────────
  "trotaconventos":                          { imageUrl: "/images/artworks/trotaconventos.jpg" },
  "la-golondrina-y-el-lino":                 { imageUrl: "/images/artworks/la-golondrina-y-el-lino.jpg", headline: "Cosas de golondrinas" },
  "yo-soy-la-muerte-cierta":                 { imageUrl: "/images/artworks/yo-soy-la-muerte-cierta.jpg" },
  "muerte-de-celestina":                     { imageUrl: "/images/artworks/muerte-de-celestina.jpg" },
  "el-endriago-amadis":                      { imageUrl: "/images/artworks/el-endriago-amadis.jpg" },
  "la-muerte-de-elisa":                      { imageUrl: "/images/artworks/la-muerte-de-elisa.jpg" },
  "de-pura-honestidad-templo-sagrado":       { imageUrl: "/images/artworks/de-pura-honestidad.jpg" },
  "la-dulce-boca-que-a-gustar-convida":      { imageUrl: "/images/artworks/la-dulce-boca.jpg" },
  "negra-sombra":                            { imageUrl: "/images/artworks/negra-sombra.jpg" },
  "rima-vii":                                { imageUrl: "/images/artworks/rima-vii.jpg" },
  "soneto-antiesclavista":                   { imageUrl: "/images/artworks/soneto-antiesclavista.jpg" },
  "don-juan-cementerio-convite":             { imageUrl: "/images/artworks/don-juan-cementerio-convite.jpg", headline: "Uno más para cenar" },
  "romance-de-la-luna-luna":                 { imageUrl: "/images/artworks/romance-de-la-luna-luna.jpg", headline: "Huye luna, luna, luna." },
  "canto-a-teresa":                          { imageUrl: "/images/artworks/canto-a-teresa.jpg" },
  "el-estudiante-de-salamanca-desenlace":    { imageUrl: "/images/artworks/el-estudiante-desenlace.jpg" },
  "el-estudiante-de-salamanca-retrato":      { imageUrl: "/images/artworks/el-estudiante-retrato.jpg" },
  "cancion-del-pirata":                      { imageUrl: "/images/artworks/cancion-del-pirata.jpg" },
  "mire-los-muros-de-la-patria-mia":         { imageUrl: "/images/artworks/mire-los-muros.jpg" },
  "ah-de-la-vida-nadie-me-responde":         { imageUrl: "/images/artworks/ah-de-la-vida.jpg" },
  "a-un-hombre-de-gran-nariz":               { imageUrl: "/images/artworks/a-un-hombre-de-gran-nariz.jpg" },
  "fue-sueno-ayer-manana-sera-tierra":       { imageUrl: "/images/artworks/fue-sueno-ayer.jpg" },
  "ay-misero-de-mi-monologotorre":           { imageUrl: "/images/artworks/ay-misero-de-mi.jpg" },
  "ni-se-si-muero":                          { imageUrl: "/images/artworks/ni-se-si-muero.jpg" },
  "decima-anonima-sobre-la-muerte-de-villamediana": { imageUrl: "/images/artworks/muerte-de-villamediana.jpg" },
  "yo-senor-soy-de-segovia":                 { imageUrl: "/images/artworks/yo-senor-soy-de-segovia.jpg" },
  "bermejazo-platero-de-las-cumbres":        { imageUrl: "/images/artworks/bermejazo-platero.jpg" },
  "redondilla-contra-quevedo-y-lope":        { imageUrl: "/images/artworks/redondilla-contra-quevedo.jpg" },
  "donde-se-hallara-un-hombre-verdadero":    { imageUrl: "/images/artworks/donde-se-hallara-un-hombre.jpg" },
  "fuente-ovejuna-lo-hizo":                  { imageUrl: "/images/artworks/fuente-ovejuna-lo-hizo.jpg" },
  "liebres-cobardes-nacisteis":              { imageUrl: "/images/artworks/liebres-cobardes.jpg" },

  // ── Lista 2 ───────────────────────────────────────────────────────────────
  "la-opresion-del-comendador":              { imageUrl: "/images/artworks/la-opresion-del-comendador.jpg" },
  "yo-soy-un-hombre-villana-casta":          { imageUrl: "/images/artworks/yo-soy-un-hombre-villana-casta.jpg" },
  "purpureas-rosas-sobre-galatea":           { imageUrl: "/images/artworks/purpureas-rosas-galatea.jpg" },
  "la-muerte-de-don-quijote":               { imageUrl: "/images/artworks/la-muerte-de-don-quijote.jpg" },
  "consejos-a-sancho-aseo-y-modales":        { imageUrl: "/images/artworks/consejos-a-sancho-aseo.jpg" },
  "consejos-a-sancho-linaje-y-justicia":     { imageUrl: "/images/artworks/consejos-a-sancho-linaje.jpg" },
  "la-aventura-de-los-batanes":              { imageUrl: "/images/artworks/la-aventura-de-los-batanes.jpg" },
  "en-un-lugar-de-la-mancha":               { imageUrl: "/images/artworks/en-un-lugar-de-la-mancha.jpg" },
  "muerome-por-llamar-juanilla":             { imageUrl: "/images/artworks/muerome-por-llamar-juanilla.jpg" },
  "estos-los-sauces-son":                    { imageUrl: "/images/artworks/estos-los-sauces-son.jpg" },
  "ir-y-quedarse-soneto-ausencia":           { imageUrl: "/images/artworks/ir-y-quedarse.jpg" },
  "desmayarse-atreverse-estar-furioso":      { imageUrl: "/images/artworks/desmayarse-atreverse.jpg" },
  "es-hielo-abrasador-es-fuego-helado":      { imageUrl: "/images/artworks/es-hielo-abrasador.jpg" },
};

async function main() {
  let ok = 0;
  let fail = 0;
  for (const [slug, data] of Object.entries(UPDATES)) {
    const frag = await prisma.fragment.findUnique({ where: { slug } });
    if (!frag) { console.warn(`  ⚠ No encontrado: ${slug}`); fail++; continue; }
    await prisma.fragment.update({
      where: { id: frag.id },
      data: {
        artworkImageUrl: data.imageUrl,
        artworkTitle: null,
        artworkAuthor: null,
        artworkCaption: null,
        ...(data.headline ? { headline: data.headline } : {}),
      },
    });
    console.log(`  ✓ ${slug}${data.headline ? ` → "${data.headline}"` : ""}`);
    ok++;
  }
  console.log(`\n${ok} actualizados, ${fail} no encontrados.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
