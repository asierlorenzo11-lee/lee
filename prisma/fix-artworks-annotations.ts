/**
 * fix-artworks-annotations.ts
 *
 * 1. Assigns artwork images to 9 fragments that lack them
 *    (4 new Coplas + 5 intertextual Siglo XX fragments)
 *
 * 2. Adds missing annotation types to those same 9+9 fragments:
 *    - pregunta (all 9 fragments missing it)
 *    - glosa    (Bergamín, Neruda, Otero, Ridruejo, Diego + Iriarte flauta + Jovellanos instr. + Rosalía yo-no-sé)
 *    - figura   (Bergamín, Neruda)
 *    - contexto (coplas-consiento)
 *    - intertextualidad for the new Coplas (lo-presente, este-mundo, la-muerte, consiento → intertextos SXX)
 */

import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

let ok = 0, fail = 0;

function anchor(text: string, needle: string) {
  const i = text.indexOf(needle);
  if (i === -1) throw new Error(`Anchor not found: "${needle.slice(0, 40)}"`);
  return { anchorStart: i, anchorEnd: i + needle.length };
}

async function addAnn(
  fragText: string,
  fragId: string,
  type: string,
  needle: string,
  order: number,
  content: string,
  externalCitation?: string,
) {
  try {
    await prisma.annotation.create({
      data: {
        fragmentId: fragId,
        type: type as any,
        ...anchor(fragText, needle),
        order,
        content,
        ...(externalCitation ? { externalCitation } : {}),
      },
    });
    ok++;
  } catch (e: any) {
    fail++;
    console.error(`  ✗ ${type}@"${needle.slice(0, 30)}" → ${e.message}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 1: ARTWORKS
// ─────────────────────────────────────────────────────────────────────────────
const ARTWORKS = [
  {
    slug: "coplas-lo-presente-es-ido",
    artworkImageUrl: "/images/artworks/steenwijck-vanitas.jpg",
    artworkTitle: "Vanitas",
    artworkAuthor: "Harmen Steenwijck, h. 1640",
    artworkCaption:
      "El bodegón de *vanitas*, género predilecto del Barroco nórdico, pone en imagen lo que la Copla II enuncia: el presente se desvanece «en un punto». El cráneo, la vela a medio consumir, los libros y los instrumentos científicos recuerdan que el saber, el tiempo y la materia son igualmente perecederos. No se engañe nadie.",
  },
  {
    slug: "coplas-este-mundo-es-el-camino",
    artworkImageUrl: "/images/artworks/poussin-pastores-de-arcadia.jpg",
    artworkTitle: "Et in Arcadia ego (Los pastores de Arcadia)",
    artworkAuthor: "Nicolas Poussin, h. 1637-1638",
    artworkCaption:
      "«Yo también estuve en Arcadia»: la inscripción en la tumba que descubren los pastores de Poussin dice exactamente lo mismo que Manrique en la Copla V. Si este mundo es el camino, no la morada, nadie escapa de la muerte ni siquiera en el paraíso pastoral. Partimos cuando nacemos, andamos mientras vivimos, y llegamos.",
  },
  {
    slug: "coplas-la-muerte-llama-a-su-puerta",
    artworkImageUrl: "/images/artworks/brueghel-triunfo-de-la-muerte.jpg",
    artworkTitle: "El triunfo de la Muerte",
    artworkAuthor: "Pieter Brueghel el Viejo, h. 1562",
    artworkCaption:
      "Brueghel pintó el triunfo de la Muerte sobre todo el mundo humano —reyes, caballeros, campesinos— en un paisaje apocalíptico exactamente contemporáneo a las Coplas. La Muerte llama a la puerta de Don Rodrigo Manrique en 1476; Brueghel la pinta arrasando con todos, sin distinción. Los «castillos impugnables» que Manrique menciona son las mismas fortalezas vencidas que aparecen en el cuadro.",
  },
  {
    slug: "coplas-consiento-en-mi-morir",
    artworkImageUrl: "/images/artworks/pereda-sueno-del-caballero.jpg",
    artworkTitle: "El sueño del caballero",
    artworkAuthor: "Antonio de Pereda, h. 1650",
    artworkCaption:
      "Un caballero adormecido mientras un ángel señala la vanidad del mundo —coronas, armas, riquezas, la rueda de la Fortuna— esparcidas a su alrededor. Pereda pintó exactamente la actitud de Don Rodrigo Manrique: el guerrero que ha decidido no aferrarse al mundo y consiente en su morir «con voluntad placentera, clara y pura». Lo que el hombre del cuadro ve en sueños, don Rodrigo lo vive conscientemente.",
  },
  {
    slug: "bergamin-alma-dormida",
    artworkImageUrl: "/images/artworks/fuseli-pesadilla.jpg",
    artworkTitle: "La pesadilla",
    artworkAuthor: "Henry Fuseli, 1781",
    artworkCaption:
      "Fuseli pintó el momento más oscuro del sueño: la durmiente oprimida por una presencia fantasmal. Bergamín pregunta lo contrario de Manrique: donde el medieval exigía «recuerde el alma dormida», el moderno pregunta «si está el alma dormida, ¿para qué despertarla?». El sueño del siglo XX ya no es ignorancia que combatir sino quizás el único refugio de quien sabe demasiado.",
  },
  {
    slug: "neruda-oda-manrique",
    artworkImageUrl: "/images/artworks/aivazovsky-novena-ola.jpg",
    artworkTitle: "La novena ola",
    artworkAuthor: "Ivan Aivazovsky, 1850",
    artworkCaption:
      "La novena ola —la más grande, la que puede hundir todo— era para los marineros la imagen del poderío absoluto del mar. Neruda, poeta del Pacífico, vio en Manrique al poeta del mar: sus coplas son «ríos que van a dar en la mar, que es el morir». Comparar a Manrique con el océano es reconocer que sus versos tienen la misma inevitabilidad y grandeza que las olas.",
  },
  {
    slug: "ridruejo-con-manrique",
    artworkImageUrl: "/images/artworks/ruisdael-molino.jpg",
    artworkTitle: "El molino de Wijk bij Duurstede",
    artworkAuthor: "Jacob van Ruisdael, h. 1668-1670",
    artworkCaption:
      "El molino de Ruisdael es imagen del tiempo en movimiento: el agua fluye, las aspas giran, el cielo cambia. Ridruejo escribe «sigue como pasa el río / efimeramente vivo» para hablar de Manrique —y de sí mismo, exiliado político que también fluye sin poder anclarse. El río manriqueño que va al mar se convierte en Ridruejo en un fluir sin destino final cierto, la vida como tránsito perpetuo.",
  },
  {
    slug: "otero-tumulo-de-gasoil",
    artworkImageUrl: "/images/artworks/goya-duelo-garrotes.jpg",
    artworkTitle: "Duelo a garrotazos",
    artworkAuthor: "Francisco de Goya, 1820-1823",
    artworkCaption:
      "Dos hombres se hunden en el barro mientras se golpean hasta la muerte: una de las «Pinturas negras» que Goya dejó en las paredes de su propia casa. Blas de Otero escribe «Túmulo de gasoil» para los muertos de esa misma violencia española secular —la que no aparece en las crónicas oficiales pero sí en los cuadros de Goya y en los poemas de los vencidos. El «empedrado» de Otero es el barro de Goya.",
  },
  {
    slug: "diego-glosa-a-manrique",
    artworkImageUrl: "/images/artworks/botticelli-primavera.jpg",
    artworkTitle: "La primavera (Primavera)",
    artworkAuthor: "Sandro Botticelli, h. 1477-1482",
    artworkCaption:
      "Botticelli pintó el amor, la belleza y la abundancia como jardín del humanismo: Venus, las Gracias, Mercurio, Cupido. Gerardo Diego glosa los versos amorosos de Manrique y los lleva al mismo territorio de luz y eros: «Linda hipótesis de llama / realidad de alta hermosura». La primavera de Botticelli es la misma «gloria de las altas alegrías de Cupido» que cierra el poema de Diego.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 2-5: ANOTACIONES por fragmento
// ─────────────────────────────────────────────────────────────────────────────

async function annotateCoplaLoPresente(id: string, t: string) {
  await addAnn(t, id, "pregunta", "Pues si vemos lo presente", 4,
    "Si el presente desaparece «en un punto», ¿qué consecuencias tiene eso para nuestra forma de valorar las cosas materiales? ¿Coincides con Manrique en que la sabiduría consiste en tratar lo que aún no ha llegado «como si ya hubiera pasado»? ¿Es posible —o deseable— vivir así?");
  await addAnn(t, id, "intertextualidad", "daremos lo no venido\npor pasado", 5,
    "La misma paradoja temporal que Manrique formula en la Copla II —el futuro ya es pasado, porque todo pasa— reaparece en Blas de Otero (*Túmulo de gasoil*, 1970): «decidme, qué se hicieron / los Infantes de Aragón». Otero cita literalmente el *ubi sunt* de las Coplas y lo convierte en elegía política: el mismo lamento, pero sobre los muertos de la Guerra Civil española.",
    "Blas de Otero, *Hojas de Madrid con La galerna* (1970): «Hojas sueltas, decidme, qué se hicieron / los Infantes de Aragón, Manuel Granero...»");
}

async function annotateCoplaEsteMundo(id: string, t: string) {
  await addAnn(t, id, "contexto", "Este mundo es el camino\npara el otro", 4,
    "La metáfora del mundo como *via* (camino) es una de las más antiguas del pensamiento cristiano medieval: *vita est via*, la vida es camino. Agustín de Hipona, Tomás Kempis y toda la mística medieval insistieron en que el viajero no puede confundir el camino con la meta. Manrique condensa seis siglos de espiritualidad cristiana en doce versos que lo dicen todo: vivir bien es andar bien, y morir es simplemente llegar.");
  await addAnn(t, id, "pregunta", "así que, cuando morimos,\ndescansamos", 5,
    "Manrique concluye la copla con una imagen sorprendente: morir es *descansar*. ¿Cómo cambia tu relación con la idea de la muerte si la entiendes como una llegada al destino en lugar de una pérdida? ¿Qué condición habría que cumplir, según el poema, para que esa llegada sea un descanso y no otra cosa?");
  await addAnn(t, id, "intertextualidad", "Partimos cuando nacemos,\nandamos mientras vivimos", 6,
    "La Copla V describe la vida como un viaje de tres verbos: *partimos / andamos / llegamos*. Gerardo Diego recoge exactamente ese esquema de movimiento en su «Glosa a Manrique» (*Poemas adrede*, 1932): «Sigue como pasa el río / efimeramente vivo». El hombre-viajero de Manrique se convierte en el río-tiempo de Diego y, después, de Ridruejo: la misma imagen del tránsito, distintas épocas.",
    "Dionisio Ridruejo, *Hasta la fecha* (1981): «Sigue como pasa el río / efimeramente vivo».");
}

async function annotateCoplaLaMuerte(id: string, t: string) {
  await addAnn(t, id, "pregunta", "diciendo: «Buen caballero,", 5,
    "La Muerte habla aquí en segunda persona, como si conociera íntimamente al caballero. ¿Qué efectos produce ese tono casi de confesor o de amiga? ¿Cómo se diferencia esta imagen de la Muerte de las que conoces de la cultura popular actual —películas, videojuegos, canciones? ¿Qué relación con la muerte supone ese diálogo?");
  await addAnn(t, id, "intertextualidad", "en la su villa de Ocaña\nvino la Muerte a llamar", 6,
    "La Muerte que llega a Ocaña en 1476 y habla con Don Rodrigo reaparece en Pablo Neruda: «Adelante, le dije / y entró el buen caballero / de la muerte». Neruda convierte esta escena en un encuentro personal con el propio Manrique —no con su padre— y la Muerte llega de nuevo «tan callando», pero ahora con «armadura de plata verde» y «ojos como el agua marina». La misma Muerte, tres estilos distintos: medieval, épico, poético.",
    "Pablo Neruda, *Nuevas odas elementales* (1957): «Adelante, le dije / y entró el buen caballero / de la muerte. / Era de plata verde / su armadura.»");
}

async function annotateCoplaConsiento(id: string, t: string) {
  await addAnn(t, id, "contexto", "todos sentidos humanos\nconservados", 4,
    "La fórmula «todos sentidos humanos conservados» es la clave del *ars moriendi* medieval: la muerte cristiana perfecta se producía con la mente lúcida, rodeado de familia y habiendo recibido los sacramentos. Morir *con sentido* —no en el delirio ni en la soledad— era la prueba de que el moribundo estaba en gracia divina. El poema de Manrique documenta, además de un sentimiento filial, un *modelo de muerte* que la Iglesia medieval promovía como ideal.");
  await addAnn(t, id, "pregunta", "Y consiento en mi morir\ncon voluntad placentera", 5,
    "Don Rodrigo «consiente» en su morir «con voluntad placentera, clara y pura». ¿Es posible aceptar la muerte con esa serenidad? ¿Qué condiciones —vitales, morales, espirituales— harían posible esa actitud? ¿Conoces personajes reales o literarios que hayan afrontado su muerte de un modo parecido?");
  await addAnn(t, id, "intertextualidad", "dejónos harto consuelo\nsu memoria", 6,
    "El cierre del poema —«dejónos harto consuelo / su memoria»— es exactamente lo que los poetas del siglo XX buscan en Manrique: consuelo en su memoria. Pablo Neruda termina su *Oda a Don Jorge Manrique*: «así, Jorge Manrique, / tu nombre nos acompaña / todavía». Y Dionisio Ridruejo: «Sigue hablando el caballero». Seiscientos años después, la memoria de Manrique sigue consolando.",
    "Pablo Neruda, *Nuevas odas elementales* (1957): «así, Jorge Manrique, / tu nombre nos acompaña / todavía». Dionisio Ridruejo, *Hasta la fecha* (1981): «Desde su almena de tiempo / sigue hablando el caballero.»");
}

async function annotateBergamin(id: string, t: string) {
  await addAnn(t, id, "glosa", "Si está el alma dormida,\n¿para qué despertarla?", 3,
    "**despertarla**: el infinitivo *despertar* en Bergamín no es una propuesta de ignorancia sino de compasión. Mantener dormida al alma que ya ha sufrido puede ser misericordia, no cobardía. Manrique la quería despierta ante la muerte; Bergamín la quiere protegida del dolor de esa conciencia. El siglo XX ha vivido demasiado como para creer que despertar sea siempre bueno.");
  await addAnn(t, id, "figura", "Muy poco a poco,\nlentamente,\nme estoy muriendo\nde repente", 4,
    "**Paradoja** y **zeugma temporal**: «poco a poco» y «de repente» son antónimos que Bergamín funde en la misma imagen de la muerte. El poeta muere *gradualmente* (el envejecimiento diario) y *de repente* (cuando llega el momento). Esta paradoja, imposible en lógica, es exacta en experiencia vital: la muerte siempre nos sorprende aunque la veamos venir. Es la misma «muerte tan callando» de Manrique, convertida en humor negro modernista.");
  await addAnn(t, id, "pregunta", "Y de mi vida desconfío\nporque no corre\ncomo el río", 5,
    "Bergamín invierte la metáfora de Manrique: donde las Coplas veían la vida corriendo como río hacia el mar-muerte, Bergamín *desconfía* de su vida porque *no* corre como el río. ¿Qué supone esa diferencia? ¿Qué tipo de vida le falta a Bergamín para que fluya con la serenidad que Manrique atribuye al caballero cristiano? ¿Puede el hombre moderno morir «con voluntad placentera»?");
}

async function annotateNeruda(id: string, t: string) {
  await addAnn(t, id, "glosa", "no puedo\noponer sino el aire\na tus estrofas", 3,
    "**oponer el aire**: imagen de humildad poética extrema. El *aire* —lo más efímero, lo menos sólido— es todo lo que Neruda puede ofrecer frente a las estrofas de Manrique, que son «de hierro y sombra» y «de diamantes oscuros». Es un *captatio benevolentiae* invertido: en lugar de alabar al lector, Neruda se rebaja a sí mismo ante el poeta clásico. Para Neruda, uno de los grandes poetas del siglo XX, las Coplas son más permanentes que su propia obra.");
  await addAnn(t, id, "figura", "Era de plata verde\nsu armadura\ny sus ojos\neran\ncomo el agua marina", 4,
    "**Sinestesia** y **metáfora cromática**: «plata verde» es un color imposible en la realidad pero perfecto en la visión poética —fría, brillante, con la cualidad del mar. Los ojos «como el agua marina» convierten al caballero de la muerte en figura acuática, fluvial: el caballero Manrique y su metáfora de los ríos se funden en una sola imagen. Neruda reescribe las Coplas en imágenes sensoriales propias del modernismo americano.");
  await addAnn(t, id, "pregunta", "Habla, le dije, caballero\nJorge,\nno puedo\noponer sino el aire\na tus estrofas", 5,
    "Neruda dialoga con Manrique de tú a tú, como si pudiera hablar con él. ¿Qué le diría un poeta del siglo XXI a Manrique si pudiera hacerlo? ¿Qué preguntas le harías? ¿Qué crees que le respondería Manrique sobre la muerte, la fama y la memoria en un mundo como el nuestro?");
}

async function annotateRidruejo(id: string, t: string) {
  await addAnn(t, id, "glosa", "en su troje", 4,
    "**troje**: granero, almacén de cereal. La imagen de la Muerte con su troje —cosechando a los seres humanos como si fueran grano— viene de la tradición alegórica medieval y barroca: la muerte como segadora. Ridruejo elige esta palabra arcaica para acercarse al léxico de Manrique y dialogar con él también a nivel de lengua, no solo de ideas.");
  await addAnn(t, id, "pregunta", "Sigue como pasa el río\nefimeramente vivo", 5,
    "Para Ridruejo, Manrique «sigue hablando» desde su «almena de tiempo». ¿Por qué un poema del siglo XV puede seguir siendo relevante siglos después? ¿Qué tema de las Coplas te parece más atemporal y universal? ¿Existe algún poeta actual que creas que seguirá siendo leído en quinientos años?");
}

async function annotateOtero(id: string, t: string) {
  await addAnn(t, id, "glosa", "microsurco", 3,
    "**microsurco**: la tecnología de los discos de vinilo LP (*long play*), surgida en los años 1950, caracterizada por surcos muy finos que permitían grabar más tiempo. Otero inserta este tecnicismo moderno en plena elegía al estilo del *ubi sunt* medieval: como Manrique preguntaba «¿qué fue de tanta invención?», Otero pregunta «¿qué fue de tanta música?». La industria cultural del siglo XX es la nueva corte del siglo XV.");
  await addAnn(t, id, "pregunta", "Hojas sueltas, decidme, qué se hicieron\nlos Infantes de Aragón", 4,
    "Otero mezcla en un mismo verso «los Infantes de Aragón» de Manrique con Manuel Granero (torero muerto en 1922) y los niños del Madrid del franquismo. ¿Qué efecto produce esa mezcla de siglos y clases sociales? ¿A qué personas o eventos recientes aplicarías tú el *ubi sunt* de Manrique? ¿Quiénes son los «Infantes de Aragón» de hoy?");
}

async function annotateDiego(id: string, t: string) {
  await addAnn(t, id, "glosa", "Abrasa mi hilo-memoria\ncon las chispas que solías", 5,
    "**hilo-memoria**: neologismo creacionista que funde dos sustantivos. No es «el hilo de la memoria» (imagen convencional) sino «hilo-memoria»: un solo objeto compuesto, como el hilo de Ariadna pero de recuerdos. Es la imagen que Vicente Huidobro, padre del creacionismo, enseñó a Diego: la poesía no imita el mundo, lo crea. Un «hilo-memoria» no existía antes de este poema.");
  await addAnn(t, id, "pregunta", "por más merecer la gloria\nde las altas alegrías\nde Cupido", 6,
    "Diego recupera la *glosa*, forma medieval que desarrolla versos ajenos al final de cada estrofa. El mote que toma de Manrique es de sus *canciones de amor*, no de las *Coplas*. ¿Por qué un poeta vanguardista querría revivir esta forma clásica? ¿Qué dice de la tradición literaria el hecho de que Diego glosen a Manrique en 1932, plena vanguardia?");
}

// Iriarte: el-burro-flautista (missing glosa)
async function annotateIriarteFlauta(id: string, t: string) {
  // Use a phrase likely to appear in the fable
  const needle = t.split("\n").find(l => l.trim().length > 5)?.trim().slice(0, 35) ?? t.slice(0, 35);
  await addAnn(t, id, "glosa", needle, 10,
    "Las fábulas de Iriarte están escritas en variedad de metros: romance, octavas, redondillas. La métrica no es un adorno sino parte del argumento literario: Iriarte demuestra con la forma misma de sus textos que la técnica poética puede ser tan variada como los temas. El burro que hace sonar la flauta «sin querer» es la crítica a los poetas que escriben por accidente —o casualidad— y se creen genios.");
}

// Jovellanos: jovellanos-instruccion-publica (missing glosa)
async function annotateJovellanos(id: string, t: string) {
  const needle = t.split("\n").find(l => l.trim().length > 5)?.trim().slice(0, 35) ?? t.slice(0, 35);
  await addAnn(t, id, "glosa", needle, 10,
    "El vocabulario de Jovellanos mezcla términos jurídicos y administrativos (*expediente*, *instrucción*, *erario*) con los conceptos filosóficos de la Ilustración (*luces*, *razón*, *progreso*). Esa combinación —burocrática y filosófica a la vez— es característica del ilustrado español: alguien que necesita reformar las instituciones reales, no solo debatir ideas abstractas. Jovellanos no escribe tratados utópicos; escribe informes para el rey.");
}

// Rosalía: yo-no-se-lo-que-busco (missing glosa)
async function annotateRosaliaYoNoSe(id: string, t: string) {
  const needle = t.split("\n").find(l => l.trim().length > 5)?.trim().slice(0, 35) ?? t.slice(0, 35);
  await addAnn(t, id, "glosa", needle, 10,
    "El lenguaje de Rosalía en *En las orillas del Sar* es deliberadamente más abstracto que el de sus poemas en gallego: la indefinición del objeto («no sé lo que busco», «algo que no acaba») es en sí misma el tema. La gramática del deseo imposible —sin objeto concreto, sin verbo que lo resuelva— hace de Rosalía la poeta más cercana al *Sturm und Drang* europeo y, a la vez, la precursora del simbolismo español.");
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  // Section 1: artworks
  console.log("── Artworks ──");
  for (const art of ARTWORKS) {
    await prisma.fragment.update({
      where: { slug: art.slug },
      data: {
        artworkImageUrl: art.artworkImageUrl,
        artworkTitle: art.artworkTitle,
        artworkAuthor: art.artworkAuthor,
        artworkCaption: art.artworkCaption,
      },
    });
    console.log(`  ✓ artwork → ${art.slug}`);
  }

  // Section 2-5: annotations
  console.log("\n── Anotaciones ──");

  const slugs = [
    "coplas-lo-presente-es-ido",
    "coplas-este-mundo-es-el-camino",
    "coplas-la-muerte-llama-a-su-puerta",
    "coplas-consiento-en-mi-morir",
    "bergamin-alma-dormida",
    "neruda-oda-manrique",
    "ridruejo-con-manrique",
    "otero-tumulo-de-gasoil",
    "diego-glosa-a-manrique",
    "el-burro-flautista",
    "jovellanos-instruccion-publica",
    "yo-no-se-lo-que-busco",
  ];

  const frags = await prisma.fragment.findMany({
    where: { slug: { in: slugs } },
    select: { id: true, slug: true, text: true },
  });
  const bySlug = Object.fromEntries(frags.map(f => [f.slug, f]));

  async function run(slug: string, fn: (id: string, t: string) => Promise<void>) {
    const f = bySlug[slug];
    if (!f) { console.error(`  ✗ slug not found: ${slug}`); return; }
    await fn(f.id, f.text);
    console.log(`  ✓ anotaciones → ${slug}`);
  }

  await run("coplas-lo-presente-es-ido",        annotateCoplaLoPresente);
  await run("coplas-este-mundo-es-el-camino",    annotateCoplaEsteMundo);
  await run("coplas-la-muerte-llama-a-su-puerta", annotateCoplaLaMuerte);
  await run("coplas-consiento-en-mi-morir",      annotateCoplaConsiento);
  await run("bergamin-alma-dormida",             annotateBergamin);
  await run("neruda-oda-manrique",               annotateNeruda);
  await run("ridruejo-con-manrique",             annotateRidruejo);
  await run("otero-tumulo-de-gasoil",            annotateOtero);
  await run("diego-glosa-a-manrique",            annotateDiego);
  await run("el-burro-flautista",                annotateIriarteFlauta);
  await run("jovellanos-instruccion-publica",    annotateJovellanos);
  await run("yo-no-se-lo-que-busco",             annotateRosaliaYoNoSe);

  console.log(`\n✅ Resultado: ${ok} anotaciones creadas, ${fail} fallos.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
