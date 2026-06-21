import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const fragments = await prisma.fragment.findMany({
    where: { status: "published" },
    select: {
      slug: true,
      title: true,
      text: true,
      work: { select: { title: true } },
    },
    orderBy: [{ work: { title: "asc" } }, { order: "asc" }],
  });

  console.log(`Total fragmentos: ${fragments.length}\n`);

  const issues: string[] = [];

  for (const f of fragments) {
    const t = f.text;
    const label = `[${f.work.title}] ${f.slug}`;

    if (!t || t.trim().length === 0) {
      issues.push(`VACÍO: ${label}`);
      continue;
    }

    if (t.trim().length < 100) {
      issues.push(`MUY CORTO (${t.trim().length} chars): ${label}`);
    }

    // Check for Windows line endings (\r\n) mixed in
    if (t.includes("\r\n") || t.includes("\r")) {
      issues.push(`CRLF/CR: ${label}`);
    }

    // Check for HTML tags accidentally left in
    if (/<[a-z]+[\s>]/i.test(t)) {
      issues.push(`HTML TAGS: ${label}`);
    }

    // Check for consecutive blank lines (more than 2)
    if (/\n{4,}/.test(t)) {
      issues.push(`EXCESO BLANCOS: ${label}`);
    }

    // Print the first 120 chars of each fragment as a sanity check
    const preview = t.replace(/\n/g, "↵").slice(0, 120);
    console.log(`${label}`);
    console.log(`  «${f.title}»`);
    console.log(`  ${preview}`);
    console.log();
  }

  console.log("\n=== PROBLEMAS DETECTADOS ===\n");
  if (issues.length === 0) {
    console.log("Ninguno.");
  } else {
    issues.forEach((i) => console.log("  ⚠ " + i));
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
