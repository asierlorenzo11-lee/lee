import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Find Argensola author
  const author = await prisma.author.findFirst({
    where: { slug: { contains: "argensola" } },
    select: { slug: true, name: true, portraitUrl: true },
  });
  console.log("Found:", JSON.stringify(author));

  if (!author) { console.log("No author found"); return; }

  const r = await prisma.author.update({
    where: { slug: author.slug },
    data: { portraitUrl: "/images/authors/argensola.png" },
  });
  console.log(`✓ ${r.slug} (${r.name}) → ${r.portraitUrl}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
