/** Parte 2: Villancicos medievales — nuevo autor anónimo + 4 fragmentos */
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
  // ── Autor ─────────────────────────────────────────────────────────────────
  let author = await prisma.author.findUnique({ where: { slug: "anonimo-cancionero-medieval" } });
  if (!author) {
    author = await prisma.author.create({
      data: {
        slug: "anonimo-cancionero-medieval",
        name: "Anónimo (Cancionero medieval)",
        bio: "Los villancicos medievales son composiciones anónimas transmitidas en los cancioneros de los siglos XIV y XV. Breves poemas de tradición popular, expresan las emociones más directas del amor cortés y la lírica de alba.",
        portraitUrl: null,
      },
    });
    console.log("✓ Autor creado: Anónimo (Cancionero medieval)");
  } else {
    console.log("  (ya existe) Anónimo (Cancionero medieval)");
  }

  // ── Obra ──────────────────────────────────────────────────────────────────
  let work = await prisma.work.findFirst({ where: { authorId: author.id, title: "Villancicos medievales" } });
  if (!work) {
    work = await prisma.work.create({
      data: {
        slug: "villancicos-medievales",
        title: "Villancicos medievales",
        authorId: author.id,
        year: 1400,
        genre: "lírica",
        synopsis: "Selección de villancicos anónimos de los cancioneros medievales castellanos (siglos XIV-XV). Poemas breves de tradición popular que combinan la voz lírica femenina con técnicas del paralelismo y el estribillo, antecedente directo del Renacimiento.",
      },
    });
    console.log("✓ Obra creada: Villancicos medievales");
  } else {
    console.log("  (ya existe) Villancicos medievales");
  }

  const maxOrder = await prisma.fragment.aggregate({ where: { workId: work.id }, _max: { order: true } });
  let fragOrder = (maxOrder._max.order ?? 0) + 1;

  // ── Fragmento 1: Ya cantan los gallos ─────────────────────────────────────
  const text1 = `Ya cantan los gallos,
buen amor, y vete:
cata que amanece.

Ya cantan los gallos
y el día se viene:
el del verde manto,
los rayos al frente.
Buen amor, y vete:
cata que amanece.`;

  if (!await prisma.fragment.findUnique({ where: { slug: "ya-cantan-los-gallos" } })) {
    const f = await prisma.fragment.create({
      data: { workId: work.id, slug: "ya-cantan-los-gallos", title: "Ya cantan los gallos", headline: "Cata que amanece", location: "Villancico medieval (cancionero s. XV)", text: text1, order: fragOrder++, status: "published" },
    });
    await addAnnotations(f.id, text1, [
      { type: "glosa", anchor: "Cata", content: "«Cata»: mira, fíjate; forma imperativa de «catar» (observar), hoy desaparecida del castellano estándar pero aún viva en algunas zonas rurales." },
      { type: "glosa", anchor: "el del verde manto", content: "Perífrasis que alude a la Aurora o al día personificado: su «manto verde» evoca la naturaleza que despierta al amanecer." },
      { type: "contexto", content: "Villancico de alba: uno de los géneros más antiguos y universales de la lírica. La voz (femenina o masculina) advierte al amante que debe marcharse antes de que la luz los descubra. Hay paralelos en la Provenza (albas), Alemania (Tagelieder) y toda la lírica medieval europea.", order: 3 },
      { type: "figura", category: "tropo", content: "Sinécdoque auditiva: «Ya cantan los gallos» es el sonido que sustituye a la idea del alba. En la Edad Media, el canto del gallo era la señal horaria que marcaba el amanecer, de ahí su presencia en todas las canciones de alba.", order: 4 },
      { type: "figura", category: "sonoro", content: "Estribillo con vuelta al principio: los dos primeros versos se repiten como refrain tras la estrofa central, creando la estructura circular del villancico clásico (cabeza – mudanza – vuelta).", order: 5 },
      { type: "pregunta", questionGroup: "literal", content: "¿Quién habla en el villancico? ¿A quién se dirige? ¿Qué le pide?", order: 6 },
      { type: "pregunta", questionGroup: "interpretativo", content: "El alba funciona a la vez como señal de peligro y como imagen de belleza. ¿Cómo conviven estos dos significados en el poema?", order: 7 },
      { type: "pregunta", questionGroup: "valorativo", content: "Las canciones de alba (Provenza), los Tagelieder (Alemania) y este villancico comparten la misma situación. ¿Qué nos dice esta universalidad sobre la experiencia del amor?", order: 8 },
      { type: "intertextualidad", content: "El villancico de alba conecta con las jarchas («Non dormiray, mamma») y las canciones provenzales. En la modernidad, Lope de Vega usará el motivo del alba con ironía en sus comedias.", order: 9 },
    ]);
    console.log("✓ Fragmento: Ya cantan los gallos");
  } else { console.log("  (ya existe) ya-cantan-los-gallos"); }

  // ── Fragmento 2: Al alba venid ────────────────────────────────────────────
  const text2 = `Al alba venid,
buen amigo, al alba venid.

Amigo el que yo más quería,
venid a la luz del día.
Amigo el que yo más amaba,
venid a la luz del alba.
Venid a la luz del día,
no traigáis compañía.
Venid a la luz del alba,
no traigáis gran compaña.`;

  if (!await prisma.fragment.findUnique({ where: { slug: "al-alba-venid" } })) {
    const f = await prisma.fragment.create({
      data: { workId: work.id, slug: "al-alba-venid", title: "Al alba venid", headline: "Buen amigo, al alba venid", location: "Villancico medieval (cancionero s. XV)", text: text2, order: fragOrder++, status: "published" },
    });
    await addAnnotations(f.id, text2, [
      { type: "glosa", anchor: "compaña", content: "«Compaña» / «compañía»: compañía, acompañantes. La alternancia entre las dos formas es un recurso de variación sinonímica típico del paralelismo medieval." },
      { type: "glosa", anchor: "buen amigo", content: "«Amigo» en la lírica medieval tiene valor específico: designa al amante, no simplemente al amigo. Equivale al «amado» o «querido» de la tradición gallegoportuguesa." },
      { type: "contexto", content: "A diferencia del villancico de alba que pide al amante que se vaya, este es un villancico de llamada al amante: la voz femenina lo convoca al alba, pero en secreto («no traigáis compañía»). La discreción amorosa es obligatoria en el amor cortés.", order: 3 },
      { type: "figura", category: "sonoro", content: "Paralelismo bimembre perfecto: cada estrofa tiene dos versos paralelos donde se alternan «día»/«alba» y «compañía»/«compaña». El paralelismo no es mero ornamento, sino que recrea la tensión entre el deseo (la llamada) y el miedo (la discreción).", order: 4 },
      { type: "figura", category: "tropo", content: "Apóstrofe: la voz poética se dirige directamente al amado ausente («venid»). La orden gramatical convierte al poema en un acto performativo: la palabra poética convoca al amado.", order: 5 },
      { type: "pregunta", questionGroup: "literal", content: "¿Qué pide la voz poética? ¿A qué hora debe llegar el amado? ¿Qué condición le impone?", order: 6 },
      { type: "pregunta", questionGroup: "interpretativo", content: "¿Por qué la secrecía («no traigáis compañía») es tan importante? ¿Qué nos dice sobre los valores sociales de la época?", order: 7 },
      { type: "pregunta", questionGroup: "valorativo", content: "Este villancico tiene el mismo tono que las jarchas, pero está escrito siglos después. ¿Qué elementos han cambiado y cuáles han permanecido en la lírica amorosa medieval?", order: 8 },
      { type: "intertextualidad", content: "El villancico fue adoptado por poetas cultos del siglo XVI (Gil Vicente, Lope de Vega) que retomaban la tradición popular con técnica refinada. Esta tensión entre lo culto y lo popular es característica del Renacimiento español.", order: 9 },
    ]);
    console.log("✓ Fragmento: Al alba venid");
  } else { console.log("  (ya existe) al-alba-venid"); }

  // ── Fragmento 3: En Ávila, mis ojos ──────────────────────────────────────
  const text3 = `En Ávila, mis ojos,
dentro en Ávila.
En Ávila del Río
mataron a mi amigo,
dentro en Ávila.`;

  if (!await prisma.fragment.findUnique({ where: { slug: "en-avila-mis-ojos" } })) {
    const f = await prisma.fragment.create({
      data: { workId: work.id, slug: "en-avila-mis-ojos", title: "En Ávila, mis ojos", headline: "Mataron a mi amigo", location: "Villancico medieval (cancionero s. XV)", text: text3, order: fragOrder++, status: "published" },
    });
    await addAnnotations(f.id, text3, [
      { type: "glosa", anchor: "Ávila del Río", content: "Especificación geográfica que sitúa el suceso en Ávila de los Caballeros, junto al río Adaja. El topónimo concreto da verosimilitud histórica al lamento.", order: 1 },
      { type: "glosa", anchor: "mis ojos", content: "Vocativo afectivo: «mis ojos» como apelativo cariñoso a un interlocutor imaginado (quizás la madre, quizás el lector). En la poesía medieval este vocativo expresa máxima intensidad emocional.", order: 2 },
      { type: "contexto", content: "La brevedad extrema de este villancico (cinco versos) convierte la muerte violenta del amado en un hecho escueto, sin adjetivos ni explicación. La contención es el luto: lo que el poema calla pesa más que lo que dice.", order: 3 },
      { type: "figura", category: "sonoro", content: "Anadiplosis y repetición: «dentro en Ávila» aparece al principio y al final, cerrando el poema en círculo. La localización repetida convierte a Ávila en el espacio del duelo.", order: 4 },
      { type: "figura", category: "tropo", content: "Eufemismo implícito: el poema no dice «murió» sino «mataron», revelando violencia exterior. La ausencia de causa hace más inquietante el lamento.", order: 5 },
      { type: "pregunta", questionGroup: "literal", content: "¿Qué ha ocurrido en Ávila? ¿Quién habla? ¿A quién se dirige?", order: 6 },
      { type: "pregunta", questionGroup: "interpretativo", content: "El villancico tiene solo cinco versos. ¿Cómo consigue esa brevedad extrema transmitir el peso del duelo? ¿Qué queda sin decir?", order: 7 },
      { type: "pregunta", questionGroup: "valorativo", content: "Compara este villancico con «Coplas por la muerte de su padre» de Manrique: ¿qué diferencias hay en el modo de tratar la muerte?", order: 8 },
      { type: "intertextualidad", content: "La condensación de la muerte en un villancico brevísimo tiene paralelos en el romancero fronterizo. García Lorca recogió esta tradición en su «Romance sonámbulo» y en el «Llanto por Ignacio Sánchez Mejías».", order: 9 },
    ]);
    console.log("✓ Fragmento: En Ávila, mis ojos");
  } else { console.log("  (ya existe) en-avila-mis-ojos"); }

  // ── Fragmento 4: Gritos daba la morenita ─────────────────────────────────
  const text4 = `Gritos daba la morenita
so el olivar,
que las ramas hace temblar.

Gritos daba la morenita,
llorando a su amigo:
—¡Ay, que me le han muerto
los moros del camino!

So el olivar,
que las ramas hace temblar.`;

  if (!await prisma.fragment.findUnique({ where: { slug: "gritos-daba-la-morenita" } })) {
    const f = await prisma.fragment.create({
      data: { workId: work.id, slug: "gritos-daba-la-morenita", title: "Gritos daba la morenita", headline: "So el olivar, que las ramas hace temblar", location: "Villancico medieval (cancionero s. XV)", text: text4, order: fragOrder++, status: "published" },
    });
    await addAnnotations(f.id, text4, [
      { type: "glosa", anchor: "So el olivar", content: "«So»: bajo, debajo de; preposición arcaica hoy perdida en castellano estándar. El olivar es el espacio simbólico del dolor: ámbito rural y mediterráneo que connota muerte y labranza.", order: 1 },
      { type: "glosa", anchor: "morenita", content: "El diminutivo afectivo «morenita» (morena) designa a una muchacha de piel oscura, probablemente de origen morisco. El término no tiene connotación despectiva; al contrario, la «morena» es figura recurrente de la belleza popular en la lírica española (también en el Cantar de los Cantares).", order: 2 },
      { type: "contexto", content: "Villancico fronterizo: el espacio de la frontera castellano-mora da lugar a toda una poesía de contacto. La muerte del amado a manos de «los moros del camino» sitúa el poema en el mundo real de la Reconquista, donde el amor y la guerra coexisten.", order: 3 },
      { type: "figura", category: "tropo", content: "Personificación e hipérbole: «las ramas hace temblar» atribuye a los gritos de la muchacha el poder de sacudir la naturaleza. El dolor humano se proyecta en el mundo vegetal.", order: 4 },
      { type: "figura", category: "sonoro", content: "Estilo directo súbito: el lamento se transforma en cita directa («¡Ay, que me le han muerto...!»), generando un efecto de inmediatez dramática. El poema pasa del narrador externo a la voz de la muchacha sin transición.", order: 5 },
      { type: "pregunta", questionGroup: "literal", content: "¿Quién es la morenita? ¿Qué le ha ocurrido a su amigo? ¿Dónde ocurre la escena?", order: 6 },
      { type: "pregunta", questionGroup: "interpretativo", content: "El olivar aparece como escenario. ¿Qué connotaciones tiene este espacio en la poesía española? ¿Por qué no ocurre la escena en la ciudad?", order: 7 },
      { type: "pregunta", questionGroup: "valorativo", content: "La «morenita» aparece también en el Cantar de los Cantares bíblico («Soy morena pero hermosa»). ¿Qué tradición cultural une a ambas figuras? ¿Cómo transforma este villancico esa tradición?", order: 8 },
      { type: "intertextualidad", content: "García Lorca retomó la figura de la morenita en el «Romance de la pena negra» y en los poemas del Cante Jondo. El olivar como espacio del duelo vuelve en «La casada infiel» y en el «Llanto».", order: 9 },
    ]);
    console.log("✓ Fragmento: Gritos daba la morenita");
  } else { console.log("  (ya existe) gritos-daba-la-morenita"); }

  console.log("\n✅ Parte 2 completada.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
