/**
 * Auditoría real de visibilidad de capas.
 * Una capa es "visible" si tiene al menos una anotación MOSTRABLE:
 *   - glosa, figura, intertextualidad, contexto → requieren anchorStart + anchorEnd
 *   - pregunta → requiere questionGroup IN (literal|interpretativo|valorativo)
 */
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

const VALID_GROUPS = new Set(["literal", "interpretativo", "valorativo"]);

type RawAnnotation = { type: string; anchorStart: number | null; anchorEnd: number | null; questionGroup: string | null };

function isDisplayable(a: RawAnnotation): boolean {
  if (a.type === "pregunta") return VALID_GROUPS.has(a.questionGroup ?? "");
  return a.anchorStart != null && a.anchorEnd != null;
}

async function main() {
  const frags = await prisma.fragment.findMany({
    where: { status: "published" },
    include: {
      annotations: {
        select: { type: true, anchorStart: true, anchorEnd: true, questionGroup: true },
      },
      work: { include: { author: true } },
    },
    orderBy: [{ work: { author: { name: "asc" } } }, { order: "asc" }],
  });

  const LAYERS: { label: string; types: string[] }[] = [
    { label: "LÉXICO (glosa)",           types: ["glosa"] },
    { label: "CONTEXTO (contexto)",      types: ["contexto"] },
    { label: "ESTILO (figura)",          types: ["figura"] },
    { label: "DEBATE (pregunta)",        types: ["pregunta"] },
    { label: "CONEXIONES (intertext.)", types: ["intertextualidad"] },
  ];

  console.log(`=== COBERTURA REAL (${frags.length} fragmentos publicados) ===\n`);

  for (const layer of LAYERS) {
    const missing = frags.filter(
      (f) => !f.annotations.some((a) => layer.types.includes(a.type) && isDisplayable(a)),
    );
    console.log(`${layer.label}: ${frags.length - missing.length}/${frags.length} visibles (${missing.length} sin)`);
    if (missing.length > 0) {
      const show = missing.slice(0, 30);
      for (const m of show) {
        const rawAnnos = m.annotations.filter((a) => layer.types.includes(a.type));
        const detail = rawAnnos.length === 0 ? "sin anotaciones" : `${rawAnnos.length} anotaciones no mostrables`;
        console.log(`  ✗ ${m.slug}  [${detail}]`);
      }
      if (missing.length > 30) console.log(`  ... y ${missing.length - 30} más`);
    }
    console.log();
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
