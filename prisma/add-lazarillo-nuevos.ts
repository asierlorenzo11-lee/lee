/**
 * Añade dos fragmentos del Lazarillo de Tormes (Tratado I):
 *  1. El toro de Salamanca — pérdida de la inocencia
 *  2. El jarro de vino — el engaño de la paja y la venganza del ciego
 *
 * Script aditivo: no borra nada, solo inserta.
 * Fuente anotaciones: "Algunos comentarios guiados de 'Lazarillo de Tormes'" (PDF).
 */

import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

function anchor(
  text: string,
  needle: string,
): { anchorStart: number | null; anchorEnd: number | null } {
  const anchorStart = text.indexOf(needle);
  if (anchorStart === -1) {
    console.warn(`  ⚠ ancla no encontrada: «${needle.substring(0, 50)}»`);
    return { anchorStart: null, anchorEnd: null };
  }
  return { anchorStart, anchorEnd: anchorStart + needle.length };
}

// ─── TEXTOS ──────────────────────────────────────────────────────────────────

const toroText = `Y así me fui para mi amo, que esperándome estaba. Salimos de Salamanca, y llegando a la puente, está a la entrada della un animal de piedra, que casi tiene forma de toro, y el ciego mandome que llegase cerca del animal, y allí puesto, me dijo: «Lázaro, llega el oído a este toro, y oirás gran ruido dentro dél.» Yo, simplemente llegué, creyendo ser ansí; y como sintió que tenía la cabeza par de la piedra, afirmó recio la mano y diome una gran calabazada en el diablo del toro, que más de tres días me duró el dolor de la cornada, y díjome: «Necio, aprende que el mozo del ciego un punto ha de saber más que el diablo», y rio mucho la burla. Paresciome que en aquel instante desperté de la simpleza en que, como niño, dormido estaba. Dije entre mí: «Verdad dice este, que me cumple avivar el ojo y avisar, pues solo soy, y pensar cómo me sepa valer.»
Comenzamos nuestro camino y, en muy pocos días, me mostró jerigonza, y como me viese de buen ingenio, holgábase mucho, y decía: «Yo oro ni plata no te lo puedo dar; mas avisos para vivir muchos te mostraré.» Y fue ansí, que, después de Dios, este me dio la vida y, siendo ciego, me alumbró y adestró en la carrera de vivir.`;

const jarroText = `Usaba el ciego poner cabe sí un jarrillo de vino, comíamos, y yo, muy de presto, le asía y daba un par de besos callados, y tornábale a su lugar. Mas duróme poco, que en los tragos conocía la falta, y por reservar su vino a salvo, nunca desamparaba el jarro, antes lo tenía por el asa asido, mas no había piedra imán que así atrajese a sí como yo con una paja larga de centeno que para aquel menester tenía hecha, la cual, metiéndola en la boca del jarro, chupando el vino, lo dejaba a buenas noches. Mas como fuese el traidor tan astuto, pienso que me sintió, y dende en adelante mudó propósito, y asentaba su jarro entre las piernas, y tapábale con la mano, y así bebía seguro. Yo, que estaba hecho al vino, moría por él, y viendo que aquel remedio de la paja no me aprovechaba ni valía, acordé en el suelo del jarro hacerle una fuentecilla y agujero sutil, y delicadamente, con una muy delgada tortilla de cera, taparlo. Y, al tiempo de comer, fingiendo haber frío, entrábame entre las piernas del triste ciego a calentarme en la pobrecilla lumbre que teníamos, y, al calor de ella, luego derretida la cera, por ser muy poca, comenzaba la fuentecilla a destilarme en la boca, la cual yo de tal manera ponía, que maldita la gota se perdía. Cuando el pobreto iba a beber, no hallaba nada. Espantábase, maldecíase, daba al diablo el jarro y el vino, no sabiendo qué podía ser.
—No diréis, tío, que os lo bebo yo —decía—, pues no le quitáis de la mano.
Tantas vueltas y tientos dio al jarro, que halló la fuente y cayó en la burla; mas así lo disimuló como si no lo hubiese sentido. Y luego otro día, teniendo yo rezumando mi jarro como solía, no pensando el daño que me estaba aparejado ni que el mal ciego me sentía, sentéme como solía. Estando recibiendo aquellos dulces tragos, mi cara puesta hacia el cielo, un poco cerrados los ojos por mejor gustar el sabroso licor, sintió el desesperado ciego que ahora tenía tiempo de tomar de mí venganza, y, con todas sus fuerzas, alzando con dos manos aquel dulce y amargo jarro, lo dejó caer sobre mi boca, ayudándose, como digo, con todo su poder, de manera que el pobre Lázaro, que de nada de esto se guardaba, antes, como a otras veces, estaba descuidado y gozoso, verdaderamente me pareció que el cielo, con todo lo que en él hay, me había caído encima.
Fue tal el golpecillo, que me desatinó y sacó de sentido, y el jarrazo tan grande, que los pedazos de él me metieron por la cara, rompiédomela por muchas partes, y me quebrólos dientes, sin los cuales hasta hoy día me quedé. Desde aquella hora quise mal al mal ciego, y aunque me quería y regalaba y me curaba, bien vi que se había holgado del cruel castigo. Lavóme con vino las roturas que con los pedazos del jarro me había hecho, y sonriéndose decía:
—¿Qué te parece, Lázaro? Lo que te enfermó te sana y da salud.`;

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  const lazarillo = await prisma.work.findUniqueOrThrow({
    where: { slug: "lazarillo-de-tormes" },
  });

  // ── FRAGMENTO 1: El toro de Salamanca ─────────────────────────────────────
  const existsToro = await prisma.fragment.findFirst({ where: { slug: "el-toro-de-salamanca" } });
  if (existsToro) { console.log("  skip el-toro-de-salamanca"); }
  else { console.log("Creando «El toro de Salamanca»..."); }

  const fragToro = existsToro ?? await prisma.fragment.create({
    data: {
      slug: "el-toro-de-salamanca",
      title: "El toro de Salamanca",
      location: "Lazarillo de Tormes, Tratado primero",
      headline: "Siendo ciego, me alumbró y adestró en la carrera de vivir",
      text: toroText,
      order: 2,
      status: "published",
      featured: false,
      workId: lazarillo.id,
      constellations: { connect: [{ slug: "critica-social" }] },
      topics: { connect: [{ slug: "desengano" }] },
      characters: { connect: [{ slug: "lazaro-de-tormes" }] },
      places: { connect: [{ slug: "salamanca" }] },
      artworkImageUrl: "/images/artworks/murillo-ninos-dados.jpg",
      artworkTitle: "Niños jugando a los dados",
      artworkAuthor: "Bartolomé Esteban Murillo, h. 1665-1675",
      artworkCaption:
        "Murillo retrató incontables veces a los niños pobres de Sevilla: sin vergüenza, sin patetismo. Aquí juegan a los dados con la concentración de quien necesita ganar. Son el mismo mundo que Lázaro: la calle como aula, el ingenio como única herramienta.",
    },
  });

  if (!existsToro) {
  console.log("Creando anotaciones de «El toro de Salamanca»...");

  await prisma.annotation.createMany({
    data: [
      // ── Glosas ────────────────────────────────────────────────────────────
      {
        fragmentId: fragToro.id,
        type: "glosa",
        ...anchor(toroText, "della"),
        order: 1,
        content: `«Della» y «dél»: contracciones de «de ella» y «de él» respectivamente, habituales en el español del siglo XVI. Hoy se consideran arcaísmos, pero en el Renacimiento eran la forma normal de la lengua hablada.`,
      },
      {
        fragmentId: fragToro.id,
        type: "glosa",
        ...anchor(toroText, "simplemente llegué"),
        order: 2,
        content: `«Simplemente» no significa aquí 'de manera sencilla' sino 'con simpleza o necedad', es decir, con ingenuidad. Lázaro era entonces un niño candoroso que aún no sabía leer las intenciones de los demás.`,
      },
      {
        fragmentId: fragToro.id,
        type: "glosa",
        ...anchor(toroText, "par de la piedra"),
        order: 3,
        content: `«Par de»: junto a, al lado de. El ciego espera a que Lázaro tenga la cabeza bien pegada al toro de piedra para darle el golpe con toda la fuerza.`,
      },
      {
        fragmentId: fragToro.id,
        type: "glosa",
        ...anchor(toroText, "calabazada"),
        order: 4,
        content: `«Calabazada»: golpe en la cabeza, como si la cabeza fuese una calabaza. El término tiene un tono humorístico cruel; la violencia está narrada con la misma distancia cómica con que el ciego la ejecuta.`,
      },
      {
        fragmentId: fragToro.id,
        type: "glosa",
        ...anchor(toroText, "avisar, pues solo soy"),
        order: 5,
        content: `«Avisar»: espabilar, estar alerta. No tiene aquí el sentido moderno de 'comunicar algo', sino el de 'agudizar los sentidos y la cautela'. Es la primera lección de Lázaro: en un mundo hostil, hay que «avivar el ojo».`,
      },
      {
        fragmentId: fragToro.id,
        type: "glosa",
        ...anchor(toroText, "jerigonza"),
        order: 6,
        content: `«Jerigonza»: jerga propia de los ciegos de la época, el lenguaje secreto con que se comunicaban entre ellos y engañaban a quienes pedían limosna. El ciego enseña a Lázaro el «idioma» de la supervivencia.`,
      },
      {
        fragmentId: fragToro.id,
        type: "glosa",
        ...anchor(toroText, "holgábase mucho"),
        order: 7,
        content: `«Holgarse»: alegrarse, complacerse. El ciego se alegra de que Lázaro sea listo, porque un mozo inteligente le es más útil. La «educación» que ofrece es, en realidad, un adiestramiento para servir mejor a sus propios intereses.`,
      },
      {
        fragmentId: fragToro.id,
        type: "glosa",
        ...anchor(toroText, "avisos para vivir"),
        order: 8,
        content: `«Avisos»: consejos, advertencias sobre cómo moverse en el mundo. La frase «Yo oro ni plata no te lo puedo dar; mas avisos para vivir muchos te mostraré» es casi una cita bíblica de San Pedro («No tengo oro ni plata; lo que tengo, eso te doy», Hechos 3,6). La ironía es devastadora: el que habría de beneficiarse de un guía es quien guía.`,
      },
      {
        fragmentId: fragToro.id,
        type: "glosa",
        ...anchor(toroText, "adestró en la carrera de vivir"),
        order: 9,
        content: `«Adestró»: adiestró, enseñó, encaminó. El verbo «adiestrar» significaba originalmente 'guiar a alguien', especialmente 'guiar a un ciego'. La ironía es perfecta: el ciego «adiestra» —en el sentido original de guiar— a quien debería guiarlo a él.`,
      },

      // ── Contexto ──────────────────────────────────────────────────────────
      {
        fragmentId: fragToro.id,
        type: "contexto",
        ...anchor(toroText, "Salimos de Salamanca, y llegando a la puente"),
        order: 1,
        content: `El Lazarillo de Tormes (1554) es la primera novela picaresca española. Se publicó de forma anónima —el anonimato protegía al autor de su feroz crítica social y religiosa— en Burgos, Alcalá de Henares y Amberes. La acción comienza en Salamanca, ciudad universitaria y cosmopolita, donde Lázaro ha nacido junto al río Tormes. El verraco —toro de piedra de época prerromana— en la entrada del puente romano existía entonces como hoy, lo que ancla el relato en un espacio perfectamente reconocible para el lector del XVI.`,
      },
      {
        fragmentId: fragToro.id,
        type: "contexto",
        ...anchor(toroText, "después de Dios, este me dio la vida"),
        order: 2,
        content: `El Lazarillo nació en un momento de crisis: la España de Carlos I era un imperio inmenso pero lleno de contradicciones sociales. La novela, lejos del idealismo de la novela de caballerías o la pastoril, elige como héroe a un niño pobre cuyo único capital es el ingenio. La comparación del ciego con Dios —«después de Dios, este me dio la vida»— es una de las ironías más agudas del libro: la violencia brutal del primero ha «iluminado» al protagonista más que ninguna enseñanza formal.`,
      },

      // ── Figuras ───────────────────────────────────────────────────────────
      {
        fragmentId: fragToro.id,
        type: "figura",
        category: "tropo",
        ...anchor(toroText, "siendo ciego, me alumbró y adestró en la carrera de vivir"),
        order: 1,
        content: `**Paradoja e ironía**: la frase final del fragmento concentra una doble paradoja. «Alumbrar» significa tanto 'dar luz' como 'dar a luz / parir'; y «adiestrar», en su acepción original, significaba 'guiar, especialmente a un ciego'. Así pues, quien debería ser guiado (el ciego) es quien guía, y quien debería parir (una madre) es un hombre brutal. Es la ironía picaresca en su forma más densa.`,
      },
      {
        fragmentId: fragToro.id,
        type: "figura",
        category: "tropo",
        ...anchor(toroText, "avivar el ojo y avisar"),
        order: 2,
        content: `**Paronomasia**: «avivar» y «avisar» son palabras de raíz semejante que suenan parecido pero dicen cosas distintas: «avivar» es agudizar, intensificar los sentidos; «avisar» es estar alerta, en guardia. La semejanza fónica refuerza que ambas acciones son inseparables: la atención y la cautela van de la mano.`,
      },
      {
        fragmentId: fragToro.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(toroText, "Yo oro ni plata no te lo puedo dar; mas avisos para vivir muchos te mostraré"),
        order: 3,
        content: `**Antítesis y sentencia**: la frase opone lo que el ciego no puede dar (oro y plata, la riqueza material) a lo que sí da (avisos, sabiduría práctica). La estructura bimembre y el tono sentencioso le dan el peso de un proverbio. Es, además, una paráfrasis irónica de San Pedro en los Hechos de los Apóstoles.`,
      },

      // ── Preguntas ─────────────────────────────────────────────────────────
      {
        fragmentId: fragToro.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Qué hace el ciego para engañar a Lázaro junto al toro de piedra? ¿Cuánto dura el dolor que sufre Lázaro? ¿Qué le enseña a continuación el ciego?`,
      },
      {
        fragmentId: fragToro.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 2,
        content: `«Paresciome que en aquel instante desperté de la simpleza en que, como niño, dormido estaba.» ¿Qué dos metáforas contiene esta frase? ¿Qué cambio interior describe?`,
      },
      {
        fragmentId: fragToro.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `¿Por qué afirma Lázaro que el ciego, «después de Dios, le dio la vida»? ¿Qué tipo de ironía expresa esa comparación entre el ciego y Dios?`,
      },
      {
        fragmentId: fragToro.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 2,
        content: `El ciego enseña a Lázaro «jerigonza» (la jerga del hampa) y le promete «avisos para vivir». ¿Qué idea tiene el Lazarillo de la educación? ¿En qué se parece y en qué se diferencia de la educación que describes en tu entorno?`,
      },
      {
        fragmentId: fragToro.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `La violencia del ciego se presenta con un tono casi cómico y como un método pedagógico («aprende que el mozo del ciego un punto ha de saber más que el diablo»). ¿Te parece que el texto justifica o critica esta violencia? ¿Por qué?`,
      },
    ],
  });
  } // end if (!existsToro)

  // ── FRAGMENTO 2: El jarro de vino ─────────────────────────────────────────
  const existsJarro = await prisma.fragment.findFirst({ where: { slug: "el-jarro-de-vino" } });
  if (existsJarro) { console.log("  skip el-jarro-de-vino"); }
  else { console.log("Creando «El jarro de vino»..."); }

  const fragJarro = existsJarro ?? await prisma.fragment.create({
    data: {
      slug: "el-jarro-de-vino",
      title: "El jarro de vino",
      location: "Lazarillo de Tormes, Tratado primero",
      headline: "Lo que te enfermó te sana y da salud",
      text: jarroText,
      order: 3,
      status: "published",
      featured: false,
      workId: lazarillo.id,
      constellations: { connect: [{ slug: "critica-social" }] },
      topics: { connect: [{ slug: "desengano" }] },
      characters: { connect: [{ slug: "lazaro-de-tormes" }] },
      artworkImageUrl: "/images/artworks/velazquez-borrachos.jpg",
      artworkTitle: "El triunfo de Baco (Los borrachos)",
      artworkAuthor: "Diego Velázquez, 1628-1629",
      artworkCaption:
        "Velázquez pintó a Baco no como dios olímpico sino rodeado de borrachos de taberna: hombres reales, con caras de calle, de hambre y de vino. La misma mezcla que recorre el Lazarillo: lo divino degradado, lo cotidiano elevado a materia literaria por primera vez.",
    },
  });

  if (!existsJarro) {
  console.log("Creando anotaciones de «El jarro de vino»...");

  await prisma.annotation.createMany({
    data: [
      // ── Glosas ────────────────────────────────────────────────────────────
      {
        fragmentId: fragJarro.id,
        type: "glosa",
        ...anchor(jarroText, "muy de presto"),
        order: 1,
        content: `«De presto»: rápidamente, con presteza. Forma arcaica de «deprisa», habitual en el castellano del XVI. La rapidez es esencial: Lázaro tiene que coger y devolver el jarro antes de que el ciego lo note.`,
      },
      {
        fragmentId: fragJarro.id,
        type: "glosa",
        ...anchor(jarroText, "besos callados"),
        order: 2,
        content: `«Besos callados»: sorbos silenciosos. La metáfora convierte el robo en un gesto casi tierno. Lázaro «besa» el jarro, no lo roba: el lenguaje suaviza la acción y muestra que el narrador adulto mira con humor y distancia su propio pasado.`,
      },
      {
        fragmentId: fragJarro.id,
        type: "glosa",
        ...anchor(jarroText, "tornábale a su lugar"),
        order: 3,
        content: `«Tornábale»: lo volvía a dejar. El pronombre enclítico pospuesto al verbo (tornábale, tapábale, espantábase…) es un rasgo típico del castellano renacentista que hoy suena arcaico.`,
      },
      {
        fragmentId: fragJarro.id,
        type: "glosa",
        ...anchor(jarroText, "fuentecilla y agujero sutil"),
        order: 4,
        content: `«Fuentecilla»: pequeño agujero por donde mana el líquido. «Sutil»: delgado, apenas perceptible. El diminutivo «fuentecilla» tiene un valor afectivo e irónico: Lázaro habla de su trampa con la admiración del artesano satisfecho de su ingenio.`,
      },
      {
        fragmentId: fragJarro.id,
        type: "glosa",
        ...anchor(jarroText, "pobrecilla lumbre"),
        order: 5,
        content: `«Pobrecilla lumbre»: el diminutivo «pobrecilla» aplicado al fuego revela la miseria del ambiente. No hay chimenea, no hay calor suficiente: la «lumbre» es tan precaria como todo en la vida de Lázaro. Paradójicamente, este calor mísero es lo que derrite la cera del agujero y permite la trampa.`,
      },
      {
        fragmentId: fragJarro.id,
        type: "glosa",
        ...anchor(jarroText, "el pobreto iba a beber"),
        order: 6,
        content: `«Pobreto»: pobrecillo (con sufijo italiano o dialectal -eto). Es un diminutivo afectivo-despectivo: Lázaro siente cierta lástima por el ciego, pero no tanta como para dejar de robarle. La ambivalencia es característica del narrador del Lazarillo.`,
      },
      {
        fragmentId: fragJarro.id,
        type: "glosa",
        ...anchor(jarroText, "acordé en el suelo del jarro"),
        order: 7,
        content: `«Acordé»: decidí, resolví, determiné. Uso arcaico: en el XVI «acordar» podía significar 'tomar una decisión'. El sentido moderno de 'ponerse de acuerdo con alguien' es posterior.`,
      },
      {
        fragmentId: fragJarro.id,
        type: "glosa",
        ...anchor(jarroText, "regalaba y me curaba"),
        order: 8,
        content: `«Regalar»: tratar bien, cuidar con esmero (germanía del siglo XVI). El ciego cura las heridas que acaba de provocar y trata bien a Lázaro: no por arrepentimiento, sino por necesidad. Sin el mozo, el ciego no puede moverse.`,
      },

      // ── Contexto ──────────────────────────────────────────────────────────
      {
        fragmentId: fragJarro.id,
        type: "contexto",
        ...anchor(jarroText, "Usaba el ciego poner cabe sí un jarrillo de vino"),
        order: 1,
        content: `Este episodio pertenece al Tratado I y se desarrolla en varios momentos: primero los robos con la paja, luego el agujero con cera, y finalmente la venganza del ciego. La estructura es la misma que la del cuento folclórico: intento de engaño → descubrimiento → venganza. El vino tiene además un valor simbólico en la novela: es fuente de calor (de vida) y de conflicto, el bien escaso que organiza toda la relación entre amo y criado en este tratado.`,
      },
      {
        fragmentId: fragJarro.id,
        type: "contexto",
        ...anchor(jarroText, "el pobre Lázaro, que de nada de esto se guardaba"),
        order: 2,
        content: `En este momento el narrador hace algo llamativo: abandona la primera persona y habla de sí mismo en tercera («el pobre Lázaro»). Es una disociación entre el Lázaro-narrador (adulto que cuenta) y el Lázaro-personaje (niño que recibe el golpe). El distanciamiento narrativo llega justo en el peor instante, como si el narrador adulto no quisiera identificarse del todo con el niño que va a ser golpeado, o como si la intensidad del recuerdo hiciera necesario ese pequeño paso atrás.`,
      },

      // ── Figuras ───────────────────────────────────────────────────────────
      {
        fragmentId: fragJarro.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(jarroText, "Espantábase, maldecíase, daba al diablo el jarro y el vino"),
        order: 1,
        content: `**Asíndeton y gradación**: tres verbos sin conjunción —espantarse, maldecirse, dar al diablo— describen la reacción del ciego ante el vino desaparecido con una rapidez casi cómica. El asíndeton (sin «y» entre las acciones) acelera el ritmo e imita la desesperación del personaje.`,
      },
      {
        fragmentId: fragJarro.id,
        type: "figura",
        category: "tropo",
        ...anchor(jarroText, "dulce y amargo jarro"),
        order: 2,
        content: `**Antítesis**: «dulce y amargo» en el mismo jarro resume toda la relación de Lázaro con el vino —y con el ciego. El vino es dulce porque alivia el hambre y el frío, y amargo porque trae el castigo. La antítesis en una sola frase concentra la paradoja de toda la novela picaresca: el bien y el mal vienen de la misma fuente.`,
      },
      {
        fragmentId: fragJarro.id,
        type: "figura",
        category: "sintaxis",
        ...anchor(jarroText, "un par de besos callados"),
        order: 3,
        content: `**Gradación del engaño**: la escalada del ingenio de Lázaro sigue una gradación perfecta: 1) besos callados (simples sorbos), 2) paja larga de centeno (instrumento discreto), 3) fuentecilla con tapón de cera (ingeniería artesanal). Cada intento es más elaborado que el anterior, y cada uno es descubierto por el ciego, que responde con un contraataque igual de ingenioso.`,
      },
      {
        fragmentId: fragJarro.id,
        type: "figura",
        category: "tropo",
        ...anchor(jarroText, "Lo que te enfermó te sana y da salud"),
        order: 4,
        content: `**Ironía y paradoja**: la última frase del ciego es una sentencia médica aplicada de manera perversa. Normalmente «lo que te enferma no te sana»: aquí, el vino que ha causado el conflicto (y las heridas del jarrazo) se usa para lavar las heridas. La ironía es cruel: la «medicina» es también el arma del delito.`,
      },
      {
        fragmentId: fragJarro.id,
        type: "figura",
        category: "sonoro",
        ...anchor(jarroText, "golpecillo"),
        order: 5,
        content: `**Contraste diminutivo / aumentativo**: «golpecillo» frente a «jarrazo» en el mismo párrafo. El diminutivo suaviza irónicamente un golpe que ha roto la cara de Lázaro y le ha dejado sin dientes de por vida; el aumentativo subraya el tamaño del proyectil. La disparidad entre el nombre pequeño y la lesión enorme es una broma macabra característica del humor negro picaresco.`,
      },

      // ── Preguntas ─────────────────────────────────────────────────────────
      {
        fragmentId: fragJarro.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 1,
        content: `¿Qué tres estratagemas usa Lázaro para beber el vino del ciego? ¿Cómo descubre el ciego cada una de ellas? ¿Qué consecuencias sufre Lázaro al final del episodio?`,
      },
      {
        fragmentId: fragJarro.id,
        type: "pregunta",
        questionGroup: "literal",
        order: 2,
        content: `¿Qué hace el ciego después de golpear a Lázaro con el jarro? ¿Cómo interpreta Lázaro ese gesto de curarle con vino?`,
      },
      {
        fragmentId: fragJarro.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 1,
        content: `En el momento del jarrazo, el narrador pasa a hablar de sí mismo en tercera persona: «el pobre Lázaro». ¿Por qué crees que hace eso? ¿Qué efecto produce en el lector ese cambio repentino de perspectiva?`,
      },
      {
        fragmentId: fragJarro.id,
        type: "pregunta",
        questionGroup: "interpretativo",
        order: 2,
        content: `El ciego dice: «Lo que te enfermó te sana y da salud.» ¿Qué ironía encierra esa frase? ¿De qué otra forma podría interpretarse más allá del vino?`,
      },
      {
        fragmentId: fragJarro.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 1,
        content: `Lázaro roba porque tiene hambre y «estaba hecho al vino». El ciego esconde el vino y se venga con violencia extrema. ¿Quién tiene más razón? ¿Existe un reparto claro de culpas en este episodio, o el texto lo presenta de forma más ambigua?`,
      },
      {
        fragmentId: fragJarro.id,
        type: "pregunta",
        questionGroup: "valorativo",
        order: 2,
        content: `El Lazarillo fue prohibido por la Inquisición en 1559. ¿Qué aspectos de este fragmento podrían haber molestado a las autoridades religiosas y políticas de la época?`,
      },
    ],
  });
  } // end if (!existsJarro)

  console.log("✓ Fragmentos del Lazarillo añadidos correctamente.");
  console.log(`  - ${fragToro.slug} (id ${fragToro.id})`);
  console.log(`  - ${fragJarro.slug} (id ${fragJarro.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
