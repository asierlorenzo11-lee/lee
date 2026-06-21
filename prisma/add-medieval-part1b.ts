/** Parte 1b: Jarchas (3) + Cantigas (2) — ejecutar solo si part1 ya corrió */
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
  type: string; anchor?: string; content: string; category?: string;
  questionGroup?: string; order: number;
}[]) {
  for (const a of list) {
    const pos = a.anchor ? anc(text, a.anchor) : null;
    await prisma.annotation.create({
      data: {
        fragmentId, type: a.type,
        anchorStart: pos?.anchorStart ?? null, anchorEnd: pos?.anchorEnd ?? null,
        content: a.content, category: a.category ?? null,
        questionGroup: a.questionGroup ?? null, order: a.order,
      },
    });
  }
}

async function main() {
  // ── JARCHAS ───────────────────────────────────────────────────────────────
  const jarAuthor = await prisma.author.findFirst({ where: { name: { contains: "jarchas" } } });
  if (!jarAuthor) throw new Error("No se encontró autor de jarchas");
  const jarWork = await prisma.work.findFirst({ where: { authorId: jarAuthor.id } });
  if (!jarWork) throw new Error("No se encontró obra de jarchas");
  const jarMax = await prisma.fragment.aggregate({ where: { workId: jarWork.id }, _max: { order: true } });
  let jarOrder = (jarMax._max.order ?? 0) + 1;

  const JARCHAS = [
    {
      slug: "tanto-amare",
      title: "Tant'amare, tant'amare",
      headline: "Enfermiron weyos nidios e dolen tan male",
      text: "Tant'amare, tant'amare,\nhabib, tant'amare;\nenfermiron weyos nidios\ne dolen tan male.\n\n(Tanto amar, tanto amar,\namigo, tanto amar;\nenfermaron mis húmedos ojos\ny me duelen tanto.)",
      glosas: [
        { anchor: "weyos nidios", content: "«Weyos nidios»: ojos húmedos o brillantes; mezcla de árabe («weyos», ojos) y romance («nidios», nítidos, brillantes)." },
        { anchor: "habib", content: "«Habib»: amado, querido en árabe. Las jarchas mezclan árabe y romance mozárabe en un bilingüismo propio de la convivencia medieval andalusí." },
      ],
    },
    {
      slug: "non-dormiray-mamma",
      title: "Non dormiray, mamma",
      headline: "Bon Abu'l-Qasim, la faj de matrana",
      text: "Non dormiray, mamma,\na rayo de mañana,\nbon Abu'l-Qasim\nla faj de matrana.\n\n(No dormiré, madre,\nal amanecer,\nmi buen Abu'l-Qasim\nes el rostro del alba.)",
      glosas: [
        { anchor: "faj de matrana", content: "«Faj de matrana»: rostro del alba (árabe «faj», rostro + romance «matrana», mañana). La amada compara a su amado con la claridad del amanecer: hipérbole amorosa." },
        { anchor: "rayo de mañana", content: "El primer rayo de luz del amanecer. Las jarchas son frecuentemente canciones de alba: la muchacha teme que el amante deba marcharse al despuntar el día." },
      ],
    },
    {
      slug: "que-fare-mamma",
      title: "¿Qué faré mamma?",
      headline: "Meu al-habib est ad yana",
      text: "¿Qué faré mamma?\nMeu al-habib est ad yana.\n\n(¿Qué haré, madre?\nMi amigo está en la puerta.)",
      glosas: [
        { anchor: "al-habib", content: "«Al-habib»: el amado; artículo árabe «al-» + «habib» (querido). La voz árabe convive con el romance «mamma» (madre) en la misma frase breve." },
        { anchor: "ad yana", content: "«Ad yana»: en la puerta; preposición latina «ad» + árabe «yana» (puerta). La urgencia del momento se condensa en dos palabras de dos lenguas distintas." },
      ],
    },
  ];

  for (const j of JARCHAS) {
    const existing = await prisma.fragment.findUnique({ where: { slug: j.slug } });
    if (existing) { console.log(`  (ya existe) ${j.slug}`); continue; }
    const f = await prisma.fragment.create({
      data: { workId: jarWork.id, slug: j.slug, title: j.title, headline: j.headline, location: "Jarcha mozárabe", text: j.text, order: jarOrder++, status: "published" },
    });
    await addAnnotations(f.id, j.text, [
      { type: "glosa", anchor: j.glosas[0].anchor, content: j.glosas[0].content, order: 1 },
      { type: "glosa", anchor: j.glosas[1].anchor, content: j.glosas[1].content, order: 2 },
      { type: "contexto", content: "Las jarchas son los textos líricos más antiguos conservados en lengua romance hispánica (siglos X-XI). Eran el estribillo final de poemas árabes o hebreos (muaxajas). Expresan la voz de una muchacha que lamenta la ausencia o espera al amado.", order: 3 },
      { type: "figura", category: "tropo", content: "Apóstrofe a la madre («mamma») como confidente: la muchacha no habla al amado sino que se dirige a su madre. Esta figura del confidente es característica de toda la lírica femenina tradicional medieval.", order: 4 },
      { type: "figura", category: "sonoro", content: "Brevedad y concentración expresiva: las jarchas son poemas brevísimos, a menudo de cuatro versos, que condensan una emoción intensa. La economía verbal contrasta con la intensidad del sentimiento.", order: 5 },
      { type: "pregunta", questionGroup: "literal", content: "¿Quién habla en la jarcha? ¿A quién se dirige? ¿Qué sentimiento expresa?", order: 6 },
      { type: "pregunta", questionGroup: "interpretativo", content: "¿Qué palabras de la jarcha proceden del árabe y cuáles del romance? ¿Qué nos dice este bilingüismo sobre la sociedad en que se compuso?", order: 7 },
      { type: "pregunta", questionGroup: "valorativo", content: "El amado está siempre ausente en las jarchas. ¿Cómo contribuye esa ausencia al sentido poético? ¿Por qué es más poético esperar que tener?", order: 8 },
      { type: "intertextualidad", content: "Las jarchas conectan con las cantigas de amigo gallegoportuguesas y los villancicos castellanos: los tres géneros comparten la voz femenina que lamenta la ausencia del amado y la figura de la madre como confidente.", order: 9 },
    ]);
    console.log(`✓ Jarcha: ${j.title}`);
  }

  // ── CANTIGAS DE AMIGO: 2 más ──────────────────────────────────────────────
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

  if (!await prisma.fragment.findUnique({ where: { slug: "de-que-morredes-filha" } })) {
    const fC7 = await prisma.fragment.create({
      data: { workId: codaxWork.id, slug: "de-que-morredes-filha", title: "De que morredes, filha", headline: "Alva e vai liero", location: "Cantiga de amigo", text: textC7, order: codaxOrder++, status: "published" },
    });
    await addAnnotations(fC7.id, textC7, [
      { type: "glosa", anchor: "moiro d'amores", content: "«Moiro d'amores»: muero de amores; la hipérbole amorosa de «morir de amor» es el núcleo temático de la cantiga.", order: 1 },
      { type: "glosa", anchor: "Alva e vai liero", content: "«Alva e vai liero»: el alba va ligera (pasa rápido); estribillo de esta cantiga de alba que marca el paso inexorable del tiempo y la nostalgia.", order: 2 },
      { type: "glosa", anchor: "me nembra", content: "«Me nembra»: me recuerda, me acuerdo; gallego-portugués antiguo. La cinta del amado desencadena el recuerdo y la emoción.", order: 3 },
      { type: "contexto", content: "Cantiga de amigo de Martín Codax (siglo XIII), trovador gallego-portugués del que se conservan siete cantigas con música original. Esta es una cantiga de alba: la muchacha llora porque la cinta que le regaló el amado le recuerda su ausencia.", order: 4 },
      { type: "figura", category: "sonoro", content: "Leixaprén: el segundo verso de cada estrofa se convierte en el primero de la siguiente, con variación sinonímica (amigo/amado, cingo/trago, falou/falamos). El efecto es un crescendo emocional que imita el movimiento del mar.", order: 5 },
      { type: "pregunta", questionGroup: "literal", content: "¿Quién habla en la cantiga? ¿A quién se dirige? ¿Qué función cumple la cinta del amado en el poema?", order: 6 },
      { type: "pregunta", questionGroup: "interpretativo", content: "Explica el recurso del leixaprén: ¿qué elementos se repiten y cuáles varían verso a verso? ¿Qué efecto produce esta técnica?", order: 7 },
      { type: "pregunta", questionGroup: "valorativo", content: "Compara esta cantiga con las jarchas: ¿qué tienen en común? ¿En qué se diferencia la voz de la mujer en cada género?", order: 8 },
      { type: "intertextualidad", content: "Las cantigas de amigo conectan con las jarchas (misma voz femenina, ausencia del amado) y anticipan los villancicos castellanos. La diferencia clave es el paisaje: el mar de Vigo como espacio del deseo frente al entorno doméstico de las jarchas.", order: 9 },
    ]);
    console.log("✓ Cantiga: De que morredes, filha");
  } else { console.log("  (ya existe) de-que-morredes-filha"); }

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

  if (!await prisma.fragment.findUnique({ where: { slug: "quantas-sabedes-amar-amigo" } })) {
    const fC8 = await prisma.fragment.create({
      data: { workId: codaxWork.id, slug: "quantas-sabedes-amar-amigo", title: "Quantas sabedes amar amigo", headline: "Treides comig'a lo mar de Vigo", location: "Cantiga de amigo", text: textC8, order: codaxOrder++, status: "published" },
    });
    await addAnnotations(fC8.id, textC8, [
      { type: "glosa", anchor: "treides", content: "«Treides»: venid, id; imperativo plural del verbo «ir» en gallego-portugués medieval.", order: 1 },
      { type: "glosa", anchor: "banhar-nos emos", content: "«Banhar-nos emos»: nos bañaremos; futuro en gallego-portugués. El baño en el mar es imagen ritual de purificación y encuentro festivo.", order: 2 },
      { type: "glosa", anchor: "mar levado", content: "«Mar levado»: mar agitado, embravecido; variante que alterna con «mar de Vigo» en cada estrofa por la técnica del paralelismo sinonímico.", order: 3 },
      { type: "contexto", content: "Cantiga de romería: la muchacha convoca a todas las enamoradas a ir al mar de Vigo a bañarse, con la promesa de ver al amado. El mar de Vigo es topónimo real pero funciona como espacio simbólico del amor, la espera y la comunidad femenina.", order: 4 },
      { type: "figura", category: "sonoro", content: "Paralelismo total: cada estrofa repite la estructura con variantes sinonímicas (amigo/amado, Vigo/levado). El estribillo «e banhar-nos emos nas ondas» recrea rítmicamente el movimiento del oleaje.", order: 5 },
      { type: "pregunta", questionGroup: "literal", content: "¿A quién invita la muchacha en esta cantiga? ¿Con qué finalidad? ¿Qué promete a las demás?", order: 6 },
      { type: "pregunta", questionGroup: "interpretativo", content: "¿Qué función tiene el mar en esta cantiga de Martín Codax? ¿Por qué aparece la naturaleza en las cantigas pero no en las jarchas?", order: 7 },
      { type: "pregunta", questionGroup: "valorativo", content: "El mar de Vigo aparece en varias cantigas de Codax. ¿Qué relación establece el poeta entre el paisaje natural y el sentimiento amoroso? ¿Conoces algún poema moderno que use el mar de forma similar?", order: 8 },
      { type: "intertextualidad", content: "Martín Codax es uno de los tres trovadores medievales de quienes se conserva música original. La cantiga conecta con la tradición de «canciones de romería» y con el lirismo del mar en García Lorca y Rosalía de Castro.", order: 9 },
    ]);
    console.log("✓ Cantiga: Quantas sabedes amar amigo");
  } else { console.log("  (ya existe) quantas-sabedes-amar-amigo"); }

  console.log("\n✅ Parte 1b completada.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
