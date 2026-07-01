import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

const ERA = "Prerrenacimiento";

async function moveAuthorAndWorks(slug: string) {
  const author = await prisma.author.findUniqueOrThrow({
    where: { slug },
    include: { works: { select: { id: true, slug: true } } },
  });
  await prisma.author.update({ where: { slug }, data: { era: ERA } });
  for (const w of author.works) {
    await prisma.work.update({ where: { id: w.id }, data: { era: ERA } });
  }
  console.log(`✓ ${author.name} → ${ERA} (${author.works.length} obras)`);
}

async function main() {
  await moveAuthorAndWorks("jorge-manrique");
  await moveAuthorAndWorks("garci-rodriguez-de-montalvo");
  await moveAuthorAndWorks("florencia-pinar");
  await moveAuthorAndWorks("anonimo-cancionero-medieval");
  console.log("\n✅ Eras actualizadas.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
