import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

function anchor(text: string, needle: string) {
  const anchorStart = text.indexOf(needle);
  if (anchorStart === -1)
    throw new Error(`Anchor not found: "${needle}" in text starting "${text.slice(0, 80)}"`);
  return { anchorStart, anchorEnd: anchorStart + needle.length };
}

async function main() {
  // ── FRAGMENTO 1: la-fugacidad-de-la-vida ──────────────────────────────────
  // Links → bergamin-alma-dormida, neruda-oda-manrique
  const frag1 = await prisma.fragment.findUniqueOrThrow({
    where: { slug: "la-fugacidad-de-la-vida" },
    select: { id: true, text: true },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: frag1.id,
        type: "intertextualidad",
        ...anchor(frag1.text, "Recuerde el alma dormida"),
        order: 10,
        content: `El primer hemistiquio de las *Coplas* es uno de los versos más reconocibles de la literatura española. José Bergamín lo convierte en pregunta: «Si está el alma dormida, / ¿para qué despertarla?». Donde Manrique exhortaba al alma a despertar para contemplar la muerte, Bergamín duda de si ese despertar tiene sentido: el alma moderna, distante de la certeza medieval, prefiere quizá seguir dormida. El homenaje es también una queja.`,
        externalCitation: `José Bergamín, *Esperando la mano de nieve* (1985): «Si está el alma dormida, / ¿para qué despertarla? / ¿Para qué despertar con el recuerdo / el sueño en que descansa?»`,
      },
      {
        fragmentId: frag1.id,
        type: "intertextualidad",
        ...anchor(frag1.text, "cómo se viene la muerte\ntan callando"),
        order: 11,
        content: `La imagen de la muerte que llega «tan callando» fascina a Pablo Neruda. En su *Oda a Don Jorge Manrique* (1958), el poeta chileno imagina que él mismo invita al caballero de la muerte a entrar —«Adelante, le dije / y entró el buen caballero / de la muerte»— con la misma serenidad que en Manrique. Para Neruda, Manrique es el poeta que domesticó la muerte: le dio una forma, un ritmo, una belleza. La muerte que no hace ruido es también, en Neruda, la muerte justa.`,
        externalCitation: `Pablo Neruda, *Nuevas odas elementales* (1957): «Adelante, le dije / y entró el buen caballero / de la muerte. / Era de plata verde / su armadura / y sus ojos / eran / como el agua marina.»`,
      },
    ],
  });
  console.log("✓ la-fugacidad-de-la-vida → 2 anotaciones intertextuales añadidas");

  // ── FRAGMENTO 2: nuestras-vidas-son-los-rios ──────────────────────────────
  // Links → otero-tumulo-de-gasoil, ridruejo-con-manrique
  const frag2 = await prisma.fragment.findUniqueOrThrow({
    where: { slug: "nuestras-vidas-son-los-rios" },
    select: { id: true, text: true },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: frag2.id,
        type: "intertextualidad",
        ...anchor(frag2.text, "Nuestras vidas son los ríos"),
        order: 10,
        content: `Blas de Otero transforma esta metáfora fluvial en «Túmulo de gasoil» (1970): donde Manrique veía ríos que fluían serenamente hacia el mar de la muerte, Otero ve «hojas sueltas, caídas / como cristo contra el empedrado». Los muertos de la posguerra española no descansan en el mar: quedan aplastados en el asfalto urbano. La hermosa metáfora medieval se vuelve imagen de violencia y de memoria negada. Otero conserva incluso los términos de Manrique —«Los Infantes de Aragón», «ropas chapadas»— para mostrar el contraste entre el mundo que pudo ser y el que fue.`,
        externalCitation: `Blas de Otero, *Hojas de Madrid con La galerna* (1970): «Hojas sueltas, decidme, qué se hicieron / los Infantes de Aragón, Manuel Granero, la pavana [...] hojas sueltas, caídas / como cristo contra el empedrado».`,
      },
      {
        fragmentId: frag2.id,
        type: "intertextualidad",
        ...anchor(frag2.text, "que van a dar en la mar,\nque es el morir"),
        order: 11,
        content: `Dionisio Ridruejo, en «Con Jorge Manrique» (*Hasta la fecha*, 1981), recoge el movimiento del río manriqueño con una diferencia fundamental: el río de Ridruejo no fluye hacia el mar tranquilo sino hacia la historia. «Sigue como pasa el río / efimeramente vivo», escribe, reconociendo que la vida de Manrique —y la del propio poeta exiliado— sigue en movimiento, que el caballero «sigue hablando» desde su almena de tiempo. El río no desemboca: continúa.`,
        externalCitation: `Dionisio Ridruejo, *Hasta la fecha* (1981): «Desde su almena de tiempo / sigue hablando el caballero. / Sigue como pasa el río / efimeramente vivo.»`,
      },
    ],
  });
  console.log("✓ nuestras-vidas-son-los-rios → 2 anotaciones intertextuales añadidas");

  // ── FRAGMENTO 3: anoranza-de-los-tiempos-pasados ──────────────────────────
  // Links → otero-tumulo-de-gasoil, diego-glosa-a-manrique
  const frag3 = await prisma.fragment.findUniqueOrThrow({
    where: { slug: "anoranza-de-los-tiempos-pasados" },
    select: { id: true, text: true },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: frag3.id,
        type: "intertextualidad",
        ...anchor(frag3.text, "Los Infantes de Aragón,\n¿qué se hicieron?"),
        order: 10,
        content: `Blas de Otero abre «Túmulo de gasoil» citando directamente estas coplas: «decidme, qué se hicieron / los Infantes de Aragón, Manuel Granero, la pavana». Junto a los nobles medievales, Otero inserta a Manuel Granero, torero muerto en el ruedo en 1922, y referencias a la vida popular del Madrid del franquismo: «setenta o setenta y cinco niños / y sus mamás ostentan senos de Honolulú». El *ubi sunt* medieval se convierte en elegía política y urbana: el mismo lamento por los que se fueron, pero ahora en el mundo del gasoil y el microsurco.`,
        externalCitation: `Blas de Otero, *Hojas de Madrid con La galerna*: «Hojas sueltas, decidme, qué se hicieron / los Infantes de Aragón, Manuel Granero, la pavana / para una infanta».`,
      },
      {
        fragmentId: frag3.id,
        type: "intertextualidad",
        ...anchor(frag3.text, "¿Qué se hicieron las llamas\nde los fuegos encendidos\nde amadores?"),
        order: 11,
        content: `El fuego amoroso que Manrique lamenta como cosa pasada inspira la «Glosa a Manrique» de Gerardo Diego (*Poemas adrede*, 1932). Diego toma un mote de la poesía amorosa del propio Manrique —«Por más merecer la gloria / de las altas alegrías / de Cupido»— y lo desarrolla en ocho estrofas. Las llamas de Manrique se convierten en Diego en «Linda hipótesis de llama / realidad de alta hermosura»: el mismo fuego amoroso, pero ahora visto con los ojos creacionistas del siglo XX. La glosa es el homenaje formal más explícito: Diego no solo cita a Manrique, sino que reproduce su estructura poética.`,
        externalCitation: `Gerardo Diego, *Poemas adrede* (1932): «Linda hipótesis de llama / realidad de alta hermosura / mi imposible [...] Abrasa mi hilo-memoria / con las chispas que solías. / Te lo pido / por más merecer la gloria / de las altas alegrías / de Cupido».`,
      },
    ],
  });
  console.log("✓ anoranza-de-los-tiempos-pasados → 2 anotaciones intertextuales añadidas");

  console.log("\n✅ 6 anotaciones intertextuales añadidas (vinculación desde las Coplas → intertextos).");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
