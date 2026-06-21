/** Parte 4: Amadís de Gaula + Sendebar */
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
  // ────────────────────────────────────────────────────────────────────────────
  // AMADÍS DE GAULA
  // ────────────────────────────────────────────────────────────────────────────
  let amadisAuthor = await prisma.author.findUnique({ where: { slug: "garci-rodriguez-de-montalvo" } });
  if (!amadisAuthor) {
    amadisAuthor = await prisma.author.create({
      data: {
        slug: "garci-rodriguez-de-montalvo",
        name: "Garci Rodríguez de Montalvo",
        birthYear: 1450,
        deathYear: 1504,
        country: "Castilla",
        era: "Medieval",
        bio: "Regidor de Medina del Campo, Garci Rodríguez de Montalvo refundió y amplió una versión anterior del Amadís en cuatro libros (publicado en 1508). Añadió el libro cuarto y continuó la saga con Las Sergas de Esplandián. Su versión del Amadís se convirtió en el libro de caballerías más influyente de Europa.",
        portraitUrl: null,
      },
    });
    console.log("✓ Autor creado: Garci Rodríguez de Montalvo");
  } else {
    console.log("  (ya existe) Garci Rodríguez de Montalvo");
  }

  let amadisWork = await prisma.work.findFirst({ where: { authorId: amadisAuthor.id, slug: "amadis-de-gaula" } });
  if (!amadisWork) {
    amadisWork = await prisma.work.create({
      data: {
        slug: "amadis-de-gaula",
        title: "Amadís de Gaula",
        authorId: amadisAuthor.id,
        year: 1508,
        era: "Medieval",
        genre: "novela de caballerías",
        synopsis: "El más influyente libro de caballerías hispánico. Narra las aventuras del caballero Amadís, hijo secreto del rey de Gaula, en su búsqueda del amor de Oriana y su lucha contra gigantes y encantadores. Publicado en 1508, fue lectura obligada en la Europa del siglo XVI y blanco central de la crítica de Cervantes en el Quijote.",
      },
    });
    console.log("✓ Obra creada: Amadís de Gaula");
  } else {
    console.log("  (ya existe) Amadís de Gaula");
  }

  const textEndriago = `En aquella isla Encantada, entre unas peñas muy altas, que a manera de castillo la cercaban, falló a un gran endriago, el más feo y espantoso animal que nunca fue visto. Era su cuerpo de hombre, los pies como de gavilán, las manos como de oso, y la cola y la cabeza como de serpiente, y en el vientre unas escamas como de lagarto. Tenía tres filas de dientes, los ojos como brasas de fuego, y lanzaba por la boca una llama de fuego tan grande como la que sale de una fragua.

Amadís se santiguó y encomendóse a Dios y a su señora Oriana. Y sin más esperar, arremetió al endriago con su espada en la mano, hiriendo por do podía, aunque el monstruo le daba tan grandes golpes que lo hacía caer muchas veces de rodillas.

Mas el buen caballero no desmayó, que el amor de su señora le doblaba las fuerzas, y peleó tanto que al fin venció al endriago, aunque quedó él tan malherido que por poco no perdió la vida.`;

  if (!await prisma.fragment.findUnique({ where: { slug: "el-endriago-amadis" } })) {
    const f = await prisma.fragment.create({
      data: { workId: amadisWork.id, slug: "el-endriago-amadis", title: "El endriago", headline: "El más feo y espantoso animal que nunca fue visto", location: "Novela de caballerías", text: textEndriago, order: 1, status: "published" },
    });
    await addAnnotations(f.id, textEndriago, [
      { type: "glosa", anchor: "endriago", content: "«Endriago»: monstruo fantástico de los libros de caballerías; mezcla de rasgos de varios animales reales. El término deriva del latín «hydra» (hidra) a través del árabe.", order: 1 },
      { type: "glosa", anchor: "gavilán", content: "«Gavilán»: ave rapaz de vuelo rápido (Accipiter nisus). Los pies de gavilán del endriago evocan garras afiladas y velocidad mortífera.", order: 2 },
      { type: "glosa", anchor: "fragua", content: "«Fragua»: horno de herrero donde se funde el metal. El fuego de la fragua es imagen hiperbólica de un calor destructivo y controlado por el hombre, que aquí se le atribuye al monstruo.", order: 3 },
      { type: "contexto", content: "El endriago es el monstruo más famoso de los libros de caballerías hispánicos. Su derrota por Amadís marca el clímax heroico de la novela. Los libros de caballerías mezclan aventuras cortesanas con combates fantásticos, siguiendo el modelo del ciclo artúrico inglés y el Lancelot francés.", order: 4 },
      { type: "figura", category: "tropo", content: "Écfrasis monstruosa: la descripción del endriago es una acumulación de partes de animales reales (gavilán, oso, serpiente, lagarto) que produce un efecto de horror y extrañeza. Esta técnica de la «bestia compuesta» viene de los bestiarios medievales.", order: 5 },
      { type: "figura", category: "tropo", content: "Amor como fuerza sobrenatural: «el amor de su señora le doblaba las fuerzas». En la ideología caballeresca, el amor cortés no es obstáculo sino motor de la valentía. Amadís pelea mejor porque ama.", order: 6 },
      { type: "pregunta", questionGroup: "literal", content: "¿Cómo es el endriago físicamente? ¿Qué hace Amadís antes de atacarlo? ¿Cómo consigue vencerle?", order: 7 },
      { type: "pregunta", questionGroup: "interpretativo", content: "El endriago mezcla partes de animales reales. ¿Qué efecto produce esta combinación? ¿Por qué es más aterrador que un animal real?", order: 8 },
      { type: "pregunta", questionGroup: "valorativo", content: "Cervantes en el Quijote ridiculizó los libros de caballerías. ¿Qué elementos de este fragmento crees que son los que Cervantes parodia en Don Quijote?", order: 9 },
      { type: "intertextualidad", content: "El endriago tiene su origen en los bestiarios medievales y en la tradición de los monstruos greco-latinos (la Hidra, el Minotauro). En el Quijote, Cervantes recoge y desmonta esta convención: el «gigante» resulta ser un molino de viento.", order: 10 },
    ]);
    console.log("✓ Fragmento: El endriago (Amadís)");
  } else { console.log("  (ya existe) el-endriago-amadis"); }

  // ────────────────────────────────────────────────────────────────────────────
  // SENDEBAR
  // ────────────────────────────────────────────────────────────────────────────
  // El Sendebar es obra anónima; usamos el autor Anónimo (Cantar de Mio Cid)
  const anonAuthor = await prisma.author.findUnique({ where: { slug: "anonimo-cantar-de-mio-cid" } });
  if (!anonAuthor) throw new Error("No se encontró autor Anónimo");

  let sendWork = await prisma.work.findFirst({ where: { slug: "sendebar" } });
  if (!sendWork) {
    sendWork = await prisma.work.create({
      data: {
        slug: "sendebar",
        title: "Libro de los engaños (Sendebar)",
        authorId: anonAuthor.id,
        year: 1253,
        era: "Medieval",
        genre: "colección de cuentos",
        synopsis: "Traducción castellana (1253) de una colección de cuentos de origen indio (el Sindbad de los Siete Sabios) realizada por mandato del infante don Fadrique, hermano de Alfonso X. Relata cómo un príncipe, acusado falsamente, logra salvarse gracias a los cuentos que narran los sabios para ganar tiempo.",
      },
    });
    console.log("✓ Obra creada: Sendebar");
  } else {
    console.log("  (ya existe) Sendebar");
  }

  const textSend = `Este es el libro de los engaños et assayamientos de las mujeres. Fízolo trasladar de arábigo en castellano el Infante don Fadrique, fijo del muy noble rey don Fernando el Sancto et hermano del rey don Alfonso.

Et el cuento es este: que un rey de Indias et de las Islas de la Mar había un fijo único que mandó criar et doctrinar a un sabio que decían Sindibad. Et este sabio crió al mozo con gran diligencia et ensenñole todas las siete artes liberales et la filosofía et la astrología et todos los saberes que él había.

Et cuando el infante fue ya mancebo et de buen entendimiento, cató el maestro en su nacencia et fallóque si en los primeros siete días después que hablase con su padre morería sin falta ninguna.

Por ende mandóle et rogóle que por cosa que le dijesen non fablase con su padre aquellos siete días.`;

  if (!await prisma.fragment.findUnique({ where: { slug: "prologo-sendebar" } })) {
    const f = await prisma.fragment.create({
      data: { workId: sendWork.id, slug: "prologo-sendebar", title: "Prólogo del Sendebar", headline: "El libro de los engaños et assayamientos de las mujeres", location: "Colección de cuentos medieval", text: textSend, order: 1, status: "published" },
    });
    await addAnnotations(f.id, textSend, [
      { type: "glosa", anchor: "assayamientos", content: "«Assayamientos»: engaños, trampas, artimañas; del árabe, que designa el ingenio malicioso. El título ya revela la misoginia del marco: las mujeres como fuente de peligro para el protagonista.", order: 1 },
      { type: "glosa", anchor: "siete artes liberales", content: "Las siete artes liberales medievales: el trivium (gramática, retórica, dialéctica) y el cuadrivium (aritmética, geometría, música, astronomía). Constituían la formación intelectual completa de la época.", order: 2 },
      { type: "glosa", anchor: "nacencia", content: "«Nacencia»: horóscopo natal; el cálculo astrológico en el momento del nacimiento. El maestro Sindibad usa la astrología para conocer el destino del príncipe.", order: 3 },
      { type: "contexto", content: "El Sendebar pertenece a la tradición del «marco narrativo»: una historia que encuadra otras historias. El príncipe debe callar siete días; cada día, sus acusadoras narran un cuento para que el rey lo condene, y los sabios narran otro cuento para salvarlo. El tiempo del cuento es el tiempo de la supervivencia.", order: 4 },
      { type: "figura", category: "tropo", content: "El secreto como detonador narrativo: el maestro sabe algo que no puede decirse. Esta estructura de «saber prohibido» es el motor de toda la narración. El silencio del príncipe genera la tensión dramática.", order: 5 },
      { type: "pregunta", questionGroup: "literal", content: "¿Quién mandó traducir el Sendebar? ¿De qué lengua se tradujo? ¿Cuál es el peligro que amenaza al príncipe?", order: 6 },
      { type: "pregunta", questionGroup: "interpretativo", content: "El maestro sabe por la astrología que el príncipe morirá si habla. ¿Qué papel juega el destino en la concepción medieval del mundo? ¿Puede un hombre escapar de su horóscopo?", order: 7 },
      { type: "pregunta", questionGroup: "valorativo", content: "El título menciona «los engaños de las mujeres». ¿Es esta una visión justa de los personajes femeninos? ¿Conoces otras obras medievales con la misma perspectiva?", order: 8 },
      { type: "intertextualidad", content: "El Sendebar (siglo XIII) tiene la misma estructura de cuentos anidados que las Mil y una noches y el Decamerón de Boccaccio (siglo XIV): una situación de peligro obliga a narrar. Esta forma narrativa influyó en el Conde Lucanor y en la novela europea.", order: 9 },
    ]);
    console.log("✓ Fragmento: Prólogo del Sendebar");
  } else { console.log("  (ya existe) prologo-sendebar"); }

  console.log("\n✅ Parte 4 completada.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
