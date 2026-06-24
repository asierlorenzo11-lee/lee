import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const r1 = await prisma.author.update({
    where: { slug: "gaspar-melchor-de-jovellanos" },
    data: { portraitUrl: "/images/authors/gaspar-melchor-de-jovellanos.jpg" },
  });
  console.log(`✓ ${r1.slug} → ${r1.portraitUrl}`);

  const r2 = await prisma.author.update({
    where: { slug: "benito-jeronimo-feijoo" },
    data: { portraitUrl: "/images/authors/benito-jeronimo-feijoo.jpg" },
  });
  console.log(`✓ ${r2.slug} → ${r2.portraitUrl}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
