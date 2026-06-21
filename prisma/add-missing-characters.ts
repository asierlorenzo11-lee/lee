import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

// Nueva tabla: { slug, name, fragmentSlugs[] }
const newCharacters: { slug: string; name: string; fragments: string[] }[] = [
  // ROMANCERO VIEJO
  { slug: "abenamar", name: "Abenámar", fragments: ["romance-de-abenamar"] },
  { slug: "juan-ii-de-castilla", name: "Juan II de Castilla", fragments: ["romance-de-abenamar"] },
  { slug: "infante-arnaldos", name: "El infante Arnaldos", fragments: ["el-infante-arnaldos"] },
  { slug: "dona-urraca", name: "Doña Urraca", fragments: ["romance-del-rey-don-sancho"] },
  { slug: "rey-don-sancho", name: "El rey don Sancho", fragments: ["romance-del-rey-don-sancho"] },
  { slug: "la-muerte-personificacion", name: "La Muerte (personificación)", fragments: ["romance-del-enamorado-y-la-muerte"] },

  // LIBRO DE BUEN AMOR
  { slug: "don-carnal", name: "Don Carnal", fragments: ["la-batalla-de-don-carnal-y-dona-cuaresma"] },
  { slug: "dona-cuaresma", name: "Doña Cuaresma", fragments: ["la-batalla-de-don-carnal-y-dona-cuaresma"] },

  // ÉGLOGAS DE GARCILASO
  { slug: "salicio", name: "Salicio", fragments: ["egloga-i-queja-de-salicio"] },
  { slug: "orfeo", name: "Orfeo", fragments: ["el-tapiz-de-orfeo-y-euridice"] },
  { slug: "euridice", name: "Eurídice", fragments: ["el-tapiz-de-orfeo-y-euridice"] },
  { slug: "venus", name: "Venus", fragments: ["el-tapiz-de-venus-y-adonis"] },
  { slug: "adonis", name: "Adonis", fragments: ["el-tapiz-de-venus-y-adonis"] },

  // DON ÁLVARO O LA FUERZA DEL SINO
  {
    slug: "don-alvaro",
    name: "Don Álvaro",
    fragments: [
      "don-alvaro-misterio-y-amor",
      "don-alvaro-fuga-fatal",
      "don-alvaro-soldado-de-fortuna",
      "don-alvaro-gran-monólogo",
      "don-alvaro-precipicio-final",
    ],
  },
  {
    slug: "dona-leonor-de-vargas",
    name: "Doña Leonor de Vargas",
    fragments: ["don-alvaro-misterio-y-amor", "don-alvaro-precipicio-final"],
  },
  {
    slug: "don-carlos-de-vargas",
    name: "Don Carlos de Vargas",
    fragments: ["don-alvaro-soldado-de-fortuna"],
  },
  {
    slug: "don-alfonso-de-vargas",
    name: "Don Alfonso de Vargas",
    fragments: ["don-alvaro-precipicio-final"],
  },

  // DON JUAN TENORIO
  {
    slug: "don-juan-tenorio",
    name: "Don Juan Tenorio",
    fragments: [
      "don-juan-convite-apuesta",
      "don-juan-jardin-angel-de-amor",
      "don-juan-cementerio-convite",
      "don-juan-salvacion-final",
    ],
  },
  { slug: "don-luis-mejia", name: "Don Luis Mejía", fragments: ["don-juan-convite-apuesta"] },
  {
    slug: "dona-ines-de-ulloa",
    name: "Doña Inés de Ulloa",
    fragments: ["dona-ines-lee-la-carta", "don-juan-jardin-angel-de-amor", "don-juan-salvacion-final"],
  },
  {
    slug: "don-gonzalo-de-ulloa",
    name: "Don Gonzalo de Ulloa (el Comendador)",
    fragments: ["don-juan-cementerio-convite"],
  },

  // ESPRONCEDA
  { slug: "teresa-mancha", name: "Teresa (la amada de Espronceda)", fragments: ["canto-a-teresa"] },

  // QUEVEDO
  { slug: "don-dinero", name: "Don Dinero", fragments: ["poderoso-caballero-es-don-dinero"] },

  // MARÍA DE ZAYAS
  {
    slug: "liseo",
    name: "Liseo",
    fragments: ["amar-el-dia-aborrecer-el-dia", "que-muera-yo-liseo-por-tus-ojos"],
  },

  // LORCA
  { slug: "antonito-el-camborio", name: "Antoñito el Camborio", fragments: ["prendimiento-de-antonito-el-camborio"] },
  { slug: "la-luna-personaje", name: "La Luna (personificación)", fragments: ["romance-de-la-luna-luna"] },
];

// Personajes YA existentes a los que solo hay que enlazar fragmentos
const existingAssignments: { slug: string; fragments: string[] }[] = [
  { slug: "don-felix-de-montemar", fragments: ["el-estudiante-de-salamanca-noche"] },
  { slug: "el-cid", fragments: ["castilla-el-cid-cabalga"] },
];

async function main() {
  let created = 0;
  let assigned = 0;
  let skipped = 0;

  // 1. Crear personajes nuevos y enlazarlos
  for (const ch of newCharacters) {
    const fragmentIds = (
      await Promise.all(
        ch.fragments.map((slug) =>
          prisma.fragment.findFirst({ where: { slug }, select: { id: true } }),
        ),
      )
    )
      .filter(Boolean)
      .map((f) => ({ id: f!.id }));

    if (fragmentIds.length === 0) {
      console.warn(`⚠  Sin fragmentos encontrados para personaje "${ch.name}" (slugs: ${ch.fragments.join(", ")})`);
      skipped++;
      continue;
    }

    const missing = ch.fragments.filter(
      (s, i) => !fragmentIds[i],
    );
    if (missing.length) {
      console.warn(`⚠  Slugs no encontrados para "${ch.name}": ${missing.join(", ")}`);
    }

    await prisma.character.upsert({
      where: { slug: ch.slug },
      create: { slug: ch.slug, name: ch.name, fragments: { connect: fragmentIds } },
      update: { name: ch.name, fragments: { connect: fragmentIds } },
    });
    console.log(`✓ ${ch.name} → ${fragmentIds.length} fragmento(s)`);
    created++;
  }

  // 2. Enlazar personajes existentes a nuevos fragmentos
  for (const ea of existingAssignments) {
    const char = await prisma.character.findUnique({ where: { slug: ea.slug } });
    if (!char) { console.warn(`⚠  Personaje "${ea.slug}" no existe`); skipped++; continue; }

    const fragmentIds = (
      await Promise.all(
        ea.fragments.map((slug) =>
          prisma.fragment.findFirst({ where: { slug }, select: { id: true } }),
        ),
      )
    )
      .filter(Boolean)
      .map((f) => ({ id: f!.id }));

    await prisma.character.update({
      where: { slug: ea.slug },
      data: { fragments: { connect: fragmentIds } },
    });
    console.log(`✓ ${char.name} → +${fragmentIds.length} fragmento(s) existente(s)`);
    assigned++;
  }

  console.log(`\nResumen: ${created} personajes creados/actualizados, ${assigned} enlazados, ${skipped} omitidos`);

  // Verificar resultado
  const total = await prisma.fragment.count({ where: { status: "published", characters: { some: {} } } });
  const totalFrags = await prisma.fragment.count({ where: { status: "published" } });
  console.log(`\nFragmentos con personajes: ${total} / ${totalFrags}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
