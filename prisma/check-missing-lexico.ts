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

  const missing = frags.filter(
    (f) => !f.annotations.some((a) => a.type === "glosa"),
  );

  console.log(`Fragmentos sin glosa: ${missing.length}`);
  missing.forEach((f) =>
    console.log(`  "${f.slug}" | ${f.work.author.name} | ${f.work.title} | ${f.title}`),
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
