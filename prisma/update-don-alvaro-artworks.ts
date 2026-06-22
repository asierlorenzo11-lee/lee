import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

const UPDATES = [
  // ── El misterioso don Álvaro → Un galán misterioso ────────────────────────
  {
    slug: "don-alvaro-misterio-y-amor",
    headline: "Un galán misterioso",
    artworkImageUrl: "/images/artworks/courbet-autorretrato.jpg",
    artworkTitle: "Autorretrato (El hombre desesperado)",
    artworkAuthor: "Gustave Courbet (c. 1843–1845)",
    artworkCaption:
      "Courbet se pintó a sí mismo con los ojos desorbitados y las manos en el pelo: la misma imagen de quien sabe que lleva dentro un secreto demasiado grande. Don Álvaro llega a Sevilla con ese mismo peso: nadie sabe de dónde viene, pero todos sienten que su presencia cambiará el curso de las cosas.",
  },
  // ── La fuga fatal → Instrumentos de desdicha ─────────────────────────────
  {
    slug: "don-alvaro-fuga-fatal",
    headline: "Instrumentos de desdicha",
    artworkImageUrl: "/images/artworks/courbet-hombre-herido.jpg",
    artworkTitle: "El hombre herido",
    artworkAuthor: "Gustave Courbet (1844–1854)",
    artworkCaption:
      "Courbet pintó un hombre que sangra recostado contra un árbol: la víctima inocente de un golpe que nadie buscó. La pistola de don Álvaro, arrojada al suelo como gesto de rendición, mata al Marqués por accidente. Ambas imágenes comparten la misma lógica del destino: el instrumento de paz convertido en instrumento de muerte.",
  },
  // ── Valeroso soldado → Un encuentro fortuito ─────────────────────────────
  {
    slug: "don-alvaro-soldado-de-fortuna",
    headline: "Un encuentro fortuito",
    artworkImageUrl: "/images/artworks/flinck-retrato-caballero.jpg",
    artworkTitle: "Retrato de un caballero",
    artworkAuthor: "Govert Flinck (c. 1640)",
    artworkCaption:
      "Flinck retrató al caballero del siglo XVII como don Álvaro en el campo de batalla italiano: elegante, seguro, marcado por la guerra y sin embargo capaz de la amistad más leal. El hierro y la galantería conviven en un mismo semblante.",
  },
  // ── Leonor muere → ¡El infierno me reclama, y yo voy! ────────────────────
  {
    slug: "don-alvaro-precipicio-final",
    headline: "¡El infierno me reclama, y yo voy!",
    artworkImageUrl: "/images/artworks/alenza-satira-suicidio-romantico.jpg",
    artworkTitle: "Sátira del suicidio romántico",
    artworkAuthor: "Leonardo Alenza y Nieto (c. 1839–1840)",
    artworkCaption:
      "Alenza pintó con amarga ironía la moda romántica del suicidio: el joven que se arroja al abismo creyéndose héroe de tragedia. Don Álvaro, gritando «¡Soy el enviado del infierno!» antes de precipitarse, es exactamente ese personaje: grandioso para sí mismo, grotesco para la historia.",
  },
];

async function main() {
  for (const u of UPDATES) {
    const frag = await prisma.fragment.findUnique({ where: { slug: u.slug } });
    if (!frag) { console.warn(`  ⚠ No encontrado: ${u.slug}`); continue; }
    await prisma.fragment.update({
      where: { id: frag.id },
      data: {
        headline: u.headline,
        artworkImageUrl: u.artworkImageUrl,
        artworkTitle: u.artworkTitle,
        artworkAuthor: u.artworkAuthor,
        artworkCaption: u.artworkCaption,
      },
    });
    console.log(`  ✓ ${u.slug} → "${u.headline}"`);
  }
  console.log("\nListo.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
