import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  const eras = [
    "Al-Ándalus", "Edad Media", "Prerrenacimiento", "Renacimiento",
    "Barroco", "Ilustración", "Romanticismo", "Modernismo", "Generación del 27",
  ];
  for (const era of eras) {
    const f = await prisma.fragment.findFirst({
      where: { status: "published", artworkImageUrl: { not: null }, work: { era } },
      select: { artworkImageUrl: true, artworkTitle: true, headline: true },
    });
    if (f) console.log(`${era}: ${f.artworkImageUrl}`);
    else console.log(`${era}: ❌ sin imagen`);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
