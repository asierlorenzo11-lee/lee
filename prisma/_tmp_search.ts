import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const p = new PrismaClient({ adapter });
async function main() {
  const frags = await p.fragment.findMany({
    where: { work: { slug: "la-celestina" } },
    select: { slug: true, title: true, headline: true, text: true }
  });
  for (const f of frags) {
    if (f.text.toLowerCase().includes("quemada") || f.headline?.toLowerCase().includes("quemada")) {
      console.log("FOUND: " + f.slug);
      console.log("title: " + f.title);
      console.log("headline: " + f.headline);
      console.log("text (first 300): " + f.text.substring(0, 300));
    }
  }
}
main().then(() => p.$disconnect()).catch(e => { console.error(e); p.$disconnect(); });
