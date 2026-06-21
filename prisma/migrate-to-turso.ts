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

async function exec(sql: string, args: unknown[] = [], ignore = false) {
  try {
    await turso.execute({ sql, args: args as import("@libsql/client").InArgs });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (ignore) {
      console.warn(`  ⚠ SKIP: ${msg} | args=${JSON.stringify(args).slice(0,120)}`);
    } else {
      console.error(`  ✗ FAIL: ${msg} | sql=${sql.slice(0,60)} | args=${JSON.stringify(args).slice(0,120)}`);
      throw e;
    }
  }
}

async function main() {
  // ── 1. Leer todos los datos locales primero ──────────────────────────────
  console.log("🔄 Leyendo datos locales…");
  const authors       = await local.author.findMany();
  const works         = await local.work.findMany();
  const fragments     = await local.fragment.findMany();
  const constellations = await local.constellation.findMany({ include: { fragments: true } });
  const topics        = await local.topic.findMany({ include: { fragments: true } });
  const characters    = await local.character.findMany({ include: { fragments: true } });
  const places        = await local.place.findMany({ include: { fragments: true } });
  const itineraries   = await local.itinerary.findMany({ include: { items: true } });
  const annotations   = await local.annotation.findMany();

  console.log(`  ${authors.length} autores, ${works.length} obras, ${fragments.length} fragmentos`);
  console.log(`  ${constellations.length} constelaciones, ${topics.length} tópicos, ${characters.length} personajes`);
  console.log(`  ${places.length} lugares, ${itineraries.length} itinerarios, ${annotations.length} anotaciones`);

  // ── 2. Limpiar Turso en orden inverso de dependencias ───────────────────
  console.log("\n🗑  Limpiando Turso (orden FK-safe)…");
  await exec("DELETE FROM _FragmentConstellations");
  await exec("DELETE FROM _FragmentTopics");
  await exec("DELETE FROM _FragmentCharacters");
  await exec("DELETE FROM _FragmentPlaces");
  await exec("DELETE FROM ItineraryFragment");
  await exec("DELETE FROM Annotation");
  await exec("DELETE FROM Fragment");
  await exec("DELETE FROM Work");
  await exec("DELETE FROM Itinerary");
  await exec("DELETE FROM Constellation");
  await exec("DELETE FROM Topic");
  await exec("DELETE FROM Character");
  await exec("DELETE FROM Place");
  await exec("DELETE FROM Author");
  console.log("  ✓ Tablas vaciadas");

  // ── 3. Insertar en orden FK-safe (padres antes que hijos) ───────────────
  console.log("\n📥 Insertando datos…");

  // Authors (sin FK salientes)
  for (const a of authors) {
    await exec(
      `INSERT INTO Author (id,slug,name,birthYear,deathYear,country,era,bio,portraitUrl)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [a.id, a.slug, a.name, a.birthYear ?? null, a.deathYear ?? null,
       a.country ?? null, a.era ?? null, a.bio, a.portraitUrl ?? null]
    );
  }
  console.log(`  ✓ ${authors.length} autores`);

  // Works (FK → Author)
  for (const w of works) {
    await exec(
      `INSERT INTO Work (id,slug,title,translatedTitle,year,era,genre,synopsis,coverImageUrl,authorId)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [w.id, w.slug, w.title, w.translatedTitle ?? null, w.year ?? null,
       w.era ?? null, w.genre, w.synopsis, w.coverImageUrl ?? null, w.authorId]
    );
  }
  console.log(`  ✓ ${works.length} obras`);

  // Fragments (FK → Work)
  for (const f of fragments) {
    await exec(
      `INSERT INTO Fragment
       (id,slug,title,location,headline,text,\`order\`,status,featured,featuredDate,
        audioUrl,artworkImageUrl,artworkTitle,artworkAuthor,artworkCaption,workId)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [f.id, f.slug, f.title, f.location, f.headline, f.text, f.order,
       f.status, f.featured ? 1 : 0, f.featuredDate?.toISOString() ?? null,
       f.audioUrl ?? null, f.artworkImageUrl ?? null, f.artworkTitle ?? null,
       f.artworkAuthor ?? null, f.artworkCaption ?? null, f.workId]
    );
  }
  console.log(`  ✓ ${fragments.length} fragmentos`);

  // Constellations (sin FK salientes)
  for (const c of constellations) {
    await exec(`INSERT INTO Constellation (id,slug,name) VALUES (?,?,?)`,
      [c.id, c.slug, c.name]);
  }
  console.log(`  ✓ ${constellations.length} constelaciones`);

  // Topics
  for (const t of topics) {
    await exec(`INSERT INTO Topic (id,slug,name,description) VALUES (?,?,?,?)`,
      [t.id, t.slug, t.name, t.description ?? null]);
  }
  console.log(`  ✓ ${topics.length} tópicos`);

  // Characters
  for (const c of characters) {
    await exec(`INSERT INTO Character (id,slug,name) VALUES (?,?,?)`,
      [c.id, c.slug, c.name]);
  }
  console.log(`  ✓ ${characters.length} personajes`);

  // Places
  for (const p of places) {
    await exec(`INSERT INTO Place (id,slug,name,lat,lng,description) VALUES (?,?,?,?,?,?)`,
      [p.id, p.slug, p.name, p.lat, p.lng, p.description ?? null]);
  }
  console.log(`  ✓ ${places.length} lugares`);

  // Itineraries
  for (const it of itineraries) {
    await exec(`INSERT INTO Itinerary (id,slug,title,description,\`order\`) VALUES (?,?,?,?,?)`,
      [it.id, it.slug, it.title, it.description, it.order]);
  }
  console.log(`  ✓ ${itineraries.length} itinerarios`);

  // Índice de fragmentos insertados para validar antes de insertar join
  const fragmentIds = new Set(fragments.map(f => f.id));

  // Join tables (todos los padres ya existen)
  let joinCount = 0;
  let joinSkipped = 0;
  // Column order: A = first model alphabetically, B = second
  // _FragmentConstellations: A=Constellation, B=Fragment  (C < F)
  // _FragmentCharacters:     A=Character,     B=Fragment  (C < F)
  // _FragmentTopics:         A=Fragment,      B=Topic     (F < T)
  // _FragmentPlaces:         A=Fragment,      B=Place     (F < P)
  for (const c of constellations) {
    for (const f of c.fragments) {
      if (!fragmentIds.has(f.id)) { joinSkipped++; continue; }
      await exec(`INSERT INTO _FragmentConstellations (A,B) VALUES (?,?)`, [c.id, f.id], true);
      joinCount++;
    }
  }
  for (const t of topics) {
    for (const f of t.fragments) {
      if (!fragmentIds.has(f.id)) { joinSkipped++; continue; }
      await exec(`INSERT INTO _FragmentTopics (A,B) VALUES (?,?)`, [f.id, t.id], true);
      joinCount++;
    }
  }
  for (const c of characters) {
    for (const f of c.fragments) {
      if (!fragmentIds.has(f.id)) { joinSkipped++; continue; }
      await exec(`INSERT INTO _FragmentCharacters (A,B) VALUES (?,?)`, [c.id, f.id], true);
      joinCount++;
    }
  }
  for (const p of places) {
    for (const f of p.fragments) {
      if (!fragmentIds.has(f.id)) { joinSkipped++; continue; }
      await exec(`INSERT INTO _FragmentPlaces (A,B) VALUES (?,?)`, [f.id, p.id], true);
      joinCount++;
    }
  }
  if (joinSkipped > 0) console.warn(`  ⚠ ${joinSkipped} relaciones omitidas (fragmento no encontrado)`);
  console.log(`  ✓ ${joinCount} relaciones many-to-many`);

  // ItineraryFragment
  let ifCount = 0;
  for (const it of itineraries) {
    for (const item of it.items) {
      await exec(
        `INSERT INTO ItineraryFragment (itineraryId,fragmentId,\`order\`) VALUES (?,?,?)`,
        [item.itineraryId, item.fragmentId, item.order], true
      );
      ifCount++;
    }
  }
  console.log(`  ✓ ${ifCount} entradas de itinerario`);

  // Annotations
  for (const a of annotations) {
    await exec(
      `INSERT INTO Annotation
       (id,fragmentId,type,anchorStart,anchorEnd,category,questionGroup,\`order\`,
        content,linkType,linkTargetFragmentId,externalUrl,externalCitation)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [a.id, a.fragmentId, a.type, a.anchorStart ?? null, a.anchorEnd ?? null,
       a.category ?? null, a.questionGroup ?? null, a.order, a.content,
       a.linkType ?? null, a.linkTargetFragmentId ?? null,
       a.externalUrl ?? null, a.externalCitation ?? null]
    );
  }
  console.log(`  ✓ ${annotations.length} anotaciones`);

  console.log("\n✅ Migración completada.");
  await local.$disconnect();
  turso.close();
}

main().catch(e => { console.error(e); process.exit(1); });
