/**
 * Diagnose why _FragmentConstellations inserts fail.
 * Check local schema and try both column orders.
 */
import { createClient as createLocal } from "@libsql/client";
import { createClient } from "@libsql/client";

const local = createLocal({ url: "file:./prisma/dev.db" });
const turso = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function main() {
  // 1. Get the CREATE TABLE SQL for the join table from local SQLite
  const schema = await local.execute(
    `SELECT sql FROM sqlite_master WHERE name = '_FragmentConstellations'`
  );
  console.log("Local schema:");
  console.log(schema.rows[0]?.sql);
  console.log();

  const schemaTurso = await turso.execute(
    `SELECT sql FROM sqlite_master WHERE name = '_FragmentConstellations'`
  );
  console.log("Turso schema:");
  console.log(schemaTurso.rows[0]?.sql);
  console.log();

  // 2. Get a sample row from local _FragmentConstellations
  const sample = await local.execute(`SELECT A, B FROM _FragmentConstellations LIMIT 3`);
  console.log("Sample local _FragmentConstellations rows:", sample.rows);

  // 3. Check if A or B matches Constellation IDs
  const constellations = await local.execute(`SELECT id, slug FROM Constellation LIMIT 5`);
  console.log("\nLocal Constellation IDs:", constellations.rows);

  // 4. Check if A or B matches Fragment IDs
  const fragments = await local.execute(`SELECT id FROM Fragment LIMIT 3`);
  console.log("\nLocal Fragment IDs (first 3):", fragments.rows);

  local.close();
  turso.close();
}

main().catch(console.error);
