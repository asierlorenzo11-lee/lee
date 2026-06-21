import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
const p = new PrismaClient({ adapter: new PrismaLibSql({ url: "file:./prisma/dev.db" }) });
p.constellation.findMany({
  include: {
    fragments: {
      where: { status: "published" },
      select: { slug: true, title: true, work: { select: { author: { select: { name: true } } } } },
      take: 10,
    },
  },
  orderBy: { name: "asc" },
}).then(r => console.log(JSON.stringify(r, null, 2))).finally(() => p.$disconnect());
