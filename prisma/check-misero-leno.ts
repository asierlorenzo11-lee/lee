import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const f = await prisma.fragment.findUnique({
    where: { slug: "misero-leno-soneto" },
    include: { annotations: true },
  });
  if (!f) { console.log("NO encontrado"); return; }
  console.log("artwork:", f.artworkImageUrl, "|", f.artworkTitle, "|", f.artworkAuthor);
  console.log("artworkCaption:", f.artworkCaption);
  console.log("\n--- ANOTACIONES ---");
  for (const ann of f.annotations) {
    console.log(`\n[${ann.type}] cat=${ann.category ?? "-"} qg=${ann.questionGroup ?? "-"}`);
    console.log(ann.content);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
