/**
 * Parte 1: Conde Lucanor (VI, VII, X, XIII) + Jarchas (3) + Cantigas (2)
 */
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

function slugify(s: string) {
  return s.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "").trim()
    .replace(/\s+/g, "-").replace(/-+/g, "-");
}

function anc(text: string, needle: string) {
  const s = text.indexOf(needle);
  if (s === -1) return null;
  return { anchorStart: s, anchorEnd: s + needle.length };
}

async function addAnnotations(fragmentId: string, text: string, list: {
  type: string; anchor?: string; content: string; category?: string; questionGroup?: string;
  linkType?: string; externalUrl?: string; externalCitation?: string; order: number;
}[]) {
  for (const a of list) {
    const pos = a.anchor ? anc(text, a.anchor) : null;
    await prisma.annotation.create({
      data: {
        fragmentId,
        type: a.type,
        anchorStart: pos?.anchorStart ?? null,
        anchorEnd: pos?.anchorEnd ?? null,
        content: a.content,
        category: a.category ?? null,
        questionGroup: a.questionGroup ?? null,
        linkType: a.linkType ?? null,
        externalUrl: a.externalUrl ?? null,
        externalCitation: a.externalCitation ?? null,
        order: a.order,
      },
    });
  }
}

async function main() {

  // ── 1. CONDE LUCANOR: buscar autor y obra ──────────────────────────────────
  const jmAuthor = await prisma.author.findFirst({ where: { name: "Don Juan Manuel" } });
  if (!jmAuthor) throw new Error("No se encontró Don Juan Manuel");
  const clWork = await prisma.work.findFirst({
    where: { authorId: jmAuthor.id, title: { contains: "Conde Lucanor" } },
  });
  if (!clWork) throw new Error("No se encontró El Conde Lucanor");

  const maxOrder = await prisma.fragment.aggregate({
    where: { workId: clWork.id }, _max: { order: true },
  });
  let clOrder = (maxOrder._max.order ?? 0) + 1;

  // ── Ejemplo VI: La golondrina ──────────────────────────────────────────────
  const textVI = `Un día fablaba el conde Lucanor con Patronio, su consejero, et dixol':
-Patronio, a mí dicen que unos mis vecinos, que son más poderosos que yo, se andan ayuntando et faciendo muchas maestrías et artes con que me puedan engañar et facer mucho daño; et yo non lo creo, nin me recelo ende, pero por el buen entendimiento que vos habedes, quiérovos preguntar que me digades si entendedes que debo facer alguna cosa sobresto.
-Señor conde Lucanor -dixo Patronio-, para que en esto fagades lo que yo entiendo que vos cumple, placerme ía mucho que sopiésedes lo que contesçio a la golondrina con las otras aves.
El conde Lucanor le preguntó cómo fuera aquello.
-Señor conde Lucanor -dixo Patronio-, la golondrina vido que un omne sembraba lino, et entendió, por el su buen entendimiento, que si aquel lino nasçiese, podrían los omnes facer redes et lazos para tornar las aves. Et luego fuese para las aves et fízolas ayuntar, et díxoles en cómo el omne sembraba aquel lino et que fuesen çiertas que si aquel lino nasciese, que se les seguiría ende muy gran daño et que les consejaba que ante que el lino nasçiese, que fuesen allá et que lo arrincasen. Ca las cosas son ligeras de se desfacer en el comienço et después son muy más graves de se desfacer. Et las aves tovieron esto en poco et non lo quisieron facer. Et la golondrina les afincó de esto muchas veces, fasta que vio que las aves non se sintían de esto, nin daban por ello nada, et que el lino era ya tan cresçido que las aves non lo podrían arrancar con las manos nin con los picos. Et desque esto vieron las aves, que el lino era cresçido, et que non podían poner consejo al daño que se les ende seguiría, arripintiéronse ende mucho porque ya non habían í puesto consejo. Pero el ripintimiento fue a tiempo que non podían tener ya pro.
Et ante esto, cuando la golondrina vio que non querían poner recabdo las aves en aquel daño que les vinía, fuese para el omne, et metiose en su poder, et ganó de él segurança para sí et para su linaje. Et después acá viven las golondrinas en poder de los omnes et son seguras de ellos. Et las otras aves que se non quisieron guardar, tómanlas cada día con redes e con lazos.
-Et vós, señor conde Lucanor, si queredes ser guardado deste daño que decides que vos puede venir, aperçebitvos et ponet í recabdo, ante que el daño vos pueda acaesçer. Ca non es cuerdo el que ve la cosa desque es acaesçida, mas es cuerdo el que por una señaleja o por un movimiento cualquier entiende el daño que le puede venir et pone í consejo porque no le acaezca.
Al conde plago esto mucho, et fizolo según Patronio le consejó et fallóse ende bien.
Et porque entendió don Johan que este enxiemplo era muy bueno fizole poner en este libro et fizo estos viesos que dicen así:
En el comienço debe omne partir
el daño que non le pueda venir.`;

  const fVI = await prisma.fragment.create({
    data: {
      workId: clWork.id,
      slug: "la-golondrina-y-el-lino",
      title: "De lo que conteçió a la golondrina con las otras aves",
      headline: "En el comienço debe omne partir el daño que non le pueda venir",
      location: "Exemplo VI",
      text: textVI,
      order: clOrder++,
      status: "published",
    },
  });
  await addAnnotations(fVI.id, textVI, [
    { type: "glosa", anchor: "recelo ende", content: "«Recelo ende»: me preocupo de ello; «ende» es adverbio arcaico equivalente a «de ello» o «por ello».", order: 1 },
    { type: "glosa", anchor: "afincó", content: "Insistió, presionó; «afincarse» significa empeñarse con ahínco en algo.", order: 2 },
    { type: "glosa", anchor: "tener ya pro", content: "«Pro»: provecho, beneficio. «No podían tener ya pro» = ya no era útil.", order: 3 },
    { type: "contexto", content: "Don Juan Manuel escribió El Conde Lucanor entre 1330 y 1335. Es la primera gran obra de prosa narrativa en castellano con intención didáctica explícita. Cada exemplo sigue un esquema fijo: problema del conde → cuento de Patronio → aplicación al caso → moraleja en pareado.", order: 4 },
    { type: "figura", category: "tropo", content: "Alegoría: el lino que crece representa una amenaza política que, si no se ataja en su inicio, se vuelve imposible de eliminar. La golondrina encarna la prudencia; las aves irreflexivas, la nobleza negligente; el hombre y el lino, el enemigo en ciernes.", order: 5 },
    { type: "figura", category: "sonoro", content: "Estructura trimembre repetitiva (planteamiento / cuento / consejo) y acumulación de «et» coordinante que imita el estilo oral y mnemotécnico de la literatura didáctica medieval.", order: 6 },
    { type: "pregunta", questionGroup: "literal", content: "Determina la estructura del exemplo VI: ¿dónde comienza el planteamiento del problema, el cuento de Patronio, su aplicación al caso y la moraleja en verso?", order: 7 },
    { type: "pregunta", questionGroup: "interpretativo", content: "¿Qué representa cada elemento de la fábula? Relaciona: la golondrina / las otras aves / el hombre / el lino que crece con el problema que plantea el conde Lucanor.", order: 8 },
    { type: "pregunta", questionGroup: "valorativo", content: "La golondrina se salva poniéndose al servicio del hombre. ¿Cómo se puede interpretar esto en relación al concepto medieval de vasallaje? ¿Qué idea defiende don Juan Manuel sobre la organización feudal de la sociedad?", order: 9 },
    { type: "intertextualidad", content: "La fábula de la golondrina y el lino procede de la tradición esópica y oriental. El mismo tema aparece en el Calila e Dimna (siglo XIII), traducido del árabe al castellano por encargo de Alfonso X. Don Juan Manuel reelabora la fuente desde la mentalidad nobiliaria castellana del siglo XIV.", order: 10 },
  ]);
  console.log("✓ CL VI: La golondrina");

  // ── Ejemplo VII: Doña Truana ──────────────────────────────────────────────
  const textVII = `Otra vez fablava el conde Lucanor con Patronío en esta guisa:
-Patronio, un omne me dixo una razón e amostrame la manera cómmo podía seer, e bien vos digo que tantas maneras de aprovechamiento ha en ella que, si Dios quiere que se faga assí commo me él dixo, que sería mucho mi pro, ca tantas cosas son que nascen las unas de las otras, que al cabo es muy grant fecho además.
E contó a Patronio la manera cómmo podría seer. Desque Patronio entendió aquellas razones, respondió al conde en esta manera:
-Señor conde Lucanor, siempre oí decir que era buen seso atenerse omne a las cosas ciertas e non a las vanas fuzas, ca muchas vezes a los que se atienen a las fuzas, contésceles lo que conteció a doña Truana.
E el conde preguntó cómmo fuera aquello.
-Señor conde -dixo Patronio-, una muger fue que avíe nombre doña Truana e era asaz más pobre que rica; e un día iva al mercado e levava una olla de miel en la cabeca. E yendo por el camino, comencó a cuidar que vendría aquella olla de miel e que compraría una partida de huevos, e de aquellos huevos nazcirían gallinas e depués, de aquellos dineros que valdrían, compraría ovejas, e assí fue comprando de las ganancias que faría, que fallóse por más rica que ninguna de sus vecinas.
E con aquella riqueza que ella cuidava que avía, asmó cómmo casaría a sus fijos e sus fija, e cómmo iría aguardada por la calle con yernos e con nueras e cómmo dizían por ella córnmo fuera de buena ventura en llegar a tan grant riqueza, seyendo tan pobre commo solía seer.
E pensando en esto comencó a reir con grand plazer que avía de la su buena andanca, e, en riendo, dio con la mano en su fruente e entonce cayol la olla de la miel en tierra, e quebrase. Quando vio la olla quebrada, comencó a fazer muy grant duelo, toviendo que avía perdido todo lo que cuidava que avría si la olla non le quebrara. E porque puso todo su pensamiento por fuza vana, non se fizo al cabo nada de lo que ella cuidava.
E vos, señor conde, si queredes que lo que vos dixieren e lo que vos cuidardes sea todo cosa cierta, cred e cuidat siempre todas cosas tales que sean aguisadas e non fuzas dubdosas e vanas. E si las quisierdes provar, guardatvos que non aventuredes, nin pongades de lo vuestro cosa de que vos sintades por fiuza de la pro de lo que non sodes cierto.
Al conde plogó de lo que Patronio le dixo, e fizolo assí e fallóse ende bien.
E porque don Johan se pagó deste exiemplo, fizolo poner en este libra e fizo estos viessos:
A las cosas ciertas vos comendat
e las fuizas vanas vos dexat.`;

  const fVII = await prisma.fragment.create({
    data: {
      workId: clWork.id,
      slug: "dona-truana",
      title: "De lo que contesció a una muger quel dizíen doña Truana",
      headline: "A las cosas ciertas vos comendat, e las fuizas vanas vos dexat",
      location: "Exemplo VII",
      text: textVII,
      order: clOrder++,
      status: "published",
    },
  });
  await addAnnotations(fVII.id, textVII, [
    { type: "glosa", anchor: "fuzas", content: "«Fuzas» (o «fiuzas»): esperanzas, ilusiones, confianzas; especialmente las vanas o infundadas.", order: 1 },
    { type: "glosa", anchor: "asmó", content: "Pensó, calculó; «asmar» es verbo arcaico procedente del latín «aestimare».", order: 2 },
    { type: "glosa", anchor: "aguisadas", content: "Razonables, sensatas, bien ordenadas; «aguisado» es lo que está bien dispuesto.", order: 3 },
    { type: "contexto", content: "El cuento de «la lechera» —aquí doña Truana— es uno de los más universales de la tradición oral mundial. Don Juan Manuel lo conoció probablemente a través de colecciones orientales como el Calila e Dimna o el Sendebar. La versión del Conde Lucanor, escrita hacia 1330, es la más antigua en lengua romance.", order: 4 },
    { type: "figura", category: "tropo", content: "El cuento funciona como exemplum: narración breve con intención moral cuya enseñanza es aplicada explícitamente al problema del conde. La estructura de «sueño despierto» de doña Truana (fantasear encadenando ganancias futuras) es una ironía narrativa —el lector ya sabe que va a caer la olla.", order: 5 },
    { type: "figura", category: "sonoro", content: "Estilo acumulativo: «compraría ovejas, e assí fue comprando... que fallóse por más rica». La sintaxis aditiva («e... e... e») imita el ritmo oral del relato popular y anticipa la catástrofe con una aparente inevitabilidad.", order: 6 },
    { type: "pregunta", questionGroup: "literal", content: "¿Cuál es el problema que plantea el conde Lucanor? ¿Qué consejo le ofrece Patronio? Señala en el texto las diferentes partes del esquema del exemplo.", order: 7 },
    { type: "pregunta", questionGroup: "interpretativo", content: "El cuento de doña Truana puede resumirse como «contar los pollos antes de que nazcan». ¿Con qué refrán castellano actual podrías traducir la moraleja? Explica la relación.", order: 8 },
    { type: "pregunta", questionGroup: "valorativo", content: "¿Tienen los temas del Conde Lucanor relación con las preocupaciones de los nobles del siglo XIV? ¿Qué tipo de decisiones nobiliarias puede condenar don Juan Manuel con este exemplo?", order: 9 },
    { type: "intertextualidad", content: "La historia de «la lechera» (o «el barbilete») aparece en el Calila e Dimna árabe, en el Panchatantra sánscrito y en multitud de tradiciones orales. La versión más famosa en español moderno es la fábula de La Fontaine (siglo XVII). El ejemplo VII es por tanto un eslabón central de una cadena intertextual que atraviesa tres continentes.", order: 10 },
  ]);
  console.log("✓ CL VII: Doña Truana");

  // ── Ejemplo X: Los altramuces ─────────────────────────────────────────────
  const textX = `Otro día hablaba el conde Lucanor con Patronio, su consejero, de este modo:
-Patronio, bien sé que Dios me ha dado mucho más de lo que yo merezco y que en todos los demás casos solo tengo motivos para estar muy satisfecho, pero a veces me encuentro tan necesitado de dinero que no me importaría dejar esta vida. Os pido que me deis algún consejo para remediar esta aflicción mía.
-Señor conde Lucanor -dijo Patronio-, para que vos os consoléis cuando os pase esto os convendría saber lo que sucedió a dos hombres que fueron muy ricos.
El conde le rogó que se lo contara.
-Señor conde -comenzó Patronio-, uno de estos dos hombres llegó a tal extremo de pobreza que no le quedaba en el mundo nada que comer. Habiéndose esforzado por encontrar algo, no pudo hallar más que una escudilla de altramuces. Al recordar cuán rico había sido y pensar que ahora estaba hambriento y que no tenía más que los altramuces, que son tan amargos y que saben tan mal, empezó a llorar, aunque sin dejar de comer los altramuces, por la mucha hambre, y de echar las cáscaras hacia atrás. En medio de esta congoja y de este pesar notó que detrás de él había otra persona y, volviendo la cabeza, vio que un hombre comía las cáscaras de altramuces que él tiraba al suelo. Este era el otro de quien os dije que también había sido rico.
Cuando aquello vio el de los altramuces preguntó al otro por qué comía las cáscaras. Respondió que, aunque había sido más rico que él, había ahora llegado a tanto extremo de pobreza y tenía tanta hambre que se alegraba mucho de encontrar aquellas cáscaras que él arrojaba. Cuando esto oyó el de los altramuces se consoló, viendo que había otro más pobre que él y que tenía menos motivos para serlo. Con este consuelo se esforzó por salir de su pobreza, lo consiguió con ayuda de Dios y volvió otra vez a ser rico.
Vos, señor conde Lucanor, debéis saber que, por permisión de Dios, nadie en el mundo lo logra todo. Pero, pues en todas las demás cosas os hace Dios señalada merced y salís con lo que vos queréis, si alguna vez os falta dinero y pasáis estrecheces, no os entristezcáis, sino tened por cierto que otros más ricos y de más elevada condición estarán tan apurados que se tendrían por felices si pudieran dar a sus gentes aunque fuera menos de lo que vos les dais a los vuestros.
Al conde agradó mucho lo que dijo Patronio, se consoló y, esforzándose, logró salir, con ayuda de Dios, de la penuria en que se encontraba. Viendo don Juan que este cuento era bueno, lo hizo poner en este libro y escribió unos versos que dicen así:
Por pobreza nunca desmayéis
pues otros más pobres que vos hallaréis.`;

  const fX = await prisma.fragment.create({
    data: {
      workId: clWork.id,
      slug: "el-hombre-y-los-altramuces",
      title: "Lo que sucedió a un hombre que por pobreza comía altramuces",
      headline: "Por pobreza nunca desmayéis, pues otros más pobres que vos hallaréis",
      location: "Exemplo X",
      text: textX,
      order: clOrder++,
      status: "published",
    },
  });
  await addAnnotations(fX.id, textX, [
    { type: "glosa", anchor: "altramuces", content: "Legumbre muy amarga (Lupinus albus); alimento de los pobres en la Edad Media. Su amargor extremo hace más expresivo el contraste con la pobreza absoluta del personaje.", order: 1 },
    { type: "glosa", anchor: "escudilla", content: "Cuenco o bol de madera o barro; recipiente humilde para comer. «Una escudilla de altramuces» subraya la miseria de quien nada más tiene.", order: 2 },
    { type: "contexto", content: "El exemplo X pertenece al eje moral de la aceptación cristiana de la adversidad. Don Juan Manuel, sobrino de Alfonso X y uno de los nobles más poderosos de su tiempo, escribe para una aristocracia que frecuentemente sufría reveses económicos por las guerras y confiscaciones del siglo XIV.", order: 3 },
    { type: "figura", category: "tropo", content: "El cuento usa la técnica de los «espejismos graduales»: el lector descubre, al mismo tiempo que el protagonista, que siempre hay alguien en peor situación. El segundo personaje —el que come las cáscaras— funciona como espejo degradado que relativiza el sufrimiento del primero.", order: 4 },
    { type: "pregunta", questionGroup: "literal", content: "Resume el cuento en cuatro o cinco líneas. ¿Cuál es la enseñanza moral que Patronio extrae de él?", order: 5 },
    { type: "pregunta", questionGroup: "interpretativo", content: "¿Sigue este exemplo la estructura típica del Conde Lucanor? Señala dónde comienza y termina cada parte.", order: 6 },
    { type: "pregunta", questionGroup: "valorativo", content: "La moraleja propone consolarse viendo que otros están peor. ¿Te parece este un consejo válido hoy? ¿Qué visión del sufrimiento y la fortuna refleja?", order: 7 },
    { type: "intertextualidad", content: "La filosofía de «siempre hay quien está peor» conecta con la tradición estoica de Séneca (Cartas a Lucilio) y con el tópico medieval de la Rueda de la Fortuna. En la literatura posterior, Cervantes retomará el humor ante la pobreza en el Quijote.", order: 8 },
  ]);
  console.log("✓ CL X: Los altramuces");

  // ── Ejemplo XIII: El cazador de perdices ──────────────────────────────────
  const textXIII = `Hablaba otra vez el conde Lucanor con Patronio, su consejero, y le dijo así:
-Patronio, algunas personas muy importantes, y también otras que no lo son tanto, me hacen daño a veces en mi hacienda o en mis vasallos y, cuando me ven, me dicen que les pesa mucho y que lo hicieron obligados por la necesidad y porque no podían en aquel momento hacer otra cosa. Como quiero saber qué conducta seguir cuando tales cosas me sucedan, os ruego me digáis qué pensáis de esto.
-Señor conde Lucanor -respondió Patronio-, lo que os pasa y os preocupa tanto se parece mucho a lo que sucedió a un hombre que cazaba perdices.
El conde le rogó que se lo contara.
-Señor conde -dijo Patronio- un hombre puso redes a las perdices y, cuando cayeron, se llegó a ellas y, conforme las iba sacando, las mataba a todas. Mientras hacía esto le daba el viento en la cara con tanta fuerza que le hacía llorar. Una de las perdices que aún estaba viva empezó a decir a las que quedaban dentro de la red: "Ved, amigas, lo que hace este hombre que, aunque nos mata, nos compadece y llora por eso". Otra perdiz, que por ser más sabia que la que hablaba no cayó en la red, le dijo desde fuera: "Amiga, mucho le agradezco a Dios el haberme guardado, como le ruego haga en adelante, no solo conmigo, sino con todas mis amigas, del que quiere matarme o hacerme daño y simula sentirlo".
Vos, señor conde Lucanor, guardaos siempre del que os perjudica y dice que le pesa.
El conde tuvo por buen consejo este que le daba Patronio, lo puso en práctica y le fue muy bien. Viendo don Juan que este cuento era muy bueno, lo mandó poner en este libro y escribió unos versos que dicen así:
Procúrate siempre muy bien guardar
del que al hacerte mal muestra pesar.`;

  const fXIII = await prisma.fragment.create({
    data: {
      workId: clWork.id,
      slug: "el-cazador-de-perdices",
      title: "Lo que le sucedió a un hombre que cazaba perdices",
      headline: "Procúrate siempre muy bien guardar del que al hacerte mal muestra pesar",
      location: "Exemplo XIII",
      text: textXIII,
      order: clOrder++,
      status: "published",
    },
  });
  await addAnnotations(fXIII.id, textXIII, [
    { type: "glosa", anchor: "hacienda", content: "Bienes, propiedades, patrimonio; en el siglo XIV, la «hacienda» de un noble incluía tierras, rentas y vasallos.", order: 1 },
    { type: "glosa", anchor: "simula sentirlo", content: "Finge sentirlo, aparenta arrepentimiento; la clave del cuento es la diferencia entre el llanto real (causado por el viento) y la compasión fingida.", order: 2 },
    { type: "contexto", content: "El exemplo XIII refleja la realidad política de la nobleza castellana en el siglo XIV: traiciones entre señores, daños fingidos como inevitables y diplomacia hipócrita. Don Juan Manuel, que había sufrido alianzas rotas con Alfonso XI, habla desde la experiencia.", order: 3 },
    { type: "figura", category: "tropo", content: "La fábula usa la ironía dramática: el lector —y la perdiz sabia— saben desde el inicio que el llanto del cazador es involuntario, mientras la perdiz atrapada lo interpreta como compasión. La perdiz que no cayó en la red simboliza la prudencia que salva.", order: 4 },
    { type: "pregunta", questionGroup: "literal", content: "¿Cuál es la enseñanza que el relato de Patronio transmite al conde Lucanor? Resume el cuento con tus propias palabras.", order: 5 },
    { type: "pregunta", questionGroup: "interpretativo", content: "¿Qué diferencia hay entre la perdiz que habla dentro de la red y la perdiz sabia que habla desde fuera? ¿Qué representan cada una en el plano alegórico?", order: 6 },
    { type: "pregunta", questionGroup: "valorativo", content: "El ejemplo enseña a desconfiar de quien hace daño y luego dice lamentarlo. ¿Sigue siendo válido este consejo hoy? Busca una situación actual en que la moraleja de Patronio se aplique.", order: 7 },
    { type: "intertextualidad", content: "El motivo del «enemigo que llora mientras hace daño» aparece en la tradición esópica (El cocodrilo y sus lágrimas) y en Ovidio. La imagen de «lágrimas de cocodrilo» pasará al refranero español y a Shakespeare (Othello, IV.1).", order: 8 },
  ]);
  console.log("✓ CL XIII: El cazador de perdices");

  // ── 2. JARCHAS: buscar obra existente ─────────────────────────────────────
  const jarAuthor = await prisma.author.findFirst({ where: { name: { contains: "jarchas" } } });
  if (!jarAuthor) throw new Error("No se encontró autor de jarchas");
  const jarWork = await prisma.work.findFirst({ where: { authorId: jarAuthor.id } });
  if (!jarWork) throw new Error("No se encontró obra de jarchas");
  const jarMax = await prisma.fragment.aggregate({ where: { workId: jarWork.id }, _max: { order: true } });
  let jarOrder = (jarMax._max.order ?? 0) + 1;

  const JARCHAS = [
    {
      title: "Tant'amare, tant'amare",
      headline: "Enfermiron weyos nidios e dolen tan male",
      text: "Tant'amare, tant'amare,\nhabib, tant'amare;\nenfermiron weyos nidios\ne dolen tan male.\n\n(Tanto amar, tanto amar,\namigo, tanto amar;\nenfermaron mis húmedos ojos\ny me duelen tanto.)",
      glosa1: { anchor: "weyos nidios", content: "«Weyos nidios»: ojos húmedos o brillantes; los ojos de la muchacha, que lloran de amor. Mezcla de árabe («weyos») y romance («nidios», de «nítidos»)." },
      glosa2: { anchor: "habib", content: "«Habib»: amado, querido, en árabe clásico. Las jarchas mezclan árabe y romance hispanico (mozárabe) en un código bilingüe propio de la convivencia medieval." },
    },
    {
      title: "Non dormiray, mamma",
      headline: "Bon Abu'l-Qasim, la faj de matrana",
      text: "Non dormiray, mamma,\na rayo de mañana,\nbon Abu'l-Qasim\nla faj de matrana.\n\n(No dormiré, madre,\nal amanecer,\nmi buen Abu'l-Qasim\nes el rostro del alba.)",
      glosa1: { anchor: "faj de matrana", content: "«Faj de matrana»: rostro del alba; la amada compara a su amado con la claridad del amanecer. Hipérbole del amor." },
      glosa2: { anchor: "rayo de mañana", content: "El primer rayo de luz de la mañana; las jarchas son a menudo canciones de alba («albas») en las que la muchacha teme que el amante tenga que marcharse al amanecer." },
    },
    {
      title: "¿Qué faré mamma?",
      headline: "Meu al-habib est ad yana",
      text: "¿Qué faré mamma?\nMeu al-habib est ad yana.\n\n(¿Qué haré, madre?\nMi amigo está en la puerta.)",
      glosa1: { anchor: "al-habib", content: "«Al-habib»: el amado, el querido; artículo árabe «al-» + «habib». La voz árabe convive con el romance «mamma» (madre) en la misma frase." },
      glosa2: { anchor: "ad yana", content: "«Ad yana»: en la puerta; construcción romance con preposición latina «ad» + árabe «yana» (puerta). La urgencia del momento se expresa en el bilingüismo mismo." },
    },
  ];

  for (const j of JARCHAS) {
    const f = await prisma.fragment.create({
      data: { workId: jarWork.id, slug: slugify(j.title), title: j.title, headline: j.headline, location: "Jarcha mozárabe", text: j.text, order: jarOrder++, status: "published" },
    });
    await addAnnotations(f.id, j.text, [
      { type: "glosa", anchor: j.glosa1.anchor, content: j.glosa1.content, order: 1 },
      { type: "glosa", anchor: j.glosa2.anchor, content: j.glosa2.content, order: 2 },
      { type: "contexto", content: "Las jarchas son los textos líricos más antiguos conservados en una lengua romance hispánica (siglos X-XI). Eran el estribillo final de poemas árabes o hebreos (muaxajas). Expresan la voz de una muchacha que lamenta la ausencia o espera al amado.", order: 3 },
      { type: "figura", category: "tropo", content: "Apóstrofe a la madre («mamma») como confidente: la muchacha no habla al amado sino que se dirige a su madre o a sus hermanas. Este recurso del confidente es propio de toda la lírica femenina tradicional.", order: 4 },
      { type: "pregunta", questionGroup: "literal", content: "¿Quién habla en la jarcha? ¿A quién se dirige? ¿Qué sentimiento expresa?", order: 5 },
      { type: "pregunta", questionGroup: "interpretativo", content: "¿Qué palabras de la jarcha proceden del árabe y cuáles del romance? ¿Qué nos dice este bilingüismo sobre la sociedad en que se compuso?", order: 6 },
      { type: "pregunta", questionGroup: "valorativo", content: "¿Por qué crees que el amado está siempre ausente en las jarchas? ¿Cómo contribuye esa ausencia al sentido poético?", order: 7 },
      { type: "intertextualidad", content: "Las jarchas conectan con las cantigas de amigo gallegoportuguesas y los villancicos castellanos: los tres géneros comparten la voz femenina que lamenta la ausencia del amado y la figura de la madre como confidente.", order: 8 },
    ]);
    console.log(`✓ Jarcha: ${j.title}`);
  }

  // ── 3. CANTIGAS DE AMIGO: 2 más ───────────────────────────────────────────
  const codaxAuthor = await prisma.author.findFirst({ where: { name: { contains: "Codax" } } });
  if (!codaxAuthor) throw new Error("No se encontró Martín Codax");
  const codaxWork = await prisma.work.findFirst({ where: { authorId: codaxAuthor.id } });
  if (!codaxWork) throw new Error("No se encontró obra de Codax");
  const codaxMax = await prisma.fragment.aggregate({ where: { workId: codaxWork.id }, _max: { order: true } });
  let codaxOrder = (codaxMax._max.order ?? 0) + 1;

  const textC7 = `-De que morredes, filha, a do corpo velido?
-Madre, moiro d'amores que mi deu meu amigo.
 Alva e vai liero.

-De que morredes, filha, a do corpo louçano?
-Madre, moiro d'amores que mi deu meu amado.
 Alva e vai liero.

Madre, moiro d'amores que mi deu meu amigo,
quando vej'esta cinta, que por seu amor cingo.
 Alva e vai liero.

Madre, moiro d'amores que mi deu meu amado,
quando vej'esta cinta, que por seu amor trago.
 Alva e vai liero.

Quando vej'esta cinta, que por seu amor cingo,
e me nembra, fremosa, como falou comigo.
 Alva e vai liero.

Quando vej'esta cinta, que por seu amor trago
e me nembra, fremosa, como falamos ambos.
 Alva e vai liero.`;

  const fC7 = await prisma.fragment.create({
    data: { workId: codaxWork.id, slug: "de-que-morredes-filha", title: "De que morredes, filha", headline: "Alva e vai liero", location: "Cantiga de amigo", text: textC7, order: codaxOrder++, status: "published" },
  });
  await addAnnotations(fC7.id, textC7, [
    { type: "glosa", anchor: "moiro d'amores", content: "«Moiro d'amores»: muero de amores; en gallego-portugués medieval, la hipérbole amorosa de «morir de amor» es el núcleo temático de la cantiga.", order: 1 },
    { type: "glosa", anchor: "Alva e vai liero", content: "«Alva e vai liero»: el alba va ligera (pasa rápido); estribillo de esta cantiga de alba que marca el paso inexorable del tiempo.", order: 2 },
    { type: "glosa", anchor: "me nembra", content: "«Me nembra»: me recuerda, me acuerdo; gallego-portugués antiguo. La cinta del amado desencadena el recuerdo.", order: 3 },
    { type: "contexto", content: "Cantiga de amigo de Martín Codax (siglo XIII), trovador gallego-portugués del que se conservan siete cantigas con música original. Esta es una cantiga de alba: la muchacha llora al alba porque el amado se ha ido o la cinta que él le regaló le recuerda su ausencia.", order: 4 },
    { type: "figura", category: "sonoro", content: "Leixaprén: recurso paralelístico en que el segundo verso de cada estrofa pasa a ser el primero de la siguiente, con una variación sinonímica (amigo/amado, cingo/trago, falou/falamos). El efecto es un crescendo emocional y musical.", order: 5 },
    { type: "pregunta", questionGroup: "literal", content: "¿Quién habla en la cantiga? ¿A quién se dirige? ¿Qué función cumple la cinta del amado en el poema?", order: 6 },
    { type: "pregunta", questionGroup: "interpretativo", content: "Explica el recurso del leixaprén: ¿qué elementos se repiten y cuáles varían? ¿Qué efecto produce esta técnica?", order: 7 },
    { type: "pregunta", questionGroup: "valorativo", content: "¿Por qué crees que las cantigas de amigo siempre presentan a un amado ausente? ¿Cómo contribuye esa ausencia al sentido poético del texto?", order: 8 },
    { type: "intertextualidad", content: "Las cantigas de amigo conectan con las jarchas mozárabes (misma voz femenina, mismo tema de ausencia) y anticipan los villancicos castellanos. La diferencia clave es el escenario natural gallego (el mar de Vigo) frente al entorno doméstico de las jarchas.", order: 9 },
  ]);
  console.log("✓ Cantiga: De que morredes");

  const textC8 = `Quantas sabedes amar amigo
treides comig'a lo mar de Vigo,
e banhar-nos emos nas ondas.

Quantas sabedes amar amado
treides comig'a lo mar levado,
e banhar-nos emos nas ondas.

Treides comig'a lo mar de Vigo,
e veeremo-lo meu amigo
e banhar-nos emos nas ondas.

Treides comig'a lo mar levado,
e veeremo-lo meu amado,
e banhar-nos emos nas ondas.`;

  const fC8 = await prisma.fragment.create({
    data: { workId: codaxWork.id, slug: "quantas-sabedes-amar-amigo", title: "Quantas sabedes amar amigo", headline: "Treides comig'a lo mar de Vigo", location: "Cantiga de amigo", text: textC8, order: codaxOrder++, status: "published" },
  });
  await addAnnotations(fC8.id, textC8, [
    { type: "glosa", anchor: "treides", content: "«Treides»: venid, id; imperativo plural del verbo «ir» en gallego-portugués medieval.", order: 1 },
    { type: "glosa", anchor: "banhar-nos emos", content: "«Banhar-nos emos»: nos bañaremos; futuro de «bañar» en gallego-portugués. El baño en el mar es imagen de purificación y encuentro erótico.", order: 2 },
    { type: "glosa", anchor: "mar levado", content: "«Mar levado»: mar agitado, mar con olas; variante del mar de Vigo que alterna con el sinónimo en cada estrofa.", order: 3 },
    { type: "contexto", content: "Cantiga de romería o de procesión: la muchacha invita a todas las que saben de amor a ir al mar de Vigo a bañarse, con la promesa de ver al amado. El mar de Vigo es topónimo real pero funciona como espacio simbólico del amor y la espera.", order: 4 },
    { type: "figura", category: "sonoro", content: "Paralelismo total: cada estrofa repite la misma estructura con variantes sinonímicas (amigo/amado, Vigo/levado). El estribillo «e banhar-nos emos nas ondas» crea el efecto rítmico del oleaje.", order: 5 },
    { type: "pregunta", questionGroup: "literal", content: "¿A quién invita la muchacha en esta cantiga? ¿Con qué finalidad? ¿Qué promete?", order: 6 },
    { type: "pregunta", questionGroup: "interpretativo", content: "¿Qué función tiene la naturaleza (el mar) en esta cantiga? ¿Qué diferencia existe entre este uso de la naturaleza y las jarchas?", order: 7 },
    { type: "pregunta", questionGroup: "valorativo", content: "El mar de Vigo aparece en tres de las siete cantigas de Martín Codax. ¿Qué relación establece el poeta entre el espacio natural y el sentimiento amoroso?", order: 8 },
    { type: "intertextualidad", content: "Martín Codax es uno de los tres trovadores de los que se conserva música medieval original. La cantiga «Quantas sabedes» era cantada con melodía. La tradición de cantar al mar y al amor femenino enlaza con Safo y llega hasta García Lorca.", order: 9 },
  ]);
  console.log("✓ Cantiga: Quantas sabedes amar amigo");

  console.log("\n✅ Parte 1 completada.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
