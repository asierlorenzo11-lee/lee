import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const p = new PrismaClient({ adapter });
async function main() {
  // Verify & fix era on Villancicos work
  const w = await p.work.findFirst({ where: { slug: "villancicos-medievales" }, select: { id: true, title: true, era: true, year: true } });
  if (!w) throw new Error("Obra no encontrada");
  console.log("Antes:", w);
  if (w.era !== "Medieval") {
    await p.work.update({ where: { id: w.id }, data: { era: "Medieval" } });
    console.log("Actualizado → era: Medieval");
  } else {
    console.log("OK — ya tiene era: Medieval");
  }
  // Also fix the author era if missing
  const a = await p.author.findUnique({ where: { slug: "anonimo-cancionero-medieval" }, select: { id: true, era: true } });
  if (a && a.era !== "Medieval") {
    await p.author.update({ where: { id: a.id }, data: { era: "Medieval" } });
    console.log("Autor actualizado → era: Medieval");
  }
}
main().catch(console.error).finally(() => p.$disconnect());
