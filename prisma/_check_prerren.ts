import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const a = await prisma.author.findUnique({
    where: { slug: "garci-rodriguez-de-montalvo" },
    include: { works: { include: { fragments: true } } },
  });
  console.log("MONTALVO:", JSON.stringify(a, null, 2));

  // Also check manrique works era
  const m = await prisma.author.findUnique({
    where: { slug: "jorge-manrique" },
    include: { works: { select: { id: true, slug: true, title: true, era: true } } },
  });
  console.log("\nMANRIQUE:", JSON.stringify(m, null, 2));

  // Florencia Pinar
  const fp = await prisma.author.findUnique({
    where: { slug: "florencia-pinar" },
    select: { era: true },
  });
  console.log("\nFLORENCIA PINAR era:", fp?.era);

  // Anónimo Cancionero
  const canc = await prisma.author.findUnique({
    where: { slug: "anonimo-cancionero-medieval" },
    select: { era: true, name: true },
  });
  console.log("CANCIONERO MEDIEVAL era:", canc);
}

main().catch(console.error).finally(() => prisma.$disconnect());
