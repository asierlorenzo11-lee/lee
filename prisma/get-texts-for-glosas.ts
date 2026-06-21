import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

const MISSING_SLUGS = [
  "romance-de-la-loba-parda","romance-de-la-gentil-dama-y-el-rustico-pastor","el-infante-arnaldos",
  "romance-del-enamorado-y-la-muerte","romance-del-rey-don-sancho","romance-de-la-jura-de-santa-gadea",
  "a-una-mujer-que-se-afeitaba-y-estaba-hermosa","a-ines-que-se-tenia-las-canas-de-rubio",
  "soneto-antiesclavista","soneto-dentro-del-soneto","pastora-si-mal-me-quieres",
  "la-guitarra-poema-cante-jondo","romance-de-la-luna-luna","la-casada-infiel",
  "prendimiento-de-antonito-el-camborio","el-amor-ha-tales-manas","poderoso-caballero-es-don-dinero",
  "a-un-hombre-de-gran-nariz","no-he-de-callar-epistola-fragmento","vida-retirada-oh-monte-oh-fuente-oh-rio",
  "la-vieja-y-el-gato","egloga-i-queja-de-salicio","soneto-v","soneto-x",
  "al-partir-soneto","las-contradicciones-soneto","quiero-fer-una-prosa","el-prado-alegorico",
  "rima-vii","rima-xiii","rima-xxi","rima-xxiii","ojos-claros-serenos",
  "sin-dios-sin-vos-y-sin-mi","cancion-del-pirata","soneto-del-olvido-imposible",
  "soneto-cxxix-a-la-muerte-de-garcilaso","retrato-de-la-dama-ideal","la-chata-de-malangosto",
  "procesion-satirica-a-felipe-iv","decima-anonima-sobre-la-muerte-de-villamediana",
  "ni-se-si-muero","dineros-son-calidad","redondilla-contra-quevedo-y-lope",
  "castilla-el-cid-cabalga","amar-el-dia-aborrecer-el-dia","que-muera-yo-liseo-por-tus-ojos",
  "epigrama-del-palillo-de-dientes","cantico-espiritual-la-busqueda","tras-de-un-amoroso-lance",
  "vivo-sin-vivir-en-mi-villancico-completo","hombres-necios-que-acusais","al-que-ingrato-me-deja",
  "este-que-ves-engano-colorido","misero-leno-soneto",
];

async function main() {
  const frags = await prisma.fragment.findMany({
    where: { slug: { in: MISSING_SLUGS } },
    select: { slug: true, title: true, text: true },
  });

  const map = Object.fromEntries(frags.map((f) => [f.slug, f]));
  for (const slug of MISSING_SLUGS) {
    const f = map[slug];
    if (f) {
      console.log(`\n=== ${slug} ===`);
      console.log(`TÍTULO: ${f.title}`);
      console.log(`TEXTO:\n${f.text.slice(0, 400)}`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
