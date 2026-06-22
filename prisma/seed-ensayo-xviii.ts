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
  // ──────────────────────────────────────────────────────────────
  // Taxonomías preexistentes
  // ──────────────────────────────────────────────────────────────
  const consCritica = await prisma.constellation.findFirstOrThrow({
    where: { slug: "critica-social" },
  });
  const consPoder = await prisma.constellation.findFirstOrThrow({
    where: { slug: "poder" },
  });
  const topicDesengano = await prisma.topic.findFirst({
    where: { slug: "desengano" },
  });

  // ──────────────────────────────────────────────────────────────
  // 1. CADALSO — Cartas XII y XIII (Nobleza hereditaria)
  // ──────────────────────────────────────────────────────────────
  console.log("Buscando obra Cartas marruecas...");
  const cartasMarruecas = await prisma.work.findFirstOrThrow({
    where: { slug: "cartas-marruecas" },
  });

  // ── Carta XII ──
  const carta12Text = `En Marruecos no tenemos idea de lo que por acá se llama nobleza hereditaria, con que no me entenderías si te dijera que en España no sólo hay familias nobles, sino provincias que lo son por heredad. Yo mismo que lo estoy presenciando no lo comprendo. Te propondré un ejemplo práctico, y lo entenderás menos, como sucede; y si no, lee:

Pocos días ha, pregunté si estaba el coche pronto, pues mi amigo Nuño estaba malo y yo quería visitarle. Me dijeron que no. Al cabo de media hora, hice igual pregunta, y hallé igual respuesta. Pasada otra media, pregunté, y me respondieron lo propio, y de allí a poco me dijeron que el coche estaba puesto, pero que el cochero estaba ocupado. Indagué la ocupación al bajar las escaleras, y él mismo me desengañó, saliéndome al encuentro y diciéndome:

—Aunque soy cochero, soy noble. Han venido unos vasallos míos, y me han querido besar la mano para llevar este consuelo a sus casas; con que por eso me he detenido, pero ya despaché. ¿Adónde vamos?

Y al decir esto, montó en la mula y arrimó el coche.`;

  console.log("Creando Carta XII...");
  const fragCartaXII = await prisma.fragment.create({
    data: {
      slug: "carta-xii-cadalso",
      title: "Carta XII",
      location: "Cartas marruecas, Carta XII",
      headline: "«Aunque soy cochero, soy noble»",
      text: carta12Text,
      order: 2,
      status: "published",
      workId: cartasMarruecas.id,
      constellations: { connect: [{ id: consCritica.id }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragCartaXII.id,
        type: "glosa",
        ...anchor(carta12Text, "me desengañó"),
        order: 1,
        content: `«Desengañar» no significa decepcionar, sino revelar la verdad oculta tras una apariencia engañosa. En el español clásico, «engaño» equivale a «ilusión» o «error»; «desengañar» es sacar a alguien de ese error. Aquí equivale a «sacó de mi equivocación».`,
      },
      {
        fragmentId: fragCartaXII.id,
        type: "glosa",
        ...anchor(carta12Text, "Pocos días ha"),
        order: 2,
        content: `Locución temporal arcaica equivalente a «hace pocos días». El verbo *haber* se usaba impersonalmente para indicar tiempo transcurrido: «días ha» = «días hace».`,
      },
      {
        fragmentId: fragCartaXII.id,
        type: "contexto",
        ...anchor(
          carta12Text,
          "el coche estaba puesto, pero que el cochero estaba ocupado",
        ),
        order: 1,
        content: `La escena escenifica el absurdo del honor hereditario: el servicio doméstico queda paralizado porque quien conduce el carruaje —una función puramente manual— posee a su vez vasallos que le rinden homenaje feudal. La jerarquía del mérito y la jerarquía del nacimiento chocan en un mismo personaje.`,
      },
      {
        fragmentId: fragCartaXII.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(carta12Text, "—Aunque soy cochero, soy noble."),
        order: 1,
        content: `**Antítesis**: La contradicción entre oficio manual («cochero») y condición social («noble») resume en seis palabras la crítica a la nobleza hereditaria. La conjunción concesiva «aunque» subraya que el propio personaje es consciente de la paradoja —y no le parece ningún problema.`,
      },
      {
        fragmentId: fragCartaXII.id,
        type: "figura",
        category: "tropo",
        ...anchor(carta12Text, "lo entenderás menos, como sucede"),
        order: 2,
        content: `**Ironía**: Gazel advierte a Ben-Beley que el ejemplo resultará aún más incomprensible que la explicación. La frase prepara al lector para percibir lo absurdo de lo que está a punto de leer —y convierte la incomprensibilidad en argumento.`,
      },
      {
        fragmentId: fragCartaXII.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Por qué el cochero retrasa la salida? ¿Quiénes son las personas que lo han visitado y qué hacen?`,
      },
      {
        fragmentId: fragCartaXII.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 2,
        content: `La carta termina con la pregunta «¿Adónde vamos?» y el gesto de montar en la mula. ¿Qué efecto produce ese regreso brusco a lo cotidiano después del discurso sobre la nobleza?`,
      },
    ],
  });

  // ── Carta XIII ──
  const carta13Text = `Instando a mi amigo cristiano a que me explicase qué es la nobleza hereditaria, después de decirme mil cosas que yo no entendí, mostrarme estampas que me parecieron de magia, y figuras que tuve por capricho de algún pintor demente, y después de reírse conmigo de muchas cosas que se decían muy respetables en el mundo, concluyó con estas voces, interrumpidas con otras tantas carcajadas de risa:

—Nobleza hereditaria es la vanidad que yo fundo en que ochocientos años antes de mi nacimiento muriese uno que se llamó como yo me llamo, y fue hombre de provecho, aunque yo sea inútil para todo.`;

  console.log("Creando Carta XIII...");
  const fragCartaXIII = await prisma.fragment.create({
    data: {
      slug: "carta-xiii-cadalso",
      title: "Carta XIII",
      location: "Cartas marruecas, Carta XIII",
      headline: "«Inútil para todo»",
      text: carta13Text,
      order: 3,
      status: "published",
      workId: cartasMarruecas.id,
      constellations: { connect: [{ id: consCritica.id }] },
      ...(topicDesengano
        ? { topics: { connect: [{ id: topicDesengano.id }] } }
        : {}),
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragCartaXIII.id,
        type: "glosa",
        ...anchor(carta13Text, "estampas que me parecieron de magia"),
        order: 1,
        content: `Los árboles genealógicos, blasones y escudos de armas con que los nobles acreditaban su linaje. A ojos de Gazel —el observador marroquí sin referente previo— esos documentos heráldicos resultan tan incomprensibles como signos mágicos.`,
      },
      {
        fragmentId: fragCartaXIII.id,
        type: "contexto",
        ...anchor(carta13Text, "Nobleza hereditaria es la vanidad"),
        order: 1,
        content: `La definición que ofrece «mi amigo cristiano» (Nuño Núñez, el español ilustrado de las *Cartas marruecas*) concentra la crítica ilustrada en pocas palabras: la nobleza no es mérito propio, sino vanidad fundada en la identidad de un antepasado lejano. La risa que acompaña a la definición actúa como argumento: lo que merece carcajadas no merece respeto.`,
      },
      {
        fragmentId: fragCartaXIII.id,
        type: "figura",
        category: "tropo",
        ...anchor(carta13Text, "interrumpidas con otras tantas carcajadas de risa"),
        order: 1,
        content: `**Ironía dramática**: la institución más solemnemente respetada del Antiguo Régimen —la nobleza hereditaria— se define entre carcajadas. Cadalso convierte la risa en el argumento más contundente: lo ridículo no necesita refutación.`,
      },
      {
        fragmentId: fragCartaXIII.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(
          carta13Text,
          "fue hombre de provecho, aunque yo sea inútil para todo",
        ),
        order: 2,
        content: `**Antítesis**: La contraposición entre «fue hombre de provecho» (el antepasado) y «aunque yo sea inútil para todo» (el noble actual) expone el absurdo del mérito hereditario. La concesiva «aunque» no atenúa la paradoja, sino que la subraya.`,
      },
      {
        fragmentId: fragCartaXIII.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Qué hace Nuño antes de dar la definición de «nobleza hereditaria»? ¿Por qué crees que Cadalso incluye esos detalles previos?`,
      },
      {
        fragmentId: fragCartaXIII.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 2,
        content: `La definición está formulada en primera persona: «la vanidad que *yo* fundo en que… aunque *yo* sea inútil para todo». ¿Por qué crees que Cadalso elige esa forma gramatical en lugar de una definición impersonal («la vanidad de quien funda su orgullo en…»)?`,
      },
    ],
  });

  console.log("✓ Cartas XII y XIII de Cadalso añadidas.");

  // ──────────────────────────────────────────────────────────────
  // 2. FEIJOO
  // ──────────────────────────────────────────────────────────────
  console.log("Creando autor Feijoo...");
  const feijoo = await prisma.author.create({
    data: {
      slug: "benito-jeronimo-feijoo",
      name: "Benito Jerónimo Feijoo",
      birthYear: 1676,
      deathYear: 1764,
      country: "España",
      era: "Ilustración",
      bio: `Benito Jerónimo Feijoo y Montenegro (Casdemiro, Orense, 1676 - Oviedo, 1764). Fraile benedictino y catedrático en la Universidad de Oviedo, fue el gran divulgador de la ciencia y el pensamiento europeo en la España del siglo XVIII. Su *Teatro crítico universal* (1726-1740), en ocho volúmenes, y sus *Cartas eruditas y curiosas* (1742-1760), en cinco, combatieron la superstición, la escolástica y el atraso científico, propugnando la observación empírica y el método experimental. El Consejo de Castilla tuvo que protegerlo de los ataques de los teólogos más conservadores. Fue el primer gran ensayista de la Ilustración española.`,
      portraitUrl: null,
    },
  });

  const cartasEruditas = await prisma.work.create({
    data: {
      slug: "cartas-eruditas-y-curiosas",
      title: "Cartas eruditas y curiosas",
      year: 1742,
      era: "Ilustración",
      genre: "Ensayo epistolar",
      synopsis: `Colección de cinco volúmenes (1742-1760) en los que Feijoo responde, en forma de carta, a cuestiones científicas, filosóficas y literarias de sus contemporáneos. Complementa el *Teatro crítico universal* con un tono más coloquial y una gama temática que va desde la física hasta la crítica de las supersticiones populares.`,
      authorId: feijoo.id,
    },
  });

  const teatroCritico = await prisma.work.create({
    data: {
      slug: "teatro-critico-universal",
      title: "Teatro crítico universal",
      year: 1726,
      era: "Ilustración",
      genre: "Ensayo",
      synopsis: `Colección de ocho volúmenes (1726-1740) en los que Feijoo combate errores comunes, supersticiones y el atraso científico de la España de su época. El título —*Teatro crítico*— alude al teatro como espejo del mundo: Feijoo quiere mostrar, y desmontar, los errores más extendidos de su tiempo.`,
      authorId: feijoo.id,
    },
  });

  // ── Feijoo: atraso científico (Cartas eruditas) ──
  const feijooAtrasoText = `No es una sola, señor mío, la causa de los cortísimos progresos de los Españoles en las Facultades expresadas, sino muchas; y tales, que aunque cada una por sí sola haría poco daño, el complejo de todas forma un obstáculo casi absolutamente invencible.

La primera es el corto alcance de algunos de nuestros Profesores. Hay una especie de ignorantes perdurables, precisados a saber siempre poco, no por otra razón, sino porque piensan que no hay más que saber que aquello poco que saben.

La segunda causa es la preocupación que reina en España contra toda novedad. Dicen muchos que basta en las doctrinas el título de nuevas para reprobarlas, porque las novedades en punto de doctrina son sospechosas; esto es confundir a Poncio de Aguirre con Poncio Pilatos. Las doctrinas nuevas en las Ciencias Sagradas son sospechosas, y todos los que con juicio han reprobado las novedades doctrinales, de estas han hablado. Pero extender esta ojeriza a cuanto parece nuevo en aquellas Facultades que no salen del recinto de la Naturaleza, es prestar, con un despropósito, patrocinio a la obstinada ignorancia.`;

  console.log("Creando fragmento Feijoo - Atraso científico...");
  const fragFeijooAtraso = await prisma.fragment.create({
    data: {
      slug: "feijoo-atraso-cientifico",
      title: "Causas del atraso científico en España",
      location: "Cartas eruditas y curiosas, tomo II, carta XVI",
      headline: "«Patrocinio a la obstinada ignorancia»",
      text: feijooAtrasoText,
      order: 1,
      status: "published",
      workId: cartasEruditas.id,
      constellations: { connect: [{ id: consCritica.id }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragFeijooAtraso.id,
        type: "glosa",
        ...anchor(feijooAtrasoText, "Profesores"),
        order: 1,
        content: `En el español del XVIII, «Profesores» no designa docentes universitarios, sino quienes *profesan* o practican una disciplina (Profesores de Medicina, de Filosofía, de Matemáticas). Equivale a «cultivadores» o «practicantes» de esas materias.`,
      },
      {
        fragmentId: fragFeijooAtraso.id,
        type: "glosa",
        ...anchor(
          feijooAtrasoText,
          "Poncio de Aguirre con Poncio Pilatos",
        ),
        order: 2,
        content: `Ejemplo proverbial de confusión por homonimia: condenar a alguien inocente solo porque comparte nombre con el culpable. Feijoo usa la imagen para ridiculizar a quienes rechazan el conocimiento nuevo solo por llamarse «novedad», sin distinguir entre novedades teológicas (potencialmente heréticas) y científicas (que son simplemente descubrimientos).`,
      },
      {
        fragmentId: fragFeijooAtraso.id,
        type: "contexto",
        ...anchor(
          feijooAtrasoText,
          "el complejo de todas forma un obstáculo casi absolutamente invencible",
        ),
        order: 1,
        content: `El texto pertenece a la carta XVI del tomo II de las *Cartas eruditas*, titulada «Causas del atraso que se padece en España en orden a las Ciencias Naturales». Feijoo enumera varios obstáculos; aquí expone los dos primeros: la limitación intelectual de algunos profesores y el prejuicio colectivo contra toda novedad. A estos añadirá más adelante la falta de mecenazgo y la ausencia de academias científicas.`,
      },
      {
        fragmentId: fragFeijooAtraso.id,
        type: "figura",
        category: "tropo",
        ...anchor(feijooAtrasoText, "patrocinio a la obstinada ignorancia"),
        order: 1,
        content: `**Paradoja**: el «patrocinio» (apoyo, protección) se aplica normalmente a algo que se quiere promover. Aquí se convierte en protección de la ignorancia misma: quienes rechazan la novedad científica creyendo defender la fe, no hacen más que amparar el atraso.`,
      },
      {
        fragmentId: fragFeijooAtraso.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(
          feijooAtrasoText,
          "precisados a saber siempre poco, no por otra razón, sino porque piensan que no hay más que saber que aquello poco que saben",
        ),
        order: 2,
        content: `**Ironía filosófica**: la ignorancia se perpetúa porque no reconoce sus propios límites. La estructura circular de la frase (saben poco → creen que no hay más → saben poco) imita formalmente el bucle cerrado del pensamiento dogmático.`,
      },
      {
        fragmentId: fragFeijooAtraso.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Cuáles son las dos causas del atraso científico que expone Feijoo en este texto? Explícalas con tus propias palabras.`,
      },
      {
        fragmentId: fragFeijooAtraso.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 2,
        content: `Feijoo distingue entre novedades en «Ciencias Sagradas» y en «Facultades que no salen del recinto de la Naturaleza». ¿Qué argumento desarrolla con esa distinción? ¿Crees que era una distinción fácil de sostener en la España del XVIII?`,
      },
    ],
  });

  // ── Feijoo: dictados (Teatro crítico) ──
  const feijooDictadosText = `Duélome del tiempo que se pierde en la lectura de las materias, tanto filosóficas como teológicas; y aún más en las de las segundas que de las primeras. Culpo los accidentes, no la substancia; no la entidad, sino el modo. No digo que se pierde todo el tiempo que se emplea en la lectura, sino buena parte de él.

Fuera del gran daño que en la lectura de las Aulas ocasiona la prolijidad de los Maestros, resta otro, no sé si mayor, por el uso que obligan a hacer de ella a los Discípulos, precisándolos a mandarla a la memoria, y dar cuenta de ella palabra por palabra, y letra por letra, como va escrito. ¡Qué dispendio de tiempo tan lamentable!`;

  console.log("Creando fragmento Feijoo - Dictados...");
  const fragFeijooDictados = await prisma.fragment.create({
    data: {
      slug: "feijoo-dictados-aulas",
      title: "Dictado de las Aulas",
      location: "Teatro crítico universal, tomo VIII, discurso III",
      headline: "«¡Qué dispendio de tiempo tan lamentable!»",
      text: feijooDictadosText,
      order: 1,
      status: "published",
      workId: teatroCritico.id,
      constellations: { connect: [{ id: consCritica.id }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragFeijooDictados.id,
        type: "glosa",
        ...anchor(feijooDictadosText, "mandarla a la memoria"),
        order: 1,
        content: `Expresión del XVIII equivalente a «memorizar», «aprender de memoria». El verbo *mandar* («enviar, dirigir») combinado con *la memoria* como destino: literalmente «enviarla allí para que quede almacenada».`,
      },
      {
        fragmentId: fragFeijooDictados.id,
        type: "glosa",
        ...anchor(feijooDictadosText, "Aulas"),
        order: 2,
        content: `En el contexto universitario del XVIII, «las Aulas» designa tanto el espacio físico de las clases como el método que en ellas se practica: la clase magistral en que el profesor dicta y los alumnos copian. Feijoo usa el término para criticar un sistema completo, no solo un espacio.`,
      },
      {
        fragmentId: fragFeijooDictados.id,
        type: "contexto",
        ...anchor(
          feijooDictadosText,
          "precisándolos a mandarla a la memoria, y dar cuenta de ella palabra por palabra",
        ),
        order: 1,
        content: `El sistema de *dictados* era el método dominante en las universidades españolas del XVIII: el profesor dictaba sus apuntes en voz alta y los alumnos los copiaban literalmente para memorizarlos del mismo modo. Feijoo critica que este sistema no solo malgasta el tiempo, sino que fomenta la pasividad intelectual e impide la comprensión y el análisis.`,
      },
      {
        fragmentId: fragFeijooDictados.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(
          feijooDictadosText,
          "Culpo los accidentes, no la substancia; no la entidad, sino el modo.",
        ),
        order: 1,
        content: `**Paralelismo quiástico**: la estructura «A, no B; no A', sino B'» establece con precisión filosófica la distinción entre forma y fondo. Feijoo usa la terminología escolástica (*substancia/accidente*, *entidad/modo*) para criticar el escolasticismo desde dentro de su propio vocabulario.`,
      },
      {
        fragmentId: fragFeijooDictados.id,
        type: "figura",
        category: "tropo",
        ...anchor(
          feijooDictadosText,
          "¡Qué dispendio de tiempo tan lamentable!",
        ),
        order: 2,
        content: `**Exclamación retórica**: Feijoo abandona el tono analítico para expresar indignación moral. El término «dispendio» —derroche— aplica al tiempo la lógica del gasto económico: memorizar sin comprender es tan absurdo como tirar el dinero.`,
      },
      {
        fragmentId: fragFeijooDictados.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Cuál es el segundo daño del método de los dictados que señala Feijoo —más allá de la «prolijidad de los Maestros»?`,
      },
      {
        fragmentId: fragFeijooDictados.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 2,
        content: `Feijoo dice «culpo los accidentes, no la substancia». ¿Qué defiende con eso? ¿Qué distingue entre la *lectura* como actividad y el *uso* que se hace de ella?`,
      },
    ],
  });

  console.log("✓ Feijoo añadido (2 obras, 2 fragmentos).");

  // ──────────────────────────────────────────────────────────────
  // 3. LEÓN DE ARROYAL
  // ──────────────────────────────────────────────────────────────
  console.log("Creando autor León de Arroyal...");
  const arroyal = await prisma.author.create({
    data: {
      slug: "leon-de-arroyal",
      name: "León de Arroyal",
      birthYear: 1755,
      deathYear: 1813,
      country: "España",
      era: "Ilustración",
      bio: `León de Arroyal (Segovia, 1755 - Madrid, c. 1813). Funcionario de Hacienda y economista ilustrado, es autor de las *Cartas político-económicas al Conde de Lerena* —redactadas entre 1787 y 1795 y publicadas solo parcialmente en vida del autor—, en las que propone reformas radicales del sistema tributario y político español. Su lenguaje directo y su disposición a cuestionar los fundamentos del Antiguo Régimen lo distinguen de los reformistas más prudentes de su época.`,
      portraitUrl: null,
    },
  });

  const cartasPoliticas = await prisma.work.create({
    data: {
      slug: "cartas-politico-economicas",
      title: "Cartas político-económicas al Conde de Lerena",
      year: 1787,
      era: "Ilustración",
      genre: "Ensayo epistolar",
      synopsis: `Conjunto de cartas redactadas entre 1787 y 1795 y dirigidas al ministro de Hacienda de Carlos IV, en las que Arroyal analiza con radicalismo inusual los problemas estructurales de la monarquía española y propone reformas de fondo —no simples remiendos— de su sistema político y fiscal.`,
      authorId: arroyal.id,
    },
  });

  const arroyalText = `Yo comparo nuestra monarquía a una casa vieja sostenida a fuerza de remiendos, que los mismos materiales que se pretende componer un lado derriban el otro, y sólo se puede enmendar echándola a tierra y reedificándola de nuevo, lo cual en la nuestra es moralmente imposible, pues como un día me dijo el señor conde de Floridablanca: «Para hacer cada cosa buena, es necesario deshacer cuatrocientas malas.»`;

  console.log("Creando fragmento Arroyal...");
  const fragArroyal = await prisma.fragment.create({
    data: {
      slug: "arroyal-casa-vieja",
      title: "La casa vieja",
      location: "Cartas político-económicas al Conde de Lerena",
      headline: "«Deshacer cuatrocientas malas»",
      text: arroyalText,
      order: 1,
      status: "published",
      workId: cartasPoliticas.id,
      constellations: {
        connect: [{ id: consCritica.id }, { id: consPoder.id }],
      },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragArroyal.id,
        type: "glosa",
        ...anchor(arroyalText, "remiendos"),
        order: 1,
        content: `Piezas de tela que se cosen sobre una prenda deteriorada para tapar un agujero; aquí, en sentido figurado, las reformas parciales y superficiales que no atacan la causa de fondo del problema.`,
      },
      {
        fragmentId: fragArroyal.id,
        type: "contexto",
        ...anchor(arroyalText, "el señor conde de Floridablanca"),
        order: 1,
        content: `José Moñino, conde de Floridablanca (1728-1808), fue el ministro más poderoso del reinado de Carlos III y de los primeros años del de Carlos IV. Que el propio Floridablanca —el gran reformista ilustrado— reconozca la imposibilidad de hacer bien sin deshacer cuatrocientas cosas mal hechas, convierte su frase en un testimonio de la parálisis del reformismo desde dentro del sistema.`,
      },
      {
        fragmentId: fragArroyal.id,
        type: "figura",
        category: "tropo",
        ...anchor(
          arroyalText,
          "una casa vieja sostenida a fuerza de remiendos, que los mismos materiales que se pretende componer un lado derriban el otro",
        ),
        order: 1,
        content: `**Metáfora arquitectónica**: la monarquía española es una ruina que las propias reformas parciales no hacen sino agravar. Cada mejora en un punto produce nuevos desperfectos en otro. La imagen tiene antecedentes en el pensamiento político europeo (Montesquieu) sobre los regímenes que han sobrevivido a sí mismos.`,
      },
      {
        fragmentId: fragArroyal.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(
          arroyalText,
          "«Para hacer cada cosa buena, es necesario deshacer cuatrocientas malas.»",
        ),
        order: 2,
        content: `**Máxima (sentencia)**: la frase de Floridablanca condensa en una paradoja el agotamiento del reformismo ilustrado. El número «cuatrocientas» no es exacto sino retórico: la desproporción entre lo que se quiere hacer y lo que hay que deshacer previamente es, en la práctica, infinita.`,
      },
      {
        fragmentId: fragArroyal.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Qué metáfora usa Arroyal para describir la monarquía española? ¿Qué sería necesario hacer, según él, y por qué lo considera imposible?`,
      },
      {
        fragmentId: fragArroyal.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 2,
        content: `Arroyal cita a Floridablanca —el propio ministro reformista— como testigo del problema. ¿Qué revela ese gesto sobre las contradicciones del reformismo ilustrado «desde dentro» del sistema?`,
      },
      {
        fragmentId: fragArroyal.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 3,
        content: `¿Crees que el diagnóstico de Arroyal —que las reformas parciales empeoran el problema— sigue siendo un argumento válido en los debates políticos actuales? ¿Qué ejemplos se te ocurren?`,
      },
    ],
  });

  console.log("✓ León de Arroyal añadido (1 obra, 1 fragmento).");

  // ──────────────────────────────────────────────────────────────
  // 4. JOVELLANOS
  // ──────────────────────────────────────────────────────────────
  console.log("Creando autor Jovellanos...");
  const jovellanos = await prisma.author.create({
    data: {
      slug: "gaspar-melchor-de-jovellanos",
      name: "Gaspar Melchor de Jovellanos",
      birthYear: 1744,
      deathYear: 1811,
      country: "España",
      era: "Ilustración",
      bio: `Gaspar Melchor de Jovellanos (Gijón, 1744 - Puerto de Vega, Asturias, 1811). Jurista, estadista y escritor, es la figura más representativa de la Ilustración española tardía. Ministro de Gracia y Justicia bajo Carlos IV, fue encarcelado en el castillo de Bellver (Mallorca) por orden de Godoy entre 1801 y 1808. Su *Informe en el Expediente de Ley Agraria* (1794) es el texto más influyente del pensamiento económico ilustrado en España; su *Memoria sobre Educación Pública* (1802) defiende la instrucción pública como fundamento de toda prosperidad. Escribió también teatro, poesía —las *Epístolas* son un ejemplo señero— y una extensa correspondencia.`,
      portraitUrl: null,
    },
  });

  const memoriaEducacion = await prisma.work.create({
    data: {
      slug: "memoria-sobre-educacion-publica",
      title: "Memoria sobre Educación Pública",
      year: 1802,
      era: "Ilustración",
      genre: "Ensayo",
      synopsis: `Texto leído en 1802 ante el Real Instituto Asturiano, fundado por el propio Jovellanos, en el que defiende que la instrucción pública es la fuente primera de toda prosperidad social. Combina el rigor del pensamiento ilustrado con la convicción de que el Estado tiene la obligación de garantizar el acceso a la educación.`,
      authorId: jovellanos.id,
    },
  });

  const informeLeyAgraria = await prisma.work.create({
    data: {
      slug: "informe-ley-agraria",
      title: "Informe en el Expediente de Ley Agraria",
      year: 1794,
      era: "Ilustración",
      genre: "Ensayo jurídico-económico",
      synopsis: `Redactado en 1794 por encargo de la Real Sociedad Económica Matritense y presentado al Consejo de Castilla, es el más importante texto del pensamiento económico ilustrado español. Jovellanos analiza los «estorbos físicos», «morales» y «políticos» que impiden el progreso de la agricultura española y propone liberar la tierra de las trabas señoriales, eclesiásticas y municipales.`,
      authorId: jovellanos.id,
    },
  });

  // ── Jovellanos: educación ──
  const jovellanosEducText = `¿Es la instrucción pública el primer origen de la prosperidad social? Sin duda. Ésta es una verdad no bien reconocida todavía, o por lo menos no bien apreciada; pero es una verdad. La razón y la experiencia hablan en su apoyo.

Las fuentes de la prosperidad social son muchas; pero todas nacen de un mismo origen, y este origen es la instrucción pública. Ella es la que las descubrió, y a ellas todas están subordinadas. La instrucción remueve los obstáculos que pueden obstruir o extraviar sus aguas. Ella es la matriz, el primer manantial que abastece estas fuentes. Abrir todos sus senos, aumentarle, conservarle es el primer objeto de la solicitud de un buen gobierno, es el mejor camino para llegar a la prosperidad. Con la instrucción todo se mejora y florece; sin ella, todo decae y se arruina un Estado.`;

  console.log("Creando fragmento Jovellanos - Educación...");
  const fragJovellanosEduc = await prisma.fragment.create({
    data: {
      slug: "jovellanos-instruccion-publica",
      title: "La instrucción pública y la prosperidad",
      location: "Memoria sobre Educación Pública",
      headline: "«Con la instrucción todo se mejora y florece»",
      text: jovellanosEducText,
      order: 1,
      status: "published",
      workId: memoriaEducacion.id,
      constellations: { connect: [{ id: consCritica.id }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragJovellanosEduc.id,
        type: "contexto",
        ...anchor(
          jovellanosEducText,
          "¿Es la instrucción pública el primer origen de la prosperidad social?",
        ),
        order: 1,
        content: `La pregunta retórica inicial sitúa a Jovellanos en el debate ilustrado europeo sobre educación y riqueza. Su posición es más radical que la de sus contemporáneos: no dice que la instrucción sea *uno* de los factores de prosperidad, sino el *primero* y más fundamental. La triple afirmación «es una verdad / es una verdad / es una verdad» es un recurso retórico clásico del ensayo ilustrado para anticipar la resistencia del lector.`,
      },
      {
        fragmentId: fragJovellanosEduc.id,
        type: "figura",
        category: "tropo",
        ...anchor(
          jovellanosEducText,
          "La instrucción remueve los obstáculos que pueden obstruir o extraviar sus aguas. Ella es la matriz, el primer manantial que abastece estas fuentes.",
        ),
        order: 1,
        content: `**Metáfora hidráulica**: Jovellanos convierte la instrucción en un manantial que alimenta las fuentes de la prosperidad. La imagen hace visual un argumento abstracto: la educación no es solo un bien más, sino el origen que hace posibles todos los demás.`,
      },
      {
        fragmentId: fragJovellanosEduc.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(
          jovellanosEducText,
          "Ella es la que las descubrió, y a ellas todas están subordinadas",
        ),
        order: 2,
        content: `**Anáfora**: la repetición de «Ella» convierte a la instrucción pública en sujeto activo de todos los verbos —descubrió, remueve, abastece—, dotándola de casi una voluntad propia.`,
      },
      {
        fragmentId: fragJovellanosEduc.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(
          jovellanosEducText,
          "Con la instrucción todo se mejora y florece; sin ella, todo decae y se arruina un Estado.",
        ),
        order: 3,
        content: `**Antítesis**: la oposición entre «mejora y florece» y «decae y se arruina» estructura la conclusión como una ley natural. La simetría formal —igual número de verbos, mismo sujeto tácito— refuerza la inevitabilidad del argumento.`,
      },
      {
        fragmentId: fragJovellanosEduc.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Qué metáfora usa Jovellanos para explicar la relación entre instrucción pública y prosperidad social?`,
      },
      {
        fragmentId: fragJovellanosEduc.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 2,
        content: `Jovellanos afirma que la instrucción es «el primer origen» de la prosperidad. ¿Qué implicaciones tiene esa afirmación para el papel del Estado? ¿Qué obligaciones le impone?`,
      },
    ],
  });

  // ── Jovellanos: ríos (Ley Agraria) ──
  const jovellanosRiosText = `¿Y qué sería si el Duero multiplicase y extendiese los ramos de esta comunicación por los vastos territorios que baña? ¿Qué si ayudado del Eresma venciese los montes en busca del Lozoya y del Guadarrama, y unido al Tajo por medio del Jarama y Manzanares llevase, como en otro tiempo, nuestros frutos hasta el mar de Lisboa? ¿Qué sería si el Guadarrama, unido al Tajo, después de dar otro puerto a la Mancha y Extremadura en el mar de Occidente, subiese por el Mediodía hasta los orígenes del Guadalquivir y fuese a encontrar en Córdoba las naves que podían, como otras veces, subir allí desde Sevilla? ¿Qué si el Ebro, tocando por una parte en los Alfaques y por otra en Laredo, comunicase al Levante las producciones del Norte y uniese nuestro Océano Cantábrico con el Mediterráneo? ¿Qué, en fin, si los caminos, los canales y la navegación de los ríos interiores, franqueando todas las arterias de esta inmensa circulación, llenasen de abundancia y prosperidad tantas y tan fértiles provincias?`;

  console.log("Creando fragmento Jovellanos - Ríos...");
  const fragJovellanosRios = await prisma.fragment.create({
    data: {
      slug: "jovellanos-rios-circulacion",
      title: "Las arterias de la nación",
      location:
        "Informe en el Expediente de Ley Agraria, «Falta de comunicaciones»",
      headline: "«Las arterias de esta inmensa circulación»",
      text: jovellanosRiosText,
      order: 1,
      status: "published",
      workId: informeLeyAgraria.id,
      constellations: { connect: [{ id: consCritica.id }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragJovellanosRios.id,
        type: "glosa",
        ...anchor(jovellanosRiosText, "los Alfaques"),
        order: 1,
        content: `Puerto natural situado en la desembocadura del Ebro, en el delta tarraconense (actual bahía de los Alfaques, Tarragona). Era el punto de salida al Mediterráneo de los productos del interior de Aragón.`,
      },
      {
        fragmentId: fragJovellanosRios.id,
        type: "contexto",
        ...anchor(
          jovellanosRiosText,
          "unido al Tajo por medio del Jarama y Manzanares llevase, como en otro tiempo, nuestros frutos hasta el mar de Lisboa",
        ),
        order: 1,
        content: `El sueño de unir mediante canales los grandes ríos peninsulares era un proyecto real discutido a lo largo del siglo XVIII. La «acequia imperial» de Aragón y el Canal de Castilla (iniciado en 1753) son los antecedentes concretos de esta visión. El «otro tiempo» en que los frutos llegaban a Lisboa por el Tajo es una referencia poética más que histórica exacta.`,
      },
      {
        fragmentId: fragJovellanosRios.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(
          jovellanosRiosText,
          "¿Y qué sería si el Duero multiplicase",
        ),
        order: 1,
        content: `**Anáfora y polisíndeton**: la serie de preguntas hipotéticas construidas con la misma estructura («¿Qué sería si…? ¿Qué si…?») crea un crescendo retórico y visionario. Los ríos dejan de ser accidentes geográficos y se convierten en instrumentos de una España próspera y unida.`,
      },
      {
        fragmentId: fragJovellanosRios.id,
        type: "figura",
        category: "tropo",
        ...anchor(
          jovellanosRiosText,
          "franqueando todas las arterias de esta inmensa circulación",
        ),
        order: 2,
        content: `**Metáfora anatómica**: las rutas comerciales son las «arterias» del «cuerpo» de la nación. La imagen proviene de la fisiología ilustrada: desde el descubrimiento de la circulación sanguínea por Harvey (1628), la medicina se había convertido en metáfora política habitual. El cuerpo social tiene sus órganos, sus arterias, sus obstrucciones.`,
      },
      {
        fragmentId: fragJovellanosRios.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Qué ríos menciona Jovellanos y qué función les asigna en su visión de una España próspera?`,
      },
      {
        fragmentId: fragJovellanosRios.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 2,
        content: `Las preguntas de Jovellanos empiezan nombrando ríos concretos (Duero, Ebro, Tajo) y terminan con una abstracción («las arterias de esta inmensa circulación»). ¿Qué efecto produce ese paso de lo concreto a lo abstracto?`,
      },
    ],
  });

  console.log("✓ Jovellanos añadido (2 obras, 2 fragmentos).");
  console.log(
    "\n✅ Ensayo ilustrado del siglo XVIII añadido correctamente.\n" +
      "   Autores nuevos: Feijoo, León de Arroyal, Jovellanos\n" +
      "   Fragmentos Cadalso: Carta XII, Carta XIII\n" +
      "   Fragmentos Feijoo: Atraso científico, Dictados\n" +
      "   Fragmentos Arroyal: La casa vieja\n" +
      "   Fragmentos Jovellanos: Instrucción pública, Las arterias\n",
  );
}

main().catch(console.error).finally(() => prisma.$disconnect());
