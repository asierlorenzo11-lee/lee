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
    throw new Error(
      `Anchor not found: "${needle}" in text starting "${text.slice(0, 80)}"`
    );
  return { anchorStart, anchorEnd: anchorStart + needle.length };
}

// ─────────────────────────────────────────────────────────────
// TEXTOS
// ─────────────────────────────────────────────────────────────

const bergaminText = `Si está el alma dormida,
¿para qué despertarla?
¿Para qué despertar con el recuerdo
el sueño en que descansa?

Si la corta agonía de la muerte
puede hacerse tan larga,
¿por qué no adormecerla en el olvido
de su memoria amarga?

* * *

Muy poco a poco,
lentamente,
me estoy muriendo
de repente.

* * *

Y de mi vida desconfío
porque no corre
como el río.`;

const nerudaText = `Adelante, le dije
y entró el buen caballero
de la muerte.

Era de plata verde
su armadura
y sus ojos
eran
como el agua marina.

Sus manos y su rostro
eran de trigo.

Habla, le dije, caballero
Jorge,
no puedo
oponer sino el aire
a tus estrofas.

De hierro y sombra fueron,
de diamantes
oscuros
y cortados
quedaron
en el frío
de las torres
de España,
en la piedra, en el agua,
en el idioma.

Entonces, él me dijo:
«Es la hora
de la vida.

Ay
si pudiera
morder una manzana,
tocar la polvorosa
suavidad de la harina.
Ay, si de nuevo
el canto...
No a la muerte
daría
mi palabra...
Creo
que el tiempo oscuro
nos cegó
el corazón
y sus raíces
bajaron y bajaron
a las tumbas,
comieron
con la muerte.

Sentencia y oración fueron las rosas
de aquellas enterradas
primaveras
y, solitario, trovador,
anduve
callado en las moradas
transitorias.
Todos los pasos iban
a una solemne
eternidad
vacía.

Ahora
me parece
que no está solo el hombre.
En sus manos
ha elaborado,
como si fuera un duro
pan, la esperanza,
la terrestre
esperanza».

Miré y el caballero
de piedra
era de aire.

Ya no estaba en la silla.

Por la abierta ventana
se extendían las tierras,
los países,
la lucha, el trigo,
el viento.

Gracias, dije, Don Jorge, caballero.

Y volví a mi deber de pueblo y canto.`;

const ridruejText = `Desde su almena de tiempo
sigue hablando el caballero.

Sigue como pasa el río
efimeramente vivo.

Como la hierba del prado
agostada y rebrotando.

Como las danzas y olores
que hemos amado y ya nacen
para nuevos amadores.

Como hazañas y poderes
que hacen polvo de camino
y lo harán en lo que viene.

Como la vida y el hombre
nunca bastante y de prisa
pidiendo esperanza doble.

Como la muerte en su troje.

Todo es hacerse: el trabajo
del que se hace por sus manos.

El sueño de los que sueñan.
El rezo de los que rezan.
El pelear contra moro,
contra tirano o galerna,
contra suerte o contra todo.

Todo es hacerse en el hombre;
en el nombre que nos muestra
y en la historia que nos come.

El caballero murmura
agua aborrascada o pura.

Todo es vivir repitiendo
cumpliendo a Dios al encuentro.

Todo es levantar del barro
al interminable humano.

El caballero resuena
agua antigua y venidera.

El canto es sereno: dice
la verdad; la está diciendo
el caballero del tiempo.`;

const oteroText = `Hojas sueltas, decidme, qué se hicieron
los Infantes de Aragón, Manuel Granero, la pavana
para una infanta,
si está Madrid iluminado como una diapositiva
y sólo en este barrio saltan, ríen, berrean setenta o
setenta y cinco niños
y sus mamás ostentan senos de Honolulú, y pasan
muchas con sus ropas chapadas,
faldas en microsurco, y manillas brillantes y sandalias
de purpurina,
hojas sueltas, caídas
como cristo contra el empedrado, decidme,
quién empezó eso de cesar, pasar, morir,
quién inventó tal juego, ese espantoso solitario
sin trampa, que le deja a uno acartonado,
si la plaza de Oriente es una rosa de Alejandría,
ah Madrid de Mesonero, de Lope, de Galdós y de Quevedo,
inefable Madrid infectado por el gasoil, los yanquis y
la sociedad de consumo,
ciudad donde Jorge Manrique acabaría por jodernos a todos,
a no ser porque la vida está cosida con grapas de plástico
y sus hojas perduran inarrancablemente bajo el rocío
de los prados
y las graves estrofas que nos quiebran los huesos y los esparcen
bajo este cielo de Madrid ahumado por cuántos años
de quietismo,
tan parecidos a don Rodrigo en su túmulo de terciopelo
y rimas cuadriculadas.`;

// ─────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────

async function main() {
  // ──────────────────────────────────────────────────────────
  // 1. JOSÉ BERGAMÍN (1897-1983)
  // ──────────────────────────────────────────────────────────
  console.log("Creando autor José Bergamín...");
  const bergamin = await prisma.author.create({
    data: {
      slug: "jose-bergamin",
      name: "José Bergamín",
      birthYear: 1897,
      deathYear: 1983,
      era: "Siglo XX",
      country: "España",
      bio: `Escritor madrileño vinculado a la Generación del 27, conocido por sus aforismos, su teatro y una poesía que combina la tradición española —las coplas, los romances, la mística— con el pensamiento moderno. Exiliado tras la Guerra Civil, vivió en México, Uruguay y París antes de regresar a España. En sus últimos libros, escritos entre 1978 y 1981, el eco de las *Coplas* de Manrique es constante: la misma pregunta por la fugacidad, el mismo ritmo de pie quebrado en la memoria.`,
      portraitUrl: null,
    },
  });

  const bergaminWork = await prisma.work.create({
    data: {
      slug: "esperando-la-mano-de-nieve",
      title: "Esperando la mano de nieve",
      year: 1982,
      genre: "Poesía",
      synopsis: `Conjunto de poemas escritos entre 1978 y 1981, publicado en Madrid por Turner en 1982. Bergamín, ya octogenario, regresa a las formas breves de la tradición española para meditar sobre la muerte, el olvido y la memoria. La sombra de las *Coplas* de Manrique recorre el libro: las mismas preguntas, el mismo ritmo, una conciencia distinta.`,
      authorId: bergamin.id,
    },
  });

  const fragBergamin = await prisma.fragment.create({
    data: {
      slug: "bergamin-alma-dormida",
      title: "Tres poemas a la sombra de Manrique",
      location: "Esperando la mano de nieve, pp. 42, 185, 159",
      headline: "Si está el alma dormida, ¿para qué despertarla?",
      text: bergaminText,
      order: 1,
      status: "published",
      featured: false,
      workId: bergaminWork.id,
      topics: {
        connect: [{ slug: "ubi-sunt" }, { slug: "tempus-fugit" }],
      },
      constellations: {
        connect: [{ slug: "muerte" }, { slug: "paso-del-tiempo" }],
      },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragBergamin.id,
        type: "contexto",
        ...anchor(bergaminText, "Si está el alma dormida"),
        order: 1,
        content: `El primer verso invierte y cuestiona el arranque de las *Coplas* de Manrique («Recuerde el alma dormida, / avive el seso y despierte»). Donde Manrique exige despertar, Bergamín pregunta para qué: en el siglo XX, la muerte ha perdido la serenidad cristiana que le daba sentido en el poema medieval.`,
      },
      {
        fragmentId: fragBergamin.id,
        type: "intertextualidad",
        ...anchor(bergaminText, "como el río"),
        order: 2,
        content: `El río es la imagen central de las *Coplas*: «Nuestras vidas son los ríos / que van a dar en la mar, / que es el morir». Bergamín la retoma al final con amargura: su vida «desconfía» porque no corre con la naturalidad y la certeza que el cauce manriqueño parecía prometer.`,
        externalCitation: `Jorge Manrique, *Coplas* (estrofa III): «Nuestras vidas son los ríos / que van a dar en la mar, / que es el morir».`,
      },
    ],
  });

  console.log("✓ Bergamín creado.");

  // ──────────────────────────────────────────────────────────
  // 2. PABLO NERUDA (1904-1973)
  // ──────────────────────────────────────────────────────────
  console.log("Creando autor Pablo Neruda...");
  const neruda = await prisma.author.create({
    data: {
      slug: "pablo-neruda",
      name: "Pablo Neruda",
      birthYear: 1904,
      deathYear: 1973,
      era: "Siglo XX",
      country: "Chile",
      bio: `Neftalí Ricardo Reyes Basoalto, más conocido como Pablo Neruda, es uno de los poetas más influyentes del siglo XX en lengua española. Premio Nobel de Literatura en 1971. Sus *Odas elementales* (1954-1957) celebran objetos cotidianos con un lenguaje sencillo y luminoso. En la «Oda a Don Jorge Manrique», Neruda imagina un encuentro con el caballero medieval para hablar del tiempo, la poesía y la esperanza.`,
      portraitUrl: null,
    },
  });

  const nerudaWork = await prisma.work.create({
    data: {
      slug: "nuevas-odas-elementales",
      title: "Nuevas odas elementales",
      year: 1956,
      genre: "Poesía",
      synopsis: `Segunda entrega de las odas de Neruda, publicada en Buenos Aires en 1956. Continúa el programa de las *Odas elementales* (1954): poemas breves, de verso corto, que celebran lo cotidiano —el pan, el tomate, el aire— y también los encuentros con figuras del pasado. La «Oda a Don Jorge Manrique» es uno de los textos más singulares del libro: un diálogo imaginario entre el poeta chileno y el caballero castellano del siglo XV.`,
      authorId: neruda.id,
    },
  });

  const fragNeruda = await prisma.fragment.create({
    data: {
      slug: "neruda-oda-manrique",
      title: "Oda a Don Jorge Manrique",
      location: "Nuevas odas elementales (1956); Obras completas I, pp. 1290-1292",
      headline: "Habla, le dije, caballero Jorge",
      text: nerudaText,
      order: 1,
      status: "published",
      featured: false,
      workId: nerudaWork.id,
      topics: {
        connect: [{ slug: "ubi-sunt" }, { slug: "tempus-fugit" }],
      },
      constellations: {
        connect: [
          { slug: "muerte" },
          { slug: "paso-del-tiempo" },
          { slug: "escritura-y-creacion" },
        ],
      },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragNeruda.id,
        type: "contexto",
        ...anchor(nerudaText, "el buen caballero\nde la muerte"),
        order: 1,
        content: `Neruda convierte a Manrique en personaje: es «el buen caballero de la muerte», el poeta que hizo de la muerte su materia. La oda es un diálogo imaginado entre dos poetas separados por cinco siglos, pero unidos por la misma pregunta sobre el tiempo y la poesía.`,
      },
      {
        fragmentId: fragNeruda.id,
        type: "intertextualidad",
        ...anchor(nerudaText, "no puedo\noponer sino el aire\na tus estrofas"),
        order: 2,
        content: `El gesto de humildad de Neruda es también un reconocimiento: las *Coplas* son una obra tan lograda que solo cabe oponerles «el aire» —la transparencia, la sencillez— de su propio estilo. Es la respuesta de un poeta moderno a una tradición que lo supera en antigüedad pero que siente viva.`,
        externalCitation: `Jorge Manrique escribió las *Coplas* h. 1476. Neruda las leyó en el exilio republicano español (Madrid, 1936-37) y volvió a ellas veinte años después para esta oda.`,
      },
      {
        fragmentId: fragNeruda.id,
        type: "intertextualidad",
        ...anchor(nerudaText, "la terrestre\nesperanza»"),
        order: 3,
        content: `El «caballero» de Manrique encontraba consuelo en la «fama» y en la vida eterna como tercera vida, más allá de la biológica y la social. El Manrique de Neruda propone una esperanza distinta: «la terrestre esperanza», la que no espera otro mundo sino que transforma este.`,
        externalCitation: `Jorge Manrique, *Coplas* (estrofa XXXV): «y aunque la vida murió, / nos dexó harto consuelo / su memoria». La «tercera vida» de fama que Manrique promete a su padre reaparece, secularizada, en la esperanza terrestre de Neruda.`,
      },
      {
        fragmentId: fragNeruda.id,
        type: "contexto",
        ...anchor(nerudaText, "Y volví a mi deber de pueblo y canto"),
        order: 4,
        content: `El cierre de la oda define la poética de Neruda: el poeta no «opone» nada eterno a la muerte, sino que vuelve a su «deber» —la palabra compromiso está implícita— con «el pueblo» y el «canto». La respuesta al *tempus fugit* no es la resignación cristiana de Manrique, sino la acción colectiva.`,
      },
    ],
  });

  console.log("✓ Neruda creado.");

  // ──────────────────────────────────────────────────────────
  // 3. DIONISIO RIDRUEJO (1912-1975)
  // ──────────────────────────────────────────────────────────
  console.log("Creando autor Dionisio Ridruejo...");
  const ridruejo = await prisma.author.create({
    data: {
      slug: "dionisio-ridruejo",
      name: "Dionisio Ridruejo",
      birthYear: 1912,
      deathYear: 1975,
      era: "Siglo XX",
      country: "España",
      bio: `Poeta y político soriano, uno de los intelectuales más complejos del siglo XX español. Comenzó como ideólogo falangista y jefe de propaganda del régimen franquista; con el tiempo evolucionó hacia la oposición democrática. Su poesía, influida por la tradición castellana y por Garcilaso, dialoga constantemente con los clásicos. El poema «Con Jorge Manrique» está dedicado al filósofo Julián Marías y recoge el eco de las *Coplas* desde la España de posguerra.`,
      portraitUrl: null,
    },
  });

  const ridruejWork = await prisma.work.create({
    data: {
      slug: "hasta-la-fecha-ridruejo",
      title: "Hasta la fecha (Poesías completas)",
      year: 1961,
      genre: "Poesía",
      synopsis: `Recopilación de la poesía completa de Ridruejo hasta 1961, publicada en Madrid por Aguilar. Recoge los poemas de sus diferentes etapas, desde la lírica idealista de los años 40 hasta los textos de madurez. «Con Jorge Manrique», incluido en *Convivencias*, es uno de los poemas más representativos de su diálogo con la tradición castellana.`,
      authorId: ridruejo.id,
    },
  });

  const fragRidruejo = await prisma.fragment.create({
    data: {
      slug: "ridruejo-con-manrique",
      title: "Con Jorge Manrique",
      location: "Hasta la fecha (Poesías completas), Madrid, Aguilar, 1961, pp. 515-516",
      headline: "Desde su almena de tiempo sigue hablando el caballero",
      text: ridruejText,
      order: 1,
      status: "published",
      featured: false,
      workId: ridruejWork.id,
      topics: {
        connect: [{ slug: "ubi-sunt" }, { slug: "tempus-fugit" }],
      },
      constellations: {
        connect: [{ slug: "muerte" }, { slug: "paso-del-tiempo" }],
      },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragRidruejo.id,
        type: "intertextualidad",
        ...anchor(ridruejText, "Sigue como pasa el río\nefimeramente vivo"),
        order: 1,
        content: `La imagen del río —central en las *Coplas* de Manrique— reaparece aquí de forma literal: «sigue como pasa el río». El adverbio «efimeramente» introduce la conciencia moderna: la vida del caballero, en el poema de Ridruejo, no desemboca en la eternidad cristiana sino en una fugacidad que permanece activa.`,
        externalCitation: `Jorge Manrique, *Coplas* (estrofa III): «Nuestras vidas son los ríos / que van a dar en la mar, / que es el morir».`,
      },
      {
        fragmentId: fragRidruejo.id,
        type: "intertextualidad",
        ...anchor(ridruejText, "Como las danzas y olores\nque hemos amado y ya nacen\npara nuevos amadores"),
        order: 2,
        content: `Reescritura directa de las Coplas XVI-XVII de Manrique («¿qué se hizo aquel danzar, / aquellas ropas chapadas / que traían?»). Donde Manrique pregunta por lo que «se hizo», Ridruejo afirma que las danzas y los olores del pasado «ya nacen / para nuevos amadores»: el legado no desaparece, se transmite.`,
        externalCitation: `Jorge Manrique, *Coplas* (estrofa XVII): «¿Qué se hicieron las damas, / sus tocados, sus vestidos, / sus olores? / ¿Qué se hicieron las llamas / de los fuegos encendidos / de amadores?».`,
      },
      {
        fragmentId: fragRidruejo.id,
        type: "figura",
        ...anchor(ridruejText, "Todo es hacerse"),
        order: 3,
        content: `**Anáfora**: la repetición de «Todo es hacerse» / «Todo es vivir» / «Todo es levantar» vertebra el poema y le da un ritmo acumulativo que recuerda la estructura paralelística de las *Coplas*. Frente al lamento manriqueño, Ridruejo propone la acción como respuesta al tiempo.`,
      },
      {
        fragmentId: fragRidruejo.id,
        type: "contexto",
        ...anchor(ridruejText, "El canto es sereno: dice\nla verdad; la está diciendo\nel caballero del tiempo"),
        order: 4,
        content: `El cierre del poema convierte a Manrique en «el caballero del tiempo» —no de la muerte, sino del tiempo que continúa. Ridruejo escribe este poema en los años 50, en la España de posguerra: el «canto sereno» de Manrique es también un modelo ético de decir la verdad sin estridencia, en tiempos difíciles.`,
      },
    ],
  });

  console.log("✓ Ridruejo creado.");

  // ──────────────────────────────────────────────────────────
  // 4. BLAS DE OTERO (1916-1979)
  // ──────────────────────────────────────────────────────────
  console.log("Creando autor Blas de Otero...");
  const otero = await prisma.author.create({
    data: {
      slug: "blas-de-otero",
      name: "Blas de Otero",
      birthYear: 1916,
      deathYear: 1979,
      era: "Siglo XX",
      country: "España",
      bio: `Poeta bilbaíno, una de las voces más poderosas de la poesía social española del siglo XX. Su obra arranca de una angustia existencial y religiosa (*Ángel fieramente humano*, 1950) y evoluciona hacia el compromiso político (*Pido la paz y la palabra*, 1955). Su estilo se caracteriza por la ruptura del verso largo, las citas cultas subvertidas, el humor amargo y la mezcla de registros. «Túmulo de gasoil» es un ejemplo de esta voz: la pregunta manriqueña «¿qué se hizo?» trasladada al Madrid de los años 70.`,
      portraitUrl: null,
    },
  });

  const oteroWork = await prisma.work.create({
    data: {
      slug: "hojas-de-madrid-con-la-galerna",
      title: "Hojas de Madrid con La galerna",
      year: 1983,
      genre: "Poesía",
      synopsis: `Último libro de Blas de Otero, publicado póstumamente. Escrito durante sus últimos años en Madrid, recoge poemas de tono urbano, autobiográfico y crítico. «Túmulo de gasoil» es uno de sus textos más conocidos: una reescritura irreverente del *ubi sunt* manriqueño, donde los «Infantes de Aragón» conviven con los yanquis, el gasoil y la sociedad de consumo.`,
      authorId: otero.id,
    },
  });

  const fragOtero = await prisma.fragment.create({
    data: {
      slug: "otero-tumulo-de-gasoil",
      title: "Túmulo de gasoil",
      location: "Hojas de Madrid con La galerna; Verso y prosa, Cátedra, 1982, pp. 85-86",
      headline: "Hojas sueltas, decidme, qué se hicieron",
      text: oteroText,
      order: 1,
      status: "published",
      featured: false,
      workId: oteroWork.id,
      topics: {
        connect: [
          { slug: "ubi-sunt" },
          { slug: "tempus-fugit" },
          { slug: "contemptus-mundi" },
        ],
      },
      constellations: {
        connect: [
          { slug: "muerte" },
          { slug: "paso-del-tiempo" },
          { slug: "escritura-y-creacion" },
        ],
      },
    },
  });

  await prisma.annotation.createMany({
    data: [
      {
        fragmentId: fragOtero.id,
        type: "intertextualidad",
        ...anchor(oteroText, "Hojas sueltas, decidme, qué se hicieron\nlos Infantes de Aragón"),
        order: 1,
        content: `Reescritura directa del *ubi sunt* manriqueño. Manrique preguntaba: «¿Qué se hizo el rey don Juan? / Los Infantes de Aragón, / ¿qué se hicieron?». Blas de Otero retoma la misma frase —los mismos «Infantes de Aragón»— para actualizarla: junto a ellos aparecen Manuel Granero (el torero muerto en 1922) y «la pavana para una infanta» (la pieza de Ravel, 1899). El tiempo histórico se mezcla con el tiempo de la cultura popular del siglo XX.`,
        externalCitation: `Jorge Manrique, *Coplas* (estrofa XVI): «¿Qué se hizo el rey don Juan? / Los Infantes de Aragón, / ¿qué se hicieron?».`,
      },
      {
        fragmentId: fragOtero.id,
        type: "figura",
        ...anchor(oteroText, "hojas sueltas, caídas\ncomo cristo contra el empedrado"),
        order: 2,
        content: `**Símil** e **imagen blasfema**: el verso largo, de ritmo libre, acumula imágenes de degradación urbana. «Hojas sueltas» es un doble juego: las hojas del árbol (el tiempo que cae) y las hojas del libro de Blas de Otero (cuyo título es precisamente *Hojas de Madrid*). La comparación «como cristo contra el empedrado» mezcla lo sagrado con lo callejero, en el estilo irreverente característico del poeta.`,
      },
      {
        fragmentId: fragOtero.id,
        type: "intertextualidad",
        ...anchor(oteroText, "ciudad donde Jorge Manrique acabaría por jodernos a todos"),
        order: 3,
        content: `El único verso en que aparece el nombre de Manrique es también el más irreverente. Blas de Otero no venera al clásico: lo convoca como cómplice incómodo. La palabra coloquial y el nombre canonizado crean un choque deliberado —es la técnica de la «intertextualidad subversiva»: citar para subvertir, no para rendir homenaje.`,
      },
      {
        fragmentId: fragOtero.id,
        type: "contexto",
        ...anchor(oteroText, "las graves estrofas que nos quiebran los huesos"),
        order: 4,
        content: `El cierre del poema reconoce la fuerza física de la poesía: las estrofas de Manrique «quiebran los huesos» y los «esparcen» bajo el cielo de Madrid. La imagen mezcla la violencia de la posguerra (huesos esparcidos) con la perdurabilidad de la literatura. El «túmulo» del título —el catafalco funerario, como el de don Rodrigo— es ahora de gasoil: sucio, moderno, pero igual de inevitable.`,
      },
    ],
  });

  console.log("✓ Blas de Otero creado.");
  console.log("\n✅ 4 autores intertextuales creados: Bergamín, Neruda, Ridruejo, Blas de Otero.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
