import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

const newPlaces: {
  slug: string; name: string; lat: number; lng: number;
  description: string; fragments: string[];
}[] = [
  {
    slug: "cordoba",
    name: "Córdoba",
    lat: 37.8882, lng: -4.7794,
    description: "Ciudad de las tres culturas: capital del Califato de Córdoba y cuna de figuras como Averroes, Maimónides y, siglos después, Luis de Góngora, que nació aquí en 1561.",
    fragments: [
      "mientras-por-competir-con-tu-cabello",
      "dineros-son-calidad",
      "redondilla-contra-quevedo-y-lope",
    ],
  },
  {
    slug: "galicia",
    name: "Galicia",
    lat: 42.8782, lng: -8.5448,
    description: "Tierra de origen de Rosalía de Castro (Santiago de Compostela, 1837) y de Martín Codax, el juglar medieval cuyas cantigas de amigo evocan la ría de Vigo.",
    fragments: [
      "negra-sombra",
      "ondas-do-mar-de-vigo",
    ],
  },
  {
    slug: "la-mancha",
    name: "La Mancha",
    lat: 39.1667, lng: -3.0000,
    description: "Paisaje interior de Castilla–La Mancha donde Cervantes situó las aventuras de don Quijote. «En un lugar de la Mancha, de cuyo nombre no quiero acordarme…»",
    fragments: [
      "don-quijote-en-el-gran-teatro-del-mundo",
      "don-quijote-el-queso",
      "sancho-panza-el-mejor-criado",
      "los-libros-de-caballerias",
    ],
  },
  {
    slug: "burgos",
    name: "Burgos",
    lat: 42.3439, lng: -3.6969,
    description: "Ciudad castellana de partida del Cantar de Mio Cid: fue aquí donde el Campeador fue desterrado por el rey Alfonso VI y comenzó su larga campaña de reconquista.",
    fragments: [
      "el-destierro-del-cid",
      "cantar-del-destierro",
    ],
  },
  {
    slug: "valencia-ciudad",
    name: "Valencia",
    lat: 39.4699, lng: -0.3763,
    description: "Ciudad levantina conquistada por el Cid en 1094 y convertida en el mayor trofeo de su vida. Aquí instaló a su familia y murió en 1099.",
    fragments: [
      "valencia-vuestra-casa",
      "el-cid-doma-al-leon-sus-yernos-huyen",
      "quien-pudiera-ahora-ver-al-cid",
      "aumenta-la-honra-por-el-que-en-buena-nacio",
    ],
  },
  {
    slug: "hita",
    name: "Hita (Guadalajara)",
    lat: 40.8228, lng: -2.9247,
    description: "Villa medieval de la que tomó su título Juan Ruiz como Arcipreste. El Libro de buen amor está salpicado de referencia a esta tierra serrana entre Guadalajara y Castilla.",
    fragments: [
      "aqui-hallaran-algunas-maneras-para-ello",
      "eres-padre-del-fuego-pariente-de-la-llama",
      "busca-mujer-hermosa-atractiva-y-lozana",
      "de-entre-las-mas-ladinas-escogi-la-mejor",
      "dura-esta-la-pelea-de-muy-mala-manera",
      "ay-muerte-muerta-seas-bien-muerta-y-malandante",
      "busca-mujer-esbelta-de-cabeza-pequena",
      "yo-soy-la-chata-recia-la-que-a-los-hombres-ata",
    ],
  },
  {
    slug: "sevilla-siglo-de-oro",
    name: "Sevilla (Siglo de Oro)",
    lat: 37.3886, lng: -5.9823,
    description: "Puerto de Indias y escenario de Don Juan Tenorio, Fuenteovejuna (ambientada en sus aledaños) y muchas de las obras del teatro clásico español.",
    fragments: [
      "don-juan-convite-apuesta",
      "dona-ines-lee-la-carta",
      "don-juan-jardin-angel-de-amor",
      "don-juan-cementerio-convite",
      "don-juan-salvacion-final",
    ],
  },
];

// Asignaciones adicionales a lugares YA EXISTENTES
const existingPlaceAssignments: { slug: string; fragments: string[] }[] = [
  {
    slug: "salamanca",
    fragments: [
      "el-estudiante-de-salamanca-noche",
      "soneto-xxiii",
    ],
  },
  {
    slug: "vivar-del-cid-burgos",
    fragments: [
      "una-nina-se-atreve-a-hablar-con-el-cid",
      "el-que-en-buena-hora-nacio-el-heroe",
    ],
  },
  {
    slug: "toledo",
    fragments: [
      "cerca-del-tajo",
      "egloga-i-queja-de-salicio",
      "el-tapiz-de-orfeo-y-euridice",
      "el-tapiz-de-venus-y-adonis",
      "el-canto-de-tirreno-y-alcino",
      "la-muerte-de-elisa",
    ],
  },
  {
    slug: "madrid",
    fragments: [
      "canto-a-teresa",
      "cancion-del-pirata",
      "don-alvaro-misterio-y-amor",
    ],
  },
  {
    slug: "granada",
    fragments: [
      "romance-de-abenamar",
      "romance-de-la-luna-luna",
      "la-casada-infiel",
      "prendimiento-de-antonito-el-camborio",
      "la-guitarra-poema-cante-jondo",
    ],
  },
];

async function upsertPlace(p: typeof newPlaces[number]) {
  const fragmentIds = (
    await Promise.all(
      p.fragments.map((slug) =>
        prisma.fragment.findFirst({ where: { slug }, select: { id: true } }),
      ),
    )
  ).filter(Boolean).map((f) => ({ id: f!.id }));

  await prisma.place.upsert({
    where: { slug: p.slug },
    create: {
      slug: p.slug, name: p.name, lat: p.lat, lng: p.lng,
      description: p.description,
      fragments: { connect: fragmentIds },
    },
    update: {
      name: p.name, lat: p.lat, lng: p.lng,
      description: p.description,
      fragments: { connect: fragmentIds },
    },
  });
  console.log(`✓ ${p.name} — ${fragmentIds.length} fragmento(s)`);
}

async function assignToExisting(ea: typeof existingPlaceAssignments[number]) {
  const place = await prisma.place.findUnique({ where: { slug: ea.slug } });
  if (!place) { console.warn(`⚠  Lugar "${ea.slug}" no existe`); return; }

  const fragmentIds = (
    await Promise.all(
      ea.fragments.map((slug) =>
        prisma.fragment.findFirst({ where: { slug }, select: { id: true } }),
      ),
    )
  ).filter(Boolean).map((f) => ({ id: f!.id }));

  await prisma.place.update({
    where: { slug: ea.slug },
    data: { fragments: { connect: fragmentIds } },
  });
  console.log(`✓ ${place.name} +${fragmentIds.length} fragmento(s)`);
}

async function main() {
  console.log("Añadiendo lugares nuevos…");
  for (const p of newPlaces) await upsertPlace(p);

  console.log("\nAsignando a lugares existentes…");
  for (const ea of existingPlaceAssignments) await assignToExisting(ea);

  const total = await prisma.fragment.count({ where: { status: "published", places: { some: {} } } });
  const totalFrags = await prisma.fragment.count({ where: { status: "published" } });
  console.log(`\nFragmentos con lugar: ${total} / ${totalFrags}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
