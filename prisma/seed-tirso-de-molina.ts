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
    throw new Error(`Ancla no encontrada: "${needle.slice(0, 60)}"`);
  return { anchorStart, anchorEnd: anchorStart + needle.length };
}

async function main() {
  const consHonorValor = await prisma.constellation.findFirstOrThrow({ where: { slug: "honor-y-valor" } });
  const consMuerte = await prisma.constellation.findFirstOrThrow({ where: { slug: "muerte" } });
  const donJuanTenorio = await prisma.work.findFirstOrThrow({ where: { slug: "don-juan-tenorio" } });

  console.log("Creando autor Tirso de Molina...");
  const tirso = await prisma.author.create({
    data: {
      slug: "tirso-de-molina",
      name: "Tirso de Molina",
      birthYear: 1579,
      deathYear: 1648,
      country: "España",
      era: "Barroco",
      bio: `Seudónimo de fray Gabriel Téllez (Madrid, 1579 – Soria, 1648), fraile mercedario y uno de los grandes dramaturgos del Siglo de Oro. En *El burlador de Sevilla y convidado de piedra* (h. 1630) dio forma por primera vez al mito de don Juan, el seductor impenitente castigado por la justicia divina: una figura que, dos siglos después, José Zorrilla reescribiría en clave romántica —y con un final radicalmente distinto— en su *Don Juan Tenorio*. Escribió también comedias de enredo e ingenio como *El vergonzoso en palacio* y *Marta la piadosa*.`,
      portraitUrl: "/images/authors/tirso-de-molina.jpg",
    },
  });

  console.log("Creando obra El burlador de Sevilla...");
  const burlador = await prisma.work.create({
    data: {
      slug: "el-burlador-de-sevilla",
      title: "El burlador de Sevilla y convidado de piedra",
      year: 1630,
      era: "Barroco",
      genre: "Comedia (drama teológico)",
      synopsis: `Don Juan Tenorio recorre Nápoles y Sevilla burlando a cuantas mujeres se cruzan en su camino —Isabela, Tisbea, doña Ana, Aminta— amparado siempre en la misma certeza: que el castigo, si llega, llegará tarde. Tras matar al padre de doña Ana, el Comendador don Gonzalo de Ulloa, don Juan se burla hasta de su estatua funeraria, invitándola a cenar. La estatua acepta y le devuelve la invitación: en ese segundo banquete, la justicia divina cobra, por fin, su deuda.`,
      authorId: tirso.id,
    },
  });

  // ──────────────────────────────────────────────────────────────
  // 1/2 — ¡Qué largo me lo fiáis!
  // ──────────────────────────────────────────────────────────────
  const fiaisText = `CATALINÓN: Los que fingís y engañáis
                   las mujeres de esa suerte,
                   lo pagaréis en la muerte.

         JUAN: ¡Qué largo me lo fiáis!
                   Catalinón con razón
                   te llaman.

CATALINÓN: Tus pareceres
                   sigue, que en burlar mujeres
                   quiero ser Catalinón.`;

  console.log("Creando ¡Qué largo me lo fiáis!...");
  const fragFiais = await prisma.fragment.create({
    data: {
      slug: "que-largo-me-lo-fiais",
      title: "¡Qué largo me lo fiáis!",
      location: "El burlador de Sevilla y convidado de piedra, Jornada primera",
      headline: "«Lo pagaréis en la muerte» — «¡Qué largo me lo fiáis!»",
      text: fiaisText,
      order: 1,
      status: "published",
      workId: burlador.id,
      constellations: { connect: [{ id: consHonorValor.id }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragFiais.id,
        type: "glosa",
        ...anchor(fiaisText, "¡Qué largo me lo fiáis!"),
        order: 1,
        content: `«Fiar» es dar crédito, aplazar un pago. Don Juan responde a la amenaza de un castigo divino como quien se ríe de un plazo de pago lejano: «qué largo me lo fiáis» equivale a «qué lejos veis ese cobro, cuánto crédito me dais». Esta frase se repite como estribillo a lo largo de toda la obra.`,
      },
      {
        fragmentId: fragFiais.id,
        type: "contexto",
        ...anchor(fiaisText, "lo pagaréis en la muerte"),
        order: 1,
        content: `Catalinón, el criado, hace de conciencia muda de don Juan: advierte, pronostica, teme, pero nunca consigue detenerlo. Su advertencia aquí —que las burlas se pagan con la muerte— se cumplirá literalmente al final de la obra, cuando sea un muerto, y no la muerte en abstracto, quien venga a cobrar la deuda.`,
      },
      {
        fragmentId: fragFiais.id,
        type: "figura",
        category: "topos",
        ...anchor(fiaisText, "¡Qué largo me lo fiáis!"),
        order: 1,
        content: `Esta frase condensa el motivo teológico central de la obra: la presunción de quien aplaza indefinidamente el arrepentimiento confiando en que la muerte —y el juicio de Dios— siempre quedan lejos. Tirso, fraile mercedario, construye sobre esta frase una advertencia moral explícita contra la conducta de don Juan.`,
      },
      {
        fragmentId: fragFiais.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `¿Por qué crees que esta misma frase se repite varias veces a lo largo de la obra, cada vez que alguien advierte a don Juan de las consecuencias de sus actos?`,
      },
      {
        fragmentId: fragFiais.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 2,
        content: `«Ya habrá tiempo de arreglarlo» es una excusa que no ha desaparecido con los siglos. ¿En qué situaciones actuales reconoces esta misma lógica de aplazar indefinidamente algo que se sabe que habría que afrontar?`,
      },
    ],
  });

  // ──────────────────────────────────────────────────────────────
  // 2/2 — El convite de piedra (escena final)
  // ──────────────────────────────────────────────────────────────
  const convidaText = `MÚSICOS: «Adviertan los que de Dios
                   juzgan los castigos grandes,
                   que no hay plazo que no llegue
                   ni deuda que no se pague».

[...]

MÚSICOS: «Mientras en el mundo viva,
                   no es justo que diga nadie
                   "¡qué largo me lo fiáis!",
                   siendo tan breve el cobrarse».

[...]

         JUAN: Ya he cenado, haz que levanten
                   la mesa.

  GONZALO: Dame esa mano.
                   No temas, la mano dame.

         JUAN: ¿Eso dices? ¿Yo temor?
                   ¡Que me abraso! No me abrases
                   con tu fuego.

  GONZALO: Éste es poco
                   para el fuego que buscaste.
                   Las maravillas de Dios
                   son, don Juan, investigables,
                   y así quiere que tus culpas
                   a manos de un muerto pagues,
                   y, si pagas de esta suerte
                   las doncellas que burlaste,
                   ésta es justicia de Dios.
                   Quien tal hace, que tal pague.

         JUAN: ¡Que me abraso, no me aprietes!
                   Con la daga he de matarte,
                   mas, ¡ay, que me canso en vano
                   de tirar golpes al aire!
                   A tu hija no ofendí,
                   que vio mis engaños antes.

  GONZALO: No importa, que ya pusiste
                   tu intento.

         JUAN: Deja que llame
                   quien me confiese y absuelva.

  GONZALO: No hay lugar, ya acuerdas tarde.

         JUAN: ¡Que me quemo! ¡Que me abraso!
                   Muerto soy.

                                                  Cae muerto don JUAN

  GONZALO: Ésta es justicia de Dios.
                   Quien tal hace, que tal pague.`;

  console.log("Creando El convite de piedra...");
  const fragConvida = await prisma.fragment.create({
    data: {
      slug: "el-convite-de-piedra",
      title: "El convite de piedra",
      location: "El burlador de Sevilla y convidado de piedra, Jornada tercera",
      headline: "«Deja que llame quien me confiese y absuelva» — «No hay lugar, ya acuerdas tarde»",
      text: convidaText,
      order: 2,
      status: "published",
      workId: burlador.id,
      constellations: { connect: [{ id: consHonorValor.id }, { id: consMuerte.id }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragConvida.id,
        type: "glosa",
        ...anchor(convidaText, "Quien tal hace, que tal pague"),
        order: 1,
        content: `Sentencia popular —quien comete una mala acción debe sufrir sus consecuencias— que cierra la obra como un estribillo de justicia poética, repetido dos veces en las últimas líneas para que no quede duda de su sentido.`,
      },
      {
        fragmentId: fragConvida.id,
        type: "contexto",
        ...anchor(convidaText, "No hay lugar, ya acuerdas tarde"),
        order: 1,
        content: `Don Juan pide confesión y absolución en el último instante, exactamente lo que toda la obra le ha advertido que no debía aplazar. La respuesta del Comendador —ya es tarde— ejecuta literalmente la advertencia de la canción: «no hay plazo que no llegue». La condena no es por sus burlas en sí, sino por morir sin arrepentimiento.`,
      },
      {
        fragmentId: fragConvida.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(convidaText, "no hay plazo que no llegue\n                   ni deuda que no se pague"),
        order: 1,
        content: `**Paralelismo con negación reduplicada**: la estructura idéntica de ambos versos —«no hay... que no...»— convierte la advertencia en una ley universal sin excepciones, anticipando con precisión el desenlace de la obra.`,
      },
      {
        fragmentId: fragConvida.id,
        type: "intertextualidad",
        ...anchor(convidaText, "Cae muerto don JUAN"),
        order: 1,
        content: `Dos siglos más tarde, José Zorrilla reescribe esta misma escena —el banquete con la estatua del Comendador— en su *Don Juan Tenorio* (fragmento «Uno más para cenar»), pero invierte el desenlace: donde el don Juan de Tirso muere condenado sin tiempo para confesarse, el de Zorrilla es salvado en el último instante por el amor intercesor de doña Inés («Un verdadero ángel de amor»). El mito es el mismo; la respuesta que cada época da sobre si el arrepentimiento llega siempre a tiempo, no.`,
      },
      {
        fragmentId: fragConvida.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Qué le pide don Juan al Comendador en el último momento, y qué respuesta recibe?`,
      },
      {
        fragmentId: fragConvida.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 2,
        content: `Compara este final con el de *Don Juan Tenorio* de Zorrilla, donde el protagonista sí se salva por amor. ¿Qué visión del mundo y de la justicia transmite cada final? ¿Cuál te resulta más convincente o más justo?`,
      },
    ],
  });

  // Intertextualidad inversa: desde el fragmento de Zorrilla hacia este
  const fragZorrillaConvite = await prisma.fragment.findUnique({ where: { slug: "don-juan-cementerio-convite" } });
  if (fragZorrillaConvite) {
    const zorrillaText = (await prisma.fragment.findUniqueOrThrow({ where: { slug: "don-juan-cementerio-convite" } })).text;
    await prisma.annotation.create({
      data: {
        fragmentId: fragZorrillaConvite.id,
        type: "intertextualidad",
        anchorStart: 0,
        anchorEnd: Math.min(40, zorrillaText.length),
        order: 20,
        content: `Esta escena —don Juan invitando a cenar a la estatua del Comendador— procede directamente de *El burlador de Sevilla* de Tirso de Molina (fragmento «El convite de piedra»), donde el mismo gesto desemboca en la condenación eterna del protagonista. Zorrilla cita la situación pero cambia su desenlace: aquí el amor de doña Inés salvará a don Juan donde el de Tirso no encontró perdón.`,
      },
    });
    console.log("✓ Anotación inversa añadida en don-juan-cementerio-convite.");
  } else {
    console.log("⚠ No se encontró el fragmento don-juan-cementerio-convite para la anotación inversa.");
  }

  console.log("\n✓ Tirso de Molina: autor + obra + 2 fragmentos creados.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
