import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const frags = await prisma.fragment.findMany({
    where: { status: "published" },
    include: {
      annotations: { select: { type: true } },
      work: { include: { author: true } },
    },
    orderBy: [{ work: { author: { name: "asc" } } }, { order: "asc" }],
  });

  // Layer mapping: type → capa
  const LAYER: Record<string, string> = {
    glosa: "léxico",
    contexto: "contexto",
    figura: "estilo",
    pregunta: "debate",
    intertextualidad: "conexiones",
  };

  const missing: Record<string, string[]> = {
    léxico: [], contexto: [], estilo: [], debate: [], conexiones: [],
  };

  frags.forEach((f) => {
    const types = new Set(f.annotations.map((a) => LAYER[a.type]).filter(Boolean));
    const label = `${f.work.author.name} — "${f.title}"`;
    for (const layer of ["léxico", "contexto", "estilo", "debate", "conexiones"]) {
      if (!types.has(layer)) missing[layer].push(label);
    }
  });

  console.log("=== COBERTURA POR CAPA ===\n");
  for (const [layer, list] of Object.entries(missing)) {
    const covered = frags.length - list.length;
    console.log(`${layer.toUpperCase()}: ${covered}/${frags.length} cubiertos (${list.length} sin)`);
    if (list.length > 0 && list.length <= 20) {
      list.forEach((l) => console.log(`  ✗ ${l}`));
    } else if (list.length > 20) {
      list.slice(0, 5).forEach((l) => console.log(`  ✗ ${l}`));
      console.log(`  ... y ${list.length - 5} más`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
