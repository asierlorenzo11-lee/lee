import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";
import { existsSync } from "fs";
import { join } from "path";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const fragments = await prisma.fragment.findMany({
    where: { status: "published", artworkImageUrl: { not: null } },
    select: { slug: true, headline: true, artworkImageUrl: true },
  });

  const authors = await prisma.author.findMany({
    where: { portraitUrl: { not: null } },
    select: { slug: true, name: true, portraitUrl: true },
  });

  let broken = 0;

  for (const f of fragments) {
    const url = f.artworkImageUrl!;
    // Convert /images/artworks/foo.jpg → public/images/artworks/foo.jpg
    const localPath = join("public", url.startsWith("/") ? url.slice(1) : url);
    if (!existsSync(localPath)) {
      console.log(`❌ FRAGMENT  ${f.slug}`);
      console.log(`   headline: ${f.headline}`);
      console.log(`   url:      ${url}`);
      console.log(`   path:     ${localPath}`);
      broken++;
    }
  }

  for (const a of authors) {
    const url = a.portraitUrl!;
    const localPath = join("public", url.startsWith("/") ? url.slice(1) : url);
    if (!existsSync(localPath)) {
      console.log(`❌ AUTHOR    ${a.slug}`);
      console.log(`   name:     ${a.name}`);
      console.log(`   url:      ${url}`);
      console.log(`   path:     ${localPath}`);
      broken++;
    }
  }

  if (broken === 0) {
    console.log(`✅ Todas las imágenes están presentes (${fragments.length} fragmentos, ${authors.length} autores).`);
  } else {
    console.log(`\n⚠️  ${broken} imagen(es) rotas encontradas.`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
