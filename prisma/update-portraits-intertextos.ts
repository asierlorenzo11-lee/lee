import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

const PORTRAITS: Array<{ slug: string; portraitUrl: string }> = [
  { slug: "pablo-neruda",      portraitUrl: "/images/authors/pablo-neruda.jpg" },
  { slug: "blas-de-otero",     portraitUrl: "/images/authors/blas-de-otero.jpg" },
  { slug: "gerardo-diego",     portraitUrl: "/images/authors/gerardo-diego.jpg" },
  { slug: "jose-bergamin",     portraitUrl: "/images/authors/jose-bergamin.jpg" },
  { slug: "dionisio-ridruejo", portraitUrl: "/images/authors/dionisio-ridruejo.jpg" },
  { slug: "tomas-de-iriarte",  portraitUrl: "/images/authors/tomas-de-iriarte.jpg" },
];

async function main() {
  for (const { slug, portraitUrl } of PORTRAITS) {
    const updated = await prisma.author.update({
      where: { slug },
      data: { portraitUrl },
      select: { slug: true, name: true },
    });
    console.log(`✓ [${updated.slug}] ${updated.name} → ${portraitUrl}`);
  }
  console.log(`\n✅ ${PORTRAITS.length} retratos actualizados.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
