import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("\n=== FRAGMENTOS ===");
  const frags = await prisma.fragment.findMany({
    select: { slug: true, artworkImageUrl: true },
    orderBy: { slug: "asc" },
  });
  frags.forEach((f) =>
    console.log(f.artworkImageUrl ? "OK" : "NO", f.slug, "|", f.artworkImageUrl ?? "")
  );

  console.log("\n=== AUTORES ===");
  const authors = await prisma.author.findMany({
    select: { slug: true, portraitUrl: true },
    orderBy: { slug: "asc" },
  });
  authors.forEach((a) =>
    console.log(a.portraitUrl ? "OK" : "NO", a.slug, "|", a.portraitUrl ?? "")
  );
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
