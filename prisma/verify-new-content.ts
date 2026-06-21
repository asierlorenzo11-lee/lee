import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const p = new PrismaClient({ adapter });

async function main() {
  const slugs = ["tanto-amare","non-dormiray-mamma","que-fare-mamma","de-que-morredes-filha","quantas-sabedes-amar-amigo",
    "ya-cantan-los-gallos","al-alba-venid","en-avila-mis-ojos","gritos-daba-la-morenita",
    "prologo-ochava-esfera","prologo-lapidario","el-endriago-amadis","prologo-sendebar",
    "la-golondrina-y-el-lino","dona-truana","el-hombre-y-los-altramuces","el-cazador-de-perdices"];

  let ok = 0, fail = 0;
  for (const slug of slugs) {
    const f = await p.fragment.findUnique({
      where: { slug },
      select: { slug: true, artworkImageUrl: true, annotations: { select: { type: true } } },
    });
    if (!f) { console.log(`  ✗ MISSING: ${slug}`); fail++; continue; }
    const types = [...new Set(f.annotations.map(a => a.type))].sort().join(",");
    const icon = f.artworkImageUrl ? "🖼" : "❌";
    console.log(`  ✓ ${icon} ${slug} [${types}]`);
    ok++;
  }

  // Check authors
  const authors = ["garci-rodriguez-de-montalvo","anonimo-cancionero-medieval","alfonso-x-el-sabio"];
  console.log("\nAutores:");
  for (const slug of authors) {
    const a = await p.author.findUnique({ where: { slug }, select: { name: true, portraitUrl: true } });
    if (!a) { console.log(`  ✗ MISSING: ${slug}`); continue; }
    const icon = a.portraitUrl ? "🖼" : "❌";
    console.log(`  ${icon} ${a.name}: ${a.portraitUrl?.substring(0,50)}`);
  }

  console.log(`\nFragmentos: ${ok} OK / ${fail} FAIL`);
}
main().catch(console.error).finally(() => p.$disconnect());
