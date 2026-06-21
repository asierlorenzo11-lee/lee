import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const p = new PrismaClient({ adapter: new PrismaLibSql({ url: "file:./prisma/dev.db" }) });

async function main() {
  const authors = await p.author.findMany({ orderBy: { name: "asc" }, select: { name: true, slug: true, portraitUrl: true } });
  for (const a of authors) {
    const url = a.portraitUrl || "(ninguna)";
    const isLocal = url.startsWith("/images/");
    console.log(isLocal ? "LOCAL  " : "EXTERNO", "|", a.slug, "|", url.substring(0, 90));
  }
}

main().catch(console.error).finally(() => p.$disconnect());
