import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function main() {
  const tables = [
    "Author","Work","Fragment","Constellation","Character",
    "Place","Topic","_FragmentConstellations","_FragmentCharacters",
    "_FragmentTopics","_FragmentPlaces","ItineraryFragment","Annotation"
  ];
  for (const t of tables) {
    const r = await turso.execute(`SELECT COUNT(*) as n FROM "${t}"`);
    console.log(`${t}: ${r.rows[0].n}`);
  }
  turso.close();
}

main().catch(console.error);
