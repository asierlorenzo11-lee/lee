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
  const consAmor   = await prisma.constellation.findFirstOrThrow({ where: { slug: "amor" } });
  const consFe     = await prisma.constellation.findFirstOrThrow({ where: { slug: "fe"   } });
  const consVoz    = await prisma.constellation.findFirstOrThrow({ where: { slug: "voz-femenina"   } });
  const consHonor  = await prisma.constellation.findFirstOrThrow({ where: { slug: "honor-y-valor"  } });
  const consLibert = await prisma.constellation.findFirstOrThrow({ where: { slug: "libertad"       } });
  const consCritica= await prisma.constellation.findFirstOrThrow({ where: { slug: "critica-social" } });
  const consMuerte = await prisma.constellation.findFirstOrThrow({ where: { slug: "muerte"         } });
  const consPaso   = await prisma.constellation.findFirstOrThrow({ where: { slug: "paso-del-tiempo"} });

  // 1. Fix Noche oscura: add annotations to the fragment created without them
  const fragNoche = await prisma.fragment.findUnique({ where: { slug: "noche-oscura-poema-completo" }, select: { id: true, text: true, _count: { select: { annotations: true } } } });
  if (!fragNoche) { console.log("ERROR: noche-oscura-poema-completo not found"); return; }
  console.log(`Noche oscura: ${fragNoche._count.annotations} anotaciones existentes`);
  if (fragNoche._count.annotations === 0) {
    const t = fragNoche.text;
    await prisma.annotation.createMany({ data: [
      { fragmentId: fragNoche.id, type: "contexto", order: 1,
        ...anchor(t, "salí sin ser notada,\nestando ya mi casa sosegada"),
        content: "«La noche oscura» tiene dos niveles de lectura simultáneos: el **literal** (una mujer que escapa de noche al encuentro del amado, como en el Cantar de los Cantares) y el **espiritual** (el alma que sale de los sentidos y del apego al mundo para unirse con Dios). San Juan parte del poema como texto poético y luego lo comenta en prosa en su tratado *Noche oscura del alma*. La «casa sosegada» es el cuerpo con sus pasiones en quietud; la «noche» es la oscuridad del entendimiento humano que la mística debe atravesar." },
      { fragmentId: fragNoche.id, type: "intertextualidad", order: 2,
        ...anchor(t, "¡oh noche que juntaste\nAmado con amada,\namada en el Amado transformada"),
        content: "El poema es una **glosa espiritual** del *Cantar de los Cantares* bíblico. La esposa del *Cantar* busca al Amado de noche (Ct 3,1-2: «En mi lecho, por las noches, busqué al amor de mi alma»). San Juan transforma ese lenguaje nupcial en vía mística: la «transformación» del alma en el Amado es la *unio mystica*, el grado supremo de la contemplación.",
        externalCitation: "Cantar de los Cantares 3, 1–2: «En mi lecho, por las noches, busqué al amor de mi alma; le busqué y no le hallé. Me levantaré ahora y rodearé por la ciudad; buscaré al amor de mi alma»." },
      { fragmentId: fragNoche.id, type: "figura", order: 3,
        ...anchor(t, "sin otra luz y guía\nsino la que en el corazón ardía"),
        content: "**Paradoja de la luz oscura**: la mística de San Juan se basa en la *teología negativa* o *apofática* (Pseudo-Dionisio): Dios no se alcanza mediante la razón o los sentidos, sino precisamente cuando éstos se oscurecen. La «luz del corazón» no es razón: es fe, amor, impulso espiritual que guía «más cierto que la luz del mediodía» justamente porque prescinde de toda luz racional. La oscuridad es el camino, no el obstáculo." },
      { fragmentId: fragNoche.id, type: "figura", order: 4,
        ...anchor(t, "Quedéme y olvidéme,\nel rostro recliné sobre el Amado;\ncesó todo, y dejéme"),
        content: "La **coda** final condensa el itinerario místico: del «salí» activo de la primera estrofa, el alma pasa al «dejéme» pasivo. Es la imagen de la *kenosis* mística: el alma se vacía de sí misma para llenarse de Dios. El «cuidado» que queda «entre las azucenas olvidado» son todas las preocupaciones humanas, abandonadas en la unión." },
    ]});
    console.log("✅ Noche oscura: 4 anotaciones añadidas");
  }

  // 2. Ana Caro — Valor, agravio y mujer: Leonor se disfraza
  const valorAgravio = await prisma.work.findFirstOrThrow({ where: { slug: "valor-agravio-y-mujer" } });
  const leonorText = [
    "LEONOR: Que yo, señor don Fernando,",
    "         soy mujer, y fui burlada;",
    "         mas no tan fácil que así",
    "         se pierda mi honor sin causa.",
    "         Traje masculino y nombre",
    "         de Leonardo me llama;",
    "         básteme a mí ser quien soy,",
    "         aunque el mundo me lo niegue.",
    "",
    "DON JUAN: ¿Qué es lo que escucho? ¿Es posible",
    "          que en tan bizarro aposento",
    "          se encierre un alma de acero,",
    "          valor tan noble y tan bello?",
    "",
    "LEONOR: Sí es posible, don Fernando,",
    "         porque yo aprendí a tenerle",
    "         de mí misma; que una ofensa",
    "         a una mujer de mis partes",
    "         la enseña más que maestros",
    "         a usar de valor y armas.",
    "         Si el agravio me hizo hombre",
    "         en el valor, no en la fama,",
    "         ¿qué mucho que en hábito",
    "         de varón mi causa traiga?",
  ].join("\n");

  const existLeonor = await prisma.fragment.findUnique({ where: { slug: "valor-agravio-leonor-disfraz" } });
  if (!existLeonor) {
    const fragLeonor = await prisma.fragment.create({ data: {
      slug: "valor-agravio-leonor-disfraz",
      title: "Leonor: «Si el agravio me hizo hombre»",
      location: "Valor, agravio y mujer, Jornada II",
      headline: "Si el agravio me hizo hombre en el valor, no en la fama",
      text: leonorText,
      order: 2, status: "published",
      workId: valorAgravio.id,
      constellations: { connect: [{ id: consVoz.id }, { id: consHonor.id }, { id: consLibert.id }] },
    }});
    const t = leonorText;
    await prisma.annotation.createMany({ data: [
      { fragmentId: fragLeonor.id, type: "contexto", order: 1,
        ...anchor(t, "Traje masculino y nombre"),
        content: "El recurso del **disfraz varonil** (*mujer vestida de hombre*) es convención frecuente en la comedia barroca —Lope, Tirso, Calderón lo usan—, pero Ana Caro le da una carga feminista infrecuente: Leonor no se disfraza para seguir a su amado ni por amor, sino para recuperar su honor mancillado por don Juan de Córdoba, que la sedujo y la abandonó. El disfraz es instrumento de agencia, no de servilismo." },
      { fragmentId: fragLeonor.id, type: "figura", order: 2,
        ...anchor(t, "Si el agravio me hizo hombre"),
        content: "La frase más importante de la obra: Leonor distingue entre «hombre en el **valor**» y «hombre en la **fama**». El valor —el coraje, la determinación, la capacidad de actuar— no es patrimonio exclusivo masculino; la fama (la reputación social) sí es asignada por la sociedad patriarcal solo a los varones. Leonor reivindica el valor para sí sin renunciar a su identidad femenina: su disfraz es instrumental, no identitario." },
      { fragmentId: fragLeonor.id, type: "pregunta", order: 3,
        ...anchor(t, "¿qué mucho que en hábito"),
        content: "Leonor formula la pregunta retórica que desafía al público barroco: si la sociedad solo acepta la agencia en los hombres, ¿tiene sentido que una mujer agraviada se vista de hombre para obtener justicia? ¿Es el disfraz una victoria o una capitulación ante un sistema que no reconoce la capacidad femenina? ¿Puede Leonor recuperar su honor sin reproducir el sistema que se lo negó?" },
    ]});
    console.log("✅ Valor, agravio y mujer: Leonor");
  } else { console.log("(ya existía valor-agravio-leonor-disfraz)"); }

  // 3. Moratín — Don Pedro y el mal teatro
  const comedaNueva = await prisma.work.findFirstOrThrow({ where: { slug: "la-comedia-nueva-o-el-cafe" } });
  const pedroText = [
    "DON PEDRO: Para escribir en castellano con acierto,",
    "             ya ve usted que no basta saber el idioma; se",
    "             necesita, además de eso, haber leído mucho,",
    "             haber visto mucho, haber pensado mucho; se",
    "             necesita conocer el corazón humano, sus",
    "             pasiones, sus errores y sus virtudes.",
    "",
    "ELEUTERIO: Pues yo he leído algo.",
    "",
    "DON PEDRO: Sí, eso es lo que hay. Se han leído cuatro",
    "             comedias malas, y se cree uno con talento",
    "             para escribir veinte. Hasta los niños quieren",
    "             hoy ser autores: cualquiera piensa que le",
    "             basta con juntar palabras y hacer que hablen",
    "             personajes que se matan en escena.",
    "",
    "ELEUTERIO: Pero, señor don Pedro, usted es muy severo.",
    "",
    "DON PEDRO: Soy justo. Y no es esto lo peor: lo peor es",
    "             que, cuando la razón y la crítica se atreven a",
    "             decir la verdad, se toma por envidia o por",
    "             ignorancia. El mérito juzga sin compasión, y",
    "             el que no le tiene se defiende con el aplauso",
    "             del vulgo. ¿Cuándo se ha visto en un hombre",
    "             de letras verdadero que haya necesitado de los",
    "             gritos de la cazuela para saber si su obra",
    "             valía?",
    "",
    "ELEUTERIO: Señor don Pedro, usted habla muy claro.",
    "",
    "DON PEDRO: Hablo como pienso. ¿Qué se ha de hacer",
    "             cuando se ve destruida la buena literatura por",
    "             la ignorancia de unos y la tolerancia de otros?",
  ].join("\n");

  const existPedro = await prisma.fragment.findUnique({ where: { slug: "la-comedia-nueva-don-pedro" } });
  if (!existPedro) {
    const fragPedro = await prisma.fragment.create({ data: {
      slug: "la-comedia-nueva-don-pedro",
      title: "Don Pedro y la crítica de la ignorancia literaria",
      location: "La comedia nueva o El café, acto II, escena VIII",
      headline: "Soy justo. El mérito juzga sin compasión",
      text: pedroText,
      order: 2, status: "published",
      workId: comedaNueva.id,
      constellations: { connect: [{ id: consCritica.id }] },
    }});
    const t = pedroText;
    await prisma.annotation.createMany({ data: [
      { fragmentId: fragPedro.id, type: "contexto", order: 1,
        ...anchor(t, "Para escribir en castellano con acierto"),
        content: "**Don Pedro** es el *raisonneur* o portavoz ilustrado de Moratín: el personaje serio que formula la crítica neoclásica del teatro barroco populachero. Su discurso resume el programa de la Ilustración española en materia dramática: el teatro debe enseñar (*docere*) y deleitar (*delectare*), pero solo puede hacerlo quien tiene formación sólida. Frente a él, **Eleuterio** es el tipo del mal escritor: sin conocimiento, sin oficio, convencido de su talento." },
      { fragmentId: fragPedro.id, type: "figura", order: 2,
        ...anchor(t, "los gritos de la cazuela"),
        content: "La «**cazuela**» era el gallinero del teatro del Siglo de Oro: el anfiteatro alto donde se apiñaban el público más popular y bullicioso, el más propenso a abuchear o aplaudir sin criterio. Para los ilustrados como Moratín, el aplauso de la cazuela era señal segura de mal gusto. Esta crítica al público entronca con la *Poética* de Aristóteles y la *Epístola a los Pisones* de Horacio: la buena literatura no busca el aplauso fácil." },
      { fragmentId: fragPedro.id, type: "intertextualidad", order: 3,
        ...anchor(t, "conocer el corazón humano, sus"),
        content: "Don Pedro enuncia el programa neoclásico de la **imitación de la naturaleza**: el teatro debe representar la conducta humana con verdad psicológica para que el espectador reconozca sus propias pasiones y aprenda a corregirlas. Esta es la teoría aristotélica de la **catarsis**, releída a través del neoclasicismo francés (Molière, Corneille). La obra de Moratín, ambientada en un café madrileño del tiempo real, es su propia demostración práctica.",
        externalCitation: "Aristóteles, *Poética*, 1452a: «La tragedia es imitación de acción esforzada y completa, con la cual, mediante la compasión y el terror, lleva a cabo la purgación de tales afecciones»." },
    ]});
    console.log("✅ La comedia nueva: Don Pedro");
  } else { console.log("(ya existía la-comedia-nueva-don-pedro)"); }

  // 4. Espronceda — El diablo mundo: Canto I
  const diabloMundo = await prisma.work.findFirstOrThrow({ where: { slug: "el-diablo-mundo" } });
  const canto1Text = [
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
  ].join("\n");

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
