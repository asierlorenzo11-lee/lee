/**
 * Migra todos los datos de la BD SQLite local a Turso.
 * Uso:
 *   DATABASE_URL="libsql://tu-db.turso.io" TURSO_AUTH_TOKEN="eyJ..." npx tsx prisma/migrate-to-turso.ts
 */
import { PrismaClient as LocalPrisma } from "../src/generated/prisma/client";
import { PrismaLibSql as LocalAdapter } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

// ── Source: local SQLite ─────────────────────────────────────────────────────
const localAdapter = new LocalAdapter({ url: "file:./prisma/dev.db" });
const local = new LocalPrisma({ adapter: localAdapter });

// ── Destination: Turso ───────────────────────────────────────────────────────
const tursoUrl = process.env.DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;
if (!tursoUrl || !tursoToken) {
  console.error("❌ Falta DATABASE_URL o TURSO_AUTH_TOKEN");
  process.exit(1);
}
const turso = createClient({ url: tursoUrl, authToken: tursoToken });

async function exec(sql: string, args: unknown[] = []) {
  await turso.execute({ sql, args: args as import("@libsql/client").InArgs });
}

async function main() {
  console.log("🔄 Leyendo datos locales…");

  // ── Schema: push via Prisma first (run `prisma db push` with TURSO env vars before this script) ──

  // Authors
  const authors = await local.author.findMany();
  console.log(`  → ${authors.length} autores`);
  for (const a of authors) {
    await exec(
      `INSERT OR REPLACE INTO Author (id,slug,name,birthYear,deathYear,country,era,bio,portraitUrl)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [a.id, a.slug, a.name, a.birthYear ?? null, a.deathYear ?? null,
       a.country ?? null, a.era ?? null, a.bio, a.portraitUrl ?? null]
    );
  }

  // Works
  const works = await local.work.findMany();
  console.log(`  → ${works.length} obras`);
  for (const w of works) {
    await exec(
      `INSERT OR REPLACE INTO Work (id,slug,title,translatedTitle,year,era,genre,synopsis,coverImageUrl,authorId)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [w.id, w.slug, w.title, w.translatedTitle ?? null, w.year ?? null,
       w.era ?? null, w.genre, w.synopsis, w.coverImageUrl ?? null, w.authorId]
    );
  }

  // Fragments
  const fragments = await local.fragment.findMany();
  console.log(`  → ${fragments.length} fragmentos`);
  for (const f of fragments) {
    await exec(
      `INSERT OR REPLACE INTO Fragment
       (id,slug,title,location,headline,text,\`order\`,status,featured,featuredDate,
        audioUrl,artworkImageUrl,artworkTitle,artworkAuthor,artworkCaption,workId)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [f.id, f.slug, f.title, f.location, f.headline, f.text, f.order,
       f.status, f.featured ? 1 : 0, f.featuredDate?.toISOString() ?? null,
       f.audioUrl ?? null, f.artworkImageUrl ?? null, f.artworkTitle ?? null,
       f.artworkAuthor ?? null, f.artworkCaption ?? null, f.workId]
    );
  }

  // Constellations
  const constellations = await local.constellation.findMany({ include: { fragments: true } });
  console.log(`  → ${constellations.length} constelaciones`);
  for (const c of constellations) {
    await exec(`INSERT OR REPLACE INTO Constellation (id,slug,name) VALUES (?,?,?)`,
      [c.id, c.slug, c.name]);
    for (const f of c.fragments) {
      await exec(`INSERT OR REPLACE INTO _FragmentConstellations (A,B) VALUES (?,?)`, [f.id, c.id]);
    }
  }

  // Topics
  const topics = await local.topic.findMany({ include: { fragments: true } });
  console.log(`  → ${topics.length} tópicos`);
  for (const t of topics) {
    await exec(`INSERT OR REPLACE INTO Topic (id,slug,name,description) VALUES (?,?,?,?)`,
      [t.id, t.slug, t.name, t.description ?? null]);
    for (const f of t.fragments) {
      await exec(`INSERT OR REPLACE INTO _FragmentTopics (A,B) VALUES (?,?)`, [f.id, t.id]);
    }
  }

  // Characters
  const characters = await local.character.findMany({ include: { fragments: true } });
  console.log(`  → ${characters.length} personajes`);
  for (const c of characters) {
    await exec(`INSERT OR REPLACE INTO Character (id,slug,name) VALUES (?,?,?)`,
      [c.id, c.slug, c.name]);
    for (const f of c.fragments) {
      await exec(`INSERT OR REPLACE INTO _FragmentCharacters (A,B) VALUES (?,?)`, [f.id, c.id]);
    }
  }

  // Places
  const places = await local.place.findMany({ include: { fragments: true } });
  console.log(`  → ${places.length} lugares`);
  for (const p of places) {
    await exec(`INSERT OR REPLACE INTO Place (id,slug,name,lat,lng,description) VALUES (?,?,?,?,?,?)`,
      [p.id, p.slug, p.name, p.lat, p.lng, p.description ?? null]);
    for (const f of p.fragments) {
      await exec(`INSERT OR REPLACE INTO _FragmentPlaces (A,B) VALUES (?,?)`, [f.id, p.id]);
    }
  }

  // Itineraries
  const itineraries = await local.itinerary.findMany({ include: { items: true } });
  console.log(`  → ${itineraries.length} itinerarios`);
  for (const it of itineraries) {
    await exec(`INSERT OR REPLACE INTO Itinerary (id,slug,title,description,\`order\`) VALUES (?,?,?,?,?)`,
      [it.id, it.slug, it.title, it.description, it.order]);
    for (const item of it.items) {
      await exec(
        `INSERT OR REPLACE INTO ItineraryFragment (itineraryId,fragmentId,\`order\`) VALUES (?,?,?)`,
        [item.itineraryId, item.fragmentId, item.order]
      );
    }
  }

  // Annotations
  const annotations = await local.annotation.findMany();
  console.log(`  → ${annotations.length} anotaciones`);
  for (const a of annotations) {
    await exec(
      `INSERT OR REPLACE INTO Annotation
       (id,fragmentId,type,anchorStart,anchorEnd,category,questionGroup,\`order\`,
        content,linkType,linkTargetFragmentId,externalUrl,externalCitation)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [a.id, a.fragmentId, a.type, a.anchorStart ?? null, a.anchorEnd ?? null,
       a.category ?? null, a.questionGroup ?? null, a.order, a.content,
       a.linkType ?? null, a.linkTargetFragmentId ?? null,
       a.externalUrl ?? null, a.externalCitation ?? null]
    );
  }

  console.log("\n✅ Migración completada.");
  await local.$disconnect();
  turso.close();
}

main().catch(e => { console.error(e); process.exit(1); });
