import "dotenv/config";
import { createClient } from "@libsql/client";

const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient({ url, authToken });

async function main() {
  // Check existing indexes first
  const existing = await client.execute(
    "SELECT name FROM sqlite_master WHERE type='index' ORDER BY name"
  );
  console.log("Existing indexes:", existing.rows.map((r) => r[0]));

  await client.execute(
    `CREATE INDEX IF NOT EXISTS "Fragment_status_workId_idx" ON "Fragment"("status", "workId")`
  );
  console.log("✓ Fragment(status, workId)");

  await client.execute(
    `CREATE INDEX IF NOT EXISTS "Annotation_fragmentId_type_idx" ON "Annotation"("fragmentId", "type")`
  );
  console.log("✓ Annotation(fragmentId, type)");

  console.log("Done.");
}

main()
  .catch(console.error)
  .finally(() => client.close());
