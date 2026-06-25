import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

prisma.author
  .update({
    where: { slug: "leon-de-arroyal" },
    data: { portraitUrl: "/images/authors/leon-de-arroyal.webp" },
  })
  .then((r) => console.log(`✓ ${r.slug} → ${r.portraitUrl}`))
  .finally(() => prisma.$disconnect());
