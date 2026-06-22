import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

// Mapeo slug → { portraitUrl, name? }
// Incluye: autores nuevos + extensiones que han cambiado + nombre del Lazarillo
const UPDATES: Record<string, { portraitUrl: string; name?: string }> = {
  // ── Nombre + imagen del Lazarillo ────────────────────────────────────────
  "anonimo-lazarillo-de-tormes": {
    portraitUrl: "/images/authors/anonimo-lazarillo-de-tormes.jpg",
    name: "Anónimo (¿Alfonso de Valdés?)",
  },

  // ── Extensiones que cambiaron en autores existentes ──────────────────────
  "anonimo-romancero-viejo":        { portraitUrl: "/images/authors/anonimo-romancero-viejo.jpg" },
  "arcipreste-de-hita":             { portraitUrl: "/images/authors/arcipreste-de-hita.jpeg" },
  "leandro-fernandez-de-moratin":   { portraitUrl: "/images/authors/leandro-fernandez-de-moratin.webp" },
  "martin-codax":                   { portraitUrl: "/images/authors/martin-codax.jpg" },
  "san-juan-de-la-cruz":            { portraitUrl: "/images/authors/san-juan-de-la-cruz.webp" },

  // ── 16 autores nuevos ────────────────────────────────────────────────────
  "argensola":                      { portraitUrl: "/images/authors/argensola.png" },
  "baltasar-del-alcazar":           { portraitUrl: "/images/authors/baltasar-del-alcazar.jpg" },
  "carolina-coronado":              { portraitUrl: "/images/authors/carolina-coronado.jpg" },
  "conde-de-villamediana":          { portraitUrl: "/images/authors/conde-de-villamediana.jpg" },
  "diego-hurtado-de-mendoza":       { portraitUrl: "/images/authors/diego-hurtado-de-mendoza.jpg" },
  "federico-garcia-lorca":          { portraitUrl: "/images/authors/federico-garcia-lorca.png" },
  "felix-maria-de-samaniego":       { portraitUrl: "/images/authors/felix-maria-de-samaniego.jpg" },
  "florencia-pinar":                { portraitUrl: "/images/authors/florencia-pinar.webp" },
  "gertrudis-gomez-de-avellaneda":  { portraitUrl: "/images/authors/gertrudis-gomez-de-avellaneda.jpg" },
  "gutierre-de-cetina":             { portraitUrl: "/images/authors/gutierre-de-cetina.jpg" },
  "juan-boscan":                    { portraitUrl: "/images/authors/juan-boscan.jpg" },
  "leonor-de-la-cueva-y-silva":     { portraitUrl: "/images/authors/leonor-de-la-cueva-y-silva.jpg" },
  "manuel-machado":                 { portraitUrl: "/images/authors/manuel-machado.jpg" },
  "maria-de-zayas":                 { portraitUrl: "/images/authors/maria-de-zayas.jpg" },
  "polo-de-medina":                 { portraitUrl: "/images/authors/polo-de-medina.jpg" },
  "sor-juana-ines-de-la-cruz":      { portraitUrl: "/images/authors/sor-juana-ines-de-la-cruz.webp" },
};

async function main() {
  for (const [slug, data] of Object.entries(UPDATES)) {
    const author = await prisma.author.findFirst({ where: { slug } });
    if (!author) {
      console.warn(`  ⚠ No encontrado: ${slug}`);
      continue;
    }
    await prisma.author.update({
      where: { id: author.id },
      data: {
        portraitUrl: data.portraitUrl,
        ...(data.name ? { name: data.name } : {}),
      },
    });
    console.log(`  ✓ ${slug}${data.name ? ` → "${data.name}"` : ""}`);
  }
  console.log("\nListo.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
