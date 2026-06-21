/** Parte 3: Alfonso X el Sabio — nuevo autor + 2 obras + 2 fragmentos */
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

function anc(text: string, needle: string) {
  const s = text.indexOf(needle);
  if (s === -1) { console.warn(`  ⚠ anc not found: "${needle}"`); return null; }
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
  // ── Autor: Alfonso X el Sabio ─────────────────────────────────────────────
  let author = await prisma.author.findUnique({ where: { slug: "alfonso-x-el-sabio" } });
  if (!author) {
    author = await prisma.author.create({
      data: {
        slug: "alfonso-x-el-sabio",
        name: "Alfonso X el Sabio",
        birthYear: 1221,
        deathYear: 1284,
        country: "Castilla",
        era: "Medieval",
        bio: "Alfonso X el Sabio (1221-1284), rey de Castilla y León, impulsó desde su corte una ambiciosa empresa cultural: la traducción y compilación del saber universal en lengua castellana. Sus talleres produjeron obras científicas, jurídicas e históricas de primer orden, convirtiendo el castellano en lengua del conocimiento. Es también autor de las Cantigas de Santa María, colección de poesía religiosa en gallego-portugués.",
        portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Alfonso_X_el_Sabio_-_Cantigas_de_Santa_Mar%C3%ADa_%28c.1280%2C_El_Escorial%29.jpg/440px-Alfonso_X_el_Sabio_-_Cantigas_de_Santa_Mar%C3%ADa_%28c.1280%2C_El_Escorial%29.jpg",
      },
    });
    console.log("✓ Autor creado: Alfonso X el Sabio");
  } else {
    console.log("  (ya existe) Alfonso X el Sabio");
  }

  // ── Obra 1: Libro de la ochava esfera ─────────────────────────────────────
  let workOchava = await prisma.work.findFirst({ where: { authorId: author.id, slug: "libro-de-la-ochava-esfera" } });
  if (!workOchava) {
    workOchava = await prisma.work.create({
      data: {
        slug: "libro-de-la-ochava-esfera",
        title: "Libro de la ochava esfera",
        authorId: author.id,
        year: 1256,
        era: "Medieval",
        genre: "prosa científica",
        synopsis: "Traducción y adaptación alfonsí de una obra árabe de astronomía. Describe las estrellas fijas de la octava esfera celeste según la cosmología ptolemaica. Es uno de los primeros textos científicos escritos en castellano.",
      },
    });
    console.log("✓ Obra creada: Libro de la ochava esfera");
  } else {
    console.log("  (ya existe) Libro de la ochava esfera");
  }

  // ── Obra 2: Lapidario ─────────────────────────────────────────────────────
  let workLap = await prisma.work.findFirst({ where: { authorId: author.id, slug: "lapidario-alfonso-x" } });
  if (!workLap) {
    workLap = await prisma.work.create({
      data: {
        slug: "lapidario-alfonso-x",
        title: "Lapidario",
        authorId: author.id,
        year: 1250,
        era: "Medieval",
        genre: "prosa científica",
        synopsis: "Traducción alfonsí de una obra árabe sobre las propiedades mágicas y medicinales de las piedras preciosas. Combina la tradición islámica del saber con la cosmología astrológica medieval. Primer lapidario extenso escrito en castellano.",
      },
    });
    console.log("✓ Obra creada: Lapidario");
  } else {
    console.log("  (ya existe) Lapidario");
  }

  // ── Fragmento 1: Ochava esfera — prólogo ──────────────────────────────────
  const textOchava = `Este libro fue trasladado de caldeo en arábigo, et de arábigo en latín, et de latín en castellano. Et traspúsolo el rey Alfonso, fijo del muy noble rey don Fernando et de la reina doña Beatriz.
Et fabla en él de las figuras et de las naturas de las estrellas fixas que son en la ochava espera. Et compúsolo en el tercero año que él reinó.

El saber de las estrellas es una de las nobles cosas del mundo que el hombre puede saber et aprender. Ca por el saber de ellas puede el hombre conoscer muchas cosas que son encubiertas et que no puede saber por otra carrera.

Et por ende el rey don Alfonso, queriendo aprovechar a todos los que quisieren saber esta ciencia, fizo trasladar este libro de arábigo en lenguaje castellano, porque los que non sopiessen la lengua arábiga pudiesen entender las virtudes et las propiedades de las estrellas, et oviessen placer con ellas.`;

  if (!await prisma.fragment.findUnique({ where: { slug: "prologo-ochava-esfera" } })) {
    const f = await prisma.fragment.create({
      data: { workId: workOchava.id, slug: "prologo-ochava-esfera", title: "Prólogo del Libro de la ochava esfera", headline: "Trasladado de caldeo en arábigo, et de arábigo en latín, et de latín en castellano", location: "Prosa científica alfonsí", text: textOchava, order: 1, status: "published" },
    });
    await addAnnotations(f.id, textOchava, [
      { type: "glosa", anchor: "caldeo en arábigo", content: "La cadena de traducciones caldeo → árabe → latín → castellano ilustra el método alfonsí: el rey nunca traduce directamente del original, sino que compila y adapta a través de tradiciones intermedias.", order: 1 },
      { type: "glosa", anchor: "estrellas fixas", content: "«Estrellas fixas»: las estrellas fijas de la octava esfera, las que no se mueven en la cosmología ptolemaica (en contraste con los planetas, que sí se mueven). La ochava esfera es la capa exterior del universo geocéntrico.", order: 2 },
      { type: "glosa", anchor: "carrera", content: "«Carrera»: camino, vía; arcaísmo que hoy solo sobrevive en expresiones como «a toda carrera». Aquí designa un método o procedimiento de conocimiento.", order: 3 },
      { type: "contexto", content: "Alfonso X organizó en Toledo un scriptorium multicultural: sabios judíos, árabes y cristianos colaboraban para traducir obras científicas árabes al castellano. La Escuela de Traductores de Toledo convirtió a Castilla en puente entre el saber islámico y la Europa cristiana.", order: 4 },
      { type: "figura", category: "sintaxis", content: "Coordinación aditiva en cadena: «et... et... et...» reproduce la estructura paratáctica del árabe, lengua de la que proceden los originales. El uso abundante de «et» (y) es marca estilística de la prosa alfonsí.", order: 5 },
      { type: "pregunta", questionGroup: "literal", content: "¿Cuántas lenguas intervienen en la traducción descrita? ¿Qué rey impulsó la obra? ¿En qué año de su reinado se compuso?", order: 6 },
      { type: "pregunta", questionGroup: "interpretativo", content: "¿Por qué Alfonso X da tanta importancia a que la obra esté en castellano? ¿Qué utilidad tiene para los que «non sopiessen la lengua arábiga»?", order: 7 },
      { type: "pregunta", questionGroup: "valorativo", content: "Este prólogo muestra a un rey que patrocina el saber como acto de gobierno. ¿Qué modelo de cultura transmite? ¿Lo relacionarías con algún proyecto político o cultural actual?", order: 8 },
      { type: "intertextualidad", content: "La empresa cultural alfonsí anticipa el mecenazgo renacentista: Lorenzo de Médici en Florencia o Cosme en Roma también usaron el patrocinio cultural como instrumento de poder y legitimación. Alfonso X convirtió el castellano en lengua del saber como Dante el italiano o Chaucer el inglés.", order: 9 },
    ]);
    console.log("✓ Fragmento: Prólogo de la ochava esfera");
  } else { console.log("  (ya existe) prologo-ochava-esfera"); }

  // ── Fragmento 2: Lapidario — prólogo ──────────────────────────────────────
  const textLap = `Este libro es llamado Lapidario, según el lenguaje de los latinos, et en el castellano quiere decir tanto como libro de las virtudes de las piedras.
Et fue trasladado de arábigo en latín, et de latín en castellano, por mandado del rey don Alfonso, fijo del rey don Fernando el Sancto et de la reina doña Beatriz.

Et fízolo trasladar porque fallara que era muy oscura razón la que en él estava, en guisa que ninguno la podía entender. Et él quiso que todos los que este libro leyessen podiessen entender lo que en él era escripto, et que sopiessen las virtudes et las naturas de las piedras.

Ca las piedras preciosas han tales virtudes en sí que mandan los sabios que las trayan los reyes et los príncipes para complimiento de sus obras et para defendimiento de sus personas.`;

  if (!await prisma.fragment.findUnique({ where: { slug: "prologo-lapidario" } })) {
    const f = await prisma.fragment.create({
      data: { workId: workLap.id, slug: "prologo-lapidario", title: "Prólogo del Lapidario", headline: "Las virtudes de las piedras", location: "Prosa científica alfonsí", text: textLap, order: 1, status: "published" },
    });
    await addAnnotations(f.id, textLap, [
      { type: "glosa", anchor: "virtudes de las piedras", content: "«Virtudes»: propiedades activas o poderes de las piedras; en el pensamiento medieval, cada mineral encerraba fuerzas que actuaban sobre el cuerpo y el alma según principios astrológicos.", order: 1 },
      { type: "glosa", anchor: "oscura razón", content: "«Oscura razón»: texto difícil de entender; Alfonso X justifica su traducción porque el original árabe o latino era inaccesible al lector común.", order: 2 },
      { type: "glosa", anchor: "defendimiento de sus personas", content: "«Defendimiento de sus personas»: protección de sus cuerpos. Las piedras preciosas se usaban como amuletos protectores. El texto no distingue entre magia y medicina.", order: 3 },
      { type: "contexto", content: "El Lapidario es una obra de naturaleza mágico-científica: clasifica las piedras según los signos del zodíaco y describe sus poderes curativos y protectores. Refleja la visión medieval del mundo como sistema de correspondencias entre el cosmos (estrellas), la tierra (minerales) y el cuerpo humano.", order: 4 },
      { type: "figura", category: "tropo", content: "Autoridad de los sabios: «mandan los sabios» introduce la idea de que el conocimiento se transmite por tradición de autoridad. En el pensamiento medieval, citar a «los sabios» equivale a citar fuentes incuestionables.", order: 5 },
      { type: "pregunta", questionGroup: "literal", content: "¿Qué es un lapidario? ¿Por qué Alfonso X manda traducirlo? ¿Para qué sirven las piedras según el texto?", order: 6 },
      { type: "pregunta", questionGroup: "interpretativo", content: "El texto mezcla saberes de la naturaleza con creencias mágicas. ¿Dónde está la frontera entre «ciencia» y «magia» en la Edad Media? ¿Existe esa frontera?", order: 7 },
      { type: "pregunta", questionGroup: "valorativo", content: "Alfonso X quiere que «todos los que leyessen» puedan entender la obra. ¿Qué modelo de conocimiento implica esto? ¿Conoces algún proyecto cultural moderno con el mismo espíritu?", order: 8 },
      { type: "intertextualidad", content: "La tradición del lapidario viene de Plinio el Viejo (Historia Natural, siglo I d.C.) y de fuentes árabes. En la modernidad, la idea de las piedras con poderes pervive en la litoterapia, lo que evidencia la longevidad de estas creencias.", order: 9 },
    ]);
    console.log("✓ Fragmento: Prólogo del Lapidario");
  } else { console.log("  (ya existe) prologo-lapidario"); }

  console.log("\n✅ Parte 3 completada.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
