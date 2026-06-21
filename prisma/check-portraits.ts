import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const p = new PrismaClient({ adapter });
p.author.findMany({ select: { name: true, slug: true, portraitUrl: true }, orderBy: { name: "asc" } })
  .then(authors => {
    const noPortrait = authors.filter(a => !a.portraitUrl);
    const hasPortrait = authors.filter(a => !!a.portraitUrl);
    console.log(`\nSIN RETRATO (${noPortrait.length}):`);
    noPortrait.forEach(a => console.log(`  ${a.name}`));
    console.log(`\nCON RETRATO (${hasPortrait.length}):`);
    hasPortrait.forEach(a => console.log(`  ${a.name.padEnd(40)} ${a.portraitUrl!.substring(0,80)}`));
  })
  .finally(() => p.$disconnect());
