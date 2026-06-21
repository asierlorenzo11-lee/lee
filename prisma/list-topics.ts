import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
const p = new PrismaClient({ adapter: new PrismaLibSql({ url: "file:./prisma/dev.db" }) });
p.topic.findMany({
  select: { slug: true, name: true, description: true, _count: { select: { fragments: { where: { status: "published" } } } } },
  orderBy: { name: "asc" },
}).then(r => console.log(JSON.stringify(r, null, 2))).finally(() => p.$disconnect());
