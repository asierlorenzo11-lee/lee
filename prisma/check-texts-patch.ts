import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

const SLUGS = [
  "rima-xxi",
  "la-guitarra-poema-cante-jondo",
  "vida-retirada-oh-monte-oh-fuente-oh-rio",
  "epigrama-del-palillo-de-dientes",
  "decima-anonima-sobre-la-muerte-de-villamediana",
  "soneto-del-olvido-imposible",
  "dineros-son-calidad",
  "redondilla-contra-quevedo-y-lope",
  "amar-el-dia-aborrecer-el-dia",
  "misero-leno-soneto",
  "vivo-sin-vivir-en-mi-villancico-completo",
];

async function main() {
  for (const slug of SLUGS) {
    const f = await prisma.fragment.findFirst({ where: { slug }, select: { text: true } });
    if (f) { console.log(`=== ${slug} ===\n${f.text}\n`); }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
