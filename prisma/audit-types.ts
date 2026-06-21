import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

// Layer mapping as used in the UI
const LAYER_TYPES: Record<string, string[]> = {
  "LÉXICO (glosa)":            ["glosa"],
  "CONTEXTO (contexto)":       ["contexto"],
  "ESTILO (figura)":           ["figura"],
  "DEBATE (pregunta)":         ["pregunta"],
  "CONEXIONES (intertextualidad)": ["intertextualidad"],
};

async function main() {
  // 1. Show all distinct annotation types in DB
  const allAnnotations = await prisma.annotation.findMany({
    select: { type: true },
    distinct: ["type"],
  });
  console.log("=== TIPOS DISTINTOS EN DB ===");
  allAnnotations.forEach(a => console.log(`  "${a.type}"`));

  // 2. Count per type
  console.log("\n=== CONTEO POR TIPO ===");
  const counts = await prisma.annotation.groupBy({
    by: ["type"],
    _count: { _all: true },
    orderBy: { _count: { type: "desc" } },
  });
  counts.forEach(c => console.log(`  ${c.type}: ${c._count._all} anotaciones`));

  // 3. Per-layer fragment coverage
  const frags = await prisma.fragment.findMany({
    where: { status: "published" },
    include: { annotations: { select: { type: true } } },
  });
  console.log(`\n=== COBERTURA POR CAPA (${frags.length} fragmentos publicados) ===`);
  for (const [layer, types] of Object.entries(LAYER_TYPES)) {
    const missing = frags.filter(f => !f.annotations.some(a => types.includes(a.type)));
    console.log(`${layer}: ${frags.length - missing.length}/${frags.length} (${missing.length} sin)`);
    if (missing.length > 0 && missing.length <= 10) {
      for (const m of missing) console.log(`  ✗ ${m.slug}`);
    } else if (missing.length > 10) {
      for (const m of missing.slice(0, 5)) console.log(`  ✗ ${m.slug}`);
      console.log(`  ... y ${missing.length - 5} más`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
