import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const slugs = ["jose-bergamin", "pablo-neruda", "dionisio-ridruejo", "blas-de-otero"];
  for (const slug of slugs) {
    const a = await prisma.author.findUnique({
      where: { slug },
      include: { works: { include: { fragments: { include: { annotations: true } } } } },
    });
    if (!a) { console.log(`FALTA: ${slug}`); continue; }
    const frags = a.works.flatMap((w) => w.fragments);
    const anns = frags.flatMap((f) => f.annotations);
    console.log(`✓ ${a.name} (${a.era}) — ${frags.length} frag, ${anns.length} anot`);
    for (const f of frags) {
      console.log(`  └─ [${f.slug}] "${f.headline}"`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
