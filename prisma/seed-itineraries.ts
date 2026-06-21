import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const p = new PrismaClient({ adapter: new PrismaLibSql({ url: "file:./prisma/dev.db" }) });

// Helper: upsert itinerary + its ordered fragment items
async function upsertItinerary(data: {
  slug: string;
  title: string;
  description: string;
  order: number;
  fragmentSlugs: string[];
}) {
  // Resolve fragment IDs
  const fragments = await p.fragment.findMany({
    where: { slug: { in: data.fragmentSlugs } },
    select: { id: true, slug: true },
  });
  const bySlug = Object.fromEntries(fragments.map(f => [f.slug, f.id]));

  const missing = data.fragmentSlugs.filter(s => !bySlug[s]);
  if (missing.length) console.warn(`  ⚠ Slugs not found for "${data.title}":`, missing);

  // Upsert itinerary
  const it = await p.itinerary.upsert({
    where: { slug: data.slug },
    create: { slug: data.slug, title: data.title, description: data.description, order: data.order },
    update: { title: data.title, description: data.description, order: data.order },
  });

  // Replace all items
  await p.itineraryFragment.deleteMany({ where: { itineraryId: it.id } });
  let order = 1;
  for (const slug of data.fragmentSlugs) {
    const fragId = bySlug[slug];
    if (!fragId) continue;
    await p.itineraryFragment.create({ data: { itineraryId: it.id, fragmentId: fragId, order: order++ } });
  }
  console.log(`✓ ${data.title} (${order - 1} paradas)`);
}

async function main() {
  // ── Existing: fix order only ──────────────────────────────────────────────
  await p.itinerary.update({ where: { slug: "nombrar-el-amor" }, data: { order: 1 } });
  console.log("✓ Nombrar el amor → orden 1");

  await p.itinerary.update({ where: { slug: "nombrar-el-valor" }, data: { order: 2 } });
  console.log("✓ Nombrar el valor → orden 2");

  // ── Delete old "Amor y muerte" (will be replaced by "Nombrar la muerte") ─
  const old = await p.itinerary.findUnique({ where: { slug: "amor-y-muerte" } });
  if (old) {
    await p.itineraryFragment.deleteMany({ where: { itineraryId: old.id } });
    await p.itinerary.delete({ where: { slug: "amor-y-muerte" } });
    console.log("✓ Eliminado itinerario «Amor y muerte»");
  }

  // ── New itineraries ───────────────────────────────────────────────────────

  await upsertItinerary({
    slug: "nombrar-la-muerte",
    title: "Nombrar la muerte",
    description: "Nueve textos que miran la muerte de frente: desde la Muerte que se dirige en persona a sus víctimas en la danza macabra medieval hasta Lorca, que la convierte en luna. En el camino, Manrique pregunta qué se hizo todo lo que fue, Rojas hace llorar a un padre ante el cadáver de su hija, Quevedo transforma el polvo en amor eterno, Calderón convierte la vida en sueño y Larra pasea por un Madrid que es ya un cementerio.",
    order: 3,
    fragmentSlugs: [
      "yo-soy-la-muerte-cierta",          // Danza de la muerte
      "romance-del-enamorado-y-la-muerte", // Romancero
      "nuestras-vidas-son-los-rios",       // Manrique
      "muerte-de-celestina",               // Rojas
      "planto-de-pleberio",                // Rojas
      "amor-constante-mas-alla-de-la-muerte", // Quevedo
      "los-suenos-suenos-son",             // Calderón
      "el-dia-de-difuntos-de-1836",        // Larra
      "romance-de-la-luna-luna",           // Lorca
    ],
  });

  await upsertItinerary({
    slug: "nombrar-el-tiempo",
    title: "Nombrar el tiempo",
    description: "Seis textos que nombran el tiempo de maneras distintas: la añoranza de lo que fue (ubi sunt), la urgencia de vivir antes de que la belleza se marchite (carpe diem), la constatación de que ayer ya fue y mañana aún no ha llegado (tempus fugit), y la certeza de que las golondrinas volverán pero el amor perdido, no. De Manrique a Bécquer, la literatura española no deja de mirar el reloj.",
    order: 4,
    fragmentSlugs: [
      "anoranza-de-los-tiempos-pasados",   // Manrique — ubi sunt
      "soneto-xxiii",                       // Garcilaso — carpe diem
      "mientras-por-competir-con-tu-cabello", // Góngora — carpe diem
      "fue-sueno-ayer-manana-sera-tierra",  // Quevedo — tempus fugit
      "este-que-ves-engano-colorido",       // Sor Juana — tiempo y vanidad
      "rima-liii",                          // Bécquer — "Volverán las golondrinas"
    ],
  });

  await upsertItinerary({
    slug: "nombrar-la-fe",
    title: "Nombrar la fe",
    description: "Ocho textos que nombran la fe desde sus extremos: la devoción sencilla de Berceo, que cuenta milagros de la Virgen con palabras de aldeano; el arrebato místico de Santa Teresa y San Juan de la Cruz, que describen la unión con Dios como un amor imposible de decir; y la serenidad contemplativa de Fray Luis, que mira las estrellas y ve el orden de lo eterno. La fe como búsqueda, como llama y como reposo.",
    order: 5,
    fragmentSlugs: [
      "quiero-fer-una-prosa",              // Berceo — dedicatoria
      "el-prado-alegorico",                // Berceo — locus amoenus espiritual
      "vivo-sin-vivir-en-mi",              // Santa Teresa — paradoja mística
      "noche-oscura-del-alma",             // San Juan — la noche oscura
      "cantico-espiritual-la-busqueda",    // San Juan — búsqueda del amado
      "llama-de-amor-viva",                // San Juan — la llama
      "la-vida-retirada",                  // Fray Luis — beatus ille
      "noche-serena",                      // Fray Luis — contemplación
    ],
  });

  await upsertItinerary({
    slug: "nombrar-el-poder",
    title: "Nombrar el poder",
    description: "Ocho textos que nombran el poder: quién lo tiene, quién lo pierde, quién lo desafía y quién lo denuncia. El Romancero mide la lealtad de los reyes; El conde Lucanor aconseja a los poderosos; Lope muestra a un pueblo que se levanta; Sor Juana desafía el poder masculino con la sola arma del argumento; Quevedo convierte el dinero en amo universal; y Larra retrata a la burocracia española como un poder sordo que responde a todo con «vuelva usted mañana».",
    order: 6,
    fragmentSlugs: [
      "el-deber-del-conde-fernan-gonzalez", // D. Juan Manuel — consejo al poderoso
      "romance-del-rey-don-sancho",         // Romancero — traición y poder
      "romance-de-la-jura-de-santa-gadea",  // Romancero — el Cid desafía al rey
      "liebres-cobardes-nacisteis",         // Lope — Fuenteovejuna
      "fuente-ovejuna-lo-hizo",             // Lope — resistencia popular
      "hombres-necios-que-acusais",         // Sor Juana — poder y género
      "poderoso-caballero-es-don-dinero",   // Quevedo — el dinero manda
      "vuelva-usted-manana",                // Larra — poder burocrático
    ],
  });

  await upsertItinerary({
    slug: "nombrar-la-ausencia",
    title: "Nombrar la ausencia",
    description: "Siete textos que nombran la ausencia: la de la persona amada que se ha ido, la del lugar que se abandona, la del pasado que no vuelve. Desde las jarchas mozárabes —la voz más antigua de nuestra poesía lírica— hasta Rosalía de Castro, la ausencia se nombra en árabe, gallego-portugués, castellano e incluso en el silencio. Lo que une a todos estos textos es que la persona que habla está sola, y lo que le falta tiene nombre.",
    order: 7,
    fragmentSlugs: [
      "jarcha-vaise-meu-corachon",         // Jarchas — "Vaise meu corachón de mib"
      "ondas-do-mar-de-vigo",              // Martín Codax — espera junto al mar
      "egloga-i-queja-de-salicio",         // Garcilaso — Salicio y la ausente Galatea
      "ir-y-quedarse-soneto-ausencia",     // Lope — "Irse y quedarse..."
      "al-partir-soneto",                   // Gómez de Avellaneda — el exilio
      "rima-liii",                          // Bécquer — "Volverán las golondrinas"
      "negra-sombra",                       // Rosalía — presencia de la ausencia
    ],
  });

  console.log("\n✅ Todos los itinerarios actualizados.");
}

main().catch(console.error).finally(() => p.$disconnect());
