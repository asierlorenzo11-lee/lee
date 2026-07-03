import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";
const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db", authToken: process.env.TURSO_AUTH_TOKEN });
const prisma = new PrismaClient({ adapter });
function anchor(text: string, needle: string) {
  const anchorStart = text.indexOf(needle);
  if (anchorStart === -1) throw new Error(`Ancla no encontrada: "${needle.slice(0, 60)}"`);
  return { anchorStart, anchorEnd: anchorStart + needle.length };
}
async function main() {
  const consLibert = await prisma.constellation.findFirstOrThrow({ where: { slug: "libertad" } });
  const consCritica= await prisma.constellation.findFirstOrThrow({ where: { slug: "critica-social" } });
  const consMuerte = await prisma.constellation.findFirstOrThrow({ where: { slug: "muerte" } });
  const consPaso   = await prisma.constellation.findFirstOrThrow({ where: { slug: "paso-del-tiempo" } });

  // 1. Fix Don Pedro: fragment exists with no annotations
  const fragPedro = await prisma.fragment.findUnique({
    where: { slug: "la-comedia-nueva-don-pedro" },
    select: { id: true, text: true, _count: { select: { annotations: true } } }
  });
  if (!fragPedro) { console.log("ERROR: la-comedia-nueva-don-pedro not found"); return; }
  console.log(`Don Pedro: ${fragPedro._count.annotations} anotaciones`);
  if (fragPedro._count.annotations === 0) {
    const t = fragPedro.text;
    // Debug: show what anchor contexts are available
    console.log("Sample text:", t.slice(0, 200));
    await prisma.annotation.createMany({ data: [
      { fragmentId: fragPedro.id, type: "contexto", order: 1,
        ...anchor(t, "Para escribir en castellano con acierto"),
        content: "**Don Pedro** es el *raisonneur* o portavoz ilustrado de Moratín: el personaje serio que formula la crítica neoclásica del teatro barroco populachero. Su discurso resume el programa de la Ilustración española en materia dramática: el teatro debe enseñar (*docere*) y deleitar (*delectare*), pero solo puede hacerlo quien tiene formación sólida. Frente a él, **Eleuterio** es el tipo del mal escritor: sin conocimiento, sin oficio, convencido de su talento." },
      { fragmentId: fragPedro.id, type: "figura", order: 2,
        ...anchor(t, "cazuela para saber si su obra"),
        content: "La «**cazuela**» era el gallinero del teatro del Siglo de Oro: el anfiteatro alto donde se apiñaban el público más popular y bullicioso, el más propenso a abuchear o aplaudir sin criterio. Para los ilustrados como Moratín, el aplauso de la cazuela era señal segura de mal gusto. Esta crítica al público entronca con la *Poética* de Aristóteles y la *Epístola a los Pisones* de Horacio: la buena literatura no busca el aplauso fácil." },
      { fragmentId: fragPedro.id, type: "intertextualidad", order: 3,
        ...anchor(t, "conocer el corazón humano, sus"),
        content: "Don Pedro enuncia el programa neoclásico de la **imitación de la naturaleza**: el teatro debe representar la conducta humana con verdad psicológica para que el espectador reconozca sus propias pasiones y aprenda a corregirlas. Esta es la teoría aristotélica de la **catarsis**, releída a través del neoclasicismo francés (Molière, Corneille).",
        externalCitation: "Aristóteles, *Poética*, 1452a: «La tragedia es imitación de acción esforzada y completa, con la cual, mediante la compasión y el terror, lleva a cabo la purgación de tales afecciones»." },
    ]});
    console.log("✅ Don Pedro: 3 anotaciones añadidas");
  }

  // 2. Espronceda — El diablo mundo: Canto I
  const diabloMundo = await prisma.work.findFirstOrThrow({ where: { slug: "el-diablo-mundo" } });
  const canto1Lines = [
    "¡Canta, musa inmortal, con voz potente,",
    "el eterno proceso de la vida,",
    "que en la corriente del vivir presente,",
    "es pasado que en sombras se oscurece!",
    "",
    "¿Qué es la vida? Pregunta que no tiene",
    "respuesta en el turbión de los afanes.",
    "El hombre que nació llora y se muere,",
    "y entre el nacer y el morir le prenden",
    "cadenas de su propio pensamiento.",
    "",
    "Yo quiero un bien que no se acabe, un cielo",
    "sin nubes de inquietud que lo oscurezcan,",
    "quiero que exista Dios porque lo anhelo,",
    "y sin él, mis deseos ¿qué pudieran?",
    "Quiero la libertad, quiero el sosiego,",
    "la fe que el corazón fortifica y premia.",
    "",
    "¿Por qué nace el hombre? Por ventura",
    "¿nació para sufrir penas y enojos,",
    "para agitarse en miserable holgura,",
    "entre el dolor que hiere y los sonrojos",
    "de la fortuna que en su angosta esfera",
    "le tiene aprisionado? ¿O acaso fuera",
    "para algo más que esto? ¿Habrá en la tierra",
    "algo mayor? ¿Y qué? La gloria, el nombre,",
    "el sonar en la boca de los hombres,",
    "¿es esto solo lo que resta, el hombre?",
  ];
  const canto1Text = canto1Lines.join("\n");

  const existDiablo = await prisma.fragment.findUnique({ where: { slug: "el-diablo-mundo-canto-i" } });
  if (!existDiablo) {
    const fragDiablo = await prisma.fragment.create({ data: {
      slug: "el-diablo-mundo-canto-i",
      title: "Canto I: «¿Qué es la vida?»",
      location: "El diablo mundo, Canto I",
      headline: "Quiero la libertad, quiero el sosiego, la fe que el corazón fortifica",
      text: canto1Text,
      order: 2, status: "published",
      workId: diabloMundo.id,
      constellations: { connect: [{ id: consLibert.id }, { id: consMuerte.id }, { id: consPaso.id }] },
    }});
    const t = canto1Text;
    await prisma.annotation.createMany({ data: [
      { fragmentId: fragDiablo.id, type: "contexto", order: 1,
        ...anchor(t, "¡Canta, musa inmortal, con voz potente"),
        content: "El Canto I de *El diablo mundo* (1840) es un prólogo filosófico al poema: Espronceda invoca a la «musa inmortal» —gesto épico clásico desde Homero— pero para plantear preguntas radicalmente modernas sobre la existencia. El poema quedó inacabado y es el más ambicioso del Romanticismo español: quería ser una suma poética del ser humano, una *Divina Comedia* romántica española." },
      { fragmentId: fragDiablo.id, type: "figura", order: 2,
        ...anchor(t, "¿Qué es la vida? Pregunta que no tiene"),
        content: "La pregunta «¿qué es la vida?» conecta con Calderón (*«¿Qué es la vida? Un frenesí»*, *La vida es sueño*) y con toda la tradición del *vanitas vanitatum*. Pero el escepticismo romántico de Espronceda es diferente: no hay respuesta en el reino de los afanes humanos. El Romanticismo radicaliza el desencanto barroco: Segismundo hallaba una solución moral («obrar bien»); Espronceda solo ve la pregunta sin fondo." },
      { fragmentId: fragDiablo.id, type: "figura", order: 3,
        ...anchor(t, "quiero que exista Dios porque lo anhelo"),
        content: "**El deseo imposible romántico**: «Quiero que exista Dios porque lo anhelo» es la más honesta confesión romántica: no afirma la existencia de Dios, solo la necesidad humana de creer. El hablante sabe que el deseo no garantiza la verdad —diferencia esencial entre el Romanticismo y la fe medieval—. Es lo que Unamuno llamará décadas después el «sentimiento trágico de la vida»: la razón niega, el corazón exige." },
    ]});
    console.log("✅ El diablo mundo: Canto I");
  } else { console.log("(ya existía el-diablo-mundo-canto-i)"); }
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
