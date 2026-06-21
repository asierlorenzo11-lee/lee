import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const p = new PrismaClient({ adapter });
async function main() {
  const cid = await p.fragment.findMany({
    where: { work: { slug: "cantar-de-mio-cid" } },
    select: { slug: true, title: true, artworkImageUrl: true }
  });
  console.log("=== Cantar de Mio Cid ===");
  for (const f of cid) console.log(f.slug + " | " + f.title + " | " + (f.artworkImageUrl ?? "null"));

  const cel = await p.fragment.findMany({
    where: { work: { slug: "la-celestina" } },
    select: { slug: true, title: true, artworkImageUrl: true }
  });
  console.log("\n=== La Celestina ===");
  for (const f of cel) console.log(f.slug + " | " + f.title + " | " + (f.artworkImageUrl ?? "null"));
}
main().then(() => p.$disconnect()).catch(e => { console.error(e); p.$disconnect(); });
