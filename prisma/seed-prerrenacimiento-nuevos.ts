import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

function anchor(text: string, needle: string) {
  const i = text.indexOf(needle);
  if (i === -1) throw new Error(`Anchor not found: "${needle}"`);
  return { anchorStart: i, anchorEnd: i + needle.length };
}

async function upsertAuthor(data: Parameters<typeof prisma.author.create>[0]["data"]) {
  return prisma.author.upsert({
    where: { slug: data.slug as string },
    create: data,
    update: data,
  });
}

async function upsertWork(data: Parameters<typeof prisma.work.create>[0]["data"]) {
  return prisma.work.upsert({
    where: { slug: data.slug as string },
    create: data,
    update: data,
  });
}

async function upsertFragment(data: Parameters<typeof prisma.fragment.create>[0]["data"]) {
  return prisma.fragment.upsert({
    where: { slug: data.slug as string },
    create: data,
    update: data,
  });
}

async function upsertAnnotation(fragmentId: string, type: string, order: number, rest: object) {
  const existing = await prisma.annotation.findFirst({ where: { fragmentId, type, order } });
  if (existing) {
    return prisma.annotation.update({ where: { id: existing.id }, data: { fragmentId, type, order, ...rest } });
  }
  return prisma.annotation.create({ data: { fragmentId, type, order, ...rest } as never });
}

async function main() {

  // ══════════════════════════════════════════════════════════════════════════
  // 1. JUAN DE MENA (1411-1456)
  // ══════════════════════════════════════════════════════════════════════════
  const mena = await upsertAuthor({
    slug: "juan-de-mena",
    name: "Juan de Mena",
    birthYear: 1411,
    deathYear: 1456,
    country: "Castilla",
    era: "Prerrenacimiento",
    bio: "Poeta cordobés, secretario de cartas latinas del rey Juan II y figura central del humanismo castellano del siglo XV. Su Laberinto de Fortuna (1444) es el gran poema alegórico del Prerrenacimiento: en trescientas estrofas de arte mayor imita a Dante y a Virgilio para presentar una visión providencialista de la historia de Castilla. Influyó en toda la poesía posterior del siglo XV.",
    portraitUrl: "/images/authors/juan-de-mena.jpg",
  });

  const laberinto = await upsertWork({
    slug: "laberinto-de-fortuna",
    title: "Laberinto de Fortuna",
    year: 1444,
    era: "Prerrenacimiento",
    genre: "poema alegórico",
    synopsis: "Poema alegórico en trescientas coplas de arte mayor (12 sílabas). El narrador, guiado por la diosa Providencia, contempla la rueda de Fortuna y los tres círculos del tiempo: pasado, presente y futuro. En el círculo del presente aparecen los grandes personajes de la Castilla coetánea. Es el primer gran poema épico culto en castellano, al modo de Dante y Virgilio.",
    authorId: mena.id,
  });

  const menaFrag1Text = `Tus casos falaces, Fortuna, cantamos,
estados de gentes que giras e trocas;
tus grandes discordias, tus firmezas pocas,
y los que en tu rueda quejosos hallamos.
Fasta que al tiempo de agora lleguemos
pasando por Francia e las otras naciones,
en metro romanzado por diversas razones,
contigo, Fortuna, las partes partamos.

Al muy prepotente don Juan el segundo,
aquel con quien Júpiter tuvo tal celo
que tanta de parte le fizo del mundo
cuanta a sí mesmo se fizo del cielo:
al gran rey de España, al César novelo,
al que con Fortuna es bien fortunado,
aquel en quien caben virtud e reinado,
a él la rodilla por tierra me velo.`;

  const menaFrag1 = await upsertFragment({
    slug: "laberinto-invocacion-fortuna",
    title: "Invocación a la Fortuna",
    location: "Coplas I-II",
    headline: "Tus casos falaces, Fortuna, cantamos",
    text: menaFrag1Text,
    order: 1,
    status: "published",
    workId: laberinto.id,
    artworkImageUrl: "/images/artworks/tres-riches-heures-enero.jpg",
    artworkTitle: "Enero (Las muy ricas horas del duque de Berry)",
    artworkAuthor: "Hermanos Limbourg",
    artworkCaption: "Miniatura francesa, c. 1412. La opulencia cortesana y la rueda del tiempo que todo lo cambia, temas centrales del Laberinto de Fortuna.",
  });

  await upsertAnnotation(menaFrag1.id, "glosa", 1, {
    ...anchor(menaFrag1Text, "giras e trocas"),
    content: "**Girar** y **trocar**: Mena sintetiza en dos verbos la acción esencial de Fortuna, que hace girar su rueda y cambia los estados de los hombres. La aliteración acentúa el movimiento imparable.",
  });
  await upsertAnnotation(menaFrag1.id, "contexto", 2, {
    ...anchor(menaFrag1Text, "en metro romanzado"),
    content: "Mena escribe en **coplas de arte mayor** —doce sílabas con cesura en la sexta—, metro que imita el hexámetro latino. Con esta declaración programática sitúa su obra en la tradición épica culta de Virgilio y Dante, frente a la poesía popular de los romances.",
  });
  await upsertAnnotation(menaFrag1.id, "figura", 3, {
    ...anchor(menaFrag1Text, "tus firmezas pocas"),
    content: "**Ironía y oxímoron**: «firmezas pocas» es una contradicción en sí misma —la firmeza que es escasa no es firmeza—. Mena acusa a Fortuna de inconstancia con el propio lenguaje de la constancia.",
  });
  await upsertAnnotation(menaFrag1.id, "pregunta", 4, {
    ...anchor(menaFrag1Text, "Al muy prepotente"),
    content: "¿Por qué Mena dedica el poema a Juan II? ¿Qué relación hay entre la alabanza al rey —«aquel en quien caben virtud e reinado»— y la crítica a la Fortuna que acabamos de leer?",
  });
  await upsertAnnotation(menaFrag1.id, "intertextualidad", 5, {
    ...anchor(menaFrag1Text, "contigo, Fortuna, las partes partamos"),
    content: "Mena retoma el tema de la Fortuna de **Boecio** (*Consolación de la Filosofía*, s. VI) y de **Dante** (*Divina Comedia*, s. XIV). La rueda de Fortuna es un topos medieval: lo que sube baja, lo que ha caído puede ascender. Cervantes lo recoge irónicamente en el *Quijote* cuando don Quijote consuela a Sancho tras sus caídas.",
    externalCitation: `Boecio, *Consolación de la Filosofía* (524): «Esto es mi arte, esto no ceso de hacer. Hago girar la rueda que va girando. Me complace ver cómo lo alto cae y lo bajo sube.»`,
  });
  console.log("✓ Juan de Mena: frag 1");

  const menaFrag2Text = `E vide en el medio de aqueste edificio
una mujer rica, vestida e ornada,
en trono real, de estado e servicio
a la magestad real condecada:
e la su mano derecha en un palo
ponía, teniendo las tierras e reynos;
las almas de aquellos que son más agenos
sus bienes tornava en contrario e en malo.

E vide tres ruedas: la una andava
de gentes pasadas, que ya no vivían;
la otra de gentes que entonces vivían;
la otra de gentes que aún no llegavan.
En la primera, puestos andavan
los que ya murieron en este siglo nuestro;
en la segunda, que es el tiempo diestro,
los vivos que en este presente reinavan.`;

  const menaFrag2 = await upsertFragment({
    slug: "laberinto-tres-circulos-tiempo",
    title: "Los tres círculos del tiempo",
    location: "Coplas XXIII-XXIV",
    headline: "Una mujer rica, vestida e ornada, en trono real",
    text: menaFrag2Text,
    order: 2,
    status: "published",
    workId: laberinto.id,
    artworkImageUrl: "/images/artworks/memling-juicio-final.jpg",
    artworkTitle: "El Juicio Final (tríptico de Danzig)",
    artworkAuthor: "Hans Memling",
    artworkCaption: "c. 1467-1471. La visión de los muertos, los vivos y los que han de venir que Mena contempla en los tres círculos del tiempo tiene un paralelo visual en las grandes composiciones del Juicio Final medievales.",
  });

  await upsertAnnotation(menaFrag2.id, "glosa", 1, {
    ...anchor(menaFrag2Text, "la su mano derecha en un palo"),
    content: "La Fortuna sostiene un báculo o cetro en la mano derecha, simbolizando el poder que ejerce sobre reinos y vidas. El «palo» es metonimia del bastón de mando real: Fortuna gobierna como un monarca.",
  });
  await upsertAnnotation(menaFrag2.id, "contexto", 2, {
    ...anchor(menaFrag2Text, "tres ruedas"),
    content: "Las **tres ruedas** del tiempo (pasado, presente, futuro) son la estructura central del poema. La Providencia muestra al narrador quiénes han vivido, quiénes viven y quiénes vendrán, creando un gran fresco histórico de la Castilla del siglo XV. Este esquema imita los *cantici* de Dante.",
  });
  await upsertAnnotation(menaFrag2.id, "figura", 3, {
    ...anchor(menaFrag2Text, "las almas de aquellos que son más agenos\nsus bienes tornava en contrario e en malo"),
    content: "**Personificación y paradoja**: la Fortuna actúa como una reina injusta que convierte los bienes de los más ajenos a sus caprichos en males. La «vuelta» de los bienes en «contrario» reproduce el giro de la rueda.",
  });
  await upsertAnnotation(menaFrag2.id, "pregunta", 4, {
    ...anchor(menaFrag2Text, "los que ya murieron"),
    content: "¿Qué tipo de personas imaginas que Mena coloca en el círculo del pasado? ¿Por qué es importante para un poeta del siglo XV tratar a los muertos como si todavía pudieran enseñarnos algo?",
  });
  await upsertAnnotation(menaFrag2.id, "intertextualidad", 5, {
    ...anchor(menaFrag2Text, "los que ya murieron"),
    content: "La visión de los muertos y los vivos en torno a una figura alegórica central recuerda el **Libro de Buen Amor** de Juan Ruiz. Y anticipa la estructura de los *triunfos* petrarquescos que Santillana también imitará. Jorge Manrique tomará la misma idea de los «muertos que hablan» para abrir sus Coplas.",
    externalCitation: `Jorge Manrique, *Coplas* (1476): «Recuerde el alma dormida, / avive el seso e despierte / contemplando / cómo se pasa la vida, / cómo se viene la muerte / tan callando.»`,
  });
  console.log("✓ Juan de Mena: frag 2");

  // ══════════════════════════════════════════════════════════════════════════
  // 2. MARQUÉS DE SANTILLANA (1398-1458)
  // ══════════════════════════════════════════════════════════════════════════
  const santillana = await upsertAuthor({
    slug: "marques-de-santillana",
    name: "Íñigo López de Mendoza, marqués de Santillana",
    birthYear: 1398,
    deathYear: 1458,
    country: "Castilla",
    era: "Prerrenacimiento",
    bio: "Gran señor castellano, político, militar y poeta, el marqués de Santillana fue el primer poeta español en intentar el soneto al modo italiano (Sonetos fechos al itálico modo, c. 1438-1458). En su Proemio e carta al condestable de Portugal (1449) redactó la primera historia de la poesía en español. Sus serranillas son el mejor ejemplo del género: encuentros amorosos entre el caballero y la pastora.",
    portraitUrl: "/images/authors/marques-de-santillana.jpg",
  });

  const serranillas = await upsertWork({
    slug: "serranillas-santillana",
    title: "Serranillas",
    year: 1445,
    era: "Prerrenacimiento",
    genre: "poesía lírica",
    synopsis: "Ocho serranillas en las que el poeta, de camino por tierras de la sierra, encuentra a una muchacha pastora o vaquera y le declara su amor; la moza responde con gracia y decisión. El género mezcla la tradición cortesana (el caballero como amador) con lo popular (la pastora como personaje libre). La más famosa es la serranilla V, «La vaquera de la Finojosa».",
    authorId: santillana.id,
  });

  const santillanaFrag1Text = `Moza tan fermosa
non vi en la frontera
como una vaquera
de la Finojosa.

Faziendo la vía
del Calatraveño
a Santa María,
vencido del sueño,
por tierra fragosa
perdí la carrera,
do vi la vaquera
de la Finojosa.

En un verde prado
de rosas e flores,
guardando ganado
con otros pastores,
la vi tan graciosa
que apenas creyera
que fuese vaquera
de la Finojosa.

Non creo las rosas
de la Primavera
sean tan fermosas
nin de tal manera;
fablando sin glosa,
si antes supiera
de aquella vaquera
de la Finojosa.

Non tanto mirara
su mucha beldad,
porque me dejara
en mi libertad.
Mas dixe: «Donosa,
¿dónde sois, vaquera,
de la Finojosa?»

Bien como riendo,
dixo: «Bien vengades,
que ya bien entiendo
lo que demandades:
non es deseosa
de amar, nin lo espera,
aquesa vaquera
de la Finojosa.»`;

  const santillanaFrag1 = await upsertFragment({
    slug: "la-vaquera-de-la-finojosa",
    title: "La vaquera de la Finojosa",
    location: "Serranilla V",
    headline: "Moza tan fermosa / non vi en la frontera",
    text: santillanaFrag1Text,
    order: 1,
    status: "published",
    workId: serranillas.id,
    artworkImageUrl: "/images/artworks/bruegel-danza-campesinos.jpg",
    artworkTitle: "La danza campesina",
    artworkAuthor: "Pieter Bruegel el Viejo",
    artworkCaption: "c. 1568. La vitalidad y la gracia de las gentes del pueblo que Bruegel retrata en los Países Bajos del s. XVI tiene su paralelo literario en la pastora de Santillana: la naturaleza y la libertad femenina frente a las convenciones cortesanas.",
  });

  await upsertAnnotation(santillanaFrag1.id, "glosa", 1, {
    ...anchor(santillanaFrag1Text, "fablando sin glosa"),
    content: "«Fablando sin glosa» significa 'hablando sin rodeos, sin comentarios': el poeta confiesa que si hubiese sabido de antemano la belleza de la vaquera, ni siquiera se habría dignado a mirarla, por no perder su libertad. La glosa era en la Edad Media el comentario erudito a un texto: usarla aquí en sentido negativo es un juego culto.",
  });
  await upsertAnnotation(santillanaFrag1.id, "contexto", 2, {
    ...anchor(santillanaFrag1Text, "del Calatraveño\na Santa María"),
    content: "El poeta viaja de **Calatravilla** (zona de La Mancha) a **Santa María** (posiblemente Guadalupe, lugar de peregrinación). El camino real es el marco típico de las serranillas: el viajero noble se pierde y encuentra a la pastora. El espacio geográfico real —la sierra entre Castilla y Extremadura— le da verosimilitud al poema.",
  });
  await upsertAnnotation(santillanaFrag1.id, "figura", 3, {
    ...anchor(santillanaFrag1Text, "Non creo las rosas\nde la Primavera\nsean tan fermosas"),
    content: "**Comparación hiperbólica** (*preterición*): el poeta dice que las rosas de primavera no son tan hermosas como la pastora. El tópico de la *descriptio pulchritudinis* —la descripción de la belleza femenina por comparación con flores— viene de la poesía provenzal y es uno de los más usados en el amor cortés.",
  });
  await upsertAnnotation(santillanaFrag1.id, "pregunta", 4, {
    ...anchor(santillanaFrag1Text, "non es deseosa\nde amar, nin lo espera"),
    content: "La vaquera rechaza al caballero con gracejo y sin dramas: «no tengo ninguna gana de amar». ¿Qué dice esto de la visión que Santillana tiene de la mujer popular frente a la dama cortesana? ¿Es el rechazo un signo de dignidad o de ingenuidad?",
  });
  await upsertAnnotation(santillanaFrag1.id, "intertextualidad", 5, {
    ...anchor(santillanaFrag1Text, "guardando ganado"),
    content: "La serranilla tiene sus antecedentes en las *pastourelles* provenzales y en las **serranillas del Arcipreste de Hita** (*Libro de Buen Amor*, s. XIV). A diferencia del Arcipreste —cuyas serranas son feas y peligrosas—, la pastora de Santillana es graciosamente bella y esquiva: el género se ha refinado con la influencia cortesana italiana.",
    externalCitation: `Juan Ruiz, Arcipreste de Hita, *Libro de Buen Amor* (s. XIV): «En la cumbre de la sierra estava un tablero, / muy grande e muy fermosa e de buen talante, / la serrana muy fuerte, espantosa e ferida.»`,
  });
  console.log("✓ Santillana: frag 1");

  const santillanaFrag2Text = `Señor muy magnífico: entre las cosas que al humanal linage son comunicadas e dadas, ninguna es más honorable ni más exçelente que la çiençia e la doctrina. Pero, ¿qué cosa es la poesía sino un fingimiento de cosas útiles, cubiertas o veladas con muy fermosa cobertura, compuestas, distinguidas e escandidas por çierto cuento, peso e medida?

E non fue en poco grado loada en los gentiles tiempos, pues los poetas eran llamados vates, así como adevinos e profetas. Ca los grandes fechos de los romanos, las famosas obras de los capitanes, con el dulzor de la poesía, de memoria en memoria, de gente en gente, son venidos fasta los nuestros tiempos.

Yo, señor, en pequeña edat e en moçedat me plogue siempre leer e oír a los poetas, e aun fize algunas cosillas en este arte, aunque como quier que mi juicio non sea tal qual para ver lo que en ellas ha de loar o reprehender.`;

  const santillanaFrag2 = await upsertFragment({
    slug: "santillana-proemio-poesia",
    title: "La poesía como ciencia y fingimiento hermoso",
    location: "Proemio e carta al condestable de Portugal",
    headline: "¿Qué cosa es la poesía sino un fingimiento de cosas útiles?",
    text: santillanaFrag2Text,
    order: 2,
    status: "published",
    workId: serranillas.id,
    artworkImageUrl: "/images/artworks/simone-martini-virgilio.jpg",
    artworkTitle: "Frontispicio de las obras de Virgilio",
    artworkAuthor: "Simone Martini",
    artworkCaption: "c. 1336. Petrarca encargó a Simone Martini esta miniatura para su ejemplar de Virgilio. La imagen del poeta laureado que Petrarca recupera es la misma que Santillana reivindica para la poesía castellana en su Proemio.",
  });

  await upsertAnnotation(santillanaFrag2.id, "glosa", 1, {
    ...anchor(santillanaFrag2Text, "los poetas eran llamados vates"),
    content: "**Vates** es la palabra latina para 'poeta' en su sentido más elevado: el que adivina, el profeta. Santillana recupera esta dignidad clásica para justificar la poesía en lengua vulgar —castellano— frente a quienes la consideraban inferior al latín.",
  });
  await upsertAnnotation(santillanaFrag2.id, "contexto", 2, {
    ...anchor(santillanaFrag2Text, "çierto cuento, peso e medida"),
    content: "Santillana escribe este *Proemio* (1449) para el **condestable de Portugal** que le había pedido sus obras. Es el primer texto en español que reflexiona sistemáticamente sobre qué es la poesía y cómo debe hacerse: un manifiesto literario humanista. Divide la poesía en tres grados: sublime (Virgilio, Dante), mediocre y popular.",
  });
  await upsertAnnotation(santillanaFrag2.id, "figura", 3, {
    ...anchor(santillanaFrag2Text, "cubiertas o veladas con muy fermosa cobertura"),
    content: "**Metáfora del velo o cobertura**: Santillana define la poesía como una verdad útil envuelta en un ropaje hermoso. Esta imagen del *integumentum* —la cubierta alegórica— viene de la tradición medieval y justifica la ficción poética como vehículo de la verdad moral.",
  });
  await upsertAnnotation(santillanaFrag2.id, "pregunta", 4, {
    ...anchor(santillanaFrag2Text, "¿qué cosa es la poesía sino un fingimiento"),
    content: "Santillana define la poesía como «fingimiento de cosas útiles». ¿Crees que la poesía ha de ser útil para justificarse? ¿Qué diferencia hay entre «fingir» (en el sentido de inventar o imaginar) y mentir?",
  });
  await upsertAnnotation(santillanaFrag2.id, "intertextualidad", 5, {
    ...anchor(santillanaFrag2Text, "en pequeña edat e en moçedat me plogue siempre leer"),
    content: "Santillana menciona haber leído y escrito poesía desde niño, situándose en la tradición humanista del *studia humanitatis*. Su clasificación de la poesía (sublime, mediocre, popular) anticipa la defensa de la lengua vulgar que harán **Juan de Valdés** en el *Diálogo de la lengua* (1535) y **Nebrija** en su *Gramática* (1492).",
    externalCitation: `Juan de Valdés, *Diálogo de la lengua* (c. 1535): «La lengua castellana se habla no sólo en España, sino en muchas partes del mundo; y así yo querría que se guardase en ella una cierta pureza y perfección.»`,
  });
  console.log("✓ Santillana: frag 2");

  // ══════════════════════════════════════════════════════════════════════════
  // 3. GÓMEZ MANRIQUE (1412-1490)
  // ══════════════════════════════════════════════════════════════════════════
  const gomezManrique = await upsertAuthor({
    slug: "gomez-manrique",
    name: "Gómez Manrique",
    birthYear: 1412,
    deathYear: 1490,
    country: "Castilla",
    era: "Prerrenacimiento",
    bio: "Sobrino del Almirante Fadrique Enríquez y tío de Jorge Manrique, Gómez Manrique fue poeta, político y militar al servicio de los Reyes Católicos. Creó la sextilla de pie quebrado (la estrofa que usará su sobrino en las Coplas) y compuso la Representación del Nacimiento de Nuestro Señor (c. 1467), considerada el primer drama litúrgico en castellano. Sus coplas morales critican el mal gobierno.",
    portraitUrl: null,
  });

  const gomezWork = await upsertWork({
    slug: "obras-gomez-manrique",
    title: "Coplas y representaciones",
    year: 1467,
    era: "Prerrenacimiento",
    genre: "poesía moral y teatro",
    synopsis: "Conjunto de la obra poética y teatral de Gómez Manrique. Incluye poemas morales y satíricos contra el mal gobierno, poemas de circunstancias y la Representación del Nacimiento de Nuestro Señor, primera obra teatral en castellano de autor conocido. Usa la sextilla de pie quebrado, estrofa que su sobrino Jorge Manrique convertirá en inmortal.",
    authorId: gomezManrique.id,
  });

  const gomezFrag1Text = `Llorad, las damas, llorad,
si Dios os dé plazer,
por que vuestra beldad
non puede defender
de la común enfermedad
que mata sin querer.

Las que sois fermosas
e de gentil gesto,
non seréis tan gloriosas
que no muráis en esto;
que las muy virtuosas
non pueden ser de esto.

El tiempo que pasó
nin torna nin tornará;
lo que fue, todo va;
lo que irá, todo pasará.
Pues, ¿qué aprovecha
esperar galardón?`;

  const gomezFrag1 = await upsertFragment({
    slug: "gomez-manrique-llorad-las-damas",
    title: "Llorad, las damas",
    location: "Planto por Garci Lasso",
    headline: "El tiempo que pasó nin torna nin tornará",
    text: gomezFrag1Text,
    order: 1,
    status: "published",
    workId: gomezWork.id,
    artworkImageUrl: "/images/artworks/chaise-dieu-danza-macabra.jpg",
    artworkTitle: "Danza macabra de la Chaise-Dieu",
    artworkAuthor: "Anónimo",
    artworkCaption: "c. 1460, abadía de La Chaise-Dieu, Francia. La danza macabra —donde Muerte lleva a nobles y pobres por igual— es la imagen visual del tema del ubi sunt que Gómez Manrique desarrolla en su poesía.",
  });

  await upsertAnnotation(gomezFrag1.id, "glosa", 1, {
    ...anchor(gomezFrag1Text, "la común enfermedad\nque mata sin querer"),
    content: "La «común enfermedad» es la muerte, cuyo único rasgo aquí es la universalidad (común a todos) y la ausencia de voluntad propia (mata sin querer). La personificación de la muerte como algo que actúa sin malicia —no elige a sus víctimas— acrecienta el efecto elegíaco.",
  });
  await upsertAnnotation(gomezFrag1.id, "contexto", 2, {
    ...anchor(gomezFrag1Text, "Llorad, las damas, llorad"),
    content: "Gómez Manrique compone este **planto** (elegía) por la muerte de Garci Lasso de la Vega. El planto era un género funerario medieval donde se convoca a los allegados del difunto a llorar. Gómez Manrique lo dirige a las damas de la corte, mezclando el lamento personal con la reflexión sobre la fugacidad de la belleza.",
  });
  await upsertAnnotation(gomezFrag1.id, "figura", 3, {
    ...anchor(gomezFrag1Text, "El tiempo que pasó\nnin torna nin tornará"),
    content: "**Anáfora y políptoton**: «pasó», «torna», «tornará», «fue», «va», «irá», «pasará» —la acumulación de verbos de movimiento en pasado y futuro crea un ritmo inexorable que imita el paso del tiempo. Esta condensación verbal es la técnica que heredará y perfeccionará Jorge Manrique en las Coplas.",
  });
  await upsertAnnotation(gomezFrag1.id, "pregunta", 4, {
    ...anchor(gomezFrag1Text, "non seréis tan gloriosas\nque no muráis en esto"),
    content: "El poeta dice que ni las más virtuosas escaparán a la muerte. ¿Qué diferencia hay entre el consuelo que ofrece Gómez Manrique —ninguno, la muerte es inevitable— y el que encontramos en las Coplas de su sobrino Jorge, donde la vida de la fama puede vencer a la muerte?",
  });
  await upsertAnnotation(gomezFrag1.id, "intertextualidad", 5, {
    ...anchor(gomezFrag1Text, "¿qué aprovecha\nesperar galardón"),
    content: "Gómez Manrique usa aquí la **sextilla de pie quebrado** —estrofa de 8-8-4-8-8-4 sílabas— que su sobrino **Jorge Manrique** convertirá en inmortal en las *Coplas a la muerte de su padre* (1476). El «¿qué aprovecha?» de Gómez es el antecedente directo de los «¿qué se fizo?» y «¿qué se hicieron?» del sobrino.",
    externalCitation: `Jorge Manrique, *Coplas* (1476): «¿Qué se fizo el rey don Johan? / Los Infantes de Aragón, / ¿qué se ficieron? / ¿Qué fue de tanto galán, / qué de tanta invinción / que truxeron?»`,
  });
  console.log("✓ Gómez Manrique: frag 1");

  const gomezFrag2Text = `Ángeles:
¡Gloriosa
Virgen sancta,
esta noche
tanto cuanta
pariredes,
sin dolores,
con alegría
e con flores!

Virgen María:
¡Callad, fijo mío,
callad, mi señor!
Vuestra es la gloria
y mío el dolor.

San José:
¡Gozad, gozad, Virgen,
madre de Dios,
que Él es vuestro fijo
e vuestro señor!

[Los pastores van a adorar al Niño]
Pastor primero:
¿Qué nuevo cantar
oímos aquí?
¿Qué nueva alegría
es ésta que sentí?`;

  const gomezFrag2 = await upsertFragment({
    slug: "representacion-del-nacimiento",
    title: "Representación del Nacimiento de Nuestro Señor",
    location: "Fragmento teatral",
    headline: "¡Callad, fijo mío, callad, mi señor!",
    text: gomezFrag2Text,
    order: 2,
    status: "published",
    workId: gomezWork.id,
    artworkImageUrl: "/images/artworks/fra-angelico-anunciacion.jpg",
    artworkTitle: "La Anunciación",
    artworkAuthor: "Fra Angelico",
    artworkCaption: "c. 1437-1446, Convento de San Marco, Florencia. La representación devota de la maternidad divina que Fra Angelico pinta para los frailes dominicos tiene su paralelo teatral en la obra de Gómez Manrique, escrita para ser representada por monjas.",
  });

  await upsertAnnotation(gomezFrag2.id, "glosa", 1, {
    ...anchor(gomezFrag2Text, "¡Callad, fijo mío,\ncallad, mi señor!"),
    content: "La Virgen llama a su hijo simultáneamente «fijo mío» (hijo mío, relación maternal) y «mi señor» (relación devocional). Esta doble denominación expresa la paradoja teológica de la Natividad: María es madre y sierva a la vez del que la creó.",
  });
  await upsertAnnotation(gomezFrag2.id, "contexto", 2, {
    ...anchor(gomezFrag2Text, "¡Gloriosa\nVirgen sancta"),
    content: "La *Representación del Nacimiento de Nuestro Señor* (c. 1467) fue escrita por encargo de su hermana María de Castañeda para ser representada por las monjas del convento de Calabazanos en Nochebuena. Es la **primera obra teatral en castellano de autor conocido**. Los personajes —ángeles, María, José, pastores— anticipan los *Autos del Nacimiento* del siglo XVI.",
  });
  await upsertAnnotation(gomezFrag2.id, "figura", 3, {
    ...anchor(gomezFrag2Text, "Vuestra es la gloria\ny mío el dolor"),
    content: "**Antítesis** pura y perfecta: gloria vs. dolor, vuestra vs. mío. En solo ocho sílabas, María condensa la paradoja de su posición: madre de Dios, elegida para la gloria, pero condenada a sufrir la Pasión de su hijo.",
  });
  await upsertAnnotation(gomezFrag2.id, "pregunta", 4, {
    ...anchor(gomezFrag2Text, "¿Qué nuevo cantar\noímos aquí?"),
    content: "Los pastores reaccionan con asombro ante el canto de los ángeles. ¿Por qué crees que Gómez Manrique elige incluir personajes campesinos junto a figuras sagradas? ¿Qué función tiene el pastor en el teatro religioso medieval?",
  });
  await upsertAnnotation(gomezFrag2.id, "intertextualidad", 5, {
    ...anchor(gomezFrag2Text, "¡Gozad, gozad, Virgen"),
    content: "Esta obra es el precedente directo de las **églogas religiosas de Juan del Encina** (1469-1529), quien desarrollará el teatro navideño en la corte de los duques de Alba. El pastor aldeano —asombrado y festivo— se convertirá en el **pastor bobo** de la comedia renacentista y luego en el **gracioso** del teatro barroco de Lope de Vega.",
    externalCitation: `Juan del Encina, *Égloga representada en la noche de Navidad* (1492): «Zagalejos del aldea, / repicad con alegría, / pues la Virgen Santa María / esta noche madre sea.»`,
  });
  console.log("✓ Gómez Manrique: frag 2");

  // ══════════════════════════════════════════════════════════════════════════
  // 4. ARCIPRESTE DE TALAVERA (1398-1470)
  // ══════════════════════════════════════════════════════════════════════════
  const arcipreste = await upsertAuthor({
    slug: "arcipreste-de-talavera",
    name: "Alfonso Martínez de Toledo, Arcipreste de Talavera",
    birthYear: 1398,
    deathYear: 1470,
    country: "Castilla",
    era: "Prerrenacimiento",
    bio: "Arcipreste de Talavera (Toledo) y biógrafo de San Isidoro y San Ildefonso, Alfonso Martínez de Toledo es autor del Corbacho o Reprobación del amor mundano (1438), la más brillante sátira misógina de la literatura medieval castellana. Su prosa rítmica, que mezcla el latín eclesiástico con el habla popular, es la más viva y personal del siglo XV.",
    portraitUrl: null,
  });

  const corbacho = await upsertWork({
    slug: "corbacho",
    title: "Corbacho (Reprobación del amor mundano)",
    year: 1438,
    era: "Prerrenacimiento",
    genre: "prosa didáctica y satírica",
    synopsis: "El Arcipreste de Talavera escribe esta obra en cuatro partes para «reprobación del loco amor». La primera parte ataca el amor desordenado a las mujeres; la segunda, las condiciones y «mañas» de las malas mujeres; la tercera, los defectos de los hombres según la astrología; la cuarta, la providencia divina. Su prosa popular, dialogada y viva, llena de proverbios y refranes, prefigura la novela picaresca.",
    authorId: arcipreste.id,
  });

  const corbachoFrag1Text = `¿Cuál es el varón en este mundo que pueda dezir: «Yo soy libre»? Ninguno, si fembra amó. ¿Cuál es el que puede dezir: «Mi corazón en mi pecho está»? Ninguno, si fembra creyó. ¿Cuál es el que no siente pena, dolor, tristeza e congoja? Solo el que de mujer ama no se pagó.

Porque el que loco amor sigue es cativo de la más flaca cosa del mundo, subjectado so el poder de quien non ha poder de sí misma; atado so las cadenas de aquella que libre sería si non fuese de sí misma presa; vencido de lo que más fácilmente se vence; en servidumbre de quien servir non meresce.

Por ende, amigos e hermanos, fuid del loco amor, apartad de vosotros la ceguera del apetito desordenado, tornadvos a la razón, que es señora de los sentidos, e non permitáis que los sentidos sean señores de la razón.`;

  const corbachoFrag1 = await upsertFragment({
    slug: "corbacho-reprobacion-loco-amor",
    title: "Reprobación del loco amor",
    location: "Parte I, Capítulo I",
    headline: "¿Cuál es el varón en este mundo que pueda dezir: «Yo soy libre»?",
    text: corbachoFrag1Text,
    order: 1,
    status: "published",
    workId: corbacho.id,
    artworkImageUrl: "/images/artworks/bronzino-venus-cupid-folly-time.jpg",
    artworkTitle: "Venus, Cupido, la Locura y el Tiempo",
    artworkAuthor: "Bronzino",
    artworkCaption: "c. 1545. La imagen de Cupido como la Locura que encadena al hombre racional refleja exactamente la tesis del Arcipreste: el loco amor somete la razón a los sentidos y convierte al hombre libre en esclavo.",
  });

  await upsertAnnotation(corbachoFrag1.id, "glosa", 1, {
    ...anchor(corbachoFrag1Text, "cativo de la más flaca cosa del mundo"),
    content: "**Cativo** es 'cautivo, prisionero'. Flaca tiene el sentido medieval de 'débil, frágil'. La paradoja es brutal: el hombre fuerte se hace prisionero de la criatura más débil. Esta inversión jerárquica —el fuerte dominado por el débil— es el argumento central de la misoginia medieval.",
  });
  await upsertAnnotation(corbachoFrag1.id, "contexto", 2, {
    ...anchor(corbachoFrag1Text, "tornadvos a la razón, que es señora de los sentidos"),
    content: "El Arcipreste escribe desde una ética escolástica: la **razón** debe gobernar los **sentidos** (vista, oído, tacto), y los sentidos no deben tiranizar a la razón. El amor irracional —el «loco amor»— invierte esta jerarquía. Esta distinción entre razón y apetito viene de Aristóteles y Santo Tomás de Aquino.",
  });
  await upsertAnnotation(corbachoFrag1.id, "figura", 3, {
    ...anchor(corbachoFrag1Text, "¿Cuál es el varón en este mundo que pueda dezir"),
    content: "**Anáfora retórica e interrogación**: Las tres preguntas seguidas («¿Cuál es...? ¿Cuál es...? ¿Cuál es...?») crean un ritmo de predicación. El Arcipreste escribe desde el púlpito: habla como sacerdote que advierte a sus feligreses. Las preguntas retóricas no esperan respuesta; la respuesta es siempre «ninguno».",
  });
  await upsertAnnotation(corbachoFrag1.id, "pregunta", 4, {
    ...anchor(corbachoFrag1Text, "fuid del loco amor, apartad de vosotros"),
    content: "El Arcipreste distingue entre «loco amor» y amor legítimo (matrimonial, divino). ¿Crees que su argumento sigue siendo válido hoy, aunque quitemos el componente misógino? ¿Qué diferencia hay entre amar de manera razonable y amar de manera «loca»?",
  });
  await upsertAnnotation(corbachoFrag1.id, "intertextualidad", 5, {
    ...anchor(corbachoFrag1Text, "libre sería si non fuese de sí misma presa"),
    content: "El *Corbacho* dialoga directamente con el **Libro de Buen Amor** (1330) del Arcipreste de Hita, al que combate: donde Juan Ruiz celebraba irónicamente el amor mundano, Martínez de Toledo lo condena sin ambigüedad. Un siglo después, **Cervantes** retomará la inversión satírica del amor caballeresco en el *Quijote*, pero desde otro ángulo: el engaño no viene de la mujer, sino de los libros de caballerías.",
    externalCitation: `Juan Ruiz, Arcipreste de Hita, *Libro de Buen Amor* (c. 1330): «Como dize Aristótiles, cosa es verdadera, / el mundo por dos cosas trabaja: la primera, / por aver mantenençia; la otra cosa era / por aver juntamiento con fembra plazentera.»`,
  });
  console.log("✓ Arcipreste de Talavera: frag 1");

  const corbachoFrag2Text = `¿Qué mañas son las de la mujer codiciosa? Primeramente, es de saber que nunca tiene a su marido por bien empleado todo cuanto le puede dar, e si le da, siempre es poco; e si el marido algo guarda para lo que puede venir, ella dize que es avariento e mezquino.

E sabed que la mujer que cobdicia tiene siempre trae la mente revuelta en codicia de aver e allegar; las manos nunca están quedas de buscar e hurtar e encobrir quanto puede; la lengua no para de pedir, el ojo nunca se farta de ver, el oído nunca se cierra al que algo le promete.

¡O, cuántas mugeres buenos maridos han perdido por su cobdicia! ¡Cuántos buenos hombres han venido a pobreza, a deshonra, a malaventura, todo por amores de mugeres!`;

  const corbachoFrag2 = await upsertFragment({
    slug: "corbacho-malas-mujeres-codicia",
    title: "De la mujer codiciosa",
    location: "Parte II, Capítulo III",
    headline: "Las manos nunca están quedas de buscar e hurtar e encobrir quanto puede",
    text: corbachoFrag2Text,
    order: 2,
    status: "published",
    workId: corbacho.id,
    artworkImageUrl: "/images/artworks/van-honthorst-la-alcahueta.jpg",
    artworkTitle: "La alcahueta",
    artworkAuthor: "Gerard van Honthorst",
    artworkCaption: "1625. La figura de la mujer astuta y manipuladora que aparece en el cuadro de Honthorst es pariente de los tipos femeninos que el Arcipreste de Talavera satiriza en el Corbacho: la codiciosa, la mentirosa, la chismosa.",
  });

  await upsertAnnotation(corbachoFrag2.id, "glosa", 1, {
    ...anchor(corbachoFrag2Text, "cobdicia"),
    content: "**Cobdicia** (codicia) era uno de los siete pecados capitales: la avaricia. El Arcipreste organiza su crítica de la mujer usando el marco moral de los pecados: dedica capítulos a la mujer codiciosa, mentirosa, calumniadora, etc. La estructura moral medieval convierte la sátira en tratado ético.",
  });
  await upsertAnnotation(corbachoFrag2.id, "contexto", 2, {
    ...anchor(corbachoFrag2Text, "la lengua no para de pedir, el ojo nunca se farta"),
    content: "La Segunda Parte del *Corbacho* es la más literariamente viva: el Arcipreste reproduce el habla femenina, sus quejas, sus excusas, sus trampas. Su valor está en capturar el **habla coloquial castellana del siglo XV**, con proverbios, refranes y expresiones populares. Los lingüistas lo usan como fuente para el castellano medieval.",
  });
  await upsertAnnotation(corbachoFrag2.id, "figura", 3, {
    ...anchor(corbachoFrag2Text, "las manos nunca están quedas de buscar e hurtar e encobrir"),
    content: "**Enumeración** y **ritmo ternario**: «buscar, hurtar, encobrir» son tres verbos que progresan de lo inocente (buscar) a lo culpable (hurtar) a lo agravante (encobrir, ocultar). La acumulación es uno de los recursos principales del *Corbacho*: el vicio femenino siempre se suma y se desborda.",
  });
  await upsertAnnotation(corbachoFrag2.id, "pregunta", 4, {
    ...anchor(corbachoFrag2Text, "¡O, cuántas mugeres buenos maridos han perdido"),
    content: "El Arcipreste culpa a las mujeres de la ruina de sus maridos. ¿Qué visión del matrimonio refleja esto? ¿Se te ocurren textos de la misma época que den una visión diferente de la mujer? (Piensa en la serranilla de Santillana o en el discurso de Marcela en el *Quijote*).",
  });
  await upsertAnnotation(corbachoFrag2.id, "intertextualidad", 5, {
    ...anchor(corbachoFrag2Text, "¿Qué mañas son las de la mujer codiciosa?"),
    content: "El *Corbacho* pertenece a la tradición misógina medieval que incluye el *Corbaccio* (1354-1355) de **Giovanni Boccaccio** —de quien Martínez de Toledo toma el título— y el *Roman de la Rose* francés (s. XIII). La respuesta literaria a esta tradición vendrá de **Christine de Pizan** (*La ciudad de las damas*, 1405) y, en España, de **Diego de Valera** (*Tratado en defensa de las virtuosas mujeres*, 1444).",
    externalCitation: `Diego de Valera, *Tratado en defensa de las virtuosas mujeres* (1444): «De las mujeres se puede decir que son vaso de virtud, fuente de gracia e espejo de toda honestidad e hermosura.»`,
  });
  console.log("✓ Arcipreste de Talavera: frag 2");

  // ══════════════════════════════════════════════════════════════════════════
  // 5. DIEGO DE SAN PEDRO (1437-1498)
  // ══════════════════════════════════════════════════════════════════════════
  const diegoDeSanPedro = await upsertAuthor({
    slug: "diego-de-san-pedro",
    name: "Diego de San Pedro",
    birthYear: 1437,
    deathYear: 1498,
    country: "Castilla",
    era: "Prerrenacimiento",
    bio: "Poeta y prosista castellano de finales del siglo XV, famoso por sus novelas sentimentales. Su Cárcel de Amor (1492) fue la novela más leída y traducida del Prerrenacimiento español: se publicó en más de veinticinco ediciones hasta 1600 y fue traducida al italiano, francés, inglés y alemán. Representa la culminación del género de la novela sentimental.",
    portraitUrl: null,
  });

  const carcelDeAmor = await upsertWork({
    slug: "carcel-de-amor",
    title: "Cárcel de Amor",
    year: 1492,
    era: "Prerrenacimiento",
    genre: "novela sentimental",
    synopsis: "El narrador Leriano es prisionero en la «cárcel de amor»: un castillo alegórico construido sobre su propio corazón. El libro de amor epistolar más famoso del siglo XV: las cartas de Leriano a Laureola —y las respuestas de ella— son modelos del amor cortés. Al final, el joven Leriano muere de amor, bebiendo las cartas de su amada disueltas en vino.",
    authorId: diegoDeSanPedro.id,
  });

  const sanPedroFrag1Text = `Navegando por las aguas de mi pensamiento, fui a dar en un puerto tan trabajoso que pluguiera más a Dios no llegara en él. Andaba por una montaña muy desierta, e sin saber por dónde iba, oí dar voces a un hombre que traía encadenado otro hombre de muy gentil disposición. El que lo llevaba era de tan fiero gesto e tan espantosa figura que ponía terror a quien lo miraba; el que iba preso traía en el rostro señalada su inocencia, cuya presencia tal lástima ponía que se le aparejaba la piedad en cualquier que lo viese.

El que le llevaba traía un escudo en que venía figurado un castillo; e en la puerta del castillo había una cerradura cuya llave era el corazón de aquel que iba preso. Llegando más cerca, vi que era aquel castillo hecho de los metales siguientes: sus cimientos eran de hierro de perseverancia, sus puertas eran de llanto, sus torres eran de disfavor; e en las almenas más altas estaba puesta una bandera en que venía escrita esta letra: «Yo soy Amor, que te encarcelo.»`;

  const sanPedroFrag1 = await upsertFragment({
    slug: "carcel-de-amor-prision-alegorica",
    title: "La prisión alegórica del amor",
    location: "Capítulo I",
    headline: "Sus cimientos eran de hierro de perseverancia, sus puertas eran de llanto",
    text: sanPedroFrag1Text,
    order: 1,
    status: "published",
    workId: carcelDeAmor.id,
    artworkImageUrl: "/images/artworks/bernini-apolo-dafne.jpg",
    artworkTitle: "Apolo y Dafne",
    artworkAuthor: "Gian Lorenzo Bernini",
    artworkCaption: "1622-1625. Bernini captura el momento en que el deseo perseguidor (Apolo) alcanza a su objeto amado (Dafne) y este se transforma para escapar. La imagen de la persecución amorosa —el amante que encadena a su víctima— es el centro de la Cárcel de Amor.",
  });

  await upsertAnnotation(sanPedroFrag1.id, "glosa", 1, {
    ...anchor(sanPedroFrag1Text, "cuya llave era el corazón de aquel que iba preso"),
    content: "El corazón del amante es literalmente la **llave** de su propia prisión: él se ha encerrado él mismo. Esta alegoría del amor como cárcel autoimpuesta es el concepto central de la novela. En el amor cortés, el amador no puede escapar porque no quiere: la prisión es voluntaria.",
  });
  await upsertAnnotation(sanPedroFrag1.id, "contexto", 2, {
    ...anchor(sanPedroFrag1Text, "Navegando por las aguas de mi pensamiento"),
    content: "Diego de San Pedro abre la novela con una **alegoría de la mente como nave**: el narrador «navega» por sus propios pensamientos y llega a un «puerto trabajoso» (difícil). Esta técnica —el narrador-testigo que observa e interviene en la historia amorosa— es la novedad narrativa de la *Cárcel de Amor* frente a las novelas sentimentales anteriores.",
  });
  await upsertAnnotation(sanPedroFrag1.id, "figura", 3, {
    ...anchor(sanPedroFrag1Text, "sus cimientos eran de hierro de perseverancia, sus puertas eran de llanto, sus torres eran de disfavor"),
    content: "**Alegoría arquitectónica**: el castillo-corazón está construido con materiales que son, al mismo tiempo, físicos y emocionales. «Hierro de perseverancia» = la dureza del que espera; «puertas de llanto» = solo se entra llorando; «torres de disfavor» = lo que más alto está es el rechazo de la amada.",
  });
  await upsertAnnotation(sanPedroFrag1.id, "pregunta", 4, {
    ...anchor(sanPedroFrag1Text, "Yo soy Amor, que te encarcelo"),
    content: "La bandera del castillo proclama «Yo soy Amor, que te encarcelo». ¿En qué sentido puede el amor ser una cárcel? ¿Qué diferencia hay entre la imagen del amor en esta novela y la del amor en las serranillas de Santillana, donde la mujer rechaza al caballero con total libertad?",
  });
  await upsertAnnotation(sanPedroFrag1.id, "intertextualidad", 5, {
    ...anchor(sanPedroFrag1Text, "un hombre que traía encadenado otro hombre"),
    content: "La figura del «Deseo» encadenando al amante viene del *Roman de la Rose* (Francia, s. XIII) y de las alegorizaciones del amor en Dante y Petrarca. La **novela sentimental** española culmina en Diego de San Pedro. Cervantes parodia estas novelas en el *Quijote* (1605): don Quijote confunde la ficción amorosa con la realidad.",
    externalCitation: `Cervantes, *Don Quijote* I, 1 (1605): «Llenósele la fantasía de todo aquello que leía en los libros, así de encantamentos como de pendencias, batallas, desafíos, heridas, requiebros, amores, tormentas y disparates imposibles.»`,
  });
  console.log("✓ Diego de San Pedro: frag 1");

  const sanPedroFrag2Text = `Pues como Leriano se viese ya al cabo de sus días, e que la muerte le llegaba sin remedio, pidió que le traxesen un vaso de agua, y cuando le fue dado, requirió que echassen en él todas las letras que de Laureola tenía. Así, cuando las cartas fueron tornadas en ceniza e fechas polvos, mandólos echar en el agua, e luego que fue todo mezclado, bebiólo.

E quando lo ovo bebido, tendió los brazos e cayó en el lecho sin ningún habla. E como los circunstantes viesen tal movimiento, unos lloraban, otros llamaban, otros procuraban remedio; e sobre todo, la voz de su madre era tal que en el ánima de los presentes ponía mayor dolor que el suyo.

Así acabó Leriano su vida, que los que al presente eran quieren que fue su fin el más honrado que nunca careçido amante tuvo; e los que después han venido dizen que fue el más desdichado del mundo.`;

  const sanPedroFrag2 = await upsertFragment({
    slug: "carcel-de-amor-muerte-leriano",
    title: "La muerte de Leriano",
    location: "Capítulo final",
    headline: "Bebió el polvo de las cartas de Laureola, y así acabó Leriano su vida",
    text: sanPedroFrag2Text,
    order: 2,
    status: "published",
    workId: carcelDeAmor.id,
    artworkImageUrl: "/images/artworks/millais-ofelia.jpg",
    artworkTitle: "Ofelia",
    artworkAuthor: "John Everett Millais",
    artworkCaption: "1851-1852. Ofelia muere cantando, coronada de flores, rendida al amor imposible. Leriano muere bebiendo cartas de amor: en ambos casos, la muerte por amor es presentada como la culminación de la fidelidad, el único gesto que puede igualar la magnitud del sentimiento.",
  });

  await upsertAnnotation(sanPedroFrag2.id, "glosa", 1, {
    ...anchor(sanPedroFrag2Text, "tornadas en ceniza e fechas polvos"),
    content: "Las cartas se queman hasta ser ceniza y luego se disuelven en agua. El gesto de Leriano es literalmente comerse las palabras de Laureola: incorporar, hacer carne propia, lo que ella le escribió. Es el acto físico más extremo del amor epistolar.",
  });
  await upsertAnnotation(sanPedroFrag2.id, "contexto", 2, {
    ...anchor(sanPedroFrag2Text, "pidió que le traxesen un vaso de agua"),
    content: "La *Cárcel de Amor* (1492) fue publicada el mismo año que el **descubrimiento de América**. Es la novela más editada del siglo XV español: 26 ediciones entre 1492 y 1633. La fama de la muerte de Leriano —muerto de amor, bebiendo las cartas de su amada— hizo de este libro el modelo del amante ideal para toda Europa. Fue traducida al italiano (1514), al inglés (1548) y al francés (1526).",
  });
  await upsertAnnotation(sanPedroFrag2.id, "figura", 3, {
    ...anchor(sanPedroFrag2Text, "unos lloraban, otros llamaban, otros procuraban remedio"),
    content: "**Tricolon** (serie de tres): los tres grupos de asistentes representan tres reacciones posibles ante la muerte —llorar (la emoción), llamar (la negación), procurar remedio (la acción inútil). La triplicidad ordena el caos del duelo y le da al narrador distancia retórica ante lo que está contando.",
  });
  await upsertAnnotation(sanPedroFrag2.id, "pregunta", 4, {
    ...anchor(sanPedroFrag2Text, "fue su fin el más honrado"),
    content: "Algunos testigos creen que la muerte de Leriano fue «la más honrada» de cualquier amante; otros, que fue «la más desdichada del mundo». ¿Con cuál estás de acuerdo? ¿Puede morir de amor alguien en el siglo XXI, o este tipo de amor ha desaparecido?",
  });
  await upsertAnnotation(sanPedroFrag2.id, "intertextualidad", 5, {
    ...anchor(sanPedroFrag2Text, "Así acabó Leriano su vida"),
    content: "La muerte de amor tiene un antecedente inmediato en **La Celestina** (1499): Calisto muere al caer de la escalera, y Melibea se suicida poco después. Ambas muertes son consecuencia del «loco amor» que el Arcipreste de Talavera había criticado. En el siglo XIX, el **Romanticismo** recupera este modelo: el amor que solo puede cumplirse en la muerte (Werther de Goethe, 1774).",
    externalCitation: `Fernando de Rojas, *La Celestina*, Acto XX (1499): «¡O mi amor e mi señor Calisto! ¿A qué lugar te fue a buscar? [...] Quiero saltar e seguirte presto, pues tan cruelmente me dejaste.» [Melibea se arroja de la torre.]`,
  });
  console.log("✓ Diego de San Pedro: frag 2");

  // ══════════════════════════════════════════════════════════════════════════
  // Completar anotaciones del Amadís de Gaula (ya existente, ahora Prerrenacimiento)
  // ══════════════════════════════════════════════════════════════════════════
  const amadisF = await prisma.fragment.findUnique({
    where: { slug: "el-endriago-amadis" },
    select: { id: true, text: true, annotations: { select: { type: true } } },
  });
  if (amadisF) {
    const existing = new Set(amadisF.annotations.map(a => a.type));
    const t = amadisF.text;
    if (!existing.has("glosa")) await upsertAnnotation(amadisF.id, "glosa", 1, {
      ...anchor(t, "endriago"),
      content: "El **endriago** es una bestia fantástica de la tradición caballeresca: cuerpo de hombre, pies de gavilán, manos de oso, cabeza de serpiente. La descripción acumula los rasgos de los monstruos medievales más aterradores, creando un ser compuesto de múltiples horrores.",
    });
    if (!existing.has("contexto")) await upsertAnnotation(amadisF.id, "contexto", 2, {
      ...anchor(t, "se santiguó y encomendóse a Dios"),
      content: "El **Amadís de Gaula** de Garci Rodríguez de Montalvo (publicado en 1508) es el primer libro de caballerías en castellano y el modelo de todos los siguientes. Esta escena en la **Ínsula del Diablo** es el enfrentamiento más célebre del libro. El endriago simboliza el mal absoluto que solo el caballero perfecto —armado de fe y amor— puede vencer.",
    });
    if (!existing.has("figura")) await upsertAnnotation(amadisF.id, "figura", 3, {
      ...anchor(t, "los ojos como brasas de fuego"),
      content: "**Símil acumulativo**: ojos como brasas, llama como la de una fragua, tres filas de dientes. La descripción del endriago acumula comparaciones tomadas de lo cotidiano (brasas, fragua) para hacer comprensible lo incomprensible: esta es la técnica de la *ekfrasis* caballeresca.",
    });
    if (!existing.has("pregunta")) await upsertAnnotation(amadisF.id, "pregunta", 4, {
      ...anchor(t, "el amor de su señora le doblaba las fuerzas"),
      content: "El texto dice que el amor de Oriana dobla las fuerzas de Amadís. ¿Crees que esto refleja una visión positiva o negativa del amor? ¿En qué se diferencia este amor que fortalece del «loco amor» que el Arcipreste de Talavera condena?",
    });
    if (!existing.has("intertextualidad")) await upsertAnnotation(amadisF.id, "intertextualidad", 5, {
      ...anchor(t, "peleó tanto que al fin venció al endriago"),
      content: "El Amadís es el blanco central de la **parodia de Cervantes** en el *Quijote* (1605). Don Quijote ha leído el Amadís tantas veces que cree vivir en ese mundo: cuando ataca los molinos de viento, está imitando la hazaña de Amadís contra el endriago. El monstruo medieval se convierte en los molinos que don Quijote confunde con gigantes.",
      externalCitation: `Cervantes, *Don Quijote* I, 8 (1605): «"¿Qué gigantes?" dijo Sancho Panza. "Aquellos que allí ves," respondió su amo, "de los brazos largos." "Mire vuestra merced," respondió Sancho, "que aquellos que allí se parecen no son gigantes, sino molinos de viento."»`,
    });
    console.log("✓ Amadís: anotaciones completadas");
  }

  console.log("\n✅ Prerrenacimiento completo: 5 nuevos autores, 10 fragmentos, anotaciones completas.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
