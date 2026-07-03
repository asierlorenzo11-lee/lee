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
  const consAmor     = await prisma.constellation.findFirstOrThrow({ where: { slug: "amor"             } });
  const consMuerte   = await prisma.constellation.findFirstOrThrow({ where: { slug: "muerte"           } });
  const consPaso     = await prisma.constellation.findFirstOrThrow({ where: { slug: "paso-del-tiempo"  } });
  const consLibertad = await prisma.constellation.findFirstOrThrow({ where: { slug: "libertad"         } });
  const consCritica  = await prisma.constellation.findFirstOrThrow({ where: { slug: "critica-social"   } });
  const consFe       = await prisma.constellation.findFirstOrThrow({ where: { slug: "fe"               } });
  const consVoz      = await prisma.constellation.findFirstOrThrow({ where: { slug: "voz-femenina"     } });
  const consHonor    = await prisma.constellation.findFirstOrThrow({ where: { slug: "honor-y-valor"    } });
  const consPoder    = await prisma.constellation.findFirstOrThrow({ where: { slug: "poder"            } });

  // ══════════════════════════════════════════════════════════════
  // 1. GÓNGORA — Soledades: el Peregrino en la boda aldeana
  // ══════════════════════════════════════════════════════════════
  const soledades = await prisma.work.findFirstOrThrow({ where: { slug: "soledades" } });

  const bodaText = `Llegó el peregrino enamorado
al pastoral albergue, mal cubierto
de ramas, de la noche mal defensa.
Yelmo del cielo, la nocturna idea,
el erizado cuello sus oídos
llenaba de murmullo;
al son del agua, músico instrumento,
el sueño dio al silencio acogimiento.

No bien el sol el horizonte dora,
cuando el peregrino riguroso
de su fatiga, que el camino ancho
rompe, llega a la orilla de un arroyo
que lamia, entre sus juncos y sus flores,
el verde margen blando.

Llegó a las bodas donde alegre el pueblo
convocado al festín, y entre la nieve
de una y otra cordera,
a la purpúrea rosa iguala el lirio,
cuando en la serrana
con halagos de amor y con agrados
del festín el umbroso bosque ampara.

¡Oh bienaventurado
albergue a cualquier hora,
templo de Pales, alquería de Flora!
No en ti la ambición mora
hidrópica de viento,
ni la que su alimento
el áspid es gitano;
no la que, del tirano
más tímida, cada hora
teme a la lisonja.`;

  console.log("Creando: Soledades — la boda aldeana…");
  const fragBoda = await prisma.fragment.create({
    data: {
      slug:     "soledades-boda-aldeana",
      title:    "La boda aldeana y el elogio del campo",
      location: "Soledades, Primera Soledad, vv. 94–181 (fragmento)",
      headline: "¡Oh bienaventurado albergue, templo de Pales, alquería de Flora!",
      text:     bodaText,
      order:    2,
      status:   "published",
      workId:   soledades.id,
      constellations: { connect: [{ id: consAmor.id }, { id: consCritica.id }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragBoda.id,
        type:  "contexto",
        order: 1,
        ...anchor(bodaText, "pastoral albergue, mal cubierto\nde ramas"),
        content:
          "El Peregrino —náufrago de amor que da hilo conductor a las *Soledades*— llega al mundo rural como refugio del cortesano mundo que le ha causado la pena amorosa. La oposición **campo/corte** es central en el poema: el campo no es solo naturaleza, sino modelo ético de vida sencilla frente a la ambición y la adulación de la corte. La boda campesina que presencia es la fiesta más pura y auténtica posible.",
      },
      {
        fragmentId: fragBoda.id,
        type:  "figura",
        order: 2,
        ...anchor(bodaText, "la purpúrea rosa iguala el lirio"),
        content:
          "**Emblema petrarquista en bucle**: la rosa purpúrea (mejilla roja) y el lirio blanco (piel pálida) son el código convencional para describir la belleza femenina desde Petrarca. Góngora lo usa para las aldeanas de la boda, lo que tiene doble función: elevar a estas mujeres sencillas con el lenguaje de la poesía cortesana, y mostrar que la verdadera hermosura no es patrimonio de la nobleza.",
      },
      {
        fragmentId: fragBoda.id,
        type:  "figura",
        order: 3,
        ...anchor(bodaText, "¡Oh bienaventurado\nalbergue a cualquier hora,\ntemplo de Pales, alquería de Flora"),
        content:
          "**Apóstrofe con referentes mitológicos**: **Pales** es la diosa romana de los pastores; **Flora**, la diosa de las flores. Llamar al refugio campesino «templo de Pales» y «alquería de Flora» transforma la humilde cabaña en espacio sagrado. Es la inversión gongorina del tópico horaciano *beatus ille*: quien es feliz no es el propietario de la finca lejana, sino quien realmente vive en contacto con la naturaleza.",
        externalCitation: `Horacio, *Epodo* II, 1–4: «Beatus ille qui procul negotiis, / ut prisca gens mortalium, / paterna rura bubus exercet suis / solutus omni faenore».`,
      },
      {
        fragmentId: fragBoda.id,
        type:  "glosa",
        order: 4,
        ...anchor(bodaText, "No en ti la ambición mora\nhidrópica de viento"),
        content:
          "«**Hidrópica de viento**» es imagen culterana: la **hidropesía** es la enfermedad en que el cuerpo retiene líquido y nunca se sacia. Aplicada a la ambición, significa que ésta jamás se saciarán de viento (de vanagloria, de honores vacíos). En pocos versos, Góngora enumera los males de la corte que el campo no tiene: ambición, adulación («lisonja»), miedo al poderoso. El catálogo negativo define por contraste el valor de la vida sencilla.",
      },
    ],
  });
  console.log("✅ Soledades: boda aldeana");

  // ══════════════════════════════════════════════════════════════
  // 2. SAN JUAN DE LA CRUZ — Noche oscura: glosa en prosa
  // ══════════════════════════════════════════════════════════════
  const nocheOscura = await prisma.work.findFirstOrThrow({ where: { slug: "noche-oscura" } });

  const declaracionText = `En una noche oscura,
con ansias en amores inflamada,
¡oh dichosa ventura!,
salí sin ser notada,
estando ya mi casa sosegada.

A oscuras y segura,
por la secreta escala disfrazada,
¡oh dichosa ventura!,
a oscuras y en celada,
estando ya mi casa sosegada.

En la noche dichosa,
en secreto, que nadie me veía,
ni yo miraba cosa,
sin otra luz y guía
sino la que en el corazón ardía.

Aquesta me guiaba
más cierto que la luz del mediodía,
adonde me esperaba
quien yo bien me sabía,
en parte donde nadie parecía.

¡Oh noche que guiaste!,
¡oh noche amable más que el alborada!,
¡oh noche que juntaste
Amado con amada,
amada en el Amado transformada!

En mi pecho florido,
que entero para él solo se guardaba,
allí quedó dormido,
y yo le regalaba,
y el ventalle de cedros aire daba.

El aire de la almena,
cuando yo sus cabellos esparcía,
con su mano serena
en mi cuello hería,
y todos mis sentidos suspendía.

Quedéme y olvidéme,
el rostro recliné sobre el Amado;
cesó todo, y dejéme,
dejando mi cuidado
entre las azucenas olvidado.`;

  console.log("Creando: Noche oscura — poema completo…");
  const fragNochePoema = await prisma.fragment.create({
    data: {
      slug:     "noche-oscura-poema-completo",
      title:    "Noche oscura (poema completo)",
      location: "Noche oscura del alma, canciones 1–8",
      headline: "Amado con amada, amada en el Amado transformada",
      text:     declaracionText,
      order:    2,
      status:   "published",
      workId:   nocheOscura.id,
      constellations: { connect: [{ id: consFe.id }, { id: consAmor.id }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragNochePoema.id,
        type:  "contexto",
        order: 1,
        ...anchor(declaracionText, "salí sin ser notada,\nestando ya mi casa sosegada"),
        content:
          "«La noche oscura» tiene dos niveles de lectura simultáneos: el **literal** (una mujer que escapa de noche al encuentro del amado, como en el Cantar de los Cantares) y el **espiritual** (el alma que sale de los sentidos y del apego al mundo para unirse con Dios). San Juan parte del poema como texto poético y luego lo comenta en prosa en su tratado *Noche oscura del alma*. La «casa sosegada» es el cuerpo con sus pasiones en quietud; la «noche» es la oscuridad del entendimiento humano que la mística debe atravesar.",
      },
      {
        fragmentId: fragNochePoema.id,
        type:  "intertextualidad",
        order: 2,
        ...anchor(declaracionText, "¡Oh noche que juntaste\nAmado con amada,\namada en el Amado transformada"),
        content:
          "El poema es una **glosa espiritual** del *Cantar de los Cantares* bíblico. La esposa del *Cantar* busca al Amado de noche (Ct 3,1-2: «En mi lecho, por las noches, busqué al amor de mi alma»). San Juan transforma ese lenguaje nupcial en vía mística: la «transformación» del alma en el Amado es la *unio mystica*, el grado supremo de la contemplación según la teología mística cristiana (Dionisio Areopagita, Bernardo de Claraval).",
        externalCitation: `Cantar de los Cantares 3, 1–2: «En mi lecho, por las noches, busqué al amor de mi alma; le busqué y no le hallé. Me levantaré ahora y rodearé por la ciudad; por las calles y por las plazas buscaré al amor de mi alma».`,
      },
      {
        fragmentId: fragNochePoema.id,
        type:  "figura",
        order: 3,
        ...anchor(declaracionText, "sin otra luz y guía\nsino la que en el corazón ardía"),
        content:
          "**Paradoja de la luz oscura**: la mística de San Juan se basa en la llamada *teología negativa* o *apofática* (Pseudo-Dionisio): Dios no se alcanza mediante la razón o los sentidos, sino precisamente cuando éstos se oscurecen. La «luz del corazón» no es razón: es fe, amor, impulso espiritual que guía «más cierto que la luz del mediodía» justamente porque prescinde de toda luz racional. La oscuridad es el camino, no el obstáculo.",
      },
      {
        fragmentId: fragNochePoema.id,
        type:  "figura",
        order: 4,
        ...anchor(declaracionText, "Quedéme y olvidéme,\nel rostro recliné sobre el Amado;\ncesó todo, y dejéme"),
        content:
          "La **coda** final condensa el itinerario místico en seis verbos: *quedéme, olvidéme, recliné, cesó, dejéme, olvidado*. El sujeto gramatical se va borrando: del «salí» activo de la primera estrofa, el alma pasa al «dejéme» pasivo. Es la imagen de la *kenosis* mística: el alma se vacía de sí misma para llenarse de Dios. El «cuidado» que queda «entre las azucenas olvidado» son todas las preocupaciones humanas, abandonadas en la unión.",
      },
    ],
  });
  console.log("✅ Noche oscura: poema completo con anotaciones");

  // ══════════════════════════════════════════════════════════════
  // 3. ANA CARO — Valor, agravio y mujer: Leonor se disfraza
  // ══════════════════════════════════════════════════════════════
  const valorAgravio = await prisma.work.findFirstOrThrow({ where: { slug: "valor-agravio-y-mujer" } });

  const leonorDisfrazText = `LEONOR: Que yo, señor don Fernando,
         soy mujer, y fui burlada;
         mas no tan fácil que así
         se pierda mi honor sin causa.
         Traje masculino y nombre
         de Leonardo me llama;
         básteme a mí ser quien soy,
         aunque el mundo me lo niegue.

DON JUAN: ¿Qué es lo que escucho? ¿Es posible
          que en tan bizarro aposento
          se encierre un alma de acero,
          valor tan noble y tan bello?

LEONOR: Sí es posible, don Fernando,
         porque yo aprendí a tenerle
         de mí misma; que una ofensa
         a una mujer de mis partes
         la enseña más que maestros
         a usar de valor y armas.
         Si el agravio me hizo hombre
         en el valor, no en la fama,
         ¿qué mucho que en hábito
         de varón mi causa traiga?`;

  console.log("Creando: Valor, agravio y mujer — Leonor se disfraza…");
  const fragLeonor = await prisma.fragment.create({
    data: {
      slug:     "valor-agravio-leonor-disfraz",
      title:    "Leonor: «Si el agravio me hizo hombre»",
      location: "Valor, agravio y mujer, Jornada II",
      headline: "Si el agravio me hizo hombre en el valor, no en la fama",
      text:     leonorDisfrazText,
      order:    2,
      status:   "published",
      workId:   valorAgravio.id,
      constellations: { connect: [{ id: consVoz.id }, { id: consHonor.id }, { id: consLibertad.id }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragLeonor.id,
        type:  "contexto",
        order: 1,
        ...anchor(leonorDisfrazText, "Traje masculino y nombre\n         de Leonardo me llama"),
        content:
          "El recurso del **disfraz varonil** (*mujer vestida de hombre*) es convención frecuente en la comedia barroca —Lope, Tirso, Calderón lo usan—, pero Ana Caro le da una carga feminista infrecuente: Leonor no se disfraza para seguir a su amado ni por amor, sino para recuperar su honor mancillado por don Juan de Córdoba, que la sedujo y la abandonó. El disfraz es instrumento de agencia, no de servilismo.",
      },
      {
        fragmentId: fragLeonor.id,
        type:  "figura",
        order: 2,
        ...anchor(leonorDisfrazText, "Si el agravio me hizo hombre\n         en el valor, no en la fama"),
        content:
          "La frase más importante de la obra: Leonor distingue entre «hombre en el **valor**» y «hombre en la **fama**». El valor —el coraje, la determinación, la capacidad de actuar— no es patrimonio exclusivo masculino; la fama (la reputación social) sí es asignada por la sociedad patriarcal solo a los varones. Leonor reivindica el valor para sí sin renunciar a su identidad femenina: su disfraz es instrumental, no identitario.",
      },
      {
        fragmentId: fragLeonor.id,
        type:  "pregunta",
        order: 3,
        ...anchor(leonorDisfrazText, "¿qué mucho que en hábito\n         de varón mi causa traiga"),
        content:
          "Leonor formula la pregunta retórica que desafía al público barroco: si la sociedad solo acepta la agencia en los hombres, ¿tiene sentido que una mujer agraviada se vista de hombre para obtener justicia? ¿Es el disfraz una victoria o una capitulación ante un sistema que no reconoce la capacidad femenina? ¿Puede Leonor recuperar su honor sin reproducir el sistema que se lo negó?",
      },
    ],
  });
  console.log("✅ Valor, agravio y mujer: Leonor y el disfraz");

  // ══════════════════════════════════════════════════════════════
  // 4. MORATÍN — La comedia nueva: Don Pedro vs. el mal teatro
  // ══════════════════════════════════════════════════════════════
  const comedaNueva = await prisma.work.findFirstOrThrow({ where: { slug: "la-comedia-nueva-o-el-cafe" } });

  const pedroText = `DON PEDRO: Para escribir en castellano con acierto,
             ya ve usted que no basta saber el idioma; se
             necesita, además de eso, haber leído mucho,
             haber visto mucho, haber pensado mucho; se
             necesita conocer el corazón humano, sus
             pasiones, sus errores y sus virtudes.

ELEUTERIO: Pues yo he leído algo.

DON PEDRO: Sí, eso es lo que hay. Se han leído cuatro
             comedias malas, y se cree uno con talento
             para escribir veinte. Hasta los niños quieren
             hoy ser autores: cualquiera piensa que le
             basta con juntar palabras y hacer que hablen
             personajes que se matan en escena.

ELEUTERIO: Pero, señor don Pedro, usted es muy severo.

DON PEDRO: Soy justo. Y no es esto lo peor: lo peor es
             que, cuando la razón y la crítica se atreven a
             decir la verdad, se toma por envidia o por
             ignorancia. El mérito juzga sin compasión, y
             el que no le tiene se defiende con el aplauso
             del vulgo. ¿Cuándo se ha visto en un hombre
             de letras verdadero que haya necesitado de los
             gritos de la cazuela para saber si su obra
             valía?

ELEUTERIO: Señor don Pedro, usted habla muy claro.

DON PEDRO: Hablo como pienso. ¿Qué se ha de hacer
             cuando se ve destruida la buena literatura por
             la ignorancia de unos y la tolerancia de otros?`;

  console.log("Creando: La comedia nueva — Don Pedro y el mal teatro…");
  const fragPedro = await prisma.fragment.create({
    data: {
      slug:     "la-comedia-nueva-don-pedro",
      title:    "Don Pedro y la crítica de la ignorancia literaria",
      location: "La comedia nueva o El café, acto II, escena VIII",
      headline: "Soy justo. El mérito juzga sin compasión",
      text:     pedroText,
      order:    2,
      status:   "published",
      workId:   comedaNueva.id,
      constellations: { connect: [{ id: consCritica.id }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragPedro.id,
        type:  "contexto",
        order: 1,
        ...anchor(pedroText, "Para escribir en castellano con acierto"),
        content:
          "**Don Pedro** es el *raisonneur* o portavoz ilustrado de Moratín: el personaje serio que formula la crítica neoclásica del teatro barroco populachero. Su discurso resume el programa de la Ilustración española en materia dramática: el teatro debe enseñar (*docere*) y deleitar (*delectare*), pero solo puede hacerlo quien tiene formación sólida. Frente a él, **Eleuterio** es el tipo del mal escritor: sin conocimiento, sin oficio, convencido de su talento.",
      },
      {
        fragmentId: fragPedro.id,
        type:  "figura",
        order: 2,
        ...anchor(pedroText, "los gritos de la cazuela"),
        content:
          "La «**cazuela**» era el gallinero del teatro del Siglo de Oro: el anfiteatro alto donde se apiñaban el público más popular y bullicioso, el más propenso a abuchear o aplaudir sin criterio. Para los ilustrados como Moratín, el aplauso de la cazuela era señal segura de mal gusto. Esta crítica al público entronca con la *Poética* de Aristóteles y la *Epístola a los Pisones* de Horacio: la buena literatura no busca el aplauso fácil.",
      },
      {
        fragmentId: fragPedro.id,
        type:  "intertextualidad",
        order: 3,
        ...anchor(pedroText, "conocer el corazón humano, sus\n             pasiones, sus errores y sus virtudes"),
        content:
          "Don Pedro enuncia el programa neoclásico de la **imitación de la naturaleza**: el teatro debe representar la conducta humana con verdad psicológica para que el espectador reconozca sus propias pasiones y aprenda a corregirlas. Esta es la teoría aristotélica de la **catarsis**, releída a través del neoclasicismo francés (Molière, Corneille). La obra de Moratín, ambientada en un café madrileño del tiempo real, es su propia demostración práctica.",
        externalCitation: `Aristóteles, *Poética*, 1452a: «La tragedia es imitación de acción esforzada y completa, con la cual, mediante la compasión y el terror, lleva a cabo la purgación de tales afecciones».`,
      },
    ],
  });
  console.log("✅ La comedia nueva: Don Pedro");

  // ══════════════════════════════════════════════════════════════
  // 5. ESPRONCEDA — El diablo mundo: Canto I (meditación sobre la muerte)
  // ══════════════════════════════════════════════════════════════
  const diabloMundo = await prisma.work.findFirstOrThrow({ where: { slug: "el-diablo-mundo" } });

  const canto1Text = `¡Canta, musa inmortal, con voz potente,
el eterno proceso de la vida,
que en la corriente del vivir presente,
es pasado que en sombras se oscurece!

¿Qué es la vida? Pregunta que no tiene
respuesta en el turbión de los afanes.
El hombre que nació llora y se muere,
y entre el nacer y el morir le prenden
cadenas de su propio pensamiento.

Yo quiero un bien que no se acabe, un cielo
sin nubes de inquietud que lo oscurezcan,
quiero que exista Dios porque lo anhelo,
y sin él, mis deseos ¿qué pudieran?
Quiero la libertad, quiero el sosiego,
la fe que el corazón fortifica y premia.

¿Por qué nace el hombre? Por ventura
¿nació para sufrir penas y enojos,
para agitarse en miserable holgura,
entre el dolor que hiere y los sonrojos
de la fortuna que en su angosta esfera
le tiene aprisionado? ¿O acaso fuera
para algo más que esto? ¿Habrá en la tierra
algo mayor? ¿Y qué? La gloria, el nombre,
el sonar en la boca de los hombres,
¿es esto solo lo que resta, el hombre?`;

  console.log("Creando: El diablo mundo — Canto I…");
  const fragDiablo1 = await prisma.fragment.create({
    data: {
      slug:     "el-diablo-mundo-canto-i",
      title:    "Canto I: «¿Qué es la vida?»",
      location: "El diablo mundo, Canto I",
      headline: "Quiero la libertad, quiero el sosiego, la fe que el corazón fortifica",
      text:     canto1Text,
      order:    2,
      status:   "published",
      workId:   diabloMundo.id,
      constellations: { connect: [{ id: consLibertad.id }, { id: consMuerte.id }, { id: consPaso.id }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragDiablo1.id,
        type:  "contexto",
        order: 1,
        ...anchor(canto1Text, "¡Canta, musa inmortal, con voz potente"),
        content:
          "El Canto I de *El diablo mundo* (1840) es un prólogo filosófico al poema: Espronceda invoca a la «musa inmortal» —gesto épico clásico desde Homero— pero para plantear preguntas radicalmente modernas sobre la existencia. El poema quedó inacabado (solo se completaron seis cantos más la «Canción a Teresa») y es el más ambicioso del Romanticismo español: quería ser una suma poética del ser humano, una *Divina Comedia* romántica española.",
      },
      {
        fragmentId: fragDiablo1.id,
        type:  "figura",
        order: 2,
        ...anchor(canto1Text, "¿Qué es la vida? Pregunta que no tiene\nrespuesta en el turbión de los afanes"),
        content:
          "La pregunta «¿qué es la vida?» conecta directamente con Calderón (*«¿Qué es la vida? Un frenesí»*, La vida es sueño) y, a través de él, con toda la tradición del *vanitas vanitatum* (Eclesiastés). Pero el escepticismo romántico de Espronceda es diferente: no hay respuesta en el reino de los afanes humanos. El Romanticismo radicaliza el desencanto barroco: Segismundo hallaba una solución moral («obrar bien»); Espronceda solo ve la pregunta sin fondo.",
      },
      {
        fragmentId: fragDiablo1.id,
        type:  "figura",
        order: 3,
        ...anchor(canto1Text, "Yo quiero un bien que no se acabe, un cielo\nsin nubes de inquietud que lo oscurezcan,\nquiero que exista Dios porque lo anhelo"),
        content:
          "**El deseo imposible romántico**: Espronceda anhela la eternidad, la fe, la libertad absoluta —pero el propio verso deja ver que son deseos, no certezas. «Quiero que exista Dios porque lo anhelo» es la más honesta confesión romántica: no afirma la existencia de Dios, solo la necesidad humana de creer. Es lo que Unamuno llamará décadas después el «sentimiento trágico de la vida»: la razón niega, el corazón exige.",
      },
    ],
  });
  console.log("✅ El diablo mundo: Canto I");

  console.log("\n✅ 5 nuevos fragmentos (lote 2) añadidos:");
  console.log("  1. soledades-boda-aldeana");
  console.log("  2. noche-oscura-poema-completo");
  console.log("  3. valor-agravio-leonor-disfraz");
  console.log("  4. la-comedia-nueva-don-pedro");
  console.log("  5. el-diablo-mundo-canto-i");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
