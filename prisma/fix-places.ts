import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

async function connect(placeSlug: string, fragmentSlugs: string[]) {
  const place = await prisma.place.findUnique({ where: { slug: placeSlug } });
  if (!place) { console.warn(`⚠  Lugar "${placeSlug}" no encontrado`); return; }

  const ids = (
    await Promise.all(fragmentSlugs.map((s) =>
      prisma.fragment.findFirst({ where: { slug: s }, select: { id: true } }),
    ))
  ).filter(Boolean).map((f) => ({ id: f!.id }));

  await prisma.place.update({
    where: { slug: placeSlug },
    data: { fragments: { connect: ids } },
  });
  console.log(`✓ ${place.name} → +${ids.length} fragmento(s)`);
}

async function main() {
  // Vivar del Cid — slug correcto es "vivar-del-cid", no "vivar-del-cid-burgos"
  await connect("vivar-del-cid", [
    "destierro-del-cid",
    "la-nina-de-burgos",
  ]);

  // Burgos — fragmentos del destierro ambientados en Burgos
  await connect("burgos", [
    "destierro-del-cid",
    "la-nina-de-burgos",
  ]);

  // Valencia — conquista y vida del Cid en Valencia
  await connect("valencia-ciudad", [
    "el-reencuentro-en-valencia",
    "las-bodas-de-las-hijas-del-cid",
    "el-cid-y-el-leon",
    "la-afrenta-de-corpes",
    "final-del-cantar-de-mio-cid",
  ]);

  // La Mancha — único fragmento del Quijote en la DB
  await connect("la-mancha", [
    "los-molinos-de-viento",
  ]);

  // Hita — Libro de buen amor
  await connect("hita", [
    "la-intencion-de-la-obra",
    "alegato-contra-el-amor",
    "respuesta-del-amor",
    "trotaconventos",
    "la-batalla-de-don-carnal-y-dona-cuaresma",
    "la-muerte-de-trotaconventos",
    "retrato-de-la-dama-ideal",
    "la-chata-de-malangosto",
  ]);

  const total = await prisma.fragment.count({ where: { status: "published", places: { some: {} } } });
  const totalFrags = await prisma.fragment.count({ where: { status: "published" } });
  console.log(`\nFragmentos con lugar: ${total} / ${totalFrags}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
