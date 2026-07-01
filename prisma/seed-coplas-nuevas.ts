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
    throw new Error(`Anchor not found: "${needle}" in text starting "${text.slice(0, 80)}"`);
  return { anchorStart, anchorEnd: anchorStart + needle.length };
}

// ── COPLA II ─────────────────────────────────────────────────────────────────
const copla2Text = `Pues si vemos lo presente
cómo en un punto se es ido
y acabado,
si juzgamos sabiamente,
daremos lo no venido
por pasado.
No se engañe nadie, no,
pensando que ha de durar
lo que espera
más que duró lo que vio,
pues que todo ha de pasar
por tal manera.`;

// ── COPLA V ──────────────────────────────────────────────────────────────────
const copla5Text = `Este mundo es el camino
para el otro, que es morada
sin pesar;
mas cumple tener buen tino
para andar esta jornada
sin errar.
Partimos cuando nacemos,
andamos mientras vivimos,
y llegamos
al tiempo que fenecemos;
así que, cuando morimos,
descansamos.`;

// ── COPLAS XXXIII-XXXVII: La Muerte llama a su puerta ────────────────────────
const copla33_37Text = `Después de puesta la vida
tantas veces por su ley
al tablero;
después de tan bien servida
la corona de su rey
verdadero;
después de tanta hazaña
a que no puede bastar
cuenta cierta,
en la su villa de Ocaña
vino la Muerte a llamar
a su puerta

diciendo: «Buen caballero,
dejad el mundo engañoso
y su halago;
vuestro corazón de acero
muestre su esfuerzo famoso
en este trago;
y pues de vida y salud
hicisteis tan poca cuenta
por la fama,
esfuércese la virtud
por sufrir esta afrenta
que os llama.

No se os haga tan amarga
la batalla temerosa
que esperáis,
pues otra vida más larga
de fama tan gloriosa
acá dejáis.
Aunque esta vida de honor
tampoco no es eternal,
ni verdadera,
mas, con todo, es muy mejor
que la vida terrenal,
perecedera.

El vivir que es perdurable
no se gana con estados
mundanales,
ni con vida deleitable,
en que moran los pecados
infernales;
mas los buenos religiosos,
ganánlo con oraciones
y con lloros,
los caballeros famosos
con trabajos y aflicciones
contra moros.

Y pues vos, claro varón,
tanta sangre derramasteis
de paganos,
esperad el galardón
que en este mundo ganasteis
por las manos.
Y con esta confianza
y con la fe tan entera
que tenéis,
partid con buena esperanza,
que esta otra vida tercera,
ganaréis.»`;

// ── COPLAS XXXVIII-XL: Don Rodrigo responde y muere ─────────────────────────
const copla38_40Text = `«No tengamos tiempo ya
en esta vida mezquina
por tal modo,
que mi voluntad está
conforme con la divina
para todo.
Y consiento en mi morir
con voluntad placentera,
clara y pura,
que querer hombre vivir
cuando Dios quiere que muera,
es locura.»

Tú que por nuestra maldad
tomaste forma servil
y bajo nombre;
Tú que en tu divinidad
juntaste cosa tan vil
como es el hombre;
Tú que tan grandes tormentos
sufriste sin resistencia
en tu persona,
no por mis merecimientos,
mas por tu sola clemencia,
me perdona.

Así, con tal entender,
todos sentidos humanos
conservados,
cercado de su mujer,
y de sus hijos y hermanos
y criados,
dio el alma a quien se la dio,
el cual la ponga en el cielo
y en su gloria,
y aunque la vida perdió,
dejónos harto consuelo
su memoria.`;

async function main() {
  const work = await prisma.work.findUniqueOrThrow({
    where: { slug: "coplas-a-la-muerte-de-su-padre" },
    select: { id: true },
  });

  // ── COPLA II ───────────────────────────────────────────────
  const frag2 = await prisma.fragment.create({
    data: {
      slug: "coplas-lo-presente-es-ido",
      title: "Pues si vemos lo presente (Copla II)",
      location: "Coplas a la muerte de su padre, copla II",
      headline: "si juzgamos sabiamente, / daremos lo no venido / por pasado",
      text: copla2Text,
      order: 4,
      status: "published",
      featured: false,
      workId: work.id,
      topics: { connect: [{ slug: "tempus-fugit" }] },
      constellations: { connect: [{ slug: "muerte" }, { slug: "paso-del-tiempo" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: frag2.id,
        type: "figura",
        ...anchor(copla2Text, "daremos lo no venido\npor pasado"),
        order: 1,
        content: `**Paradoja temporal**: lo que aún no ha llegado ya debe contarse como pasado, porque todo pasa tan deprisa que la diferencia entre futuro y pasado es irrelevante. Es la lógica estoica de Manrique: si lo que fue ya no existe, y lo que vendrá pronto dejará de ser, vivir apegado a las cosas del mundo es engañarse a sí mismo.`,
      },
      {
        fragmentId: frag2.id,
        type: "glosa",
        ...anchor(copla2Text, "en un punto se es ido"),
        order: 2,
        content: `**en un punto**: en un instante, en nada de tiempo. La expresión es casi paradójica: el presente no tiene duración, es el momento infinitesimal en que el futuro se convierte en pasado. Manrique anticipa una intuición filosófica que Quevedo llevará al extremo: el presente no existe, solo hay pasado y futuro.`,
      },
      {
        fragmentId: frag2.id,
        type: "contexto",
        ...anchor(copla2Text, "No se engañe nadie, no"),
        order: 3,
        content: `La admonición directa al lector («No se engañe nadie») es característica de la tradición didáctica medieval: el poeta no describe, sino que advierte. Esta copla funciona como argumento filosófico en favor del desapego: si todo pasa, el sabio no se aferra a nada. La sabiduría manriqueña es profundamente estoica, aunque expresada en términos cristianos.`,
      },
    ],
  });
  console.log("✓ Copla II creada → coplas-lo-presente-es-ido");

  // ── COPLA V ────────────────────────────────────────────────
  const frag5 = await prisma.fragment.create({
    data: {
      slug: "coplas-este-mundo-es-el-camino",
      title: "Este mundo es el camino (Copla V)",
      location: "Coplas a la muerte de su padre, copla V",
      headline: "Partimos cuando nacemos, / andamos mientras vivimos, / y llegamos",
      text: copla5Text,
      order: 5,
      status: "published",
      featured: false,
      workId: work.id,
      topics: { connect: [{ slug: "tempus-fugit" }, { slug: "contemptus-mundi" }] },
      constellations: { connect: [{ slug: "muerte" }, { slug: "paso-del-tiempo" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: frag5.id,
        type: "figura",
        ...anchor(copla5Text, "Este mundo es el camino\npara el otro"),
        order: 1,
        content: `**Metáfora estructural**: el mundo como *camino* es una de las grandes metáforas de la tradición medieval cristiana (*vita est via*). Pero Manrique la desarrolla con precisión geométrica: si este mundo es el camino, el otro mundo es la *morada*, el destino definitivo. La vida terrena es tránsito, no fin; el que la toma como morada confunde el medio con el fin.`,
      },
      {
        fragmentId: frag5.id,
        type: "figura",
        ...anchor(copla5Text, "Partimos cuando nacemos,\nandamos mientras vivimos,\ny llegamos"),
        order: 2,
        content: `**Gradación** o *clímax* de tres verbos de movimiento: *partimos / andamos / llegamos*. Los tres verbos enuncian el viaje completo de la vida humana en seis palabras. La gradación es perfecta: el nacimiento es la partida, la vida es el camino, la muerte es la llegada. Y la llegada —*descansamos*— tiene una connotación paradójica: la muerte como descanso, como fin del viaje y no como catástrofe.`,
      },
      {
        fragmentId: frag5.id,
        type: "glosa",
        ...anchor(copla5Text, "fenecemos"),
        order: 3,
        content: `**fenecemos**: morimos, terminamos. Del latín *finire*, acabar. Manrique elige este término, más suave que *morimos*, para crear el zeugma con el verso siguiente: «así que, cuando morimos, / descansamos». La muerte aparece dos veces en la misma estrofa con dos palabras distintas: *fenecemos* (acabamos) y *morimos* (la realidad directa), pero el poeta la atenúa en *descansamos*, donde la muerte se convierte en alivio.`,
      },
    ],
  });
  console.log("✓ Copla V creada → coplas-este-mundo-es-el-camino");

  // ── COPLAS XXXIII-XXXVII ───────────────────────────────────
  const frag33 = await prisma.fragment.create({
    data: {
      slug: "coplas-la-muerte-llama-a-su-puerta",
      title: "La Muerte llama a su puerta (Coplas XXXIII-XXXVII)",
      location: "Coplas a la muerte de su padre, coplas XXXIII-XXXVII",
      headline: "vino la Muerte a llamar / a su puerta",
      text: copla33_37Text,
      order: 6,
      status: "published",
      featured: false,
      workId: work.id,
      topics: { connect: [{ slug: "tempus-fugit" }, { slug: "contemptus-mundi" }] },
      constellations: { connect: [{ slug: "muerte" }, { slug: "honor-y-valor" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: frag33.id,
        type: "contexto",
        ...anchor(copla33_37Text, "en la su villa de Ocaña"),
        order: 1,
        content: `Ocaña (Toledo) es donde murió realmente Rodrigo Manrique, Maestre de Santiago, en noviembre de 1476, de una enfermedad grave. Jorge Manrique estaba allí presente como hijo. La escena que viene a continuación —la Muerte que llega, habla y es respondida serenamente— no es ficción pura: es una *meditación poética* sobre un hecho histórico que el poeta vivió en primera persona.`,
      },
      {
        fragmentId: frag33.id,
        type: "figura",
        ...anchor(copla33_37Text, "vuestro corazón de acero\nmuestre su esfuerzo famoso\nen este trago"),
        order: 2,
        content: `**Metáfora**: «corazón de acero» equipara la valentía militar con la fortaleza ante la muerte. La **sinécdoque** *corazón* representa al hombre entero. El **eufemismo** «en este trago» suaviza el momento de la muerte. La Muerte habla aquí como alguien que conoce al caballero y le recuerda quién es: no un cobarde que se rinde, sino un guerrero que muere en su ley.`,
      },
      {
        fragmentId: frag33.id,
        type: "glosa",
        ...anchor(copla33_37Text, "hicisteis tan poca cuenta\npor la fama"),
        order: 3,
        content: `**hicisteis tan poca cuenta**: diste tan poco valor, prestaste tan poca atención. La Muerte le recuerda a Don Rodrigo que él mismo, a lo largo de su vida, ha antepuesto la *fama* (el honor militar) a su propia vida y salud. En cierto modo, la muerte es la consecuencia lógica de haber vivido como vivió: con desprecio de la comodidad y entrega total al deber.`,
      },
      {
        fragmentId: frag33.id,
        type: "contexto",
        ...anchor(copla33_37Text, "esta otra vida tercera"),
        order: 4,
        content: `La *tercera vida* es la *vida de la fama*: la que sigue a la vida biológica (primera) y a la vida del alma en el más allá (segunda). Para Manrique, el caballero virtuoso —el que muere en servicio de su rey— gana esta tercera vida de honra y memoria. Es una idea clásica (los héroes griegos vivían en la fama) que Manrique reelabora en clave cristiana y caballeresca: la gloria mundana como anticipo de la gloria celestial.`,
      },
    ],
  });
  console.log("✓ Coplas XXXIII-XXXVII creadas → coplas-la-muerte-llama-a-su-puerta");

  // ── COPLAS XXXVIII-XL ─────────────────────────────────────
  const frag38 = await prisma.fragment.create({
    data: {
      slug: "coplas-consiento-en-mi-morir",
      title: "Y consiento en mi morir (Coplas XXXVIII-XL)",
      location: "Coplas a la muerte de su padre, coplas XXXVIII-XL",
      headline: "Y consiento en mi morir / con voluntad placentera, / clara y pura",
      text: copla38_40Text,
      order: 7,
      status: "published",
      featured: false,
      workId: work.id,
      topics: { connect: [{ slug: "contemptus-mundi" }, { slug: "tempus-fugit" }] },
      constellations: { connect: [{ slug: "muerte" }, { slug: "fe" }] },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: frag38.id,
        type: "figura",
        ...anchor(copla38_40Text, "Y consiento en mi morir\ncon voluntad placentera,\nclara y pura"),
        order: 1,
        content: `**Paradoja** y **oxímoron**: *consentir* en morir implica una aceptación activa, casi una elección, de algo que es inevitable. El adverbio «con voluntad placentera» convierte la muerte en un acto de voluntad serena, no en una derrota. El triple adjetivo —*placentera, clara y pura*— pinta la muerte como una experiencia luminosa, casi mística. Es la *ars moriendi* medieval: el bien morir como cumbre de la vida virtuosa.`,
      },
      {
        fragmentId: frag38.id,
        type: "glosa",
        ...anchor(copla38_40Text, "que querer hombre vivir\ncuando Dios quiere que muera,\nes locura"),
        order: 2,
        content: `La *locura* aquí es la resistencia irracional a la voluntad divina. Para Manrique, el hombre sabio reconoce que la vida y la muerte pertenecen a Dios, no a él. Oponerse a la muerte es tan absurdo como oponerse a la lluvia. Esta posición es al tiempo cristiana (humildad ante Dios) y estoica (aceptación de lo necesario): Manrique funde las dos tradiciones sin contradicción.`,
      },
      {
        fragmentId: frag38.id,
        type: "glosa",
        ...anchor(copla38_40Text, "dio el alma a quien se la dio"),
        order: 3,
        content: `Fórmula de perfecta circularidad: el alma vuelve a quien la dio. La **figura etimológica** (*dio... dio*) subraya el cierre del círculo vital: la vida no es propiedad del hombre sino un préstamo de Dios. Manrique condensa en un verso la teología de la creación —*ex nihilo*, sin mérito propio— y la de la muerte: devolver lo recibido. La humildad de la fórmula contrasta con la grandeza de la vida que se describe a lo largo del poema.`,
      },
      {
        fragmentId: frag38.id,
        type: "intertextualidad",
        ...anchor(copla38_40Text, "dejónos harto consuelo\nsu memoria"),
        order: 4,
        content: `El poema no termina con la muerte sino con la *memoria*: «dejónos harto consuelo / su memoria». Este cierre anuncia la tercera vida —la de la fama— que la Muerte había prometido unas coplas antes. La memoria como consuelo es exactamente lo que los intertextos del siglo XX buscarán en Manrique: Pablo Neruda, Dionisio Ridruejo, Blas de Otero y José Bergamín escriben *sobre* Manrique porque su memoria sigue consolando, seis siglos después.`,
        externalCitation: `Pablo Neruda, *Oda a Don Jorge Manrique* (1958): «Así, Jorge Manrique, / tu nombre nos acompaña / todavía». Dionisio Ridruejo, *Con Jorge Manrique* (1981): «Sigue hablando el caballero».`,
      },
    ],
  });
  console.log("✓ Coplas XXXVIII-XL creadas → coplas-consiento-en-mi-morir");

  console.log("\n✅ 4 nuevas coplas añadidas (órdenes 4-7).");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
