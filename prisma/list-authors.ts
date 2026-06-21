import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const p = new PrismaClient({ adapter });
p.author.findMany({ select: { id: true, name: true, slug: true }, orderBy: { name: "asc" } })
  .then(a => a.forEach(x => console.log(x.slug.padEnd(35), x.name)))
  .finally(() => p.$disconnect());
