import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const p = new PrismaClient({ adapter });

async function main() {
  const frag = await p.fragment.findUnique({ where: { slug: "ya-cantan-los-gallos" } });
  if (!frag) throw new Error("Fragment not found");

  const needle = "cata que amanece";
  const s = frag.text.indexOf(needle);
  if (s === -1) throw new Error("Needle not found in text");

  // Find the unanchored glosa for Cata
  const ann = await p.annotation.findFirst({
    where: { fragmentId: frag.id, type: "glosa", anchorStart: null },
  });
  if (!ann) { console.log("No unanchored glosa found"); return; }

  await p.annotation.update({
    where: { id: ann.id },
    data: { anchorStart: s, anchorEnd: s + needle.length },
  });
  console.log(`✓ Patched glosa anchor: "${needle}" at [${s}, ${s + needle.length}]`);
}

main().catch(console.error).finally(() => p.$disconnect());
