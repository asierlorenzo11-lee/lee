import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const p = new PrismaClient({ adapter });
p.fragment.findMany({ where: { artworkImageUrl: { not: null } }, select: { artworkImageUrl: true } })
  .then(r => r.map(f => f.artworkImageUrl!).sort().forEach(u => console.log(u)))
  .finally(() => p.$disconnect());
