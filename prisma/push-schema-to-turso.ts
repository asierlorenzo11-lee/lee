/**
 * Crea el esquema (tablas) en Turso leyéndolo de la BD SQLite local.
 * Uso: DATABASE_URL="libsql://..." TURSO_AUTH_TOKEN="eyJ..." npx tsx prisma/push-schema-to-turso.ts
 */
import { createClient } from "@libsql/client";

const localClient = createClient({ url: "file:./prisma/dev.db" });

const tursoUrl = process.env.DATABASE_URL!;
const tursoToken = process.env.TURSO_AUTH_TOKEN!;
if (!tursoUrl || !tursoToken) {
  console.error("❌ Falta DATABASE_URL o TURSO_AUTH_TOKEN");
  process.exit(1);
}
const turso = createClient({ url: tursoUrl, authToken: tursoToken });

async function main() {
  // Read all CREATE TABLE / CREATE UNIQUE INDEX statements from local SQLite
  const result = await localClient.execute(
    `SELECT sql FROM sqlite_master WHERE sql IS NOT NULL ORDER BY rootpage`
  );

  console.log(`📋 ${result.rows.length} objetos encontrados en SQLite local`);

  for (const row of result.rows) {
    const sql = row.sql as string;
    if (!sql) continue;
    try {
      await turso.execute(sql);
      const name = sql.slice(0, 60).replace(/\n/g, " ");
      console.log(`  ✓ ${name}…`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("already exists")) {
        console.log(`  ↩ ya existe: ${sql.slice(0, 50).replace(/\n/g, " ")}…`);
      } else {
        console.error(`  ✗ ERROR: ${msg}\n    SQL: ${sql.slice(0, 80)}`);
      }
    }
  }

  console.log("\n✅ Esquema aplicado a Turso.");
  localClient.close();
  turso.close();
}

main().catch(e => { console.error(e); process.exit(1); });
