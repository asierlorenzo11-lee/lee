/**
 * Inserta las join tables que fallaron por orden incorrecto de columnas.
 * A = primer modelo alfabéticamente, B = segundo.
 * _FragmentConstellations: A=Constellation, B=Fragment
 * _FragmentCharacters:     A=Character,     B=Fragment
 */
import { PrismaClient as LocalPrisma } from "../src/generated/prisma/client";
import { PrismaLibSql as LocalAdapter } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const localAdapter = new LocalAdapter({ url: "file:./prisma/dev.db" });
const local = new LocalPrisma({ adapter: localAdapter });

const turso = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function exec(sql: string, args: unknown[]) {
  await turso.execute({ sql, args: args as import("@libsql/client").InArgs });
}

async function main() {
  // Clear existing (empty) join tables first
  await turso.execute("DELETE FROM _FragmentConstellations");
  await turso.execute("DELETE FROM _FragmentCharacters");

  // _FragmentConstellations: A=Constellation.id, B=Fragment.id
  const constellations = await local.constellation.findMany({ include: { fragments: true } });
  let n = 0;
  for (const c of constellations) {
    for (const f of c.fragments) {
      await exec(`INSERT INTO _FragmentConstellations (A,B) VALUES (?,?)`, [c.id, f.id]);
      n++;
    }
  }
  console.log(`✓ _FragmentConstellations: ${n} filas`);

  // _FragmentCharacters: A=Character.id, B=Fragment.id
  const characters = await local.character.findMany({ include: { fragments: true } });
  let m = 0;
  for (const c of characters) {
    for (const f of c.fragments) {
      await exec(`INSERT INTO _FragmentCharacters (A,B) VALUES (?,?)`, [c.id, f.id]);
      m++;
    }
  }
  console.log(`✓ _FragmentCharacters: ${m} filas`);

  console.log("\n✅ Join tables reparadas.");
  await local.$disconnect();
  turso.close();
}

main().catch(e => { console.error(e); process.exit(1); });
