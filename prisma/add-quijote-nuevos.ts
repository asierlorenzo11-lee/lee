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

// ── Textos ────────────────────────────────────────────────────────────────────

const capIText = `En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor. Una olla de algo más vaca que carnero, salpicón las más noches, duelos y quebrantos los sábados, lantejas los viernes, algún palomino de añadidura los domingos, consumían las tres partes de su hacienda. El resto della concluían sayo de velarte, calzas de velludo para las fiestas, con sus pantuflos de lo mesmo, y los días de entresemana se honraba con su vellorí de lo más fino. Tenía en su casa una ama que pasaba de los cuarenta, y una sobrina que no llegaba a los veinte, y un mozo de campo y plaza, que así ensillaba el rocín como tomaba la podadera. Frisaba la edad de nuestro hidalgo con los cincuenta años; era de complexión recia, seco de carnes, enjuto de rostro, gran madrugador y amigo de la caza. Quieren decir que tenía el sobrenombre de Quijada, o Quesada, que en esto hay alguna diferencia en los autores que deste caso escriben; aunque, por conjeturas verosímiles, se deja entender que se llamaba Quejana. Pero esto importa poco a nuestro cuento; basta que en la narración dél no se salga un punto de la verdad.
Es, pues, de saber que este sobredicho hidalgo, los ratos que estaba ocioso, que eran los más del año, se daba a leer libros de caballerías, con tanta afición y gusto, que olvidó casi de todo punto el ejercicio de la caza, y aun la administración de su hacienda. Y llegó a tanto su curiosidad y desatino en esto, que vendió muchas hanegas de tierra de sembradura para comprar libros de caballerías en que leer, y así, llevó a su casa todos cuantos pudo haber dellos; y de todos, ningunos le parecían tan bien como los que compuso el famoso Feliciano de Silva, porque la claridad de su prosa y aquellas entricadas razones suyas le parecían de perlas, y más cuando llegaba a leer aquellos requiebros y cartas de desafíos, donde en muchas partes hallaba escrito: La razón de la sinrazón que a mi razón se hace, de tal manera mi razón enflaquece, que con razón me quejo de la vuestra fermosura.
En resolución, él se enfrascó tanto en su lectura, que se le pasaban las noches leyendo de claro en claro, y los días de turbio en turbio; y así, del poco dormir y del mucho leer, se le secó el celebro, de manera que vino a perder el juicio. Llenósele la fantasía de todo aquello que leía en los libros, así de encantamentos como de pendencias, batallas, desafíos, heridas, requiebros, amores, tormentas y disparates imposibles; y asentósele de tal modo en la imaginación que era verdad toda aquella máquina de aquellas sonadas soñadas invenciones que leía, que para él no había otra historia más cierta en el mundo.
En efeto, rematado ya su juicio, vino a dar en el más estraño pensamiento que jamás dio loco en el mundo; y fue que le pareció convenible y necesario, así para el aumento de su honra como para el servicio de su república, hacerse caballero andante, y irse por todo el mundo con sus armas y caballo a buscar las aventuras y a ejercitarse en todo aquello que él había leído que los caballeros andantes se ejercitaban, deshaciendo todo género de agravio, y poniéndose en ocasiones y peligros donde, acabándolos, cobrase eterno nombre y fama.`;

const batanText = `Pero don Quijote, acompañado de su intrépido corazón, saltó sobre Rocinante, y, embrazando su rodela, terció su lanzón y dijo:
—Sancho amigo, has de saber que yo nací, por querer del cielo, en esta nuestra edad de hierro, para resucitar en ella la de oro, o la dorada, como suele llamarse. Yo soy aquél para quien están guardados los peligros, las grandes hazañas, los valerosos hechos. Yo soy, digo otra vez, quien ha de resucitar los de la Tabla Redonda. Bien notas, escudero fiel y legal, las tinieblas desta noche, su estraño silencio, el sordo y confuso estruendo destos árboles, el temeroso ruido de aquella agua en cuya busca venimos, que parece que se despeña y derrumba desde los altos montes de la luna, y aquel incesable golpear que nos hiere y lastima los oídos; las cuales cosas, todas juntas y cada una por sí, son bastantes a infundir miedo, temor y espanto en el pecho del mesmo Marte, cuanto más en aquel que no está acostumbrado a semejantes acontecimientos y aventuras. Pues todo esto que yo te pinto son incentivos y despertadores de mi ánimo, que ya hace que el corazón me reviente en el pecho, con el deseo que tiene de acometer esta aventura, por más dificultosa que se muestra. Así que, aprieta un poco las cinchas a Rocinante y quédate a Dios, y espérame aquí hasta tres días no más, en los cuales, si no volviere, puedes tú volverte a nuestra aldea.
En esto, parece ser, o que el frío de la mañana, que ya venía, o que Sancho hubiese cenado algunas cosas lenitivas, o que fuese cosa natural —que es lo que más se debe creer—, a él le vino en voluntad y deseo de hacer lo que otro no pudiera hacer por él; mas era tanto el miedo que había entrado en su corazón, que no osaba apartarse un negro de uña de su amo. Y así, lo que hizo, por bien de paz, fue soltar la mano derecha, que tenía asida al arzón trasero, con la cual, bonitamente y sin rumor alguno, se soltó la lazada corrediza con que los calzones se sostenían, sin ayuda de otra alguna, y, en quitándosela, dieron luego abajo y se le quedaron como grillos.
—¿Qué rumor es ése, Sancho?
—No sé, señor —respondió él—. Alguna cosa nueva debe de ser, que las aventuras y desventuras nunca comienzan por poco.
—Paréceme, Sancho, que tienes mucho miedo.
—Sí tengo —respondió Sancho—; mas, ¿en qué lo echa de ver vuestra merced ahora más que nunca?
—En que ahora más que nunca hueles, y no a ámbar —respondió don Quijote.
—Bien podrá ser —dijo Sancho—; mas yo no tengo la culpa, sino vuestra merced, que me trae a deshoras y por estos no acostumbrados pasos.
Cuando don Quijote vio lo que era, enmudeció y pasmóse de arriba abajo. Miróle Sancho, y vio que tenía la cabeza inclinada sobre el pecho, con muestras de estar corrido. Miró también don Quijote a Sancho, y viole que tenía los carrillos hinchados y la boca llena de risa, con evidentes señales de querer reventar con ella.`;

const consejosIText = `Haz gala, Sancho, de la humildad de tu linaje, y no te desprecies de decir que vienes de labradores; porque, viendo que no te corres, ninguno se pondrá a correrte; y préciate más de ser humilde virtuoso que pecador soberbio. Innumerables son aquellos que, de baja estirpe nacidos, han subido a la suma dignidad pontificia e imperatoria; y desta verdad te pudiera traer tantos ejemplos, que te cansaran. Mira, Sancho: si tomas por medio a la virtud, y te precias de hacer hechos virtuosos, no hay para qué tener envidia a los que los tienen de príncipes y señores, porque la sangre se hereda y la virtud se aquista, y la virtud vale por sí sola lo que la sangre no vale.
Procura descubrir la verdad por entre las promesas y dádivas del rico, como por entre los sollozos e importunidades del pobre. Cuando pudiere y debiere tener lugar la equidad, no cargues todo el rigor de la ley al delincuente, que no es mejor la fama del juez riguroso que la del compasivo. Si acaso doblares la vara de la justicia, no sea con el peso de la dádiva, sino con el de la misericordia. Cuando te sucediere juzgar algún pleito de algún tu enemigo, aparta las mientes de tu injuria y ponlas en la verdad del caso. Si alguna mujer hermosa veniere a pedirte justicia, quita los ojos de sus lágrimas y tus oídos de sus gemidos, y considera de espacio la sustancia de lo que pide, si no quieres que se anegue tu razón en su llanto y tu bondad en sus suspiros. Al que has de castigar con obras no trates mal con palabras, pues le basta al desdichado la pena del suplicio, sin la añadidura de las malas razones. Al culpado que cayere debajo de tu juridición considérale hombre miserable, sujeto a las condiciones de la depravada naturaleza nuestra, y en todo cuanto fuere de tu parte, sin hacer agravio a la contraria, muéstratele piadoso y clemente, porque, aunque los atributos de Dios todos son iguales, más resplandece y campea a nuestro ver el de la misericordia que el de la justicia.`;

const consejosIIText = `¿Quién oyera el pasado razonamiento de don Quijote que no le tuviera por persona muy cuerda y mejor intencionada? Pero, como muchas veces en el progreso desta grande historia queda dicho, solamente disparaba en tocándole en la caballería, y en los demás discursos mostraba tener claro y desenfadado entendimiento, de manera que a cada paso desacreditaban sus obras su juicio, y su juicio sus obras.
No andes, Sancho, desceñido y flojo, que el vestido descompuesto da indicios de ánimo desmazalado. Toma con discreción el pulso a lo que pudiere valer tu oficio, y si sufriere que des librea a tus criados, dásela honesta y provechosa más que vistosa y bizarra, y repártela entre tus criados y los pobres: quiero decir que si has de vestir seis pajes, viste tres y otros tres pobres, y así tendrás pajes para el cielo y para el suelo. No comas ajos ni cebollas, porque no saquen por el olor tu villanería. Come poco y cena más poco, que la salud de todo el cuerpo se fragua en la oficina del estómago. Sé templado en el beber, considerando que el vino demasiado ni guarda secreto ni cumple palabra.
—Eso de erutar no entiendo —dijo Sancho.
Y don Quijote le dijo:
—Erutar, Sancho, quiere decir regoldar, y éste es uno de los más torpes vocablos que tiene la lengua castellana, aunque es muy sinificativo; y así, la gente curiosa se ha acogido al latín, y al regoldar dice erutar, y a los regüeldos, erutaciones; y, cuando algunos no entienden estos términos, importa poco, que el uso los irá introduciendo con el tiempo, que con facilidad se entiendan; y esto es enriquecer la lengua, sobre quien tiene poder el vulgo y el uso.
—También, Sancho, no has de mezclar en tus pláticas la muchedumbre de refranes que sueles; que, puesto que los refranes son sentencias breves, muchas veces los traes tan por los cabellos, que más parecen disparates que sentencias.`;

const muerteText = `—Dadme albricias, buenos señores, de que ya yo no soy don Quijote de la Mancha, sino Alonso Quijano, a quien mis costumbres me dieron renombre de Bueno. Ya soy enemigo de Amadís de Gaula y de toda la infinita caterva de su linaje, ya me son odiosas todas las historias profanas del andante caballería, ya conozco mi necedad y el peligro en que me pusieron haberlas leído, ya, por misericordia de Dios, escarmentando en cabeza propia, las abomino.
—¡Ay! —respondió Sancho, llorando—: no se muera vuestra merced, señor mío, sino tome mi consejo y viva muchos años, porque la mayor locura que puede hacer un hombre en esta vida es dejarse morir, sin más ni más, sin que nadie le mate, ni otras manos le acaben que las de la melancolía. Mire no sea perezoso, sino levántese desa cama, y vámonos al campo vestidos de pastores, como tenemos concertado: quizá tras de alguna mata hallaremos a la señora doña Dulcinea desencantada, que no haya más que ver.
—Señores —dijo don Quijote—, vámonos poco a poco, pues ya en los nidos de antaño no hay pájaros hogaño: yo fui loco, y ya soy cuerdo; fui don Quijote de la Mancha, y soy agora, como he dicho, Alonso Quijano el Bueno. Pueda con vuestras mercedes mi arrepentimiento y mi verdad volverme a la estimación que de mí se tenía.
—Ítem, suplico a los dichos señores mis albaceas que si la buena suerte les trujere a conocer al autor que dicen que compuso una historia que anda por ahí con el título de Segunda parte de las hazañas de don Quijote de la Mancha, de mi parte le pidan, cuan encarecidamente ser pueda, perdone la ocasión que sin yo pensarlo le di de haber escrito tantos y tan grandes disparates como en ella escribe, porque parto desta vida con escrúpulo de haberle dado motivo para escribirlos.
En fin, llegó el último de don Quijote, después de recebidos todos los sacramentos, y después de haber abominado con muchas y eficaces razones de los libros de caballerías. Hallóse el escribano presente, y dijo que nunca había leído en ningún libro de caballerías que algún caballero andante hubiese muerto en su lecho tan sosegadamente y tan cristiano como don Quijote; el cual, entre compasiones y lágrimas de los que allí se hallaron, dio su espíritu: quiero decir que se murió.`;

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const quijote = await prisma.work.findFirstOrThrow({
    where: { slug: "don-quijote-de-la-mancha" },
  });
  console.log(`Obra: ${quijote.title} (id ${quijote.id})`);

  // ── FRAGMENTO 1: Cap. I ───────────────────────────────────────────────────
  const existsCapI = await prisma.fragment.findFirst({ where: { slug: "en-un-lugar-de-la-mancha" } });
  if (existsCapI) { console.log("  skip en-un-lugar-de-la-mancha"); }
  else { console.log("Creando «En un lugar de la Mancha»..."); }

  const fragCapI = existsCapI ?? await prisma.fragment.create({
    data: {
      slug: "en-un-lugar-de-la-mancha",
      title: "El retrato del hidalgo",
      location: "El ingenioso hidalgo don Quijote de la Mancha, 1ª parte, cap. I",
      headline: "Del poco dormir y del mucho leer se le secó el celebro",
      text: capIText,
      order: 2,
      status: "published",
      featured: false,
      workId: quijote.id,
      constellations: { connect: [{ slug: "poder" }] },
      topics: { connect: [{ slug: "desengano" }] },
      characters: { connect: [{ slug: "don-quijote" }] },
      artworkImageUrl: "/images/artworks/goya-sueno-razon.jpg",
      artworkTitle: "El sueño de la razón produce monstruos",
      artworkAuthor: "Francisco de Goya, 1799",
      artworkCaption:
        "Goya grabó esta pesadilla casi dos siglos después que Cervantes escribiera el Quijote, pero la imagen capta la misma idea: cuando la razón se adormece, los monstruos de la fantasía se apoderan del durmiente. Don Quijote no se duermió: leyó hasta que la razón se le fue.",
    },
  });

  if (!existsCapI) {
    console.log("Creando anotaciones de «En un lugar de la Mancha»...");
    await prisma.annotation.createMany({
      data: [
        // ── Glosas ──────────────────────────────────────────────────────────
        {
          fragmentId: fragCapI.id,
          type: "glosa",
          ...anchor(capIText, "lanza en astillero"),
          order: 1,
          content: `«Lanza en astillero»: hidalgo de segunda categoría que tenía derecho a portar lanza. El «astillero» es el soporte donde se guardaba la lanza. Esta fórmula identifica al protagonista como un pequeño noble sin recursos pero con pretensiones.`,
        },
        {
          fragmentId: fragCapI.id,
          type: "glosa",
          ...anchor(capIText, "adarga antigua"),
          order: 2,
          content: `«Adarga»: escudo de cuero ovalado o en forma de corazón. El adjetivo «antigua» es significativo: el equipo del hidalgo es viejo y anticuado, igual que el código de valores caballerescos que intentará resucitar.`,
        },
        {
          fragmentId: fragCapI.id,
          type: "glosa",
          ...anchor(capIText, "salpicón las más noches"),
          order: 3,
          content: `«Salpicón»: plato de carne desmenuzada, fría, con pimienta, vinagre, cebolla y sal. Era comida humilde. La descripción de los menús semanales pinta con precisión socioeconómica: el hidalgo come lo justo para sobrevivir con cierta dignidad.`,
        },
        {
          fragmentId: fragCapI.id,
          type: "glosa",
          ...anchor(capIText, "duelos y quebrantos"),
          order: 4,
          content: `«Duelos y quebrantos»: fritada de huevos con torreznos o sesos de cordero, permitida el sábado porque no era carne «roja» sino despojos. El nombre irónico («duelos», «quebrantos») refleja que el precepto eclesiástico de abstinencia los sábados era incómodo hasta para los comensales más humildes.`,
        },
        {
          fragmentId: fragCapI.id,
          type: "glosa",
          ...anchor(capIText, "vellorí de lo más fino"),
          order: 5,
          content: `«Vellorí»: paño de lana sin teñir, de color pardo ceniciento, de calidad media-baja. Que lo llame «de lo más fino» es un guiño irónico: el hidalgo se enorgullece de lo que tiene, aunque sea modesto. Cervantes caracteriza así la mentalidad de quien vive por encima de sus posibilidades.`,
        },
        {
          fragmentId: fragCapI.id,
          type: "glosa",
          ...anchor(capIText, "hanegas de tierra"),
          order: 6,
          content: `«Hanega» (también «fanega»): unidad de superficie agraria equivalente a unos 6.400 m². El hidalgo vende tierras de cultivo —su principal fuente de ingresos— para comprar libros. Este detalle no es anecdótico: define su locura como económicamente ruinosa.`,
        },
        {
          fragmentId: fragCapI.id,
          type: "glosa",
          ...anchor(capIText, "La razón de la sinrazón"),
          order: 7,
          content: `Este trabalenguas es la parodia de la prosa real de Feliciano de Silva (1480-1551), autor prolífico de novelas de caballerías. Cervantes cita con exactitud el tipo de estilo que se burlaba: frases rellenas de «razón» que no dicen nada, una jungla de palabras sin sentido. La parodia funciona porque el lector coetáneo reconocía el modelo.`,
        },
        {
          fragmentId: fragCapI.id,
          type: "glosa",
          ...anchor(capIText, "se le secó el celebro"),
          order: 8,
          content: `«Celebro»: forma arcaica de «cerebro». La «sequedad de cerebro» era, según la medicina galénica del XVI, la causa de los delirios. Cervantes usa la teoría de los humores para «explicar» la locura de don Quijote con un barniz pseudo-científico que refuerza la parodia.`,
        },

        // ── Contexto ────────────────────────────────────────────────────────
        {
          fragmentId: fragCapI.id,
          type: "contexto",
          ...anchor(capIText, "de cuyo nombre no quiero acordarme"),
          order: 1,
          content: `La deliberada vaguedad del comienzo —«de cuyo nombre no quiero acordarme»— es uno de los gestos más modernos de la novela. Cervantes no dice «no sé» sino «no quiero»: es un narrador que tiene memoria pero elige callar. Esto convierte el libro en una historia que podría haber ocurrido en cualquier pueblo de La Mancha, y al mismo tiempo subraya que la ficción sabe que es ficción.`,
        },
        {
          fragmentId: fragCapI.id,
          type: "contexto",
          ...anchor(capIText, "hidalgo de los de lanza en astillero"),
          order: 2,
          content: `El «hidalgo» es el escalafón más bajo de la nobleza española del XVI. No pagaba impuestos directos, pero tampoco tenía renta suficiente para vivir con holgura. Muchos hidalgos pobres vivían obsesionados con su limpieza de sangre (sin antepasados judíos ni moros) y con mantener las apariencias de su rango. Esta tensión entre realidad y apariencia es el motor de todo el libro.`,
        },

        // ── Figuras ─────────────────────────────────────────────────────────
        {
          fragmentId: fragCapI.id,
          type: "figura",
          category: "sintaxis",
          ...anchor(capIText, "lanza en astillero, adarga antigua, rocín flaco y galgo corredor"),
          order: 1,
          content: `**Asíndeton y enumeración paratáctica**: cuatro elementos sin apenas conjunciones crean un inventario rápido y seco del hidalgo: armas, cabalgadura y perro de caza. La brevedad imita el estilo de los inventarios notariales, ridiculizando el pretencioso equipo caballeresco con un registro prosaico.`,
        },
        {
          fragmentId: fragCapI.id,
          type: "figura",
          category: "tropo",
          ...anchor(capIText, "La razón de la sinrazón que a mi razón se hace, de tal manera mi razón enflaquece, que con razón me quejo de la vuestra fermosura"),
          order: 2,
          content: `**Políptoton y parodia**: la repetición de «razón» en cinco formas diferentes (razón, sinrazón, razón, razón, razón) crea una frase que parece decir mucho pero no dice nada. Es una parodia del estilo conceptista extremo de las novelas de caballerías. El lector ríe precisamente porque reconoce el absurdo que don Quijote admira.`,
        },
        {
          fragmentId: fragCapI.id,
          type: "figura",
          category: "sintaxis",
          ...anchor(capIText, "se le pasaban las noches leyendo de claro en claro, y los días de turbio en turbio"),
          order: 3,
          content: `**Antítesis y quiasmo**: «noches / de claro en claro» vs. «días / de turbio en turbio». La noche es para el sueño pero él la pasa despierto («en claro»); el día es para la actividad pero lo pasa adormilado («en turbio»). El cruce (quiasmo) entre noche-claro y día-turbio muestra el trastorno de su ritmo vital de forma elegante y sintética.`,
        },

        // ── Preguntas ───────────────────────────────────────────────────────
        {
          fragmentId: fragCapI.id,
          type: "pregunta",
          questionGroup: "literal",
          order: 1,
          content: `¿Cómo es la situación económica del hidalgo? Localiza en el texto qué come cada día de la semana y cómo gasta lo que le sobra. ¿Qué nos dice esto sobre su posición social?`,
        },
        {
          fragmentId: fragCapI.id,
          type: "pregunta",
          questionGroup: "literal",
          order: 2,
          content: `¿Por qué enloquece el hidalgo? Describe el proceso: ¿qué leía, cuánto leía y qué consecuencia tuvo esa lectura en su mente?`,
        },
        {
          fragmentId: fragCapI.id,
          type: "pregunta",
          questionGroup: "interpretativo",
          order: 1,
          content: `Cervantes elige no revelar el nombre del pueblo («de cuyo nombre no quiero acordarme»). ¿Por qué crees que lo hace? ¿Qué efecto produce en el lector esa vaguedad deliberada?`,
        },
        {
          fragmentId: fragCapI.id,
          type: "pregunta",
          questionGroup: "interpretativo",
          order: 2,
          content: `La prosa que don Quijote admira —«La razón de la sinrazón…»— es un trabalenguas sin sentido. ¿Qué nos dice esto sobre el tipo de literatura que Cervantes quiere parodiar? ¿Existe hoy un equivalente a los libros de caballerías que podría tener ese mismo efecto sobre un lector?`,
        },
        {
          fragmentId: fragCapI.id,
          type: "pregunta",
          questionGroup: "valorativo",
          order: 1,
          content: `El texto sugiere que leer en exceso puede conducir a la locura. ¿Crees que Cervantes está criticando la lectura en sí, o algo más concreto? ¿Puede un tipo de contenido (libros, series, redes sociales) distorsionar nuestra percepción de la realidad de forma similar a como los libros de caballerías distorsionaron la de don Quijote?`,
        },
      ],
    });
  } // end if (!existsCapI)

  // ── FRAGMENTO 2: Cap. XX - Los batanes ───────────────────────────────────
  const existsBatan = await prisma.fragment.findFirst({ where: { slug: "la-aventura-de-los-batanes" } });
  if (existsBatan) { console.log("  skip la-aventura-de-los-batanes"); }
  else { console.log("Creando «La aventura de los batanes»..."); }

  const fragBatan = existsBatan ?? await prisma.fragment.create({
    data: {
      slug: "la-aventura-de-los-batanes",
      title: "La aventura de los batanes",
      location: "El ingenioso hidalgo don Quijote de la Mancha, 1ª parte, cap. XX",
      headline: "Las aventuras y desventuras nunca comienzan por poco",
      text: batanText,
      order: 3,
      status: "published",
      featured: false,
      workId: quijote.id,
      constellations: { connect: [{ slug: "honor-y-valor" }] },
      topics: { connect: [{ slug: "desengano" }] },
      characters: { connect: [{ slug: "don-quijote" }, { slug: "sancho-panza" }] },
      artworkImageUrl: "/images/artworks/velazquez-menipo.jpg",
      artworkTitle: "Menipo",
      artworkAuthor: "Diego Velázquez, h. 1636-1640",
      artworkCaption:
        "Menipo de Gádara fue un filósofo cínico que ridiculizó la pompa y el poder desde la pobreza más radical. Velázquez lo pintó como un mendigo sonriente. Hay algo de Sancho Panza en esta figura: la sabiduría práctica que se ríe donde el idealismo se horroriza.",
    },
  });

  if (!existsBatan) {
    console.log("Creando anotaciones de «La aventura de los batanes»...");
    await prisma.annotation.createMany({
      data: [
        // ── Glosas ──────────────────────────────────────────────────────────
        {
          fragmentId: fragBatan.id,
          type: "glosa",
          ...anchor(batanText, "embrazando su rodela"),
          order: 1,
          content: `«Rodela»: escudo redondo y delgado que se embrazaba (sujetaba con el brazo izquierdo). El gesto de don Quijote —saltar sobre Rocinante y «embrazar la rodela»— imita exactamente la postura que había leído en los libros de caballerías. Su cuerpo actúa el texto literario.`,
        },
        {
          fragmentId: fragBatan.id,
          type: "glosa",
          ...anchor(batanText, "lenitivas"),
          order: 2,
          content: `«Lenitivas»: sustancias laxantes o suavizantes. El narrador ofrece tres explicaciones del trance intestinal de Sancho —el frío, lo que cenó, o «cosa natural»— y elige la tercera como «lo que más se debe creer». Es un alarde de falsa objetividad que hace aún más cómica la escena.`,
        },
        {
          fragmentId: fragBatan.id,
          type: "glosa",
          ...anchor(batanText, "no osaba apartarse un negro de uña de su amo"),
          order: 3,
          content: `«Un negro de uña»: expresión coloquial que significa 'ni lo más mínimo'. «Negro» era la partícula sucia bajo la uña, la más pequeña cantidad imaginable. Sancho tenía tanto miedo que ni la distancia más ínfima era capaz de alejarse de don Quijote, a pesar de la urgencia fisiológica.`,
        },
        {
          fragmentId: fragBatan.id,
          type: "glosa",
          ...anchor(batanText, "arzón trasero"),
          order: 4,
          content: `«Arzón»: parte delantera o trasera de la silla de montar. El arzón trasero es la «grupa» de la silla. Sancho va a la grupa de Rocinante, o en su propio asno, y sujeta el arzón trasero como agarradero. El detalle topográfico exacto refuerza el realismo grotesco de la escena.`,
        },
        {
          fragmentId: fragBatan.id,
          type: "glosa",
          ...anchor(batanText, "se le quedaron como grillos"),
          order: 5,
          content: `«Grillos»: grilletes, esposas de metal para los pies. Los calzones caídos quedan alrededor de los tobillos como si fueran grilletes. La comparación es a la vez exacta (descripción de la posición) e irónica (Sancho, esclavo del miedo, acaba literalmente encadenado por sus propios pantalones).`,
        },

        // ── Contexto ────────────────────────────────────────────────────────
        {
          fragmentId: fragBatan.id,
          type: "contexto",
          ...anchor(batanText, "edad de hierro, para resucitar en ella la de oro"),
          order: 1,
          content: `Don Quijote habla de «resucitar la Edad de Oro» en un discurso caballeresco nocturno que mezcla grandiosidad épica con el ruido de unos mazos de tintorería hidráulica. La «Edad de Oro» es el mito clásico (Hesíodo, Ovidio) de un tiempo primitivo de paz y abundancia. Cervantes combina lo heroico y lo vulgar con una precisión destructiva.`,
        },
        {
          fragmentId: fragBatan.id,
          type: "contexto",
          ...anchor(batanText, "carrillos hinchados y la boca llena de risa"),
          order: 2,
          content: `Al final del episodio, cuando se descubre que el «monstruo» nocturno no era más que unos batanes (máquinas de lavar paños), don Quijote se avergüenza y Sancho no puede contenerse. La risa de Sancho es un elemento recurrente en la novela: el escudero ríe lo que el amo no puede. Es la forma en que la realidad se venga del idealismo.`,
        },

        // ── Figuras ─────────────────────────────────────────────────────────
        {
          fragmentId: fragBatan.id,
          type: "figura",
          category: "sintaxis",
          ...anchor(batanText, "las tinieblas desta noche, su estraño silencio, el sordo y confuso estruendo destos árboles"),
          order: 1,
          content: `**Enumeración lírica / amplificatio**: don Quijote construye un paisaje gótico de terror —tinieblas, silencio, estruendo, agua— mediante una larga enumeración que imita el estilo oratorio de los discursos caballerescos. La ironía es que todo ese aparato retórico describe... el ruido de una fábrica textil.`,
        },
        {
          fragmentId: fragBatan.id,
          type: "figura",
          category: "tropo",
          ...anchor(batanText, "hueles, y no a ámbar"),
          order: 2,
          content: `**Lítotes con ironía**: «no a ámbar» significa eufemísticamente que Sancho huele a materia fecal. El ámbar gris (sustancia aromática de origen animal) era el perfume de lujo del siglo XVII. La negación elegante de lo agradable equivale a la afirmación brutal de lo desagradable, con la distancia irónica del narrador caballeresco.`,
        },
        {
          fragmentId: fragBatan.id,
          type: "figura",
          category: "sintaxis",
          ...anchor(batanText, "las aventuras y desventuras nunca comienzan por poco"),
          order: 3,
          content: `**Sentencia / refrán**: la respuesta de Sancho —«Alguna cosa nueva debe de ser, que las aventuras y desventuras nunca comienzan por poco»— es uno de sus momentos más brillantes. En vez de confesar lo que ha hecho, da una razón filosófica de por qué debería haber ruido en momentos extraordinarios. El refrán improvisado sirve como coartada.`,
        },

        // ── Preguntas ───────────────────────────────────────────────────────
        {
          fragmentId: fragBatan.id,
          type: "pregunta",
          questionGroup: "literal",
          order: 1,
          content: `¿Qué hace don Quijote al principio del episodio y qué dice en su discurso? ¿Qué le pide a Sancho que haga? ¿Cómo reacciona Sancho ante el miedo?`,
        },
        {
          fragmentId: fragBatan.id,
          type: "pregunta",
          questionGroup: "literal",
          order: 2,
          content: `¿Qué excusa da Sancho cuando don Quijote le pregunta qué rumor es ese? ¿Y qué responde cuando don Quijote le dice que «huele, y no a ámbar»?`,
        },
        {
          fragmentId: fragBatan.id,
          type: "pregunta",
          questionGroup: "interpretativo",
          order: 1,
          content: `El discurso de don Quijote sobre la «Edad de Oro» es grandilocuente y heroico. ¿Qué efecto produce el contraste entre ese discurso y lo que está haciendo Sancho justo mientras escucha? ¿Qué técnica narrativa usa Cervantes aquí?`,
        },
        {
          fragmentId: fragBatan.id,
          type: "pregunta",
          questionGroup: "valorativo",
          order: 1,
          content: `Este episodio es uno de los más escatológicos y cómicos de la novela. ¿Cómo consigue Cervantes que la escena sea graciosa sin resultar simplemente vulgar? ¿Qué nos dice sobre el tipo de humor que pretende?`,
        },
      ],
    });
  } // end if (!existsBatan)

  // ── FRAGMENTO 3: Cap. XLII - Consejos a Sancho (linaje y justicia) ────────
  const existsConsejosI = await prisma.fragment.findFirst({ where: { slug: "consejos-a-sancho-linaje-y-justicia" } });
  if (existsConsejosI) { console.log("  skip consejos-a-sancho-linaje-y-justicia"); }
  else { console.log("Creando «Consejos a Sancho: linaje y justicia»..."); }

  const fragConsejosI = existsConsejosI ?? await prisma.fragment.create({
    data: {
      slug: "consejos-a-sancho-linaje-y-justicia",
      title: "Consejos a Sancho: linaje y justicia",
      location: "El ingenioso hidalgo don Quijote de la Mancha, 2ª parte, cap. XLII",
      headline: "La sangre se hereda y la virtud se aquista",
      text: consejosIText,
      order: 4,
      status: "published",
      featured: false,
      workId: quijote.id,
      constellations: { connect: [{ slug: "poder" }, { slug: "critica-social" }] },
      topics: { connect: [{ slug: "contemptus-mundi" }] },
      characters: { connect: [{ slug: "don-quijote" }, { slug: "sancho-panza" }] },
      artworkImageUrl: "/images/artworks/velazquez-rendicion-breda.jpg",
      artworkTitle: "La rendición de Breda (Las lanzas)",
      artworkAuthor: "Diego Velázquez, 1635",
      artworkCaption:
        "Velázquez pintó la rendición de una ciudad flamenca mostrando dignidad en la derrota: el español no humilla al vencido, sino que lo recibe con respeto. Es exactamente la idea que don Quijote transmite a Sancho: el poder verdadero se ejerce con compasión y misericordia, no con rigor.",
    },
  });

  if (!existsConsejosI) {
    console.log("Creando anotaciones de «Consejos a Sancho: linaje y justicia»...");
    await prisma.annotation.createMany({
      data: [
        // ── Glosas ──────────────────────────────────────────────────────────
        {
          fragmentId: fragConsejosI.id,
          type: "glosa",
          ...anchor(consejosIText, "no te corres"),
          order: 1,
          content: `«Correrse»: avergonzarse, sentir bochorno. Todavía se usa en algunos registros («me corrí de vergüenza»). Don Quijote aconseja a Sancho no avergonzarse de su origen humilde: si él mismo no se avergüenza, nadie podrá herirle con ese argumento.`,
        },
        {
          fragmentId: fragConsejosI.id,
          type: "glosa",
          ...anchor(consejosIText, "la virtud se aquista"),
          order: 2,
          content: `«Aquistar»: adquirir, conseguir por mérito propio (del italiano «acquistare»). La frase «la sangre se hereda y la virtud se aquista» es una de las sentencias más memorables del Quijote: la nobleza de sangre es un accidente del nacimiento, pero la virtud exige esfuerzo y decisión personal.`,
        },
        {
          fragmentId: fragConsejosI.id,
          type: "glosa",
          ...anchor(consejosIText, "dádivas del rico"),
          order: 3,
          content: `«Dádivas»: regalos, ofrendas, sobornos velados. Don Quijote advierte a Sancho que los ricos intentarán corromperle con dádivas. El consejo de descubrir «la verdad por entre las promesas y dádivas del rico» es un manual de ética judicial que sigue siendo moderno.`,
        },
        {
          fragmentId: fragConsejosI.id,
          type: "glosa",
          ...anchor(consejosIText, "doblares la vara de la justicia"),
          order: 4,
          content: `«Vara de la justicia»: bastón o cetro que el juez o alcalde llevaba como símbolo de autoridad. «Doblar la vara» significaba torcerla, corromperse. La imagen es un tópico jurídico del siglo XVII: la vara recta simboliza la justicia; la vara doblada, la corrupción.`,
        },
        {
          fragmentId: fragConsejosI.id,
          type: "glosa",
          ...anchor(consejosIText, "importunidades del pobre"),
          order: 5,
          content: `«Importunidades»: insistencias molestas, ruegos repetidos. El pobre pide con lágrimas y repetición porque no tiene otro recurso; el rico paga y presiona. Don Quijote advierte que ninguna de las dos estrategias debe torcer el juicio: ni el llanto del débil ni el oro del poderoso.`,
        },

        // ── Contexto ────────────────────────────────────────────────────────
        {
          fragmentId: fragConsejosI.id,
          type: "contexto",
          ...anchor(consejosIText, "Haz gala, Sancho, de la humildad de tu linaje"),
          order: 1,
          content: `En la segunda parte del Quijote (1615), Sancho va a gobernar la «ínsula Barataria», una broma de los duques. Antes de partir, don Quijote le da este discurso de consejos. La paradoja es llamativa: un hombre considerado loco da los consejos más cuerdos del libro sobre justicia, linaje y gobierno. Cervantes usa la locura del protagonista para decir verdades que los cuerdos callan.`,
        },
        {
          fragmentId: fragConsejosI.id,
          type: "contexto",
          ...anchor(consejosIText, "de baja estirpe nacidos"),
          order: 2,
          content: `La obsesión por la «limpieza de sangre» (no tener antepasados judíos, moros o conversos) marcó la sociedad española de los siglos XVI y XVII. Los estatutos de limpieza de sangre cerraban el acceso a cargos públicos, órdenes religiosas y colegios mayores a quienes no podían probarla. Que don Quijote anime a Sancho a enorgullecerse de ser labrador —no converso, pero sí de baja extracción— es una crítica velada a esa obsesión.`,
        },

        // ── Figuras ─────────────────────────────────────────────────────────
        {
          fragmentId: fragConsejosI.id,
          type: "figura",
          category: "tropo",
          ...anchor(consejosIText, "la sangre se hereda y la virtud se aquista"),
          order: 1,
          content: `**Antítesis y sentencia**: la frase opone «hereda» (pasivo, accidental, ajeno al mérito) con «aquista» (activo, ganado con esfuerzo). La brevedad y el paralelismo la convierten en máxima filosófica. Es una de las formulaciones más claras del pensamiento humanista renacentista sobre la dignidad del individuo frente al accidente del nacimiento.`,
        },
        {
          fragmentId: fragConsejosI.id,
          type: "figura",
          category: "tropo",
          ...anchor(consejosIText, "no sea con el peso de la dádiva, sino con el de la misericordia"),
          order: 2,
          content: `**Antítesis con metonimia**: «el peso de la dádiva» frente a «el peso de la misericordia». La «vara de la justicia» no debe doblarse por el dinero (peso material), sino inclinarse por la compasión (peso moral). La misma imagen del peso y la balanza, símbolo universal de la justicia, se resignifica: hay cosas más pesadas que el oro.`,
        },
        {
          fragmentId: fragConsejosI.id,
          type: "figura",
          category: "tropo",
          ...anchor(consejosIText, "más resplandece y campea a nuestro ver el de la misericordia que el de la justicia"),
          order: 3,
          content: `**Gradación y paradoja teológica**: el cierre del pasaje es una inversión de la teología tradicional, que ponía la justicia de Dios al mismo nivel que su misericordia. Don Quijote (y Cervantes) se inclinan por la misericordia como el atributo más «resplandeciente». Es un guiño erasmista: la religión del corazón por encima de la ley.`,
        },

        // ── Preguntas ───────────────────────────────────────────────────────
        {
          fragmentId: fragConsejosI.id,
          type: "pregunta",
          questionGroup: "literal",
          order: 1,
          content: `¿Qué dos grandes temas aborda don Quijote en sus consejos? Resume en una frase cada uno.`,
        },
        {
          fragmentId: fragConsejosI.id,
          type: "pregunta",
          questionGroup: "literal",
          order: 2,
          content: `¿Qué debe hacer Sancho cuando un rico y un pobre pleiten ante él? ¿Cómo debe reaccionar ante las lágrimas de una mujer hermosa?`,
        },
        {
          fragmentId: fragConsejosI.id,
          type: "pregunta",
          questionGroup: "interpretativo",
          order: 1,
          content: `Don Quijote es un personaje considerado «loco» en la novela y, sin embargo, da los consejos más sensatos del libro. ¿Qué técnica narrativa usa Cervantes al poner estas ideas en boca de un loco? ¿Por qué eso hace el mensaje más eficaz?`,
        },
        {
          fragmentId: fragConsejosI.id,
          type: "pregunta",
          questionGroup: "valorativo",
          order: 1,
          content: `Don Quijote aconseja a Sancho que prefiera «ser humilde virtuoso que pecador soberbio». ¿Crees que ese consejo sería escuchado por los gobernantes actuales? ¿Cuál de sus consejos sobre la justicia te parece más urgente en el mundo de hoy?`,
        },
      ],
    });
  } // end if (!existsConsejosI)

  // ── FRAGMENTO 4: Cap. XLIII - Consejos a Sancho (aseo y modales) ─────────
  const existsConsejosII = await prisma.fragment.findFirst({ where: { slug: "consejos-a-sancho-aseo-y-modales" } });
  if (existsConsejosII) { console.log("  skip consejos-a-sancho-aseo-y-modales"); }
  else { console.log("Creando «Consejos a Sancho: aseo y modales»..."); }

  const fragConsejosII = existsConsejosII ?? await prisma.fragment.create({
    data: {
      slug: "consejos-a-sancho-aseo-y-modales",
      title: "Consejos a Sancho: aseo y modales",
      location: "El ingenioso hidalgo don Quijote de la Mancha, 2ª parte, cap. XLIII",
      headline: "Erutar, Sancho, quiere decir regoldar",
      text: consejosIIText,
      order: 5,
      status: "published",
      featured: false,
      workId: quijote.id,
      constellations: { connect: [{ slug: "critica-social" }] },
      topics: { connect: [{ slug: "desengano" }] },
      characters: { connect: [{ slug: "don-quijote" }, { slug: "sancho-panza" }] },
      artworkImageUrl: "/images/artworks/velazquez-vieja-friendo.jpg",
      artworkTitle: "Vieja friendo huevos",
      artworkAuthor: "Diego Velázquez, 1618",
      artworkCaption:
        "Con apenas veinte años, Velázquez pintó esta escena de cocina con una precisión casi táctil: la anciana, los huevos, el aceite caliente, la loza. El mismo espíritu de atención a lo cotidiano y humilde recorre los consejos que don Quijote da a Sancho sobre el comer, el beber y el aseo.",
    },
  });

  if (!existsConsejosII) {
    console.log("Creando anotaciones de «Consejos a Sancho: aseo y modales»...");
    await prisma.annotation.createMany({
      data: [
        // ── Glosas ──────────────────────────────────────────────────────────
        {
          fragmentId: fragConsejosII.id,
          type: "glosa",
          ...anchor(consejosIIText, "solamente disparaba en tocándole en la caballería"),
          order: 1,
          content: `«Disparar»: aquí significa 'delirar', 'desatinar'. Don Quijote «disparaba» solo cuando el tema era la caballería andante; en cualquier otro asunto mostraba un juicio clarísimo. Esta fórmula, repetida por el narrador, es la clave del personaje: su locura es perfectamente delimitada y hace aún más paradójicos sus discursos de sentido común.`,
        },
        {
          fragmentId: fragConsejosII.id,
          type: "glosa",
          ...anchor(consejosIIText, "desceñido y flojo"),
          order: 2,
          content: `«Desceñido»: sin cinturón, con las ropas sueltas. En el siglo XVII, ir desceñido era señal de dejadez y falta de decoro. Don Quijote empieza los consejos personales por la imagen exterior: la ropa habla del carácter, y Sancho, futuro gobernador, debe proyectar autoridad también en su aspecto.`,
        },
        {
          fragmentId: fragConsejosII.id,
          type: "glosa",
          ...anchor(consejosIIText, "ajos ni cebollas"),
          order: 3,
          content: `El olor del ajo y la cebolla crudos delataba el origen campesino («villanería»). En la sociedad estamental del XVII, el aroma de los alimentos de los pobres estigmatizaba a quien los comía. El consejo de no comerlos es, de nuevo, un consejo sobre la gestión de las apariencias en una sociedad muy sensible al origen social.`,
        },
        {
          fragmentId: fragConsejosII.id,
          type: "glosa",
          ...anchor(consejosIIText, "la salud de todo el cuerpo se fragua en la oficina del estómago"),
          order: 4,
          content: `«Oficina»: taller, laboratorio (latín officina). La metáfora del estómago como «taller» donde se produce la salud proviene de la medicina galénica: el estómago «cocinaba» los alimentos y convertía el exceso o defecto en enfermedad. El consejo de comer poco sigue la dietética clásica que dominaba la medicina de la época.`,
        },
        {
          fragmentId: fragConsejosII.id,
          type: "glosa",
          ...anchor(consejosIIText, "erutar"),
          order: 5,
          content: `«Erutar» (del latín eructare): eructar. Don Quijote explica a Sancho que «regoldar» es una palabra vulgar y torpe, y que la gente culta usa «erutar» como préstamo del latín. Este pequeño episodio lingüístico es un microtratado de sociolingüística: muestra cómo el prestigio social hace que ciertos latinismos sustituyan a palabras populares más expresivas.`,
        },
        {
          fragmentId: fragConsejosII.id,
          type: "glosa",
          ...anchor(consejosIIText, "muchas veces los traes tan por los cabellos"),
          order: 6,
          content: `«Traer por los cabellos»: forzar, meter algo donde no viene a cuento, «traer a rastras». Sancho tiene la costumbre de usar refranes constantemente, pero a menudo sin que vengan al caso. Don Quijote le advierte que un refrán mal usado «parecen disparates»: la sabiduría popular mal aplicada se convierte en tontería.`,
        },

        // ── Contexto ────────────────────────────────────────────────────────
        {
          fragmentId: fragConsejosII.id,
          type: "contexto",
          ...anchor(consejosIIText, "solamente disparaba en tocándole en la caballería"),
          order: 1,
          content: `La paradoja central del Quijote —un loco que da los consejos más cuerdos— se enuncia explícitamente aquí. Cervantes construyó un personaje cuya locura funciona como un dispositivo retórico: permite decir verdades que un personaje «cuerdo» no podría decir sin resultar didáctico o moralista. Don Quijote puede criticar la corrupción, la injusticia o la hipocresía social porque es oficialmente un lunático.`,
        },
        {
          fragmentId: fragConsejosII.id,
          type: "contexto",
          ...anchor(consejosIIText, "enriquecer la lengua, sobre quien tiene poder el vulgo y el uso"),
          order: 2,
          content: `Esta frase es una declaración de lingüística avant la lettre. Don Quijote —y Cervantes— defiende que la lengua la crea el uso popular («el vulgo y el uso»), no la autoridad de los gramáticos ni el latín. En 1615, cuando se publicó la segunda parte, este era un debate activo: el latín seguía siendo la lengua del poder, pero el español se estaba imponiendo como lengua literaria y científica.`,
        },

        // ── Figuras ─────────────────────────────────────────────────────────
        {
          fragmentId: fragConsejosII.id,
          type: "figura",
          category: "tropo",
          ...anchor(consejosIIText, "a cada paso desacreditaban sus obras su juicio, y su juicio sus obras"),
          order: 1,
          content: `**Quiasmo y paradoja**: «sus obras desacreditaban su juicio / su juicio desacreditaba sus obras». La estructura en cruz (A desacredita B / B desacredita A) hace que cada elemento anule al otro: don Quijote razona bien pero actúa como loco, y actúa como loco pero razona bien. El quiasmo captura perfectamente la contradicción interna del personaje.`,
        },
        {
          fragmentId: fragConsejosII.id,
          type: "figura",
          category: "tropo",
          ...anchor(consejosIIText, "tendrás pajes para el cielo y para el suelo"),
          order: 2,
          content: `**Antítesis y paronomasia**: «cielo / suelo» son antónimos pero también casi parónimos (difieren en una sola sílaba). Don Quijote propone vestir a seis pajes: tres lujosos (para lucir ante el mundo) y tres pobres (para lucir ante Dios). La antítesis cielo/suelo comprime en dos palabras toda una visión de la responsabilidad social del poderoso.`,
        },

        // ── Preguntas ───────────────────────────────────────────────────────
        {
          fragmentId: fragConsejosII.id,
          type: "pregunta",
          questionGroup: "literal",
          order: 1,
          content: `¿Qué tres consejos sobre la alimentación da don Quijote a Sancho? ¿Cuál es el argumento que da para cada uno?`,
        },
        {
          fragmentId: fragConsejosII.id,
          type: "pregunta",
          questionGroup: "literal",
          order: 2,
          content: `¿Qué diferencia establece don Quijote entre «regoldar» y «erutar»? ¿Qué argumento usa para defender que usar la palabra latina enriquece la lengua?`,
        },
        {
          fragmentId: fragConsejosII.id,
          type: "pregunta",
          questionGroup: "interpretativo",
          order: 1,
          content: `El narrador dice que don Quijote «solamente disparaba en tocándole en la caballería». ¿Qué función tiene esta aclaración en la estructura del capítulo? ¿Cómo afecta a la manera en que el lector recibe los consejos que siguen?`,
        },
        {
          fragmentId: fragConsejosII.id,
          type: "pregunta",
          questionGroup: "valorativo",
          order: 1,
          content: `Don Quijote dice que el uso popular tiene poder sobre la lengua y que los términos nuevos (como «erutar») se irán entendiendo con el tiempo. ¿Estás de acuerdo con esa visión de cómo evoluciona el lenguaje? ¿Puedes pensar en palabras actuales que hayan pasado del uso informal al uso oficial?`,
        },
      ],
    });
  } // end if (!existsConsejosII)

  // ── FRAGMENTO 5: Cap. LXXIV - La muerte de don Quijote ───────────────────
  const existsMuerte = await prisma.fragment.findFirst({ where: { slug: "la-muerte-de-don-quijote" } });
  if (existsMuerte) { console.log("  skip la-muerte-de-don-quijote"); }
  else { console.log("Creando «La muerte de don Quijote»..."); }

  const fragMuerte = existsMuerte ?? await prisma.fragment.create({
    data: {
      slug: "la-muerte-de-don-quijote",
      title: "La muerte de don Quijote",
      location: "El ingenioso hidalgo don Quijote de la Mancha, 2ª parte, cap. LXXIV",
      headline: "Yo fui loco, y ya soy cuerdo; fui don Quijote de la Mancha, y soy agora Alonso Quijano el Bueno",
      text: muerteText,
      order: 6,
      status: "published",
      featured: false,
      workId: quijote.id,
      constellations: { connect: [{ slug: "muerte" }, { slug: "paso-del-tiempo" }] },
      topics: { connect: [{ slug: "desengano" }, { slug: "contemptus-mundi" }] },
      characters: { connect: [{ slug: "don-quijote" }, { slug: "sancho-panza" }] },
      artworkImageUrl: "/images/artworks/claesz-vanitas.jpg",
      artworkTitle: "Vanitas",
      artworkAuthor: "Pieter Claesz, h. 1630",
      artworkCaption:
        "La pintura vanitas pone ante los ojos del espectador la brevedad de la vida: el reloj, el cráneo, la vela que se apaga. Don Quijote muere lúcido y en paz, recuperado de su locura pero también vaciado de su sueño. El final del libro es una vanitas literaria: todo lo que soñó fue irreal; todo lo que fue real termina.",
    },
  });

  if (!existsMuerte) {
    console.log("Creando anotaciones de «La muerte de don Quijote»...");
    await prisma.annotation.createMany({
      data: [
        // ── Glosas ──────────────────────────────────────────────────────────
        {
          fragmentId: fragMuerte.id,
          type: "glosa",
          ...anchor(muerteText, "Dadme albricias"),
          order: 1,
          content: `«Albricias»: regalo o recompensa que se da al portador de una buena noticia. Decir «dadme albricias» equivale a «daos la enhorabuena» o «celebrad esto conmigo». La frase abre el capítulo con una aparente alegría: don Quijote recupera la razón. Pero la curación es, al mismo tiempo, una muerte —la del personaje que habíamos conocido.`,
        },
        {
          fragmentId: fragMuerte.id,
          type: "glosa",
          ...anchor(muerteText, "Amadís de Gaula y de toda la infinita caterva de su linaje"),
          order: 2,
          content: `«Caterva»: multitud desordenada, muchedumbre. La palabra tiene matiz despectivo: una caterva es una tropa confusa, no un ejército. Don Quijote usa esta palabra para referirse a todos los caballeros andantes de las novelas, que antes eran sus héroes y ahora son sus enemigos. El vocabulario ha cambiado de signo: antes «admirable», ahora «odiosa caterva».`,
        },
        {
          fragmentId: fragMuerte.id,
          type: "glosa",
          ...anchor(muerteText, "escarmentando en cabeza propia"),
          order: 3,
          content: `«Escarmentar en cabeza propia»: aprender a base de las propias equivocaciones (en contraposición a «escarmentar en cabeza ajena», aprender del error ajeno). Es un refrán que aquí adquiere peso dramático: don Quijote ha pagado con su vida el precio del aprendizaje. Su «cabeza» —su mente— fue el campo de batalla.`,
        },
        {
          fragmentId: fragMuerte.id,
          type: "glosa",
          ...anchor(muerteText, "en los nidos de antaño no hay pájaros hogaño"),
          order: 4,
          content: `Refrán clásico: lo que fue ya no es; el tiempo cambia todo. «Antaño»: el año pasado, en tiempos anteriores. «Hogaño»: este año, hoy. Don Quijote lo usa para cerrar definitivamente su identidad caballeresca: en los «nidos» de su locura ya no quedan los «pájaros» de sus aventuras. Es un adiós en forma de proverbio.`,
        },
        {
          fragmentId: fragMuerte.id,
          type: "glosa",
          ...anchor(muerteText, "la mayor locura que puede hacer un hombre en esta vida es dejarse morir, sin más ni más"),
          order: 5,
          content: `Sancho invierte los términos del discurso: si «locura» era antes el nombre de lo que hacía don Quijote, ahora Sancho llama «locura» a morirse. El escudero no tiene recursos filosóficos, pero sí tiene una sabiduría práctica: la vida, aunque imperfecta, vale más que la razón perfecta.`,
        },

        // ── Contexto ────────────────────────────────────────────────────────
        {
          fragmentId: fragMuerte.id,
          type: "contexto",
          ...anchor(muerteText, "nunca había leído en ningún libro de caballerías que algún caballero andante hubiese muerto en su lecho tan sosegadamente y tan cristiano como don Quijote"),
          order: 1,
          content: `Cervantes mata a don Quijote deliberadamente para impedir que otros autores continuasen la historia. En 1614, un escritor llamado Avellaneda publicó una Segunda Parte del Quijote apócrifa y mediocre, con personajes que seguían aventuras sin autorización de Cervantes. La muerte del protagonista en el capítulo LXXIV es también un acto de propiedad literaria: nadie más podría continuar la historia del verdadero don Quijote.`,
        },
        {
          fragmentId: fragMuerte.id,
          type: "contexto",
          ...anchor(muerteText, "ya conozco mi necedad y el peligro en que me pusieron haberlas leído"),
          order: 2,
          content: `La recuperación de la razón de don Quijote es ambivalente. Desde un punto de vista moralista (el que probablemente esperaba la Inquisición), la locura causada por los libros de caballerías se cura al renunciar a ellos. Pero desde el punto de vista del lector, algo se pierde con la cordura: el personaje que recupera la razón no es el mismo que conocíamos. «Don Quijote» muere cuando Alonso Quijano recupera el juicio.`,
        },

        // ── Figuras ─────────────────────────────────────────────────────────
        {
          fragmentId: fragMuerte.id,
          type: "figura",
          category: "sintaxis",
          ...anchor(muerteText, "yo fui loco, y ya soy cuerdo; fui don Quijote de la Mancha, y soy agora, como he dicho, Alonso Quijano el Bueno"),
          order: 1,
          content: `**Paralelismo y antítesis**: la frase se estructura en dos pares perfectamente paralelos: «fui loco / ya soy cuerdo» y «fui don Quijote / soy Alonso Quijano». El paralelismo crea simetría formal; la antítesis (loco/cuerdo; don Quijote/Quijano) crea el corte brusco entre dos vidas. Es una de las frases más memorables de la literatura española.`,
        },
        {
          fragmentId: fragMuerte.id,
          type: "figura",
          category: "tropo",
          ...anchor(muerteText, "en los nidos de antaño no hay pájaros hogaño"),
          order: 2,
          content: `**Refrán como epitafio**: don Quijote, que a lo largo de la novela ha corregido a Sancho por usar refranes «por los cabellos», usa aquí un refrán en su momento más solemne. La ironía es perfecta: el hidalgo culto adopta la sabiduría popular en el instante de la muerte. Es una reconciliación entre los dos mundos que representan amo y escudero.`,
        },
        {
          fragmentId: fragMuerte.id,
          type: "figura",
          category: "tropo",
          ...anchor(muerteText, "quiero decir que se murió"),
          order: 3,
          content: `**Bathos o anticlímax deliberado**: después de una larga escena de muerte con sacramentos, testamento y llanto colectivo, el narrador cierra con la frase más seca posible: «quiero decir que se murió». El contraste entre la solemnidad narrativa anterior y esta reducción brutal es la firma de Cervantes: el novelista que parodia el exceso retórico termina con la frase más desnuda del libro.`,
        },

        // ── Preguntas ───────────────────────────────────────────────────────
        {
          fragmentId: fragMuerte.id,
          type: "pregunta",
          questionGroup: "literal",
          order: 1,
          content: `¿Qué anuncia don Quijote al principio del capítulo? ¿Cómo reacciona Sancho ante la noticia de que su amo va a morir? ¿Qué le propone para convencerle de que siga viviendo?`,
        },
        {
          fragmentId: fragMuerte.id,
          type: "pregunta",
          questionGroup: "literal",
          order: 2,
          content: `¿Por qué don Quijote incluye en su testamento una mención al «autor» de la Segunda Parte apócrifa? ¿Qué le pide que haga?`,
        },
        {
          fragmentId: fragMuerte.id,
          type: "pregunta",
          questionGroup: "interpretativo",
          order: 1,
          content: `«Yo fui loco, y ya soy cuerdo; fui don Quijote de la Mancha, y soy agora Alonso Quijano el Bueno.» ¿Se puede ser «cuerdo» y «bueno» al mismo tiempo que se abandona el sueño? ¿La recuperación de la razón es un avance o una pérdida para el personaje?`,
        },
        {
          fragmentId: fragMuerte.id,
          type: "pregunta",
          questionGroup: "interpretativo",
          order: 2,
          content: `El narrador cierra el capítulo con «quiero decir que se murió». ¿Por qué crees que Cervantes elige una frase tan seca y anticlimática para el final de la novela? ¿Qué efecto produce sobre el lector?`,
        },
        {
          fragmentId: fragMuerte.id,
          type: "pregunta",
          questionGroup: "valorativo",
          order: 1,
          content: `Don Quijote muere curado de su locura pero ya sin su sueño. Sancho, en cambio, sigue creyendo en la posibilidad del ideal: le propone a su amo que se vistan de pastores y sigan soñando. ¿Con cuál de los dos te identificas más en ese final? ¿Qué dice el final de la novela sobre la relación entre idealismo y realidad?`,
        },
      ],
    });
  } // end if (!existsMuerte)

  console.log("\n✓ Fragmentos del Quijote añadidos correctamente.");
  console.log(`  - ${fragCapI.slug}`);
  console.log(`  - ${fragBatan.slug}`);
  console.log(`  - ${fragConsejosI.slug}`);
  console.log(`  - ${fragConsejosII.slug}`);
  console.log(`  - ${fragMuerte.slug}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
