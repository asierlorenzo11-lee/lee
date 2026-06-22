import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const slugs = [
    "don-alvaro-misterio-y-amor",
    "don-alvaro-soldado-de-fortuna",
    "don-alvaro-precipicio-final",
  ];
  for (const slug of slugs) {
    const f = await prisma.fragment.findUnique({ where: { slug } });
    if (!f) { console.log(`NO: ${slug}`); continue; }
    console.log(`\n[${slug}]`);
    console.log(`  headline:  ${f.headline}`);
    console.log(`  image:     ${f.artworkImageUrl ?? "(sin imagen)"}`);
    console.log(`  title:     ${f.artworkTitle ?? "-"}`);
    console.log(`  author:    ${f.artworkAuthor ?? "-"}`);
    console.log(`  caption:   ${f.artworkCaption ?? "-"}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
